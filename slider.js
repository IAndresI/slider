function slider({
  slider__item,
  slider__translateX,
  slider__button__next,
  slider__button__prev,
  slidesToShow = 1,
  responsive = false,
  slidesToScroll = 1,
  dots = true
}) {

  let slider_item = document.querySelectorAll(slider__item),
    slider_transitionx = document.querySelector(slider__translateX),
    slider_button_next = document.querySelector(slider__button__next),
    slider_button_prev = document.querySelector(slider__button__prev),
    slidesToShowOriginal = slidesToShow,
    slidesToScrollOriginal = slidesToScroll,
    temp = 0;

  // Create slides-wrapper

  if (slider_transitionx) {
    let documentWidth = document.documentElement.clientWidth,
      innerSliderWidth = slider_transitionx.parentElement.offsetWidth,
      slide_width = innerSliderWidth / slidesToShow,
      slider_container_array = [];

    for (let i = 0; i < slider_item.length; i++) {
      let slide_container = document.createElement("div");
      slide_container.classList.add("slide-container");
      slide_container.style.width = slide_width + "px";
      let slide_container_content = slider_item[i].cloneNode(true);
      slide_container.append(slide_container_content);
      slider_container_array.push(slide_container);
    }
    slider_transitionx.innerHTML = "";
    slider_container_array.forEach(element => {
      slider_transitionx.append(element);
    });

    slider_transitionx.style.width = slider_item.length * slide_width + "px";


    // Responsive

    function adaptive(slidesScroll, slidesShow) {
      slidesToScrollOriginal = slidesScroll || slidesToScroll;
      let SLIDES = document.querySelectorAll(`${slider__translateX}>.slide-container`),
        innerSliderWidth = slider_transitionx.parentElement.offsetWidth;
      SLIDES.forEach(element => {
        element.style.width = (innerSliderWidth / slidesShow) + "px";
      });
      slider_transitionx.style.width = slider_item.length * parseInt(SLIDES[0].style.width) + "px";
      slidesToShowOriginal = slidesShow;
      slidesToScrollOriginal = slidesScroll;
    }

    if (dots) {
      createDots();
      dotClick(0);
    }

    if (responsive) {
      if (dots) setDots();
      let biggestBreakPoint = 0;
      slider_transitionx.style.transform = `translateX(-0px)`;

      responsive.forEach(element => {
        if (documentWidth < element.breakPoint) {
          adaptive(element.slidesToScroll, element.slidesToShow);
          setDots();
        }
      });
      window.addEventListener(`resize`, () => {
        slider_transitionx.style.transform = `translateX(-0px)`;
        dotClick(0);
        documentWidth = document.documentElement.clientWidth;
        responsive.forEach(element => {
          if (documentWidth < element.breakPoint) {
            adaptive(element.slidesToScroll, element.slidesToShow);
            setDots();
          }
          if (element.breakPoint > biggestBreakPoint) biggestBreakPoint = element.breakPoint;
        });
        if (documentWidth > biggestBreakPoint) {
          adaptive(slidesToScroll, slidesToShow);
          setDots();
        }
      });
    } else {
      window.addEventListener(`resize`, () => {
        slider_transitionx.style.transform = `translateX(-0px)`;
        documentWidth = document.documentElement.clientWidth;
        adaptive(slidesToScroll, slidesToShow);
        setDots();
      });
    }

    // Dots

    function createDots() {
      let dots_number = Math.ceil((slider_item.length - slidesToShowOriginal) / slidesToScrollOriginal) + 1,
        dots_container = document.createElement("ul");
      dots_container.classList.add("slider__dots-list");
      slider_transitionx.parentElement.append(dots_container);
      for (let i = 0; i < dots_number; i++) {
        let dot = document.createElement("li"),
          dot_button = document.createElement("button");
        dot.classList.add("slider__dot");
        dot_button.classList.add("slider__dot-button");
        dot_button.innerHTML = `${i}`;
        dot.append(dot_button);
        dots_container.append(dot);
        dot.addEventListener("click", function () {
          dotClick(i);
          scrollSlide(i);
        });
      }
    }

    function clearDots() {
      document.querySelector(`.slider__dots-list`).remove();
    }

    function dotClick(target) {
      dots = document.querySelectorAll(".slider__dot-button");
      for (let j = 0; j < dots.length; j++) {
        if (dots[j] == dots[target]) dots[j].classList.add("slider__dot-button--active");
        else dots[j].classList.remove("slider__dot-button--active");
      }
      temp = target;
    }

    function setDots() {
      if (dots) {
        clearDots();
        createDots();
        dotClick(0);
      }
    }

    // Slide Scroll

    function scrollSlide(numberOfSlide) {
      let maxNextButtonClickCounter = Math.ceil((slider_item.length - slidesToShowOriginal) / slidesToScrollOriginal);
      if (slider_item.length <= slidesToScrollOriginal) slidesToScrollOriginal = 0;
      if (numberOfSlide > maxNextButtonClickCounter) numberOfSlide = temp = 0;
      else if (numberOfSlide < 0) numberOfSlide = temp = maxNextButtonClickCounter;
      slider_transitionx.style.transform = `translateX(-${ (((parseInt(slider_transitionx.style.width) / slider_item.length) * numberOfSlide)) * slidesToScrollOriginal}px)`;
    }
    scrollSlide(temp);

    if (slider__button__next) {
      slider_button_next.addEventListener("click", () => {
        scrollSlide(++temp);
        dotClick(temp);
      });
    }
    if (slider__button__prev) {
      slider_button_prev.addEventListener("click", () => {
        scrollSlide(--temp);
        dotClick(temp);
      });
    }

    // Swipes

    let startX = 0,
      endX = 0;

    function scrollSlideOnTouch() {
      if (endX > startX + 70) {
        scrollSlide(--temp);
        dotClick(temp);
      }
      if (endX < startX - 70) {
        scrollSlide(++temp);
        dotClick(temp);
      }
    }

    slider_transitionx.addEventListener("mousedown", (event) => {
      startX = event.screenX;
    });

    slider_transitionx.addEventListener("mouseup", (event) => {
      endX = event.screenX;
      scrollSlideOnTouch();
    });

    slider_transitionx.addEventListener("touchstart", (event) => {
      startX = event.touches[0].clientX;
    });

    slider_transitionx.addEventListener("touchend", (event) => {
      endX = event.changedTouches[0].clientX;
      scrollSlideOnTouch();
    });
  }
}

export default slider;

// Usage example

// slider({
//   slider__item: ".item,
//   slider__translateX: ".items__translatex",
//   slider__button__next: ".button-next",
//   slider__button__prev: ".button-prev",
//   slidesToShow: 3,
//   responsive: [{
//       breakPoint: 1160,
//       slidesToShow: 2
//     },
//     {
//       breakPoint: 780,
//       slidesToShow: 1
//     }
//   ]
// });