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
  const translate = (key) => dict()[key] || key;

  function setLang(lang) {
    const strings = lang === "en" ? { ...EN, ...EN_EXTRA } : GR;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = strings[el.dataset.i18n];
      if (value !== undefined) el.textContent = value;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const value = strings[el.dataset.i18nAria];
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
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin);

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
    // Web fonts change line breaks and heights; recompute trigger positions once they are in
    document.fonts.ready.then(() => ScrollTrigger.refresh());


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

    // Footer wordmark: the outline draws in per letter, then a soft mint wipe fills it (toned down to ~40%).
    const mark = document.querySelector(".footer__mark");
    if (mark) {
      const NS = "http://www.w3.org/2000/svg";
      const word = mark.textContent.trim();
      const style = getComputedStyle(mark);
      const fontPx = parseFloat(style.fontSize);
      const svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "stroke-mark");
      svg.setAttribute("aria-hidden", "true");
      const clipId = "strokeMarkWipe";
      const defs = document.createElementNS(NS, "defs");
      const clip = document.createElementNS(NS, "clipPath");
      clip.setAttribute("id", clipId);
      clip.setAttribute("clipPathUnits", "userSpaceOnUse");
      const wipeRect = document.createElementNS(NS, "rect");
      clip.appendChild(wipeRect);
      defs.appendChild(clip);
      svg.appendChild(defs);

      const outline = document.createElementNS(NS, "text");
      outline.setAttribute("x", "0");
      outline.setAttribute("y", "0");
      outline.setAttribute("class", "stroke-mark__stroke");
      outline.setAttribute("stroke-width", String(fontPx * 0.012));
      const fill = document.createElementNS(NS, "text");
      fill.setAttribute("x", "0");
      fill.setAttribute("y", "0");
      fill.setAttribute("class", "stroke-mark__fill");
      fill.setAttribute("clip-path", `url(#${clipId})`);

      const applyFont = (node) => {
        node.style.fontFamily = style.fontFamily;
        node.style.fontSize = style.fontSize;
        node.style.fontWeight = style.fontWeight;
        node.style.letterSpacing = style.letterSpacing;
      };
      applyFont(outline);
      applyFont(fill);

      const letters = [...word];
      const dash = fontPx * 7;
      const strokes = letters.map((ch) => {
        const span = document.createElementNS(NS, "tspan");
        span.textContent = ch;
        span.style.strokeDasharray = `${dash}`;
        span.style.strokeDashoffset = `${dash}`;
        outline.appendChild(span);
        return span;
      });
      letters.forEach((ch) => {
        const span = document.createElementNS(NS, "tspan");
        span.textContent = ch;
        fill.appendChild(span);
      });

      svg.appendChild(outline);
      svg.appendChild(fill);
      mark.textContent = "";
      mark.appendChild(svg);

      document.fonts.ready.then(() => {
        const box = outline.getBBox();
        const pad = fontPx * 0.06;
        const vb = { x: box.x - pad, y: box.y - pad, w: box.width + pad * 2, h: box.height + pad * 2 };
        svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
        wipeRect.setAttribute("x", vb.x);
        wipeRect.setAttribute("y", vb.y);
        wipeRect.setAttribute("height", vb.h);
        wipeRect.setAttribute("width", 0);

        const tl = gsap.timeline({
          scrollTrigger: { trigger: mark, start: "top 90%", once: true },
        });
        tl.to(strokes, { strokeDashoffset: 0, duration: 1.6, ease: "power2.out", stagger: 0.05 })
          .to(wipeRect, { attr: { width: vb.w }, duration: 0.8, ease: "power2.inOut" }, "+=0.2");
      });
    }

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
      let pointerX = -9999;
      let pointerY = -9999;

      const update = () => {
        frame = 0;
        buttons.forEach((btn) => {
          const r = btn.getBoundingClientRect();
          const dx = Math.max(r.left - pointerX, 0, pointerX - r.right);
          const dy = Math.max(r.top - pointerY, 0, pointerY - r.bottom);
          const dist = Math.hypot(dx, dy);
          const glow = Math.max(0, 1 - dist / GLOW_RADIUS);
          btn.style.setProperty("--glow", glow.toFixed(3));
        });
      };

      window.addEventListener("pointermove", (e) => {
        pointerX = e.clientX;
        pointerY = e.clientY;
        if (!frame) frame = requestAnimationFrame(update);
      });
      window.addEventListener("pointerleave", () => {
        pointerX = -9999;
        pointerY = -9999;
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
      const labels = dict();
      const titleKey = tile.dataset.i18nTitle;
      const descKey = tile.dataset.i18nDesc;
      lbTitle.textContent = (titleKey && labels[titleKey]) || tile.dataset.title;
      lbDesc.textContent = (descKey && labels[descKey]) || tile.dataset.desc;

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

  /* ---------- Hero preview carousel: Originkit Round Carousel, ported to plain JS ---------- */
  let deckControls = null; // lets the first scroll from the hero open the carousel
  const deck = document.getElementById("deck");
  const root = document.getElementById("rc");
  if (deck && root) {
    // Same defaults as the Originkit component
    const IMAGES = [{ src: "assets/previews/olga-app.jpg" }, { src: "" }, { src: "" }, { src: "" }, { src: "" }];
    // The screenshot is 1080 x 2048, so the card keeps that proportion (220 x 417) and shows it whole
    const imageWidth = 220, imageHeight = 417, spacing = 3, speed = 7, direction = "right";
    const drag = true, sensitivity = 5, tilt = -7, perspective = 3000, cornerRadius = 22;
    const innerDim = 3.5, background = "transparent";
    const OPEN_DELAY = 3; // seconds before it opens by itself (desktop)

    const count = IMAGES.length;
    const angle = 360 / count;
    const factor = 1 + spacing * 0.15;
    const radius = (imageWidth * factor) / (2 * Math.tan(Math.PI / count));
    const degPerSec = speed * 6 * (direction === "left" ? -1 : 1);

    Object.assign(root.style, {
      width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", background, perspective: `${perspective}px`,
      cursor: drag ? "grab" : "default", touchAction: "none",
    });

    const tiltEl = document.createElement("div");
    Object.assign(tiltEl.style, { transformStyle: "preserve-3d", transform: `rotateX(${tilt}deg)` });
    const ring = document.createElement("div");
    Object.assign(ring.style, {
      position: "relative", width: `${imageWidth}px`, height: `${imageHeight}px`, transformStyle: "preserve-3d",
    });
    tiltEl.appendChild(ring);
    root.appendChild(tiltEl);

    const faceBase = {
      position: "absolute", inset: "0", borderRadius: `${cornerRadius}px`, overflow: "hidden",
      backfaceVisibility: "hidden", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat",
    };
    IMAGES.forEach((img, i) => {
      const item = document.createElement("div");
      Object.assign(item.style, {
        position: "absolute", inset: "0", transform: `rotateY(${i * angle}deg) translateZ(${radius}px)`,
        transformStyle: "preserve-3d",
      });
      const front = document.createElement("div");
      Object.assign(front.style, faceBase, {
        backgroundColor: img.src ? "#0a0a24" : "#222",
        backgroundImage: img.src ? `url(${img.src})` : "",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
      });
      const back = document.createElement("div");
      Object.assign(back.style, faceBase, {
        transform: "rotateY(180deg)",
        backgroundColor: img.src ? "#0a0a24" : "#181818",
        backgroundImage: img.src ? `url(${img.src})` : "",
        filter: `brightness(${innerDim / 10})`,
      });
      item.append(front, back);
      ring.appendChild(item);
    });

    let rotY = 0;     // current rotation, degrees
    let vel = 0;      // degrees per second, kept after a flick
    let last = 0;
    let isDeckOpen = false;
    let dragging = null; // { x } while the pointer is down

    // Turns on its own only while it is on screen, and never for reduced-motion visitors
    let isOnScreen = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => { isOnScreen = entry.isIntersecting; }).observe(deck);
    }

    const draw = (now) => {
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      const f = Math.min(dt, 0.1);
      if (!dragging) {
        if (Math.abs(vel) > 0.01) {
          rotY += vel * f;
          vel *= 0.94;
        } else if (isOnScreen && !reduceMotion()) {
          rotY += degPerSec * f;
        }
      }
      ring.style.transform = `translateZ(${-radius}px) rotateY(${rotY}deg)`;
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);

    if (drag) {
      root.addEventListener("pointerdown", (e) => {
        root.setPointerCapture?.(e.pointerId);
        dragging = { x: e.clientX };
        vel = 0;
        root.style.cursor = "grabbing";
      });
      root.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const dx = e.clientX - dragging.x;
        dragging.x = e.clientX;
        const k = 0.3 * sensitivity;
        rotY += dx * k;
        vel = dx * k * 60;
      });
      const endDrag = () => { dragging = null; root.style.cursor = "grab"; };
      root.addEventListener("pointerup", endDrag);
      root.addEventListener("pointercancel", endDrag);
    }

    const open = () => {
      if (isDeckOpen) return;
      isDeckOpen = true;
      deck.classList.add("is-open");
    };
    deckControls = { isClosed: () => !isDeckOpen, open };
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion()) open();
    else if (!isTouch) gsap.delayedCall(OPEN_DELAY, open); // desktop: opens by itself; phones: on the first move
  }

  /* ---------- Section transitions: wipe out, jump, wipe in ---------- */
  const wipe = document.querySelector(".wipe");
  let isTransitioning = false;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      if (reduceMotion()) return; // native jump for reduced motion

      const id = link.getAttribute("href").slice(1);
      const target = id ? document.getElementById(id) : null;
      if (id && !target) return;
      if (isTransitioning) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      isTransitioning = true;

      const top = target ? target.getBoundingClientRect().top + window.scrollY : 0;

      gsap.timeline({ onComplete: () => { isTransitioning = false; } })
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

  /* ---------- Section-by-section scrolling (desktop: wheel and arrow keys) ---------- */
  // A pinned section is wrapped in a .pin-spacer, so it is matched through that wrapper
  const SECTION_SELECTOR = "main > section, main > .pin-spacer, footer.footer";
  const lightboxEl = document.getElementById("lightbox");
  const maxScrollY = () => document.documentElement.scrollHeight - window.innerHeight;
  const clampY = (y) => Math.min(Math.max(y, 0), maxScrollY());

  // Pinned sections are measured through their pin spacer, which holds the real position
  const measured = (el) => (el.parentElement && el.parentElement.classList.contains("pin-spacer") ? el.parentElement : el);
  const pageTop = (el) => measured(el).getBoundingClientRect().top + window.scrollY;

  // Where the page should rest for a section: centred if it fits on screen, top if it is taller
  // Short sections are centred in the space below the fixed header; tall ones start just under it
  const restingY = (el) => {
    const top = pageTop(el);
    const height = measured(el).offsetHeight;
    if (height > window.innerHeight) return clampY(top);
    const headerH = document.querySelector(".site-header")?.offsetHeight || 0;
    const room = window.innerHeight - headerH;
    return clampY(top - headerH - (room - height) / 2);
  };

  let wheelBusy = false;
  let cooldownUntil = 0;

  // Keys always retarget from the current position, so a press during a move is never lost.
  // The wheel is throttled instead, because trackpad inertia sends many events in a row.
  // One gesture, one move: while a move runs (and until the page has settled), new input is ignored
  let moveLock = false;
  let lockWatchdog = null;
  const releaseLock = () => {
    if (lockWatchdog) lockWatchdog.kill();
    lockWatchdog = null;
    gsap.delayedCall(0.25, () => { moveLock = false; });
  };

  const goToSection = (direction, fromWheel = false) => {
    if (moveLock) return;
    if (fromWheel && (wheelBusy || performance.now() < cooldownUntil)) return;

    const sections = [...document.querySelectorAll(SECTION_SELECTOR)];
    const y = window.scrollY;
    const EPS = 8;
    const target = direction > 0
      ? sections.map(restingY).find((rest) => rest > y + EPS)
      : [...sections].reverse().map(restingY).find((rest) => rest < y - EPS);

    if (target === undefined || Math.abs(target - y) < 2) return;

    gsap.killTweensOf(window);
    moveLock = true;
    // Safety net: if the tween is interrupted, the lock still opens
    lockWatchdog = gsap.delayedCall(4, () => { moveLock = false; lockWatchdog = null; });
    wheelBusy = true;
    gsap.to(window, {
      scrollTo: { y: target, autoKill: false },
      duration: reduceMotion() ? 0 : 1.1,
      ease: "power3.inOut",
      onComplete: () => {
        wheelBusy = false;
        cooldownUntil = performance.now() + 700; // absorbs trackpad inertia
        if (!(direction > 0 && settleSection(target))) releaseLock(); // only when moving down
      },
    });
  };

  // On phones, a section whose last item sits below the fold keeps going after a short pause, so every item shows
  const SETTLE_SECTIONS = [
    { id: "why", item: ".why__item" },
    { id: "work", item: ".tile" },
  ];
  const settleSection = (target) => {
    if (reduceMotion() || !window.matchMedia("(pointer: coarse)").matches) return false;
    const match = SETTLE_SECTIONS.find(({ id }) => {
      const el = document.getElementById(id);
      return el && Math.abs(restingY(el) - target) <= 2;
    });
    if (!match) return false;
    const items = document.querySelectorAll(`#${match.id} ${match.item}`);
    const last = items[items.length - 1];
    if (!last) return false;
    const need = last.getBoundingClientRect().bottom - window.innerHeight + 24;
    if (need <= 0) return false;
    gsap.delayedCall(0.6, () => {
      gsap.to(window, {
        scrollTo: { y: clampY(window.scrollY + need), autoKill: false },
        duration: 1.2, ease: "power2.inOut",
        onComplete: releaseLock,
      });
    });
    return true; // the lock stays until this scroll lands
  };

  // A downward move from the hero first opens the preview deck; the next move goes to the next section
  const navigate = (direction, fromWheel = false) => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch && direction > 0 && deckControls && deckControls.isClosed()) {
      document.body.classList.add("deck-up"); // the hero blurs, the previews come forward
      deckControls.open();
      return;
    }
    document.body.classList.remove("deck-up");
    goToSection(direction, fromWheel);
  };

  const sectionScrollEnabled = () =>
    !reduceMotion() && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !lightboxEl.open;

  // While the services section is pinned, the wheel moves its track natively until the pin has no travel left
  const pinnedBounds = () => {
    const services = document.getElementById("services");
    const start = pageTop(services);
    return { start, end: start + measured(services).offsetHeight - window.innerHeight };
  };

  const pinnedCanScroll = (direction) => {
    const { start, end } = pinnedBounds();
    if (window.scrollY < start - 2 || window.scrollY > end + 2) return false;
    return direction > 0 ? window.scrollY < end - 2 : window.scrollY > start + 2;
  };

  // Moves the services track to its far end (or back to its start) without leaving the section
  const scrollPinnedTo = (direction) => {
    const { start, end } = pinnedBounds();
    gsap.killTweensOf(window);
    gsap.to(window, {
      scrollTo: { y: direction > 0 ? end : start, autoKill: false },
      duration: reduceMotion() ? 0 : 1.4,
      ease: "power2.inOut",
    });
  };

  window.addEventListener("wheel", (e) => {
    if (!sectionScrollEnabled() || e.ctrlKey) return;
    if (e.target.closest("textarea, select, #contactForm")) return;
    if (e.deltaY === 0 || pinnedCanScroll(Math.sign(e.deltaY))) return; // trackpads send tiny deltas too
    e.preventDefault();
    navigate(Math.sign(e.deltaY), true);
  }, { passive: false });

  window.addEventListener("keydown", (e) => {
    if (!sectionScrollEnabled()) return;
    if (e.target.closest("input, textarea, select, [contenteditable], #contactForm")) return;
    const down = ["ArrowDown", "PageDown", " "].includes(e.key);
    const up = ["ArrowUp", "PageUp"].includes(e.key);
    if (!down && !up) return;
    e.preventDefault();
    const direction = down ? 1 : -1;
    // Inside the pinned services: first press reads the track to its end, next press leaves the section
    if (pinnedCanScroll(direction)) scrollPinnedTo(direction);
    else navigate(direction);
  });

  /* ---------- Section-by-section swipes (touch screens) ---------- */
  // A vertical swipe moves one section; horizontal swipes (the services cards) and the form stay native.
  let swipeStartY = null;
  let swipeStartX = null;
  const touchSectionsEnabled = () =>
    !reduceMotion() && window.matchMedia("(pointer: coarse)").matches && !lightboxEl.open;

  window.addEventListener("touchstart", (e) => {
    swipeStartY = null;
    swipeAxis = null; // a gesture that ended without touchend must not leave its axis behind
    if (!touchSectionsEnabled() || e.touches.length !== 1) return;
    if (e.target.closest("input, textarea, select, [contenteditable], #contactForm")) return;
    swipeStartX = e.touches[0].clientX;
    swipeStartY = e.touches[0].clientY;
  }, { passive: true });

  let swipeAxis = null;
  window.addEventListener("touchmove", (e) => {
    if (swipeStartY === null) return;
    const dx = Math.abs(swipeStartX - e.touches[0].clientX);
    const dy = Math.abs(swipeStartY - e.touches[0].clientY);
    if (!swipeAxis && Math.max(dx, dy) > 8) swipeAxis = dy > dx ? "vertical" : "horizontal";
    if (swipeAxis === "horizontal") return; // the services track scrolls natively; touchend decides by the final displacement
    if (swipeAxis === "vertical") e.preventDefault(); // we move the page ourselves on release
  }, { passive: false });

  window.addEventListener("touchcancel", () => {
    swipeStartY = null;
    swipeAxis = null;
  });

  window.addEventListener("touchend", (e) => {
    if (swipeStartY === null) return;
    const dy = swipeStartY - e.changedTouches[0].clientY;
    const dx = swipeStartX - e.changedTouches[0].clientX;
    swipeStartY = null;
    swipeAxis = null;
    if (Math.abs(dy) < 40 || Math.abs(dx) > Math.abs(dy)) return;
    navigate(dy > 0 ? 1 : -1);
  });

  /* ---------- Phones: the menu links belong to the hero only ---------- */
  const heroEl = document.querySelector(".hero");
  const syncHeroNav = () => {
    const pastHero = heroEl && window.scrollY > heroEl.offsetHeight * 0.5;
    document.body.classList.toggle("past-hero", Boolean(pastHero));
  };
  window.addEventListener("scroll", syncHeroNav, { passive: true });
  syncHeroNav();

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
        { y: 0, opacity: 1, duration: 0.3, ease: EASE }
      );
      if (isError) gsap.fromTo(form, { x: -8 }, { x: 0, duration: 0.3, ease: "power2.out" });
    }
  }

  // Validate each field when the visitor leaves it; the message names the fix, and clears as they edit
  const fieldRules = {
    name: { isValid: (v) => v.trim().length > 0, error: "Γράψτε το όνομά σας." },
    phone: { isValid: (v) => /^[+0-9 ()-]{8,40}$/.test(v.trim()), error: "Γράψτε έναν αριθμό, π.χ. 210 1234567." },
  };
  Object.entries(fieldRules).forEach(([name, { isValid, error }]) => {
    const input = form.elements[name];
    const message = document.getElementById(`${name}-error`);
    message.textContent = error;
    const clear = () => {
      input.removeAttribute("aria-invalid");
      message.hidden = true;
    };
    input.addEventListener("blur", () => {
      const valid = isValid(input.value);
      input.setAttribute("aria-invalid", valid ? "false" : "true");
      message.hidden = valid;
    });
    input.addEventListener("focus", clear);
    input.addEventListener("input", clear);
  });

  let isSending = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    // Honeypot: bots fill hidden fields, humans do not.
    if (formData.get("website")) return;

    // The visitor must accept the privacy policy before personal data is sent
    if (!formData.get("consent")) {
      showStatus("Για να στείλετε το αίτημα, χρειάζεται να συμφωνήσετε με την Πολιτική απορρήτου.", true);
      return;
    }

    const data = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      project_type: String(formData.get("project_type") || "other"),
      budget: String(formData.get("budget") || "unsure"),
      message: String(formData.get("message") || "").trim() || null,
    };

    if (!validate(data)) {
      // Send the visitor to the first field that needs fixing, instead of a dead click
      const firstInvalid = Object.keys(fieldRules).find((name) => !fieldRules[name](form.elements[name].value));
      form.elements[firstInvalid]?.focus();
      showStatus(translate("form.invalid"), true);
      return;
    }

    // The button stays clickable; a flag stops double sends instead of disabling it
    if (isSending) return;
    isSending = true;
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
      showStatus(translate("form.ok"), false);
    } catch (err) {
      showStatus(translate("form.err"), true);
      console.error(err);
    } finally {
      isSending = false;
    }
  });
})();
