// Nav scroll behavior
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// Fade-in on scroll
const fadeTargets = [
  '.hero-name',
  '.hero-bio',
  '.about-hello',
  '.detail-row',
  '.contact-heading',
  '.contact-link',
  '.footer-brand',
];

document.querySelectorAll(fadeTargets.join(', ')).forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 6) * 60}ms`;
});

const observer = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.1 }
);

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
