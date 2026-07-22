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

  return { TAXONOMY: TAXONOMY, caseIdOf: caseIdOf, deriveAuctionFacts: deriveAuctionFacts, costTotal: costTotal, holdingDays: holdingDays, daysBetween: daysBetween };
});
