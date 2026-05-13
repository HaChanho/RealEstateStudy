# 경매 케이스 캘린더 — 누적 저장소

부동산 경매 sourcing 결과를 한 곳에 누적해서 캘린더로 보고, 사건 chip 클릭으로 상세를 보는 도구.

## 열기

```
open _workspace/calendar/index.html
```

(또는 Finder에서 더블클릭. file:// 직접 열기 OK — fetch 없이 `<script src="cases.js">`로 데이터 로드)

## 파일 구조

```
_workspace/calendar/
├── index.html      # 뷰 + 로직 (단일 페이지)
├── cases.js        # 데이터 (window.AUCTION_CASES = [...])
└── README.md       # 이 문서
```

데이터/뷰 분리. 여러 세션이 cases.js만 수정해도 즉시 반영.

## 데이터 스키마

`cases.js`의 `window.AUCTION_CASES` 는 케이스 객체 배열입니다. 동일 `id`가 들어오면 새 객체로 추가하지 말고 기존 객체를 **머지 업데이트** 하세요.

### 필드 (case object)

| 필드 | 타입 | 필수 | 설명 |
|------|------|-----|------|
| `id` | string | ✅ | 식별자. 사건번호와 동일하게 사용 (예: `"2024타경112215"`) |
| `caseNumber` | string | ✅ | 표시용 사건번호 (중복사건 표기 포함 가능) |
| `court` | string | ✅ | 관할 법원 (`천안지원`, `평택지원`, `여주지원` 등) |
| `saleDate` | string `YYYY-MM-DD` | ✅ | 매각기일 |
| `complex` | string | ✅ | 단지명. **번지·N단지 표기 반영 필수** (성지새말 1단지/2단지) |
| `dongHo` | string | | "104동 401호" |
| `address` | string | | 도로명·지번 주소 |
| `areaSqm` | number | ✅ | 전용면적 (㎡, 소수 2자리) |
| `appraisalPrice` | number | ✅ | 감정가 (원, 정수) |
| `minimumPrice` | number | ✅ | 최저매각가 |
| `kbPrice` | number | | KB시세 (있을 때만) |
| `rounds` | number | ✅ | 유찰 횟수 (신건 = 0) |
| `region` | string | ✅ | `천안서북`, `천안동남`, `아산`, `평택`, `안성`, `이천` 등 |
| `regionPriority` | 1\|2\|3 | ✅ | 검색 우선순위 (finance.md priority) |
| `rightsStatus` | string | ✅ | 권리 표시 텍스트 (행크옥션 통합) |
| `rightsRisk` | `safe`\|`moderate`\|`risky` | ✅ | 권리 등급 |
| `saleRate` | number (0~1) | | 단지 매각가율 (소수). 미확인이면 `null` |
| `saleRateNote` | string | | 매각가율 근거 메모 |
| `verdict` | enum | ✅ | `pending` / `pass` / `hold` / `fail` / `expired` |
| `verdictReason` | string | ✅ | 판정 사유 한 줄 |
| `rating` | 1~5 \| null | | 사용자 별점. AI는 부여하지 않음 |
| `tags` | string[] | | 자유 태그 — 검색·필터에 활용 |
| `notes` | string | | 자유 메모 (긴 문장 OK) |
| `sourcingSession` | string | ✅ | 발견된 sourcing 라벨 (예: `"2026-05-12 v1"`) |
| `addedAt` | `YYYY-MM-DD` | ✅ | 최초 추가일 |
| `updatedAt` | `YYYY-MM-DD` | ✅ | 마지막 갱신일 |
| `hauctionUrl` | string | | 행크옥션 사건 페이지 URL |
| `reportPath` | string | | deep-dive 보고서 경로 (있을 경우) |

### verdict 의미

| verdict | 색 | 의미 |
|---------|----|------|
| `pending` | 🔵 sky | raw 추출만 됨, 행크옥션 미검증 |
| `pass` | 🟢 emerald | v3.3 모든 필터 통과 → deep-dive 진입 가능 |
| `hold` | 🟡 amber | 정보 부족 (단지 매각가율 미확인 등), 사용자 결정 대기 |
| `fail` | ⚪ gray | 자동/검증 탈락 |
| `expired` | ⚫ zinc | 매각기일 경과 |

### rightsRisk 기준

| risk | 기준 |
|------|------|
| `safe` | 인수금 0, 임차인 없거나 대항력 없음, HUG 대항력포기확약서 제출 |
| `moderate` | 임금채권자·전세권자 배당요구 등 마찰 가능 |
| `risky` | 대항력 임차인 인수, HUG 임차권 승계/양수, 지분매각, 상속분쟁 |

## 케이스 추가/수정 (AI·사람 공통)

### 새 케이스 추가
`cases.js`의 `AUCTION_CASES` 배열 끝에 객체 append. `id`가 기존과 겹치지 않게.

### 기존 케이스 업데이트
같은 `id`로 객체를 통째 갈아치우지 말고, 기존 객체를 찾아 필드만 수정. `updatedAt`도 갱신.

다른 세션에서 일괄 머지가 필요하면 `window.AUCTION_MERGE(기존, 신규)` 헬퍼 사용 가능 (cases.js 하단 참고).

### 별점 부여 (사람만)
객체의 `rating` 필드에 1~5 (정수). MVP는 표시만, 인터랙티브 입력은 후속 작업.

## 다음 단계 (roadmap)

- [ ] 별점을 UI에서 클릭 → cases.js에 자동 반영 (localStorage 임시 저장 + "내보내기" 클립보드)
- [ ] verdict가 `pending`인 케이스 일괄 검증 (행크옥션 일괄 fetcher)
- [ ] 등급별 정렬 (rating desc) + Top N 핀
- [ ] 사건별 분석 보고서(`reportPath`)를 인앱 임베드
- [ ] 매각기일 D-day 카운트다운 표시
- [ ] CSV/JSON export

## 정책 변경 이력

| 날짜 | 변경 |
|------|------|
| 2026-05-13 | 초기 구성 (46건 raw + 5/13 v3 검증 데이터 통합, v3.3 필터 반영) |
