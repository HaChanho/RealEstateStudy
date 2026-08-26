// 공유 상단 네비바 — 홈(루트)·calendar/·timeline/ 세 페이지에 <script ... defer>로 로드.
// <head>에서 로드되므로 DOM 준비를 기다린 뒤 body 최상단에 주입한다.
(function () {
  var path = location.pathname;
  var active = path.indexOf('/timeline/') >= 0 ? 'timeline' : (path.indexOf('/calendar/') >= 0 ? 'calendar' : '');
  // 홈은 루트에 있고 나머지는 한 단계 아래다. 기준 경로가 다르다.
  var base = (active === '') ? './' : '../';
  var links = [
    { key: '',         label: '홈',       href: base },
    { key: 'calendar', label: '캘린더',   href: base + 'calendar/' },
    { key: 'timeline', label: '타임라인', href: base + 'timeline/' }
  ];
  var css = '.site-nav{display:flex;gap:6px;align-items:center;padding:8px 20px;background:var(--surface,#fff);' +
    'border-bottom:1px solid var(--border,#dde3f0);font-family:-apple-system,BlinkMacSystemFont,"Pretendard","Apple SD Gothic Neo","Segoe UI",Roboto,sans-serif}' +
    '.site-nav a{text-decoration:none;font-size:13px;font-weight:600;color:var(--text-dim,#4a5570);padding:5px 12px;border-radius:8px;border:1px solid transparent}' +
    '.site-nav a:hover{color:var(--text,#1a1f2e);border-color:var(--accent,#3b6fde)}' +
    '.site-nav a.active{background:var(--accent,#3b6fde);color:#fff;border-color:var(--accent,#3b6fde)}';
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  function inject() {
    var nav = document.createElement('nav'); nav.className = 'site-nav';
    nav.innerHTML = links.map(function (l) {
      return '<a href="' + l.href + '"' + (l.key === active ? ' class="active"' : '') + '>' + l.label + '</a>';
    }).join('');
    document.body.insertBefore(nav, document.body.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();
