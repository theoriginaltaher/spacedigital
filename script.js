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

  const contactForm = document.querySelector("[data-contact-form]");
  const contactStatus = document.querySelector("[data-contact-status]");

  if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitButton = contactForm.querySelector('button[type="submit"]');
      const formData = new FormData(contactForm);

      contactStatus.className = "rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary";
      contactStatus.textContent = "Sending your request...";
      contactStatus.classList.remove("hidden");

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add("opacity-70", "cursor-not-allowed");
      }

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          let errorMessage = "Something went wrong while sending your message.";

          try {
            const data = await response.json();
            if (data?.errors?.length) {
              errorMessage = data.errors.map((error) => error.message).join(", ");
            }
          } catch {
            errorMessage = "Something went wrong while sending your message.";
          }

          throw new Error(errorMessage);
        }

        contactForm.reset();
        contactStatus.className = "rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm text-secondary";
        contactStatus.textContent = "Thanks. Your message has been sent successfully.";
      } catch (error) {
        contactStatus.className = "rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300";
        contactStatus.textContent = error.message || "Something went wrong while sending your message. Please try again or contact us on WhatsApp.";
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.classList.remove("opacity-70", "cursor-not-allowed");
        }
      }
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
