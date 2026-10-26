(() => {
  const state = {
    cfg: {
      revealSelectors: ".section-head, .products-head, .booking-grid, .ig-profile, .hero, .section, .showcase-card, .plan, .symptom-card, .about, .faq-item, .repo-strip",
      maskSelectors: ".showcase-card, .plan",
      zoomSelectors: ".about img, .brand img",
      navThreshold: 12,
      staggerStep: 70,
    },
    observer: null,
    rafId: null,
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    parallaxItems: [],
  };

  function visibleAll() {
    document.querySelectorAll(".reveal, .mask-in, .zoom-in").forEach((el) => {
      el.classList.add("visible");
    });
  }

  function buildChrome() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const update = () => {
      if (window.scrollY > state.cfg.navThreshold) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function addClassToSelectorList(selectors, className) {
    document.querySelectorAll(selectors).forEach((el) => {
      el.classList.add(className);
    });
  }

  function buildReveals() {
    addClassToSelectorList(state.cfg.revealSelectors, "reveal");
    addClassToSelectorList(state.cfg.maskSelectors, "mask-in");
    addClassToSelectorList(state.cfg.zoomSelectors, "zoom-in");

    if (state.reduced || !("IntersectionObserver" in window)) {
      visibleAll();
      return;
    }

    const observed = document.querySelectorAll(".reveal, .mask-in, .zoom-in");
    observed.forEach((el, i) => {
      el.style.setProperty("--stagger", `${i * state.cfg.staggerStep}ms`);
    });

    state.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            state.observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    observed.forEach((el) => state.observer.observe(el));

    // Rede de seguranca para evitar elemento escondido eternamente.
    setTimeout(() => visibleAll(), 6000);
  }

  function buildParallax() {
    if (state.reduced) return;

    state.parallaxItems = Array.from(
      document.querySelectorAll(".hero, .verifier, .showcase-card, .about img")
    );

    if (!state.parallaxItems.length) return;

    const tick = () => {
      const viewH = window.innerHeight || 1;
      state.parallaxItems.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewH) return;
        const center = rect.top + rect.height / 2;
        const delta = (center - viewH / 2) / viewH;
        const y = Math.max(-6, Math.min(6, delta * 12));
        el.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
      });
      state.rafId = window.requestAnimationFrame(tick);
    };

    state.rafId = window.requestAnimationFrame(tick);
  }

  function bindAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (ev) => {
        const targetId = a.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const target = document.querySelector(targetId);
        if (!target) return;
        ev.preventDefault();
        Motion.scrollTo(target);
      });
    });
  }

  const Motion = {
    init(cfg = {}) {
      state.cfg = { ...state.cfg, ...cfg };
      bindAnchorScroll();
      return Motion;
    },

    start() {
      Motion.build();
      return Motion;
    },

    reset() {
      if (state.observer) {
        state.observer.disconnect();
        state.observer = null;
      }
      if (state.rafId) {
        window.cancelAnimationFrame(state.rafId);
        state.rafId = null;
      }
      document.querySelectorAll(".reveal, .mask-in, .zoom-in").forEach((el) => {
        el.classList.remove("visible");
      });
      return Motion;
    },

    build() {
      buildChrome();
      buildReveals();
      buildParallax();
      return Motion;
    },

    lock(on) {
      document.body.style.overflow = on ? "hidden" : "";
      return Motion;
    },

    scrollTo(el) {
      if (!el) return Motion;
      const top = el.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top, behavior: state.reduced ? "auto" : "smooth" });
      return Motion;
    },

    refresh() {
      Motion.reset();
      Motion.build();
      return Motion;
    },

    frames() {
      return { enabled: false, count: 0 };
    },
  };

  window.Motion = Motion;
})();
