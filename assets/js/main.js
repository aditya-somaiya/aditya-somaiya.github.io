// Small JS niceties
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for same-page links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
// -------- Slideshow with peek --------
// 1) Configure your images here:
const SLIDES = [
  'assets/img/portrait.png',      // default portrait
  'assets/img/work1.png',
  // 'assets/img/work2.jpg',
  // 'assets/img/life1.jpg',
  // 'assets/img/life2.jpg'
];

// 2) Build the track on load
(function initPeekCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  // Replace fallback .no-js with dynamic slides
  const track = document.createElement('div');
  track.className = 'track';
  SLIDES.forEach(src => {
    const img = document.createElement('img');
    img.className = 'slide';
    img.src = src;
    img.alt = 'Portfolio image';
    track.appendChild(img);
  });

  const old = carousel.querySelector('.track');
  if (old) old.remove();
  carousel.insertBefore(track, carousel.firstChild);

  // Build dots
  const dotsWrap = carousel.querySelector('.dots');
  dotsWrap.innerHTML = '';
  SLIDES.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    dotsWrap.appendChild(d);
  });

  let i = 0;
  const update = () => {
    track.style.setProperty('--i', i);
    dotsWrap.querySelectorAll('.dot').forEach((d, di) => {
      d.classList.toggle('active', di === i);
    });
  };

  // Advance on click/tap (anywhere on the carousel or on the right overlay)
  const next = () => { i = (i + 1) % SLIDES.length; update(); };
  carousel.addEventListener('click', next);
  carousel.querySelector('.next-area').addEventListener('click', (e) => { e.stopPropagation(); next(); });

  // Keyboard arrows: ← → for accessibility
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); }
    if (e.key === 'ArrowLeft')  { i = (i - 1 + SLIDES.length) % SLIDES.length; update(); }
  });

  // Swipe on touch (basic)
  let startX = null;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend',   (e) => {
    if (startX == null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) i = (i + 1) % SLIDES.length; else i = (i - 1 + SLIDES.length) % SLIDES.length;
      update();
    }
    startX = null;
  });

  // Preload images (nice for snappy next)
  SLIDES.forEach(src => { const im = new Image(); im.src = src; });
  update();
})();
