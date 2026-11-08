// ============================================
// Kelvin Uduma — Portfolio Scripts
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const overlay = document.getElementById("modalOverlay");
  const modals = Array.from(document.querySelectorAll(".modal"));
  let lastFocus = null;
  let activeModal = null;

  // --- Navbar scroll effect ---
  window.addEventListener(
    "scroll",
    () => {
      if (!nav) return;
      nav.classList.toggle("scrolled", window.pageYOffset > 60);
    },
    { passive: true },
  );

  // --- Mobile nav toggle ---
  const setNavOpen = (open) => {
    if (!navLinks || !navToggle) return;
    navLinks.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      setNavOpen(!navLinks.classList.contains("is-open"));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) setNavOpen(false);
      });
    });
  }

  // --- Scroll-reveal animations ---
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -60px 0px", threshold: 0.1 },
    );

    document
      .querySelectorAll(
        ".highlight-card, .expertise-card, .project-card, .credential-card, .section-title, .about-lead, .contact-block",
      )
      .forEach((el) => {
        el.classList.add("reveal-ready");
        observer.observe(el);
      });

    document
      .querySelectorAll(
        ".expertise-grid, .projects-grid, .credentials-grid, .about-highlights",
      )
      .forEach((grid) => {
        Array.from(grid.children).forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.1}s`;
        });
      });
  }

  // --- Smooth anchor scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // --- Modal logic ---
  const getFocusable = (root) =>
    Array.from(
      root.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

  const closeModal = () => {
    if (!activeModal) return;
    activeModal.classList.remove("active");
    activeModal.setAttribute("hidden", "");
    if (overlay) {
      overlay.classList.remove("active");
      overlay.setAttribute("hidden", "");
    }
    document.body.style.overflow = "";
    activeModal = null;
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
    lastFocus = null;
  };

  const openModal = (modal) => {
    if (!modal) return;
    if (activeModal) closeModal();
    lastFocus = document.activeElement;
    activeModal = modal;
    modal.removeAttribute("hidden");
    modal.classList.add("active");
    if (overlay) {
      overlay.removeAttribute("hidden");
      overlay.classList.add("active");
    }
    document.body.style.overflow = "hidden";
    const closeBtn = modal.querySelector(".modal-close");
    (closeBtn || modal).focus();
  };

  document.querySelectorAll(".project-card[data-modal]").forEach((card) => {
    const open = () => {
      const modal = document.getElementById(card.dataset.modal);
      openModal(modal);
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });

  document.querySelectorAll(".modal-close").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeModal();
    });
  });

  if (overlay) {
    overlay.addEventListener("click", closeModal);
  }

  document.addEventListener("keydown", (e) => {
    if (!activeModal) return;

    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
      return;
    }

    if (e.key !== "Tab") return;
    const focusable = getFocusable(activeModal);
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
});
