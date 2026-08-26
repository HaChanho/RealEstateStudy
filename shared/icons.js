// 인라인 SVG 아이콘 — 이모지 대체.
// 이유: 이모지는 렌더는 되지만 ①11px 에서 판독 불가(🏁·📅가 격자 뭉침) ②플랫폼마다 그림이
// 달라 통제 불가 ③토큰 색을 못 입힌다. currentColor 를 쓰므로 여기선 토큰 색이 그대로 적용된다.
// ★(U+2605)는 텍스트 기호라 그대로 둔다 — 별점 표기의 일부이고 폰트 폴백이 안정적이다.
// 사용: window.Icons.svg('calendar', 14)  →  SVGElement
(function (factory) {
  const lib = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = lib;
  if (typeof window !== 'undefined') window.Icons = lib;
})(function () {
  const NS = 'http://www.w3.org/2000/svg';
  // 24x24 viewBox, stroke 기반 (fill: none)
  const PATHS = {
    calendar: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 9h18M8 3v4M16 3v4',
    list:     'M4 6h16M4 12h16M4 18h16',
    chart:    'M4 20V10M10 20V4M16 20v-7M22 20H2',
    home:     'M3 11l9-8 9 8M6 10v10h12V10',
    filter:   'M3 5h18l-7 8v6l-4 2v-8z',
    search:   'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.35-4.35',
    link:     'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1',
    court:    'M3 21h18M5 21V10M19 21V10M12 3l9 5H3zM9 21v-7M15 21v-7',
    pin:      'M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    repeat:   'M17 2l4 4-4 4M21 6H8a4 4 0 0 0-4 4v1M7 22l-4-4 4-4M3 18h13a4 4 0 0 0 4-4v-1',
    flag:     'M5 21V4M5 4h11l-1.5 3L16 10H5',
    doc:      'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5',
    money:    'M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    ruler:    'M3 21L21 3M8 8l3 3M12 4l3 3M4 12l3 3',
    target:   'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
    scale:    'M12 3v18M7 21h10M5 7h14M5 7l-3 6h6zM19 7l3 6h-6z',
    pinned:   'M12 17v5M9 3h6l-1 6 3 3v2H7v-2l3-3z',
    lock:     'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
    warn:     'M12 3l9 16H3zM12 9v5M12 17h.01',
  };

  function svg(name, size) {
    const d = PATHS[name];
    const el = document.createElementNS(NS, 'svg');
    const s = size || 14;
    el.setAttribute('viewBox', '0 0 24 24');
    el.setAttribute('width', s);
    el.setAttribute('height', s);
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke', 'currentColor');
    el.setAttribute('stroke-width', '2');
    el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('stroke-linejoin', 'round');
    el.setAttribute('aria-hidden', 'true');
    el.style.flexShrink = '0';
    el.style.verticalAlign = '-0.125em';
    if (d) {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      el.appendChild(p);
    }
    return el;
  }

  return { svg: svg, names: Object.keys(PATHS) };
});
