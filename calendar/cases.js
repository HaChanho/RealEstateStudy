/**
 * 부동산 경매 케이스 데이터 — 누적 저장소
 *
 * 스키마: calendar/README.md 참고
 *
 * v0.6.0 (2026-05-15): 확장 윈도우 sourcing (충남·비조정수도권·충북) → 신규 51건
 * v0.5.0 (2026-05-13): 사건별 댓글 (Giscus mapping=specific + term=caseId)
 * v0.4.x (2026-05-13): salesHistory + 자동 saleRate 도출 + bid 시나리오 매트릭스
 * v0.3.0 (2026-05-13): salesHistory 필드 추가 (단지 매각 이력)
 * v0.2.x (2026-05-13): 캘린더/리스트 탭, deeplink, D-Day, naverData, Giscus
 * v0.1.0 (2026-05-13): 초기 46건
 */

window.AUCTION_SCHEMA_VERSION = "0.7.0";
window.AUCTION_LAST_UPDATED = "2026-06-15";

window.AUCTION_CASES = [
  {
    "id": "2024타경1971",
    "caseNumber": "2024타경1971",
    "court": "천안지원",
    "saleDate": "2026-05-12",
    "complex": "대림한들",
    "dongHo": "208동",
    "address": "천안 동남구 신부동",
    "areaSqm": 98.44,
    "appraisalPrice": 277000000,
    "minimumPrice": 193900000,
    "rounds": 1,
    "region": "천안동남",
    "regionPriority": 1,
    "rightsStatus": "—",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "expired",
    "verdictReason": "면적 초과(98.44㎡) + 매각기일 경과",
    "tags": [
      "면적초과"
    ],
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2024타경2899",
    "caseNumber": "2024타경2899(중복108476)",
    "court": "천안지원",
    "saleDate": "2026-05-18",
    "complex": "서해그랑블2차",
    "dongHo": "201동",
    "address": "아산 권곡동",
    "areaSqm": 84.99,
    "appraisalPrice": 224000000,
    "minimumPrice": 156800000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 3,
    "rightsStatus": "권리 안전(A)",
    "rightsRisk": "safe",
    "saleRate": 0.893,
    "saleRateNote": "행크옥션 84㎡ 3건 평균 88/90/90 (2024-12~2025-07)",
    "rating": null,
    "verdict": "fail",
    "verdictReason": "단지 매각가율 89.3% > 78% 기준 초과",
    "tags": [
      "아산",
      "매각가율초과"
    ],
    "sourcingSession": "2026-05-12 v1+v2 + 2026-05-13 행크옥션 보강",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-13",
    "naverComplexNo": 26893,
    "salesHistory": [
      {
        "caseNo": "2024-114600",
        "dongHo": "202동 9층 902호",
        "area": 84.99,
        "appraisal": 233000000,
        "soldPrice": 210510000,
        "soldRate": 0.9,
        "saleDate": "2025-07-29",
        "outlier": false
      },
      {
        "caseNo": "2024-114150",
        "dongHo": "203동 8층 803호",
        "area": 84.49,
        "appraisal": 233000000,
        "soldPrice": 210300000,
        "soldRate": 0.9,
        "saleDate": "2025-07-15",
        "outlier": false
      },
      {
        "caseNo": "2024-105828",
        "dongHo": "205동 9층 903호",
        "area": 84.99,
        "appraisal": 228000000,
        "soldPrice": 200100000,
        "soldRate": 0.88,
        "saleDate": "2024-12-23",
        "outlier": false
      }
    ]
  },
  {
    "id": "2024타경112185",
    "caseNumber": "2024타경112185",
    "court": "천안지원",
    "saleDate": "2026-05-12",
    "complex": "배방자이2북수마을",
    "dongHo": "102동",
    "address": "아산 배방읍",
    "areaSqm": 84.78,
    "appraisalPrice": 193000000,
    "minimumPrice": 135100000,
    "rounds": 6,
    "region": "아산",
    "regionPriority": 3,
    "rightsStatus": "HUG 우선변제권만(대항력 포기) — 인수X",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "expired",
    "verdictReason": "매각기일 경과(5/12)",
    "tags": [
      "아산",
      "HUG",
      "유찰6회"
    ],
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2024타경112215",
    "caseNumber": "2024타경112215",
    "court": "천안지원",
    "saleDate": "2026-05-19",
    "complex": "탕정삼성트라팰리스",
    "dongHo": "104동 401호",
    "address": "아산 탕정면 명암리 809",
    "areaSqm": 84.68,
    "appraisalPrice": 383000000,
    "minimumPrice": 268100000,
    "kbPrice": 395000000,
    "rounds": 7,
    "region": "아산",
    "regionPriority": 3,
    "rightsStatus": "임차권등기 + HUG 대항력포기확약서(2025-09-10)",
    "rightsRisk": "safe",
    "saleRate": 0.89,
    "saleRateNote": "84.68~84.99㎡ 5건 평균 (2026-04 94.8% / 2025-02 85.1% / 2024-04 101.3% 신건 / 2024-03 87.0% / 2023-08 65.0% 시장침체기). 2020년 신건 outlier(119.8%) 제외",
    "rating": null,
    "verdict": "fail",
    "verdictReason": "단지 매각가율 89% > 78% 기준 초과. 가장 최근 84㎡ 매각(2025-572) 94.8% — 입찰가 ₩340~₩365M 추정 시 매도가 ₩345M(최근 매각) 기준 마진 협소/손실. 호가 매도(₩400M+) 가정 시만 +₩30M 가능하나 단기 회전 비현실.",
    "tags": [
      "아산",
      "HUG",
      "대단지",
      "임차권등기",
      "매각가율초과",
      "단지이력풍부"
    ],
    "notes": "3,953세대 대단지, 2009년 준공. 84.68~84.99㎡ 단지 매각 사례 5건(2020 outlier 제외) 평균 매각가율 89%. 동급 조건 가장 최근 매각: 2025-572(302동 3층 84.73㎡, 2026-04) ₩345M. 우리 사건은 7차 도달이지만 단지 패턴상 매각가율 80% 이하 가능성 낮음. 단 주목: 2022-6019(401동 3층 301호 84.68㎡) 매각가율 65%로 우리 사건과 거의 동일 조건 — 시장 침체기였으나 저층·HUG 사건 응찰자 적었음을 시사. 호가 84.68㎡ ₩350M~₩510M 확인. 결정: finance.md v3.3 1순위 필터 미통과로 fail.",
    "aptInfoCode": "A33672501",
    "naverComplexNo": 107921,
    "sourcingSession": "2026-05-12 v1 → 2026-05-13 검증 + 공공 실거래 + 단지 매각 이력 보강",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-13",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2024&unique_number=112215",
    "naverData": {
      "source": "naver",
      "askingPrice": {
        "low": 350000000,
        "high": 510000000,
        "_note": "84.68㎡만 필터한 호가 (사용자 직접 확인)"
      },
      "recentTradeAvg": 332000000,
      "recentTrades": [
        {
          "date": "2026-04",
          "price": 382000000,
          "area": 84.68,
          "floor": 10
        },
        {
          "date": "2026-03",
          "price": 282000000,
          "area": 84.68,
          "floor": 1
        }
      ],
      "updatedAt": "2026-05-13",
      "_tradesSource": "molit_public (국토부 공공)"
    },
    "salesHistory": [
      {
        "caseNo": "2025-572",
        "dongHo": "302동 3층 301호",
        "area": 84.73,
        "appraisal": 364000000,
        "minPrice": 254800000,
        "soldPrice": 345000000,
        "soldRate": 0.948,
        "kbRate": 0.958,
        "saleDate": "2026-04-20",
        "outlier": false
      },
      {
        "caseNo": "2024-4147",
        "dongHo": "401동 22층 2201호",
        "area": 84.68,
        "appraisal": 423000000,
        "minPrice": 296100000,
        "soldPrice": 359999000,
        "soldRate": 0.851,
        "kbRate": 0.911,
        "saleDate": "2025-02-17",
        "outlier": false
      },
      {
        "caseNo": "2023-113914",
        "dongHo": "103동 13층 1303호",
        "area": 84.99,
        "appraisal": 355000000,
        "minPrice": 355000000,
        "soldPrice": 359570000,
        "soldRate": 1.013,
        "kbRate": 0.934,
        "saleDate": "2024-04-30",
        "outlier": false,
        "outlierReason": "신건 매각 (100% 입찰)"
      },
      {
        "caseNo": "2023-103399",
        "dongHo": "501동 34층 3401호",
        "area": 84.68,
        "appraisal": 423000000,
        "minPrice": 296100000,
        "soldPrice": 367900000,
        "soldRate": 0.87,
        "kbRate": 0.931,
        "saleDate": "2024-03-26",
        "outlier": false
      },
      {
        "caseNo": "2022-6019",
        "dongHo": "401동 3층 301호",
        "area": 84.68,
        "appraisal": 489000000,
        "minPrice": 239610000,
        "soldPrice": 317850000,
        "soldRate": 0.65,
        "kbRate": 0.805,
        "saleDate": "2023-08-29",
        "outlier": false,
        "outlierReason": "시장침체기·49% 유찰 후 매각. 단 우리 사건과 동·층·면적 거의 동일 조건이라 참고 가치 높음"
      },
      {
        "caseNo": "2024-3380",
        "dongHo": "103동 22층 2204호",
        "area": 144.43,
        "appraisal": 818000000,
        "minPrice": 572600000,
        "soldPrice": 572770000,
        "soldRate": 0.7,
        "kbRate": 0.83,
        "saleDate": "2025-06-17",
        "outlier": true,
        "outlierReason": "다른 평형(144㎡, 대형)"
      },
      {
        "caseNo": "2024-5959",
        "dongHo": "403동 5층 503호",
        "area": 73.93,
        "appraisal": 340000000,
        "minPrice": 238000000,
        "soldPrice": 330000000,
        "soldRate": 0.971,
        "kbRate": 0.943,
        "saleDate": "2025-07-22",
        "outlier": true,
        "outlierReason": "다른 평형(73㎡)"
      },
      {
        "caseNo": "2022-110390",
        "dongHo": "401동 31층 3103호",
        "area": 107.04,
        "appraisal": 577000000,
        "minPrice": 403900000,
        "soldPrice": 536000000,
        "soldRate": 0.929,
        "kbRate": 0.993,
        "saleDate": "2023-08-29",
        "outlier": true,
        "outlierReason": "다른 평형(107㎡)"
      },
      {
        "caseNo": "2020-1584",
        "dongHo": "302동 3층 301호",
        "area": 84.73,
        "appraisal": 278000000,
        "minPrice": 278000000,
        "soldPrice": 332990000,
        "soldRate": 1.198,
        "kbRate": 0.925,
        "saleDate": "2020-12-01",
        "outlier": true,
        "outlierReason": "2020년 시장 과열기, 신건 매각"
      }
    ]
  },
  {
    "id": "2025타경624",
    "caseNumber": "2025타경624",
    "court": "천안지원",
    "saleDate": "2026-06-23",
    "complex": "모드니에",
    "dongHo": "102동 1005호",
    "address": "천안 동남구 병천면 병천리 240",
    "areaSqm": 74,
    "appraisalPrice": 157000000,
    "minimumPrice": 109900000,
    "kbPrice": 157500000,
    "rounds": 1,
    "region": "천안동남",
    "regionPriority": 1,
    "rightsStatus": "권리 깨끗(인수 없음)",
    "rightsRisk": "safe",
    "saleRate": 0.768,
    "rating": null,
    "verdict": "hold",
    "verdictReason": "관망 / 마진형 저가 한정 — 보수 매도 기준 1.73억(최근 실거래 (현 호가 0건)) · 입찰권장 1.56억(70%) · 세전 EP70 1005만원(watchlist) · 세후 740만원. 권리 raw 미검증(D-day 등기·임차조사 확인 필요). (2026-06-03 v9 재분석) — [v10.1 카페재분석] 🔻유동성 최악: 외곽(병천)+실거래0+구축 → 매도 장기화 위험 HIGH. EP70도 낮아 비추 강화. · v10 재계산(본인 24%·100%대출, 2026-06-15)",
    "tags": [
      "천안동남",
      "모드니에",
      "외곽",
      "▷watchlist",
      "저신뢰",
      "v8수리제외",
      "v4sweep"
    ],
    "sourcingSession": "2026-05-12 v1 → 2026-05-13 검증 + 2026-06-01 v4 sweep",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-06-01",
    "saleRateMu": 0.768,
    "saleRateSigma": 0.05,
    "saleRateN": 5,
    "k70": 0.768,
    "bid70": 155700000,
    "neutralSalePrice": 173000000,
    "repairCost": 25000000,
    "expectedProfit70": 10053657,
    "interestTier": "watchlist",
    "saleRateNote": "지지옥션 단지매각 5건 낙찰가율 76.8%·평균응찰 3.4명. 준공2005(21년). S=KB일반 1.575억 — 실거래 0건이라 신뢰낮음. (2026-06-01 v4 sweep)",
    "marketAnchorBasis": "최근 실거래 (현 호가 0건)",
    "flipRepair": 8000000,
    "evictionEst": 3000000,
    "costBreakdown": {
      "acq": 2218843,
      "brokerage": 692000,
      "etc": 2000000,
      "fixedTotal": 4910843,
      "interest": {
        "m3": 1751625,
        "m4": 2335500,
        "m5": 2919375,
        "m6": 3503250
      },
      "anchorMonths": 4,
      "k70": 0.9,
      "ltv": 1.0,
      "rate": 0.045
    },
    "taxOwner": "self",
    "taxableProfit": 10053657,
    "incomeTax": 2654165,
    "marginalRate": 0.264,
    "afterTaxProfit": 7399492,
    "naverData": {
      "source": "naver",
      "complexNo": "25835",
      "pyeong": {
        "no": "1",
        "exc": 74.04,
        "sup": 97.58,
        "name": "97"
      },
      "askingPrice": null,
      "askingList": [],
      "recentTrades": [
        {
          "date": "2026-01-13",
          "price": 173000000,
          "floor": 7,
          "area": 74.04
        },
        {
          "date": "2025-08-26",
          "price": 160000000,
          "floor": 4,
          "area": 74.04
        },
        {
          "date": "2025-05-01",
          "price": 133000000,
          "floor": 4,
          "area": 74.04
        },
        {
          "date": "2025-04-22",
          "price": 148000000,
          "floor": 1,
          "area": 74.04
        },
        {
          "date": "2025-02-26",
          "price": 156000000,
          "floor": 1,
          "area": 74.04
        }
      ],
      "recentTrades6mo": [
        {
          "date": "2026-01-13",
          "price": 173000000,
          "floor": 7
        }
      ],
      "lastTrade": {
        "date": "2026-01-13",
        "price": 173000000,
        "floor": 7
      },
      "recentTradeAvg": 173000000,
      "updatedAt": "2026-06-03"
    },
    "reportUrl": "report-2025타경624.html"
  },
  {
    "id": "2025타경797",
    "caseNumber": "2025타경797",
    "court": "천안지원",
    "saleDate": "2026-05-19",
    "complex": "극동늘푸른",
    "dongHo": "113동",
    "address": "천안 서북구 두정동",
    "areaSqm": 84.9,
    "appraisalPrice": 187000000,
    "minimumPrice": 187000000,
    "rounds": 0,
    "region": "천안서북",
    "regionPriority": 1,
    "rightsStatus": "대항력 임차인(행크옥션 표시)",
    "rightsRisk": "risky",
    "saleRate": null,
    "rating": null,
    "verdict": "fail",
    "verdictReason": "대항력 임차인 표시 — 인수 위험",
    "tags": [
      "천안",
      "대항력임차인",
      "권리위험"
    ],
    "sourcingSession": "2026-05-12 v1+v2",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경812",
    "caseNumber": "2025타경812",
    "court": "천안지원",
    "saleDate": "2026-05-18",
    "complex": "테크노밸리이지더원4",
    "dongHo": "403동",
    "address": "아산 둔포면 석곡리 1797",
    "areaSqm": 72.35,
    "appraisalPrice": 220000000,
    "minimumPrice": 154000000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 3,
    "rightsStatus": "채무자 사망(상속분쟁)",
    "rightsRisk": "risky",
    "saleRate": 0.875,
    "saleRateNote": "2건 평균 90/85",
    "rating": null,
    "verdict": "fail",
    "verdictReason": "단지 매각가율 87.5% + 상속분쟁 명도 마찰",
    "tags": [
      "아산",
      "이지더원",
      "매각가율초과",
      "상속분쟁"
    ],
    "sourcingSession": "2026-05-12 v1+v2",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경833",
    "caseNumber": "2025타경833",
    "court": "천안지원",
    "saleDate": "2026-05-18",
    "complex": "더샵센트로",
    "dongHo": "103동",
    "address": "아산 배방읍",
    "areaSqm": 84.78,
    "appraisalPrice": 462000000,
    "minimumPrice": 323400000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 3,
    "rightsStatus": "—",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "fail",
    "verdictReason": "가격 cap 초과(323M > 310M)",
    "tags": [
      "아산",
      "가격초과"
    ],
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경838",
    "caseNumber": "2025타경838",
    "court": "천안지원",
    "saleDate": "2026-05-19",
    "complex": "불당아이파크",
    "dongHo": "111동",
    "address": "천안 서북구",
    "areaSqm": 84.95,
    "appraisalPrice": 214000000,
    "minimumPrice": 214000000,
    "rounds": 0,
    "region": "천안서북",
    "regionPriority": 1,
    "rightsStatus": "지분매각 1/2",
    "rightsRisk": "risky",
    "saleRate": null,
    "rating": null,
    "verdict": "fail",
    "verdictReason": "지분매각 1/2 — 제외 키워드",
    "tags": [
      "천안",
      "지분매각"
    ],
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경851",
    "caseNumber": "2025타경851",
    "court": "천안지원",
    "saleDate": "2026-05-19",
    "complex": "아산삼부르네상스더힐",
    "dongHo": "110동 503호",
    "address": "아산 신창면 남성리 852",
    "areaSqm": 59.95,
    "appraisalPrice": 202000000,
    "minimumPrice": 202000000,
    "kbPrice": 205000000,
    "rounds": 0,
    "region": "아산",
    "regionPriority": 3,
    "rightsStatus": "깔끔",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "fail",
    "verdictReason": "신건 = KB 근접. 마진 ₩3M (< ₩5M)",
    "tags": [
      "아산",
      "마진부족"
    ],
    "sourcingSession": "2026-05-12 v1 → 2026-05-13 검증",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-13"
  },
  {
    "id": "2025타경11470",
    "caseNumber": "2025타경11470",
    "court": "천안지원",
    "saleDate": "2026-05-12",
    "complex": "극동늘푸른",
    "dongHo": "106동",
    "address": "천안 서북구 두정동",
    "areaSqm": 59.91,
    "appraisalPrice": 162000000,
    "minimumPrice": 162000000,
    "rounds": 4,
    "region": "천안서북",
    "regionPriority": 1,
    "rightsStatus": "HUG 우선변제권만",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "expired",
    "verdictReason": "매각기일 경과(5/12)",
    "tags": [
      "천안",
      "HUG",
      "유찰4회"
    ],
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경11500",
    "caseNumber": "2025타경11500",
    "court": "천안지원",
    "saleDate": "2026-05-13",
    "complex": "성지새말 1단지",
    "dongHo": "106동",
    "address": "천안 동남구 신방동 873",
    "areaSqm": 84.96,
    "appraisalPrice": 208000000,
    "minimumPrice": 145600000,
    "rounds": 1,
    "region": "천안동남",
    "regionPriority": 1,
    "rightsStatus": "권리 안전(A)",
    "rightsRisk": "safe",
    "saleRate": 0.755,
    "saleRateNote": "1단지 매각가율 (기존 분석). 행크옥션 84㎡ 매각 이력은 노출 안 됨 — 60㎡ 사례만 표시",
    "rating": null,
    "verdict": "fail",
    "verdictReason": "매각가율 75.5% 통과했으나 IRR 3.1%로 미시 마진 부족 (1차 sourcing 분석)",
    "tags": [
      "천안",
      "성지새말",
      "마진부족"
    ],
    "reportPath": "_workspace/cases/2025타경11500/",
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-13",
    "naverComplexNo": 7389,
    "salesHistory": [
      {
        "caseNo": "2024-110455",
        "dongHo": "105동 2층 204호",
        "area": 59.97,
        "appraisal": 154000000,
        "soldPrice": 120999000,
        "soldRate": 0.79,
        "saleDate": "2025-02-18",
        "outlier": true,
        "outlierReason": "사건 84㎡, 매각 사례 60㎡ (다른 평형)"
      },
      {
        "caseNo": "2023-112744",
        "dongHo": "105동 2층 203호",
        "area": 59.97,
        "appraisal": 159000000,
        "soldPrice": 115125000,
        "soldRate": 0.72,
        "saleDate": "2024-06-05",
        "outlier": true,
        "outlierReason": "사건 84㎡, 매각 사례 60㎡"
      },
      {
        "caseNo": "2021-108741",
        "dongHo": "104동 2층 201호",
        "area": 59.97,
        "appraisal": 144000000,
        "soldPrice": 158100000,
        "soldRate": 1.1,
        "saleDate": "2022-06-08",
        "outlier": true,
        "outlierReason": "사건 84㎡, 매각 사례 60㎡ + 2022 시장 과열기"
      }
    ]
  },
  {
    "id": "2025타경11597",
    "caseNumber": "2025타경11597",
    "court": "천안지원",
    "saleDate": "2026-05-19",
    "complex": "우성",
    "dongHo": "103동",
    "address": "천안 서북구 두정동",
    "areaSqm": 59.7,
    "appraisalPrice": 163000000,
    "minimumPrice": 163000000,
    "rounds": 0,
    "region": "천안서북",
    "regionPriority": 1,
    "rightsStatus": "HUG 대항력·우선변제권 승계",
    "rightsRisk": "risky",
    "saleRate": null,
    "rating": null,
    "verdict": "fail",
    "verdictReason": "HUG 임차권 승계(인수 위험)",
    "tags": [
      "천안",
      "HUG",
      "인수위험"
    ],
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경11636",
    "caseNumber": "2025타경11636",
    "court": "천안지원",
    "saleDate": "2026-05-12",
    "complex": "한라비발디스마트밸리",
    "dongHo": "206동",
    "address": "아산 음봉면",
    "areaSqm": 65.48,
    "appraisalPrice": 295000000,
    "minimumPrice": 206500000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 3,
    "rightsStatus": "—",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "expired",
    "verdictReason": "매각기일 경과(5/12)",
    "tags": [
      "아산",
      "한라비발디"
    ],
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경11650",
    "caseNumber": "2025타경11650",
    "court": "천안지원",
    "saleDate": "2026-05-19",
    "complex": "테크노밸리이지더원3",
    "dongHo": "301동",
    "address": "아산 둔포면",
    "areaSqm": 72.35,
    "appraisalPrice": 216000000,
    "minimumPrice": 105800000,
    "rounds": 2,
    "region": "아산",
    "regionPriority": 3,
    "rightsStatus": "HUG 임차보증금반환채권 양수",
    "rightsRisk": "risky",
    "saleRate": null,
    "rating": null,
    "verdict": "fail",
    "verdictReason": "HUG 양수(인수 위험)",
    "tags": [
      "아산",
      "이지더원",
      "HUG",
      "인수위험"
    ],
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경11792",
    "caseNumber": "2025타경11792",
    "court": "천안지원",
    "saleDate": "2026-05-12",
    "complex": "천안두정역이안더센트럴",
    "dongHo": "108동",
    "address": "천안 서북구 두정동",
    "areaSqm": 84.97,
    "appraisalPrice": 307000000,
    "minimumPrice": 105300000,
    "rounds": 3,
    "region": "천안서북",
    "regionPriority": 1,
    "rightsStatus": "—",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "expired",
    "verdictReason": "매각기일 경과(5/12). 최저가 매우 저렴(34%)이었음",
    "tags": [
      "천안",
      "유찰3회",
      "저가"
    ],
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경12066",
    "caseNumber": "2025타경12066",
    "court": "천안지원",
    "saleDate": "2026-05-13",
    "complex": "천안역우방아이유쉘",
    "dongHo": "103동",
    "address": "천안 서북구 성정동",
    "areaSqm": 85,
    "appraisalPrice": 330000000,
    "minimumPrice": 231000000,
    "rounds": 1,
    "region": "천안서북",
    "regionPriority": 1,
    "rightsStatus": "권리 안전(A)",
    "rightsRisk": "safe",
    "saleRate": 0.876,
    "saleRateNote": "행크옥션 84.99㎡ 3건 평균 (87/89/87, 2024-07~2025-07). 기존 사용자 분석 90.5%와는 표본 차이",
    "rating": null,
    "verdict": "fail",
    "verdictReason": "단지 매각가율 87.6% > 78% 기준 초과 (deep-dive 완료, v7 보고서)",
    "tags": [
      "천안",
      "기분석",
      "매각가율초과"
    ],
    "reportPath": "_workspace/cases/2025타경12066/",
    "sourcingSession": "2026-05-10 (선행 분석) + 2026-05-13 행크옥션 보강",
    "addedAt": "2026-05-10",
    "updatedAt": "2026-05-13",
    "naverComplexNo": 115413,
    "salesHistory": [
      {
        "caseNo": "2024-117968",
        "dongHo": "103동 14층 1403호",
        "area": 84.99,
        "appraisal": 346000000,
        "soldPrice": 300110000,
        "soldRate": 0.87,
        "saleDate": "2025-07-14",
        "outlier": false
      },
      {
        "caseNo": "2024-107879",
        "dongHo": "104동 12층 1201호",
        "area": 84.99,
        "appraisal": 330000000,
        "soldPrice": 294730000,
        "soldRate": 0.89,
        "saleDate": "2024-12-02",
        "outlier": false
      },
      {
        "caseNo": "2024-100274",
        "dongHo": "104동 16층 1602호",
        "area": 84.99,
        "appraisal": 347000000,
        "soldPrice": 301000000,
        "soldRate": 0.87,
        "saleDate": "2024-07-22",
        "outlier": false
      }
    ]
  },
  {
    "id": "2025타경12090",
    "caseNumber": "2025타경12090",
    "court": "천안지원",
    "saleDate": "2026-05-13",
    "complex": "동일하이빌",
    "dongHo": "109동",
    "address": "아산 풍기동",
    "areaSqm": 84.99,
    "appraisalPrice": 270000000,
    "minimumPrice": 189000000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 3,
    "rightsStatus": "—",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "fail",
    "verdictReason": "D+1 분석 시간 부족(분석 시점 5/12 → 매각 5/13)",
    "tags": [
      "아산",
      "분석시간부족"
    ],
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경12233",
    "caseNumber": "2025타경12233",
    "court": "천안지원",
    "saleDate": "2026-05-19",
    "complex": "한라비발디",
    "dongHo": "108동",
    "address": "아산 배방읍",
    "areaSqm": 84.8,
    "appraisalPrice": 215000000,
    "minimumPrice": 150500000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 3,
    "rightsStatus": "권리 안전(A)",
    "rightsRisk": "safe",
    "saleRate": 0.86,
    "saleRateNote": "행크옥션 84㎡ 2건 평균 89/83 (2024-11, 2025-06)",
    "rating": null,
    "verdict": "fail",
    "verdictReason": "단지 매각가율 86% > 78% 기준 초과",
    "tags": [
      "아산",
      "한라비발디",
      "매각가율초과"
    ],
    "sourcingSession": "2026-05-12 v1+v2 + 2026-05-13 행크옥션 보강",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-13",
    "naverComplexNo": 19283,
    "salesHistory": [
      {
        "caseNo": "2025-11768",
        "dongHo": "108동 3층 304호",
        "area": 104.11,
        "appraisal": 244000000,
        "soldPrice": 235000000,
        "soldRate": 0.96,
        "saleDate": "2026-01-06",
        "outlier": true,
        "outlierReason": "사건 84.8㎡, 매각 사례 104㎡ (대형 평형)"
      },
      {
        "caseNo": "2023-110755",
        "dongHo": "105동 5층 502호",
        "area": 84.97,
        "appraisal": 215000000,
        "soldPrice": 192180000,
        "soldRate": 0.89,
        "saleDate": "2025-06-17",
        "outlier": false
      },
      {
        "caseNo": "2024-103464",
        "dongHo": "104동 6층 601호",
        "area": 84.79,
        "appraisal": 224000000,
        "soldPrice": 185920000,
        "soldRate": 0.83,
        "saleDate": "2024-11-26",
        "outlier": false
      }
    ]
  },
  {
    "id": "2025타경12336",
    "caseNumber": "2025타경12336",
    "court": "천안지원",
    "saleDate": "2026-05-19",
    "complex": "쌍용 현대",
    "dongHo": "403동",
    "address": "천안 서북구 쌍용동",
    "areaSqm": 59.45,
    "appraisalPrice": 143000000,
    "minimumPrice": 100100000,
    "rounds": 1,
    "region": "천안서북",
    "regionPriority": 1,
    "rightsStatus": "대항력 임차인(행크옥션 표시)",
    "rightsRisk": "risky",
    "saleRate": null,
    "rating": null,
    "verdict": "fail",
    "verdictReason": "대항력 임차인 — 인수 위험(raw 비고 누락, 행크옥션 보강)",
    "tags": [
      "천안",
      "대항력임차인",
      "권리위험"
    ],
    "sourcingSession": "2026-05-12 v1+v2",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경12412",
    "caseNumber": "2025타경12412",
    "court": "천안지원",
    "saleDate": "2026-05-19",
    "complex": "쌍용 현대홈타운아이파크",
    "dongHo": "115동",
    "address": "천안 서북구 쌍용동",
    "areaSqm": 84.72,
    "appraisalPrice": 310000000,
    "minimumPrice": 217000000,
    "rounds": 1,
    "region": "천안서북",
    "regionPriority": 1,
    "rightsStatus": "신청채권자=전세권자=임차인(전세권 배당요구)",
    "rightsRisk": "moderate",
    "saleRate": 0.83,
    "saleRateNote": "단지 매각가율 83%",
    "rating": null,
    "verdict": "fail",
    "verdictReason": "단지 매각가율 83% > 78% 기준 초과",
    "tags": [
      "천안",
      "매각가율초과"
    ],
    "sourcingSession": "2026-05-12 v1+v2",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경12434",
    "caseNumber": "2025타경12434",
    "court": "천안지원",
    "saleDate": "2026-05-12",
    "complex": "새솔마을중앙하이츠",
    "dongHo": "305동",
    "address": "아산 배방읍",
    "areaSqm": 85,
    "appraisalPrice": 224000000,
    "minimumPrice": 156800000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 3,
    "rightsStatus": "—",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "expired",
    "verdictReason": "매각기일 경과(5/12)",
    "tags": [
      "아산"
    ],
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경12435",
    "caseNumber": "2025타경12435",
    "court": "천안지원",
    "saleDate": "2026-05-19",
    "complex": "라이프타운",
    "dongHo": "101동",
    "address": "천안 서북구 쌍용동",
    "areaSqm": 95.96,
    "appraisalPrice": 198000000,
    "minimumPrice": 198000000,
    "rounds": 0,
    "region": "천안서북",
    "regionPriority": 1,
    "rightsStatus": "—",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "fail",
    "verdictReason": "면적 초과(95.96㎡)",
    "tags": [
      "천안",
      "면적초과"
    ],
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경12451",
    "caseNumber": "2025타경12451",
    "court": "천안지원",
    "saleDate": "2026-05-12",
    "complex": "연화마을8",
    "dongHo": "804동",
    "address": "아산 배방읍",
    "areaSqm": 84.62,
    "appraisalPrice": 320000000,
    "minimumPrice": 224000000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 3,
    "rightsStatus": "—",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "expired",
    "verdictReason": "매각기일 경과(5/12)",
    "tags": [
      "아산"
    ],
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경12525",
    "caseNumber": "2025타경12525",
    "court": "천안지원",
    "saleDate": "2026-05-19",
    "complex": "아산반도유보라",
    "dongHo": "102동",
    "address": "아산 온천동",
    "areaSqm": 60,
    "appraisalPrice": 204000000,
    "minimumPrice": 142800000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 3,
    "rightsStatus": "대항력 임차인(행크옥션 표시)",
    "rightsRisk": "risky",
    "saleRate": null,
    "rating": null,
    "verdict": "fail",
    "verdictReason": "대항력 임차인 — 인수 위험",
    "tags": [
      "아산",
      "대항력임차인",
      "권리위험"
    ],
    "sourcingSession": "2026-05-12 v1+v2",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경12589",
    "caseNumber": "2025타경12589",
    "court": "천안지원",
    "saleDate": "2026-05-12",
    "complex": "용곡마을세광2차엔리치타워",
    "dongHo": "215동",
    "address": "천안 동남구 용곡동",
    "areaSqm": 101.52,
    "appraisalPrice": 264000000,
    "minimumPrice": 264000000,
    "rounds": 0,
    "region": "천안동남",
    "regionPriority": 1,
    "rightsStatus": "—",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "expired",
    "verdictReason": "면적 초과(101.52) + 매각기일 경과",
    "tags": [
      "천안",
      "면적초과"
    ],
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경12606",
    "caseNumber": "2025타경12606",
    "court": "천안지원",
    "saleDate": "2026-05-19",
    "complex": "신방동대주피오레",
    "dongHo": "101동",
    "address": "천안 동남구 신방동",
    "areaSqm": 119.64,
    "appraisalPrice": 395000000,
    "minimumPrice": 276500000,
    "rounds": 1,
    "region": "천안동남",
    "regionPriority": 1,
    "rightsStatus": "—",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "fail",
    "verdictReason": "면적 초과(119.64㎡)",
    "tags": [
      "천안",
      "면적초과"
    ],
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경12698",
    "caseNumber": "2025타경12698",
    "court": "천안지원",
    "saleDate": "2026-05-18",
    "complex": "성지새말 2단지",
    "dongHo": "206동",
    "address": "천안 동남구 신방동 874",
    "areaSqm": 59.97,
    "appraisalPrice": 155000000,
    "minimumPrice": 108500000,
    "rounds": 1,
    "region": "천안동남",
    "regionPriority": 1,
    "rightsStatus": "권리 안전(A)",
    "rightsRisk": "safe",
    "saleRate": 0.857,
    "saleRateNote": "2단지 매각가율 (기존 sourcing 분석). ⚠️ 행크옥션 동일번지(874) 매각 사례 0건 — 85.7%는 1단지(873) 데이터 오인 가능성. 진입 결정 전 재검증 필요",
    "rating": null,
    "verdict": "fail",
    "verdictReason": "2단지 매각가율 85.7% > 78% 기준 초과 + 감정시세 -22% 시세 약세 (단, 매각가율 데이터 신뢰도 낮음 — 행크옥션 0건)",
    "tags": [
      "천안",
      "성지새말",
      "매각가율초과",
      "데이터검증필요"
    ],
    "reportPath": "_workspace/cases/2025타경12698/",
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-13",
    "naverComplexNo": 7392,
    "salesHistory": []
  },
  {
    "id": "2025타경12737",
    "caseNumber": "2025타경12737",
    "court": "천안지원",
    "saleDate": "2026-05-18",
    "complex": "한성필하우스",
    "dongHo": "701동",
    "address": "천안 서북구 불당동",
    "areaSqm": 59.98,
    "appraisalPrice": 234000000,
    "minimumPrice": 234000000,
    "rounds": 0,
    "region": "천안서북",
    "regionPriority": 1,
    "rightsStatus": "대항력 임차인",
    "rightsRisk": "risky",
    "saleRate": null,
    "rating": null,
    "verdict": "fail",
    "verdictReason": "대항력 임차인 — 인수 위험",
    "tags": [
      "천안",
      "대항력임차인",
      "권리위험"
    ],
    "sourcingSession": "2026-05-12 v1",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경12740",
    "caseNumber": "2025타경12740",
    "court": "천안지원",
    "saleDate": "2026-06-23",
    "complex": "아산테크노밸리이지더원4단지",
    "dongHo": "401동 503호",
    "address": "아산 둔포면 석곡리 1797",
    "areaSqm": 72.09,
    "appraisalPrice": 210000000,
    "minimumPrice": 147000000,
    "kbPrice": 216000000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 2,
    "rightsStatus": "권리 안전(A) — 전세권 말소·인수 0 (GG TIP 인수없음)",
    "rightsRisk": "safe",
    "saleRate": 0.878,
    "saleRateNote": "동일평형(28평형) 403동 2025-812호 2026.05 매각가율 87.8% (1회 유찰 후 16명 경합, n=1). 아산 지역통계 6개월 90.0%·평균응찰 11.4",
    "interestTier": "watchlist",
    "saleRateMu": 0.878,
    "saleRateSigma": 0.05,
    "saleRateN": 1,
    "bid70": 178020000,
    "neutralSalePrice": 197800000,
    "expectedProfit70": 11832040,
    "rating": null,
    "verdict": "hold",
    "verdictReason": "관망 / 마진형 저가 한정 — 보수 매도 기준 1.98억(호가 하단) · 입찰권장 1.78억(70%) · 세전 EP70 1183만원(watchlist) · 세후 871만원. 권리 raw 미검증(D-day 등기·임차조사 확인 필요). (2026-06-03 v9 재분석) — [v10.1 카페재분석] 5층 저층 경계 — 유동성 mild 주의, 산단 임대 완충. · v10 재계산(본인 24%·100%대출, 2026-06-15)",
    "tags": [
      "아산",
      "이지더원",
      "준과열",
      "v7재계산",
      "◇watch",
      "v8수리제외"
    ],
    "sourcingSession": "2026-05-12 v1 → 2026-06-01 v3 Tier2 + 2026-06-01 v4 v7재계산",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-06-01",
    "k70": 0.878,
    "repairCost": 7000000,
    "marketAnchorBasis": "호가 하단",
    "flipRepair": 3000000,
    "evictionEst": 3000000,
    "costBreakdown": {
      "acq": 2486460,
      "brokerage": 791200,
      "etc": 2000000,
      "fixedTotal": 5277660,
      "interest": {
        "m3": 2002725,
        "m4": 2670300,
        "m5": 3337875,
        "m6": 4005450
      },
      "anchorMonths": 4,
      "k70": 0.9,
      "ltv": 1.0,
      "rate": 0.045
    },
    "taxOwner": "self",
    "taxableProfit": 11832040,
    "incomeTax": 3123659,
    "marginalRate": 0.264,
    "afterTaxProfit": 8708381,
    "naverData": {
      "source": "naver",
      "complexNo": "109384",
      "pyeong": {
        "no": "2",
        "exc": 72.09,
        "sup": 95.78,
        "name": "95B"
      },
      "askingPrice": {
        "low": 193000000,
        "high": 230000000,
        "median": 215000000,
        "count": 45,
        "area": 72.09
      },
      "askingList": [
        {
          "p": 193000000,
          "fl": "저/24",
          "ymd": "20260514"
        },
        {
          "p": 200000000,
          "fl": "4/24",
          "ymd": "20260519"
        },
        {
          "p": 205000000,
          "fl": "12/24",
          "ymd": "20260529"
        },
        {
          "p": 215000000,
          "fl": "중/24",
          "ymd": "20260528"
        },
        {
          "p": 230000000,
          "fl": "고/24",
          "ymd": "20260530"
        }
      ],
      "recentTrades": [
        {
          "date": "2026-03-29",
          "price": 208000000,
          "floor": 18,
          "area": 72.09
        },
        {
          "date": "2026-03-24",
          "price": 205000000,
          "floor": 23,
          "area": 72.09
        },
        {
          "date": "2026-03-09",
          "price": 208000000,
          "floor": 22,
          "area": 72.09
        },
        {
          "date": "2026-01-21",
          "price": 203000000,
          "floor": 5,
          "area": 72.09
        },
        {
          "date": "2025-12-20",
          "price": 207000000,
          "floor": 9,
          "area": 72.09
        }
      ],
      "recentTrades6mo": [
        {
          "date": "2026-03-29",
          "price": 208000000,
          "floor": 18
        },
        {
          "date": "2026-03-24",
          "price": 205000000,
          "floor": 23
        },
        {
          "date": "2026-03-09",
          "price": 208000000,
          "floor": 22
        },
        {
          "date": "2026-01-21",
          "price": 203000000,
          "floor": 5
        },
        {
          "date": "2025-12-20",
          "price": 207000000,
          "floor": 9
        }
      ],
      "lastTrade": {
        "date": "2026-03-29",
        "price": 208000000,
        "floor": 18
      },
      "recentTradeAvg": 206200000,
      "updatedAt": "2026-06-03"
    },
    "reportUrl": "report-2025타경12740.html"
  },
  {
    "id": "2025타경12884",
    "caseNumber": "2025타경12884",
    "court": "천안지원",
    "saleDate": "2026-05-18",
    "complex": "성환 부영",
    "dongHo": "203동",
    "address": "천안 서북구 성환읍",
    "areaSqm": 84.96,
    "appraisalPrice": 218000000,
    "minimumPrice": 152600000,
    "rounds": 1,
    "region": "천안서북",
    "regionPriority": 1,
    "rightsStatus": "—",
    "rightsRisk": "safe",
    "saleRate": null,
    "saleRateNote": "매각 사례 1건(11년 전)",
    "rating": null,
    "verdict": "fail",
    "verdictReason": "매각가율 검증 불가(11년 전 단일 사례)",
    "tags": [
      "천안",
      "성환",
      "매각가율불충분"
    ],
    "sourcingSession": "2026-05-12 v1+v2",
    "addedAt": "2026-05-12",
    "updatedAt": "2026-05-12"
  },
  {
    "id": "2025타경503970",
    "caseNumber": "2025타경503970",
    "court": "대전지원",
    "saleDate": "2026-05-27",
    "complex": "가재마을8단지",
    "dongHo": "801동 304호",
    "address": "세종특별자치시  종촌동 692 가재마을8단지 801동 3층304호",
    "areaSqm": 84.6799,
    "appraisalPrice": 394000000,
    "minimumPrice": 275800000,
    "rounds": 1,
    "region": "세종",
    "regionPriority": 3,
    "rightsStatus": "—",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "candidate",
    "verdictReason": "v3.3 1차 통과 — deep-dive 전 단지 매각가율 확인 필요",
    "tags": [
      "세종",
      "v4-extended"
    ],
    "sourcingSession": "2026-05-15 v4 확장 윈도우",
    "addedAt": "2026-05-15",
    "updatedAt": "2026-05-15",
    "bldgYear": 2016,
    "kbPrice": null,
    "hauctionUrl": "",
    "procedure": "임의경매"
  },
  {
    "id": "2025타경789",
    "caseNumber": "2025타경789",
    "court": "서산지원",
    "saleDate": "2026-05-19",
    "complex": "서산동문동아더프라임",
    "dongHo": "103동 301호",
    "address": "충청남도 서산시 동문동 600 서산동문동아더프라임 103동 3층301호",
    "areaSqm": 84.9625,
    "appraisalPrice": 211000000,
    "minimumPrice": 147700000,
    "rounds": 1,
    "region": "서산",
    "regionPriority": 3,
    "rightsStatus": "—",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "candidate",
    "verdictReason": "v3.3 1차 통과 — deep-dive 전 단지 매각가율 확인 필요",
    "tags": [
      "서산",
      "v4-extended"
    ],
    "sourcingSession": "2026-05-15 v4 확장 윈도우",
    "addedAt": "2026-05-15",
    "updatedAt": "2026-05-15",
    "bldgYear": 2013,
    "kbPrice": 195000000,
    "hauctionUrl": "",
    "procedure": "임의경매"
  },
  {
    "id": "2025타경1123",
    "caseNumber": "2025타경1123",
    "court": "홍성지원",
    "saleDate": "2026-05-26",
    "complex": "현대2단지",
    "dongHo": "201동 902호",
    "address": "충청남도 보령시 동대동 339-1 현대2단지 201동 9층902호 외 2필지",
    "areaSqm": 59.8,
    "appraisalPrice": 150000000,
    "minimumPrice": 105000000,
    "rounds": 1,
    "region": "보령",
    "regionPriority": 3,
    "rightsStatus": "—",
    "rightsRisk": "safe",
    "saleRate": null,
    "saleRateNote": "🔎 스크리닝 2026-05-19 — 단지 식별 정정(현대'아파트'→현대2단지, 339→339-1, 218세대 1997.09). 1+2단지 분리 식별 v3.4 정책 재확인. 단지 직접 매각 사례 0건. KB ₩120M stale (1+2 합산 추정값) → 2단지 직접 실거래 ₩148~165M (2026-02 동단지 ₩165M, 2025-10 23평 ₩153M) → 마진 ₩40~60M 확보. saleRate 추정 0.78 (보수 0.80/낙관 0.75/위험 0.85). 사용자 보강 후 ★4 진입 가능",
    "rating": null,
    "verdict": "candidate",
    "verdictReason": "스크리닝 2026-05-19 CONDITIONAL-PASS-MID. 단지 식별 정정 + KB stale 정정 후 마진 강함. 보령 priority_3 인구 -12%/15년 → 단기 매도 회전 느림, 임대 회수 시나리오 우선. 보강 후 deep-dive 후순위",
    "tags": [
      "보령",
      "v4-extended",
      "스크리닝완료",
      "단지정정",
      "KB정정"
    ],
    "sourcingSession": "2026-05-15 v4 확장 윈도우 → 2026-05-19 스크리닝",
    "addedAt": "2026-05-15",
    "updatedAt": "2026-05-19",
    "bldgYear": 1997,
    "kbPrice": 155000000,
    "hauctionUrl": "",
    "aptInfoCode": "A35575401",
    "procedure": "임의경매",
    "reportPath": "_workspace/cases/2025타경1123/"
  },
  {
    "id": "2025타경458",
    "caseNumber": "2025타경458",
    "court": "논산지원",
    "saleDate": "2026-05-26",
    "complex": "계룡더샵아파트",
    "dongHo": "101동 1202호",
    "address": "충청남도 계룡시 두마면 두계리 67 계룡더샵아파트 101동 12층1202호",
    "areaSqm": 84.82,
    "appraisalPrice": 300000000,
    "minimumPrice": 210000000,
    "rounds": 1,
    "region": "계룡",
    "regionPriority": 3,
    "rightsStatus": "권리 안전(A) — 매각물건명세서 '조사된 임차내역없음', 최선순위 2023.4.3 근저당, 인수권리 0건 확정",
    "rightsRisk": "safe",
    "saleRate": 0.84,
    "saleRateNote": "🟢 행크옥션 직접 확인 (2026-05-19) — 동일번지 84.82㎡ 직접 매각 1건 0.84 (2025-20428, 115동 504호, 2026-02-09 매각 ₩252.16M/₩300M 감정). 큰 평형(121㎡ 0.80, 161㎡ 0.78) 평균 0.79. 동일평형 기준 saleRate 0.84 확정. 신뢰도 H",
    "rating": 4,
    "verdict": "pass",
    "verdictReason": "🟢 GO 확정 (2026-05-19, 행크옥션 직접 확인). 권리등급 A + saleRate 0.84 게이팅 PASS + Walk-away ₩212M > 최저가 ₩210M (보수 모드도 +₩2M 여유). 권장 입찰가 ₩219,756,000 (KB 행크옥션 ₩275M의 79.9%, saleRate 0.84 대응, 끝자리 비대칭 756). 자기자본 ₩55M (가용 ₩162M의 34%) → 시나리오 A 즉시 전매 매도 ₩285M 가정 세후 ₩48M ROI 87% / 연환산 174% (6개월). 매매사업자 배우자 명의 1순위. 소유자 박금숙(채무자 김영기 배우자) 점유 + 잉여 ₩70~80M (2019.08 매수 ₩215M, 채무 ₩190M) → 자진 명도 협조 인센티브 있음. D-1(5/25) 호가 확인 + 입찰보증금 ₩21M 배우자 수표 발급만 남음",
    "tags": [
      "계룡",
      "v4-extended",
      "deep-dive완료",
      "GO확정",
      "권리A확정",
      "saleRate확정",
      "행크옥션직접확인",
      "군부대도시",
      "v5비용정정"
    ],
    "notes": "deep-dive 완료 (2026-05-19) + 행크옥션 직접 확인 (2026-05-19). 5종 산출물: _workspace/cases/2025타경458/00~05. **권장 입찰가 (행크옥션 KB ₩275M 기준)**: ₩213,514,000(보수, 낙찰 30~40%) / ₩219,756,000(권장, 낙찰 50~60%) / ₩226,489,000(적극, 낙찰 70%+). 끝자리 비대칭 514/756/489. Walk-away ₩212M (등급 A + KB ₩275M 보수 모드, 최저가 +₩2M). 차감비용 ₩13.5M (v5 + 소유자 점유 자진명도: 명도 ₩3.5M + 수리 ₩5M + 법무 ₩1.5M + 인수 ₩0 + 취득세 ₩2.5M + 기타 ₩1M). 시나리오 A 매도 ₩285M(실거래 2026-01 13층 ₩295M 기준 보수) → 세후 마진 ₩48M (배우자 24% + 부가세 면세 84.82㎡<84.99㎡) / ROI 87% / 연환산 174%. 매도 ₩280M(보수) ROI 80% / ₩295M(낙관) ROI 102%. 등기 갑(11) 박금숙 2019.08.23 매수 ₩215M, 을(7) 2023.04.03 근저당 논산계룡농협 ₩231M(말소기준), 갑(12/15) 가압류 충남신보 ₩46.5M·신한카드 ₩6.4M 모두 소멸, 갑(16) 임의경매 청구 ₩190.3M. 채권액 합계 ₩283.9M. 매각물건명세서 작성 2026.3.3 이정무 사법보좌관. 조회수 오늘 3 / 최근 2주 18 / 총 25 — 경쟁률 보통.",
    "reportPath": "_workspace/cases/2025타경458/",
    "sourcingSession": "2026-05-15 v4 확장 윈도우 → 2026-05-19 스크리닝 → 2026-05-19 auction-specialist deep-dive → 2026-05-19 행크옥션 직접 확인 (event_id=1507733)",
    "addedAt": "2026-05-15",
    "updatedAt": "2026-05-19",
    "bldgYear": 2008,
    "kbPrice": 275000000,
    "aptInfoCode": "A32191402",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction/1507733?isActiveAuction=true&isActiveOnbid=true&isActivePrice=false",
    "procedure": "임의경매"
  },
  {
    "id": "2025타경679",
    "caseNumber": "2025타경679",
    "court": "서산지원",
    "saleDate": "2026-05-27",
    "complex": "송악 이-편한세상",
    "dongHo": "106동 303호",
    "address": "충청남도 당진시 송악읍 가학리 690 송악 이-편한세상 106동 3층303호",
    "areaSqm": 84.972,
    "appraisalPrice": 203000000,
    "minimumPrice": 142100000,
    "rounds": 1,
    "region": "당진",
    "regionPriority": 3,
    "rightsStatus": "— (행크옥션 leas_info/special_condition 공백)",
    "rightsRisk": "safe",
    "saleRate": null,
    "saleRateNote": "직접 단지 매각 사례 0건. 충남 priority_3 권역 baseline 0.80~0.85 추정. 사용자 D-5 행크옥션 단지 페이지 직접 확인 권장",
    "rating": 3,
    "verdict": "candidate",
    "verdictReason": "🟡 조건부 ★4 (스크리닝 3/5, 2026-05-20). KB 정정 trade_min ₩180M / mid ₩200M 추정 / max ₩220M — mid 기준 KB갭 29% (현 표기 21%보다 +₩16M 마진). 권리 표면 클린 + fb=1 70% + 채권자 국민은행 단독 → 함정 패턴(송산엠코타운 fb=8·채운휴먼빌 fb=9)과 분리됨. saleRate가 결정 변수: ≤78% 확정 시 ★4 도약(79점), 78~85% 시 ★3 강등(69점). 사용자 D-5 어시스트: ① 송악e편한세상 84㎡ 최근 매각이력 ② 매각물건명세서 PDF (임차인·점유자·배당요구)",
    "tags": [
      "당진",
      "v4-extended",
      "조건부★4",
      "KB정정",
      "사용자어시스트필요"
    ],
    "notes": "스크리닝 보고 (2026-05-20). raw: /_workspace/cases/2025타경679/raw/. cases.js KB ₩180M은 API trade_min만 반영, mid ₩200M로 정정 시 KB갭 21%→29%. 충남 가구공급 안정 권역. 84.97㎡ 부가세 면세 경계 (84.99㎡ < 면세 한도, 0.02㎡ 마진 — 등기부 정밀 확인 필요).",
    "sourcingSession": "2026-05-15 v4 확장 윈도우 → 2026-05-20 스크리닝 (조건부 ★4)",
    "addedAt": "2026-05-15",
    "updatedAt": "2026-05-20",
    "bldgYear": 2010,
    "kbPrice": 180000000,
    "hauctionUrl": "",
    "procedure": "임의경매"
  },
  {
    "id": "2025타경51321",
    "caseNumber": "2025타경51321",
    "court": "서산지원",
    "saleDate": "2026-05-27",
    "complex": "동문동코아루아파트",
    "dongHo": "104동 903호",
    "address": "충청남도 서산시 동문동 71-1 동문동코아루아파트 104동 9층903호 외 39필지",
    "areaSqm": 84.98,
    "appraisalPrice": 266000000,
    "minimumPrice": 186200000,
    "rounds": 1,
    "region": "서산",
    "regionPriority": 3,
    "rightsStatus": "—",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "candidate",
    "verdictReason": "v3.3 1차 통과 — deep-dive 전 단지 매각가율 확인 필요",
    "tags": [
      "서산",
      "v4-extended"
    ],
    "sourcingSession": "2026-05-15 v4 확장 윈도우",
    "addedAt": "2026-05-15",
    "updatedAt": "2026-05-15",
    "bldgYear": 2007,
    "kbPrice": 215000000,
    "hauctionUrl": "",
    "procedure": "임의경매"
  },
  {
    "id": "2025타경51293",
    "caseNumber": "2025타경51293",
    "court": "서산지원",
    "saleDate": "2026-05-27",
    "complex": "서산시읍내동양우내안애퍼스트힐",
    "dongHo": "113동 1101호",
    "address": "충청남도 서산시 읍내동 873 서산시읍내동양우내안애퍼스트힐 113동 11층1101호",
    "areaSqm": 72.608,
    "appraisalPrice": 264000000,
    "minimumPrice": 184800000,
    "rounds": 1,
    "region": "서산",
    "regionPriority": 3,
    "rightsStatus": "임차권등기,대항력 있는 임차인",
    "rightsRisk": "risky",
    "saleRate": null,
    "rating": null,
    "verdict": "candidate",
    "verdictReason": "v3.3 1차 통과 — deep-dive 전 단지 매각가율 확인 필요",
    "tags": [
      "서산",
      "v4-extended"
    ],
    "sourcingSession": "2026-05-15 v4 확장 윈도우",
    "addedAt": "2026-05-15",
    "updatedAt": "2026-05-15",
    "bldgYear": 2018,
    "kbPrice": 255000000,
    "hauctionUrl": "",
    "specialNote": "임차권등기,대항력 있는 임차인",
    "procedure": "강제경매"
  },
  {
    "id": "2025타경501928",
    "caseNumber": "2025타경501928",
    "court": "대전지원",
    "saleDate": "2026-05-20",
    "complex": "더리치세종의아침",
    "dongHo": "동 701호",
    "address": "세종특별자치시  나성동 775 더리치세종의아침  7층701호 외 1필지",
    "areaSqm": 26.0967,
    "appraisalPrice": 146000000,
    "minimumPrice": 102200000,
    "rounds": 1,
    "region": "세종",
    "regionPriority": 3,
    "rightsStatus": "임차권등기,대항력 있는 임차인",
    "rightsRisk": "risky",
    "saleRate": null,
    "rating": null,
    "verdict": "candidate",
    "verdictReason": "v3.3 1차 통과 — deep-dive 전 단지 매각가율 확인 필요",
    "tags": [
      "세종",
      "v4-extended"
    ],
    "sourcingSession": "2026-05-15 v4 확장 윈도우",
    "addedAt": "2026-05-15",
    "updatedAt": "2026-05-15",
    "bldgYear": 2015,
    "kbPrice": null,
    "hauctionUrl": "",
    "specialNote": "임차권등기,대항력 있는 임차인",
    "aptInfoCode": "A10021583",
    "procedure": "강제경매"
  },
  {
    "id": "2025타경51130",
    "caseNumber": "2025타경51130",
    "court": "서산지원",
    "saleDate": "2026-05-20",
    "complex": "서산센트럴코아루아파트",
    "dongHo": "103동 505호",
    "address": "충청남도 서산시 석림동 962 서산센트럴코아루아파트 103동 5층505호",
    "areaSqm": 74.2216,
    "appraisalPrice": 260000000,
    "minimumPrice": 127400000,
    "rounds": 2,
    "region": "서산",
    "regionPriority": 3,
    "rightsStatus": "임차권등기,대항력 있는 임차인",
    "rightsRisk": "risky",
    "saleRate": null,
    "rating": null,
    "verdict": "candidate",
    "verdictReason": "v3.3 1차 통과 — deep-dive 전 단지 매각가율 확인 필요",
    "tags": [
      "서산",
      "v4-extended"
    ],
    "sourcingSession": "2026-05-15 v4 확장 윈도우",
    "addedAt": "2026-05-15",
    "updatedAt": "2026-05-15",
    "bldgYear": 2019,
    "kbPrice": 255000000,
    "hauctionUrl": "",
    "specialNote": "임차권등기,대항력 있는 임차인",
    "procedure": "강제경매"
  },
  {
    "id": "2025타경51119",
    "caseNumber": "2025타경51119",
    "court": "서산지원",
    "saleDate": "2026-05-20",
    "complex": "한성필하우스",
    "dongHo": "103동 402호",
    "address": "충청남도 당진시 대덕동 1808 한성필하우스 103동 4층402호",
    "areaSqm": 76.0261,
    "appraisalPrice": 215000000,
    "minimumPrice": 105350000,
    "rounds": 2,
    "region": "당진",
    "regionPriority": 3,
    "rightsStatus": "임차권등기,대항력 있는 임차인",
    "rightsRisk": "risky",
    "saleRate": null,
    "rating": null,
    "verdict": "candidate",
    "verdictReason": "v3.3 1차 통과 — deep-dive 전 단지 매각가율 확인 필요",
    "tags": [
      "당진",
      "v4-extended"
    ],
    "sourcingSession": "2026-05-15 v4 확장 윈도우",
    "addedAt": "2026-05-15",
    "updatedAt": "2026-05-15",
    "bldgYear": 2016,
    "kbPrice": 230000000,
    "hauctionUrl": "",
    "specialNote": "임차권등기,대항력 있는 임차인",
    "procedure": "강제경매"
  },
  {
    "id": "2025타경51093",
    "caseNumber": "2025타경51093",
    "court": "서산지원",
    "saleDate": "2026-05-20",
    "complex": "서산센트럴코아루아파트",
    "dongHo": "103동 1304호",
    "address": "충청남도 서산시 석림동 962 서산센트럴코아루아파트 103동 13층1304호",
    "areaSqm": 74.7566,
    "appraisalPrice": 264000000,
    "minimumPrice": 184800000,
    "rounds": 1,
    "region": "서산",
    "regionPriority": 3,
    "rightsStatus": "임차권등기,대항력 있는 임차인",
    "rightsRisk": "risky",
    "saleRate": null,
    "rating": null,
    "verdict": "candidate",
    "verdictReason": "v3.3 1차 통과 — deep-dive 전 단지 매각가율 확인 필요",
    "tags": [
      "서산",
      "v4-extended"
    ],
    "sourcingSession": "2026-05-15 v4 확장 윈도우",
    "addedAt": "2026-05-15",
    "updatedAt": "2026-05-15",
    "bldgYear": 2019,
    "kbPrice": 255000000,
    "hauctionUrl": "",
    "specialNote": "임차권등기,대항력 있는 임차인",
    "aptInfoCode": "A10025495",
    "procedure": "강제경매"
  },
  {
    "id": "2024타경59433",
    "caseNumber": "2024타경59433",
    "court": "서산지원",
    "saleDate": "2026-05-26",
    "complex": "서산테크노밸리 고운라피네",
    "dongHo": "113동 301호",
    "address": "충남 서산시 성연면 일람리 1089, 113동 3층301호 (서산테크노밸리 고운라피네)",
    "areaSqm": 75.1389,
    "appraisalPrice": 180000000,
    "minimumPrice": 126000000,
    "rounds": 1,
    "region": "서산",
    "regionPriority": 3,
    "rightsStatus": "임차권등기,HUG 임차권 인수조건변경",
    "rightsRisk": "risky",
    "saleRate": null,
    "rating": null,
    "verdict": "candidate",
    "verdictReason": "v3.3 1차 통과 — deep-dive 전 단지 매각가율 확인 필요",
    "tags": [
      "서산",
      "v4-extended"
    ],
    "sourcingSession": "2026-05-15 v4 확장 윈도우",
    "addedAt": "2026-05-15",
    "updatedAt": "2026-05-15",
    "bldgYear": 2018,
    "kbPrice": 170000000,
    "hauctionUrl": "",
    "specialNote": "임차권등기,HUG 임차권 인수조건변경",
    "procedure": "강제경매"
  },
  {
    "id": "2024타경54308",
    "caseNumber": "2024타경54308",
    "court": "서산지원",
    "saleDate": "2026-05-19",
    "complex": "서산롯데캐슬",
    "dongHo": "114동 206호",
    "address": "충남 서산시 읍내동 738-6, 114동 2층206호 (읍내동,서산롯데캐슬)",
    "areaSqm": 84.7188,
    "appraisalPrice": 216000000,
    "minimumPrice": 151200000,
    "rounds": 1,
    "region": "서산",
    "regionPriority": 3,
    "rightsStatus": "—",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "candidate",
    "verdictReason": "v3.3 1차 통과 — deep-dive 전 단지 매각가율 확인 필요",
    "tags": [
      "서산",
      "v4-extended"
    ],
    "sourcingSession": "2026-05-15 v4 확장 윈도우",
    "addedAt": "2026-05-15",
    "updatedAt": "2026-05-15",
    "bldgYear": 2006,
    "kbPrice": 192500000,
    "hauctionUrl": "",
    "procedure": "임의경매"
  },
  {
    "id": "2025타경12028",
    "caseNumber": "2025타경12028",
    "court": "천안지원",
    "saleDate": "2026-06-01",
    "complex": "천안시티자이",
    "dongHo": "107동 25층 2503호",
    "address": "충남 천안시 서북구 성성동 827 천안시티자이 107동 25층2503호 (성성6로 21)",
    "areaSqm": 84.88,
    "appraisalPrice": 520000000,
    "minimumPrice": 364000000,
    "kbPrice": 460000000,
    "rounds": 1,
    "region": "천안서북",
    "regionPriority": 1,
    "rightsStatus": "권리 안전(A) — 말소기준 2019-01-07 신한은행, 임차인 없음(소유자 점유)",
    "rightsRisk": "safe",
    "saleRate": 0.854,
    "saleRateNote": "행크옥션 74㎡ 2건 평균 (82.78% + 87.97%, 2024-10~11). 84.88㎡(소규모 93세대) 매각 이력 0건. 호가 110건(₩440~600M)·107동(₩450~520M) 검증으로 시세 ₩475M. 매도 압박 보정 후 보수 매도가 A=₩440~455M·B=₩460~475M",
    "rating": null,
    "verdict": "pass",
    "verdictReason": "v4 비용 정정 후 GO. 권리등급 A. 비용 ₩30M→₩12M (명도·수리·취득세 과대 산정 정정: 부부 소유 협조 ₩500만, 자가 진입 부분 도배 ₩100~300만, 생애최초 50% 감면 0.55%). 정정 결과: A 9개월 IRR 8.8~17.3%, B 2년 비과세 IRR 7.6~16.8%. 권장 입찰 ₩395,118,743(낙찰 25%, A IRR 8.8%·B IRR 11.9%) — A·B 결합. 단기 매도 선호 시 ₩378M(낙찰 10%, A 13.4%·B 14.6%).",
    "tags": [
      "천안",
      "신축",
      "GS자이",
      "대단지",
      "권리A",
      "호가검증완료",
      "비용정정v4",
      "사용자관심",
      "A·B결합전략"
    ],
    "reportPath": "_workspace/cases/2025타경12028/",
    "notes": "GS건설 2018-09 사용승인, 1,646세대 12동 39층 대단지. 84.88㎡는 단지 내 소규모 타입(93세대). 행크옥션 ★5 관심물건. 실거래 평균 ₩463M(3건). 네이버 호가 84타입 110건 ₩440~600M, 107동 ₩450~520M. **v4 비용 정정**: 명도 ₩500만(부부 소유 협조형), 수리 ₩100만(A,as-is)/₩300만(B,부분도배), 취득세 ₩453만(A,매매사업자)/₩227만(B,생애최초 50% 감면), 법무·예비 ₩200만 → A 비용 ₩12.5M / B 비용 ₩12.3M (기존 v3 ₩30M의 -₩17.6M). **v4 권장 입찰**: ₩395,118,743 (균형, A 8.8%/B 11.9%, 낙찰 25%) / ₩378,217,891 (단기 선호, A 13.4%/B 14.6%, 낙찰 10%) / ₩412,118,743 (안전 낙찰, B 9.4%, 낙찰 50%). 자금 OK. 수도권 이사 D+24~27개월 계획과 B 매도 시점 정합.",
    "sourcingSession": "2026-05-17 사용자 직접 발견 deep-dive + 호가 검증 + v3 매도가 정정 + v4 비용 정정",
    "addedAt": "2026-05-17",
    "updatedAt": "2026-05-17",
    "bldgYear": 2018,
    "hauctionUrl": "https://www.hauction.co.kr/search/auction/1502514",
    "procedure": "임의경매",
    "specialNote": "사용자 관심물건 ★5 (행크옥션 1차 관심 그룹). v4 비용 정정으로 단기 매도 영역(₩365~378M)에서 IRR 13~17% 가능",
    "naverData": {
      "source": "naver",
      "askingPrice": {
        "low": 440000000,
        "high": 600000000,
        "count": 110,
        "_note": "84타입 전체 110건, 사용자 직접 네이버부동산 확인 (2026-05-17). 107동만 ₩450~520M 좁은 범위"
      },
      "askingPrice107Dong": {
        "low": 450000000,
        "high": 520000000,
        "_note": "본건과 동일 107동"
      },
      "recentTradeAvg": 463000000,
      "recentTrades": [
        {
          "date": "2026-02",
          "price": 452500000,
          "area": 84.88,
          "floor": 14
        },
        {
          "date": "2025-08",
          "price": 475000000,
          "area": 84.88,
          "floor": 33
        },
        {
          "date": "2024-11",
          "price": 462500000,
          "area": 84.88,
          "floor": 4
        }
      ],
      "updatedAt": "2026-05-17"
    },
    "salesHistory": [
      {
        "caseNo": "2023-103214",
        "dongHo": "103동 3층 304호",
        "area": 74.53,
        "appraisal": 447000000,
        "soldPrice": 370000000,
        "soldRate": 0.8278,
        "saleDate": "2024-11-05",
        "outlier": true,
        "outlierReason": "사건 84.88㎡, 매각 사례 74㎡ (다른 평형 — 84㎡ 매각 이력 없음)"
      },
      {
        "caseNo": "2024-103921",
        "dongHo": "102동 10층 1003호",
        "area": 74.68,
        "appraisal": 433000000,
        "soldPrice": 380898999,
        "soldRate": 0.8797,
        "saleDate": "2024-10-14",
        "outlier": true,
        "outlierReason": "사건 84.88㎡, 매각 사례 74㎡"
      },
      {
        "caseNo": "2025-0700-045192",
        "dongHo": "상가동 201호",
        "area": 114.39,
        "appraisal": 421000000,
        "soldPrice": 295010000,
        "soldRate": 0.7,
        "saleDate": "2025-08-20",
        "outlier": true,
        "outlierReason": "상가, 본건 아파트와 다른 종별"
      }
    ]
  },
  {
    "id": "2025타경12308",
    "caseNumber": "2025타경12308",
    "court": "천안지원",
    "saleDate": "2026-06-01",
    "complex": "",
    "dongHo": "704동 15층1504호",
    "address": "충청남도 아산시 둔포면 석곡리 1810 아산테크노밸리 704동 15층1504호",
    "areaSqm": 84.8998,
    "appraisalPrice": 309000000,
    "minimumPrice": 216300000,
    "kbPrice": 300000000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 3,
    "rightsStatus": "확인 필요",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "pending",
    "verdictReason": "Routine 자동 추출 — 단지 매각가율·호가 검증 필요. ⚠️ API KB·rounds 정정 가능성 (v3.5 학습)",
    "tags": [
      "자동수집",
      "routine-2026-05-18",
      "routine-2026-05-19",
      "아산"
    ],
    "sourcingSession": "routine-daily-2026-05-18 + routine-daily-2026-05-19",
    "addedAt": "2026-05-18",
    "updatedAt": "2026-05-19",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2025&unique_number=12308"
  },
  {
    "id": "2025타경651",
    "caseNumber": "2025타경651",
    "court": "천안지원",
    "saleDate": "2026-06-01",
    "complex": "테크노밸리이지더원1단지",
    "dongHo": "104동 2층201호",
    "address": "충청남도 아산시 둔포면 석곡리 1808 테크노밸리이지더원1단지 104동 2층201호",
    "areaSqm": 79.9897,
    "appraisalPrice": 224000000,
    "minimumPrice": 156800000,
    "kbPrice": 210000000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 3,
    "rightsStatus": "확인 필요",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "pending",
    "verdictReason": "Routine 자동 추출 — 단지 매각가율·호가 검증 필요. ⚠️ API KB·rounds 정정 가능성 (v3.5 학습)",
    "tags": [
      "자동수집",
      "routine-2026-05-18",
      "routine-2026-05-19",
      "아산"
    ],
    "sourcingSession": "routine-daily-2026-05-18 + routine-daily-2026-05-19",
    "addedAt": "2026-05-18",
    "updatedAt": "2026-05-19",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2025&unique_number=651"
  },
  {
    "id": "2025타경608",
    "caseNumber": "2025타경608",
    "court": "천안지원",
    "saleDate": "2026-06-01",
    "complex": "극동늘푸른아파트",
    "dongHo": "112동 21층2104호",
    "address": "충청남도 천안시 서북구 두정동 526-1 극동늘푸른아파트 112동 21층2104호 외 1필지",
    "areaSqm": 59.91,
    "appraisalPrice": 175000000,
    "minimumPrice": 122500000,
    "kbPrice": 150000000,
    "rounds": 1,
    "region": "천안서북",
    "regionPriority": 1,
    "rightsStatus": "확인 필요",
    "rightsRisk": "safe",
    "saleRate": null,
    "rating": null,
    "verdict": "pending",
    "verdictReason": "Routine 자동 추출 — 단지 매각가율·호가 검증 필요. ⚠️ API KB·rounds 정정 가능성 (v3.5 학습)",
    "tags": [
      "자동수집",
      "routine-2026-05-18",
      "routine-2026-05-19",
      "천안서북"
    ],
    "sourcingSession": "routine-daily-2026-05-18 + routine-daily-2026-05-19",
    "addedAt": "2026-05-18",
    "updatedAt": "2026-05-19",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2025&unique_number=608"
  },
  {
    "id": "2025타경12011",
    "caseNumber": "2025타경12011",
    "court": "천안지원",
    "saleDate": "2026-06-01",
    "complex": "중앙하이츠오르젠2단지",
    "dongHo": "202동 5층502호",
    "address": "충청남도 아산시 배방읍 공수리 634 중앙하이츠오르젠2단지 202동 5층502호",
    "areaSqm": 84.988,
    "appraisalPrice": 222000000,
    "minimumPrice": 155400000,
    "kbPrice": 180000000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 3,
    "rightsStatus": "임차권등기,대항력 있는 임차인",
    "rightsRisk": "risky",
    "saleRate": null,
    "rating": null,
    "verdict": "pending",
    "verdictReason": "Routine 자동 추출 — 단지 매각가율·호가 검증 필요. ⚠️ API KB·rounds 정정 가능성 (v3.5 학습)",
    "tags": [
      "자동수집",
      "routine-2026-05-18",
      "routine-2026-05-19",
      "아산"
    ],
    "sourcingSession": "routine-daily-2026-05-18 + routine-daily-2026-05-19",
    "addedAt": "2026-05-18",
    "updatedAt": "2026-05-19",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2025&unique_number=12011"
  },
  {
    "id": "2025타경11930",
    "caseNumber": "2025타경11930",
    "court": "천안지원",
    "saleDate": "2026-06-02",
    "complex": "백석벽산블루밍1차",
    "dongHo": "103동 1층105호",
    "address": "충청남도 천안시 서북구 백석동 919 백석벽산블루밍1차 103동 1층105호",
    "areaSqm": 84.89,
    "appraisalPrice": 202000000,
    "minimumPrice": 141400000,
    "kbPrice": 219000000,
    "rounds": 1,
    "region": "천안서북",
    "regionPriority": 1,
    "rightsStatus": "권리 안전(A) — 임차인 없음·소유자 점유, 인수 0",
    "rightsRisk": "safe",
    "saleRate": 0.971,
    "saleRateNote": "지지옥션 동일평형(33평형) 103동 2025-477호 2025.12 매각가율 97.1% (1회 유찰 후 35명 경합, n=1). 천안서북 지역통계 최근 2026.05 73.0%로 냉각 추세이나 단지 자체 강세",
    "interestTier": "watchlist",
    "saleRateMu": 0.971,
    "saleRateSigma": 0.05,
    "saleRateN": 1,
    "bid70": 189345000,
    "neutralSalePrice": 195000000,
    "expectedProfit70": -2019387,
    "rating": null,
    "verdict": "hold",
    "verdictReason": "v8 수리비 제외 — 수리비 25M를 EP70에서 제외(명도·인수금과 동일 '사용자 판단' 항목)→EP70 -2.0M, ▷. 참고 예상수리비 25M(연식tier) 별도. [기존 v7재계산: S(실거래)195M·k70=0.971(동일평형 35명·매각가율97.1% 과열)→B70=189.3M·EP70=-27.0M → 제외. (2026-0…] (2026-06-01 v4)",
    "tags": [
      "★◇미달",
      "단지과열",
      "천안서북",
      "권리A",
      "v7재계산",
      "▷watchlist",
      "v8수리제외"
    ],
    "sourcingSession": "routine-daily-2026-05-19 + 2026-06-01 v2 Tier2 + 2026-06-01 v4 v7재계산",
    "addedAt": "2026-05-19",
    "updatedAt": "2026-06-01",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2025&unique_number=11930",
    "k70": 0.971,
    "repairCost": 25000000
  },
  {
    "id": "2025타경51294",
    "caseNumber": "2025타경51294",
    "court": "서산지원",
    "saleDate": "2026-06-02",
    "complex": "서산센트럴코아루아파트",
    "dongHo": "102동 17층1703호",
    "address": "충청남도 서산시 석림동 962 서산센트럴코아루아파트 102동 17층1703호",
    "areaSqm": 64.95,
    "appraisalPrice": 225000000,
    "minimumPrice": 110250000,
    "kbPrice": 225000000,
    "rounds": 2,
    "region": "서산",
    "regionPriority": 3,
    "rightsStatus": "임차권등기,대항력 있는 임차인",
    "rightsRisk": "risky",
    "saleRate": null,
    "rating": null,
    "verdict": "fail",
    "verdictReason": "v4 sweep Tier2 — 선순위임차권 인수 함정 — 보증금 2.3억, 예상배당 후 약 1.23억 매수인 인수(실거래 2.25억<보증금). (2026-06-01 v4)",
    "tags": [
      "자동수집",
      "routine-2026-05-19",
      "서산",
      "인수함정"
    ],
    "sourcingSession": "routine-daily-2026-05-19 + 2026-06-01 v4 sweep Tier2",
    "addedAt": "2026-05-19",
    "updatedAt": "2026-06-01",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2025&unique_number=51294",
    "interestTier": null
  },
  {
    "id": "2025타경51182",
    "caseNumber": "2025타경51182",
    "court": "서산지원",
    "saleDate": "2026-06-02",
    "complex": "파크빌2차아파트",
    "dongHo": "206동 2층203호",
    "address": "충청남도 당진시 원당동 1172 파크빌2차아파트 206동 2층203호",
    "areaSqm": 84.73,
    "appraisalPrice": 230000000,
    "minimumPrice": 112700000,
    "kbPrice": 175000000,
    "rounds": 2,
    "region": "당진",
    "regionPriority": 3,
    "rightsStatus": "임차권등기,대항력 있는 임차인",
    "rightsRisk": "risky",
    "saleRate": null,
    "rating": null,
    "verdict": "fail",
    "verdictReason": "v4 sweep Tier2 — 선순위임차권 인수 함정 — 보증금 2.3억, 예상배당 후 약 1.21억 매수인 인수(실거래 1.80억<보증금). (2026-06-01 v4)",
    "tags": [
      "자동수집",
      "routine-2026-05-19",
      "당진",
      "인수함정"
    ],
    "sourcingSession": "routine-daily-2026-05-19 + 2026-06-01 v4 sweep Tier2",
    "addedAt": "2026-05-19",
    "updatedAt": "2026-06-01",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2025&unique_number=51182",
    "interestTier": null
  },
  {
    "id": "2025타경11651",
    "caseNumber": "2025타경11651",
    "court": "천안지원",
    "saleDate": "2026-06-02",
    "complex": "아산풍기이지더원1차아파트",
    "dongHo": "102동 6층604호",
    "address": "충청남도 아산시 풍기동 514 아산풍기이지더원1차아파트 102동 6층604호",
    "areaSqm": 72.16,
    "appraisalPrice": 293000000,
    "minimumPrice": 143570000,
    "kbPrice": 265000000,
    "rounds": 2,
    "region": "아산",
    "regionPriority": 3,
    "rightsStatus": "임차권등기,대항력 있는 임차인",
    "rightsRisk": "risky",
    "saleRate": null,
    "rating": null,
    "verdict": "fail",
    "verdictReason": "v4 sweep Tier2 — 선순위임차권 인수 함정 — 보증금 3.1억, 예상배당 후 약 1.71억 매수인 인수(실거래 2.62억<보증금). 단기회전 부적합. (2026-06-01 v4)",
    "tags": [
      "자동수집",
      "routine-2026-05-19",
      "아산",
      "인수함정"
    ],
    "sourcingSession": "routine-daily-2026-05-19 + 2026-06-01 v4 sweep Tier2",
    "addedAt": "2026-05-19",
    "updatedAt": "2026-06-01",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2025&unique_number=11651",
    "interestTier": null
  },
  {
    "id": "2026타경10227",
    "caseNumber": "2026타경10227",
    "court": "천안지원",
    "saleDate": "2026-06-09",
    "complex": "아산한라비발디스마트밸리",
    "dongHo": "204동 703호",
    "address": "충남 아산시 음봉면 산동리 1066 아산한라비발디스마트밸리 204동 7층 703호",
    "areaSqm": 66,
    "appraisalPrice": 300000000,
    "minimumPrice": 300000000,
    "kbPrice": 300000000,
    "rounds": 0,
    "region": "아산",
    "regionPriority": 2,
    "rightsStatus": "권리 깨끗(인수 없음)",
    "rightsRisk": "safe",
    "saleRate": 0.948,
    "saleRateNote": "지지옥션 단지매각 5건 낙찰가율 94.8%·평균응찰 8.2명. 준공2024 신건. S=실거래median 3.105억(감정 100%)",
    "interestTier": null,
    "saleRateMu": 0.948,
    "saleRateSigma": 0.05,
    "saleRateN": 5,
    "k70": 0.948,
    "bid70": 295000000,
    "neutralSalePrice": 295000000,
    "repairCost": 3000000,
    "expectedProfit70": -10609050,
    "rating": null,
    "verdict": "fail",
    "verdictReason": "NO-GO — 경매 메리트 소멸(최저가≈시세) — 보수 매도 기준 2.95억(호가 하단) · 입찰권장 2.95억(70%) · 세전 EP70 -1061만원(제외) · 세후 -1061만원. 권리 raw 미검증(D-day 등기·임차조사 확인 필요). (2026-06-03 v9 재분석)",
    "tags": [
      "아산",
      "아산한라비발디스마트밸리",
      "신건",
      "▷watchlist",
      "v8수리제외",
      "v4sweep"
    ],
    "sourcingSession": "2026-06-01 v4 sweep",
    "addedAt": "2026-06-01",
    "updatedAt": "2026-06-01",
    "marketAnchorBasis": "호가 하단",
    "flipRepair": 1500000,
    "evictionEst": 3000000,
    "costBreakdown": {
      "acq": 3889050,
      "brokerage": 1180000,
      "etc": 2000000,
      "fixedTotal": 7069050,
      "interest": {
        "m3": 2655000,
        "m4": 3540000,
        "m5": 4425000,
        "m6": 5310000
      },
      "anchorMonths": 4,
      "k70": 0.9,
      "ltv": 0.8,
      "rate": 0.045
    },
    "taxOwner": "spouse",
    "taxableProfit": -10609050,
    "incomeTax": 0,
    "marginalRate": 0,
    "afterTaxProfit": -10609050,
    "naverData": {
      "source": "naver",
      "complexNo": "143364",
      "pyeong": {
        "no": "4",
        "exc": 65.72,
        "sup": 86.8,
        "name": "86A"
      },
      "askingPrice": {
        "low": 295000000,
        "high": 330000000,
        "median": 315000000,
        "count": 37,
        "area": 65.72
      },
      "askingList": [
        {
          "p": 295000000,
          "fl": "저/27",
          "ymd": "20260524"
        },
        {
          "p": 300000000,
          "fl": "1/26",
          "ymd": "20260514"
        },
        {
          "p": 310000000,
          "fl": "5/24",
          "ymd": "20260602"
        },
        {
          "p": 310000000,
          "fl": "고/24",
          "ymd": "20260603"
        },
        {
          "p": 330000000,
          "fl": "고/24",
          "ymd": "20260603"
        }
      ],
      "recentTrades": [
        {
          "date": "2026-02-21",
          "price": 316000000,
          "floor": 9,
          "area": 65.72
        },
        {
          "date": "2026-01-20",
          "price": 317000000,
          "floor": 11,
          "area": 65.72
        },
        {
          "date": "2025-10-27",
          "price": 320000000,
          "floor": 19,
          "area": 65.72
        },
        {
          "date": "2025-09-28",
          "price": 300000000,
          "floor": 16,
          "area": 65.72
        },
        {
          "date": "2025-08-13",
          "price": 280000000,
          "floor": 2,
          "area": 65.72
        },
        {
          "date": "2025-08-02",
          "price": 305000000,
          "floor": 18,
          "area": 65.72
        }
      ],
      "recentTrades6mo": [
        {
          "date": "2026-02-21",
          "price": 316000000,
          "floor": 9
        },
        {
          "date": "2026-01-20",
          "price": 317000000,
          "floor": 11
        }
      ],
      "lastTrade": {
        "date": "2026-02-21",
        "price": 316000000,
        "floor": 9
      },
      "recentTradeAvg": 316500000,
      "updatedAt": "2026-06-03"
    },
    "reportUrl": "report-2026타경10227.html"
  },
  {
    "id": "2025타경3558",
    "caseNumber": "2025타경3558",
    "court": "대전지방법원",
    "saleDate": "2026-06-10",
    "complex": "계룡(세종 조치원)",
    "dongHo": "2동 12층1203호",
    "address": "세종특별자치시 조치원읍 교리 11-1 계룡 2동 12층1203호",
    "areaSqm": 80.85,
    "appraisalPrice": 216000000,
    "minimumPrice": 151200000,
    "kbPrice": 184000000,
    "rounds": 1,
    "region": "세종",
    "regionPriority": 2,
    "rightsStatus": "권리 안전(A) — 임차인 없음·소유자 점유, 인수 0",
    "rightsRisk": "safe",
    "saleRate": null,
    "saleRateNote": "단지특화 매각가율 미확보. 세종 지역통계 87.9%는 신도시 편향(조치원 구도심 36년차엔 부적합) → 보수 0.80 추정(신뢰 낮음). 실거래 1.9억(감정대비 88%)",
    "interestTier": "watchlist",
    "saleRateMu": 0.8,
    "saleRateSigma": 0.05,
    "saleRateN": 0,
    "bid70": 157500000,
    "neutralSalePrice": 175000000,
    "expectedProfit70": 10669575,
    "rating": null,
    "verdict": "hold",
    "verdictReason": "관망 / 마진형 저가 한정 — 보수 매도 기준 1.75억(호가 하단 (최근 실거래 6개월내 없음)) · 입찰권장 1.57억(70%) · 세전 EP70 1067만원(watchlist) · 세후 891만원. 권리 raw 미검증(D-day 등기·임차조사 확인 필요). (2026-06-03 v9 재분석)",
    "tags": [
      "★◇미달",
      "노후36년",
      "세종조치원",
      "오분류정정",
      "v7재계산",
      "◇watch",
      "v8수리제외"
    ],
    "sourcingSession": "routine-daily-2026-05-27 + 2026-06-01 v2 Tier2 + 2026-06-01 v4 v7재계산",
    "addedAt": "2026-05-27",
    "updatedAt": "2026-06-01",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2025&unique_number=3558",
    "k70": 0.85,
    "repairCost": 25000000,
    "marketAnchorBasis": "호가 하단 (최근 실거래 6개월내 없음)",
    "flipRepair": 8000000,
    "evictionEst": 3000000,
    "costBreakdown": {
      "acq": 2240425,
      "brokerage": 700000,
      "etc": 2000000,
      "fixedTotal": 4940425,
      "interest": {
        "m3": 1417500,
        "m4": 1890000,
        "m5": 2362500,
        "m6": 2835000
      },
      "anchorMonths": 4,
      "k70": 0.9,
      "ltv": 0.8,
      "rate": 0.045
    },
    "taxOwner": "spouse",
    "taxableProfit": 10669575,
    "incomeTax": 1760480,
    "marginalRate": 0.165,
    "afterTaxProfit": 8909095,
    "naverData": {
      "source": "naver",
      "complexNo": "7145",
      "pyeong": {
        "no": "5",
        "exc": 80.85,
        "sup": 80.85,
        "name": "80B"
      },
      "askingPrice": {
        "low": 175000000,
        "high": 175000000,
        "median": 175000000,
        "count": 2,
        "area": 80.85
      },
      "askingList": [
        {
          "p": 175000000,
          "fl": "저/12",
          "ymd": "20260603"
        },
        {
          "p": 175000000,
          "fl": "2/12",
          "ymd": "20260527"
        }
      ],
      "recentTrades": [
        {
          "date": "2021-04-08",
          "price": 190000000,
          "floor": 12,
          "area": 80.85
        },
        {
          "date": "2020-11-02",
          "price": 125000000,
          "floor": 11,
          "area": 80.85
        },
        {
          "date": "2018-02-20",
          "price": 100000000,
          "floor": 10,
          "area": 80.85
        },
        {
          "date": "2017-05-09",
          "price": 100000000,
          "floor": 9,
          "area": 80.85
        },
        {
          "date": "2014-10-06",
          "price": 115000000,
          "floor": 3,
          "area": 80.85
        }
      ],
      "recentTrades6mo": [],
      "lastTrade": {
        "date": "2021-04-08",
        "price": 190000000,
        "floor": 12
      },
      "recentTradeAvg": null,
      "updatedAt": "2026-06-03"
    },
    "reportUrl": "report-2025타경3558.html"
  },
  {
    "id": "2025타경12425",
    "caseNumber": "2025타경12425",
    "court": "천안지원",
    "saleDate": "2026-06-23",
    "complex": "아산테크노밸리이지더원2단지",
    "dongHo": "209동 1302호",
    "address": "충남 아산시 둔포면 석곡리 1801 테크노밸리이지더원2단지 209동 13층 1302호",
    "areaSqm": 80,
    "appraisalPrice": 225000000,
    "minimumPrice": 157500000,
    "kbPrice": 238500000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 2,
    "rightsStatus": "권리 안전(A) — 임차인 없음·인수 0 (단 연체관리비 주의)",
    "rightsRisk": "safe",
    "saleRate": 0.9,
    "saleRateNote": "⚠️재매각 — 직전 2회차(2026.04.07) 응찰 29명·낙찰 ₩950,099,900(422%, 명백한 오기재) 후 대금미납(5/15) → 재매각. 2순위 ₩203,064,500(90.25%)이 현실 청산가. 단지 2023.10 동일평형 9명·84.2%. 최근 29명 신호로 μ=0.90 채택. 실거래 2.33억(103%)",
    "interestTier": "watchlist",
    "saleRateMu": 0.9025,
    "saleRateSigma": 0.05,
    "saleRateN": 2,
    "bid70": 197100000,
    "neutralSalePrice": 219000000,
    "expectedProfit70": 13352271,
    "rating": null,
    "verdict": "hold",
    "verdictReason": "관망 / 마진형 저가 한정 — 보수 매도 기준 2.19억(최근 실거래(호가보다 낮음)) · 입찰권장 1.97억(70%) · 세전 EP70 1335만원(watchlist) · 세후 983만원. 권리 raw 미검증(D-day 등기·임차조사 확인 필요). (2026-06-03 v9 재분석) — [v10.1 카페재분석] 중층·80㎡=유동성 양호. 같은단지 31평형 재매각(대금미납) 이력 주의. 권리 D-day 검증. · v10 재계산(본인 24%·100%대출, 2026-06-15)",
    "tags": [
      "아산",
      "이지더원2단지",
      "재매각",
      "과열29명",
      "v7재계산",
      "▷watchlist",
      "v8수리제외"
    ],
    "sourcingSession": "2026-06-01 v3 Tier2 + 2026-06-01 v4 v7재계산",
    "addedAt": "2026-06-01",
    "updatedAt": "2026-06-01",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2025&unique_number=12425",
    "k70": 0.9025,
    "repairCost": 7000000,
    "marketAnchorBasis": "최근 실거래(호가보다 낮음)",
    "flipRepair": 3000000,
    "evictionEst": 3000000,
    "costBreakdown": {
      "acq": 2715229,
      "brokerage": 876000,
      "etc": 2000000,
      "fixedTotal": 5591229,
      "interest": {
        "m3": 2217375,
        "m4": 2956500,
        "m5": 3695625,
        "m6": 4434750
      },
      "anchorMonths": 4,
      "k70": 0.9,
      "ltv": 1.0,
      "rate": 0.045
    },
    "taxOwner": "self",
    "taxableProfit": 13352271,
    "incomeTax": 3525000,
    "marginalRate": 0.264,
    "afterTaxProfit": 9827271,
    "naverData": {
      "source": "naver",
      "complexNo": "107732",
      "pyeong": {
        "no": "3",
        "exc": 79.98,
        "sup": 103,
        "name": "103"
      },
      "askingPrice": {
        "low": 215000000,
        "high": 240000000,
        "median": 240000000,
        "count": 11,
        "area": 79.98
      },
      "askingList": [
        {
          "p": 215000000,
          "fl": "고/15",
          "ymd": "20260525"
        },
        {
          "p": 225000000,
          "fl": "고/17",
          "ymd": "20260527"
        },
        {
          "p": 230000000,
          "fl": "중/18",
          "ymd": "20260506"
        },
        {
          "p": 240000000,
          "fl": "중/18",
          "ymd": "20260528"
        }
      ],
      "recentTrades": [
        {
          "date": "2026-05-05",
          "price": 200000000,
          "floor": 4,
          "area": 79.98
        },
        {
          "date": "2026-04-25",
          "price": 219000000,
          "floor": 10,
          "area": 79.98
        },
        {
          "date": "2026-04-20",
          "price": 232500000,
          "floor": 10,
          "area": 79.98
        },
        {
          "date": "2026-03-17",
          "price": 218000000,
          "floor": 15,
          "area": 79.98
        },
        {
          "date": "2026-02-03",
          "price": 225000000,
          "floor": 8,
          "area": 79.98
        }
      ],
      "recentTrades6mo": [
        {
          "date": "2026-05-05",
          "price": 200000000,
          "floor": 4
        },
        {
          "date": "2026-04-25",
          "price": 219000000,
          "floor": 10
        },
        {
          "date": "2026-04-20",
          "price": 232500000,
          "floor": 10
        },
        {
          "date": "2026-03-17",
          "price": 218000000,
          "floor": 15
        },
        {
          "date": "2026-02-03",
          "price": 225000000,
          "floor": 8
        }
      ],
      "lastTrade": {
        "date": "2026-05-05",
        "price": 200000000,
        "floor": 4
      },
      "recentTradeAvg": 218900000,
      "updatedAt": "2026-06-03"
    },
    "reportUrl": "report-2025타경12425.html"
  },
  {
    "id": "2025타경12665",
    "caseNumber": "2025타경12665",
    "court": "천안지원",
    "saleDate": "2026-06-23",
    "complex": "용화마을신도브래뉴",
    "dongHo": "104동 203호",
    "address": "충남 아산시 용화동 1623 용화마을 신도브래뉴 104동 2층 203호",
    "areaSqm": 60,
    "appraisalPrice": 213000000,
    "minimumPrice": 149100000,
    "kbPrice": 200500000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 2,
    "rightsStatus": "권리 안전(A) — 임차인 없음·인수 0",
    "rightsRisk": "safe",
    "saleRate": 0.8,
    "saleRateNote": "동일평형(27평형) 110동 2023-102211호 2023.11 매각가율 80% (1회유찰 후 5명 경합) — 이지더원(26~29명) 대비 저경쟁. 실거래 2.08억(감정 97%)",
    "interestTier": "watch",
    "saleRateMu": 0.8,
    "saleRateSigma": 0.05,
    "saleRateN": 1,
    "bid70": 164220000,
    "neutralSalePrice": 193200000,
    "expectedProfit70": 21422902,
    "rating": null,
    "verdict": "candidate",
    "verdictReason": "조건부 GO (수익 ◇) — 보수 매도 기준 1.93억(호가 하단) · 입찰권장 1.64억(70%) · 세전 EP70 2142만원(watch) · 세후 1507만원. 권리 raw 미검증(D-day 등기·임차조사 확인 필요). (2026-06-03 v9 재분석) — [v10.1 카페재분석] ⚠️저층(2층): 카페 유동성 학습상 저층은 매도 8개월+ 위험 → top EP70이나 보유 장기화 시 마진잠식·매도난이도. 5명 저경쟁은 강점. 충남 비조정=종소세 단일과세. · v10 재계산(본인 24%·100%대출, 2026-06-15)",
    "tags": [
      "아산",
      "용화마을신도브래뉴",
      "저경쟁",
      "v7재계산",
      "★",
      "v8수리제외"
    ],
    "sourcingSession": "2026-06-01 v3 전수Tier2 + 2026-06-01 v4 v7재계산",
    "addedAt": "2026-06-01",
    "updatedAt": "2026-06-01",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2025&unique_number=12665",
    "k70": 0.8,
    "repairCost": 10000000,
    "marketAnchorBasis": "호가 하단",
    "flipRepair": 5000000,
    "evictionEst": 3000000,
    "costBreakdown": {
      "acq": 2320998,
      "brokerage": 772800,
      "etc": 2000000,
      "fixedTotal": 5093798,
      "interest": {
        "m3": 1847475,
        "m4": 2463300,
        "m5": 3079125,
        "m6": 3694950
      },
      "anchorMonths": 4,
      "k70": 0.85,
      "ltv": 1.0,
      "rate": 0.045
    },
    "taxOwner": "self",
    "taxableProfit": 21422902,
    "incomeTax": 6354167,
    "marginalRate": 0.2966,
    "afterTaxProfit": 15068735,
    "naverData": {
      "source": "naver",
      "complexNo": "26912",
      "pyeong": {
        "no": "1",
        "exc": 59.96,
        "sup": 91.95,
        "name": "91"
      },
      "askingPrice": {
        "low": 190000000,
        "high": 225000000,
        "median": 210000000,
        "count": 22,
        "area": 59.96
      },
      "askingList": [
        {
          "p": 190000000,
          "fl": "8/31",
          "ymd": "20260602"
        },
        {
          "p": 200000000,
          "fl": "17/31",
          "ymd": "20260511"
        },
        {
          "p": 205000000,
          "fl": "중/25",
          "ymd": "20260601"
        },
        {
          "p": 215000000,
          "fl": "중/31",
          "ymd": "20260520"
        },
        {
          "p": 225000000,
          "fl": "고/31",
          "ymd": "20260515"
        }
      ],
      "recentTrades": [
        {
          "date": "2026-05-23",
          "price": 194000000,
          "floor": 9,
          "area": 59.96
        },
        {
          "date": "2026-05-17",
          "price": 247000000,
          "floor": 22,
          "area": 59.96
        },
        {
          "date": "2026-04-07",
          "price": 188000000,
          "floor": 9,
          "area": 59.96
        },
        {
          "date": "2026-04-04",
          "price": 208000000,
          "floor": 7,
          "area": 59.96
        },
        {
          "date": "2026-03-28",
          "price": 208000000,
          "floor": 27,
          "area": 59.96
        },
        {
          "date": "2026-03-10",
          "price": 185000000,
          "floor": 4,
          "area": 59.96
        },
        {
          "date": "2026-03-08",
          "price": 189000000,
          "floor": 5,
          "area": 59.96
        }
      ],
      "recentTrades6mo": [
        {
          "date": "2026-05-23",
          "price": 194000000,
          "floor": 9
        },
        {
          "date": "2026-05-17",
          "price": 247000000,
          "floor": 22
        },
        {
          "date": "2026-04-07",
          "price": 188000000,
          "floor": 9
        },
        {
          "date": "2026-04-04",
          "price": 208000000,
          "floor": 7
        },
        {
          "date": "2026-03-28",
          "price": 208000000,
          "floor": 27
        },
        {
          "date": "2026-03-10",
          "price": 185000000,
          "floor": 4
        },
        {
          "date": "2026-03-08",
          "price": 189000000,
          "floor": 5
        }
      ],
      "lastTrade": {
        "date": "2026-05-23",
        "price": 194000000,
        "floor": 9
      },
      "recentTradeAvg": 202714286,
      "updatedAt": "2026-06-03"
    },
    "reportUrl": "report-2025타경12665.html"
  },
  {
    "id": "2025타경15941",
    "caseNumber": "2025타경15941",
    "court": "홍성지원",
    "saleDate": "2026-06-23",
    "complex": "정은스카이빌",
    "dongHo": "101동 1503호",
    "address": "충남 보령시 명천동 1008 정은스카이빌 101동 15층 1503호",
    "areaSqm": 85,
    "appraisalPrice": 248000000,
    "minimumPrice": 173600000,
    "kbPrice": 226250000,
    "rounds": 1,
    "region": "보령",
    "regionPriority": 3,
    "rightsStatus": "권리 안전(A) — 공실(점유자 없음)·인수 0",
    "rightsRisk": "safe",
    "saleRate": null,
    "saleRateNote": "단지 매각사례 없음 → μ 0.80 추정(신뢰 낮음, 보령 외곽). 실거래 2.45억(감정 98%). 공실(강제집행 명도 280만)",
    "interestTier": "watch",
    "saleRateMu": 0.8,
    "saleRateSigma": 0.05,
    "saleRateN": 0,
    "bid70": 220500000,
    "neutralSalePrice": 245000000,
    "expectedProfit70": 15216705,
    "rating": null,
    "verdict": "candidate",
    "verdictReason": "조건부 GO (수익 ◇) — 보수 매도 기준 2.45억(최근 실거래(호가보다 낮음)) · 입찰권장 2.21억(70%) · 세전 EP70 1522만원(watch) · 세후 1120만원. 권리 raw 미검증(D-day 등기·임차조사 확인 필요). (2026-06-03 v9 재분석) — [v10.1 카페재분석] ✅공실→명도 용이(명도비 참고치 하향 여지). 단 보령 외곽+20년 구축 → 유동성 주의. · v10 재계산(본인 24%·100%대출, 2026-06-15)",
    "tags": [
      "보령",
      "정은스카이빌",
      "추정신뢰낮음",
      "v7재계산",
      "★",
      "v8수리제외"
    ],
    "sourcingSession": "2026-06-01 v3 전수Tier2 + 2026-06-01 v4 v7재계산",
    "addedAt": "2026-06-01",
    "updatedAt": "2026-06-01",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2025&unique_number=15941",
    "k70": 0.85,
    "repairCost": 25000000,
    "marketAnchorBasis": "최근 실거래(호가보다 낮음)",
    "flipRepair": 8000000,
    "evictionEst": 3000000,
    "costBreakdown": {
      "acq": 2995795,
      "brokerage": 980000,
      "etc": 2000000,
      "fixedTotal": 5975795,
      "interest": {
        "m3": 2480625,
        "m4": 3307500,
        "m5": 4134375,
        "m6": 4961250
      },
      "anchorMonths": 4,
      "k70": 0.9,
      "ltv": 1.0,
      "rate": 0.045
    },
    "taxOwner": "self",
    "taxableProfit": 15216705,
    "incomeTax": 4017210,
    "marginalRate": 0.264,
    "afterTaxProfit": 11199495,
    "naverData": {
      "source": "naver",
      "complexNo": "19098",
      "pyeong": {
        "no": "1",
        "exc": 84.57,
        "sup": 105.01,
        "name": "105"
      },
      "askingPrice": {
        "low": 260000000,
        "high": 260000000,
        "median": 260000000,
        "count": 1,
        "area": 84.57
      },
      "askingList": [
        {
          "p": 260000000,
          "fl": "저/15",
          "ymd": "20260523"
        }
      ],
      "recentTrades": [
        {
          "date": "2026-02-02",
          "price": 245000000,
          "floor": 12,
          "area": 84.57
        },
        {
          "date": "2025-08-04",
          "price": 230000000,
          "floor": 4,
          "area": 84.57
        },
        {
          "date": "2025-06-23",
          "price": 220000000,
          "floor": 15,
          "area": 84.57
        },
        {
          "date": "2025-03-16",
          "price": 245000000,
          "floor": 1,
          "area": 84.57
        },
        {
          "date": "2025-02-06",
          "price": 235000000,
          "floor": 14,
          "area": 84.57
        }
      ],
      "recentTrades6mo": [
        {
          "date": "2026-02-02",
          "price": 245000000,
          "floor": 12
        }
      ],
      "lastTrade": {
        "date": "2026-02-02",
        "price": 245000000,
        "floor": 12
      },
      "recentTradeAvg": 245000000,
      "updatedAt": "2026-06-03"
    },
    "reportUrl": "report-2025타경15941.html"
  },
  {
    "id": "2025타경801",
    "caseNumber": "2025타경801",
    "court": "천안지원",
    "saleDate": "2026-06-23",
    "complex": "아산테크노밸리이지더원9단지",
    "dongHo": "905동 303호",
    "address": "충남 아산시 둔포면 석곡리 1822 아산테크노밸리이지더원9단지 905동 3층 303호",
    "areaSqm": 85,
    "appraisalPrice": 348000000,
    "minimumPrice": 243600000,
    "kbPrice": 346250000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 2,
    "rightsStatus": "권리 안전(A) — 임차인 없음·인수 0 (연체관리비 주의)",
    "rightsRisk": "safe",
    "saleRate": 0.921,
    "saleRateNote": "동일평형(33평형) 903동 2025-552호 2026.01 매각가율 92.1% (1회유찰 후 12명). 실거래 3.42억(감정 98%)",
    "interestTier": "watch",
    "saleRateMu": 0.921,
    "saleRateSigma": 0.05,
    "saleRateN": 1,
    "bid70": 281520000,
    "neutralSalePrice": 312800000,
    "expectedProfit70": 20078575,
    "rating": null,
    "verdict": "candidate",
    "verdictReason": "조건부 GO (수익 ◇) — 보수 매도 기준 3.13억(호가 하단) · 입찰권장 2.82억(70%) · 세전 EP70 2008만원(watch) · 세후 1424만원. 권리 raw 미검증(D-day 등기·임차조사 확인 필요). (2026-06-03 v9 재분석) — [v10.1 카페재분석] 3층 저층이나 신축(≤8년)·85㎡주력·산단 배후로 완충. 저층 유동성 주의하며 ◇ 유지. · v10 재계산(본인 24%·100%대출, 2026-06-15)",
    "tags": [
      "아산",
      "이지더원9단지",
      "준과열",
      "v7재계산",
      "◇watch",
      "v8수리제외"
    ],
    "sourcingSession": "2026-06-01 v3 전수Tier2 + 2026-06-01 v4 v7재계산",
    "addedAt": "2026-06-01",
    "updatedAt": "2026-06-01",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2025&unique_number=801",
    "k70": 0.921,
    "repairCost": 3000000,
    "marketAnchorBasis": "호가 하단",
    "flipRepair": 1500000,
    "evictionEst": 3000000,
    "costBreakdown": {
      "acq": 3727425,
      "brokerage": 1251200,
      "etc": 2000000,
      "fixedTotal": 6978625,
      "interest": {
        "m3": 3167100,
        "m4": 4222800,
        "m5": 5278500,
        "m6": 6334200
      },
      "anchorMonths": 4,
      "k70": 0.9,
      "ltv": 1.0,
      "rate": 0.045
    },
    "taxOwner": "self",
    "taxableProfit": 20078575,
    "incomeTax": 5836601,
    "marginalRate": 0.2907,
    "afterTaxProfit": 14241974,
    "naverData": {
      "source": "naver",
      "complexNo": "143440",
      "pyeong": {
        "no": "2",
        "exc": 84.96,
        "sup": 111.3,
        "name": "111A"
      },
      "askingPrice": {
        "low": 310000000,
        "high": 350000000,
        "median": 340000000,
        "count": 80,
        "area": 84.96
      },
      "askingList": [
        {
          "p": 310000000,
          "fl": "12/15",
          "ymd": "20260603"
        },
        {
          "p": 320000000,
          "fl": "1/23",
          "ymd": "20260513"
        },
        {
          "p": 325000000,
          "fl": "중/25",
          "ymd": "20260515"
        },
        {
          "p": 340000000,
          "fl": "중/23",
          "ymd": "20260520"
        },
        {
          "p": 350000000,
          "fl": "고/23",
          "ymd": "20260528"
        }
      ],
      "recentTrades": [
        {
          "date": "2026-05-30",
          "price": 315000000,
          "floor": 1,
          "area": 84.96
        },
        {
          "date": "2026-05-15",
          "price": 330000000,
          "floor": 6,
          "area": 84.96
        },
        {
          "date": "2026-05-06",
          "price": 333000000,
          "floor": 14,
          "area": 84.96
        },
        {
          "date": "2026-05-02",
          "price": 325000000,
          "floor": 2,
          "area": 84.96
        },
        {
          "date": "2026-04-26",
          "price": 345000000,
          "floor": 16,
          "area": 84.96
        }
      ],
      "recentTrades6mo": [
        {
          "date": "2026-05-30",
          "price": 315000000,
          "floor": 1
        },
        {
          "date": "2026-05-15",
          "price": 330000000,
          "floor": 6
        },
        {
          "date": "2026-05-06",
          "price": 333000000,
          "floor": 14
        },
        {
          "date": "2026-05-02",
          "price": 325000000,
          "floor": 2
        },
        {
          "date": "2026-04-26",
          "price": 345000000,
          "floor": 16
        }
      ],
      "lastTrade": {
        "date": "2026-05-30",
        "price": 315000000,
        "floor": 1
      },
      "recentTradeAvg": 329600000,
      "updatedAt": "2026-06-03"
    },
    "reportUrl": "report-2025타경801.html"
  },
  {
    "id": "2025타경11474",
    "caseNumber": "2025타경11474",
    "court": "천안지원",
    "saleDate": "2026-06-15",
    "complex": "아산온천미소지움",
    "dongHo": "106동 1804호",
    "address": "충남 아산시 온천동 1935 아산온천미소지움 106동 18층 1804호",
    "areaSqm": 69,
    "appraisalPrice": 251000000,
    "minimumPrice": 175700000,
    "kbPrice": 241250000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 2,
    "rightsStatus": "권리 안전(A) — 등기 전부 말소·인수 0·소유자 점유·임차인 없음 (GG TIP '인수사항 없음')",
    "rightsRisk": "safe",
    "rightsVerified": true,
    "saleRate": 0.845,
    "saleRateNote": "단지 매각사례 n=2: 105동 22.7평 87%/7명(2024.12) + 106동 동일평형(20.9평) 82%/4명(2022.11). v7.1 약세보정(stale −3pp) 적용 μ≈0.845. ※v7은 매각가율 보조 — S=실거래 230M 1차 앵커",
    "interestTier": "watchlist",
    "saleRateMu": 0.845,
    "saleRateSigma": 0.025,
    "saleRateN": 2,
    "bid70": 207000000,
    "neutralSalePrice": 230000000,
    "expectedProfit70": 14141070,
    "rating": null,
    "verdict": "hold",
    "verdictReason": "권리 A 최종 검증 완료 — 등기부·매각물건명세서·감정평가서 3종 교차(전체 매각·인수 0·임차인 없음·부부 공동소유 점유). 본인 명의·100% 대출 기준: 보수 매도 2.30억(호가 하단) · 입찰권장 2.07억(70%) · 세전 EP70 1414만 · 세후 약 1041만(본인 24% 구간, 4개월 이자). 사용자 입찰 확정 207,219,743원(2026-06-15). (2026-06-14 v10 본인명의·100%대출 재계산)",
    "tags": [
      "아산",
      "온천미소지움",
      "deep-dive",
      "감정오염",
      "v7재계산",
      "▷watchlist",
      "권리검증완료",
      "본인명의입찰"
    ],
    "sourcingSession": "2026-06-01 v3 전수Tier2 + 2026-06-01 v4 v7재계산 + 2026-06-02 deep-dive + 2026-06-14 권리검증·본인명의 재계산",
    "addedAt": "2026-06-01",
    "updatedAt": "2026-06-14",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2025&unique_number=11474",
    "reportUrl": "report-2025타경11474.html",
    "k70": 0.9,
    "repairCost": 7000000,
    "salesHistory": [
      {
        "caseNo": "2024-2028",
        "dongHo": "105동 6층 603호",
        "area": 75,
        "appraisal": 266000000,
        "minPrice": 186200000,
        "soldPrice": 230778000,
        "soldRate": 0.868,
        "bidders": 7,
        "saleDate": "2024-12-02",
        "outlier": false,
        "note": "22.7평 다른평형"
      },
      {
        "caseNo": "2022-101082",
        "dongHo": "106동 2층 204호",
        "area": 69,
        "appraisal": 263000000,
        "minPrice": 184100000,
        "soldPrice": 215500000,
        "soldRate": 0.82,
        "bidders": 4,
        "saleDate": "2022-11-22",
        "outlier": false,
        "note": "동일평형 20.9평"
      }
    ],
    "naverData": {
      "source": "naver",
      "complexNo": "109884",
      "pyeong": {
        "no": "4",
        "exc": 68.98,
        "sup": 91.12,
        "name": "91"
      },
      "askingPrice": {
        "low": 230000000,
        "high": 260000000,
        "median": 240000000,
        "count": 18,
        "area": 68.98
      },
      "askingList": [
        {
          "p": 230000000,
          "fl": "2/20",
          "ymd": "20260528"
        },
        {
          "p": 240000000,
          "fl": "11/20",
          "ymd": "20260602"
        },
        {
          "p": 245000000,
          "fl": "2/20",
          "ymd": "20260526"
        },
        {
          "p": 255000000,
          "fl": "7/20",
          "ymd": "20260527"
        },
        {
          "p": 260000000,
          "fl": "10/20",
          "ymd": "20260530"
        }
      ],
      "recentTrades": [
        {
          "date": "2026-03-05",
          "price": 230000000,
          "floor": 15,
          "area": 68.98
        },
        {
          "date": "2026-02-07",
          "price": 232000000,
          "floor": 7,
          "area": 68.98
        },
        {
          "date": "2026-01-12",
          "price": 200000000,
          "floor": 14,
          "area": 68.98
        },
        {
          "date": "2025-12-20",
          "price": 228000000,
          "floor": 3,
          "area": 68.98
        },
        {
          "date": "2025-06-13",
          "price": 250000000,
          "floor": 20,
          "area": 68.98
        }
      ],
      "recentTrades6mo": [
        {
          "date": "2026-03-05",
          "price": 230000000,
          "floor": 15
        },
        {
          "date": "2026-02-07",
          "price": 232000000,
          "floor": 7
        },
        {
          "date": "2026-01-12",
          "price": 200000000,
          "floor": 14
        },
        {
          "date": "2025-12-20",
          "price": 228000000,
          "floor": 3
        }
      ],
      "lastTrade": {
        "date": "2026-03-05",
        "price": 230000000,
        "floor": 15
      },
      "recentTradeAvg": 222500000,
      "updatedAt": "2026-06-03"
    },
    "marketAnchorBasis": "호가 하단",
    "flipRepair": 3000000,
    "evictionEst": 3000000,
    "costBreakdown": {
      "acq": 2833930,
      "brokerage": 920000,
      "etc": 2000000,
      "fixedTotal": 5753930,
      "interest": {
        "m3": 2328750,
        "m4": 3105000,
        "m5": 3881250,
        "m6": 4657500
      },
      "anchorMonths": 4,
      "k70": 0.9,
      "ltv": 1.0,
      "rate": 0.045,
      "ltvNote": "2026-06-14: 보유현금 0 → 낙찰가 100% 대출(70% 경락+30% 신용, 이자 동일)"
    },
    "taxOwner": "self",
    "taxableProfit": 14141070,
    "incomeTax": 3733242,
    "marginalRate": 0.264,
    "afterTaxProfit": 10407828
  },
  {
    "id": "2025타경12295",
    "caseNumber": "2025타경12295",
    "court": "천안지원",
    "saleDate": "2026-06-22",
    "complex": "아산테크노밸리이지더원2단지",
    "dongHo": "202동 903호",
    "address": "충남 아산시 둔포면 석곡리 1801 테크노밸리이지더원2단지 202동 9층 903호",
    "areaSqm": 60,
    "appraisalPrice": 201000000,
    "minimumPrice": 140700000,
    "kbPrice": 192000000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 2,
    "rightsStatus": "권리 안전(A) 검증완료 — 말소기준 근저당 농협자산관리(2016-03-14·138M). 등기 11건(근저당2·가압류5·가처분·압류2·임의경매) 전부 말소·인수 0 확정(GG Tip '인수사항 없음'). 임차인 이녹스첨단소재(보20M) 전입·확정 모두 없음·전입세대 없음(2026-05-07)→대항력 없음·보증금 전액 소멸·인수 0. 미납관리비 0. 점유관계 미상(공실/소유자). 지지옥션 등기권리표·법원임차조사·전입세대조사·GG Tip 4종 검증",
    "rightsRisk": "safe",
    "rightsVerified": true,
    "saleRate": 0.929,
    "saleRateNote": "S=실거래(지지옥션 국토부 59.98㎡ 7건, 2025Q2~2026Q2 range 177~195M, 9층 mid-high median 190M, 최근 2026.03 190M). 동일동(202동) 12157 2026.02 매각가율 92.86%·28명(낙찰175.5M=당시실거래186M의94%, n=1 과열). 본건 조회수 81=12157종결시 172의 절반→과열 미재현 우세, 보통 k70=0.90 대표(saleRateMu 0.90). 감정201M=실거래+6% 경미오염→매각가율 보조강등(v7). KB 192M(미검증 보조). (2026-06-02 deep-dive 검증)",
    "interestTier": "watchlist",
    "saleRateMu": 0.9,
    "saleRateSigma": 0.05,
    "saleRateN": 1,
    "bid70": 165600000,
    "neutralSalePrice": 184000000,
    "expectedProfit70": 10842456,
    "rating": null,
    "verdict": "hold",
    "verdictReason": "관망 / 마진형 저가 한정 — 보수 매도 기준 1.84억(호가 하단) · 입찰권장 1.66억(70%) · 세전 EP70 1084만원(watchlist) · 세후 798만원. 권리 A 검증·인수 0. (2026-06-03 v9 재분석) — [v10.1 카페재분석] 이녹스(법인) 임차인 전입·확정 없음=대항요건 불비→인수0 (권리 케이스북 재확인). 과열단지 주의. 비조정 단일과세. · v10 재계산(본인 24%·100%대출, 2026-06-15)",
    "tags": [
      "아산",
      "이지더원2단지",
      "deep-dive",
      "권리A검증",
      "▷watchlist",
      "과열k70민감",
      "산단임대안전판",
      "v7시장앵커"
    ],
    "sourcingSession": "2026-06-01 v3 전수Tier2 + 2026-06-01 v4 v7재계산 + 2026-06-02 deep-dive + 지지옥션 권리검증",
    "addedAt": "2026-06-01",
    "updatedAt": "2026-06-02",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2025&unique_number=12295",
    "reportUrl": "report-2025타경12295.html",
    "k70": 0.9,
    "repairCost": 7000000,
    "salesHistory": [
      {
        "caseNo": "2025-12157",
        "dongHo": "202동 4층",
        "area": 59.98,
        "appraisal": 189000000,
        "minPrice": 132300000,
        "soldPrice": 175500000,
        "soldRate": 0.9286,
        "bidders": 28,
        "saleDate": "2026-02-10",
        "outlier": true,
        "note": "동일동(202동) 동일평형·과열 28명, 낙찰175.5M=당시실거래186M의94%"
      }
    ],
    "naverData": {
      "source": "naver",
      "complexNo": "107732",
      "pyeong": {
        "no": "2",
        "exc": 59.98,
        "sup": 83.82,
        "name": "83B"
      },
      "askingPrice": {
        "low": 183000000,
        "high": 200000000,
        "median": 200000000,
        "count": 10,
        "area": 59.98
      },
      "askingList": [
        {
          "p": 183000000,
          "fl": "2/25",
          "ymd": "20260512"
        },
        {
          "p": 190000000,
          "fl": "9/25",
          "ymd": "20260504"
        },
        {
          "p": 200000000,
          "fl": "4/25",
          "ymd": "20260517"
        }
      ],
      "recentTrades": [
        {
          "date": "2026-03-13",
          "price": 190000000,
          "floor": 22,
          "area": 59.98
        },
        {
          "date": "2025-10-14",
          "price": 185000000,
          "floor": 1,
          "area": 59.98
        },
        {
          "date": "2025-09-16",
          "price": 190000000,
          "floor": 5,
          "area": 59.98
        },
        {
          "date": "2025-08-21",
          "price": 191000000,
          "floor": 15,
          "area": 59.98
        },
        {
          "date": "2025-08-10",
          "price": 193000000,
          "floor": 9,
          "area": 59.98
        }
      ],
      "recentTrades6mo": [
        {
          "date": "2026-03-13",
          "price": 190000000,
          "floor": 22
        }
      ],
      "lastTrade": {
        "date": "2026-03-13",
        "price": 190000000,
        "floor": 22
      },
      "recentTradeAvg": 190000000,
      "updatedAt": "2026-06-03"
    },
    "marketAnchorBasis": "호가 하단",
    "flipRepair": 3000000,
    "evictionEst": 3000000,
    "costBreakdown": {
      "acq": 2337544,
      "brokerage": 736000,
      "etc": 2000000,
      "fixedTotal": 5073544,
      "interest": {
        "m3": 1863000,
        "m4": 2484000,
        "m5": 3105000,
        "m6": 3726000
      },
      "anchorMonths": 4,
      "k70": 0.9,
      "ltv": 1.0,
      "rate": 0.045
    },
    "taxOwner": "self",
    "taxableProfit": 10842456,
    "incomeTax": 2862408,
    "marginalRate": 0.264,
    "afterTaxProfit": 7980048
  },
  {
    "id": "2025타경12974",
    "caseNumber": "2025타경12974",
    "court": "천안지원",
    "saleDate": "2026-06-22",
    "complex": "신부 디 이스트",
    "dongHo": "109동 1202호",
    "address": "충남 천안시 동남구 신부동 988 신부 디 이스트 109동 12층 1202호",
    "areaSqm": 73,
    "appraisalPrice": 361000000,
    "minimumPrice": 252700000,
    "kbPrice": 325500000,
    "rounds": 1,
    "region": "천안동남",
    "regionPriority": 1,
    "rightsStatus": "권리 안전(A) 검증완료 — 말소기준 근저당 교보생명(2023-06-09). 등기 7건(가압류4·강제경매) 전부 말소·인수 0 확정(GG Tip '인수사항 없음'). 임차인 없음·소유자(권명주) 점유. 지지옥션 등기권리표·법원임차조사 검증. 잔여: 병합사건 2026-10346(중복·인수부담 아님) D-1 확인",
    "rightsRisk": "safe",
    "rightsVerified": true,
    "saleRate": 0.885,
    "saleRateNote": "네이버 실거래(fin.land 단지109735, 99A/B 전용72.7) 30평형 median 315M (2026년 285~347M, 52건)·호가 315~350M·KB/부동산원 평균 315M. 동일평형 119동 2024.03 매각가율 88.5%(7명)이나 감정 361M이 실거래 315M보다 15%↑(감정 오염) → k70은 응찰자 tier 0.90 적용. (2026-06-01 v4 네이버 확정, KB325.5 정정)",
    "interestTier": "watch",
    "saleRateMu": 0.9,
    "saleRateSigma": 0.05,
    "saleRateN": 1,
    "bid70": 272700000,
    "neutralSalePrice": 303000000,
    "expectedProfit70": 19375827,
    "rating": null,
    "verdict": "candidate",
    "verdictReason": "조건부 GO (수익 ◇) — 보수 매도 기준 3.03억(최근 실거래(호가보다 낮음)) · 입찰권장 2.73억(70%) · 세전 EP70 1938만원(watch) · 세후 1381만원. 권리 A 검증·인수 0. (2026-06-03 v9 재분석) — [v10.1 카페재분석] ✅2,144세대 대단지·중층·신축급=유동성 최우량(카페 '층/타입이 회전속도 좌우'에 부합)·소유자점유=명도 용이. 비조정 단일과세. · v10 재계산(본인 24%·100%대출, 2026-06-15)",
    "tags": [
      "천안동남",
      "신부디이스트",
      "deep-dive",
      "조건부GO",
      "권리A검증",
      "감정오염",
      "v7시장앵커",
      "◇watch"
    ],
    "sourcingSession": "2026-06-01 v3 전수Tier2 + 2026-06-01 v4 v7재계산 + 2026-06-02 deep-dive + 지지옥션 권리검증",
    "addedAt": "2026-06-01",
    "updatedAt": "2026-06-02",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2025&unique_number=12974",
    "reportUrl": "report-2025타경12974.html",
    "k70": 0.9,
    "repairCost": 3000000,
    "marketAnchorBasis": "최근 실거래(호가보다 낮음)",
    "flipRepair": 1500000,
    "evictionEst": 3000000,
    "costBreakdown": {
      "acq": 3621673,
      "brokerage": 1212000,
      "etc": 2000000,
      "fixedTotal": 6833673,
      "interest": {
        "m3": 3067875,
        "m4": 4090500,
        "m5": 5113125,
        "m6": 6135750
      },
      "anchorMonths": 4,
      "k70": 0.9,
      "ltv": 1.0,
      "rate": 0.045
    },
    "taxOwner": "self",
    "taxableProfit": 19375827,
    "incomeTax": 5566043,
    "marginalRate": 0.2873,
    "afterTaxProfit": 13809784,
    "naverData": {
      "source": "naver",
      "complexNo": "109735",
      "pyeong": {
        "no": "4",
        "exc": 72.7,
        "sup": 99.07,
        "name": "99A"
      },
      "askingPrice": {
        "low": 305000000,
        "high": 350000000,
        "median": 320000000,
        "count": 80,
        "area": 72.7
      },
      "askingList": [
        {
          "p": 305000000,
          "fl": "저/28",
          "ymd": "20260513"
        },
        {
          "p": 310000000,
          "fl": "9/32",
          "ymd": "20260603"
        },
        {
          "p": 320000000,
          "fl": "중/32",
          "ymd": "20260601"
        },
        {
          "p": 335000000,
          "fl": "고/32",
          "ymd": "20260530"
        },
        {
          "p": 350000000,
          "fl": "고/32",
          "ymd": "20260528"
        }
      ],
      "recentTrades": [
        {
          "date": "2026-05-21",
          "price": 325000000,
          "floor": 27,
          "area": 72.7
        },
        {
          "date": "2026-05-15",
          "price": 300000000,
          "floor": 3,
          "area": 72.7
        },
        {
          "date": "2026-05-01",
          "price": 315000000,
          "floor": 18,
          "area": 72.7
        },
        {
          "date": "2026-05-01",
          "price": 285000000,
          "floor": 2,
          "area": 72.7
        },
        {
          "date": "2026-04-28",
          "price": 309000000,
          "floor": 16,
          "area": 72.7
        },
        {
          "date": "2026-04-27",
          "price": 303000000,
          "floor": 6,
          "area": 72.7
        },
        {
          "date": "2026-04-02",
          "price": 285000000,
          "floor": 7,
          "area": 72.7
        }
      ],
      "recentTrades6mo": [
        {
          "date": "2026-05-21",
          "price": 325000000,
          "floor": 27
        },
        {
          "date": "2026-05-15",
          "price": 300000000,
          "floor": 3
        },
        {
          "date": "2026-05-01",
          "price": 315000000,
          "floor": 18
        },
        {
          "date": "2026-05-01",
          "price": 285000000,
          "floor": 2
        },
        {
          "date": "2026-04-28",
          "price": 309000000,
          "floor": 16
        },
        {
          "date": "2026-04-27",
          "price": 303000000,
          "floor": 6
        },
        {
          "date": "2026-04-02",
          "price": 285000000,
          "floor": 7
        }
      ],
      "lastTrade": {
        "date": "2026-05-21",
        "price": 325000000,
        "floor": 27
      },
      "recentTradeAvg": 303142857,
      "updatedAt": "2026-06-03"
    }
  },
  {
    "id": "2025타경12815",
    "caseNumber": "2025타경12815",
    "court": "천안지원",
    "saleDate": "2026-06-22",
    "complex": "아산대우푸르지오",
    "dongHo": "111동 1404호",
    "address": "충남 아산시 배방읍 공수리 1167 대우푸르지오 111동 14층 1404호",
    "areaSqm": 85,
    "appraisalPrice": 265000000,
    "minimumPrice": 185500000,
    "kbPrice": 241500000,
    "rounds": 1,
    "region": "아산",
    "regionPriority": 2,
    "rightsStatus": "권리 안전(A) — 임차인 없음. ⚠️연체관리비 400만",
    "rightsRisk": "safe",
    "saleRate": null,
    "saleRateNote": "단지 매각사례 없음 → μ 0.85 추정. 실거래 2.15억(감정 81%로 낮음). 18년차. 연체관리비 400만(인수)",
    "interestTier": "watchlist",
    "saleRateMu": 0.85,
    "saleRateSigma": 0.05,
    "saleRateN": 0,
    "bid70": 190440000,
    "neutralSalePrice": 211600000,
    "expectedProfit70": 12821624,
    "rating": null,
    "verdict": "hold",
    "verdictReason": "관망 / 마진형 저가 한정 — 보수 매도 기준 2.12억(호가 하단) · 입찰권장 1.90억(70%) · 세전 EP70 1282만원(watchlist) · 세후 944만원. 권리 raw 미검증(D-day 등기·임차조사 확인 필요). (2026-06-03 v9 재분석) — [v10.1 카페재분석] ⚠️연체 공용관리비 400만 낙찰자 인수(카페 명도 학습) — 비용 반영. 85㎡주력=유동성 양호. 권리 D-day 검증 필요. · v10 재계산(본인 24%·100%대출, 2026-06-15)",
    "tags": [
      "아산",
      "대우푸르지오",
      "v7재계산",
      "◇watch",
      "v8수리제외"
    ],
    "sourcingSession": "2026-06-01 v3 전수Tier2 + 2026-06-01 v4 v7재계산",
    "addedAt": "2026-06-01",
    "updatedAt": "2026-06-01",
    "hauctionUrl": "https://www.hauction.co.kr/search/auction?unique_year=2025&unique_number=12815",
    "k70": 0.85,
    "repairCost": 10000000,
    "marketAnchorBasis": "호가 하단",
    "flipRepair": 5000000,
    "evictionEst": 3000000,
    "costBreakdown": {
      "acq": 2635376,
      "brokerage": 846400,
      "etc": 2000000,
      "fixedTotal": 5481776,
      "interest": {
        "m3": 2142450,
        "m4": 2856600,
        "m5": 3570750,
        "m6": 4284900
      },
      "anchorMonths": 4,
      "k70": 0.9,
      "ltv": 1.0,
      "rate": 0.045
    },
    "taxOwner": "self",
    "taxableProfit": 12821624,
    "incomeTax": 3384909,
    "marginalRate": 0.264,
    "afterTaxProfit": 9436715,
    "naverData": {
      "source": "naver",
      "complexNo": "22534",
      "pyeong": {
        "no": "2",
        "exc": 84.8,
        "sup": 112.5,
        "name": "112"
      },
      "askingPrice": {
        "low": 175000000,
        "high": 260000000,
        "median": 230000000,
        "count": 21,
        "area": 84.8
      },
      "askingList": [
        {
          "p": 175000000,
          "fl": "1/15",
          "ymd": "20260512"
        },
        {
          "p": 189000000,
          "fl": "1/15",
          "ymd": "20260516"
        },
        {
          "p": 210000000,
          "fl": "1/15",
          "ymd": "20260603"
        },
        {
          "p": 215000000,
          "fl": "1/15",
          "ymd": "20260602"
        },
        {
          "p": 230000000,
          "fl": "12/15",
          "ymd": "20260531"
        },
        {
          "p": 260000000,
          "fl": "고/15",
          "ymd": "20260530"
        }
      ],
      "recentTrades": [
        {
          "date": "2026-03-28",
          "price": 200000000,
          "floor": 1,
          "area": 84.8
        },
        {
          "date": "2026-03-20",
          "price": 215000000,
          "floor": 15,
          "area": 84.8
        },
        {
          "date": "2026-02-26",
          "price": 245000000,
          "floor": 13,
          "area": 84.8
        },
        {
          "date": "2026-02-26",
          "price": 200000000,
          "floor": 9,
          "area": 84.8
        },
        {
          "date": "2026-02-12",
          "price": 250000000,
          "floor": 4,
          "area": 84.8
        },
        {
          "date": "2026-02-12",
          "price": 210000000,
          "floor": 10,
          "area": 84.8
        }
      ],
      "recentTrades6mo": [
        {
          "date": "2026-03-28",
          "price": 200000000,
          "floor": 1
        },
        {
          "date": "2026-03-20",
          "price": 215000000,
          "floor": 15
        },
        {
          "date": "2026-02-26",
          "price": 245000000,
          "floor": 13
        },
        {
          "date": "2026-02-26",
          "price": 200000000,
          "floor": 9
        },
        {
          "date": "2026-02-12",
          "price": 250000000,
          "floor": 4
        },
        {
          "date": "2026-02-12",
          "price": 210000000,
          "floor": 10
        }
      ],
      "lastTrade": {
        "date": "2026-03-28",
        "price": 200000000,
        "floor": 1
      },
      "recentTradeAvg": 220000000,
      "updatedAt": "2026-06-03"
    },
    "reportUrl": "report-2025타경12815.html"
  }
];





/**
 * Giscus 댓글 시스템 설정 (v0.5.0+)
 * - 각 사건마다 별도 discussion (data-mapping="specific", term=case.id)
 * - 디테일 패널의 "💬 의견 펼치기" 토글 클릭 시점에만 lazy embed
 * - Category: General
 */
window.GISCUS_CONFIG = {
  repo: "HaChanho/RealEstateStudy",
  repoId: "R_kgDOSOya2w",
  category: "General",
  categoryId: "DIC_kwDOSOya284C88NV",
  theme: "noborder_dark"
};

/**
 * Merge helper — 같은 id가 들어오면 필드 머지 (마지막 우선)
 */
window.AUCTION_MERGE = function (cases, incoming) {
  const map = new Map(cases.map((c) => [c.id, c]));
  for (const c of incoming) {
    if (map.has(c.id)) {
      map.set(c.id, { ...map.get(c.id), ...c, updatedAt: c.updatedAt || new Date().toISOString().slice(0, 10) });
    } else {
      map.set(c.id, c);
    }
  }
  return Array.from(map.values());
};
