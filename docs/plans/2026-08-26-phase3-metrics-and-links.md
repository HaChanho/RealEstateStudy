# Phase 3 — 지표 교체 · 계획-실제 대조 · 페이지 연결 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans.

**Goal:** 캘린더와 타임라인이 **"내 모델이 얼마나 맞았나"라는 같은 질문에 같은 축으로** 답하게 만든다. 현재 캘린더는 틀린 지표(FP가 구조적으로 0)를 광고하고, 타임라인은 예측 데이터를 아예 읽지 않는다.

**스펙:** §7.2 · §7.4 · §7.5(R1·R2·S2·S3) · §7.6(L1~L3)

**브랜치:** `claude/ui-phase0`

---

## 근거 (실측)

**성적표 — 현재 지표는 방어 불가**
```
quadrant 분포 : TP 37 · FN 16 · TN 3 · null 56   (FP = 0)
status        : sold 66 · unknown 23 · changed 13 · failed 7 · stayed 2 · withdrawn 1
```
`quadrant = verdict GO/NO-GO × sold/failed` 인데 매각 41 : 유찰 5 시장에서 "GO 했는데 유찰"은 거의 발생하지 않는다.
**`GO 적중률 100%` 는 실력이 아니라 정의의 부산물이다.** 표본의 절반(56/112)은 quadrant 가 null.

**대체 지표 — 매각가율 예측 오차 (검산 완료)**
```
predictedSaleRate & soldRate 둘 다 있는 건 : 19
평균 오차   −0.6%p   (모델이 살짝 높게 봄)
절대오차 MAE  5.6%p
표준편차     7.5%p
범위        −11.7%p ~ +20.3%p
±5%p 이내   11/19  ·  ±10%p 이내  17/19
```
*주의: `results.js` 의 값은 **분수**(0.876)다. 퍼센트포인트로 쓰려면 ×100.*

**타임라인 — 데이터가 있는데 안 읽는다**
```
원장 키    : forecast{frozen, bidBasis, projectedBid, assumedCosts{취득세·법무등기·대출이자·중개}, assumedAt, source}
             loan.repayment{type, termMonths, dayOfMonth, monthlyPayment, firstPaidAt, firstPaymentNote, exitPlan, note}
index.html : "forecast" 언급 0회
             읽는 loan 필드 = lender/principal/rate/executedAt/prepayFeeRate/term/memo (7개, repayment 없음)
```

**연결 — 조인 키는 완성, 링크는 0개**
```
myResult : won 1 (2024타경119033@2026-07-09) · lost 3   — 4건 전부 cases.js 매칭
원장 sourceResultKey = 낙찰 건 키와 일치
캘린더 → 타임라인 링크 0개 · 타임라인 → 캘린더 링크 0개
results.js 고아 32/112 — 성적표에서 조용히 누락
```

---

### Task 1: `calibration` — 예측 오차 통계 (TDD)

**Files:** `shared/cal-lib.js`, `_workspace/_tests/cal-lib.test.js`

- [ ] **Step 1: 실패하는 테스트**

```js
// ===== calibration =====
test('calibration: 평균오차·MAE·표본수 (분수 입력 → %p 출력)', () => {
  const R = {
    a: { predictedSaleRate: 0.80, soldRate: 0.85 },   // +5.0%p
    b: { predictedSaleRate: 0.90, soldRate: 0.85 },   // −5.0%p
    c: { predictedSaleRate: 0.70, soldRate: 0.80 },   // +10.0%p
  };
  const r = L.calibration(R);
  assert.strictEqual(r.n, 3);
  assert.strictEqual(Math.round(r.meanErr * 10) / 10, 3.3);
  assert.strictEqual(Math.round(r.mae * 10) / 10, 6.7);
});

test('calibration: 한쪽만 있는 건은 제외', () => {
  const r = L.calibration({ a: { predictedSaleRate: 0.8 }, b: { soldRate: 0.9 }, c: { predictedSaleRate: 0.8, soldRate: 0.8 } });
  assert.strictEqual(r.n, 1);
});

test('calibration: 표본 0 이면 n=0 이고 통계는 null', () => {
  const r = L.calibration({});
  assert.strictEqual(r.n, 0);
  assert.strictEqual(r.mae, null);
});

test('calibration: within 임계 카운트', () => {
  const r = L.calibration({
    a: { predictedSaleRate: 0.80, soldRate: 0.82 },   // 2%p
    b: { predictedSaleRate: 0.80, soldRate: 0.88 },   // 8%p
    c: { predictedSaleRate: 0.80, soldRate: 0.95 },   // 15%p
  });
  assert.strictEqual(r.within5, 1);
  assert.strictEqual(r.within10, 2);
});
```

- [ ] **Step 2: 실패 확인** → `L.calibration is not a function`

- [ ] **Step 3: 구현** (`cal-lib.js` return 앞)

```js
  // 매각가율 예측 오차 — TP/FP/FN/TN 을 대체하는 캘리브레이션 지표.
  // quadrant 는 FP 가 구조적으로 0(매각 41:유찰 5 시장에서 "GO 했는데 유찰"이 없음)이라
  // "GO 적중률 100%" 가 실력이 아니라 정의의 부산물이 된다.
  // results.js 의 rate 는 분수(0.876)이므로 ×100 해서 %p 로 만든다.
  function calibration(results) {
    const errs = [];
    for (const k in (results || {})) {
      const r = results[k];
      if (!r || r.predictedSaleRate == null || r.soldRate == null) continue;
      errs.push((r.soldRate - r.predictedSaleRate) * 100);
    }
    const n = errs.length;
    if (!n) return { n: 0, meanErr: null, mae: null, sd: null, min: null, max: null, within5: 0, within10: 0 };
    const mean = errs.reduce((a, b) => a + b, 0) / n;
    const mae = errs.reduce((a, b) => a + Math.abs(b), 0) / n;
    const sd = n > 1 ? Math.sqrt(errs.reduce((a, e) => a + (e - mean) ** 2, 0) / (n - 1)) : 0;
    const sorted = [...errs].sort((a, b) => a - b);
    return {
      n: n, meanErr: mean, mae: mae, sd: sd,
      min: sorted[0], max: sorted[n - 1],
      within5: errs.filter((e) => Math.abs(e) <= 5).length,
      within10: errs.filter((e) => Math.abs(e) <= 10).length,
    };
  }
```

- [ ] **Step 4: 통과 확인** → `pass 55`

- [ ] **Step 5: 실데이터 검산**

```bash
cd calendar && node -e '
global.window={}; require("./results.js");
const L=require("../shared/cal-lib.js");
const r=L.calibration(window.AUCTION_RESULTS);
console.log("n="+r.n, "평균 "+r.meanErr.toFixed(1)+"%p", "MAE "+r.mae.toFixed(1)+"%p",
  "SD "+r.sd.toFixed(1), "범위 "+r.min.toFixed(1)+"~"+r.max.toFixed(1),
  "±5 "+r.within5+"/"+r.n, "±10 "+r.within10+"/"+r.n);
'
```
Expected: `n=19 평균 -0.6%p MAE 5.6%p SD 7.5 범위 -11.7~20.3 ±5 11/19 ±10 17/19`

- [ ] **Step 6: 커밋**

---

### Task 2: 성적표 뷰 — 지표 교체

**Files:** `calendar/index.html`

- [ ] **Step 1: `renderResultStats` 를 캘리브레이션 기반으로 교체**

기존 `TP 정확GO / FP 헛GO / FN 놓친기회 / TN 정확NO-GO / NO-GO 정확도 / GO 적중률` 줄을 제거하고:

```
매각가율 예측 오차            n=19
평균 −0.6%p   절대오차 5.6%p
±5%p 이내 11/19 · ±10%p 이내 17/19
```

읽히는 문장을 함께 둔다: *"모델이 예측한 매각가율 vs 실제 낙찰가율 — 19건에서 평균 0.6%p 낮게 봤고, 보통 ±5.6%p 안에 들어옵니다."*

- [ ] **Step 2: `NO-GO 정확도` 는 문장으로 보존**

*"거른 물건 중 N%가 실제로는 팔렸습니다"* — 아픈 진실이므로 지우지 않는다.

- [ ] **Step 3: 고아 레코드 표시**

`results.js` 112키 중 32개가 `cases.js` 미매칭. 조용히 누락되면 표본이 왜곡되므로 `표본 제외 32건` 을 명시한다.

- [ ] **Step 4: 브라우저 검증** — `GO 적중률 100%` 문자열이 화면에서 사라졌는지, 캘리브레이션 수치가 표시되는지

- [ ] **Step 5: 커밋**

---

### Task 3: 타임라인 R1 — 계획 vs 실제 대조

**Files:** `timeline/index.html`

- [ ] **Step 1: `forecast` 섹션 렌더**

`render()` 안, 손익 섹션 앞에 추가. `h.forecast` 가 없으면 섹션 자체를 만들지 않는다.

| 항목 | 계획(얼림) | 실제 | 차이 |
|---|---|---|---|
| 낙찰가 | `forecast.projectedBid` | `f.wonPrice` | ±N (±N%) |
| 취득세 | `forecast.assumedCosts['취득세']` | 원장 집행분 합 | ±N |
| 법무등기 | 〃 | 〃 | ±N |
| 대출이자 | 〃 | 〃 | ±N |
| 중개 | 〃 | 〃 | ±N |

`forecast.assumedAt` · `bidBasis` 를 캡션으로 표기(언제 무엇을 기준으로 얼렸는지).

- [ ] **Step 2: 검증** — DOM 에 `projectedBid` 값이 존재하는지(현재 `false`)

- [ ] **Step 3: 커밋**

---

### Task 4: 타임라인 R2·S2·S3

- [ ] **Step 1: `loan.repayment` 승격** — `monthlyPayment`·`type`·`dayOfMonth`·`exitPlan` 을 KV 로. 지금은 2,257자 메모 산문에만 있다.
- [ ] **Step 2: S3 — `.pnl .kv .v`(18px/700)를 숫자 전용으로 한정.** 서술형 KV(`비고`·`만기`·`대출기관`)는 본문 스타일로 분리한다. 지금은 59자 문장이 금액과 같은 위계다.
- [ ] **Step 3: S2 — pending 마일스톤 `opacity:.5` 제거**, 전용 토큰 사용. 현재 명암비 `.d` 1.65:1 / `.k` 3.23:1 로 AA 미달인데 거기 담긴 게 "명도 협의기한"이라는 지금 가장 액션이 필요한 정보다.
- [ ] **Step 4: `:root` 잔여 하드코딩 3종을 토큰으로**
- [ ] **Step 5: 검증 + 커밋**

---

### Task 5: L1~L3 — 캘린더 ↔ 타임라인 연결

- [ ] **Step 1: L3 — 타임라인 URL 해시 연동.** `sel = ids[0]` 하드코딩 제거, `#h-<id>` 로 선택. L2 의 전제이자 새로고침 시 선택 유지에도 필요.
- [ ] **Step 2: L1 — 캘린더에 내 입찰 결과 배지.** `myResult === 'won'` → `낙찰`, `'lost'` → `패찰`. 현재 이 사실이 화면에 **전혀 없다**(won 1 · lost 3).
- [ ] **Step 3: L2 — `won` 배지에서 `../timeline/#h-<id>` 링크**
- [ ] **Step 4: 검증** — 캘린더에서 배지 4개, 링크 클릭 시 타임라인의 해당 물건이 선택되는지
- [ ] **Step 5: 커밋**

---

## 완료 기준

| # | 기준 | Before | 목표 |
|---|---|---|---|
| 1 | `GO 적중률 100%` 표시 | 있음 | **없음** |
| 2 | 캘리브레이션 지표 | 없음 | **n=19 · 평균 −0.6%p · MAE 5.6%p** |
| 3 | 고아 레코드 표시 | 조용히 누락 | **32건 명시** |
| 4 | 타임라인 `projectedBid` 렌더 | **0회** | 표시 |
| 5 | `monthlyPayment` KV | 메모 산문에만 | **구조화 KV** |
| 6 | pending 마일스톤 명암비 | 1.65:1 | **≥ 4.5:1** |
| 7 | 캘린더 내 입찰 결과 배지 | **0개** | **4개** (won 1 · lost 3) |
| 8 | 캘린더 → 타임라인 링크 | **0개** | 동작 |
| 9 | 타임라인 해시 연동 | 없음 | `#h-<id>` 동작 |
| 10 | 단위 테스트 | 51 | **55 pass, 0 fail** |
