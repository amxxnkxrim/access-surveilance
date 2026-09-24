document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const serviceSlider = document.querySelector(".service-slider");

  const styledHeadings = document.querySelectorAll(
    ".section-heading h2, .trust-copy-wrap h2, .info-card h2, .detail-card h3, .quote-panel h3, .page-hero-copy h1, .cta-card h2"
  );

  styledHeadings.forEach(function (heading) {
    if (heading.querySelector(".word-green, .word-red") || heading.innerText.trim() === "") {
      return;
    }

    const words = heading.textContent.trim().split(/\s+/);
    if (words.length < 2) {
      return;
    }

    const first = document.createElement("span");
    first.className = "word-green";
    first.textContent = words[0];

    const last = document.createElement("span");
    last.className = "word-red";
    last.textContent = words[words.length - 1];

    const middle = words.slice(1, -1).join(" ");
    heading.innerHTML = "";
    heading.appendChild(first);
    heading.appendChild(document.createTextNode(middle ? " " + middle + " " : " "));
    heading.appendChild(last);
  });

  const revealItems = document.querySelectorAll(
    ".page-hero-copy, .info-card, .feature-card, .section-heading, .process-step, .stat-card, .service-card-page, .detail-card, .quote-panel, .contact-form-wrap, .cta-card, .hero-copy, .hero-panel, .service-card, .trust-point, .trust-panel-card"
  );

  revealItems.forEach(function (item, index) {
    item.classList.add("reveal");
    item.style.transitionDelay = (index * 80) + "ms";
    item.classList.add("is-visible");
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    mainNav.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });
  }

  if (serviceSlider) {
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let hoverTimer = null;
    const hoverDelay = 500;

    const enableHoverInteraction = () => {
      serviceSlider.classList.add("interactive");
    };

    const disableHoverInteraction = () => {
      serviceSlider.classList.remove("interactive");
      isDown = false;
      clearTimeout(hoverTimer);
    };

    serviceSlider.addEventListener("pointerenter", function () {
      hoverTimer = setTimeout(enableHoverInteraction, hoverDelay);
    });

    serviceSlider.addEventListener("pointerleave", function () {
      disableHoverInteraction();
    });

    serviceSlider.addEventListener("wheel", function (event) {
      if (!serviceSlider.classList.contains("interactive")) {
        return;
      }
      event.preventDefault();
      serviceSlider.scrollLeft += event.deltaY;
    }, { passive: false });

    serviceSlider.addEventListener("pointerdown", function (event) {
      if (!serviceSlider.classList.contains("interactive")) {
        return;
      }
      isDown = true;
      startX = event.clientX;
      startScrollLeft = serviceSlider.scrollLeft;
      serviceSlider.setPointerCapture(event.pointerId);
    });

    serviceSlider.addEventListener("pointermove", function (event) {
      if (!isDown || !serviceSlider.classList.contains("interactive")) return;
      event.preventDefault();
      const walk = (event.clientX - startX) * 1.2;
      serviceSlider.scrollLeft = startScrollLeft - walk;
    });

    serviceSlider.addEventListener("pointerup", function () {
      isDown = false;
    });

    serviceSlider.addEventListener("pointercancel", function () {
      isDown = false;
    });
  }
});
