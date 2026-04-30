/* ===========================
   Navbar scroll effect
   =========================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===========================
   Mobile nav toggle
   =========================== */
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

/* ===========================
   Active nav link on scroll
   =========================== */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

function setActiveLink() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + id) {
          item.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

/* ===========================
   Scroll Progress Bar
   =========================== */
const scrollProgress = document.getElementById('scroll-progress');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

/* ===========================
   Cursor Glow (desktop only)
   =========================== */
const cursorGlow = document.getElementById('cursor-glow');
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice && cursorGlow) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.classList.add('active');
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('active');
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

/* ===========================
   3D Tilt + Mouse Spotlight on Project Cards
   =========================== */
if (!isTouchDevice) {
  document.querySelectorAll('.project-card, .highlight-card, .contact-card, .leadership-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -5;
      const rotY = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ===========================
   Magnetic Social Icons
   =========================== */
if (!isTouchDevice) {
  document.querySelectorAll('.hero-socials a').forEach(icon => {
    icon.addEventListener('mousemove', (e) => {
      const rect = icon.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      icon.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px) scale(1.15)`;
    });

    icon.addEventListener('mouseleave', () => {
      icon.style.transform = '';
    });
  });
}

/* ===========================
   Animated Number Counters
   =========================== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = value + (progress === 1 ? suffix : '');
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.highlight-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ===========================
   Typewriter Effect (Hero Tagline)
   =========================== */
const typedEl = document.getElementById('typed');
if (typedEl) {
  const phrases = ['Cybersecurity', 'IAM Engineering', 'Identity Security', 'Threat Detection'];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  // Set min-width to prevent layout shift
  typedEl.style.display = 'inline-block';
  typedEl.style.minWidth = '8ch';
  typedEl.textContent = '';

  function typeLoop() {
    const current = phrases[phraseIdx];
    if (!isDeleting) {
      typedEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(typeLoop, 2000);
        return;
      }
      setTimeout(typeLoop, 90);
    } else {
      typedEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 40);
    }
  }
  // Start after a short delay
  setTimeout(typeLoop, 800);
}

/* ===========================
   Scroll-triggered fade-ins (with stagger for grid items)
   =========================== */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll(
  '.timeline-item, .project-card, .skill-category, .edu-card, ' +
  '.leadership-card, .highlight-card, .contact-card, .about-text'
).forEach((el, i) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = (Math.min(i, 5) * 80) + 'ms';
  observer.observe(el);
});

/* Stagger the skill pills inside each category */
document.querySelectorAll('.skill-items').forEach(group => {
  group.querySelectorAll('.skill-pill').forEach((pill, i) => {
    pill.style.transition = `transform 0.4s ease ${i * 40}ms, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease`;
  });
});

/* ===========================
   Konami-style flair: rapid clicks on logo trigger gradient burst
   =========================== */
const navLogo = document.querySelector('.nav-logo');
let clicks = 0;
let clickTimer;
if (navLogo) {
  navLogo.addEventListener('click', (e) => {
    clicks++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clicks = 0; }, 800);
    if (clicks >= 3) {
      clicks = 0;
      document.body.animate(
        [
          { filter: 'hue-rotate(0deg) saturate(1)' },
          { filter: 'hue-rotate(360deg) saturate(1.4)' },
          { filter: 'hue-rotate(0deg) saturate(1)' }
        ],
        { duration: 1200, easing: 'ease-in-out' }
      );
    }
  });
}
