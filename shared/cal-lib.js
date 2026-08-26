// 공유 순수함수 — Node(require)와 브라우저(window.CalLib) 양쪽.
// 부수효과 없음. 현재 시각이 필요한 함수는 인자로 받는다(테스트 결정성).
(function (factory) {
  const lib = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = lib;
  if (typeof window !== 'undefined') window.CalLib = lib;
})(function () {
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
  const DAY_MS = 24 * 60 * 60 * 1000;
  const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

  // UTC 밀리초 → KST 기준 'YYYY-MM-DD'.
  // toISOString()을 직접 쓰면 UTC 날짜가 되어 KST 00:00~09:00에 전날이 나온다.
  function todayKST(nowMs) {
    const ms = (nowMs == null) ? Date.now() : nowMs;
    return new Date(ms + KST_OFFSET_MS).toISOString().slice(0, 10);
  }

  function monthKeyOf(dateStr) {
    return String(dateStr || '').slice(0, 7); // 'YYYY-MM'
  }

  function monthKeyToObj(key) {
    const y = Number(key.slice(0, 4));
    const m = Number(key.slice(5, 7)) - 1; // 0-based (state.currentMonth 규약)
    return { y: y, m: m };
  }

  // 데이터가 있는 달 중 오늘에 가장 가까운 달. 미래 우선, 없으면 과거.
  function pickEntryMonth(saleDates, todayStr) {
    const keys = [];
    const seen = new Set();
    for (const d of (saleDates || [])) {
      const k = monthKeyOf(d);
      if (k.length !== 7 || seen.has(k)) continue;
      seen.add(k);
      keys.push(k);
    }
    if (!keys.length) return null;
    keys.sort();
    const todayKey = monthKeyOf(todayStr);
    if (seen.has(todayKey)) return monthKeyToObj(todayKey);
    const future = keys.find((k) => k > todayKey);
    if (future) return monthKeyToObj(future);
    return monthKeyToObj(keys[keys.length - 1]);
  }

  // 딥링크(?case=)가 가리키는 사건의 매각기일이 속한 달.
  function monthOfCase(cases, caseId) {
    for (const c of (cases || [])) {
      if (c && c.id === caseId) {
        const k = monthKeyOf(c.saleDate);
        return k.length === 7 ? monthKeyToObj(k) : null;
      }
    }
    return null;
  }

  // 별점 내림차순. 무등급(null/undefined)은 항상 뒤. 동점은 입력 순서 유지.
  // 원본을 변형하지 않는다 — 호출부가 같은 배열을 재사용한다.
  function sortByRating(list, ratingOf) {
    return (list || []).slice().sort((a, b) => {
      const ra = ratingOf(a), rb = ratingOf(b);
      const va = (ra == null) ? -1 : ra;
      const vb = (rb == null) ? -1 : rb;
      return vb - va;
    });
  }

  // 갱신일로부터 오늘까지 경과 일수. 미래면 0, 파싱 불가·빈값이면 null.
  function staleDays(updatedStr, todayStr) {
    if (!updatedStr || !DATE_RE.test(String(updatedStr))) return null;
    if (!todayStr || !DATE_RE.test(String(todayStr))) return null;
    const a = Date.parse(updatedStr + 'T00:00:00Z');
    const b = Date.parse(todayStr + 'T00:00:00Z');
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
    return Math.max(0, Math.round((b - a) / DAY_MS));
  }

  // 비용 원장을 오늘 기준 집행분/예정분으로 나눈다.
  // 부호 규약은 holdings-lib.costTotal 과 동일(direction 'in' = 환급 = 음수).
  // occurredAt 이 없으면 집행분으로 센다 — 과대계상보다 누락이 낫다는 판단.
  function splitCosts(costs, todayStr) {
    let executed = 0, planned = 0;
    for (const e of (costs || [])) {
      const sign = (e && e.direction === 'in') ? -1 : 1;
      const amt = sign * (Number(e && e.amount) || 0);
      const at = e && e.occurredAt;
      if (at && DATE_RE.test(String(at)) && String(at) > String(todayStr)) planned += amt;
      else executed += amt;
    }
    return { executed: executed, planned: planned };
  }

  // 칩 라벨 — 단지명만. 사건번호는 DB 키이지 스캔 단서가 아니다.
  // 실측: 사건번호가 라벨 폭의 50%(p50 65.1px / 130.4px)를 쓰고 있었다.
  // 자르지 않는다 — CSS ellipsis 가 실제 셀 폭에 맞춰 자르게 위임한다.
  // (구 shortenComplex 는 7자 하드컷이라 셀을 넓혀도 폭이 쓰이지 않았다: p50 72.7 ≈ max 75.5 포화)
  function chipLabel(c) {
    if (!c) return '';
    return String(c.complex || c.caseNumber || '');
  }

  // 툴팁 — 사건번호는 여기로 옮긴다.
  function chipTitle(c, rating, fmtMoney) {
    if (!c) return '';
    const parts = [c.caseNumber, c.complex].filter(Boolean);
    if (rating != null) parts.push('★' + rating);
    if (c.minimumPrice != null && typeof fmtMoney === 'function') {
      parts.push('최저 ' + fmtMoney(c.minimumPrice));
    }
    return parts.join(' · ');
  }

  // 아젠다 뷰용 — 날짜 오름차순 그룹, 그룹 안은 별점 내림차순.
  // 사건 없는 날은 그룹 자체가 생기지 않는다(그리드와 달리 빈 칸이 없다).
  // 375px 에서 4열 그리드는 칸 폭 ~80px 이라 단지명이 들어갈 수 없어 이 뷰로 전환한다.
  function groupByDate(cases, ratingOf) {
    const map = new Map();
    for (const c of (cases || [])) {
      if (!c || !c.saleDate) continue;
      if (!map.has(c.saleDate)) map.set(c.saleDate, []);
      map.get(c.saleDate).push(c);
    }
    return [...map.keys()].sort().map((date) => {
      const items = sortByRating(map.get(date), ratingOf);
      return { date: date, items: items, count: items.length };
    });
  }

  // 매각가율 예측 오차 — TP/FP/FN/TN 을 대체하는 캘리브레이션 지표.
  // quadrant 는 FP 가 구조적으로 0(매각 41:유찰 5 시장에서 "GO 했는데 유찰"이 없음)이라
  // "GO 적중률 100%" 가 실력이 아니라 정의의 부산물이 된다. 표본의 절반은 quadrant 자체가 null.
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
    const sd = n > 1 ? Math.sqrt(errs.reduce((a, e) => a + Math.pow(e - mean, 2), 0) / (n - 1)) : 0;
    const sorted = [...errs].sort((a, b) => a - b);
    return {
      n: n, meanErr: mean, mae: mae, sd: sd,
      min: sorted[0], max: sorted[n - 1],
      within5: errs.filter((e) => Math.abs(e) <= 5).length,
      within10: errs.filter((e) => Math.abs(e) <= 10).length,
    };
  }

  return {
    todayKST: todayKST,
    chipLabel: chipLabel,
    groupByDate: groupByDate,
    calibration: calibration,
    chipTitle: chipTitle,
    monthKeyOf: monthKeyOf,
    pickEntryMonth: pickEntryMonth,
    monthOfCase: monthOfCase,
    sortByRating: sortByRating,
    staleDays: staleDays,
    splitCosts: splitCosts,
  };
});
