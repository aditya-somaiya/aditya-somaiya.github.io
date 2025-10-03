/**********************
 * UTIL / GLOBAL
 **********************/

// Year stamp in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

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

// Theme toggle (persist in localStorage)
(() => {
  const root = document.documentElement;
  const key = 'theme';
  const saved = localStorage.getItem(key);
  if (saved === 'light') root.classList.add('light');
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.onclick = () => {
      root.classList.toggle('light');
      localStorage.setItem(key, root.classList.contains('light') ? 'light' : 'dark');
    };
  }
})();

// Copy email
(() => {
  const copyBtn = document.getElementById('copyEmail');
  if (!copyBtn) return;
  copyBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText('adisomaiya.sa@gmail.com');
    const og = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => (copyBtn.textContent = og), 1200);
  });
})();

// Reveal on scroll
(() => {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.08 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/**********************
 * CONTACT FORM (Formspree inline success)
 **********************/
(() => {
  const form = document.getElementById('contactForm');
  const successBox = document.getElementById('formSuccess');
  const sendAgainBtn = document.getElementById('sendAgain');
  if (!form || !successBox || !sendAgainBtn) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        form.style.display = 'none';
        successBox.style.display = 'block';
        form.reset();
      } else {
        alert('Oops, something went wrong. Please try again later.');
      }
    } catch (err) {
      alert('Network error. Please check your connection.');
    }
  });

  sendAgainBtn.addEventListener('click', () => {
    successBox.style.display = 'none';
    form.style.display = 'block';
  });
})();

/**********************
 * SLIDESHOW with “peek”
 * Configure your images in SLIDES
 **********************/
const SLIDES = [
  'assets/img/portrait.png', // default portrait
  'assets/img/work1.png'
  // add more if you like:
  // 'assets/img/work2.jpg',
  // 'assets/img/life1.jpg',
  // 'assets/img/life2.jpg'
];

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

  // Advance on click/tap (anywhere on carousel or on the right overlay)
  const next = () => { i = (i + 1) % SLIDES.length; update(); };
  carousel.addEventListener('click', next);
  const nextArea = carousel.querySelector('.next-area');
  if (nextArea) nextArea.addEventListener('click', e => { e.stopPropagation(); next(); });

  // Keyboard arrows
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') { i = (i - 1 + SLIDES.length) % SLIDES.length; update(); }
  });

  // Touch swipe (basic)
  let startX = null;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (startX == null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) i = (i + 1) % SLIDES.length;
      else i = (i - 1 + SLIDES.length) % SLIDES.length;
      update();
    }
    startX = null;
  });

  // Preload images
  SLIDES.forEach(src => { const im = new Image(); im.src = src; });
  update();
})();

/**********************
 * GITHUB PROJECTS — Featured + All (live)
 **********************/
(async function loadRepos() {
  const GH_USER = 'aditya-somaiya';

  // Put repo names you want highlighted here (exact names as on GitHub):
  const FEATURED = [
    // Examples (uncomment/edit to pin):
    // 'SmartHome-Savant-LLM',
    // 'world-happiness-dashboard',
    // 'RestaurantFinder',
    // 'Mouse-Control-using-Hand-Gestures'
  ];

  const featuredGrid = document.getElementById('featuredGrid');
  const repoGrid = document.getElementById('repoGrid');
  if (!repoGrid || !featuredGrid) return;

  const repoCard = r => {
    const lang = r.language ? `<span class="lang">${r.language}</span>` : '';
    const stars = r.stargazers_count ? `<span class="stat">★ ${r.stargazers_count}</span>` : '';
    const desc = r.description ? r.description : 'No description';
    return `
      <article class="card">
        <h3>
          <a href="${r.html_url}" target="_blank" rel="noreferrer">${r.name}</a>
          ${stars}
        </h3>
        <p>${desc}</p>
        <div class="meta">
          ${lang} · <a href="${r.html_url}" target="_blank" rel="noreferrer">Code</a>
        </div>
      </article>
    `;
  };

  try {
    const res = await fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=updated`);
    if (!res.ok) throw new Error('GitHub API error');
    let repos = await res.json();

    // Filter to your own active repos
    repos = repos.filter(r => !r.fork && !r.archived);

    // Featured
    if (FEATURED.length) {
      const map = Object.fromEntries(repos.map(r => [r.name.toLowerCase(), r]));
      const featuredRepos = FEATURED.map(n => map[n.toLowerCase()]).filter(Boolean);
      featuredGrid.innerHTML = featuredRepos.length
        ? featuredRepos.map(repoCard).join('')
        : `<p class="muted">Add repo names to <code>FEATURED</code> in main.js to pin them here.</p>`;
    } else {
      // default: top 4 by stars then recency
      const top = [...repos]
        .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)))
        .slice(0, 4);
      featuredGrid.innerHTML = top.map(repoCard).join('');
    }

    // All repos by recent push
    const allSorted = repos.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
    repoGrid.innerHTML = allSorted.map(repoCard).join('');
  } catch (e) {
    repoGrid.innerHTML = `<p>Couldn’t load repositories right now.</p>`;
    console.error(e);
  }
})();
