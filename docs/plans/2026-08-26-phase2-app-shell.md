# Phase 2 — 앱 셸 레이아웃 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** 세로에 쌓인 크롬 237px을 가로축(레일 64px)으로 옮기고, 패널 기본폭 65%(col 90px)를 뷰포트 연동 clamp로 바꿔 달력이 화면 대부분을 쓰게 한다.

**Architecture:** `main`을 `레일 | 뷰영역(상단바+그리드) | 패널` 3열 flex로 재구성. 필터·범례는 레일에 상주시키지 않고 280px 플라이아웃 오버레이로 분리한다. 브레이크포인트 4단.

**스펙:** §6 (§6.2 확정본)

**브랜치:** `claude/ui-phase0`

---

## 입력값 (Phase 1 실측)

```
필요 컬럼폭   p50 182 · p90 211 · max 224     ← 합격선 = p90 211
칩 높이       32px 단일행 · 자식 3개
그리드        4열 (월화수목)
현재 크롬     237px
현재 패널     뷰포트 65% (1440에서 936px → col 90px)

col = (innerWidth − rail − panelOccupied − 15(스크롤바) − 40(wrap padding) − 12(컬럼갭×3)) / 4
```

**검산:**
| 뷰포트 | 레일 | 패널 | col | ≥211? |
|---|---|---|---|---|
| 1440 | 64 | 380 나란히 | **229** | ✓ |
| 1600 | 64 | 480 나란히 | **247** | ✓ |
| 1366 | 64 | 오버레이 | **309** | ✓ |
| 992 | 64 | 오버레이 | **215** | ✓ |

---

## 파일 구조

| 파일 | 변경 |
|---|---|
| `calendar/index.html` | `main` 3열 재구성 · 레일 · 상단바 · 플라이아웃 · 패널 clamp · 브레이크포인트 · 아젠다 |
| `shared/cal-lib.js` | 아젠다 그룹핑 순수함수 |
| `_workspace/_tests/cal-lib.test.js` | 그 테스트 |

---

### Task 1: `groupByDate` — 아젠다 그룹핑 (TDD)

**Files:** `shared/cal-lib.js`, `_workspace/_tests/cal-lib.test.js`

**왜:** 모바일(<992px)은 그리드를 버리고 날짜별 아젠다 리스트로 간다. 375px에서 4열은 칸 폭 ~80px이라 단지명이 들어갈 수 없다(현재 첫 화면 노출 0건).

- [ ] **Step 1: 실패하는 테스트**

```js
// ===== groupByDate =====
test('groupByDate: 날짜 오름차순, 각 날짜 안은 별점 내림차순', () => {
  const cases = [
    { id: 'b', saleDate: '2026-05-20', r: 2 },
    { id: 'a', saleDate: '2026-05-12', r: 4 },
    { id: 'c', saleDate: '2026-05-20', r: 5 },
  ];
  const out = L.groupByDate(cases, (c) => c.r);
  assert.deepStrictEqual(out.map((g) => g.date), ['2026-05-12', '2026-05-20']);
  assert.deepStrictEqual(out[1].items.map((c) => c.id), ['c', 'b']);
});

test('groupByDate: saleDate 없는 사건은 제외', () => {
  const out = L.groupByDate([{ id: 'x' }, { id: 'y', saleDate: '2026-05-12' }], () => null);
  assert.strictEqual(out.length, 1);
  assert.strictEqual(out[0].items[0].id, 'y');
});

test('groupByDate: 빈 입력은 빈 배열', () => {
  assert.deepStrictEqual(L.groupByDate([], () => null), []);
  assert.deepStrictEqual(L.groupByDate(undefined, () => null), []);
});

test('groupByDate: 각 그룹에 count 를 담는다', () => {
  const out = L.groupByDate([
    { id: 'a', saleDate: '2026-05-12' }, { id: 'b', saleDate: '2026-05-12' },
  ], () => null);
  assert.strictEqual(out[0].count, 2);
});
```

- [ ] **Step 2: 실패 확인** — `node --test "_workspace/_tests/*.test.js"` → `L.groupByDate is not a function`

- [ ] **Step 3: 구현** — `cal-lib.js` `return` 앞에:

```js
  // 아젠다 뷰용 — 날짜 오름차순 그룹, 그룹 안은 별점 내림차순.
  // 사건 없는 날은 그룹 자체가 생기지 않는다(그리드와 달리 빈 칸이 없다).
  function groupByDate(cases, ratingOf) {
    const map = new Map();
    for (const c of (cases || [])) {
      if (!c || !c.saleDate) continue;
      if (!map.has(c.saleDate)) map.set(c.saleDate, []);
      map.get(c.saleDate).push(c);
    }
    return [...map.keys()].sort().map((date) => {
      const items = sortByRating(map.get(date), ratingOf);
      return { date: date, items: items, count: items.length };
    });
  }
```

`return`에 `groupByDate: groupByDate` 추가.

- [ ] **Step 4: 통과 확인** — `pass 51`, `fail 0`

- [ ] **Step 5: 커밋** — `feat(shared): groupByDate — 모바일 아젠다 그룹핑`

---

### Task 2: 패널 기본폭 — 65% 제거

**Files:** `calendar/index.html`

**왜:** `PANEL_W_DEFAULT_RATIO = 0.65` → 1440에서 패널 936px → **col 90px**. 별점 원 하나와 잘린 두 글자만 남는다. 파일에서 가장 해로운 숫자다.

- [ ] **Step 1: CSS clamp 도입**

`.detail-panel`의 `--panel-w: 460px;`를 교체:

```css
    --panel-w: clamp(380px, calc(100vw - 1020px), 480px);
```

- [ ] **Step 2: JS 기본값 로직 교체**

```js
  const PANEL_W_MIN = 380;
  const PANEL_W_MAX = () => Math.max(PANEL_W_MIN, Math.min(560, window.innerWidth - 900));
  function clampPanelW(w) { return Math.max(PANEL_W_MIN, Math.min(PANEL_W_MAX(), w)); }
  // 기본값은 CSS clamp 에 위임한다 — JS 가 --panel-w 를 덮어쓰지 않는다.
  function loadPanelWidth() {
    try {
      const v = Number(localStorage.getItem(LS_PANEL_W));
      if (Number.isFinite(v) && v > 0) return clampPanelW(v);
    } catch (e) {}
    return null;   // null = CSS clamp 사용
  }
  function applyPanelWidth(w) {
    const panel = document.getElementById('detail-panel');
    if (!panel) return;
    if (w == null) panel.style.removeProperty('--panel-w');
    else panel.style.setProperty('--panel-w', w + 'px');
  }
```

`PANEL_W_DEFAULT_RATIO`·`PANEL_W_MAX_RATIO`·`defaultPanelWidth()`를 삭제하고 호출부를 정리한다.

- [ ] **Step 3: 브라우저 검증**

```js
(function(){
  document.querySelector('.chip').click();
  const p=document.getElementById('detail-panel');
  const cal=document.getElementById('calendar');
  const cell=document.querySelector('.day');
  return JSON.stringify({ innerWidth:window.innerWidth,
    panelW:Math.round(p.getBoundingClientRect().width),
    colW:Math.round(cell.getBoundingClientRect().width) });
})()
```

Expected @1440: `panelW ≈ 420`, `colW ≥ 211`
Before: `panelW 936`, `colW 90`

- [ ] **Step 4: 커밋** — `fix(calendar): 패널 기본폭 65% → clamp(380,100vw-1020,480)`

---

### Task 3: 레일 64px + 상단바

**Files:** `calendar/index.html`

- [ ] **Step 1: CSS**

```css
  /* ── 앱 셸 ── */
  body { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
  .shell { display: flex; flex: 1; min-height: 0; }
  .rail { width: 64px; flex-shrink: 0; background: var(--surface); border-right: 1px solid var(--border);
          display: flex; flex-direction: column; align-items: center; padding: var(--sp-2) 0; gap: 2px;
          position: relative; z-index: 25; }
  .rail-item { width: 56px; height: 52px; display: flex; flex-direction: column; align-items: center;
               justify-content: center; gap: 3px; border-radius: var(--r-md); cursor: pointer;
               border: none; background: none; color: var(--text-dim); font-size: var(--fs-xs);
               font-weight: 600; text-decoration: none; }
  .rail-item:hover { background: var(--surface-2); color: var(--text); }
  .rail-item.active { background: var(--surface-2); color: var(--accent); box-shadow: inset 3px 0 0 var(--accent); }
  .rail-sep { width: 32px; height: 1px; background: var(--border); margin: var(--sp-2) 0; }
  .rail-badge { position: absolute; top: 4px; right: 8px; min-width: 15px; height: 15px; padding: 0 3px;
                border-radius: var(--r-pill); background: var(--accent); color: var(--n-0);
                font-size: 9px; font-weight: 700; line-height: 15px; text-align: center; }
  .topbar { display: flex; align-items: center; gap: var(--sp-3); height: 48px; flex-shrink: 0;
            padding: 0 var(--sp-4); border-bottom: 1px solid var(--border); background: var(--surface); }
  .view-area { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  /* 플라이아웃 — 그리드를 밀지 않는 오버레이 */
  .flyout { position: absolute; left: 64px; top: 0; bottom: 0; width: 280px; z-index: 24;
            background: var(--surface); border-right: 1px solid var(--border);
            box-shadow: 8px 0 24px rgb(15 23 42 / var(--a-2)); overflow-y: auto;
            padding: var(--sp-4); transform: translateX(-100%); transition: transform .18s ease;
            visibility: hidden; }
  .flyout.open { transform: translateX(0); visibility: visible; }
```

- [ ] **Step 2: HTML 구조 재배치**

`<header>`·`.stats`·`.filters`를 다음 구조로 옮긴다:

```html
<div class="shell">
  <nav class="rail" id="rail"></nav>              <!-- JS 로 채움 -->
  <aside class="flyout" id="flyout"></aside>      <!-- 필터·범례 -->
  <div class="view-area">
    <div class="topbar" id="topbar"></div>
    <div class="view-wrap"> … 기존 그리드/리스트 … </div>
  </div>
  <aside class="detail-panel" id="detail-panel"> … </aside>
</div>
```

- [ ] **Step 3: 레일 렌더**

```js
  function renderRail() {
    const rail = document.getElementById('rail');
    rail.replaceChildren();
    const mk = (icon, label, opts) => {
      const n = el(opts && opts.href ? 'a' : 'button', { cls: 'rail-item' + (opts && opts.active ? ' active' : '') });
      if (opts && opts.href) n.href = opts.href;
      n.appendChild(window.Icons.svg(icon, 20));
      n.appendChild(el('span', { text: label }));
      if (opts && opts.onClick) n.addEventListener('click', opts.onClick);
      return n;
    };
    rail.appendChild(mk('home', '홈', { href: '../' }));
    rail.appendChild(mk('chart', '타임라인', { href: '../timeline/' }));
    rail.appendChild(el('div', { cls: 'rail-sep' }));
    rail.appendChild(mk('calendar', '달력', { active: state.view === 'calendar', onClick: () => setView('calendar') }));
    rail.appendChild(mk('list', '목록', { active: state.view === 'list', onClick: () => setView('list') }));
    rail.appendChild(el('div', { cls: 'rail-sep' }));
    const f = mk('filter', '필터', { onClick: toggleFlyout });
    const n = activeFilterCount();
    if (n) f.appendChild(el('span', { cls: 'rail-badge', text: String(n) }));
    rail.appendChild(f);
  }
```

- [ ] **Step 4: 브라우저 검증**

```js
JSON.stringify({
  railW: Math.round(document.querySelector('.rail').getBoundingClientRect().width),
  chromeTop: Math.round(document.querySelector('.view-wrap').getBoundingClientRect().top),
  railItems: document.querySelectorAll('.rail-item').length,
  colW: Math.round(document.querySelector('.day').getBoundingClientRect().width)
})
```

Expected: `railW 64`, `chromeTop ≤ 100`(구 237), `railItems 5`, `colW ≥ 211`

- [ ] **Step 5: 커밋** — `feat(calendar): 앱 셸 — 레일 64px + 상단바 48px`

---

### Task 4: 브레이크포인트 4단

- [ ] **Step 1: CSS**

```css
  /* ≥1400: 패널 나란히 (기본, 위 규칙) */
  @media (max-width: 1399px) {
    /* 패널을 오버레이로 — 나란히 유지하면 col 이 합격선 아래로 떨어진다 */
    .detail-panel { position: fixed; top: 0; right: 0; bottom: 0; z-index: 30; margin-left: 0; }
    .detail-panel.open { width: min(480px, 46vw); }
    .panel-backdrop.show { display: block; position: fixed; inset: 0; z-index: 29;
                           background: rgb(15 23 42 / var(--a-4)); }
  }
  @media (max-width: 991px) {
    .calendar { display: none; }
    .agenda { display: block; }
  }
  @media (max-width: 767px) {
    .rail { position: fixed; bottom: 0; left: 0; right: 0; top: auto; width: 100%; height: 56px;
            flex-direction: row; justify-content: space-around; border-right: none;
            border-top: 1px solid var(--border); }
    .rail-sep { display: none; }
    .flyout { left: 0; width: 100vw; bottom: 56px; }
    .detail-panel.open { width: 100vw; }
    .view-area { padding-bottom: 56px; }
  }
```

- [ ] **Step 2: 검증** — 1440 / 1366 / 992 / 375 각각에서 `colW`(또는 아젠다 표시)와 패널 동작 확인

- [ ] **Step 3: 커밋**

---

### Task 5: 모바일 아젠다 렌더

- [ ] **Step 1: CSS + `renderAgenda()`**

```js
  function renderAgenda() {
    const wrap = document.getElementById('agenda');
    wrap.replaceChildren();
    const { y, m } = state.currentMonth;
    const prefix = `${y}-${String(m + 1).padStart(2, '0')}`;
    const groups = window.CalLib.groupByDate(
      getFiltered().filter((c) => (c.saleDate || '').startsWith(prefix)), effectiveRating);
    if (!groups.length) { wrap.appendChild(el('div', { cls: 'cal-empty', text: '이 달에는 표시할 매각기일이 없습니다.' })); return; }
    const dows = ['일','월','화','수','목','금','토'];
    for (const g of groups) {
      const d = new Date(g.date + 'T00:00:00');
      wrap.appendChild(el('div', { cls: 'agenda-head',
        text: `${d.getMonth()+1}월 ${d.getDate()}일 (${dows[d.getDay()]}) · ${g.count}건` }));
      for (const c of g.items) wrap.appendChild(buildAgendaRow(c));
    }
  }
```

- [ ] **Step 2: 375px 검증** — 첫 화면 노출 사건 ≥ 3건, 가로 오버플로 0

- [ ] **Step 3: 커밋**

---

## 완료 기준

| # | 기준 | Before | 목표 |
|---|---|---|---|
| 1 | 크롬 높이 (`view-wrap.top`) | 237px | **≤ 100px** |
| 2 | 패널 기본폭 @1440 | 936px | **380~480px** |
| 3 | col @1440 (패널 열림) | 90px | **≥ 211px** |
| 4 | col @992 (오버레이) | — | **≥ 211px** |
| 5 | 레일 폭 | 없음 | **64px** |
| 6 | 375px 첫 화면 사건 | 0건 | **≥ 3건** |
| 7 | 375px 가로 오버플로 | — | **0** |
| 8 | 단위 테스트 | 47 | **51 pass, 0 fail** |
