// =====================
// NAV scroll behavior
// =====================
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});




// =====================
// FADE-IN on scroll
// =====================
const fadeTargets = [
  '.hero-inner > *',
  '.section-header',
  '.about-text p',
  '.pillar',
  '.post-card',
  '.contact-inner > *',
];

document.querySelectorAll(fadeTargets.join(', ')).forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 5) * 80}ms`;
});

const observer = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.12 }
);

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
