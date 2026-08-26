# Phase 0 — 도달 가능성 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 오늘 링크를 열었을 때 빈 화면·유령 배지·깨진 칩이 나오는 상태를 없애고, 재설계 단계가 폭 계산에 쓸 실측값을 얻을 수 있게 만든다.

**Architecture:** 순수 로직을 `shared/cal-lib.js`(Node `require` + `window.CalLib` 이중 export)로 추출해 `node --test`로 TDD하고, 렌더 레이어는 그 함수를 호출하도록 배선한다. 렌더 변경은 브라우저 실측으로 검증한다. 의존성은 추가하지 않는다(playwright·package.json 없음).

**Tech Stack:** 바닐라 JS(ES2020), 정적 HTML, `node:test` + `node:assert`, GitHub Pages 배포.

**스펙:** `docs/site-ui-redesign-spec.md` §4 (Phase 0)

**이 계획의 범위:** 스펙 §4의 P0-1~P0-10 + §7.5 R3/S1/S4. 재설계(§5~§7.4, §7.6)는 **Plan 2**에서 다룬다 — 스펙 §6.2가 "Phase 0 재측정 후 확정"이라 지금 쓰면 플레이스홀더가 된다.

---

## 사전 확인

- [ ] **테스트 러너 동작 확인**

Run: `node --test "_workspace/_holdings/*.test.js"`
Expected: `pass 16`, `fail 0`

> Node 25에서는 `node --test <디렉토리>`가 동작하지 않는다. **glob 문자열을 따옴표로 감싸야** 한다.

- [ ] **로컬 서버 기동** (브라우저 검증용, 이후 태스크에서 계속 사용)

`.claude/launch.json`의 `site-public`(포트 8793, 루트 `_workspace/calendar`)을 쓴다.
Expected: `http://localhost:8793/calendar/` 접근 가능

---

## 파일 구조

| 파일 | 역할 | 신규/수정 |
|---|---|---|
| `shared/cal-lib.js` | 날짜·진입월·정렬·stale·비용분리 **순수 함수**. Node+브라우저 이중 export | **신규** |
| `_workspace/_tests/cal-lib.test.js` | 위 라이브러리 단위 테스트 (로컬 전용, 공개 repo 밖) | **신규** |
| `calendar/index.html` | 캘린더 — cal-lib 배선 + 렌더 수정 | 수정 |
| `timeline/index.html` | 타임라인 — KST·오버플로·stub 정렬·비용분리 | 수정 |
| `index.html` | 홈(지도) — site-nav 링크 | 수정 |
| `site-nav.js` | `<head>` 로드 대응 | 수정 |
| `.gitignore` (루트) | `_workspace/_holdings/` 추가 | 수정 |

**`_tests/`를 `_workspace/` 아래 로컬에 두는 이유:** 기존 관례를 따른다 — `holdings-lib.js`(공개 repo)의 테스트도 `_workspace/_holdings/`(로컬)에 있다. 공개 사이트에 `.test.js`가 배포되지 않는다.

---

### Task 1: cal-lib 골격 + `todayKST`

**Files:**
- Create: `shared/cal-lib.js`
- Create: `_workspace/_tests/cal-lib.test.js`

**왜:** 타임라인 `today()`가 `new Date().toISOString().slice(0,10)`이라 UTC 기준이다. KST 00:00~09:00(하루의 37.5%) 동안 전날을 반환한다. 캘린더의 `todayStr`(line 835)은 이미 로컬시각이라 정상이지만, 두 페이지가 같은 함수를 쓰게 통일한다.

- [ ] **Step 1: 실패하는 테스트 작성**

Create `_workspace/_tests/cal-lib.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const L = require('../calendar/shared/cal-lib.js');

// KST = UTC+9. 경계 3곳을 못박는다.
test('todayKST: KST 00:30 (= UTC 전날 15:30) 은 그날 날짜', () => {
  const ms = Date.UTC(2026, 7, 26, 15, 30); // UTC 08-26 15:30 = KST 08-27 00:30
  assert.strictEqual(L.todayKST(ms), '2026-08-27');
});

test('todayKST: KST 08:59 (= UTC 23:59) 은 아직 그날', () => {
  const ms = Date.UTC(2026, 7, 26, 23, 59); // KST 08-27 08:59
  assert.strictEqual(L.todayKST(ms), '2026-08-27');
});

test('todayKST: KST 09:01 (= UTC 00:01) 도 같은 날', () => {
  const ms = Date.UTC(2026, 7, 27, 0, 1); // KST 08-27 09:01
  assert.strictEqual(L.todayKST(ms), '2026-08-27');
});

test('todayKST: 월말 경계', () => {
  const ms = Date.UTC(2026, 7, 31, 15, 0); // KST 09-01 00:00
  assert.strictEqual(L.todayKST(ms), '2026-09-01');
});
```

- [ ] **Step 2: 실패 확인**

Run: `node --test "_workspace/_tests/*.test.js"`
Expected: FAIL — `Cannot find module '../calendar/shared/cal-lib.js'`

- [ ] **Step 3: 최소 구현**

Create `shared/cal-lib.js`:

```js
// 공유 순수함수 — Node(require)와 브라우저(window.CalLib) 양쪽.
// 부수효과 없음. 현재 시각이 필요한 함수는 인자로 받는다(테스트 결정성).
(function (factory) {
  const lib = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = lib;
  if (typeof window !== 'undefined') window.CalLib = lib;
})(function () {
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

  // UTC 밀리초 → KST 기준 'YYYY-MM-DD'.
  // toISOString()을 직접 쓰면 UTC 날짜가 되어 KST 00:00~09:00에 전날이 나온다.
  function todayKST(nowMs) {
    const ms = (nowMs == null) ? Date.now() : nowMs;
    return new Date(ms + KST_OFFSET_MS).toISOString().slice(0, 10);
  }

  return { todayKST: todayKST };
});
```

- [ ] **Step 4: 통과 확인**

Run: `node --test "_workspace/_tests/*.test.js"`
Expected: `pass 4`, `fail 0`

- [ ] **Step 5: 커밋**

```bash
cd _workspace/calendar && git add shared/cal-lib.js && git commit -m "feat(shared): cal-lib 신설 — KST 기준 todayKST"
```

> `_workspace/_tests/`는 git 저장소 밖이라 커밋 대상이 아니다.

---

### Task 2: `pickEntryMonth` — 진입 월 자동 이동

**Files:**
- Modify: `shared/cal-lib.js`
- Modify: `_workspace/_tests/cal-lib.test.js`

**왜:** 오늘(2026-08-26) 캘린더를 열면 2026년 8월이 뜨는데 데이터 최종 매각기일이 2026-07-29라 **칩이 0개**다. 스펙 §3.1.

**규칙:** ① 오늘의 달에 데이터가 있으면 그 달 → ② 없으면 **가장 가까운 미래** 달 → ③ 그것도 없으면 **가장 가까운 과거** 달 → ④ 데이터 자체가 없으면 `null`(호출부가 오늘 달 유지).

- [ ] **Step 1: 실패하는 테스트 추가**

Append to `_workspace/_tests/cal-lib.test.js`:

```js
test('pickEntryMonth: 오늘 달에 데이터가 있으면 그 달', () => {
  const dates = ['2026-08-10', '2026-07-29'];
  assert.deepStrictEqual(L.pickEntryMonth(dates, '2026-08-26'), { y: 2026, m: 7 });
});

test('pickEntryMonth: 오늘 달이 비면 가장 가까운 미래 달', () => {
  const dates = ['2026-07-29', '2026-10-05', '2026-12-01'];
  assert.deepStrictEqual(L.pickEntryMonth(dates, '2026-08-26'), { y: 2026, m: 9 });
});

test('pickEntryMonth: 미래가 없으면 가장 가까운 과거 달', () => {
  const dates = ['2026-05-12', '2026-06-03', '2026-07-29'];
  assert.deepStrictEqual(L.pickEntryMonth(dates, '2026-08-26'), { y: 2026, m: 6 });
});

test('pickEntryMonth: 데이터 없으면 null', () => {
  assert.strictEqual(L.pickEntryMonth([], '2026-08-26'), null);
});

test('pickEntryMonth: 빈 문자열·null 은 무시', () => {
  assert.deepStrictEqual(L.pickEntryMonth(['', null, '2026-07-29'], '2026-08-26'), { y: 2026, m: 6 });
});
```

> `m`은 **0-based**다. `state.currentMonth`가 `new Date().getMonth()`를 쓰므로 그 규약에 맞춘다.

- [ ] **Step 2: 실패 확인**

Run: `node --test "_workspace/_tests/*.test.js"`
Expected: FAIL — `L.pickEntryMonth is not a function`

- [ ] **Step 3: 구현**

`cal-lib.js`의 `return` 문 **앞에** 추가:

```js
  function monthKeyOf(dateStr) {
    return String(dateStr || '').slice(0, 7); // 'YYYY-MM'
  }

  function monthKeyToObj(key) {
    const y = Number(key.slice(0, 4));
    const m = Number(key.slice(5, 7)) - 1; // 0-based
    return { y: y, m: m };
  }

  // 데이터가 있는 달 중 오늘에 가장 가까운 달. 미래 우선, 없으면 과거.
  function pickEntryMonth(saleDates, todayStr) {
    const keys = [];
    const seen = new Set();
    for (const d of (saleDates || [])) {
      const k = monthKeyOf(d);
      if (k.length !== 7 || seen.has(k)) continue;
      seen.add(k);
      keys.push(k);
    }
    if (!keys.length) return null;
    keys.sort();
    const todayKey = monthKeyOf(todayStr);
    if (seen.has(todayKey)) return monthKeyToObj(todayKey);
    const future = keys.find((k) => k > todayKey);
    if (future) return monthKeyToObj(future);
    return monthKeyToObj(keys[keys.length - 1]);
  }
```

`return` 문을 교체:

```js
  return { todayKST: todayKST, monthKeyOf: monthKeyOf, pickEntryMonth: pickEntryMonth };
```

- [ ] **Step 4: 통과 확인**

Run: `node --test "_workspace/_tests/*.test.js"`
Expected: `pass 9`, `fail 0`

- [ ] **Step 5: 커밋**

```bash
cd _workspace/calendar && git add shared/cal-lib.js && git commit -m "feat(shared): pickEntryMonth — 데이터 있는 가장 가까운 달"
```

---

### Task 3: `monthOfCase` — 딥링크가 달을 옮기게

**Files:**
- Modify: `shared/cal-lib.js`
- Modify: `_workspace/_tests/cal-lib.test.js`

**왜:** `applyUrl()`(index.html:1614)이 `state.selectedId`만 설정하고 `state.currentMonth`는 건드리지 않는다. `?case=2024타경119033`(매각일 2026-07-09)을 열면 패널은 열리는데 그리드는 8월(빈 화면)이다. 스펙 B3.

- [ ] **Step 1: 실패하는 테스트 추가**

```js
test('monthOfCase: 사건의 saleDate 가 속한 달', () => {
  const cases = [
    { id: '2024타경119033', saleDate: '2026-07-09' },
    { id: '2025타경501928', saleDate: '2026-05-20' },
  ];
  assert.deepStrictEqual(L.monthOfCase(cases, '2024타경119033'), { y: 2026, m: 6 });
});

test('monthOfCase: 없는 id 는 null', () => {
  assert.strictEqual(L.monthOfCase([{ id: 'a', saleDate: '2026-07-09' }], 'zzz'), null);
});

test('monthOfCase: saleDate 없는 사건은 null', () => {
  assert.strictEqual(L.monthOfCase([{ id: 'a' }], 'a'), null);
});
```

- [ ] **Step 2: 실패 확인**

Run: `node --test "_workspace/_tests/*.test.js"`
Expected: FAIL — `L.monthOfCase is not a function`

- [ ] **Step 3: 구현**

`cal-lib.js`에 추가하고 `return`에 등록:

```js
  function monthOfCase(cases, caseId) {
    for (const c of (cases || [])) {
      if (c && c.id === caseId) {
        const k = monthKeyOf(c.saleDate);
        return k.length === 7 ? monthKeyToObj(k) : null;
      }
    }
    return null;
  }
```

```js
  return {
    todayKST: todayKST, monthKeyOf: monthKeyOf,
    pickEntryMonth: pickEntryMonth, monthOfCase: monthOfCase,
  };
```

- [ ] **Step 4: 통과 확인**

Run: `node --test "_workspace/_tests/*.test.js"`
Expected: `pass 12`, `fail 0`

- [ ] **Step 5: 커밋**

```bash
cd _workspace/calendar && git add shared/cal-lib.js && git commit -m "feat(shared): monthOfCase — 딥링크 달 이동용"
```

---

### Task 4: `sortByRating` — 칸 내부 정렬

**Files:**
- Modify: `shared/cal-lib.js`
- Modify: `_workspace/_tests/cal-lib.test.js`

**왜:** `renderCalendar`의 `byDate.get(c.saleDate).push(c)`(index.html:1352)가 `getFiltered()` 순회 순서 = `cases.js` 배열 삽입 순서다. 정렬이 전혀 없어서 `+N건`으로 **잘리는 게 최고 물건일 수 있다.** 스펙 B4 — UI 문제가 아니라 정보 손실이다.

- [ ] **Step 1: 실패하는 테스트 추가**

```js
test('sortByRating: 별점 내림차순, 무등급은 뒤로', () => {
  const list = [
    { id: 'a', r: 2 }, { id: 'b', r: null }, { id: 'c', r: 5 }, { id: 'd', r: 3 },
  ];
  const out = L.sortByRating(list, (c) => c.r);
  assert.deepStrictEqual(out.map((c) => c.id), ['c', 'd', 'a', 'b']);
});

test('sortByRating: 동점이면 원래 순서 유지(안정 정렬)', () => {
  const list = [{ id: 'a', r: 3 }, { id: 'b', r: 3 }, { id: 'c', r: 3 }];
  const out = L.sortByRating(list, (c) => c.r);
  assert.deepStrictEqual(out.map((c) => c.id), ['a', 'b', 'c']);
});

test('sortByRating: 원본 배열을 변형하지 않는다', () => {
  const list = [{ id: 'a', r: 1 }, { id: 'b', r: 5 }];
  L.sortByRating(list, (c) => c.r);
  assert.deepStrictEqual(list.map((c) => c.id), ['a', 'b']);
});
```

- [ ] **Step 2: 실패 확인**

Run: `node --test "_workspace/_tests/*.test.js"`
Expected: FAIL — `L.sortByRating is not a function`

- [ ] **Step 3: 구현**

```js
  // 별점 내림차순. 무등급(null/undefined)은 항상 뒤. 동점은 입력 순서 유지.
  // 원본을 변형하지 않는다 — 호출부가 같은 배열을 재사용한다.
  function sortByRating(list, ratingOf) {
    return (list || []).slice().sort((a, b) => {
      const ra = ratingOf(a), rb = ratingOf(b);
      const va = (ra == null) ? -1 : ra;
      const vb = (rb == null) ? -1 : rb;
      return vb - va;
    });
  }
```

`return`에 `sortByRating: sortByRating` 추가.

> `Array.prototype.sort`는 ES2019부터 안정 정렬이 보장된다. Node 25·모든 현행 브라우저에서 동점 순서가 유지된다.

- [ ] **Step 4: 통과 확인**

Run: `node --test "_workspace/_tests/*.test.js"`
Expected: `pass 15`, `fail 0`

- [ ] **Step 5: 커밋**

```bash
cd _workspace/calendar && git add shared/cal-lib.js && git commit -m "feat(shared): sortByRating — 칸 내부 별점 내림차순"
```

---

### Task 5: `staleDays` — 데이터 신선도

**Files:**
- Modify: `shared/cal-lib.js`
- Modify: `_workspace/_tests/cal-lib.test.js`

**왜:** `data-updated`가 "2026-07-08"을 그대로 찍는다(index.html:1192). 오늘 기준 49일 전인데 화면에 경고가 없다. 스펙 B7.

- [ ] **Step 1: 실패하는 테스트 추가**

```js
test('staleDays: 경과 일수', () => {
  assert.strictEqual(L.staleDays('2026-07-08', '2026-08-26'), 49);
});

test('staleDays: 같은 날은 0', () => {
  assert.strictEqual(L.staleDays('2026-08-26', '2026-08-26'), 0);
});

test('staleDays: 미래 갱신일은 0 으로 클램프', () => {
  assert.strictEqual(L.staleDays('2026-09-01', '2026-08-26'), 0);
});

test('staleDays: 값 없으면 null', () => {
  assert.strictEqual(L.staleDays('', '2026-08-26'), null);
  assert.strictEqual(L.staleDays(null, '2026-08-26'), null);
});

test('staleDays: 파싱 불가 문자열은 null', () => {
  assert.strictEqual(L.staleDays('미상', '2026-08-26'), null);
});
```

- [ ] **Step 2: 실패 확인**

Run: `node --test "_workspace/_tests/*.test.js"`
Expected: FAIL — `L.staleDays is not a function`

- [ ] **Step 3: 구현**

```js
  const DAY_MS = 24 * 60 * 60 * 1000;
  const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

  // 갱신일로부터 오늘까지 경과 일수. 미래면 0, 파싱 불가·빈값이면 null.
  function staleDays(updatedStr, todayStr) {
    if (!updatedStr || !DATE_RE.test(String(updatedStr))) return null;
    if (!todayStr || !DATE_RE.test(String(todayStr))) return null;
    const a = Date.parse(updatedStr + 'T00:00:00Z');
    const b = Date.parse(todayStr + 'T00:00:00Z');
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
    return Math.max(0, Math.round((b - a) / DAY_MS));
  }
```

`return`에 `staleDays: staleDays` 추가.

- [ ] **Step 4: 통과 확인**

Run: `node --test "_workspace/_tests/*.test.js"`
Expected: `pass 20`, `fail 0`

- [ ] **Step 5: 커밋**

```bash
cd _workspace/calendar && git add shared/cal-lib.js && git commit -m "feat(shared): staleDays — 데이터 신선도 계산"
```

---

### Task 6: `splitCosts` — 집행분 / 예정분 분리

**Files:**
- Modify: `shared/cal-lib.js`
- Modify: `_workspace/_tests/cal-lib.test.js`

**왜:** 타임라인 `costTotal()`(holdings-lib.js:33)이 날짜를 보지 않고 `costs`를 전부 더한다. 오늘 이후 날짜의 **예정 이자**가 "누적지출"에 섞인다. 스펙 T3.

**스키마:** `costs[i] = { entryId, idemKey, category, amount, direction, occurredAt, memo }`. `direction`이 `'in'`이면 부호 −1(환급), 그 외 +1(지출) — `costTotal`과 동일 규약.

- [ ] **Step 1: 실패하는 테스트 추가**

```js
test('splitCosts: occurredAt 기준으로 집행/예정 분리', () => {
  const costs = [
    { amount: 1000, direction: 'out', occurredAt: '2026-08-01' },
    { amount: 2000, direction: 'out', occurredAt: '2026-08-26' }, // 오늘 = 집행
    { amount: 500,  direction: 'out', occurredAt: '2026-08-31' }, // 미래 = 예정
  ];
  assert.deepStrictEqual(L.splitCosts(costs, '2026-08-26'), { executed: 3000, planned: 500 });
});

test('splitCosts: direction=in 은 부호 반전(환급)', () => {
  const costs = [
    { amount: 1000, direction: 'out', occurredAt: '2026-08-01' },
    { amount: 300,  direction: 'in',  occurredAt: '2026-08-02' },
  ];
  assert.deepStrictEqual(L.splitCosts(costs, '2026-08-26'), { executed: 700, planned: 0 });
});

test('splitCosts: occurredAt 없으면 집행분으로 간주(보수적)', () => {
  const costs = [{ amount: 400, direction: 'out' }];
  assert.deepStrictEqual(L.splitCosts(costs, '2026-08-26'), { executed: 400, planned: 0 });
});

test('splitCosts: 빈 배열·undefined 안전', () => {
  assert.deepStrictEqual(L.splitCosts([], '2026-08-26'), { executed: 0, planned: 0 });
  assert.deepStrictEqual(L.splitCosts(undefined, '2026-08-26'), { executed: 0, planned: 0 });
});

test('splitCosts: executed+planned 는 costTotal 과 일치', () => {
  const costs = [
    { amount: 1000, direction: 'out', occurredAt: '2026-08-01' },
    { amount: 500,  direction: 'out', occurredAt: '2026-08-31' },
    { amount: 200,  direction: 'in',  occurredAt: '2026-08-05' },
  ];
  const r = L.splitCosts(costs, '2026-08-26');
  const total = costs.reduce((s, e) => s + (e.direction === 'in' ? -1 : 1) * e.amount, 0);
  assert.strictEqual(r.executed + r.planned, total);
});
```

- [ ] **Step 2: 실패 확인**

Run: `node --test "_workspace/_tests/*.test.js"`
Expected: FAIL — `L.splitCosts is not a function`

- [ ] **Step 3: 구현**

```js
  // 비용 원장을 오늘 기준 집행분/예정분으로 나눈다.
  // 부호 규약은 holdings-lib.costTotal 과 동일(direction 'in' = 환급 = 음수).
  // occurredAt 이 없으면 집행분으로 센다 — 과대계상보다 누락이 낫다는 판단.
  function splitCosts(costs, todayStr) {
    let executed = 0, planned = 0;
    for (const e of (costs || [])) {
      const sign = (e && e.direction === 'in') ? -1 : 1;
      const amt = sign * (Number(e && e.amount) || 0);
      const at = e && e.occurredAt;
      if (at && DATE_RE.test(String(at)) && String(at) > String(todayStr)) planned += amt;
      else executed += amt;
    }
    return { executed: executed, planned: planned };
  }
```

`return`에 `splitCosts: splitCosts` 추가.

- [ ] **Step 4: 통과 확인**

Run: `node --test "_workspace/_tests/*.test.js"`
Expected: `pass 25`, `fail 0`

- [ ] **Step 5: 커밋**

```bash
cd _workspace/calendar && git add shared/cal-lib.js && git commit -m "feat(shared): splitCosts — 집행분/예정분 분리"
```

---

### Task 7: 캘린더 배선 — cal-lib 로드 + 진입 월 + 딥링크

**Files:**
- Modify: `calendar/index.html` (head, `applyUrl` ~1614, Init ~2561)

**왜:** P0-1, P0-2.

- [ ] **Step 1: cal-lib 로드**

`calendar/index.html`의 `<head>` 안, `</style>` 바로 다음 줄(625행 근처)에 추가:

```html
<script src="../shared/cal-lib.js"></script>
```

> 데이터 로더(`cases.js` 등)와 달리 cache-buster가 필요 없다 — 로직 파일은 배포 시 함께 갱신된다.

- [ ] **Step 2: `applyUrl`이 달을 옮기게 수정**

`function applyUrl()`(~1614)의 본문을 교체:

```js
  function applyUrl() {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (v === 'list' || v === 'calendar') state.view = v;
    const id = params.get('case');
    if (id) {
      state.selectedId = id;
      // 딥링크는 그 사건의 매각기일이 있는 달을 보여준다.
      // (없으면 currentMonth 유지 — 아래 Init의 진입월 로직이 처리)
      const mo = window.CalLib.monthOfCase(CASES, id);
      if (mo) state.currentMonth = mo;
    }
  }
```

- [ ] **Step 3: Init에서 진입 월 결정**

`// ===== Init =====` 블록(~2561)에서 `applyUrl();` **바로 앞에** 추가:

```js
  // 진입 월 — 데이터가 있는 가장 가까운 달. 딥링크가 있으면 applyUrl이 덮어쓴다.
  {
    const entry = window.CalLib.pickEntryMonth(CASES.map((c) => c.saleDate), todayStr);
    if (entry) state.currentMonth = entry;
  }
```

- [ ] **Step 4: 브라우저 검증 — 진입 월**

1. `http://localhost:8793/calendar/` 로드 (파라미터 없이)
2. 콘솔에서:

```js
JSON.stringify({
  month: document.getElementById('month-label').textContent,
  chips: document.querySelectorAll('.chip').length
})
```

Expected: `month`가 `"2026년 7월"`(데이터 최종월), `chips` ≥ 1
Before: `"2026년 8월"`, `chips: 0`

- [ ] **Step 5: 브라우저 검증 — 딥링크**

1. `http://localhost:8793/calendar/?case=2024타경119033` 로드
2. 콘솔에서:

```js
document.getElementById('month-label').textContent
```

Expected: `"2026년 7월"` (해당 사건 saleDate 2026-07-09)
Before: `"2026년 8월"`

- [ ] **Step 6: 커밋**

```bash
cd _workspace/calendar && git add calendar/index.html && git commit -m "fix(calendar): 진입 월을 데이터 있는 달로, 딥링크가 달을 이동"
```

---

### Task 8: 캘린더 — 유령 D-Day 배지 제거

**Files:**
- Modify: `calendar/index.html:1372-1374`

**왜:** `dCls`를 `dateRow`에 붙일 때 그 칸의 사건 수를 보지 않는다. 오늘 기준 사건 0개인 칸 5곳(D-DAY, D-1, D-5, D-6, D-7)에 pulse 배지가 렌더된다. **화면에서 채도가 가장 높은 요소가 아무것도 가리키지 않는다.** 스펙 B2.

- [ ] **Step 1: `cases`를 배지보다 먼저 계산하도록 순서 변경**

현재 순서는 `dateRow` → 배지 → `chipsWrap` → `cases`다. `cases`를 앞으로 올린다.

`renderCalendar` 안에서 아래 블록을 찾는다(~1370):

```js
      const dateRow = el('div', { cls: 'date-row' });
      dateRow.appendChild(el('div', { cls: 'date-num', text: String(dateObj.getDate()) }));
      const days = daysUntil(dateStr);
      const dCls = ddayClass(days);
      if (dCls) dateRow.appendChild(el('span', { cls: 'dday-badge ' + dCls, text: ddayLabel(days) }));
      dayCell.appendChild(dateRow);

      const chipsWrap = el('div', { cls: 'chips' });
      const cases = byDate.get(dateStr) || [];
```

교체:

```js
      // 이 칸의 사건 목록을 먼저 구한다 — D-Day 배지가 사건 유무에 의존하므로.
      const cases = window.CalLib.sortByRating(byDate.get(dateStr) || [], effectiveRating);

      const dateRow = el('div', { cls: 'date-row' });
      dateRow.appendChild(el('div', { cls: 'date-num', text: String(dateObj.getDate()) }));
      const days = daysUntil(dateStr);
      const dCls = ddayClass(days);
      // 사건이 있는 칸에만 D-Day 배지. 빈 칸의 배지는 아무것도 가리키지 않는다.
      if (dCls && cases.length) {
        dateRow.appendChild(el('span', { cls: 'dday-badge ' + dCls, text: ddayLabel(days) }));
      }
      dayCell.appendChild(dateRow);

      const chipsWrap = el('div', { cls: 'chips' });
```

> 이 한 번의 교체로 **P0-3(유령 배지)과 P0-8(별점 정렬)이 함께 해결된다.** `cases`가 이미 정렬된 상태로 아래 `appendChip` 루프와 `+N건` 계산에 쓰인다.

- [ ] **Step 2: 브라우저 검증 — 유령 배지**

1. `http://localhost:8793/calendar/` 로드
2. 콘솔에서:

```js
[...document.querySelectorAll('.dday-badge')]
  .map(b => ({ txt: b.textContent, cases: b.closest('.day').querySelectorAll('.chip').length }))
```

Expected: 모든 항목의 `cases` ≥ 1 (배지가 0개여도 통과)
Before: `[{txt:"D-DAY",cases:0},{txt:"D-1",cases:0},{txt:"D-5",cases:0},{txt:"D-6",cases:0},{txt:"D-7",cases:0}]`

- [ ] **Step 3: 브라우저 검증 — 정렬**

1. 2026년 5월로 이동: 콘솔에서 `document.getElementById('prev-month').click()` 반복
2. 사건이 여러 건인 칸 하나에서:

```js
(() => {
  const cell = [...document.querySelectorAll('.day')].find(d => d.querySelectorAll('.chip').length > 2);
  return [...cell.querySelectorAll('.chip-rating')].map(r => r.textContent);
})()
```

Expected: 내림차순 (`·`/무등급은 뒤). 예 `["4","2","2","·"]`
Before: 삽입 순서라 뒤죽박죽

- [ ] **Step 4: 커밋**

```bash
cd _workspace/calendar && git add calendar/index.html && git commit -m "fix(calendar): 빈 칸 D-Day 배지 제거 + 칸 내부 별점 내림차순 정렬"
```

---

### Task 9: 캘린더 — 칩 4자식 → 3자식 (2줄 깨짐 수정)

**Files:**
- Modify: `calendar/index.html` (~1395-1405, `appendChip` 내부)

**왜:** `.chip`은 `grid-template-columns: 22px 1fr auto`(3열)인데 자식이 `rating` + `chip-text` + `trail` + `mini` **4개**다. `trail`이 붙는 칩은 `mini`가 2행으로 밀려 높이가 32px → **50px**이 된다. 2026년 5월 20개 중 **15개**가 깨져 있다. v0.5.0이 `chip-trail`을 도입해 절반만 고쳤다. 스펙 B1.

- [ ] **Step 1: 현재 상태 기록 (Before)**

1. `http://localhost:8793/calendar/` → 2026년 5월로 이동
2. 콘솔에서:

```js
(() => {
  const cs = [...document.querySelectorAll('.chip')];
  const h = {}, k = {};
  cs.forEach(c => {
    const hh = Math.round(c.getBoundingClientRect().height);
    h[hh] = (h[hh] || 0) + 1;
    k[c.children.length] = (k[c.children.length] || 0) + 1;
  });
  return JSON.stringify({ total: cs.length, heights: h, childCounts: k });
})()
```

Expected(Before): `{"total":20,"heights":{"32":5,"50":15},"childCounts":{"3":5,"4":15}}`

- [ ] **Step 2: `mini`를 `trail` 안으로 병합**

`appendChip` 안에서 아래를 찾는다:

```js
        if (trail.childNodes.length) chip.appendChild(trail);
```

이 줄을 **삭제**한다. 그리고 함수 끝의

```js
        chip.appendChild(mini);
```

를 다음으로 교체:

```js
        // mini(가격·마진바)를 trail에 합쳐 칩 자식을 3개로 유지한다.
        // .chip 은 grid 3열(22px 1fr auto)이라 자식이 4개면 4번째가 2행으로 밀린다.
        while (mini.firstChild) trail.appendChild(mini.firstChild);
        chip.appendChild(trail);
```

- [ ] **Step 3: `.chip-trail`이 가로 정렬을 유지하는지 CSS 확인**

`index.html`의 `.chip .chip-trail` 규칙(~107행)이 이미 다음과 같은지 확인:

```css
.chip .chip-trail { display: flex; align-items: center; gap: 3px; min-width: 0; }
```

`gap: 3px`이면 가격과 배지가 붙어 보일 수 있으므로 다음으로 교체:

```css
.chip .chip-trail { display: flex; align-items: center; gap: 5px; min-width: 0; flex-shrink: 0; }
```

- [ ] **Step 4: 브라우저 검증 (After)**

Step 1의 스니펫을 다시 실행.

Expected(After): `childCounts`가 `{"3":20}`이고 `heights`의 **키가 하나뿐**(= 전부 같은 높이 = 전부 1줄).
실측값은 `{"total":20,"heights":{"32":20},"childCounts":{"3":20}}`.

> **32px가 단일 행의 정상 높이다.** 별점 원 22px + 상하 패딩 4+4 + 테두리 2 = 32. 기준은 '≤26px'가 아니라 **'높이 종류가 1가지'**다.

- [ ] **Step 5: 그리드 높이 재측정 (Plan 2가 쓸 값)**

```js
Math.round(document.getElementById('calendar').getBoundingClientRect().height)
```

Expected: Before 1179px에서 **유의미하게 감소**. 값을 기록한다 — Plan 2의 §6.2 폭 계산 입력값이다.

- [ ] **Step 6: 커밋**

```bash
cd _workspace/calendar && git add calendar/index.html && git commit -m "fix(calendar): 칩 자식 4→3 — grid 3열 초과로 인한 2줄 깨짐 해소"
```

---

### Task 10: 캘린더 — 빈 상태 + stale 배지

**Files:**
- Modify: `calendar/index.html` (CSS ~620, `renderCalendar` 끝, `updateStats` ~1192)

**왜:** P0-4, P0-5. 진입 월 자동 이동(Task 7)으로 빈 화면은 줄지만, 사용자가 빈 달로 이동하면 여전히 아무 안내가 없다. 그리고 데이터가 49일 지났는데 경고가 없다.

- [ ] **Step 1: CSS 추가**

`</style>` 바로 앞에 추가:

```css
  .cal-empty { padding: 48px 20px; text-align: center; color: var(--text-dim); line-height: 1.7; }
  .cal-empty b { color: var(--text); }
  .cal-empty .hint { display: block; margin-top: 10px; font-size: 12px; color: var(--text-mute); }
  .stale-badge { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px;
                 background: var(--surface-3); color: var(--text-dim); margin-left: 6px; }
  .stale-badge.warn { background: #fef3c7; color: #92400e; }
```

- [ ] **Step 2: `renderCalendar` 끝에 빈 상태 렌더**

`renderCalendar()` 함수의 마지막(`for` 루프가 끝난 뒤, 함수 `}` 직전)에 추가:

```js
    // 이 달에 표시할 사건이 하나도 없으면 안내를 띄운다.
    if (!byDate.size) {
      const all = CASES.map((c) => c.saleDate).filter(Boolean).sort();
      const cal2 = document.getElementById('calendar');
      const note = el('div', { cls: 'cal-empty' });
      note.appendChild(el('div', { html: '이 달에는 매각기일이 없습니다.' }));
      if (all.length) {
        const from = all[0].slice(0, 7).replace('-', '년 ') + '월';
        const to = all[all.length - 1].slice(0, 7).replace('-', '년 ') + '월';
        note.appendChild(el('span', {
          cls: 'hint',
          text: `데이터가 있는 기간: ${from} ~ ${to} · 총 ${CASES.length}건`,
        }));
      } else {
        note.appendChild(el('span', { cls: 'hint', text: '아직 수집된 사건이 없습니다.' }));
      }
      cal2.replaceChildren(note);
      cal2.style.gridTemplateColumns = '1fr';
    }
```

> `byDate`는 `getFiltered()` 결과이므로, 필터 때문에 비었을 때도 같은 안내가 나온다. 이는 의도된 동작이다 — 사용자가 "왜 비었지"를 묻는 상황이 동일하다.

- [ ] **Step 3: stale 배지**

`updateStats()`에서 아래 줄(~1192)을 찾는다:

```js
    document.getElementById('data-updated').textContent = window.AUCTION_LAST_UPDATED || '—';
```

교체:

```js
    {
      const upd = window.AUCTION_LAST_UPDATED || '';
      const slot = document.getElementById('data-updated');
      slot.replaceChildren(document.createTextNode(upd || '—'));
      const n = window.CalLib.staleDays(upd, todayStr);
      if (n != null) {
        const b = el('span', { cls: 'stale-badge' + (n > 30 ? ' warn' : ''), text: `${n}일 전` });
        slot.appendChild(b);
      }
    }
```

- [ ] **Step 4: 브라우저 검증**

1. `http://localhost:8793/calendar/` 로드
2. stale 배지:

```js
document.querySelector('.stale-badge')?.outerHTML
```

Expected: `<span class="stale-badge warn">49일 전</span>` (일수는 오늘 기준으로 달라짐, `warn` 클래스가 붙어야 함)

3. 빈 상태 — 2026년 8월로 이동 후:

```js
(() => {
  const b = document.getElementById('next-month');
  while (document.getElementById('month-label').textContent !== '2026년 8월') b.click();
  return document.querySelector('.cal-empty')?.textContent.trim();
})()
```

Expected: `"이 달에는 매각기일이 없습니다.데이터가 있는 기간: 2026년 05월 ~ 2026년 07월 · 총 76건"` 형태

- [ ] **Step 5: 커밋**

```bash
cd _workspace/calendar && git add calendar/index.html && git commit -m "feat(calendar): 빈 달 안내 + 데이터 신선도 배지"
```

---

### Task 11: 홈(지도) — 사이트 내비 연결

**Files:**
- Modify: `index.html` (홈·지도)
- Modify: `site-nav.js`
- Modify: `calendar/index.html:2583`
- Modify: `timeline/index.html:50`

**왜:** `site-nav.js`가 `calendar/`·`timeline/`에만 로드된다. GitHub Pages 루트(=지도)에 캘린더 링크가 없어 **막다른 길**이다. 게다가 `</body>` 직전에 로드돼 body 맨 위에 주입되므로 로드 후 레이아웃 점프가 생긴다. 스펙 B5.

- [ ] **Step 1: `site-nav.js`가 홈에서도 동작하도록 경로 처리**

현재 `links`의 `href`가 `'../'`, `'../calendar/'`, `'../timeline/'`로 **하위 페이지 기준 상대경로**다. 홈(루트)에서는 틀린다. `site-nav.js`의 `links` 정의를 교체:

```js
  var atRoot = active === '';
  var base = atRoot ? './' : '../';
  var links = [
    { key: '',         label: '홈',      href: base },
    { key: 'calendar', label: '캘린더',   href: base + 'calendar/' },
    { key: 'timeline', label: '타임라인', href: base + 'timeline/' }
  ];
```

> 이모지(🏠📅📈)는 제거한다. 11px 렌더 시 판독이 어렵고 플랫폼마다 그림이 달라 통제가 안 된다(스펙 §5.3). SVG 아이콘 도입은 Plan 2 범위다.

- [ ] **Step 2: `<head>` 로드에 대응**

`site-nav.js` 마지막의 주입 코드를 교체:

```js
  function inject() {
    var nav = document.createElement('nav'); nav.className = 'site-nav';
    nav.innerHTML = links.map(function (l) {
      return '<a href="' + l.href + '"' + (l.key === active ? ' class="active"' : '') + '>' + l.label + '</a>';
    }).join('');
    document.body.insertBefore(nav, document.body.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
```

> `<head>`에서 로드되면 실행 시점에 `document.body`가 없다. `DOMContentLoaded`를 기다려야 한다. 스타일은 즉시 주입되므로(위쪽 `appendChild(style)`) FOUC가 없다.

- [ ] **Step 3: 세 페이지의 로드 위치 변경**

`calendar/index.html`의 마지막 `<script src="../site-nav.js"></script>`(2583행)를 **삭제**하고, `<head>`의 `<script src="../shared/cal-lib.js"></script>` 다음 줄에 추가:

```html
<script src="../site-nav.js" defer></script>
```

`timeline/index.html`의 `<script src="../site-nav.js"></script>`(50행)도 동일하게 `<head>`로 이동(`defer` 추가).

홈 `index.html`의 `</head>` 바로 앞에 추가:

```html
<script src="./site-nav.js" defer></script>
```

- [ ] **Step 4: 브라우저 검증**

각 URL에서 콘솔 실행:

```js
[...document.querySelectorAll('.site-nav a')].map(a => a.textContent + '→' + a.getAttribute('href'))
```

| URL | Expected |
|---|---|
| `http://localhost:8793/` | `["홈→./","캘린더→./calendar/","타임라인→./timeline/"]` |
| `http://localhost:8793/calendar/` | `["홈→../","캘린더→../calendar/","타임라인→../timeline/"]` |
| `http://localhost:8793/timeline/` | 동일 (타임라인이 `active`) |

그리고 각 링크를 실제로 클릭해 404가 나지 않는지 확인한다.

- [ ] **Step 5: 커밋**

```bash
cd _workspace/calendar && git add site-nav.js index.html calendar/index.html timeline/index.html \
  && git commit -m "fix(nav): 홈에 사이트 내비 연결 + head 로드로 레이아웃 점프 제거"
```

---

### Task 12: 타임라인 — KST 날짜 + 비용 분리

**Files:**
- Modify: `timeline/index.html:95` (`today()`)
- Modify: `timeline/index.html` (누적지출 렌더부)

**왜:** T4(UTC 버그), T3(미래 비용이 집행액에 섞임).

- [ ] **Step 1: cal-lib 로드**

`timeline/index.html`의 `<head>`, `</style>` 다음 줄에 추가:

```html
<script src="../shared/cal-lib.js"></script>
```

- [ ] **Step 2: `today()` 교체**

95행:

```js
  function today() { return new Date().toISOString().slice(0, 10); }
```

교체:

```js
  // KST 기준. toISOString()은 UTC라 KST 00:00~09:00에 전날을 반환한다.
  function today() { return window.CalLib.todayKST(); }
```

- [ ] **Step 3: 누적지출을 집행/예정으로 분리 (3개소)**

`L.costTotal(h)`는 세 곳에서 쓰인다. 금액 포맷 헬퍼는 `won(n)`이고, KV는 헬퍼 함수 없이 **HTML 문자열로 조립**된다.

**(a) 목록 카드 요약 — 120행**

```js
          '<div class="sub">' + badge + ' · 누적지출 ' + won(L.costTotal(h)) + '</div>';
```

교체:

```js
          '<div class="sub">' + badge + ' · 집행지출 ' + won(window.CalLib.splitCosts(h.costs, today()).executed) + '</div>';
```

**(b) 실현손익 — 173행**

```js
      var realized = h.disposition === 'sold' ? won((f.wonPrice != null && h.resalePrice != null) ? (h.resalePrice - f.wonPrice - L.costTotal(h)) : null) + ' <span style="font-size:11px;color:var(--text-mute)">(세전·잠정)</span>' : '매도 전 (미정)';
```

교체 (실현손익은 **집행분만** 반영한다 — "실현"의 정의상 미집행 비용을 빼면 안 된다):

```js
      var execTotal = window.CalLib.splitCosts(h.costs, today()).executed;
      var realized = h.disposition === 'sold' ? won((f.wonPrice != null && h.resalePrice != null) ? (h.resalePrice - f.wonPrice - execTotal) : null) + ' <span style="font-size:11px;color:var(--text-mute)">(세전·잠정)</span>' : '매도 전 (미정)';
```

**(c) 손익 KV — 184행**

```js
          '<div class="kv"><div class="l">누적지출</div><div class="v" style="color:var(--price)">' + won(L.costTotal(h)) + '</div></div>' +
```

교체:

```js
          '<div class="kv"><div class="l">집행 지출</div><div class="v" style="color:var(--price)">' + won(split.executed) + '</div></div>' +
          (split.planned ? '<div class="kv"><div class="l">예정 지출</div><div class="v" style="color:var(--text-mute)">' + won(split.planned) + '</div></div>' : '') +
```

그리고 (c)가 속한 블록 **앞**에 `split`을 선언한다. 173행의 `var execTotal = …` 줄을 다음으로 바꿔 재사용한다:

```js
      var split = window.CalLib.splitCosts(h.costs, today());
      var execTotal = split.executed;
```

> **라벨을 "집행 지출"로 바꾸는 것이 수정의 핵심이다.** 기존 "누적지출"이라는 라벨과 값(미래 비용 포함)이 어긋난 것이 스펙 T3의 본질이다.

- [ ] **Step 4: KST 검증 (Node)**

```bash
node -e '
const L = require("./shared/cal-lib.js");
const cases = [
  ["KST 08-27 00:30", Date.UTC(2026,7,26,15,30), "2026-08-27"],
  ["KST 08-27 08:59", Date.UTC(2026,7,26,23,59), "2026-08-27"],
  ["KST 08-27 09:01", Date.UTC(2026,7,27,0,1),   "2026-08-27"],
];
let ok = true;
for (const [label, ms, want] of cases) {
  const got = L.todayKST(ms);
  if (got !== want) { ok = false; console.log("FAIL", label, got, "!=", want); }
}
console.log(ok ? "PASS 3/3" : "FAIL");
'
```

Expected: `PASS 3/3`

- [ ] **Step 5: 브라우저 검증 (로컬 원장 뷰)**

로컬 평문 원장이 도달하는 서버가 필요하다 — `.claude/launch.json`의 `timeline-local`(포트 8792, 루트 `_workspace`)을 쓴다.

1. `http://localhost:8792/calendar/timeline/` 로드
2. 콘솔에서:

```js
[...document.querySelectorAll('.pnl .kv')].map(k => k.textContent.trim())
```

Expected: `집행 지출`이 있고, 예정 비용이 있으면 `예정 지출 … (미집행)`이 별도 항목으로 존재. `누적지출` 단일 항목은 없어야 함.

- [ ] **Step 6: 커밋**

```bash
cd _workspace/calendar && git add timeline/index.html && git commit -m "fix(timeline): KST 기준 today + 집행/예정 지출 분리"
```

---

### Task 13: 타임라인 — 375px 오버플로 + 잠금 화면 정렬

**Files:**
- Modify: `timeline/index.html` (CSS ~28-45, stub 렌더 ~78/104)

**왜:** T5(375px에서 body가 +31px 가로 스크롤), T9(`main{display:flex}`가 `.stub{text-align:center}`를 무력화해 1440px에서 중앙 대비 482px 이탈 → "고장난 페이지"로 읽힘).

- [ ] **Step 1: 표 오버플로 컨테이너 + 컬럼 nowrap**

`</style>` 앞에 추가:

```css
  .ledger-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  table.ledger { min-width: 340px; }
  table.ledger th:nth-child(1), table.ledger td:nth-child(1),
  table.ledger th:nth-child(2), table.ledger td:nth-child(2) { white-space: nowrap; }
```

`table.ledger`는 **두 곳**에서 조립된다. 각각 래퍼로 감싼다.

**(a) 조달처 표 — 165행**

```js
          (fundRows ? '<table class="ledger"><thead><tr><th>조달처</th><th style="text-align:right">금액</th><th>금리</th><th>메모</th></tr></thead><tbody>' + fundRows +
```

교체 (여는 태그 앞에 래퍼 추가):

```js
          (fundRows ? '<div class="ledger-wrap"><table class="ledger"><thead><tr><th>조달처</th><th style="text-align:right">금액</th><th>금리</th><th>메모</th></tr></thead><tbody>' + fundRows +
```

그리고 이 삼항식이 닫는 `'</tbody></table>'`를 `'</tbody></table></div>'`로 바꾼다. 165행 다음 줄에서 찾는다.

**(b) 비용 원장 표 — 180행**

```js
          '<table class="ledger"><thead><tr><th>일자</th><th>항목</th><th style="text-align:right">금액</th><th>메모</th></tr></thead><tbody>' + rows + '</tbody></table>' +
```

교체:

```js
          '<div class="ledger-wrap"><table class="ledger"><thead><tr><th>일자</th><th>항목</th><th style="text-align:right">금액</th><th>메모</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
```

- [ ] **Step 1b: 여는/닫는 태그 짝 확인**

```bash
cd /Users/champ/real-estate-auction/timeline
echo "ledger-wrap 여는 태그: $(grep -o '<div class="ledger-wrap">' index.html | wc -l)"
echo "table.ledger 여는 태그: $(grep -o '<table class="ledger">' index.html | wc -l)"
echo "</table></div> 닫는 쌍: $(grep -o '</tbody></table></div>' index.html | wc -l)"
```

Expected: 세 줄 모두 `2`

- [ ] **Step 2: 잠금 화면 정렬 수정**

`</style>` 앞에 추가:

```css
  /* main 이 flex 라 .stub 이 콘텐츠 폭으로 줄어 text-align:center 가 무력화된다. */
  main > .stub { flex: 1 1 auto; width: 100%; max-width: 560px; margin-inline: auto; }
```

- [ ] **Step 3: 잠금 화면에 상태 요약 추가**

스펙 §13 결정 5 — **상태만, 금액은 노출하지 않는다.**

`app.innerHTML = '<div class="stub">🔒 낙찰물건 타임라인은 <b>비공개</b>입니다.<br>전체 여정·비용·손익은 로컬 환경에서만 열람합니다.` … 로 시작하는 최종 stub(~104행)을 교체:

```js
      var wonCount = 0;
      try {
        var R = window.AUCTION_RESULTS || {};
        for (var k in R) if (R[k] && R[k].myResult === 'won') wonCount++;
      } catch (e) {}
      app.innerHTML = '<div class="stub"><b>낙찰물건 타임라인은 비공개입니다.</b>'
        + (wonCount ? '<br>현재 낙찰 ' + wonCount + '건을 보유 중입니다.' : '')
        + '<br>여정·비용·손익 상세는 로컬 환경에서만 열람합니다.'
        + '<span style="display:block;margin-top:10px;font-size:12px;color:var(--text-mute)">'
        + '낙찰 결과 요약은 <a href="../calendar/">캘린더</a>에서 볼 수 있습니다.</span></div>';
```

> 낙찰가·응찰자수 등 금액은 넣지 않는다. `results.js`에 이미 공개돼 있고 캘린더가 렌더하지만, **잠금 화면에서 다시 노출하는 것은 사용자 의도를 넘어서는 판단**이다(스펙 §13 결정 5).
>
> **innerHTML 안전성:** 삽입되는 동적 값은 `wonCount` **하나뿐이고 `++`로 증가한 정수**다(문자열 경로 없음). 나머지는 전부 리터럴이다. 이 페이지의 다른 innerHTML 사용부(`e.category`·`e.memo`·`m.memo`·`ln.memo` 등이 이스케이프 없이 삽입됨)는 **Plan 2 범위**로 남긴다 — 자가 작성 데이터라 보안 위험은 낮으나 메모에 `<`가 들어가면 레이아웃이 깨진다.

- [ ] **Step 4: 브라우저 검증 — 375px 오버플로**

1. 뷰포트를 375×812로 설정
2. `http://localhost:8792/calendar/timeline/` 로드 (원장 뷰)
3. 콘솔에서:

```js
JSON.stringify({
  overflow: document.body.scrollWidth - document.body.clientWidth,
  wrapped: !!document.querySelector('.ledger-wrap')
})
```

Expected: `{"overflow":0,"wrapped":true}`
Before: `overflow: 31`

- [ ] **Step 5: 브라우저 검증 — 잠금 화면 정렬**

1. 뷰포트 1440×900
2. `http://localhost:8793/timeline/` 로드 (잠금 뷰 — 평문 원장 미도달)
3. 콘솔에서:

```js
(() => {
  const s = document.querySelector('.stub').getBoundingClientRect();
  const centerOffset = Math.round((s.left + s.width / 2) - window.innerWidth / 2);
  return JSON.stringify({ centerOffset, text: document.querySelector('.stub').textContent.slice(0, 30) });
})()
```

Expected: `Math.abs(centerOffset)` ≤ 8
Before: 482

- [ ] **Step 6: 커밋**

```bash
cd _workspace/calendar && git add timeline/index.html && git commit -m "fix(timeline): 375px 표 오버플로 + 잠금 화면 정렬·안내 보강"
```

---

### Task 14: `.gitignore` 보강

**Files:**
- Modify: `/Users/champ/real-estate-auction/.gitignore`

**왜:** 스펙 §3A.1 잔여 항목. 루트가 현재 git 저장소가 아니라 무해하지만, 나중에 저장소가 되면 **평문 원장이 유출되는 경로**가 된다.

- [ ] **Step 1: 항목 추가**

`.gitignore`의 `_workspace/_profile/` 줄 다음에 추가:

```
_workspace/_holdings/
```

- [ ] **Step 2: 확인**

```bash
grep -n "_holdings" /Users/champ/real-estate-auction/.gitignore
```

Expected: `_workspace/_holdings/` 가 출력됨

> 루트는 git 저장소가 아니므로 커밋하지 않는다. 파일 수정만으로 충분하다.

---

### Task 15: 재측정 및 기록

**Files:**
- Modify: `docs/site-ui-redesign-spec.md` (§3.2에 After 열 추가)

**왜:** Plan 2의 §6.2(레일/패널 폭)가 **Phase 0 이후 실측값**을 입력으로 요구한다.

- [ ] **Step 1: 전체 테스트 통과 확인**

```bash
cd /Users/champ/real-estate-auction && node --test "_workspace/_tests/*.test.js" "_workspace/_holdings/*.test.js"
```

Expected: `pass 41`, `fail 0` (신규 25 + 기존 16)

- [ ] **Step 2: 캘린더 실측 (1440×900, 2026년 5월)**

`http://localhost:8793/calendar/` 로드 후 5월로 이동, 콘솔에서:

```js
(() => {
  const cs = [...document.querySelectorAll('.chip')];
  const heights = {};
  cs.forEach(c => { const h = Math.round(c.getBoundingClientRect().height); heights[h] = (heights[h]||0)+1; });
  const grid = document.getElementById('calendar');
  return JSON.stringify({
    chips: cs.length,
    chipHeights: heights,
    childCounts: cs.reduce((a,c) => (a[c.children.length]=(a[c.children.length]||0)+1, a), {}),
    gridCols: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
    gridHeight: Math.round(grid.getBoundingClientRect().height),
    chromeTop: Math.round(document.querySelector('main').getBoundingClientRect().top),
    ghostBadges: [...document.querySelectorAll('.dday-badge')]
      .filter(b => b.closest('.day').querySelectorAll('.chip').length === 0).length
  });
})()
```

- [ ] **Step 3: 진입 화면 실측**

`http://localhost:8793/calendar/` 를 **파라미터 없이** 새로 로드:

```js
JSON.stringify({
  month: document.getElementById('month-label').textContent,
  chips: document.querySelectorAll('.chip').length,
  detailChars: document.getElementById('detail-inner').textContent.trim().length,
  staleBadge: document.querySelector('.stale-badge')?.textContent || null
})
```

- [ ] **Step 4: 스펙에 After 값 기록**

스펙 §3.2 표에 `Phase 0 After` 열을 추가하고 Step 2~3의 실측값을 채운다. 그리고 §6.2 아래에 한 줄 추가:

```markdown
**Phase 0 실측 입력값 (2026-08-26 기준):** 칩 높이 N px · 그리드 높이 N px · 크롬 N px · 그리드 4열.
이 값으로 1280/1440px에서 `레일 + 그리드 + 패널` 배치 시 셀당 단지명 표시폭을 계산해 (A)/(B)/(C)를 확정한다.
```

- [ ] **Step 5: 커밋**

```bash
cd _workspace/calendar && git add -A && git commit -m "chore: Phase 0 완료 — 도달 가능성 확보"
```

> 스펙 문서는 루트 `docs/`(git 아님)에 있으므로 이 커밋에 포함되지 않는다.

---

## 완료 기준

Phase 0은 아래가 **전부** 참일 때 완료다.

| # | 기준 | Before | 목표 |
|---|---|---|---|
| 1 | 진입 화면 칩 수 | 0 | ≥ 1 |
| 2 | 칩 높이 균일성 | 32px 5개 + 50px 15개 (2종) | **1종** (전부 32px = 1줄) |
| 3 | 칩 자식 수 | 3 또는 4 | 전부 3 |
| 4 | 사건 0개 칸의 D-Day 배지 | 5 | 0 |
| 5 | 딥링크 ↔ 그리드 달 | 불일치 | 일치 |
| 6 | 칸 내부 정렬 | 삽입 순서 | 별점 내림차순 |
| 7 | stale 배지 | 없음 | `N일 전`, 30일 초과 시 `warn` |
| 8 | 빈 달 안내 | 없음 | `.cal-empty` 존재 |
| 9 | 홈 → 캘린더 링크 | 0개 | 3링크 동작 |
| 10 | 타임라인 375px 가로 오버플로 | +31px | 0 |
| 11 | 잠금 화면 중앙 이탈 | 482px | ≤ 8px |
| 12 | `todayKST` 경계 3종 | 2/3 오답 | 3/3 |
| 13 | 단위 테스트 | 16 | 41 pass, 0 fail |

---

## Plan 2에서 다룰 것 (이 계획의 범위 밖)

스펙 §5~§7.4, §7.6 — 공유 토큰(`theme.css`/`base.css`/`icons.js`), 앱 셸 레이아웃, 채도 예산, 칩·패널·리스트 재설계, 성적표 지표 교체(매각가율 예측 오차), 타임라인 `forecast` 계획-실제 대조(R1)·`repayment` 승격(R2)·명암비(S2)·`.pnl` 위계(S3), 캘린더↔타임라인 링크(L1~L3), 모바일 아젠다.

**Plan 2는 Task 15의 실측값이 나온 뒤에 작성한다.**
