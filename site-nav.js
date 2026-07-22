// 공유 상단 네비바 — calendar/·timeline/ 양쪽에 <script src="../site-nav.js">로 로드. body 최상단 주입.
(function () {
  var path = location.pathname;
  var active = path.indexOf('/timeline/') >= 0 ? 'timeline' : (path.indexOf('/calendar/') >= 0 ? 'calendar' : '');
  var links = [
    { key: '',         label: '🏠 홈',      href: '../' },
    { key: 'calendar', label: '📅 캘린더',   href: '../calendar/' },
    { key: 'timeline', label: '📈 타임라인', href: '../timeline/' }
  ];
  var css = '.site-nav{display:flex;gap:6px;align-items:center;padding:8px 20px;background:var(--surface,#fff);' +
    'border-bottom:1px solid var(--border,#dde3f0);font-family:-apple-system,BlinkMacSystemFont,"Pretendard","Apple SD Gothic Neo","Segoe UI",Roboto,sans-serif}' +
    '.site-nav a{text-decoration:none;font-size:13px;font-weight:600;color:var(--text-dim,#4a5570);padding:5px 12px;border-radius:8px;border:1px solid transparent}' +
    '.site-nav a:hover{color:var(--text,#1a1f2e);border-color:var(--accent,#3b6fde)}' +
    '.site-nav a.active{background:var(--accent,#3b6fde);color:#fff;border-color:var(--accent,#3b6fde)}';
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
  var nav = document.createElement('nav'); nav.className = 'site-nav';
  nav.innerHTML = links.map(function (l) {
    return '<a href="' + l.href + '"' + (l.key === active ? ' class="active"' : '') + '>' + l.label + '</a>';
  }).join('');
  document.body.insertBefore(nav, document.body.firstChild);
})();
