/**
 * 내 예상 낙찰가 — 사용자 주관 베팅 저장소 (제3의 소유권 계층)
 *
 * cases.js(모델 예측·sourcing 소유) / results.js(실측·회고 소유)와 물리 분리.
 * 매각 결과(results.js soldPrice)가 도래하면 index.html이
 * [내 예상 N개 + 모델 예측(감정가×예측매각가율) vs 실측] 3자 오차를 자동 렌더.
 *
 * ── 키 스키마 (v0.2.0~) : 복합키 `사건번호@saleDate` ──────────────────────────
 * results.js와 동일 축. 사건이 유찰·변경 후 새 회차로 재일정되면 최저가가 바뀌어
 * 예상 낙찰가도 달라지므로 회차(매각기일)별로 예상을 분리한다.
 * → 신규 엔트리는 `사건번호@매각기일`(예: "2025타경11474@2026-06-16")로 키잉.
 *   기록 전 cases.js에서 해당 사건의 현재 saleDate를 조회해 키를 만든다.
 * → 레거시 id-only 키(아래 5건)는 보존. 렌더(predictionBids)가 "복합키 우선 →
 *   레거시 id 폴백"으로 하위호환 → 일괄 마이그레이션 불필요.
 *
 * 입력: 채팅으로 LLM에게 지시 → LLM이 cases.js saleDate 확인 후 복합키로 기록·push.
 *   예) "11474 예상낙찰가 2.2억 보수, 2.4억 공격"
 *       "11474 예상낙찰가 추가 2.4억 공격"  (둘째 칸 추가)
 *   사건당 bids 최대 2개. 3번째 입력 시 어느 칸(①/②)을 교체할지 확인 후 기록.
 *
 * 스키마:
 *   "<id>@<saleDate>": {              // 신규. 레거시는 "<id>" (폴백 호환)
 *     predictedAt: "YYYY-MM-DD",        // 최초 입력일(엔트리 기준). bid별 at 없으면 이 값 사용
 *     actual: true,                     // (선택, v0.3.0) 실제 입찰한 사건 — index.html이 "내 입찰가(실제)"로 렌더,
 *                                       //   결과 도래 시 내 입찰가 vs 낙찰가(낙찰/패찰) 비교. 미지정이면 "내 예상" 동작.
 *     bids: [                            // 최대 2개 (actual이면 1개 = 실제 입찰가)
 *       { value: <원>, memo: "<한 줄 근거>", at: "YYYY-MM-DD"(선택) },
 *       ...
 *     ]
 *   }
 *
 * 모델 예측 낙찰가 = 감정가 × 예측 매각가율(saleRateMu → saleRate → 자동도출).
 * 회고 자동 비교는 별도 routine 변경 없이 index.html 렌더 시점 join으로 처리.
 */

window.AUCTION_PREDICTIONS_VERSION = "0.3.0";
window.AUCTION_PREDICTIONS_UPDATED = "2026-06-14";

window.AUCTION_PREDICTIONS = {
  "2025타경12295": {
    predictedAt: "2026-06-04",
    bids: [
      { value: 165000000, memo: "차노픽" }
    ]
  },
  "2025타경12815": {
    predictedAt: "2026-06-04",
    bids: [
      { value: 185000000, memo: "차노픽" },
      { value: 190000000, memo: "써니픽" }
    ]
  },
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
  "2025타경11474@2026-06-15": {
    predictedAt: "2026-06-14",
    actual: true,
    bids: [
      { value: 207219743, memo: "실제 입찰가", at: "2026-06-15" }
    ]
  }
};
