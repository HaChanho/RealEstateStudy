# Phase 1 — 디자인 토큰 + 칩 재설계 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 색 토큰을 단일 출처로 모으고, 칩이 사건번호 대신 단지명을 보여주게 만들어 이후 레이아웃 작업이 확보한 폭을 실제로 쓸 수 있게 한다.

**Architecture:** `shared/theme.css`(토큰) + `shared/base.css`(프리미티브)를 신설하고 캘린더·타임라인이 `<link>`로 참조한다. 칩 라벨 로직은 `shared/cal-lib.js`(Phase 0에서 신설, `node --test` 커버)로 옮겨 TDD한다. 렌더 변경은 브라우저 실측으로 검증한다. 의존성 추가 없음.

**Tech Stack:** 바닐라 JS(ES2020), CSS custom properties, `node:test`, GitHub Pages.

**스펙:** `docs/site-ui-redesign-spec.md` §5, §7.1

**브랜치:** `claude/ui-phase0` (Phase 0에 이어서)

---

## 왜 이 순서인가

레이아웃(레일·패널 폭)보다 **칩이 먼저**다. 실측 근거:

```
칩 라벨 = 사건번호 + 단지명,  사건번호가 라벨의 50% (p50 65.1px / 130.4px)
shortenComplex 7자 하드컷 → 단지명 폭이 p50 72.7 ≈ p90 75.5 ≈ max 75.5 로 포화
```

**하드컷을 풀지 않으면 레이아웃으로 확보한 폭이 한 픽셀도 쓰이지 않는다.** 넓은 셀을 만들어도 JS가 7자에서 자른 문자열을 넣는다.

---

## 이 계획의 범위

| 포함 | 제외 (다음 계획) |
|---|---|
| `shared/theme.css` · `base.css` 신설 | 앱 셸 레이아웃 (레일·상단바·패널) → **Plan 3** |
| 하드코딩 색 253회 → 토큰화 | 성적표 지표 교체 → **Plan 4** |
| 칩 재설계 (사건번호 제거, 마진바 제거, 하드컷 해제) | 타임라인 `forecast`/`repayment` → **Plan 4** |
| verdict를 점 형태로 인코딩 | 캘린더↔타임라인 링크 → **Plan 4** |
| 이모지 → 인라인 SVG | 모바일 아젠다 → **Plan 3** |

---

## 파일 구조

| 파일 | 역할 | 신규/수정 |
|---|---|---|
| `shared/theme.css` | 색·간격·반경·그림자·타이포 스케일 토큰 | **신규** |
| `shared/base.css` | reset + 공통 프리미티브(버튼·필드·카드·배지) | **신규** |
| `shared/icons.js` | 인라인 SVG 스프라이트 | **신규** |
| `shared/cal-lib.js` | 칩 라벨 로직 추가 | 수정 |
| `_workspace/_tests/cal-lib.test.js` | 라벨 로직 테스트 | 수정 |
| `calendar/index.html` | 토큰 참조 + 칩 렌더 교체 | 수정 |
| `timeline/index.html` | 토큰 참조, 중복 `:root` 삭제 | 수정 |

---

### Task 1: 색 인벤토리 스냅샷 (회귀 기준선)

**Files:**
- Create: `_workspace/_tests/color-inventory.js`

**왜:** 토큰화는 대규모 치환이다. **무엇이 몇 개였는지 기록하지 않으면 "다 옮겼는지" 확인할 수 없다.** 실측 현황: 캘린더 hex 36종·rgba 92종(총 253회), 타임라인 6종.

- [ ] **Step 1: 인벤토리 스크립트 작성**

Create `_workspace/_tests/color-inventory.js`:

```js
// 하드코딩 색상 인벤토리. 토큰화 전후 비교용. 테스트가 아니라 리포트 도구.
// 사용: node _workspace/_tests/color-inventory.js
const fs = require('node:fs');
const path = require('node:path');

const FILES = [
  'calendar/index.html',
  'timeline/index.html',
  'site-nav.js',
];

function stripRoot(s) {
  return s.replace(/:root\s*\{[^}]*\}/gs, '');
}

function inventory(file) {
  const s = stripRoot(fs.readFileSync(file, 'utf8'));
  const hex = s.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  const rgba = s.match(/rgba?\([^)]*\)/g) || [];
  return {
    file: path.basename(path.dirname(file)) + '/' + path.basename(file),
    hexUnique: new Set(hex.map((h) => h.toLowerCase())).size,
    hexTotal: hex.length,
    rgbaUnique: new Set(rgba).size,
    rgbaTotal: rgba.length,
  };
}

const rows = FILES.map(inventory);
for (const r of rows) {
  console.log(
    `${r.file.padEnd(28)} hex ${String(r.hexUnique).padStart(3)}종/${String(r.hexTotal).padStart(4)}회` +
    `   rgba ${String(r.rgbaUnique).padStart(3)}종/${String(r.rgbaTotal).padStart(4)}회`
  );
}
const tot = rows.reduce((a, r) => a + r.hexTotal + r.rgbaTotal, 0);
console.log(`\n총 하드코딩 출현: ${tot}회`);
```

- [ ] **Step 2: 기준선 기록**

Run: `node _workspace/_tests/color-inventory.js`

현재값을 이 계획 하단 "완료 기준" 표의 Before 열에 적는다. 실측 예상:
`calendar/index.html` hex 36종/124회 · rgba 92종/129회 → 합계 253회

- [ ] **Step 3: 커밋 불필요**

`_workspace/_tests/`는 git 저장소 밖이다.

---

### Task 2: `theme.css` — 토큰 단일 출처

**Files:**
- Create: `shared/theme.css`

**왜:** 캘린더·타임라인이 동일한 `:root` 12개를 각자 복붙해 갖고 있고, `site-nav.js`가 CSS를 JS 문자열로 들고 있어 **사본이 3벌**이다.

**설계 근거 — 알파 스케일:** rgba 92종의 정체는 **베이스 28색 × 제각각인 알파**다. `rgb(245,158,11)`(앰버) 하나가 알파 12종(.06 .08 .12 .14 .15 .18 .20 .22 .24 .35 .45 .55), `rgb(16,185,129)`가 10종을 쓴다. 토큰 92개를 만드는 게 아니라 **베이스 색 + 알파 4단**으로 접는다.

- [ ] **Step 1: 파일 작성**

Create `shared/theme.css`:

```css
/* 공유 디자인 토큰 — 홈(지도)은 제외한다(§8: 명조체 편집 디자인이라 색 통일 시 정체성 파괴).
   캘린더·타임라인만 참조. 값 변경은 여기 한 곳에서만. */
:root {
  /* ── 중립 ── */
  --n-0:   #ffffff;
  --n-25:  #fbfcfe;
  --n-50:  #f6f8fb;
  --n-100: #eef1f7;
  --n-200: #e2e7ef;
  --n-300: #cbd3e1;
  --n-400: #9aa5b8;
  --n-600: #5a6579;
  --n-900: #161b26;

  /* ── 의미 별칭 (기존 이름 유지 — 대규모 치환 회피) ── */
  --bg:            var(--n-100);
  --surface:       var(--n-0);
  --surface-2:     var(--n-50);
  --surface-3:     var(--n-200);
  --border:        var(--n-200);
  --border-strong: var(--n-300);
  --text:          var(--n-900);
  --text-dim:      var(--n-600);
  --text-mute:     #6b7688;   /* AA 통과값. 구 #8b95a7 은 12px 에서 3.02:1 로 미달 */

  /* ── 강조 ── */
  --accent:        #3b6fde;
  --accent-strong: #1e40af;

  /* ── 채도 예산 1: 별점 (유일한 풀채도) ── */
  --r5-fg: #ffffff;  --r5-bg: #d97706;  --r5-tint: #fffbeb;
  --r4-fg: #ffffff;  --r4-bg: #4d7c0f;  --r4-tint: #f7fee7;
  --r3-fg: #ffffff;  --r3-bg: #0369a1;  --r3-tint: #f0f9ff;
  --r2-fg: #6d28d9;  --r2-bg: #ede9fe;  --r2-tint: #faf5ff;
  --r1-fg: #64748b;  --r1-bg: #f1f5f9;  --r1-tint: transparent;

  /* ── 채도 예산 2: 손실 신호 ── */
  --loss:      #dc2626;
  --loss-tint: #fef2f2;

  /* ── 무채색 상태 (verdict·결과 — 형태로 구분, 색 아님) ── */
  --muted-dot:    var(--n-400);
  --muted-bg:     var(--n-50);
  --muted-border: var(--n-300);

  /* ── 알파 스케일 — rgba 92종을 4단으로 접는다 ── */
  --a-1: 0.06;   /* 최약 배경 틴트 */
  --a-2: 0.14;   /* 배경 틴트 */
  --a-3: 0.30;   /* 테두리 */
  --a-4: 0.55;   /* 강조 테두리 */

  /* ── 간격 (4px 그리드) ── */
  --sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px;
  --sp-4: 16px; --sp-5: 20px; --sp-6: 24px;

  /* ── 반경 ── */
  --r-sm: 6px; --r-md: 8px; --r-lg: 10px; --r-pill: 999px;

  /* ── 그림자 ── */
  --sh-1: 0 1px 2px rgb(15 23 42 / var(--a-1));
  --sh-2: 0 1px 3px rgb(15 23 42 / var(--a-1));
  --sh-panel: -16px 0 32px rgb(31 41 55 / var(--a-2));

  /* ── 타이포 스케일 ── */
  --fs-xs: 10px; --fs-sm: 11px; --fs-md: 12px;
  --fs-base: 13px; --fs-lg: 14px; --fs-xl: 18px; --fs-2xl: 24px;
  --lh-tight: 1.25; --lh-base: 1.5; --lh-loose: 1.7;
}
```

> `--text-mute`를 `#8b95a7` → `#6b7688`로 올린다. 구 값은 12px에서 **3.02:1**로 WCAG AA(4.5:1) 미달이고, `.sub`·`.steps .d`·`.pnl .kv .l`·빈 상태 등 **페이지 대부분의 2차 라벨**에 쓰인다.

- [ ] **Step 2: 명암비 검증**

```bash
node -e '
function lum(hex){const c=hex.replace("#","");const v=[0,2,4].map(i=>parseInt(c.substr(i,2),16)/255)
  .map(x=>x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4));
  return 0.2126*v[0]+0.7152*v[1]+0.0722*v[2];}
function ratio(a,b){const l1=lum(a),l2=lum(b);const[hi,lo]=l1>l2?[l1,l2]:[l2,l1];return (hi+0.05)/(lo+0.05);}
const white="#ffffff";
for (const [name,hex] of [["구 --text-mute","#8b95a7"],["신 --text-mute","#6b7688"],["--text-dim","#5a6579"],["--text","#161b26"],["--accent","#3b6fde"]]) {
  const r=ratio(hex,white);
  console.log(name.padEnd(16), hex, r.toFixed(2)+":1", r>=4.5?"PASS":"FAIL");
}
'
```

Expected: `구 --text-mute` FAIL, `신 --text-mute` PASS, 나머지 PASS

- [ ] **Step 3: 커밋**

```bash
cd _workspace/calendar && git add shared/theme.css && git commit -m "feat(shared): theme.css — 토큰 단일 출처 + 알파 스케일 4단"
```

---

### Task 3: 캘린더·타임라인이 theme.css 를 참조

**Files:**
- Modify: `calendar/index.html` (`:root` 블록 삭제, `<link>` 추가)
- Modify: `timeline/index.html` (동일)

**왜:** 사본 3벌 제거. 타임라인 토큰 15개는 캘린더 25개의 **완전 부분집합이고 값이 15/15 동일**이라 충돌이 없다.

- [ ] **Step 1: 캘린더 — `:root` 삭제하고 link 추가**

`calendar/index.html`의 `<style>` 첫 블록에 있는 `:root { ... }` 전체(약 33줄, `--bg`부터 `--naver`까지)를 **삭제**한다.

캘린더 전용 토큰(`--panel-*`, `--pending/candidate/pass/hold/fail/expired`, `--price`, `--positive`, `--negative`, `--naver`)은 `theme.css`에 없으므로, 삭제한 자리에 **축소된 `:root`**를 남긴다:

```css
  :root {
    /* 캘린더 전용 — theme.css 에 없는 것만. 공용 토큰은 shared/theme.css 참조. */
    --panel-bg:     var(--n-50);
    --panel-bg-2:   var(--n-100);
    --panel-border: var(--n-300);
    --panel-accent: #8b5cf6;
    --price:    #b45309;
    --positive: #059669;
    --negative: var(--loss);
    --naver:    #03c75a;
    /* verdict — 무채색으로 강등(§5.2). 점 형태로 구분한다(§10). */
    --pending: var(--muted-dot); --candidate: var(--muted-dot); --pass: var(--muted-dot);
    --hold:    var(--muted-dot); --fail:      var(--muted-dot); --expired: var(--muted-dot);
  }
```

`<head>`의 `<style>` **앞**에 추가:

```html
<link rel="stylesheet" href="../shared/theme.css" />
```

- [ ] **Step 2: 타임라인 — `:root` 삭제하고 link 추가**

`timeline/index.html`의 `:root { ... }`(5줄) 전체를 삭제하고, 전용 토큰만 남긴다:

```css
  :root { --price:#b45309; --positive:#059669; --negative:var(--loss); --pending:#0284c7; }
```

`<style>` 앞에 추가:

```html
<link rel="stylesheet" href="../shared/theme.css" />
```

- [ ] **Step 3: 브라우저 검증 — 토큰 해석 확인**

두 페이지를 로드하고 콘솔에서:

```js
(function(){
  const cs = getComputedStyle(document.documentElement);
  const need = ['--bg','--surface','--border','--text','--text-dim','--text-mute','--accent','--sp-3','--r-md','--fs-base'];
  const missing = need.filter(k => !cs.getPropertyValue(k).trim());
  return JSON.stringify({ missing, textMute: cs.getPropertyValue('--text-mute').trim(),
    bodyBg: getComputedStyle(document.body).backgroundColor });
})()
```

Expected: `missing: []`, `textMute: "#6b7688"`, `bodyBg`가 투명이 아닌 실제 색

**캐시 주의:** 브라우저가 이전 HTML/CSS를 강하게 캐시한다. 반드시 `location.replace('/calendar/?cb=' + Date.now())`로 로드하고, CSS 파일은 `fetch('/shared/theme.css',{cache:'reload'})` 후 재로드한다.

- [ ] **Step 4: 시각 회귀 확인**

두 페이지 스크린샷을 찍어 **레이아웃이 무너지지 않았는지** 확인한다. 색이 약간 달라지는 것은 의도된 변경(`--text-mute` 상향)이다. 무너짐의 신호: 배경이 흰색으로 빠짐, 테두리 소실, 텍스트가 검정으로 통일됨 → 토큰 미해석.

- [ ] **Step 5: 커밋**

```bash
cd _workspace/calendar && git add calendar/index.html timeline/index.html \
  && git commit -m "refactor(css): :root 사본 3벌 → shared/theme.css 단일 출처"
```

---

### Task 4: `chipLabel` — 사건번호 제거, 하드컷 해제 (TDD)

**Files:**
- Modify: `shared/cal-lib.js`
- Modify: `_workspace/_tests/cal-lib.test.js`

**왜:** 실측 — 사건번호가 라벨 폭의 **50%**(p50 65.1px/130.4px)를 쓰고, `shortenComplex` 7자 하드컷 때문에 단지명 폭이 **포화**(p50 72.7 ≈ max 75.5)돼 있다. 사건번호는 DB 키이지 스캔 단서가 아니며 이미 `title` 툴팁과 상세 패널에 있다.

**변별력 실측:** 같은 날짜 안에서 단지명이 겹치는 칩 수 — 6자 5/76, 8자(현재) 5/76, **전체 이름 2/76**. 6자→8자는 아무것도 사지 못하고, 전체 이름이 3건을 더 구분한다. → **하드컷을 없애고 CSS ellipsis에 위임**한다.

- [ ] **Step 1: 실패하는 테스트 추가**

Append to `_workspace/_tests/cal-lib.test.js`:

```js
// ===== chipLabel =====
test('chipLabel: 단지명만 반환한다 (사건번호 제외)', () => {
  const c = { caseNumber: '2025타경12066', complex: '천안역우방아이유쉘' };
  assert.strictEqual(L.chipLabel(c), '천안역우방아이유쉘');
});

test('chipLabel: 길어도 자르지 않는다 (CSS ellipsis 에 위임)', () => {
  const c = { caseNumber: '2025타경1', complex: '가나다라마바사아자차카타파하' };
  assert.strictEqual(L.chipLabel(c), '가나다라마바사아자차카타파하');
});

test('chipLabel: 단지명 없으면 사건번호로 폴백', () => {
  assert.strictEqual(L.chipLabel({ caseNumber: '2025타경1', complex: '' }), '2025타경1');
  assert.strictEqual(L.chipLabel({ caseNumber: '2025타경1' }), '2025타경1');
});

test('chipLabel: 둘 다 없으면 빈 문자열', () => {
  assert.strictEqual(L.chipLabel({}), '');
});

// ===== chipTitle (툴팁 — 사건번호는 여기로) =====
test('chipTitle: 사건번호·단지명·별점·최저가를 담는다', () => {
  const t = L.chipTitle({ caseNumber: '2025타경12066', complex: '우방아이유쉘', minimumPrice: 194000000 }, 4, (n) => '1.94억');
  assert.ok(t.includes('2025타경12066'), '사건번호 포함');
  assert.ok(t.includes('우방아이유쉘'), '단지명 포함');
  assert.ok(t.includes('★4'), '별점 포함');
  assert.ok(t.includes('1.94억'), '최저가 포함');
});

test('chipTitle: 별점 null 이면 ★ 표기 없음', () => {
  const t = L.chipTitle({ caseNumber: 'A', complex: 'B' }, null, () => '');
  assert.ok(!t.includes('★'), '별점 표기 없어야 함');
});
```

- [ ] **Step 2: 실패 확인**

Run: `node --test "_workspace/_tests/*.test.js"`
Expected: FAIL — `L.chipLabel is not a function`

- [ ] **Step 3: 구현**

`cal-lib.js`의 `return` 문 앞에 추가:

```js
  // 칩 라벨 — 단지명만. 사건번호는 DB 키이지 스캔 단서가 아니다(라벨 폭의 50%를 쓰고 있었다).
  // 자르지 않는다 — CSS ellipsis 가 실제 셀 폭에 맞춰 자르게 위임한다.
  // (구 shortenComplex 는 7자 하드컷이라 셀을 넓혀도 폭이 쓰이지 않았다.)
  function chipLabel(c) {
    if (!c) return '';
    return String(c.complex || c.caseNumber || '');
  }

  // 툴팁 — 사건번호는 여기로 옮긴다.
  function chipTitle(c, rating, fmtMoney) {
    if (!c) return '';
    const parts = [c.caseNumber, c.complex].filter(Boolean);
    if (rating != null) parts.push('★' + rating);
    if (c.minimumPrice != null && typeof fmtMoney === 'function') {
      parts.push('최저 ' + fmtMoney(c.minimumPrice));
    }
    return parts.join(' · ');
  }
```

`return`에 `chipLabel: chipLabel, chipTitle: chipTitle` 추가.

- [ ] **Step 4: 통과 확인**

Run: `node --test "_workspace/_tests/*.test.js"`
Expected: `pass 31`, `fail 0` (기존 25 + 신규 6)

- [ ] **Step 5: 커밋**

```bash
cd _workspace/calendar && git add shared/cal-lib.js \
  && git commit -m "feat(shared): chipLabel — 사건번호 제거·하드컷 해제, chipTitle 로 이관"
```

---

### Task 5: 칩 렌더 교체 — 마진바 제거, verdict 점 형태

**Files:**
- Modify: `calendar/index.html` (`appendChip`, `.chip*` CSS)

**왜:**
- **마진바 제거:** 실비용 24px(bar 22 + gap 2). `kbPrice`가 76건 중 49건(64%)에만 있어 칩 간 비교가 성립하지 않고, `pct = margin/(kbPrice*0.4)` 분모가 임의값이라 22px에서 실질 4~5단계뿐이다. 그리고 `linear-gradient(#38bdf8,#84cc16,#fcd34d)`는 **채도 예산(별점·손실 2개)에 없는 세 번째 색 채널**이다. 미시 마진은 상세 패널의 숫자로 남는다.
- **verdict 점 형태:** 스펙 §10 확정 — 채도 대신 형태로 구분.

- [ ] **Step 1: verdict 점 CSS 추가**

`</style>` 앞에 추가:

```css
  /* verdict — 채도 대신 점 형태로 구분(§10). fail·expired 는 별점과 100% 중복이라 강등. */
  .chip .vdot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
                display: inline-block; box-sizing: border-box; }
  .chip.candidate .vdot { background: var(--muted-dot); }                                   /* ● 채움 */
  .chip.hold      .vdot { background: linear-gradient(90deg, var(--muted-dot) 50%, transparent 50%);
                          border: 1px solid var(--muted-dot); }                             /* ◐ 반채움 */
  .chip.pass      .vdot { background: transparent; border: 1px solid var(--muted-dot); }    /* ○ 외곽선 */
  .chip.pending   .vdot { background: transparent; border: 1px dotted var(--muted-dot); }   /* ◌ 점선 */
  .chip.fail .vdot, .chip.expired .vdot { display: none; }
  /* 종료·변경 건은 취소선 대신 물러남 — 취소선은 글자를 더 못 읽게 만든다. */
  .chip.fail, .chip.expired { opacity: 0.45; }
  .chip.fail .chip-text, .chip.expired .chip-text { text-decoration: none; }
```

- [ ] **Step 2: `appendChip` 교체**

`appendChip` 안에서 `mini` 관련 블록 전체(`const mini = el('span', { cls: 'chip-mini' });` 부터 `chip.appendChild(trail);` 직전까지)를 다음으로 교체:

```js
        // 최저매각가만 남긴다. 마진바는 제거 — 24px 소비, kbPrice 64% 커버리지,
        // 22px 안에서 실질 4~5단계, 그리고 채도 예산에 없는 세 번째 색 채널이었다.
        if (c.minimumPrice != null) {
          trail.appendChild(el('span', { cls: 'chip-price', text: fmtMoneyShort(c.minimumPrice) }));
        }
```

그리고 라벨·툴팁을 새 함수로 교체한다. `appendChip` 상단의

```js
        const chip = el('div', { cls: cls.join(' '), title: `${c.caseNumber} · ${c.complex}${r != null ? ' · ★' + r : ''}${c.minimumPrice != null ? ' · 최저 ' + fmtMoneyShort(c.minimumPrice) : ''}` });
```

를 교체:

```js
        const chip = el('div', { cls: cls.join(' '), title: window.CalLib.chipTitle(c, r, fmtMoneyShort) });
```

그리고

```js
        chip.appendChild(el('span', { cls: 'chip-text', text: chipLabel(c) }));
```

를 교체 (verdict 점을 라벨 앞에 붙인다):

```js
        {
          const label = el('span', { cls: 'chip-text' });
          label.appendChild(el('span', { cls: 'vdot' }));
          label.appendChild(document.createTextNode(' ' + window.CalLib.chipLabel(c)));
          chip.appendChild(label);
        }
```

- [ ] **Step 3: 구 함수 제거**

`shortenComplex`와 구 `chipLabel`(index.html ~1342-1343)을 **삭제**한다. 다른 호출부가 없는지 먼저 확인:

```bash
grep -n "shortenComplex\|chipLabel" calendar/index.html
```

Expected: `window.CalLib.chipLabel` 호출 1곳만 남아야 함. `shortenComplex`가 다른 곳(리스트 뷰 등)에서 쓰이면 그 자리는 **그대로 두고** 함수도 남긴다.

- [ ] **Step 4: 브라우저 검증 — 라벨 구성**

2026년 5월에서:

```js
(function(){
  const cs = [...document.querySelectorAll('.chip')];
  const cv = document.createElement('canvas').getContext('2d');
  cv.font = getComputedStyle(cs[0].querySelector('.chip-text')).font;
  const widths = cs.map(c => cv.measureText(c.querySelector('.chip-text').textContent.trim()).width);
  const p = (a,q) => { const s=[...a].sort((x,y)=>x-y); return Math.round(s[Math.floor(s.length*q)]*10)/10; };
  return JSON.stringify({
    n: cs.length,
    hasCaseNumber: cs.filter(c => /타경|·\d{4,}/.test(c.querySelector('.chip-text').textContent)).length,
    hasMiniBar: document.querySelectorAll('.mini-bar').length,
    vdots: document.querySelectorAll('.vdot').length,
    labelW: { p50: p(widths,.5), p90: p(widths,.9), max: p(widths,1-1e-9) },
    heights: cs.reduce((a,c)=>{const h=Math.round(c.getBoundingClientRect().height); a[h]=(a[h]||0)+1; return a;},{}),
    childCounts: cs.reduce((a,c)=>{a[c.children.length]=(a[c.children.length]||0)+1; return a;},{})
  });
})()
```

Expected:
- `hasCaseNumber: 0` (사건번호가 라벨에서 사라짐)
- `hasMiniBar: 0`
- `vdots`가 칩 수와 같음
- `labelW.p50`이 **130.4 → 70 근처**로 감소
- `heights` 키가 1종 (전부 1줄), `childCounts: {"3": n}` (Phase 0 불변식 유지)

- [ ] **Step 5: 툴팁 확인**

```js
document.querySelector('.chip').title
```

Expected: `사건번호 · 단지명 · ★N · 최저 N.NN억` 형태 — 사건번호가 툴팁으로 이동했는지 확인

- [ ] **Step 6: 커밋**

```bash
cd _workspace/calendar && git add calendar/index.html \
  && git commit -m "feat(calendar): 칩 재설계 — 사건번호→툴팁, 마진바 제거, verdict 점 형태"
```

---

### Task 6: 하드코딩 색 → 토큰 치환

**Files:**
- Modify: `calendar/index.html`
- Modify: `timeline/index.html`
- Modify: `site-nav.js`

**왜:** 실측 253회. 다크모드 채택 여부와 무관하게 필요하다(§8) — 나중에 다크를 켤 때 팔레트 한 벌 추가로 끝나게 만든다.

**순서가 중요하다:** Task 5까지 끝나야 마진바 그라디언트 등 **제거될 색을 치환하는 헛수고**를 피한다.

- [ ] **Step 1: `:root` 에 이미 있는 값부터 (가장 안전)**

실측: hex 36종 중 **7종이 `:root`에 같은 값으로 이미 존재**한다 — `#0284c7`, `#6b7280`, `#7c3aed`, `#9ca3af`, `#b45309`, `#dc2626`, `#ffffff`.

```bash
cd calendar
python3 - <<'PY'
import re
p='index.html'
s=open(p,encoding='utf-8').read()
head, rest = s.split('</style>', 1)   # 첫 style 블록만 치환 대상
MAP = {
  '#0284c7':'var(--pending)', '#b45309':'var(--price)', '#dc2626':'var(--loss)',
  '#ffffff':'var(--n-0)', '#9ca3af':'var(--n-400)', '#6b7280':'var(--n-600)',
}
n=0
for k,v in MAP.items():
    # :root 블록 안은 건드리지 않는다
    parts = re.split(r'(:root\s*\{[^}]*\})', head, flags=re.S)
    for i in range(0, len(parts), 2):
        c = parts[i].count(k)
        parts[i] = parts[i].replace(k, v)
        n += c
    head = ''.join(parts)
open(p,'w',encoding='utf-8').write(head + '</style>' + rest)
print(f"치환 {n}회")
PY
```

- [ ] **Step 2: 브라우저 시각 회귀 확인**

`location.replace('/calendar/?cb='+Date.now())` 후 스크린샷. **색이 눈에 띄게 바뀌면 치환이 잘못된 것** — 같은 값으로 매핑했으므로 픽셀 단위로 동일해야 한다.

```js
(function(){
  const s = getComputedStyle(document.querySelector('.chip-price'));
  return JSON.stringify({ price: s.color, bodyBg: getComputedStyle(document.body).backgroundColor });
})()
```

Expected: `price`가 `rgb(180, 83, 9)` (= `#b45309`)로 유지

- [ ] **Step 3: rgba 알파 스케일로 접기**

베이스 28색 × 알파 12종 같은 산포를 4단(`--a-1`~`--a-4`)으로 접는다. 가장 많이 쓰인 두 색부터:

```bash
python3 - <<'PY'
import re
p='index.html'
s=open(p,encoding='utf-8').read()
head, rest = s.split('</style>', 1)
# 알파를 4단으로 스냅: <=.10 → a-1, <=.20 → a-2, <=.40 → a-3, 그 외 a-4
def snap(m):
    r,g,b,a = m.group(1), m.group(2), m.group(3), float(m.group(4) or 1)
    tier = '--a-1' if a<=0.10 else '--a-2' if a<=0.20 else '--a-3' if a<=0.40 else '--a-4'
    return f'rgb({r} {g} {b} / var({tier}))'
pat = re.compile(r'rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)')
parts = re.split(r'(:root\s*\{[^}]*\})', head, flags=re.S)
n=0
for i in range(0, len(parts), 2):
    parts[i], k = pat.subn(snap, parts[i])
    n += k
head=''.join(parts)
open(p,'w',encoding='utf-8').write(head + '</style>' + rest)
print(f"rgba → 알파스케일 {n}회")
PY
```

> `rgb(R G B / A)` 공간 구분 문법은 모든 현행 브라우저가 지원한다. `var()`를 알파 자리에 쓸 수 있는 것이 이 문법의 이점이다(구 `rgba(r,g,b,var(--x))`는 동작하지 않는다).

- [ ] **Step 4: 시각 회귀 재확인**

알파를 스냅했으므로 **미세한 차이는 의도된 것**이다. 무너짐의 신호만 본다: 배경 틴트가 사라짐, 테두리가 검정으로 변함, 요소가 투명해짐.

스크린샷 + 콘솔:

```js
[...document.querySelectorAll('.vtog')].map(t => getComputedStyle(t).borderColor)
```

Expected: 전부 `rgba(...)` 형태이고 `rgb(0, 0, 0)`이 아님

- [ ] **Step 5: 타임라인·site-nav 치환 (6종·6종, 수동)**

타임라인 6종:
```
rgba(15,23,42,.04)   → var(--sh-1) 이 이미 커버 → .card box-shadow 를 var(--sh-1) 로
rgba(2,132,199,.12)  → rgb(2 132 199 / var(--a-2))
#075985              → 그대로 유지 (배지 전용, 토큰화 이득 없음) 또는 --badge-holding-fg 신설
rgba(5,150,105,.12)  → rgb(5 150 105 / var(--a-2))
#065f46              → 동일 판단
#fff                 → var(--n-0)
```

`site-nav.js`의 fallback 색 6개(`var(--surface,#fff)` 형태)는 **의도된 방어값이므로 그대로 둔다.** theme.css 로드 실패 시 최소 렌더를 보장한다.

- [ ] **Step 6: 인벤토리 재측정**

Run: `node _workspace/_tests/color-inventory.js`

Before/After를 완료 기준 표에 기록한다. **0을 목표로 하지 않는다** — 배지 전용 색과 site-nav fallback은 남는 것이 옳다.

- [ ] **Step 7: 커밋**

```bash
cd _workspace/calendar && git add calendar/index.html timeline/index.html \
  && git commit -m "refactor(css): 하드코딩 색 → 토큰·알파스케일 치환"
```

---

### Task 7: 이모지 → 인라인 SVG

**Files:**
- Create: `shared/icons.js`
- Modify: `calendar/index.html`

**왜:** 이모지는 렌더는 되지만 ①`🏁`·`📅`가 11px에서 판독 불가 ②플랫폼마다 그림이 달라 통제 불가 ③토큰 색을 못 입힌다. 실측 20종 사용.

`★`(U+2605)는 **텍스트 기호이므로 유지**한다 — 별점 표기의 일부이고 폰트 폴백이 안정적이다.

- [ ] **Step 1: 스프라이트 작성**

Create `shared/icons.js`:

```js
// 인라인 SVG 아이콘 — 이모지 대체. currentColor 를 쓰므로 토큰 색이 그대로 적용된다.
// 사용: window.Icons.svg('calendar', 14)  →  SVGElement
(function (factory) {
  const lib = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = lib;
  if (typeof window !== 'undefined') window.Icons = lib;
})(function () {
  const NS = 'http://www.w3.org/2000/svg';
  // 24x24 viewBox, stroke 기반 (fill 은 none)
  const PATHS = {
    calendar: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 9h18M8 3v4M16 3v4',
    list:     'M4 6h16M4 12h16M4 18h16',
    chart:    'M4 20V10M10 20V4M16 20v-7M22 20H2',
    home:     'M3 11l9-8 9 8M6 10v10h12V10',
    filter:   'M3 5h18l-7 8v6l-4 2v-8z',
    search:   'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.35-4.35',
    link:     'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1',
    court:    'M3 21h18M5 21V10M19 21V10M12 3l9 5H3zM9 21v-7M15 21v-7',
    pin:      'M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    repeat:   'M17 2l4 4-4 4M21 6H8a4 4 0 0 0-4 4v1M7 22l-4-4 4-4M3 18h13a4 4 0 0 0 4-4v-1',
    flag:     'M5 21V4M5 4h11l-1.5 3L16 10H5',
    doc:      'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5',
  };

  function svg(name, size) {
    const d = PATHS[name];
    const el = document.createElementNS(NS, 'svg');
    const s = size || 14;
    el.setAttribute('viewBox', '0 0 24 24');
    el.setAttribute('width', s);
    el.setAttribute('height', s);
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke', 'currentColor');
    el.setAttribute('stroke-width', '2');
    el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('stroke-linejoin', 'round');
    el.setAttribute('aria-hidden', 'true');
    el.style.flexShrink = '0';
    el.style.verticalAlign = '-0.125em';
    if (d) {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      el.appendChild(p);
    }
    return el;
  }

  return { svg: svg, names: Object.keys(PATHS) };
});
```

- [ ] **Step 2: 로드**

`calendar/index.html`의 `<head>`, `cal-lib.js` 다음 줄:

```html
<script src="../shared/icons.js"></script>
```

- [ ] **Step 3: 이모지 사용처 목록화**

```bash
cd calendar
python3 -c "
import re
s=open('index.html',encoding='utf-8').read()
for m in re.finditer(r'[\U0001F300-\U0001FAFF←-⯿☀-➿]', s):
    line = s[:m.start()].count(chr(10)) + 1
    print(f'{line}: {m.group()}')
" | sort -t: -k2 | uniq -c -f1 | sort -rn | head -25
```

- [ ] **Step 4: 교체 — 헤더 탭부터**

`<button class="tab active" data-view="calendar">📅 캘린더</button>` 같은 정적 마크업은 **텍스트만 남기고** 아이콘은 JS로 주입한다(정적 SVG를 HTML에 인라인하면 파일이 커진다):

```html
  <div class="tabs">
    <button class="tab active" data-view="calendar" data-icon="calendar">캘린더</button>
    <button class="tab" data-view="list" data-icon="list">리스트</button>
  </div>
```

Init 블록에 주입 루프 추가:

```js
  // data-icon 이 있는 요소 앞에 SVG 주입
  for (const node of document.querySelectorAll('[data-icon]')) {
    const ic = window.Icons.svg(node.dataset.icon, 14);
    ic.style.marginRight = '5px';
    node.insertBefore(ic, node.firstChild);
  }
```

- [ ] **Step 5: 상세 패널 이모지 교체**

`openDetail` 안의 `🏁`·`📅`·`🏛`·`📍`·`🔄`·`📌`·`🔗`·`📄`를 `window.Icons.svg(...)`로 교체한다. 문자열 조립부는 `el()` 헬퍼로 바꾼다.

**주의:** `openDetail`은 722줄이고 §7.2에서 분할 예정이다. **여기서는 이모지만 교체하고 구조는 건드리지 않는다** — 분할은 Plan 3/4 범위.

- [ ] **Step 6: 브라우저 검증**

```js
(function(){
  const s = document.documentElement.outerHTML;
  const emoji = (s.match(/[\u{1F300}-\u{1FAFF}]/gu) || []);
  return JSON.stringify({
    remainingEmoji: [...new Set(emoji)],
    svgCount: document.querySelectorAll('svg[aria-hidden]').length,
    starsKept: (document.body.textContent.match(/★/g) || []).length
  });
})()
```

Expected: `remainingEmoji: []` (또는 의도적으로 남긴 것만), `svgCount > 0`, `starsKept > 0`

- [ ] **Step 7: 커밋**

```bash
cd _workspace/calendar && git add shared/icons.js calendar/index.html \
  && git commit -m "feat(shared): 인라인 SVG 아이콘 — 이모지 대체(11px 판독불가·플랫폼 편차·색 통제 불가)"
```

---

### Task 8: 재측정 및 기록

**Files:**
- Modify: `docs/site-ui-redesign-spec.md`

- [ ] **Step 1: 전체 테스트**

```bash
cd /Users/champ/real-estate-auction && node --test "_workspace/_tests/*.test.js" "_workspace/_holdings/*.test.js"
```

Expected: `pass 47`, `fail 0` (Phase 0의 41 + 신규 6)

- [ ] **Step 2: 색 인벤토리**

```bash
node _workspace/_tests/color-inventory.js
```

- [ ] **Step 3: 칩 실측 (1440×900, 2026년 5월)**

Task 5 Step 4의 스니펫을 다시 실행하고 값을 기록한다.

- [ ] **Step 4: 필요 컬럼폭 계산**

```js
(function(){
  const cs = [...document.querySelectorAll('.chip')];
  const cv = document.createElement('canvas').getContext('2d');
  cv.font = getComputedStyle(cs[0].querySelector('.chip-text')).font;
  const need = cs.map(c => {
    const label = cv.measureText(c.querySelector('.chip-text').textContent.trim()).width;
    const trail = c.querySelector('.chip-trail').getBoundingClientRect().width;
    return 60 + label + trail;   // 60 = 셀14 + 칩패딩14 + 별점22 + 갭10
  });
  const p = (a,q) => { const s=[...a].sort((x,y)=>x-y); return Math.round(s[Math.floor(s.length*q)]); };
  return JSON.stringify({ requiredColW: { p50: p(need,.5), p90: p(need,.9), max: p(need,1-1e-9) } });
})()
```

이 값이 **Plan 3(앱 셸)의 합격선**이 된다. 스펙 §6.2의 `col ≥ 216` 가정을 실측으로 갱신한다.

- [ ] **Step 5: 스펙 갱신 + 커밋**

스펙 §5.2·§5.3·§7.1에 After 값을 기록한다.

```bash
cd _workspace/calendar && git add -A && git commit -m "chore: Phase 1 완료 — 토큰 단일화 + 칩 재설계"
```

---

## 완료 기준

| # | 기준 | Before (실측) | 목표 |
|---|---|---|---|
| 1 | 칩 라벨에 사건번호 | 20/20 포함 | **0/20** |
| 2 | 칩 라벨 폭 p50 | 130.4px | **≤ 80px** |
| 3 | 단지명 폭 포화 | p50 72.7 ≈ max 75.5 (하드컷) | **p50 < max** (포화 해제) |
| 4 | 마진바 | 존재 | **0개** |
| 5 | verdict 점 | 없음 | 칩 수만큼 존재, `fail`/`expired`는 숨김 |
| 6 | 칩 자식 수 | 3 (Phase 0) | **3 유지** |
| 7 | 칩 높이 종류 | 1종 (Phase 0) | **1종 유지** |
| 8 | `:root` 사본 | 3벌 | **1벌** (`theme.css`) |
| 9 | 하드코딩 색 (캘린더) | hex 36종/124회 · rgba 92종/129회 | **≤ 20회** (배지 전용만) |
| 10 | 하드코딩 색 (타임라인) | 6회 | **≤ 3회** |
| 11 | `--text-mute` 명암비 | 3.02:1 (AA 미달) | **≥ 4.5:1** |
| 12 | 이모지 잔존 | 20종 | **0종** (`★` 제외) |
| 13 | 단위 테스트 | 41 | **47 pass, 0 fail** |

---

## 다음 계획

- **Plan 3 — 앱 셸**: 레일 64px + 상단바 48px + 패널 `clamp(380,100vw−1020,480)` + 브레이크포인트 4단 + 모바일 아젠다 + `PANEL_W_DEFAULT_RATIO` 삭제. 스펙 §6. **Task 8 Step 4의 실측 합격선을 입력으로 쓴다.**
- **Plan 4 — 지표·연결**: 성적표 지표 교체(매각가율 예측 오차 n=19 · 평균 −0.6%p · MAE 5.6%p), 타임라인 `forecast` 계획-실제 대조(R1)·`repayment` 승격(R2), 캘린더↔타임라인 링크(L1~L3), `openDetail` 722줄 분할. 스펙 §7.2·§7.4·§7.5·§7.6.
