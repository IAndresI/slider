function slider({
  sliderItem,
  sliderButtonNext,
  sliderButtonPrev,
  slidesToShow = 1,
  responsive = false,
  slidesToScroll = 1,
  dots = true,
  speed = 700,
  fade = false
}) {

  let slider_item = document.querySelectorAll(sliderItem),
    slider_translatex = document.createElement("div"),
    slider_button_next = document.querySelector(sliderButtonNext),
    slider_button_prev = document.querySelector(sliderButtonPrev),
    slidesToShowOriginal = slidesToShow,
    slidesToScrollOriginal = slidesToScroll,
    temp = 0;

  // Create slides-wrapper

  if (slider_item[0]) {
    slider_translatex.classList.add("slider__translatex");
    slider_translatex.style.display = "flex";
    if (!fade) slider_translatex.style.transition = `transform ${speed/1000}s`;
    let documentWidth = document.documentElement.clientWidth,
      parent = slider_item[0].parentElement,
      innerSliderWidth = slider_item[0].parentElement.offsetWidth,
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
    slider_item.forEach(element => {
      element.remove();
    });
    slider_container_array.forEach(element => {
      slider_translatex.append(element);
    });

    slider_translatex.style.width = slider_item.length * slide_width + "px";
    parent.append(slider_translatex);

    // Responsive

    function adaptive(slidesScroll = slidesToScrollOriginal, slidesShow = slidesToShowOriginal) {
      slidesToScrollOriginal = slidesScroll || slidesToScroll;
      let slides = document.querySelectorAll(`.${slider_translatex.parentElement.getAttribute("class").replace(/ /g,".")} .slide-container`),
        innerSliderWidth = slider_translatex.parentElement.offsetWidth;
      slides.forEach(element => {
        element.style.width = (innerSliderWidth / slidesShow) + "px";
      });
      slider_translatex.style.width = slider_item.length * parseInt(slides[0].style.width) + "px";
      slidesToShowOriginal = slidesShow;
      slidesToScrollOriginal = slidesScroll;
      setDots();
    }

    if (dots) {
      createDots();
      dotClick(0);
    }

    if (responsive) {
      setDots();
      let biggestBreakPoint = 0;
      slider_translatex.style.transform = `translateX(-${ (((parseInt(slider_translatex.style.width) / slider_item.length) * temp)) * slidesToScrollOriginal}px)`;

      responsive.forEach(element => {
        if (documentWidth < element.breakPoint) {
          adaptive(element.slidesToScroll, element.slidesToShow);
        }
      });

      window.addEventListener(`resize`, () => {
        documentWidth = document.documentElement.clientWidth;
        responsive.forEach(element => {
          if (documentWidth < element.breakPoint) {
            adaptive(element.slidesToScroll, element.slidesToShow);
          }
          if (element.breakPoint > biggestBreakPoint) biggestBreakPoint = element.breakPoint;
        });
        if (documentWidth > biggestBreakPoint) {
          adaptive(slidesToScroll, slidesToShow);
        }
        slider_translatex.style.transform = `translateX(-${ (((parseInt(slider_translatex.style.width) / slider_item.length) * temp)) * slidesToScrollOriginal}px)`;
      });
    } else {
      setDots();
      window.addEventListener(`resize`, () => {
        adaptive(slidesToScroll, slidesToShow);
        slider_translatex.style.transform = `translateX(-${ (((parseInt(slider_translatex.style.width) / slider_item.length) * temp)) * slidesToScrollOriginal}px)`;
      });
    }

    // Dots

    function createDots() {
      let dots_number = Math.ceil((slider_item.length - slidesToShowOriginal) / slidesToScrollOriginal) + 1,
        dots_container = document.createElement("ul");
      dots_container.classList.add("slider__dots-list");
      parent.append(dots_container);
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
      document.querySelector(".slider__dots-list").remove();
    }

    function dotClick(target) {
      dots = document.querySelectorAll(`.${slider_translatex.parentElement.getAttribute("class").replace(/ /g,".")} .slider__dot-button`);
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
        dotClick(temp);
      }
    }

    // Slide Scroll

    function scrollSlide(numberOfSlide) {
      let maxNextButtonClickCounter = Math.ceil((slider_item.length - slidesToShowOriginal) / slidesToScrollOriginal);
      if (slider_item.length <= slidesToScrollOriginal) slidesToScrollOriginal = 0;
      if (numberOfSlide > maxNextButtonClickCounter) numberOfSlide = temp = 0;
      else if (numberOfSlide < 0) numberOfSlide = temp = maxNextButtonClickCounter;
      if (dots) dotClick(numberOfSlide);
      if (fade == true) {
        let animateID,
          slider_item = document.querySelectorAll(sliderItem),
          durationProcent = speed / 100,
          lastTime = performance.now();
        slider_item.forEach(element => {
          element.style.transition = `all ${speed/1000}s ease`;
        });

        function animation() {
          let currentTime = performance.now();
          if (currentTime - lastTime >= 0) {
            slider_item.forEach(element => {
              element.style.opacity = 0;
            });
          }
          if (currentTime - lastTime >= durationProcent * 100) {
            slider_item.forEach(element => {
              slider_translatex.style.transform = `translateX(-${ (((parseInt(slider_translatex.style.width) / slider_item.length) * numberOfSlide)) * slidesToScrollOriginal}px)`;
              element.style.opacity = 1;
            });
            animateID = cancelAnimationFrame(animation);
          }
          if (currentTime - lastTime < durationProcent * 100) animateID = requestAnimationFrame(animation);
        }
        animateID = requestAnimationFrame(animation);
      } else {
        slider_translatex.style.transform = `translateX(-${ (((parseInt(slider_translatex.style.width) / slider_item.length) * numberOfSlide)) * slidesToScrollOriginal}px)`;
      }
    }

    if (sliderButtonNext) {
      slider_button_next.addEventListener("click", () => {
        scrollSlide(++temp);
      });
    }
    if (sliderButtonPrev) {
      slider_button_prev.addEventListener("click", () => {
        scrollSlide(--temp);
      });
    }

    // Swipes

    let startX = 0,
      endX = 0;

    function scrollSlideOnTouch() {
      if (endX > startX + 70) {
        scrollSlide(--temp);
      }
      if (endX < startX - 70) {
        scrollSlide(++temp);
      }
    }

    slider_translatex.addEventListener("mousedown", (event) => {
      startX = event.screenX;
    });

    slider_translatex.addEventListener("mouseup", (event) => {
      endX = event.screenX;
      scrollSlideOnTouch();
    });

    slider_translatex.addEventListener("touchstart", (event) => {
      startX = event.touches[0].clientX;
    });

    slider_translatex.addEventListener("touchend", (event) => {
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
//   speed: 1000,
//   fade: true,
//   dots: false,
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