# 경매 케이스 캘린더 — 누적 저장소

부동산 경매 sourcing 결과를 한 곳에 누적해서 캘린더·리스트로 보고, 사건 chip 클릭으로 상세를 확인하는 도구.

## 열기

- 라이브 (GitHub Pages): https://hachanho.github.io/RealEstateStudy/calendar/
- 로컬: `_workspace/calendar/index.html` 더블클릭

## 파일 구조

```
_workspace/calendar/
├── index.html      # 뷰 + 로직 (단일 페이지)
├── cases.js        # 데이터 (window.AUCTION_CASES = [...])
└── README.md       # 이 문서
```

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
| `verdict` | enum | `pending`\|`pass`\|`hold`\|`fail`\|`expired` |
| `verdictReason` | string | 판정 사유 |
| `rating` | 1~5? | 사용자 부여 (없으면 자동 채점) |
| `tags` | string[] | |
| `notes` | string? | 자유 메모 |
| `sourcingSession` | string | |
| `addedAt`, `updatedAt` | `YYYY-MM-DD` | |
| `hauctionUrl` | string? | |
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
