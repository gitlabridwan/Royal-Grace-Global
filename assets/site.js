const navItems = [
  ["Home", "/"],
  ["About Us", "/about/"],
  ["Our Products", "/products/"],
  ["Global Partnership", "/#partnership"],
  ["Sustainability", "/about/#commitment"],
  ["News", "/#news"],
  ["Contact", "/#contact"],
];

const activePathFor = (href) => {
  if (href.includes("#")) return false;
  const currentPath = window.location.pathname;
  if (href === "/") return currentPath === "/";
  if (href === "/products/") return currentPath.startsWith("/products/");
  return currentPath === href;
};

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const items = navItems
      .map(([label, href]) => {
        const current = activePathFor(href);
        return `<li><a class="nav-link${current ? " is-active" : ""}" href="${href}"${current ? ' aria-current="page"' : ""}>${label}</a></li>`;
      })
      .join("");

    this.innerHTML = `
      <a class="skip-link" href="#main-content">Skip to content</a>
      <header class="site-header">
        <div class="header-inner">
          <a class="brand" href="/" aria-label="Royal Grace Global home">
            <span class="brand-mark" aria-hidden="true"><span>RG</span></span>
            <span class="brand-copy">
              <strong>Royal Grace Global</strong>
              <small>Bridging Nations Enriching Lives</small>
            </span>
          </a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">
            <span class="sr-only">Toggle navigation</span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
          <nav id="primary-navigation" class="primary-navigation" aria-label="Primary navigation">
            <ul>${items}</ul>
            <a class="header-cta" href="/#contact">Contact Status <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
      </header>`;

    const button = this.querySelector(".menu-toggle");
    const navigation = this.querySelector(".primary-navigation");
    const header = this.querySelector(".site-header");

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
    };
    requestAnimationFrame(syncHeaderHeight);

    const closeMenu = ({ restoreFocus = false } = {}) => {
      button.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      if (restoreFocus) button.focus();
    };

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      navigation.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    this.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
        closeMenu({ restoreFocus: true });
      }
    });

    this.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        if (button.getAttribute("aria-expanded") === "true" && !this.contains(document.activeElement)) {
          closeMenu();
        }
      });
    });

    window.addEventListener("resize", () => {
      syncHeaderHeight();
      if (window.matchMedia("(min-width: 68rem)").matches) closeMenu();
    });
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="footer-main">
          <a class="brand brand--footer" href="/" aria-label="Royal Grace Global home">
            <span class="brand-mark" aria-hidden="true"><span>RG</span></span>
            <span class="brand-copy">
              <strong>Royal Grace Global</strong>
              <small>Bridging Nations Enriching Lives</small>
            </span>
          </a>
          <p>Connecting Indonesia’s finest products with partners who value quality, integrity, and meaningful growth.</p>
          <div class="footer-social" aria-label="Social channels coming soon">
            <span aria-hidden="true">IN</span><span aria-hidden="true">IG</span><span aria-hidden="true">LI</span>
          </div>
        </div>
        <div class="footer-bottom">
          <small>© ${new Date().getFullYear()} Royal Grace Global. All rights reserved.</small>
          <div class="policy-labels" aria-label="Policy information">
            <span>Privacy Policy</span><span>Terms of Use</span><span>Responsible Sourcing</span>
          </div>
        </div>
      </footer>`;
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);

export function initRevealAnimations() {
  const elements = [...document.querySelectorAll("[data-reveal]")];
  if (!elements.length) return;

  try {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) return;

    document.documentElement.classList.add("reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
  } catch (error) {
    document.documentElement.classList.remove("reveal-ready");
    console.warn("Reveal animation disabled.", error);
  }
}

initRevealAnimations();
