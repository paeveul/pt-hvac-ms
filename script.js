/* CoolBreeze Air Services — script.js */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Mobile hamburger ─────────────────────────────── */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu   = document.getElementById('mobile-menu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const expanded = mobileMenu.classList.contains('open');
      hamburgerBtn.setAttribute('aria-expanded', expanded);
    });
  }

  /* ─── Active nav highlighting ──────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ─── Smooth scroll for anchor links ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── Fade-in on scroll ────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(el => observer.observe(el));
  }

  /* ─── Stat counter animation ───────────────────────── */
  const statEls = document.querySelectorAll('[data-count]');

  function animateCount(el) {
    const target  = parseInt(el.dataset.count, 10);
    const suffix  = el.dataset.suffix || '';
    const prefix  = el.dataset.prefix || '';
    const duration = 1400;
    const start    = performance.now();

    function step(timestamp) {
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if (statEls.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statEls.forEach(el => statsObserver.observe(el));
  }

  /* ─── Gallery lightbox ─────────────────────────────── */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.dataset.src;
        const alt = item.dataset.alt || 'Gallery image';
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }

  /* ─── Contact form — Web3Forms ─────────────────────── */
  const contactForm   = document.getElementById('contact-form');
  const formSuccess   = document.getElementById('form-success');
  const formError     = document.getElementById('form-error');
  const submitBtn     = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      const formData = new FormData(contactForm);
      const object   = Object.fromEntries(formData);
      const json     = JSON.stringify(object);

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: json,
        });

        const data = await res.json();

        if (data.success) {
          contactForm.reset();
          if (formSuccess) {
            formSuccess.style.display = 'block';
            setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
          }
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        if (formError) {
          formError.style.display = 'block';
          setTimeout(() => { formError.style.display = 'none'; }, 6000);
        }
        console.error('Form error:', err);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Enquiry';
        }
      }
    });
  }

});
