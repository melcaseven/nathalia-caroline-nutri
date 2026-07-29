// ==========================================
// Header scroll state
// ==========================================
const header = document.getElementById('siteHeader');
const onScroll = () => {
  if (window.scrollY > 8) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ==========================================
// Mobile menu toggle
// ==========================================
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('mobile-open');
  menuToggle.classList.toggle('open', open);
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
nav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    nav.classList.remove('mobile-open');
    menuToggle.classList.remove('open');
  });
});

// ==========================================
// Scroll reveal
// ==========================================
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

// ==========================================
// FAQ: close others when opening one
// ==========================================
const faqItems = document.querySelectorAll('.faq details');
faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      faqItems.forEach(other => { if (other !== item) other.open = false; });
    }
  });
});

// ==========================================
// Footer year
// ==========================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ==========================================
// Testimonials carousel
// ==========================================
(function initCarousel() {
  const root = document.getElementById('testimonialsCarousel');
  if (!root) return;
  const track = root.querySelector('.carousel-track');
  const slides = Array.from(track.querySelectorAll('.carousel-slide'));
  const prev = root.querySelector('.carousel-prev');
  const next = root.querySelector('.carousel-next');
  const dotsWrap = root.querySelector('.carousel-dots');
  if (!track || !slides.length) return;

  const perView = () => {
    const w = window.innerWidth;
    if (w <= 720) return 1;
    if (w <= 1024) return 2;
    return 3;
  };

  let pages = 0;
  let current = 0;

  const buildDots = () => {
    pages = Math.max(1, slides.length - perView() + 1);
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
      b.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(b);
    }
    if (current >= pages) current = pages - 1;
    update();
  };

  const goTo = (i) => {
    current = Math.max(0, Math.min(pages - 1, i));
    const slide = slides[current];
    if (slide) {
      const left = slide.offsetLeft - track.offsetLeft;
      track.scrollTo({ left, behavior: 'smooth' });
    }
    update();
  };

  const update = () => {
    Array.from(dotsWrap.children).forEach((d, i) =>
      d.setAttribute('aria-selected', i === current ? 'true' : 'false')
    );
    prev.disabled = current === 0;
    next.disabled = current >= pages - 1;
  };

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));

  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const x = track.scrollLeft;
      let best = 0, bestDist = Infinity;
      slides.forEach((s, i) => {
        const d = Math.abs(s.offsetLeft - track.offsetLeft - x);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      if (best !== current) { current = Math.min(best, pages - 1); update(); }
    }, 90);
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildDots, 120);
  });

  buildDots();
})();

// Ativa os pontinhos do carrossel no celular
(function initPlansCarousel() {
  const grid = document.querySelector('.plans-grid');
  const dotsWrap = document.getElementById('plansDots');
  if (!grid || !dotsWrap) return;

  const plans = Array.from(grid.querySelectorAll('.plan'));

  const buildDots = () => {
    if (window.innerWidth > 720) {
      dotsWrap.innerHTML = '';
      return;
    }

    dotsWrap.innerHTML = '';
    plans.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      if (i === 0) btn.setAttribute('aria-selected', 'true');
      btn.addEventListener('click', () => {
        plans[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
      dotsWrap.appendChild(btn);
    });
  };

  grid.addEventListener('scroll', () => {
    if (window.innerWidth > 720) return;
    const gridCenter = grid.getBoundingClientRect().left + grid.offsetWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    plans.forEach((plan, i) => {
      const rect = plan.getBoundingClientRect();
      const planCenter = rect.left + rect.width / 2;
      const distance = Math.abs(gridCenter - planCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    });

    Array.from(dotsWrap.children).forEach((dot, i) => {
      dot.setAttribute('aria-selected', i === closestIndex ? 'true' : 'false');
    });
  });

  window.addEventListener('resize', buildDots);
  buildDots();
})();