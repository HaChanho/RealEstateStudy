// 브라우저 콘솔 검증 스니펫 — 캘린더/타임라인 렌더 측정용.
//
// 사용법: 이 파일 내용을 통째로 브라우저 콘솔에 붙여넣고 **두 번 실행**한다.
//        1회차: localStorage 를 비우고 자산 갱신 후 재로드
//        2회차: 전이를 끄고 측정 + 9개 항목 판정
// 로컬:   http://localhost:8793/calendar/
// 라이브: https://hachanho.github.io/RealEstateStudy/calendar/
//
// ── 왜 이 전제들이 필요한가 (스펙 §11.1) ──
// 이 둘을 빠뜨려서 실제로 오진 2건 + 라이브 회귀 1건이 났다.
//
// ① 전이를 끈다: 브라우저 팬이 숨겨져 있으면 프레임을 합성하지 않아 CSS transition 이
//    진행되지 않는다. transition 걸린 요소를 재면 시작값에 머문다.
//    → 상세 패널이 3px 로 측정돼 "데스크톱에서 안 열린다"고 오진했고,
//      그 오진을 고치려 넣은 flex-basis 전환이 진짜 회귀가 되어 배포까지 나갔다.
//
// ② 저장 상태를 비운다: localStorage 에 남은 값이 CSS 경로를 우회한다.
//    → 드래그 테스트로 남은 calendar.panelWidth.v3 가 인라인 width 를 설정해
//      CSS 기본값 경로를 건너뛰었다. 로컬은 통과했지만 새 방문자는 패널이 안 열렸다.

(function () {
  'use strict';

  // ── 0단계: 저장 상태를 비우고 새로고침 (한 번만 실행되고 여기서 끝난다) ──
  //
  // 플래그를 URL 쿼리로 두면 안 된다 — 앱의 syncUrl() 이 URLSearchParams() 를 새로 만들어
  // view/case 만 남기고 나머지를 전부 지운다. sessionStorage 를 쓴다(탭 단위, localStorage.clear 무관).
  var FRESH = '__verifyFresh';
  var isFresh = false;
  try { isFresh = sessionStorage.getItem(FRESH) === '1'; } catch (e) {}
  if (!isFresh) {
    try { localStorage.clear(); } catch (e) {}
    try { sessionStorage.setItem(FRESH, '1'); } catch (e) {}
    var assets = ['../shared/cal-lib.js', '../shared/icons.js', '../shared/theme.css', './index.html'];
    Promise.all(assets.map(function (u) {
      return fetch(u, { cache: 'reload' }).catch(function () {});
    })).then(function () {
      location.replace(location.pathname + '?cb=' + Date.now());
    });
    return '저장소 비우고 자산 갱신 후 재로드 — 로드되면 스니펫을 다시 실행하세요.';
  }
  try { sessionStorage.removeItem(FRESH); } catch (e) {}   // 다음 실행은 다시 0단계부터

  // ── 1단계: 전이·애니메이션 차단 ──
  document.head.appendChild(Object.assign(document.createElement('style'), {
    textContent: '*{transition:none!important;animation:none!important}',
  }));
  void document.body.offsetWidth;

  // ── 2단계: 측정 ──
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  var round = function (n) { return Math.round(n); };
  var w = function (el) { return el ? round(el.getBoundingClientRect().width) : null; };

  var entry = {
    month: $('#month-label') ? $('#month-label').textContent : null,
    chips: $$('.chip').length,
    ghostDdayBadges: $$('.dday-badge').filter(function (b) {
      var d = b.closest('.day');
      return d && d.querySelectorAll('.chip').length === 0;
    }).length,
    staleBadge: $('.stale-badge') ? $('.stale-badge').textContent : null,
    myResultBadges: $$('.my-badge').length,
  };

  // 패널을 열고 분할 뷰를 잰다 (전이가 꺼져 있으므로 즉시 확정된다)
  var firstChip = $('.chip');
  if (firstChip) firstChip.click();
  void document.body.offsetWidth;

  var panel = $('#detail-panel');
  var texts = $$('.chip-text');
  var split = {
    innerWidth: window.innerWidth,
    layoutWidth: document.documentElement.clientWidth,
    panelWidth: w(panel),
    panelPosition: panel ? getComputedStyle(panel).position : null,
    colWidth: w($('.day')),
    gridWidth: w($('#calendar')),
    truncatedLabels: texts.filter(function (t) { return t.scrollWidth > t.clientWidth; }).length + '/' + texts.length,
  };

  var shell = {
    chromeTop: $('.view-wrap') ? round($('.view-wrap').getBoundingClientRect().top) : null,
    railWidth: w($('.rail')),
    railItems: $$('.rail-item').length,
    agendaVisible: $('#agenda') ? getComputedStyle($('#agenda')).display !== 'none' : null,
    bodyOverflow: document.body.scrollWidth - document.body.clientWidth,
  };

  // 화면에 실제로 보이는 이모지만 — SCRIPT/STYLE 안의 주석은 제외한다
  var emoji = [];
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function (n) {
      return (n.parentElement && /SCRIPT|STYLE/.test(n.parentElement.tagName))
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    },
  });
  var node;
  while ((node = walker.nextNode())) {
    var m = node.nodeValue.match(/[\u{1F300}-\u{1FAFF}]/gu);
    if (m) emoji = emoji.concat(m);
  }

  // 성적표는 기본 닫힘인 플라이아웃 안에 있다.
  // innerText 는 렌더 여부를 반영하므로 숨은 내용을 못 읽는다 → textContent 로 본다.
  var statsText = ($('#result-stats') ? $('#result-stats').textContent : '') +
                  ($('#flyout') ? $('#flyout').textContent : '');
  var quality = {
    visibleEmoji: Array.from(new Set(emoji)),
    svgIcons: $$('svg[aria-hidden]').length,
    hasGoAccuracy: /GO 적중률/.test(statsText),
    hasCalibration: /매각가율 예측 오차/.test(statsText),
    textMute: getComputedStyle(document.documentElement).getPropertyValue('--text-mute').trim(),
  };

  // ── 3단계: 합격 판정 ──
  var checks = [
    ['진입 화면 칩', entry.chips >= 1, entry.chips],
    ['유령 D-Day 배지', entry.ghostDdayBadges === 0, entry.ghostDdayBadges],
    ['크롬 높이 ≤100px', shell.chromeTop != null && shell.chromeTop <= 100, shell.chromeTop],
    ['칸 폭 ≥211px', split.colWidth >= 211, split.colWidth],
    ['패널 폭 380~480', split.panelWidth >= 380 && split.panelWidth <= 480, split.panelWidth],
    ['가로 오버플로 0', shell.bodyOverflow === 0, shell.bodyOverflow],
    ['화면 이모지 0', quality.visibleEmoji.length === 0, quality.visibleEmoji.length],
    ['GO 적중률 미표시', !quality.hasGoAccuracy, quality.hasGoAccuracy],
    ['캘리브레이션 표시', quality.hasCalibration, quality.hasCalibration],
  ];
  var failed = checks.filter(function (c) { return !c[1]; });

  return JSON.stringify({
    verdict: failed.length ? 'FAIL ' + failed.length + '건' : 'PASS ' + checks.length + '/' + checks.length,
    failures: failed.map(function (c) { return c[0] + ' = ' + c[2]; }),
    entry: entry, split: split, shell: shell, quality: quality,
  }, null, 2);
})();
