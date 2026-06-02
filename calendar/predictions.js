/**
 * 내 예상 낙찰가 — 사용자 주관 베팅 저장소 (제3의 소유권 계층)
 *
 * cases.js(모델 예측·sourcing 소유) / results.js(실측·회고 소유)와 물리 분리.
 * 같은 사건번호 id로 join. 매각 결과(results.js soldPrice)가 도래하면
 * index.html이 [내 예상 N개 + 모델 예측(감정가×예측매각가율) vs 실측] 3자 오차를 자동 렌더.
 *
 * 입력: 채팅으로 LLM에게 지시 → LLM이 이 파일에 기록·push.
 *   예) "11474 예상낙찰가 2.2억 보수, 2.4억 공격"
 *       "11474 예상낙찰가 추가 2.4억 공격"  (둘째 칸 추가)
 *   사건당 bids 최대 2개. 3번째 입력 시 어느 칸(①/②)을 교체할지 확인 후 기록.
 *
 * 스키마:
 *   "<id>": {
 *     predictedAt: "YYYY-MM-DD",        // 최초 입력일(엔트리 기준). bid별 at 없으면 이 값 사용
 *     bids: [                            // 최대 2개
 *       { value: <원>, memo: "<한 줄 근거>", at: "YYYY-MM-DD"(선택) },
 *       ...
 *     ]
 *   }
 *
 * 모델 예측 낙찰가 = 감정가 × 예측 매각가율(saleRateMu → saleRate → 자동도출).
 * 회고 자동 비교는 별도 routine 변경 없이 index.html 렌더 시점 join으로 처리.
 */

window.AUCTION_PREDICTIONS_VERSION = "0.1.0";
window.AUCTION_PREDICTIONS_UPDATED = "2026-06-02";

window.AUCTION_PREDICTIONS = {
  "2025타경12974": {
    predictedAt: "2026-06-02",
    bids: [
      { value: 285000000, memo: "차노픽" },
      { value: 290000000, memo: "써니픽" }
    ]
  },
  "2025타경12665": {
    predictedAt: "2026-06-02",
    bids: [
      { value: 150000000, memo: "차노픽" }
    ]
  },
  "2025타경11474": {
    predictedAt: "2026-06-02",
    bids: [
      { value: 200000000, memo: "차노픽" }
    ]
  }
};
