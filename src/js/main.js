// Import Images
import greecImage from "../../assets/steps/greec.webp";
import europeImage from "../../assets/destination/europe.webp";
import italyImage from "../../assets/destination/italy.webp";
import londonImage from "../../assets/destination/london.webp";

// Map for image sources
const imagesMap = {
  greec: greecImage,
  europe: europeImage,
  italy: italyImage,
  london: londonImage,
};

// Select DOM elements
const progressBar = document.querySelector(".steps__floating-card--line");
const stepImages = document.querySelector(".steps__floating-card");
const heroTitleUnderline = document.querySelector(".hero__title--underline");
const hiddenSections = document.querySelectorAll(".section-hidden");
const lazyImages = document.querySelectorAll(".lazy-loading");

// Helper functions to toggle classes for elements
const toggleClass = (element, className, condition = true) =>
  condition
    ? element.classList.add(className)
    : element.classList.remove(className);

// ------------------------------------------
// Reveal Header Section
const revealHero = (entries, observer) => {
  toggleClass(heroTitleUnderline, "active", entries[0].isIntersecting);
  observer.unobserve(entries[0].target);
};

const headerObserver = new IntersectionObserver(revealHero, { threshold: 1 });
headerObserver.observe(heroTitleUnderline);

// ------------------------------------------
// Reveal Sections
const revealSection = (entries, observer) => {
  const entry = entries[0];
  if (!entry.isIntersecting) return;

  const target = entry.target;

  // Reveal image section and unobserve it
  if (target.classList.contains("steps__images")) {
    toggleClass(target, "active");
    observer.unobserve(target);
    return;
  }

  toggleClass(target, "section-hidden", false);
  observer.unobserve(target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  threshold: 0.15,
});
hiddenSections.forEach((section) => sectionObserver.observe(section));
sectionObserver.observe(stepImages);

// ------------------------------------------
// Progress Section
const revealProgress = (entries, observer) => {
  const entry = entries[0];
  if (!entry.isIntersecting) return;

  let progressCount = 0;
  const intervalId = setInterval(() => {
    progressCount += 2;
    document.querySelector(
      ".steps__floating-card--percentage"
    ).textContent = `${progressCount}%`;
  }, 25);

  setTimeout(() => clearInterval(intervalId), 500);
  toggleClass(progressBar, "active");

  observer.unobserve(entry.target);
};

const progressObserver = new IntersectionObserver(revealProgress, {
  threshold: 1,
});
progressObserver.observe(stepImages);

// ------------------------------------------
// Lazy Load Images
const revealImage = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const target = entry.target;
    // target.src = imagesMap[target.dataset.name];

    // target.addEventListener("load", () =>
    target.classList.remove("lazy-loading");
    // );
    observer.unobserve(target);
  });
};

const imageObserver = new IntersectionObserver(revealImage, {
  rootMargin: "-300px",
});
lazyImages.forEach((image) => imageObserver.observe(image));

// ------------------------------------------
// Testimonials Slider
const slider = () => {
  const slides = document.querySelectorAll(".testimonial__slider--slide");
  const dotContainer = document.querySelector(".testimonial__header--dots");
  const arrowTop = document.querySelector(".arrow-top");
  const arrowDown = document.querySelector(".arrow-down");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Create dots for slider
  const createDots = () => {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = (slide) => {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) =>
        toggleClass(dot, "dots__dot--active", dot.dataset.slide == slide)
      );
  };

  const goToSlide = (curSlide, nextSlide) => {
    slides.forEach((slide) => {
      slide.classList.remove("active", "next");
    });

    slides[curSlide].classList.add("active");
    slides[nextSlide].classList.add("next");
  };

  const goNextSlide = () => {
    curSlide = (curSlide + 1) % maxSlide;
    const nextSlide = (curSlide + 1) % maxSlide;

    goToSlide(curSlide, nextSlide);
    activateDot(curSlide);
  };

  const goPrevSlide = () => {
    curSlide = (curSlide - 1 + maxSlide) % maxSlide;
    const nextSlide = (curSlide + 1) % maxSlide;

    goToSlide(curSlide, nextSlide);
    activateDot(curSlide);
  };

  const sliderIntId = setInterval(goNextSlide, 2000);

  // Event listeners
  dotContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("dots__dot")) {
      const slide = parseInt(e.target.dataset.slide);
      activateDot(slide);
      goToSlide(slide, (slide + 1) % maxSlide);
    }
  });

  arrowDown.addEventListener("click", () => {
    clearInterval(sliderIntId);
    goNextSlide();
  });

  arrowTop.addEventListener("click", () => {
    clearInterval(sliderIntId);
    goPrevSlide();
  });

  // Initialize slider
  createDots();
  activateDot(0);
  goToSlide(0, 1);
};

slider();
