/* ============================================================
   CFA Lumière — main.js
   Chargement des composants, comportement navbar, formulaire
   ============================================================ */

// ── Chargement des composants HTML ─────────────────────────

const loadComponent = async (id, path) => {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Impossible de charger ${path} (${res.status})`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
  }
};

// ── Navbar : scroll + hamburger + lien actif ───────────────

const initNavbar = () => {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.getElementById('nav-mobile');

  // Classe is-scrolled dès que l'utilisateur scroll
  if (navbar) {
    const markScrolled = () => navbar.classList.toggle('is-scrolled', window.scrollY > 20);
    window.addEventListener('scroll', markScrolled, { passive: true });
    markScrolled(); // état initial au chargement
  }

  // Hamburger ↔ menu mobile
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      const nextState = !isOpen;
      toggle.setAttribute('aria-expanded', String(nextState));
      menu.classList.toggle('is-open', nextState);
      menu.setAttribute('aria-hidden', String(!nextState));
      // Empêcher le scroll du fond quand le menu est ouvert
      document.body.style.overflow = nextState ? 'hidden' : '';
    });

    // Fermer le menu au clic en dehors
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
        menu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }

  // Marquer le lien actif selon l'URL courante
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .nav-mobile-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage) link.classList.add('is-active');
  });
};

// ── Formulaire de contact ──────────────────────────────────
// Délégation sur document : fonctionne même après injection dynamique du composant.

const initContactForm = () => {
  document.addEventListener('submit', async (e) => {
    // Gère tous les formulaires de lead du site
    const form = e.target.closest(
      'form.contact-form, form.callback-form, form.entreprises-form, form.candidats-form'
    );
    if (!form) return;
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    if (!btn) return;

    const originalLabel = btn.textContent;
    btn.textContent = 'Envoi en cours...';
    btn.setAttribute('disabled', '');

    // Simulation d'envoi (à remplacer par un vrai appel API)
    await new Promise(resolve => setTimeout(resolve, 800));

    btn.textContent = originalLabel;
    btn.removeAttribute('disabled');

    // Message de confirmation
    const existing = form.nextElementSibling;
    if (existing && existing.classList.contains('form-ok-msg')) existing.remove();

    const msg = document.createElement('p');
    msg.className = 'form-ok-msg';
    msg.textContent = 'Merci ! Votre message a bien été envoyé. Nous vous répondrons sous 48h.';
    form.after(msg);
    form.reset();

    setTimeout(() => msg.remove(), 7000);
  });
};

// ── Animations au scroll (Intersection Observer) ───────────

const initScrollAnimations = () => {
  const els = document.querySelectorAll('.anim-on-scroll');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-fade-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => observer.observe(el));
};

// ── Initialisation ─────────────────────────────────────────

window.addEventListener('DOMContentLoaded', async () => {
  // Charger tous les composants en parallèle
  await Promise.all([
    loadComponent('navbar',           './components/navbar.html'),
    loadComponent('footer',           './components/footer.html'),
    loadComponent('hero-placeholder', './components/hero.html'),
    loadComponent('cta-placeholder',  './components/cta.html'),
    loadComponent('forms-placeholder','./components/forms.html'),
  ]);

  // Lancer les comportements après injection dans le DOM
  initNavbar();
  initContactForm();
  initScrollAnimations();
});
