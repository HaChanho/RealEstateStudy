// 공유 순수함수 — Node(require)와 브라우저(window.CalLib) 양쪽.
// 부수효과 없음. 현재 시각이 필요한 함수는 인자로 받는다(테스트 결정성).
(function (factory) {
  const lib = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = lib;
  if (typeof window !== 'undefined') window.CalLib = lib;
})(function () {
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

  // UTC 밀리초 → KST 기준 'YYYY-MM-DD'.
  // toISOString()을 직접 쓰면 UTC 날짜가 되어 KST 00:00~09:00에 전날이 나온다.
  function todayKST(nowMs) {
    const ms = (nowMs == null) ? Date.now() : nowMs;
    return new Date(ms + KST_OFFSET_MS).toISOString().slice(0, 10);
  }

  return { todayKST: todayKST };
});
