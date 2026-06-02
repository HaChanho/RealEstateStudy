# 경매 케이스 캘린더 — 누적 저장소

부동산 경매 sourcing 결과를 한 곳에 누적해서 캘린더·리스트로 보고, 사건 chip 클릭으로 상세를 확인하는 도구.

## 열기

- 라이브 (GitHub Pages): https://hachanho.github.io/RealEstateStudy/calendar/
- 로컬: `_workspace/calendar/index.html` 더블클릭

## 파일 구조

```
_workspace/calendar/
├── index.html        # 뷰 + 로직 (단일 페이지)
├── cases.js          # 모델 예측·sourcing 데이터 (window.AUCTION_CASES = [...])
├── results.js        # 낙찰 실측·회고 (window.AUCTION_RESULTS = {...}, id로 join)
├── predictions.js    # 내 예상 낙찰가·사용자 베팅 (window.AUCTION_PREDICTIONS = {...}, id로 join)
└── README.md         # 이 문서
```

**3-layer 소유권 분리**: `cases.js`(모델 예측) · `results.js`(현실) · `predictions.js`(내 주관 베팅). 셋 다 사건번호 id로 join되며 서로 다른 주체가 write → 머지 충돌 구조적 제거.

## 기능

### 뷰 2종
- **📅 캘린더**: 월별 grid, chip 색상으로 verdict 1차 식별, D-Day 임박 사건 외곽 강조
- **📋 리스트**: 정렬 가능 테이블 (별점·매각일·마진·매각가율 등), 의사결정 우선순위 확인용

### chip 정보 밀도 (v0.2.0)
- 좌측 별점 동그라미 (★5=금색, ★4=라임, ★3=하늘, ★2=보라, ★1=회색)
- 중앙 라벨 (사건번호 단축 + 단지명 단축)
- 우측 미시 마진 미니 막대 (음수면 빨간색)

### D-Day 강조
- D-1 / D-Day: 빨간 외곽선 + pulse 애니메이션 + `urgent` 배지
- D-2 ~ D-3: 주황 외곽선 + `soon` 배지
- D-4 ~ D-7: 하늘색 배지

### deeplink
- `?case=2024타경112215` — 특정 사건 자동 열림
- `?view=list` — 리스트 탭으로 시작
- 디테일 패널의 "🔗 링크" 버튼으로 클립보드 복사 → 공유

### 네이버 부동산 통합
디테일 패널에 3종 링크 자동 생성:
- **단지 페이지**: `naverComplexNo`가 있으면 `https://new.land.naver.com/complexes/{n}`
- **부동산 검색**: 단지명+지역으로 모바일 land.naver.com 검색
- **통합 검색**: 단지명+주소로 search.naver.com

`naverData` 필드가 채워져 있으면 호가 범위·최근 실거래 평균·실거래 6건까지 인앱 표시.

### 별점 자동 채점 (v3.3 정책 정량화)
- **30점**: 단지 매각가율 (≤70%=30, ≤78%=25, ≤85%=12, ≤90%=5, 미확인=15)
- **25점**: 미시 마진 (KB-최저), 또는 KB 없으면 감정가 대비 dropPct
- **20점**: 권리 안전성 (safe=20, moderate=10, risky=0)
- **15점**: 지역 우선순위 (1=15, 2=10, 3=5)
- **10점**: 유찰 회차 (3+=10, 2=8, 1=6, 신건=2)
- 합계 ≥85% → ★5, ≥70% → ★4, ≥55% → ★3, ≥35% → ★2, 그 외 ★1
- 하드 탈락(권리 risky·면적·가격 초과)은 자동 ★1, 매각기일 경과는 별점 없음
- `case.rating`이 명시되면 자동 채점 우선순위보다 위. AI는 자동 채점만 부여.

### 💬 댓글 (Giscus)
GitHub Discussions 기반. setup 필요 — 아래 참고.

## 데이터 스키마 (v0.2.0)

`cases.js`의 `window.AUCTION_CASES`는 케이스 객체 배열. 동일 `id`가 들어오면 **머지 업데이트**.

### 필수/권장 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | string | 식별자 (보통 사건번호와 동일) |
| `caseNumber` | string | 표시용 사건번호 |
| `court` | string | 관할 법원 |
| `saleDate` | `YYYY-MM-DD` | 매각기일 |
| `complex` | string | 단지명 (**번지·N단지 표기 반영 필수**) |
| `dongHo` | string | "104동 401호" |
| `address` | string | 도로명·지번 주소 |
| `areaSqm` | number | 전용면적 (㎡) |
| `appraisalPrice` | number | 감정가 (원) |
| `minimumPrice` | number | 최저매각가 |
| `kbPrice` | number? | KB시세 |
| `rounds` | number | 유찰 횟수 (신건=0) |
| `region` | string | 지역 그룹 |
| `regionPriority` | 1\|2\|3 | finance.md priority |
| `rightsStatus` | string | 권리 표시 텍스트 |
| `rightsRisk` | `safe`\|`moderate`\|`risky` | |
| `saleRate` | 0~1? | 단지 매각가율 |
| `saleRateNote` | string? | 근거 메모 |
| `verdict` | enum | `pending`\|`candidate`\|`pass`\|`hold`\|`fail`\|`expired` |
| `verdictReason` | string | 판정 사유 |
| `rating` | 1~5? | 사용자 부여 (없으면 자동 채점) |
| `tags` | string[] | |
| `notes` | string? | 자유 메모 |
| `sourcingSession` | string | |
| `addedAt`, `updatedAt` | `YYYY-MM-DD` | |
| `hauctionUrl` | string? | 경매정보 사건 상세 URL (현 지지옥션 `ggi.co.kr`, 과거 행크옥션). 필드명은 스키마 호환 위해 유지 |
| `reportPath` | string? | deep-dive 보고서 경로 |

### 네이버 부동산 필드 (v0.2.0 신규)

```js
{
  naverComplexNo: 12345,   // 네이버 부동산 단지 ID (URL의 /complexes/{N})
  naverUrl: "https://...", // naverComplexNo 없을 때 직접 URL
  naverData: {
    askingPrice: {
      low: 380_000_000,     // 평형별 호가 하한
      high: 430_000_000,    // 평형별 호가 상한
      median: 405_000_000,  // 중앙값 (low/high 없을 때)
      count: 12             // 매물 수
    },
    recentTradeAvg: 395_000_000,  // 최근 3~6개월 실거래 평균
    recentTrades: [
      { date: "2026-03", price: 400_000_000, area: 84.68, floor: 12 },
      { date: "2026-02", price: 388_000_000, area: 84.68, floor: 5  }
    ],
    updatedAt: "2026-05-13"
  }
}
```

### naverComplexNo 찾는 법
1. 디테일 패널에서 "🟢 부동산 검색" 링크 클릭
2. 검색 결과에서 단지 클릭 → URL이 `new.land.naver.com/complexes/12345` 형태
3. 그 숫자가 `naverComplexNo`
4. `cases.js`의 해당 케이스에 추가

### 데이터 출처 (`naverData.source`)
| 값 | 의미 | 수집 방법 |
|----|------|---------|
| `naver` | 네이버 부동산 직접 (호가 + 실거래) | 사용자가 브라우저에서 직접 확인 후 입력 (Chrome MCP·WebFetch는 보안 차단됨) |
| `molit_public` | 국토부 공공 실거래 | AptInfo MCP로 자동 수집 가능 (호가 없음, 실거래만) |
| `user` | 사용자 입력 (혼합·요약) | 자유롭게 |

**중요**: 호가(`askingPrice`)는 공공 데이터에서 얻을 수 없으므로 `molit_public`은 `askingPrice: null`이고 `recentTrades` 위주로 채워짐. 호가 확보는 사용자 직접 네이버 접속 필요.

### AptInfo MCP로 실거래 보강 (반자동)
1. 단지명을 AptInfo `get_apt_list`로 검색 → `apartmentCode` 확인 (cases.js의 `aptInfoCode`에 기록)
2. `get_apt_price(lawd_cd, deal_ymd)` 로 시군구 월별 거래 조회 → 같은 단지·평형 필터
3. 평균/거래 6건 정리 후 `naverData.source = "molit_public"`로 저장

### 단지 매각 이력 (salesHistory)
같은 단지의 과거 매각 사례를 누적해서 **단지 매각가율 패턴**을 시각화합니다 (디테일 패널에 표 표시).

```js
salesHistory: [
  {
    caseNo: "2025-572",                  // 사건번호 (간략)
    dongHo: "302동 3층 301호",           // 동·층·호
    area: 84.73,                          // 전용㎡
    appraisal: 364000000,                 // 감정가
    minPrice: 254800000,                  // 최저가 (선택)
    soldPrice: 345000000,                 // 매각가
    soldRate: 0.948,                      // 매각가율 (매각가/감정가)
    kbRate: 0.958,                        // KB 매각가율 (선택)
    saleDate: "2026-04-20",
    outlier: false,                       // 평균에서 제외 여부
    outlierReason: "..."                  // outlier=true일 때 사유 (다른 평형/신건/시장과열 등)
  }
]
```

- 정상치 사례만 평균 매각가율 계산 (outlier=true는 line-through로 회색 표시, hover 시 사유)
- 매각가율 색상: ≤78% 녹색 / 78~88% 노랑 / ≥88% 빨강
- 지지옥션 단지 매각통계(동일번지 매각 사례) 또는 법원경매정보 매각통계에서 수집 권장

## 낙찰 결과 — `results.js` (회고 전용, cases.js와 분리)

`cases.js`(예측·sourcing, daily-sourcing routine 소유)와 **물리적으로 분리된** 별도 파일.
`weekly-retrospective` routine이 소유하며, 지난주 매각된 사건의 **실제 결과**를 사건번호 id로 기록한다.
캘린더는 두 파일을 id로 join하여 디테일 패널 "🏁 경매 결과 (회고)" 섹션과 칩/리스트 마커에 렌더한다.

```js
// _workspace/calendar/results.js
window.AUCTION_RESULTS_VERSION = "0.1.0";
window.AUCTION_RESULTS_UPDATED = "2026-05-20";
window.AUCTION_RESULTS = {
  "2025타경12066": {
    status: "sold",            // sold|failed|changed|withdrawn|postponed|unknown
    soldPrice: null,           // 낙찰가(원). 지지옥션은 구독 로그인이라 직접 확보. (이 레코드는 legacy — 행크옥션 비로그인 API 마스킹으로 null)
    soldRate: null,            // 낙찰가/감정가
    bidderCount: 11,           // 응찰자수 (비마스킹 — 수요 강도 대리지표)
    saleDateActual: "2026-05-13",
    quadrant: "FN",            // TP|FP|FN|TN|null (verdict GO/NO-GO × sold/failed)
    predictedSaleRate: 0.876,  // 회고 시점 cases.js 스냅샷 (비교 고정용)
    predictedVerdict: "fail",
    saleRateError: null,       // soldRate - predictedSaleRate
    priceMasked: true,         // 지지옥션은 통상 false. 이 레코드는 legacy(행크옥션) 마스킹 사례
    lesson: "78% 일괄컷 과도 — 11명 응찰",
    source: "hauction-api",    // ggi-chrome|user-assist (legacy: hauction-api, hauction-chrome)
    retrospectedAt: "2026-05-20"
  }
};
```

- **소유권 분할**: cases.js는 daily-sourcing(쓰기), results.js는 weekly-retrospective(쓰기). 두 routine이 다른 파일을 write → 머지 충돌 구조적 제거.
- **append-only**: 한 번 채운 결과는 덮어쓰지 않음 (정정은 새 회고 세션 entry).
- **quadrant 색상**: FN=빨강(놓친 기회) / FP=주황(헛 GO) / TP·TN=녹색(정확).
- index.html은 results.js를 cache-buster로 먼저 로드한 뒤 cases.js를 로드(체이닝). results.js 없어도 캘린더는 정상 동작.

## 내 예상 낙찰가 — `predictions.js` (사용자 베팅, 제3 계층)

`cases.js`(모델 예측)·`results.js`(실측)와 **물리 분리된** 제3의 소유권 계층 — **사용자의 주관적 낙찰가 베팅**.
사건당 **최대 2개**(예: 보수/공격 밴드). 같은 사건번호 id로 join.
매각 결과(`results.js` soldPrice)가 도래하면 디테일 패널 "🎯 내 예상 낙찰가" 섹션에서
**[내 예상 N개 + 모델 예측 vs 실측]** 3자 오차를 자동 비교하고 최소 |오차%|를 🏆로 강조한다.

```js
// _workspace/calendar/predictions.js
window.AUCTION_PREDICTIONS_VERSION = "0.1.0";
window.AUCTION_PREDICTIONS_UPDATED = "2026-06-02";
window.AUCTION_PREDICTIONS = {
  "2025타경11474": {
    predictedAt: "2026-06-02",        // 최초 입력일(엔트리 기준). bid별 at 없으면 이 값 사용
    bids: [                            // 최대 2개
      { value: 220000000, memo: "보수 — 저경쟁(≤6명) 가정" },
      { value: 240000000, memo: "공격 — 27평 수요 강세 시" }   // at: "YYYY-MM-DD" (선택)
    ]
  }
};
```

- **입력 방식**: 채팅으로 LLM에게 지시 → LLM이 이 파일에 기록·push. 예) `"11474 예상낙찰가 2.2억 보수, 2.4억 공격"` / 둘째 칸 추가는 `"11474 예상낙찰가 추가 2.4억 공격"`. 이미 2개면 3번째 입력 시 어느 칸(①/②)을 교체할지 확인 후 기록.
- **모델 예측 낙찰가** = `감정가 × 예측 매각가율`(`saleRateMu → saleRate → deriveSaleRate`). bid70(권장 입찰가)이 아니라 **낙찰가 점추정** — 기존 회고 캘리브레이션(predictedSaleRate→soldRate)과 동일 축.
- **소유권 분할**: 사용자(쓰기) 전용. 회고 routine·sourcing이 건드리지 않음 → 머지 충돌 구조적 제거.
- index.html 로드 체인: results.js → **predictions.js** → cases.js. predictions.js 없거나 비어 있어도 캘린더는 정상 동작(예측 없으면 🎯 섹션 자체가 숨김).

## Giscus 설정

GitHub Discussions 기반 댓글 시스템. 사용자 1회 setup 필요 (1~2분).

### Step 1: GitHub Discussions 활성화
저장소 Settings → General → Features → **Discussions** 체크. (또는 `gh api -X PATCH repos/HaChanho/RealEstateStudy -f has_discussions=true`)

### Step 2: Giscus GitHub App 설치
1. https://github.com/apps/giscus 방문 → "Install"
2. RealEstateStudy 저장소에 접근 권한 부여

### Step 3: Giscus 설정 가져오기
1. https://giscus.app 방문
2. Repository: `HaChanho/RealEstateStudy`
3. Page ↔ Discussions Mapping: **pathname** 권장
4. Discussion Category: `General` (또는 새로 만든 `Comments`)
5. 페이지 하단의 설정 스니펫에서 다음 값 확인:
   - `data-repo-id` (예: `R_kgDOXxxxxx`)
   - `data-category-id` (예: `DIC_kwDOXxxxxxxxxxxxxxx`)

### Step 4: cases.js에 한 줄 추가
파일 끝에 추가:

```js
window.GISCUS_CONFIG = {
  repo: "HaChanho/RealEstateStudy",
  repoId: "R_kgDOXxxxxx",                  // ← Step 3에서 받은 값
  category: "General",
  categoryId: "DIC_kwDOXxxxxxxxxxxxxxx",   // ← Step 3에서 받은 값
  mapping: "pathname",
  theme: "noborder_dark"
};
```

이렇게 하면 페이지 하단 placeholder가 진짜 Giscus 댓글창으로 자동 교체됩니다.

## 누적 사용법

### 새 케이스 추가
`cases.js`의 `AUCTION_CASES` 배열 끝에 객체 append. `id`가 기존과 겹치지 않게.

### 기존 케이스 업데이트
같은 `id`로 객체를 통째 갈아치우지 말고, 필드만 수정. `updatedAt`도 갱신.

### 별점
- AI는 v3.3 정책 기반 자동 채점만 부여 → `rating` 필드는 비워둠
- 사용자가 직접 override 하려면 `case.rating = 4` 식으로 명시. 표시 시 "사용자 부여" 라벨 자동 부착.

## 변경 이력

| 버전 | 날짜 | 변경 |
|------|------|------|
| 0.1.0 | 2026-05-13 | 초기 구성 (46건 raw + 5/13 v3 검증 데이터, v3.3 필터, 자동 별점) |
| 0.2.0 | 2026-05-13 | 캘린더/리스트 탭, deeplink, D-Day 강조, chip 정보밀도, 네이버 부동산 섹션, Giscus 임베드 |
| 0.2.1 | 2026-05-13 | `naverData.source` 필드 추가 (`naver` / `molit_public` / `user`). 탕정삼성트라팰리스(112215) AptInfo 공공 실거래 보강: 84.68㎡ 1층 ₩282M / 10층 ₩382M — KB ₩395M의 -28% 갭 확인 |
| 0.2.2 | 2026-05-13 | 8개 사건에 `naverComplexNo` 추가 — 디테일 패널 "단지 페이지" 버튼 1클릭 점프 |
| 0.3.0 | 2026-05-13 | `salesHistory` 필드 + UI 표 섹션 추가 (단지 매각 이력 누적). 탕정삼성트라팰리스 84㎡ 매각 사례 5건 평균 매각가율 89% 확인 → 112215 verdict hold → fail |
| 0.4.0 | 2026-05-13 | (1) 자동 saleRate 도출 — salesHistory 정상치 평균을 채점에 자동 반영 (신뢰도 페널티 포함). (2) 입찰가 시나리오 매트릭스 — 매각가율 3종×매도 가정 2종 = 6 시나리오 자동 계산. (3) 단지 응집 뷰 — 같은 단지 다른 사건 클릭 1회 점프 |
| 0.5.0 | 2026-05-17 | UX 개선 3종 + schema drift 해소. (1) **사건 chip 클릭 시 디테일 패널 자동 top 스크롤 + flash 애니메이션** — 동일 패널 내용 교체를 즉시 인지. (2) **날짜별 "+N건" expand 상태 유지** — `state.expandedDates` 도입으로 chip 클릭 재렌더에서도 펼침 보존, "− 접기" 토글 추가. (3) **판정 다중 토글 필터** — 기존 단일 `<select>` 폐기, 6 verdict (Pending·Candidate·Pass·Hold·Fail·Expired)별 chip 버튼으로 표시/숨김 토글, localStorage(`calendar.verdictHidden.v1`)로 선호도 영속화, **기본 Fail 숨김**. (4) `candidate` verdict 정식 등록 (#a78bfa 보라) — CSS·stats pill·verdict-badge·dot 일관 적용 |
| 0.6.0 | 2026-05-17 | UX 개선 5종 — 가시성·강조·인터랙션. (1) **테마 elevation** — 디테일 패널 전용 `--panel-bg`(#1c2549)로 캘린더 day cell과 색 분리 + 좌측 그림자로 깊이감. (2) **선택 chip 강조** — 3px outline + accent glow + scale 1.04 + 좌측 ▸ 화살표 pulse 애니메이션. (3) **가격 강조 variant** — 디테일 패널 핵심 수치 4종(감정가·최저가·KB시세·미시 마진)이 18px 굵은 amber, 좌측 보더 + 미시 마진은 sign에 따라 positive(녹색)/negative(빨강) 자동 톤. (4) **한국식 금액 표기** — `fmtMoney`가 "2억 7,700만원" 형태로 변환, list view용 `fmtMoneyShort`("2.77억")는 컬럼 너비 보존, 정확한 값은 hover title. (5) **드래그 리사이즈** — 패널 좌측 핸들로 너비 자유 조절(380~85vw), 더블클릭 시 460px 리셋, `calendar.panelWidth.v1` localStorage 영속화 |
| 0.6.1 | 2026-05-17 | **패널-캘린더 영역 분리 강화** — 3대 시각 신호 동시 적용. (a) **Hue shift**: 패널 bg를 보라 계열(`#2a2548`)로 시프트 — 캘린더 파랑(`#121831`)과 색상 자체가 다른 plane으로 인식. (b) **10px 갭**: `margin-left: 10px`로 두 영역 사이 실제 빈 공간 확보. (c) **4px violet accent stripe + 다층 그림자**: 좌측 4px `--panel-accent`(#a78bfa) 보더 + hairline accent + 28px/8px 2단 그림자. (d) body `--bg`도 `#050811`로 더 진하게 — day cell 대비 강화 |
| 0.7.0 | 2026-05-17 | **라이트 테마 전환** — 캘린더를 흰색 working surface로, 디테일 패널을 옅은 lavender(`#faf5ff`)로 차별화. (1) 팔레트 전면 교체: `--bg`(pale cool gray)·`--surface`(white day cells)·`--panel-bg`(pale lavender)·다크 텍스트(`#1a1f2e`). (2) Verdict/Risk/D-Day 배지 색상 라이트 대응 — 알파 18~22%, foreground 텍스트를 어두운 shade로 변환(0369a1·6d28d9·047857·b45309·b91c1c). (3) Selected chip outline을 `--accent-strong`(`#1e40af`)로, glow도 라이트에 맞게 톤다운. (4) 패널 그림자도 light theme 관례에 맞춰 부드럽게(rgba(31,41,55,.10/.07)). (5) 별점 dot·rating chip도 흰색 위 가독 가능한 채도로 재배치. 다크 모드는 git history에 보존(v0.6.1) |
| 0.8.0 | 2026-06-02 | **내 예상 낙찰가 트래킹 — `predictions.js` 제3 계층 신설.** 사건당 최대 2개(보수/공격 밴드) 사용자 주관 베팅. 매각 결과 도래 시 디테일 패널 "🎯 내 예상 낙찰가" 섹션에서 [내 예상 N + 모델 예측(감정가×예측매각가율) vs 실측] 3자 오차 자동 비교 + 최소 |오차%| 🏆 강조. 입력은 채팅으로 LLM에게 지시 → predictions.js 기록. 로드 체인 results.js→predictions.js→cases.js. 예측 없으면 🎯 섹션 숨김(무손상) |
| 0.7.1 | 2026-05-17 | **라이트 톤 가다듬기** — chip과 패널을 modern light-admin 스타일로 통일. (a) **Outlined soft chip**: 사건 chip 알파 .20~.22 → .08~.12로 거의 흰색에 가깝게, 보더는 verdict 색 .55~.60 유지, 텍스트를 verdict별 darker shade(`#075985`·`#5b21b6`·`#065f46`·`#92400e`)로 명시 — Notion·Linear 톤. (b) **패널 hue 중화**: `--panel-bg`를 lavender(`#faf5ff`) → neutral cool gray(`#f7f8fc`)로, 보라 hue는 좌측 3px stripe(이전 4px)와 hairline shadow에만 남김. (c) 패널 그림자 더 부드럽게(rgba .08/.05) — 캘린더 흰 표면과 자연스럽게 어우러짐 |
