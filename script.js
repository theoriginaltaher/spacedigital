document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  const applySharedUI = () => {
    const yearTarget = document.querySelector("[data-current-year]");
    if (yearTarget) yearTarget.textContent = new Date().getFullYear();
  };

  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) link.classList.add("active-nav");
  });

  const mobileMenuToggle = document.querySelector("[data-mobile-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const mobileMenuClose = document.querySelector("[data-mobile-menu-close]");

  if (mobileMenuToggle && mobileMenu) {
    const setMenuState = (open) => {
      mobileMenu.classList.toggle("hidden", !open);
      document.body.classList.toggle("overflow-hidden", open);
    };

    mobileMenuToggle.addEventListener("click", () => {
      setMenuState(mobileMenu.classList.contains("hidden"));
    });

    mobileMenuClose?.addEventListener("click", () => setMenuState(false));

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });
  }

  const footerMount = document.querySelector("[data-footer]");
  if (footerMount) {
    fetch("./footer.html")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load footer");
        return response.text();
      })
      .then((html) => {
        footerMount.innerHTML = html;
        applySharedUI();
      })
      .catch(() => {
        footerMount.innerHTML = "";
        applySharedUI();
      });
  } else {
    applySharedUI();
  }
});
