const navLinks = document.querySelectorAll('.navbar a[href^="#"]');
const sections = document.querySelectorAll('main section[id]');
const navbar = document.querySelector('.navbar');

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId) {
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    const navHeight = navbar ? navbar.getBoundingClientRect().height : 0;
    const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
    const offsetTop = Math.max(targetTop - navHeight, 0);
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  });
});

const setActiveLink = () => {
  let currentSection = null;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) {
      currentSection = section;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('is-active');
  });

  if (!currentSection) {
    return;
  }

  const activeLink = document.querySelector(
    `.navbar a[href="#${currentSection.id}"]`
  );
  if (activeLink) {
    activeLink.classList.add('is-active');
  }
};

if (sections.length > 0 && navLinks.length > 0) {
  window.addEventListener('scroll', setActiveLink);
  window.addEventListener('load', setActiveLink);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealItems = document.querySelectorAll('.reveal');

const revealImmediately = () => {
  revealItems.forEach((item) => {
    item.classList.add('is-visible');
  });
};

if (revealItems.length > 0) {
  if (prefersReducedMotion.matches) {
    revealImmediately();
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const target = entry.target;
          target.classList.add('is-visible');
          observer.unobserve(target);
        });
      },
      { threshold: 0.2 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealImmediately();
  }
}

const isCasePage = document.body.classList.contains('case-page');

if (isCasePage) {
  const caseHeader = document.querySelector('.case-header');
  const caseSections = document.querySelectorAll('.case-section[id]');
  const tocLinks = document.querySelectorAll('.case-toc a[href^="#"]');

  const getHeaderOffset = () =>
    caseHeader ? caseHeader.getBoundingClientRect().height : 0;

  const scrollToSection = (target) => {
    const headerOffset = getHeaderOffset();
    const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
    const offsetTop = Math.max(targetTop - headerOffset - 8, 0);
    window.scrollTo({
      top: offsetTop,
      behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
    });
  };

  tocLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId) {
        return;
      }
      const target = document.querySelector(targetId);
      if (!target) {
        return;
      }
      event.preventDefault();
      scrollToSection(target);
    });
  });

  const setActiveToc = () => {
    const offset = getHeaderOffset() + 16;
    let current = null;

    caseSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= offset && rect.bottom >= offset) {
        current = section;
      }
    });

    tocLinks.forEach((link) => link.classList.remove('is-active'));
    if (!current) {
      return;
    }

    const activeLink = document.querySelector(
      `.case-toc a[href="#${current.id}"]`
    );
    if (activeLink) {
      activeLink.classList.add('is-active');
    }
  };

  if (caseSections.length > 0 && tocLinks.length > 0) {
    window.addEventListener('scroll', setActiveToc, { passive: true });
    window.addEventListener('load', setActiveToc);
  }

  if (caseSections.length > 0) {
    if (prefersReducedMotion.matches) {
      caseSections.forEach((section) => section.classList.add('is-visible'));
    } else if ('IntersectionObserver' in window) {
      caseSections.forEach((section) => section.classList.add('case-reveal'));
      const sectionObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.15 }
      );

      caseSections.forEach((section) => sectionObserver.observe(section));
    } else {
      caseSections.forEach((section) => section.classList.add('is-visible'));
    }
  }

  if (window.location.hash) {
    const hashTarget = document.querySelector(window.location.hash);
    if (hashTarget) {
      window.setTimeout(() => scrollToSection(hashTarget), 0);
    }
  }
}

const staggerGroups = document.querySelectorAll(
  '.skills__badges, .works__grid'
);

staggerGroups.forEach((group) => {
  const children = Array.from(group.children);
  children.forEach((child, index) => {
    child.setAttribute('data-reveal-child', '');
    child.style.transitionDelay = `${index * 60}ms`;
  });
});

const modal = document.querySelector('#project-modal');

if (modal) {
  const openButtons = document.querySelectorAll(
    '[data-modal-target="project-modal"]'
  );
  const closeButtons = modal.querySelectorAll('[data-modal-close]');
  const focusableSelector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  const getFocusable = () =>
    Array.from(modal.querySelectorAll(focusableSelector)).filter(
      (element) => element.offsetParent !== null
    );

  const openModal = (trigger) => {
    lastFocused = trigger;
    modal.removeAttribute('hidden');
    document.body.classList.add('modal-open');

    const focusable = getFocusable();
    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      modal.focus();
    }
  };

  const closeModal = () => {
    modal.setAttribute('hidden', '');
    document.body.classList.remove('modal-open');
    if (lastFocused) {
      lastFocused.focus();
    }
  };

  openButtons.forEach((button) => {
    button.addEventListener('click', () => openModal(button));
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusable = getFocusable();
    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}
