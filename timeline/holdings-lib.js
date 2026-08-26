// 공유 순수함수 — Node(require)와 브라우저(window.HoldingsLib) 양쪽. 부수효과·Date.now 없음(테스트 위해 today는 인자).
(function (factory) {
  const lib = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = lib;
  if (typeof window !== 'undefined') window.HoldingsLib = lib;
})(function () {
  const TAXONOMY = ['취득세','법무등기','채권매입','대출부대','명도비','미납관리비','대출이자','재산세','공실관리비','보험','수리비','중개수수료','양도세','중도상환수수료','기타'];

  function caseIdOf(sourceResultKey) { return String(sourceResultKey || '').split('@')[0]; }

  function deriveAuctionFacts(holding, RESULTS, CASES) {
    const key = holding && holding.sourceResultKey;
    const r = (RESULTS && RESULTS[key]) || null;
    const caseId = caseIdOf(key);
    const c = (CASES || []).find(function (x) { return x.id === caseId; }) || null;
    return {
      caseId: caseId,
      complex: c ? c.complex : null,
      court: c ? c.court : null,
      dongHo: c ? c.dongHo : null,
      address: c ? c.address : null,
      areaSqm: c ? c.areaSqm : null,
      appraisalPrice: c ? c.appraisalPrice : null,
      reportUrl: c ? c.reportUrl : null,
      wonPrice: r ? r.soldPrice : null,
      wonDate: r ? r.saleDateActual : null,
      bidderCount: r && r.bidderCount != null ? r.bidderCount : null,
      myResult: r ? r.myResult : null,
    };
  }

  // out=지출(+), in=환급/역분개(−). reversal은 반대 direction·동일 amount라 서명합이 상쇄.
  function costTotal(holding) {
    return (holding.costs || []).reduce(function (s, e) {
      const sign = e.direction === 'in' ? -1 : 1;
      return s + sign * (Number(e.amount) || 0);
    }, 0);
  }

  function daysBetween(aISO, bISO) { return Math.round((Date.parse(bISO) - Date.parse(aISO)) / 86400000); }

  function holdingDays(holding, todayISO) {
    const won = (holding.milestones || []).find(function (m) { return m.key === 'won'; });
    const start = won && won.at;
    if (!start) return null;
    const end = holding.disposition === 'sold' ? (holding.resaleClosedAt || todayISO) : todayISO;
    return daysBetween(start, end);
  }


  // ===== 재무 지표 (§Q1) =====
  // 렌더 코드에 산식을 두지 않는다 — 시뮬레이션과 실현손익이 다른 식을 쓰면
  // 매도 순간 숫자가 점프한다. 전부 여기서 계산한다.

  const BROKERAGE_RATE = 0.004;   // 매도 중개수수료 0.4%
  const ACQ_CATS = ['취득세', '법무등기', '채권매입', '대출부대'];

  function signed(e) { return (e && e.direction === 'in' ? -1 : 1) * (Number(e && e.amount) || 0); }

  // 취득부대비 — 잔금·등기 시점에 확정되는 비용만. 보유비용(대출이자 등)은 제외.
  function acquisitionCosts(h) {
    return (h && h.costs || []).filter((c) => ACQ_CATS.indexOf(c.category) >= 0)
      .reduce((s, c) => s + signed(c), 0);
  }

  // 취득총원가 C = 낙찰가 + 취득부대비
  function totalCost(h, facts) {
    const won = facts && facts.wonPrice != null ? facts.wonPrice : 0;
    return won + acquisitionCosts(h);
  }

  // 자기자본 E = C − 조달합계. 0 이면 수익률·IRR 이 정의되지 않는다.
  function equity(h, facts) {
    const fund = (h && h.funding || []).reduce((s, x) => s + (Number(x && x.amount) || 0), 0);
    return totalCost(h, facts) - fund;
  }

  // 변동비 — 아직 집행 전이지만 매도까지 확정적으로 발생할 비용.
  // 원장에 plannedCosts 가 있으면 그것을 쓰고, 없으면 cases.js 모델 추정치에서 파생한다
  // (수리비 repairCost + 명도 등 costBreakdown.etc). 숫자를 원장에 복제하지 않기 위함.
  // 중개수수료는 여기 넣지 않는다 — 매도가 비례라 BROKERAGE_RATE 로 따로 처리한다.
  // 취득비는 이미 costs[] 에 실적으로 있으므로 넣지 않는다.
  function plannedTotal(h, caseData) {
    const explicit = (h && h.plannedCosts) || null;
    if (explicit) return explicit.reduce((s, x) => s + (Number(x && x.amount) || 0), 0);
    if (!caseData) return 0;
    const cb = caseData.costBreakdown || {};
    return (Number(caseData.repairCost) || 0) + (Number(cb.etc) || 0);
  }

  // 변동비 총액 = 미집행 예정비 + 미계상 확정부채.
  // 미계상 부채(예: 공용 체납관리비)는 근거가 확정된 채무라 손익분기에 반드시 들어가야 한다.
  function variableCosts(h, caseData) {
    return plannedTotal(h, caseData) + unbookedTotal(h);
  }

  // 주담보(경락잔금대출) 외 조달 — 신용대출 등. 원리금 상환이 아니라 이자만 계산한다.
  function otherFunding(h) {
    const principal = h && h.loan ? h.loan.principal : null;
    return (h && h.funding || []).filter((x) => x && x.amount !== principal);
  }

  // 원리금균등 상환 잔액. k 회차 납입 후 잔액.
  function loanBalance(h, k) {
    const ln = h && h.loan;
    if (!ln || !ln.principal) return 0;
    const i = (ln.rate || 0) / 12;
    const M = ln.repayment && ln.repayment.monthlyPayment;
    if (!M) return ln.principal;
    let bal = ln.principal;
    for (let n = 1; n <= k; n++) bal -= (M - bal * i);
    return Math.max(0, bal);
  }

  // 금융비용(m) = 경락이자 누계 + 중도상환수수료 + 기타조달 이자
  // m = 잔금일로부터의 개월 수.
  function financeCost(h, m) {
    const ln = h && h.loan;
    if (!ln) return 0;
    const i = (ln.rate || 0) / 12;
    const M = ln.repayment && ln.repayment.monthlyPayment;
    // 스텁이자 — 실행일~첫 납입일 사이 일할 이자. 원장에 실적으로 존재한다.
    const firstAt = ln.repayment && ln.repayment.firstPaidAt;
    const stubEntry = (h.costs || []).find((c) => c.category === '대출이자' && c.occurredAt === firstAt);
    let interest = stubEntry ? Number(stubEntry.amount) || 0 : 0;
    let bal = ln.principal || 0;
    for (let k = 1; k <= m; k++) { const ii = bal * i; interest += ii; if (M) bal -= (M - ii); }
    const prepay = bal * (ln.prepayFeeRate || 0);
    const others = otherFunding(h)
      .reduce((s, x) => s + (Number(x.amount) || 0) * (Number(x.rate) || 0) * m / 12, 0);
    return interest + prepay + others;
  }

  // 손익분기 매도가 — 이 값 이상으로 팔아야 본전. 중개수수료를 매도가에 비례해 뺀다.
  function breakEvenPrice(h, facts, m, caseData) {
    return (totalCost(h, facts) + financeCost(h, m) + variableCosts(h, caseData)) / (1 - BROKERAGE_RATE);
  }

  // 세전이익 — 매도가 P, 보유 m 개월 가정.
  function pretaxProfit(h, facts, salePrice, m, caseData) {
    return salePrice * (1 - BROKERAGE_RATE) - totalCost(h, facts) - financeCost(h, m)
      - variableCosts(h, caseData);
  }

  // 월 런레이트 — 손익 기준(이자만)과 현금 기준(원리금 전액)은 다르다.
  function monthlyRunRate(h) {
    const ln = h && h.loan;
    if (!ln) return { interest: 0, cash: 0 };
    const i = (ln.rate || 0) / 12;
    const others = otherFunding(h)
      .reduce((s, x) => s + (Number(x.amount) || 0) * (Number(x.rate) || 0) / 12, 0);
    const M = (ln.repayment && ln.repayment.monthlyPayment) || 0;
    return { interest: (ln.principal || 0) * i + others, cash: M + others };
  }

  // 실현 세전이익 — 시뮬레이션과 같은 식을 쓴다(Q7-2: 구 코드는 중개·중도상환을 빠뜨렸다).
  function realizedPretax(h, facts) {
    if (!h || h.disposition !== 'sold' || h.resalePrice == null) return null;
    const balAt = (h.milestones || []).find((m) => m.key === 'balance');
    const months = (balAt && balAt.at && h.resaleClosedAt)
      ? Math.max(0, Math.round(daysBetween(balAt.at, h.resaleClosedAt) / 30.44)) : 0;
    const allCosts = (h.costs || []).reduce((s, c) => s + signed(c), 0);
    const won = facts && facts.wonPrice != null ? facts.wonPrice : 0;
    return h.resalePrice * (1 - BROKERAGE_RATE) - won - allCosts
      - loanBalance(h, months) * ((h.loan && h.loan.prepayFeeRate) || 0);
  }

  // 미계상 부채 — 표시 전용. 손익분기 V 에 넣지 않는다(plannedCosts 와 이중 계상 방지).
  function unbookedTotal(h) {
    return (h && h.unbookedLiabilities || []).reduce((s, x) => s + (Number(x && x.amount) || 0), 0);
  }

  return {
    TAXONOMY: TAXONOMY, caseIdOf: caseIdOf, deriveAuctionFacts: deriveAuctionFacts,
    costTotal: costTotal, holdingDays: holdingDays, daysBetween: daysBetween,
    BROKERAGE_RATE: BROKERAGE_RATE, ACQ_CATS: ACQ_CATS,
    acquisitionCosts: acquisitionCosts, totalCost: totalCost, equity: equity,
    plannedTotal: plannedTotal, unbookedTotal: unbookedTotal, variableCosts: variableCosts,
    loanBalance: loanBalance, financeCost: financeCost,
    breakEvenPrice: breakEvenPrice, pretaxProfit: pretaxProfit,
    monthlyRunRate: monthlyRunRate, realizedPretax: realizedPretax,
  };
});
