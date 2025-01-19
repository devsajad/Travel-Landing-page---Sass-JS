// Import Images
import greecImage from "../../assets/steps/greec.png";
import europeImage from "../../assets/destination/europe.png";
import italyImage from "../../assets/destination/italy.png";
import londonImage from "../../assets/destination/london.png";
const imagesMap = {
  greec: greecImage,
  europe: europeImage,
  italy: italyImage,
  london: londonImage,
};

const progressBar = document.querySelector(".steps__floating-card--line");
const stepImages = document.querySelector(".steps__images");
const heroTitleUnderline = document.querySelector(".hero__title--underline");
const hiddenSections = document.querySelectorAll(".section-hidden");
const lazyImages = document.querySelectorAll(".lazy-loading");
////////////////////////////////// Reveal Setions
// Reveal Header
function reavealHero(entries) {
  heroTitleUnderline.classList.toggle("active");
}

const headerObserver = new IntersectionObserver(reavealHero, {
  root: null,
  threshold: 1,
});
headerObserver.observe(heroTitleUnderline);

// Reaveal sections
function revealSection(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  if (entry.target.classList.contains("steps__images")) {
    const target = entry.target;

    target.classList.add("active");
    return observer.unobserve(entry.target);
  }

  entry.target.classList.remove("section-hidden");
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

hiddenSections.forEach((section) => sectionObserver.observe(section));

// Reaveal Step Section image
sectionObserver.observe(stepImages);

// Progress section
function reavealProgress(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  let progressCount = 0;
  const intervalId = setInterval(() => {
    progressCount += 2;
    document.querySelector(
      ".steps__floating-card--percentage"
    ).textContent = `${progressCount}%`;
  }, 25);

  setTimeout(() => {
    clearInterval(intervalId);
  }, 500);

  progressBar.classList.add("active");

  observer.unobserve(entry.target);
}

const progressObserver = new IntersectionObserver(reavealProgress, {
  root: null,
  threshold: 1,
});
progressObserver.observe(stepImages);

///////////////////////////////// Image Lazy loading
function revealImage(entries, observe) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entries.forEach((entry) => {
    entry.target.src = imagesMap[entry.target.dataset.name];

    entry.target.addEventListener("load", function () {
      entry.target.classList.remove("lazy-loading");
    });
    observe.unobserve(entry.target);
  });
}

const imageObserver = new IntersectionObserver(revealImage, {
  root: null,
  threshold: 0,
  rootMargin: "-300px",
});

lazyImages.forEach((image) => imageObserver.observe(image));

/////////////////////////////// Testominonials Slider
function slider() {
  const slides = document.querySelectorAll(".testimonial__slider--slide");
  const dotContainer = document.querySelector(".testimonial__header--dots");
  const arrowTop = document.querySelector(".arrow-top");
  const arrowDown = document.querySelector(".arrow-down");

  let curSlide = 0;
  let nextSlide = curSlide + 1;
  const maxSlide = slides.length;

  function createDots() {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button
            class="dots__dot"
            data-slide=${i}
            ></button>`
      );
    });
  }

  function activateDot(slide) {
    document.querySelectorAll(".dots__dot").forEach((dot) => {
      dot.classList.remove("dots__dot--active");
    });

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  }

  function goToSlide(curSlide, nextSlide) {
    slides.forEach((slide) => {
      slide.classList.remove("active");
      slide.classList.remove("next");
    });

    slides[curSlide].classList.add("active");
    slides[nextSlide].classList.add("next");
  }

  // Next slide
  const goNextSlide = function () {
    curSlide++;
    nextSlide++;

    if (curSlide === maxSlide) curSlide = 0;
    if (nextSlide === maxSlide) nextSlide = 0;

    goToSlide(curSlide, nextSlide);
    activateDot(curSlide);
  };

  const goPrevSlide = function () {
    curSlide--;
    nextSlide--;

    if (curSlide < 0) curSlide = maxSlide - 1;
    if (nextSlide < 0) nextSlide = maxSlide - 1;

    goToSlide(curSlide, nextSlide);
    activateDot(curSlide);
  };

  const sliderIntId = setInterval(() => {
    goNextSlide();
  }, 2000);

  // events
  dotContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("dots__dot")) return;

    const slide = +e.target.dataset.slide;
    activateDot(slide);

    const nextSlide = slide + 1 === maxSlide ? 0 : slide + 1;
    goToSlide(slide, nextSlide);
  });

  (function init() {
    createDots();
    activateDot(0);
    goToSlide(0, 1);
  })();
  arrowDown.addEventListener("click", () => {
    clearInterval(sliderIntId);
    goNextSlide();
  });
  arrowTop.addEventListener("click", () => {
    clearInterval(sliderIntId);
    goPrevSlide();
  });
}
slider();
