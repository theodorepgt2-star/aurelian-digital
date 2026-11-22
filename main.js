(() => {
  "use strict";

  /* ---------- Constants ---------- */
  const DURATION = 0.9;
  const EASE = "power4.out";
  const STAGGER = 0.12;
  const LANG_KEY = "aurelian-lang";

  /* ---------- i18n ---------- */
  // Greek lives in the HTML itself; English overrides are listed here.
  const EN = {
    "nav.services": "Services",
    "nav.work": "Work",
    "nav.why": "Why us",
    "nav.contact": "Contact",
    "hero.eyebrow": "Digital presence",
    "hero.title": "Digital presence with character.",
    "hero.sub": "Websites for freelancers and restaurants that want to stand out and win clients.",
    "hero.cta1": "Request a quote",
    "hero.cta2": "View services",
    "services.eyebrow": "Services",
    "services.title": "Everything you need to be found online.",
    "s1.title": "Website for freelancers",
    "s1.text": "One page that presents your services, portfolio and contact form, so clients can find and reach you easily.",
    "s2.title": "Recent work",
    "s2.text": "Olga's Nails: a salon website with services, prices and a booking form.",
    "s2.link": "View the project",
    "s3.title": "Online booking and appointments",
    "s3.text": "A request and appointment system linked to your email, stored securely.",
    "s4.title": "Maintenance and updates",
    "s4.text": "Menu changes, new services, photos and search engine optimisation.",
    "work.eyebrow": "Work",
    "work.title": "Work that speaks for itself.",
    "work.cat.salon": "Salon",
    "work.cat.restaurant": "Restaurant",
    "work.cat.freelancer": "Freelancer",
    "work.1.title": "Olga's Nails",
    "work.1.desc": "Salon website: services, prices and a booking form.",
    "work.soon.title": "Coming soon",
    "work.soon.desc": "A new project is on its way.",
    "lb.close": "Close",
    "lb.visit": "Visit the site",
    "why.title": "Why Aurelian Digital",
    "why.1.title": "Design with experience",
    "why.1.text": "We design the way a visitor moves through a space, not like a catalogue.",
    "why.2.title": "Fast on mobile",
    "why.2.text": "Lightweight pages that load quickly, even on a slow connection.",
    "why.3.title": "From start to finish",
    "why.3.text": "We handle setup, content and delivery.",
    "contact.eyebrow": "Contact",
    "contact.title": "Tell us about your project.",
    "contact.sub": "We will reply within 24 hours.",
    "form.name": "Name",
    "form.phone": "Phone",
    "form.type": "Project type",
    "form.type.freelancer": "Freelancer",
    "form.type.restaurant": "Restaurant",
    "form.type.other": "Other",
    "form.budget": "Preferred budget",
    "form.budget.under_500": "Up to €500",
    "form.budget.500_1000": "€500 – €1,000",
    "form.budget.1000_2500": "€1,000 – €2,500",
    "form.budget.over_2500": "Over €2,500",
    "form.budget.unsure": "Not sure yet",
    "form.message": "Message (optional)",
    "form.submit": "Send request",
    "footer.tag": "Websites with character",
  };

  // Greek strings for things that are not in the HTML (status messages, aria labels).
  const EL_EXTRA = {
    "lb.close": "Κλείσιμο",
    "form.ok": "Σας ευχαριστούμε! Θα σας απαντήσουμε εντός 24 ωρών.",
    "form.err": "Κάτι πήγε στραβά. Δοκιμάστε ξανά.",
    "form.invalid": "Συμπληρώστε το όνομά σας και έναν έγκυρο αριθμό τηλεφώνου.",
  };
  const EN_EXTRA = {
    "form.ok": "Thank you! We will reply within 24 hours.",
    "form.err": "Something went wrong. Please try again.",
    "form.invalid": "Please enter your name and a valid phone number.",
  };

  const html = document.documentElement;
  const toggle = document.getElementById("langToggle");

  // Keep the original Greek so we can switch back without a reload.
  const GR = { ...EL_EXTRA };
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    GR[el.dataset.i18n] = el.textContent;
  });

  const isEN = () => html.lang === "en";
  const dict = () => (isEN() ? { ...EN, ...EN_EXTRA } : GR);
  const t = (key) => dict()[key] || key;

  function setLang(lang) {
    const d = lang === "en" ? { ...EN, ...EN_EXTRA } : GR;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = d[el.dataset.i18n];
      if (value !== undefined) el.textContent = value;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const value = d[el.dataset.i18nAria];
      if (value !== undefined) el.setAttribute("aria-label", value);
    });
    html.lang = lang === "en" ? "en" : "el";
    toggle.textContent = lang === "en" ? "ΕΛ" : "EN";
    try { localStorage.setItem(LANG_KEY, lang); } catch (_) { /* storage unavailable */ }
  }

  toggle.addEventListener("click", () => {
    const next = html.lang === "en" ? "el" : "en";
    // Revert the split first so the old DOM is restored, then swap the text.
    if (window.__heroSplit) window.__heroSplit.revert();
    window.__heroSplit = null;
    setLang(next);
    if (!reduceMotion()) runHero();
  });

  try {
    if (localStorage.getItem(LANG_KEY) === "en") setLang("en");
  } catch (_) { /* ignore */ }

  /* ---------- Motion ---------- */
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mm = gsap.matchMedia();
  gsap.registerPlugin(ScrollTrigger, SplitText);

  function runHero() {
    const splitTarget = document.querySelector("[data-split] span");

    document.fonts.ready.then(() => {
      const split = new SplitText(splitTarget, { type: "words", wordsClass: "split-word" });
      window.__heroSplit = split;

      const tl = gsap.timeline({ defaults: { duration: DURATION, ease: EASE } });
      tl.from(split.words, { yPercent: 110, stagger: 0.08 })
        .from(".eyebrow", { y: 16, opacity: 0, duration: 0.6 }, "<")
        .from(".hero__sub", { y: 24, opacity: 0, duration: 0.7 }, "-=0.6")
        .from(".hero__cta .btn", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.5")
        .from(".scroll-cue", { opacity: 0, duration: 0.8 }, "-=0.3");
    });
  }

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    runHero();


    // Hero content drifts up and fades as you scroll past it.
    gsap.to(".hero__inner", {
      yPercent: -18, opacity: 0.2, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
    });

    // Pinned horizontal services track.
    const track = document.getElementById("servicesTrack");
    const scrollDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 120);

    // Desktop only: on phones the track scrolls natively with a finger.
    mm.add("(min-width: 761px)", () => {
      gsap.to(track, {
        x: () => -scrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: "#services",
          start: "top top",
          end: () => `+=${scrollDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    });

    // Section titles reveal as they enter.
    // Section titles reveal word by word as they enter the viewport.
    gsap.utils.toArray(".section-title").forEach((el) => {
      document.fonts.ready.then(() => {
        const split = new SplitText(el, { type: "words", wordsClass: "split-word" });
        gsap.from(split.words, {
          yPercent: 110,
          duration: 0.8,
          ease: EASE,
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 85%" },
          onComplete: () => split.revert(),
        });
      });
    });

    // Portfolio tiles and why-items rise in groups.
    ScrollTrigger.batch(".tile", {
      start: "top 88%",
      onEnter: (batch) => gsap.from(batch, {
        y: 60, opacity: 0, duration: 1, ease: EASE, stagger: 0.15, overwrite: true,
      }),
    });

    ScrollTrigger.batch(".why__item", {
      start: "top 88%",
      onEnter: (batch) => gsap.from(batch, {
        y: 40, opacity: 0, duration: 0.8, ease: EASE, stagger: 0.12, overwrite: true,
      }),
    });

    // Contact form slides up.
    gsap.from(".form", {
      y: 50, opacity: 0, duration: DURATION, ease: EASE,
      scrollTrigger: { trigger: ".contact", start: "top 70%" },
    });
  });

  // Reduced-motion users get the static layout from CSS; nothing to animate.
  mm.add("(prefers-reduced-motion: reduce)", () => {});

  // Extra motion: page-load curtain, marquee, footer wordmark, spotlight cursor.
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // Page transition: the dark curtain lifts to reveal the page.
    gsap.to(".curtain", { yPercent: -100, duration: 1.2, ease: "expo.inOut", delay: 0.15 });

    // Marquee loops endlessly and slows down on hover.
    const marqueeEl = document.querySelector(".marquee");
    const marquee = gsap.to(".marquee__track", { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
    marqueeEl.addEventListener("mouseenter", () => gsap.to(marquee, { timeScale: 0.25, duration: 0.6 }));
    marqueeEl.addEventListener("mouseleave", () => gsap.to(marquee, { timeScale: 1, duration: 0.6 }));

    // Footer wordmark fades in as the footer scrolls into view.
    gsap.fromTo(".footer__mark",
      { opacity: 0.05, yPercent: 30 },
      {
        opacity: 0.35,
        yPercent: 0,
        ease: "none",
        scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: 1 },
      },
    );

    // Buttons glow gently as the pointer approaches them.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const GLOW_RADIUS = 140;
      const buttons = [...document.querySelectorAll(".btn")];
      let frame = 0;
      let px = -9999;
      let py = -9999;

      const update = () => {
        frame = 0;
        buttons.forEach((btn) => {
          const r = btn.getBoundingClientRect();
          const dx = Math.max(r.left - px, 0, px - r.right);
          const dy = Math.max(r.top - py, 0, py - r.bottom);
          const dist = Math.hypot(dx, dy);
          const glow = Math.max(0, 1 - dist / GLOW_RADIUS);
          btn.style.setProperty("--glow", glow.toFixed(3));
        });
      };

      window.addEventListener("pointermove", (e) => {
        px = e.clientX;
        py = e.clientY;
        if (!frame) frame = requestAnimationFrame(update);
      });
      window.addEventListener("pointerleave", () => {
        px = -9999;
        py = -9999;
        if (!frame) frame = requestAnimationFrame(update);
      });
    }
  });

  /* ---------- Spotlight on cards (pointer tracking, one rAF per frame) ---------- */
  if (window.matchMedia("(hover: hover)").matches && !reduceMotion()) {
    document.querySelectorAll(".spot").forEach((card) => {
      let frame = 0;
      card.addEventListener("pointermove", (e) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${e.clientX - r.left}px`);
          card.style.setProperty("--my", `${e.clientY - r.top}px`);
        });
      });
    });
  }

  /* ---------- Portfolio lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lbTitle = document.getElementById("lbTitle");
  const lbDesc = document.getElementById("lbDesc");
  const lbLink = document.getElementById("lbLink");

  document.querySelectorAll(".tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      const d = dict();
      const titleKey = tile.dataset.i18nTitle;
      const descKey = tile.dataset.i18nDesc;
      lbTitle.textContent = (titleKey && d[titleKey]) || tile.dataset.title;
      lbDesc.textContent = (descKey && d[descKey]) || tile.dataset.desc;

      if (tile.dataset.url) {
        lbLink.href = tile.dataset.url;
        lbLink.hidden = false;
      } else {
        lbLink.removeAttribute("href");
        lbLink.hidden = true;
      }
      lightbox.showModal();
    });
  });

  document.getElementById("lbClose").addEventListener("click", () => lightbox.close());
  // Click on the backdrop (outside the card) closes the dialog.
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.close();
  });

  /* ---------- Hero preview deck: a stack that opens into a fan ---------- */
  const deck = document.getElementById("deck");
  if (deck) {
    const cards = [...deck.querySelectorAll(".deck__card")];
    const dotsWrap = document.getElementById("deckDots");
    const FAN_OFFSET = 40;   // px between cards in the straight row
    const FRONT_X = -50;     // px the front card moves to the left when the row opens
    const OPEN_DELAY = 3;    // seconds the stack stays closed before it opens
    let order = cards.slice(); // order[0] is the front card
    let opened = false;
    let busy = false;

    cards.forEach(() => dotsWrap.appendChild(document.createElement("span")));
    const dotEls = [...dotsWrap.children];

    const markDots = () => {
      const frontIndex = cards.indexOf(order[0]);
      dotEls.forEach((d, i) => d.classList.toggle("is-active", i === frontIndex));
    };

    // Slot 0: front card, moved left and on top.
    // Slots 1..n-1: a straight row to the right, each one behind the previous.
    const slotFor = (k, n) => (k === 0
      ? { x: FRONT_X, z: n }
      : { x: k * FAN_OFFSET, z: n - k });

    const place = (animate, delay = 0) => {
      const n = order.length;
      order.forEach((card, k) => {
        const s = slotFor(k, n);
        card.style.zIndex = s.z;
        if (animate && !reduceMotion()) {
          gsap.to(card, {
            x: s.x, rotation: 0, opacity: 1,
            duration: 0.9, ease: "power3.out", delay: delay + k * 0.08,
          });
        } else {
          gsap.set(card, { x: s.x, rotation: 0, opacity: 1 });
        }
      });
      markDots();
    };

    // Closed stack: all cards on top of each other, pivoting from their bottom-left corner
    const stack = () => {
      cards.forEach((card, k) => {
        gsap.set(card, { yPercent: -100, x: 0, rotation: 0, opacity: 1 });
        card.style.zIndex = cards.length - k;
      });
      markDots();
    };

    const open = () => {
      opened = true;
      place(true);
    };

    // Clicking the front card sends it left and out, then it returns at the back of the fan
    const advance = () => {
      if (busy || !opened) return;
      busy = true;
      const front = order[0];
      gsap.to(front, {
        x: "-=260", opacity: 0,
        duration: reduceMotion() ? 0 : 0.55, ease: "power2.in",
        onComplete: () => {
          order.shift();
          order.push(front);
          gsap.set(front, { x: (order.length - 1) * FAN_OFFSET, opacity: 0 });
          place(true);
          busy = false;
        },
      });
    };

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        if (card === order[0]) advance();
      });
    });

    stack();
    if (reduceMotion()) {
      open();
    } else {
      gsap.delayedCall(OPEN_DELAY, open);
    }
  }

  /* ---------- Section transitions: wipe out, jump, wipe in ---------- */
  const wipe = document.querySelector(".wipe");
  let transitioning = false;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      if (reduceMotion()) return; // native jump for reduced motion

      const id = link.getAttribute("href").slice(1);
      const target = id ? document.getElementById(id) : null;
      if (id && !target) return;
      if (transitioning) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      transitioning = true;

      const top = target ? target.getBoundingClientRect().top + window.scrollY : 0;

      gsap.timeline({ onComplete: () => { transitioning = false; } })
        .set(wipe, { transformOrigin: "bottom" })
        .to(wipe, { scaleY: 1, duration: 0.55, ease: "power3.inOut" })
        .add(() => {
          window.scrollTo({ top, behavior: "instant" });
          history.replaceState(null, "", id ? `#${id}` : window.location.pathname);
          ScrollTrigger.refresh();
        })
        .set(wipe, { transformOrigin: "top" })
        .to(wipe, { scaleY: 0, duration: 0.7, ease: "power3.inOut", delay: 0.15 });
    });
  });

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const cfg = window.AURELIAN_CONFIG;

  function validate(data) {
    if (!data.name.trim()) return false;
    return /^[+0-9 ()-]{8,40}$/.test(data.phone.trim());
  }

  function showStatus(message, isError) {
    status.className = isError ? "form__status is-error" : "form__status";
    status.textContent = message;
    if (!reduceMotion()) {
      gsap.fromTo(status,
        { y: isError ? 0 : 8, opacity: 0, x: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: EASE }
      );
      if (isError) gsap.fromTo(form, { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fd = new FormData(form);

    // Honeypot: bots fill hidden fields, humans do not.
    if (fd.get("website")) return;

    const data = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      project_type: String(fd.get("project_type") || "other"),
      budget: String(fd.get("budget") || "unsure"),
      message: String(fd.get("message") || "").trim() || null,
    };

    if (!validate(data)) {
      showStatus(t("form.invalid"), true);
      return;
    }

    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    showStatus("…", false);

    try {
      const res = await fetch(`${cfg.supabaseUrl}/rest/v1/${cfg.table}`, {
        method: "POST",
        headers: {
          apikey: cfg.supabaseKey,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      showStatus(t("form.ok"), false);
    } catch (err) {
      showStatus(t("form.err"), true);
      console.error(err);
    } finally {
      button.disabled = false;
    }
  });
})();
