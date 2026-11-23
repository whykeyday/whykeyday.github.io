import { W as wordmark } from './_astro/site.BJPZAARU.js';

// Only the header wordmark changes; the story and static finale retain theirs.
const brand = document.querySelector('.bar [data-wordmark]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const ns = 'http://www.w3.org/2000/svg';

function mount() {
  const svg = brand?.querySelector('svg');
  if (!svg || svg.dataset.scrollWordmark) return false;
  const contours = wordmark.d.match(/M[^M]*/g);
  // The supplied compound artwork's fourth contour is the complete initial T.
  const initial = contours?.find(path => path.startsWith('M198.5 235.6'));
  if (!initial) return false;
  const fullPath = svg.querySelector('path');
  const suffix = document.createElementNS(ns, 'g');
  suffix.dataset.wordmarkSuffix = '';
  const suffixPath = fullPath.cloneNode(false);
  suffixPath.setAttribute('d', contours.filter(path => path !== initial).join(''));
  suffix.append(suffixPath);
  const dot = svg.querySelector('circle');
  if (dot) suffix.append(dot);
  const first = fullPath.cloneNode(false);
  first.setAttribute('d', initial);
  first.dataset.wordmarkInitial = '';
  fullPath.replaceWith(suffix, first);
  svg.dataset.scrollWordmark = '';

  const clamp = value => Math.max(0, Math.min(1, value));
  let current = clamp((scrollY - 12) / 200), target = current, frame = 0, last = 0;
  function paint() {
    const progress = current * current * (3 - 2 * current);
    suffix.setAttribute('transform', `translate(${-110 * progress} 0)`);
    suffix.setAttribute('opacity', String(1 - progress));
    svg.dataset.scrollProgress = current.toFixed(4);
  }
  function tick(now) {
    const elapsed = Math.min(64, Math.max(1, now - last));
    last = now;
    current += (target - current) * (1 - Math.exp(-elapsed / 85));
    if (Math.abs(current - target) < .0001) current = target;
    paint();
    frame = current === target ? 0 : requestAnimationFrame(tick);
  }
  function update() {
    target = clamp((scrollY - 12) / 200);
    if (reduced.matches) {
      cancelAnimationFrame(frame); frame = 0; current = target; paint();
    } else if (!frame) {
      last = performance.now(); frame = requestAnimationFrame(tick);
    }
  }
  paint(); update();
  addEventListener('scroll', update, { passive: true });
  addEventListener('pageshow', update);
  reduced.addEventListener('change', update);
  addEventListener('pagehide', event => {
    cancelAnimationFrame(frame); frame = 0;
    if (event.persisted) return;
    removeEventListener('scroll', update);
    removeEventListener('pageshow', update);
    reduced.removeEventListener('change', update);
  });
  return true;
}

if (brand && !mount()) {
  const observer = new MutationObserver(() => {
    if (mount()) observer.disconnect();
  });
  observer.observe(brand, { childList: true, subtree: true });
}
