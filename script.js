document.addEventListener('DOMContentLoaded', () => {

  // REPOSITORY FILTER TABS
  function initRepoFilters() {
    const tabs = document.querySelectorAll('.repo-tab');
    const cards = document.querySelectorAll('.repo-showcase-card');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;
        cards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // VFX 05 — MAGNETIC CURSOR
  function initCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => { 
      mx = e.clientX; 
      my = e.clientY; 
    });

    function animCursor() {
      dot.style.left = mx + 'px'; 
      dot.style.top = my + 'px';
      rx += (mx - rx) * 0.12; 
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px'; 
      ring.style.top = ry + 'px';
      requestAnimationFrame(animCursor);
    }
    animCursor();

    document.addEventListener('mousedown', () => { 
      dot.style.transform = 'translate(-50%,-50%) scale(0.5)'; 
    });
    document.addEventListener('mouseup', () => { 
      dot.style.transform = 'translate(-50%,-50%) scale(1)'; 
    });
  }

  // VFX 12 — DATA STREAM BACKGROUND ON PROJECTS SECTION
  let dataStreamAnimId = null;
  function initDataStream(canvasId = 'data-stream') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function resize() {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const cols = Math.max(10, Math.floor(canvas.width / 20));
    const drops = Array(cols).fill(0).map(() => Math.random() * -50);
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
    let isIntersecting = false;

    const obs = new IntersectionObserver(entries => {
      isIntersecting = entries[0].isIntersecting;
      if (isIntersecting && !dataStreamAnimId) {
        draw();
      }
    }, { threshold: 0.05 });
    obs.observe(canvas.parentElement || canvas);

    let lastTime = 0;
    function draw(time) {
      if (!isIntersecting) {
        dataStreamAnimId = null;
        return;
      }
      if (time - lastTime > 40) {
        lastTime = time;
        ctx.fillStyle = 'rgba(13,13,26,0.06)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '11px monospace';
        drops.forEach((y, i) => {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const opacity = Math.random() * 0.08 + 0.02;
          ctx.fillStyle = `rgba(0,229,204,${opacity})`;
          ctx.fillText(char, i * 20, y * 20);
          if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i] += 0.3;
        });
      }
      dataStreamAnimId = requestAnimationFrame(draw);
    }
  }

  // VFX 17 — SECTION TRANSITION DIVIDERS
  function initDividerObserver() {
    const divObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('charged');
          const line = e.target.querySelector('.divider-line');
          if (line) line.classList.add('charged');
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.section-divider').forEach(d => divObs.observe(d));
  }

  // VFX 11 — CRT FLICKER ON SKILLS SECTION
  function initSkillsFlicker() {
    const skillsEl = document.getElementById('skills');
    if (!skillsEl) return;
    const skillsObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        skillsEl.classList.add('scanning');
        setTimeout(() => skillsEl.classList.remove('scanning'), 800);
      }
    }, { threshold: 0.3 });
    skillsObs.observe(skillsEl);
  }

  // VFX 08 — NEON BORDER TRACE
  function initNeonTrace() {
    const traceObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('traced');
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.section-frame').forEach(f => traceObs.observe(f));
  }

  // VFX 16 — BUTTON RIPPLE EFFECT
  function initRipple() {
    document.querySelectorAll('button, .btn, .btn-primary, .btn-outline, .contact-card-btn, .repo-tab').forEach(btn => {
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.addEventListener('click', function(e) {
        const r = document.createElement('span');
        const d = Math.max(this.clientWidth, this.clientHeight);
        const rect = this.getBoundingClientRect();
        r.style.cssText = `
          position:absolute; border-radius:50%;
          width:${d}px; height:${d}px;
          left:${e.clientX - rect.left - d/2}px;
          top:${e.clientY - rect.top - d/2}px;
          background:rgba(0,229,204,0.25);
          transform:scale(0); opacity:1;
          animation:ripple 0.5s ease-out forwards;
          pointer-events:none;
        `;
        this.appendChild(r);
        setTimeout(() => r.remove(), 500);
      });
    });
  }

  // VFX 15 — SCROLL SNAP + PARALLAX DEPTH LAYERS
  function initParallax() {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      document.querySelectorAll('.aurora-blob').forEach((el, i) => {
        const speed = [0.04, 0.06, 0.03][i] || 0.04;
        el.style.transform = `translateY(${sy * speed}px)`;
      });
      document.querySelectorAll('.ambient-circle').forEach((el, i) => {
        const speed = [0.025, 0.035][i] || 0.03;
        el.style.transform = `translateY(${sy * speed}px)`;
      });
    });
  }

  // SCROLL PROGRESS BAR
  function initScrollProgress() {
    const progressEl = document.getElementById('scroll-progress');
    if (progressEl) {
      window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const pct = (window.scrollY / totalHeight) * 100;
          progressEl.style.width = pct + '%';
        }
      });
    }
  }

  // ACTIVE NAV SECTION TRACKING
  function initNavTracking() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(s => sectionObserver.observe(s));
  }

  // STICKY NAV GLASSMORPHISM
  function initStickyNav() {
    const nav = document.getElementById('navbar');
    if (nav) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
          nav.style.cssText = `
            background: rgba(13,13,26,0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding: 0.6rem 0;
            transition: all 0.3s ease;
          `;
        } else {
          nav.style.cssText = `
            background: transparent;
            backdrop-filter: none;
            border-bottom: none;
            padding: 1rem 0;
            transition: all 0.3s ease;
          `;
        }
      });
    }
  }

  // VFX 14 — CONTACT SECTION FULL IMMERSIVE BASH TERMINAL
  function typeText(elId, text, speed, cb) {
    const el = document.getElementById(elId);
    if (!el) return;
    let i = 0;
    const t = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) { clearInterval(t); if (cb) setTimeout(cb, 300); }
    }, speed);
  }

  function startTerminal() {
    typeText('tl1', 'connect --target pranav-roy --mode=full', 40, () => {
      const t2 = document.getElementById('tl2-wrap');
      if (t2) t2.style.display = 'flex';
      typeText('tl2', 'Connection established. Fetching profile...', 30, () => {
        const t3 = document.getElementById('tl3-wrap');
        if (t3) t3.style.display = 'flex';
        typeText('tl3', 'cat profile.json', 50, () => {
          const t4 = document.getElementById('tl4-wrap');
          if (t4) t4.style.display = 'block';
          setTimeout(() => {
            const t5 = document.getElementById('tl5-wrap');
            if (t5) t5.style.display = 'flex';
          }, 600);
        });
      });
    });
  }

  function initTerminal() {
    let termStarted = false;
    const contact = document.getElementById('contact');
    if (!contact) return;
    const termObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !termStarted) {
        termStarted = true;
        startTerminal();
      }
    }, { threshold: 0.4 });
    termObs.observe(contact);
  }

  // Mobile drawer toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
    document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
      link.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  // Lightbox Modal for Screenshots & Certificates
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src) {
    if (lightboxModal && lightboxImg) {
      lightboxImg.src = src;
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('.screenshot-preview img, .cert-img-wrapper img, .pfc-screen img, .psc-screen img').forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(img.src);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // CLOSING STATEMENT STAGGER OBSERVER
  function initClosingStatement() {
    const csObs = new IntersectionObserver(entries => {
      if (entries[0] && entries[0].isIntersecting) {
        document.querySelectorAll('.cs-line').forEach((line, i) => {
          setTimeout(() => line.classList.add('in-view'), i * 130);
        });
        csObs.disconnect();
      }
    }, { threshold: 0.25 });

    const csSection = document.getElementById('closing-statement');
    if (csSection) csObs.observe(csSection);
  }

  // PROGRESS DOTS + ACTIVE CARD TRACKING FOR STICKY STACK
  function initProjectDots() {
    const cards = document.querySelectorAll('.proj-sticky-card');
    const stack = document.getElementById('projStack');
    if (!stack || cards.length === 0) return;

    // Create dot container
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'proj-dots';
    dotsWrap.id = 'projDots';

    cards.forEach((card, i) => {
      const dot = document.createElement('div');
      dot.className = 'proj-dot-item' + (i === 0 ? ' active' : '');
      const titleText = card.querySelector('.psc-title')?.innerText.replace(/\n/g, ' ') || '';
      dot.title = titleText;
      dot.addEventListener('click', () => {
        // Scroll to make that card the active sticky one
        const stackTop = stack.getBoundingClientRect().top + window.scrollY;
        const cardHeight = window.innerHeight;
        window.scrollTo({
          top: stackTop + i * cardHeight,
          behavior: 'smooth'
        });
      });
      dotsWrap.appendChild(dot);
    });

    document.body.appendChild(dotsWrap);

    // Show/hide dots when projects section is in view
    const stackObs = new IntersectionObserver(entries => {
      dotsWrap.classList.toggle('visible', entries[0].isIntersecting);
    }, { threshold: 0.05 });
    stackObs.observe(stack);

    // Update active dot on scroll (throttled with rAF for 60fps smooth scroll)
    let isTicking = false;
    window.addEventListener('scroll', () => {
      if (!isTicking) {
        requestAnimationFrame(() => {
          const stackTop = stack.getBoundingClientRect().top;
          const vh = window.innerHeight;
          const scrolledIntoStack = -stackTop;
          const activeIndex = Math.min(
            Math.max(Math.floor(scrolledIntoStack / vh), 0),
            cards.length - 1
          );
          document.querySelectorAll('.proj-dot-item').forEach((d, i) => {
            d.classList.toggle('active', i === activeIndex);
          });
          isTicking = false;
        });
        isTicking = true;
      }
    }, { passive: true });
  }

  // INITIALIZE DOM ALL DOM-READY EFFECTS
  initRepoFilters();
  initCursor();           // VFX 05
  initDataStream();       // VFX 12
  initDividerObserver();  // VFX 17
  initSkillsFlicker();    // VFX 11
  initNeonTrace();        // VFX 08
  initRipple();           // VFX 16
  initParallax();         // VFX 15
  initScrollProgress();
  initNavTracking();
  initStickyNav();
  initTerminal();         // VFX 14
  initClosingStatement(); // Closing statement stagger
  initProjectDots();      // CSS Sticky Stack dots

  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 70 });
  }

  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initGSAPScrollTriggers(); // VFX 07
  }
});

// VFX 07 — SCROLL-TRIGGERED GSAP SECTION REVEALS
function initGSAPScrollTriggers() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Section titles — clip-path wipe reveal
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.from(el, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 0.9,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      }
    });
  });

  // Section label pills — slide from left with bounce
  gsap.utils.toArray('.section-label').forEach(el => {
    gsap.from(el, {
      x: -30, 
      opacity: 0, 
      duration: 0.6,
      ease: 'back.out(1.8)',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  // Skill bars — wipe left to right
  gsap.utils.toArray('.skill-fill').forEach(bar => {
    const item = bar.closest('.skill-bar-item') || bar.closest('.skill-item');
    const target = item ? item.dataset.target : 80;
    gsap.to(bar, {
      width: target + '%', 
      duration: 1.4,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: bar, start: 'top 85%', once: true }
    });
  });

  // Cert cards — zoom in with stagger
  gsap.utils.toArray('.cert-card').forEach((card, i) => {
    gsap.from(card, {
      scale: 0.8, 
      opacity: 0, 
      duration: 0.5,
      delay: i * 0.07,
      ease: 'back.out(1.4)',
      scrollTrigger: { trigger: card, start: 'top 88%', once: true }
    });
  });

  // Stats row — pop in with scale bounce
  gsap.from('.stats-grid .stat-item', {
    scale: 0, 
    opacity: 0, 
    duration: 0.6,
    stagger: 0.1, 
    ease: 'back.out(2)',
    delay: 0.2
  });
}

// VFX 02 SYSTEM A — TSPARTICLES CONSTELLATION
function initParticles() {
  if (typeof tsParticles !== 'undefined') {
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 90;

    tsParticles.load("tsparticles", {
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      particles: {
        number: { value: particleCount, density: { enable: true, area: 800 } },
        color: { value: ["#00E5CC", "#A855F7", "#6366F1", "#0EA5E9"] },
        opacity: { value: { min: 0.1, max: 0.35 }, animation: { enable: true, speed: 0.8, sync: false } },
        size: { value: { min: 1, max: 2.5 } },
        links: { enable: true, distance: 140, color: "#1e293b", opacity: 0.18, width: 0.8 },
        move: { enable: true, speed: 0.5, direction: "none", random: true, outModes: "bounce" },
        twinkle: { particles: { enable: true, frequency: 0.05, opacity: 1 } }
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: ["repulse", "connect"] },
          onClick: { enable: true, mode: "push" }
        },
        modes: {
          repulse: { distance: 120, duration: 0.4 },
          push: { quantity: 4 },
          connect: { distance: 80, links: { opacity: 0.5 } }
        }
      },
      detectRetina: true
    });
  }
}

// HEADING EFFECT 2 — UNDERLINE DRAW ON SCROLL ENTER
function initTitleObserver() {
  const titleObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.section-title').forEach(t => titleObs.observe(t));
}

// EFFECT F — LETTER-BY-LETTER INITIAL ENTRANCE
function heroNameEntrance() {
  const el = document.querySelector('.hero-name');
  if (!el) return;
  const text = 'PRANAV ROY';
  el.textContent = '';

  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'name-char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.cssText = `
      display: inline-block;
      opacity: 0;
      transform: translateY(50px) rotateX(90deg) scale(0.5);
      transition:
        opacity 0.5s cubic-bezier(0.34,1.56,0.64,1),
        transform 0.5s cubic-bezier(0.34,1.56,0.64,1);
      transition-delay: ${0.05 * i}s;
    `;
    el.appendChild(span);
  });

  /* Trigger after tiny delay so transitions fire */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.name-char').forEach(c => {
        c.style.opacity = '1';
        c.style.transform = 'translateY(0) rotateX(0deg) scale(1)';
      });
    });
  });
}

// TYPED SUBTITLE
function initTyped() {
  const roles = ['Software Engineer', 'Data Analyst', 'AI Builder', 'Python Developer', 'Problem Solver'];
  let ri = 0, ci = 0, deleting = false;
  const typedEl = document.getElementById('typedEl') || document.getElementById('typed-subtitle');

  if (typedEl) {
    function typeLoop() {
      const word = roles[ri];
      if (!deleting) {
        typedEl.textContent = word.slice(0, ++ci);
        if (ci === word.length) { deleting = true; setTimeout(typeLoop, 1600); return; }
      } else {
        typedEl.textContent = word.slice(0, --ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(typeLoop, 300); return; }
      }
      setTimeout(typeLoop, deleting ? 45 : 75);
    }
    typeLoop();
  }
}

// STAT COUNTER ANIMATION
function initCounters() {
  const counters = [
    { id: 'stat-repos', end: 21, suffix: '+' },
    { id: 'stat-certs', end: 6, suffix: '+' },
    { id: 'stat-langs', end: 5, suffix: '' },
    { id: 'stat-internships', end: 2, suffix: '' },
    { id: 's4', end: 2, suffix: '' }
  ];

  counters.forEach(c => {
    const el = document.getElementById(c.id);
    if (el) {
      if (typeof countUp !== 'undefined' && countUp.CountUp) {
        new countUp.CountUp(c.id, c.end, {
          duration: 2,
          suffix: c.suffix,
          easingFn: (t, b, c, d) => c * (-Math.pow(2, -10 * t/d) + 1) + b
        }).start();
      } else {
        el.textContent = c.end + c.suffix;
      }
    }
  });
}

// TRIGGER ALL ANIMATIONS AFTER PRELOADER EXITS
function initAllAnimations() {
  heroNameEntrance();        // Letter-by-letter 3D flip entrance
  initTitleObserver();       // Underline draw on scroll for section titles
  
  if (window.innerWidth > 768 && typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.proj-card, .project-card-featured, .card-surface'), {  // VFX 06
      max: 8, 
      speed: 400, 
      glare: true, 
      'max-glare': 0.12, 
      scale: 1.03,
      gyroscope: true
    });
  }
  
  function initRepoFilterTabs() {
    const tabs = document.querySelectorAll('.repo-tab');
    const cards = document.querySelectorAll('.cyber-repo-btn');
    if (!tabs.length || !cards.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');

        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  initCounters();
  initRepoFilterTabs();
  setTimeout(initTyped, 500);
}

// VFX 01 — PRELOADER LIFECYCLE & INITIALIZATION
window.addEventListener('load', () => {
  initParticles(); // VFX 02 System A

  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('exit');
      setTimeout(() => {
        preloader.remove();
        initAllAnimations();
      }, 500);
    } else {
      initAllAnimations();
    }
  }, 2600);
});
