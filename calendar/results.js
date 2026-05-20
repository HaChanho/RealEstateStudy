/**
 * 경매 낙찰 결과 — 회고(weekly-retrospective) 전용 저장소
 *
 * cases.js(예측·sourcing, daily-sourcing 소유)와 물리적으로 분리.
 * 사건번호 id로 join하여 캘린더 디테일 패널에서 "예측 vs 실측"을 표시한다.
 *
 * 소유: weekly-retrospective routine. cases.js는 절대 건드리지 않는다.
 * append-only: 한 번 채운 결과는 덮어쓰지 않음(정정은 새 회고 세션 entry로).
 * 예측 스냅샷(predictedSaleRate·verdict)을 동봉 — cases.js의 saleRate가 후에 바뀌어도 비교가 고정됨.
 *
 * 필드:
 *   status        : sold | failed | changed | withdrawn | postponed | unknown
 *   soldPrice     : 낙찰가(원). 행크옥션 비로그인 API는 마스킹 → null 가능. 구독계정 보강 시 채움.
 *   soldRate      : 낙찰가/감정가
 *   bidderCount   : 응찰자수(API bid_count, 비마스킹). 낙찰가 없을 때 수요 강도 대리지표.
 *   quadrant      : TP|FP|FN|TN|null  (verdict GO/NO-GO × sold/failed, sold일 때만)
 *   predictedSaleRate / predictedVerdict : 회고 시점 cases.js 스냅샷
 *   saleRateError : soldRate - predictedSaleRate (낙찰가 보강 후 산출)
 *   priceMasked   : 낙찰가가 마스킹 상태인지
 *   lesson        : 한 줄 학습
 *   source        : hauction-api | hauction-chrome | user-assist
 *   retrospectedAt: 회고 실행일
 */

window.AUCTION_RESULTS_VERSION = "0.1.0";
window.AUCTION_RESULTS_UPDATED = "2026-05-20";

window.AUCTION_RESULTS = {
  "2025타경12066": {
    status: "sold", soldPrice: 298309990, soldRate: 0.904, bidderCount: 11,
    secondBid: 292590000,
    saleDateActual: "2026-05-13", quadrant: "FN",
    predictedSaleRate: 0.876, predictedVerdict: "fail", saleRateError: 0.028,
    bidGapPct: null, priceMasked: false,
    lesson: "78%컷으로 거절했으나 11명 응찰·90.4% 낙찰(예측 87.6%보다 +2.8pp 높음) — 78% 일괄컷 명백히 과도(FN). 2위와 ₩5.7M 초박빙 과열. 동일번지 87/89/87% + 90.4%로 상승 추세",
    source: "hauction-chrome", retrospectedAt: "2026-05-20",
  },
  "2025타경12090": {
    status: "sold", soldPrice: 225500000, soldRate: 0.835, bidderCount: 11,
    secondBid: 218999999,
    saleDateActual: "2026-05-13", quadrant: "FN",
    predictedSaleRate: null, predictedVerdict: "fail", saleRateError: null,
    bidGapPct: null, priceMasked: false,
    lesson: "D+1 분석시간 부족으로 미평가, 11명 응찰·83.5% 낙찰 — 운영 FN. KB 239M>낙찰 225.5M(KB갭 ₩13.5M 존재, 진입 검토 가치 있었음). 분석 선행 필요",
    source: "hauction-chrome", retrospectedAt: "2026-05-20",
  },
  "2025타경11500": {
    status: "unknown", soldPrice: null, soldRate: null, bidderCount: null,
    saleDateActual: null, quadrant: null,
    predictedSaleRate: 0.755, predictedVerdict: "fail", saleRateError: null,
    bidGapPct: null, priceMasked: true,
    lesson: "5/11~5/20 매각 리스트 미출현 — 변경/취하 추정, IRR-margin 거절은 시장 미검증(검증불가). 구독계정에서 사건 상태 확인 필요",
    source: "hauction-api", retrospectedAt: "2026-05-20",
  },
  "2025타경41695": {
    status: "sold", soldPrice: null, soldRate: null, bidderCount: 9,
    saleDateActual: "2026-05-12", quadrant: null,
    predictedSaleRate: null, predictedVerdict: "fail", saleRateError: null,
    bidGapPct: null, priceMasked: true,
    lesson: "면적 114.31㎡ 타깃 시장 밖 — 캘리브레이션 제외(참고: 2유찰 후 9명 응찰)",
    source: "hauction-api", retrospectedAt: "2026-05-20",
  },
  "2025타경42260": {
    status: "sold", soldPrice: null, soldRate: null, bidderCount: 1,
    saleDateActual: "2026-05-12", quadrant: null,
    predictedSaleRate: null, predictedVerdict: "fail", saleRateError: null,
    bidGapPct: null, priceMasked: true,
    lesson: "면적 134.81㎡ 타깃 시장 밖 — 캘리브레이션 제외(참고: 1명 응찰, 대형 저수요)",
    source: "hauction-api", retrospectedAt: "2026-05-20",
  },
};
