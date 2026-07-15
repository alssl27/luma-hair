"use strict";

const header = document.querySelector("#site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");
const backToTop = document.querySelector("#back-to-top");
const matcherForm = document.querySelector("#matcher-form");
const matcherResult = document.querySelector("#matcher-result");

// Navigation and page polish
function closeMenu() {
  navMenu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
  document.body.classList.remove("menu-open");
}

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navMenu.classList.toggle("open", !isOpen);
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  document.body.classList.toggle("menu-open", !isOpen);
});

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
  backToTop.classList.toggle("visible", window.scrollY > 700);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

// Announcement bar: cycles through short salon messages.
const announcementMessages = [
  "<u>New:</u> online video courses now available",
  "Complimentary consultation with every colour service",
  "Open Tuesday to Saturday &mdash; 24 Rose Lane, London"
];
const announceMessage = document.querySelector("#announce-message");
let announcementIndex = 0;

function showAnnouncement(step) {
  announcementIndex = (announcementIndex + step + announcementMessages.length) % announcementMessages.length;
  announceMessage.innerHTML = announcementMessages[announcementIndex];
}

document.querySelector("#announce-prev").addEventListener("click", () => showAnnouncement(-1));
document.querySelector("#announce-next").addEventListener("click", () => showAnnouncement(1));

// Reveal sections only when they enter the viewport.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

// Highlights the navigation item for the section currently in view.
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll(".nav-menu a").forEach((link) => {
      const target = link.getAttribute("href");
      link.classList.toggle("active", target === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

// Shared, accessible form validation helper.
function validateForm(form) {
  let isValid = true;
  const requiredFields = form.querySelectorAll("[required]");

  requiredFields.forEach((field) => {
    const group = field.closest(".form-group");
    const message = group?.querySelector(".error-message");
    const isEmail = field.type === "email";
    const value = field.value.trim();
    let error = "";

    if (!value) {
      error = "This field is required.";
    } else if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "Enter a valid email address.";
    }

    group?.classList.toggle("has-error", Boolean(error));
    field.setAttribute("aria-invalid", String(Boolean(error)));
    if (message) message.textContent = error;
    if (error) isValid = false;
  });

  return isValid;
}

document.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    const group = field.closest(".form-group");
    group?.classList.remove("has-error");
    field.removeAttribute("aria-invalid");
    const message = group?.querySelector(".error-message");
    if (message) message.textContent = "";
  });
});

// Stylist-authored rules power the AI-style recommendation experience.
const faceShapeRules = {
  oval: {
    names: {
      short: "The Polished Italian Bob",
      medium: "The Airy Layered Lob",
      long: "The Signature Cascade"
    },
    reason: "Your oval proportions are beautifully balanced, so you can carry most silhouettes. This shape adds movement while keeping that natural harmony in focus."
  },
  round: {
    names: {
      short: "The Sculpted Side-Part Bob",
      medium: "The Crown-Lift Lob",
      long: "The Face-Framing Cascade"
    },
    reason: "Longer lines, a side part and subtle crown volume visually lengthen a round face. Soft face-framing creates definition without a heavy blunt fringe."
  },
  square: {
    names: {
      short: "The Soft Curve Bob",
      medium: "The Curtain Wave Lob",
      long: "The Feathered Wave"
    },
    reason: "Rounded layers, soft waves and curtain detailing gently soften the jawline while preserving your face's confident structure."
  },
  heart: {
    names: {
      short: "The Chin-Skimming Bob",
      medium: "The Side-Swept Midi",
      long: "The Romantic Jawline Wave"
    },
    reason: "A side-swept shape with movement near the jaw balances a heart-shaped face and draws attention to the cheekbones and eyes."
  },
  diamond: {
    names: {
      short: "The Textured French Bob",
      medium: "The Balanced Side-Part Lob",
      long: "The Soft Fringe Shag"
    },
    reason: "A textured outline, soft fringe and side part balance prominent cheekbones while adding gentle width through the forehead and jaw."
  },
  long: {
    names: {
      short: "The Full-Bodied Bob",
      medium: "The Shoulder-Grazing Wave",
      long: "The Curtain Fringe Layer"
    },
    reason: "Curtain bangs and volume through the sides create flattering width. A shoulder-led shape breaks up length and keeps the overall look beautifully balanced."
  }
};

const textureDetails = {
  straight: "sleek, light-catching finish",
  wavy: "airy, natural movement",
  curly: "defined, springy texture",
  coily: "sculpted volume and curl definition"
};

const colourSuggestions = {
  natural: "Multi-tonal natural gloss",
  blonde: "Champagne dimensional blonde",
  brunette: "Espresso brunette with soft ribbons",
  copper: "Luminous cinnamon copper",
  pastel: "Muted rose-beige pastel",
  vivid: "High-gloss jewel-toned colour"
};

const preferenceDetails = {
  "low maintenance": {
    maintenance: "Low - refresh every 10 to 12 weeks",
    suffix: " with lived-in layers"
  },
  glam: {
    maintenance: "Medium - style weekly, refresh every 8 weeks",
    suffix: " with luxe volume"
  },
  professional: {
    maintenance: "Low to medium - refresh every 8 to 10 weeks",
    suffix: " with a polished finish"
  },
  trendy: {
    maintenance: "Medium - refine every 6 to 8 weeks",
    suffix: " with modern detailing"
  },
  bold: {
    maintenance: "High - maintain every 4 to 6 weeks",
    suffix: " with statement texture"
  }
};

function chooseService(profile) {
  if (["pastel", "vivid", "copper"].includes(profile.colour)) return "Hair colouring";
  if (profile.colour === "blonde") return "Balayage";
  if (profile.preference === "glam" && profile.length === "long") return "Hair extensions";
  if (["curly", "coily"].includes(profile.type)) return "Wash, cut and style";
  return "Cut and blow dry";
}

matcherForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!matcherForm.checkValidity()) {
    matcherForm.reportValidity();
    return;
  }

  const profile = {
    face: document.querySelector("#face-shape").value,
    length: document.querySelector("#hair-length").value,
    type: document.querySelector("#hair-type").value,
    preference: document.querySelector("#style-preference").value,
    colour: document.querySelector("#colour-preference").value
  };

  const faceRule = faceShapeRules[profile.face];
  const preference = preferenceDetails[profile.preference];
  const service = chooseService(profile);

  document.querySelector("#result-name").textContent = `${faceRule.names[profile.length]}${preference.suffix}`;
  document.querySelector("#result-reason").textContent =
    `${faceRule.reason} We would tailor it to your ${profile.type} hair with ${textureDetails[profile.type]}.`;
  document.querySelector("#result-colour").textContent = colourSuggestions[profile.colour];
  document.querySelector("#result-maintenance").textContent = preference.maintenance;
  document.querySelector("#result-service").textContent = service;

  matcherForm.hidden = true;
  matcherResult.hidden = false;
});

document.querySelector("#restart-matcher").addEventListener("click", () => {
  matcherForm.reset();
  matcherResult.hidden = true;
  matcherForm.hidden = false;
  document.querySelector("#face-shape").focus();
});

// Contact form demo: validates locally and provides clear feedback.
const contactForm = document.querySelector("#contact-form");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = document.querySelector("#contact-status");

  if (!validateForm(contactForm)) {
    status.textContent = "Please complete the highlighted fields.";
    return;
  }

  contactForm.reset();
  status.style.color = "#5d7d61";
  status.textContent = "Thank you. Your message has been received.";
});
