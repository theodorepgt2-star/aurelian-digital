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
    "why.title": "Why Aurelian Digital",
    "why.1.title": "Design with experience",
    "why.1.text": "We design the way a visitor moves through a space, not like a catalogue.",
    "why.2.title": "Fast on mobile",
    "why.2.text": "Lightweight pages that load quickly, even on a slow connection.",
    "why.3.title": "From start to finish",
    "why.3.text": "We handle setup, content and delivery.",
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
    "form.ok": "Thank you! We will reply within 24 hours.",
    "form.err": "Something went wrong. Please try again.",
    "form.invalid": "Please enter your name and a valid phone number.",
    "footer.tag": "Websites with character",
  };

  const html = document.documentElement;
  const toggle = document.getElementById("langToggle");

  // Keep the original Greek so we can switch back without a reload.
  const GR = {};
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    GR[el.dataset.i18n] = el.textContent;
  });

  function setLang(lang) {
    const dict = lang === "en" ? EN : GR;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = dict[el.dataset.i18n];
      if (value !== undefined) el.textContent = value;
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
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) runHero();
  });

  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en") setLang("en");
  } catch (_) { /* ignore */ }

  /* ---------- Motion ---------- */
  const mm = gsap.matchMedia();
  gsap.registerPlugin(ScrollTrigger, SplitText);

  function runHero() {
    const title = document.querySelector("[data-split]");
    const splitTarget = title.querySelector("span");

    document.fonts.ready.then(() => {
      const split = new SplitText(splitTarget, { type: "lines", linesClass: "split-line" });
      window.__heroSplit = split;

      const tl = gsap.timeline({ defaults: { duration: DURATION, ease: EASE } });
      tl.from(split.lines, { yPercent: 105, stagger: STAGGER })
        .from(".eyebrow", { y: 16, opacity: 0, duration: 0.6 }, "<")
        .from(".hero__sub", { y: 24, opacity: 0, duration: 0.7 }, "-=0.6")
        .from(".hero__cta .btn", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.5")
        .from(".hero__glow", { scale: 0.7, opacity: 0, duration: 1.6 }, 0);
    });
  }

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    runHero();

    // Hero glow drifts gently with scroll.
    gsap.to(".hero__glow", {
      yPercent: 25,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
    });

    // Pinned horizontal services track.
    const track = document.getElementById("servicesTrack");
    const scrollDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 120);

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

    // Section titles and the "why" list reveal as they enter.
    gsap.utils.toArray(".section-title").forEach((el) => {
      gsap.from(el, {
        y: 40, opacity: 0, duration: DURATION, ease: EASE,
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
      });
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

  // Reduced motion: text is already visible via CSS, nothing else to do.
  mm.add("(prefers-reduced-motion: reduce)", () => {});

  // Gentle card tilt-free hover is handled in CSS; no per-frame JS.

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const cfg = window.AURELIAN_CONFIG;

  const isEN = () => html.lang === "en";
  const t = (key) => (isEN() ? EN[key] : GR[key]) || key;

  function validate(data) {
    if (!data.name.trim()) return false;
    return /^[+0-9 ()-]{8,40}$/.test(data.phone.trim());
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
      status.className = "form__status is-error";
      status.textContent = t("form.invalid");
      return;
    }

    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    status.className = "form__status";
    status.textContent = "…";

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
      status.textContent = t("form.ok");
    } catch (err) {
      status.className = "form__status is-error";
      status.textContent = t("form.err");
      console.error(err);
    } finally {
      button.disabled = false;
    }
  });
})();
