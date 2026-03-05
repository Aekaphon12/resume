const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((node, i) => {
  node.style.transitionDelay = `${Math.min(i * 60, 220)}ms`;
  observer.observe(node);
});

const htmlNode = document.documentElement;
const langTrigger = document.querySelector(".lang-trigger");
const langMenu = document.querySelector(".lang-menu");
const langButtons = Array.from(document.querySelectorAll("[data-set-lang]"));
const fallbackLang = htmlNode.dataset.lang || "th";

const applyLanguage = (lang) => {
  const nextLang = lang === "en" ? "en" : "th";
  htmlNode.lang = nextLang;
  htmlNode.dataset.lang = nextLang;

  document.querySelectorAll(".i18n.th").forEach((node) => {
    node.hidden = nextLang !== "th";
  });

  document.querySelectorAll(".i18n.en").forEach((node) => {
    node.hidden = nextLang !== "en";
  });

  langButtons.forEach((button) => {
    const isActive = button.dataset.setLang === nextLang;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-checked", String(isActive));
  });

  try {
    localStorage.setItem("resume_lang", nextLang);
  } catch (error) {
    // Ignore storage errors in restricted environments.
  }
};

const closeLanguageMenu = () => {
  if (!langMenu || !langTrigger) return;
  langMenu.hidden = true;
  langTrigger.setAttribute("aria-expanded", "false");
};

if (langTrigger && langMenu) {
  langTrigger.addEventListener("click", () => {
    const willOpen = langMenu.hidden;
    langMenu.hidden = !willOpen;
    langTrigger.setAttribute("aria-expanded", String(willOpen));
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".lang-switch")) {
      closeLanguageMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLanguageMenu();
    }
  });
}

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.setLang);
    closeLanguageMenu();
  });
});

let storedLang = fallbackLang;
try {
  storedLang = localStorage.getItem("resume_lang") || fallbackLang;
} catch (error) {
  storedLang = fallbackLang;
}
applyLanguage(storedLang);
