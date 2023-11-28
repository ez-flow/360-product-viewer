import { createActionContainer, createSlider, createSwiper } from '$utils/frame';
import { addMultipleEventListener } from '$utils/helper';
import {
  createCursorElement,
  getElementArea,
  isPointInArea,
  setCursorPosition,
  unFocus,
} from '$utils/mouse';
import type { Area, Coordinates, CursorElement, StyleOptions } from '$utils/types';
// import * from '@finsweet/ts-utils';

window.Webflow ||= [];
window.Webflow.push(() => {
  if (!window.Webflow) {
    return;
  }

  //#region Init
  // 360 Product view elements
  const wrapper = document.querySelector<HTMLDivElement>('div[ez--product-viewer-360="wrapper"]');
  const container = document.querySelector<HTMLDivElement>(
    'div[ez--product-viewer-360="container"]'
  );
  const images = document.querySelectorAll<HTMLImageElement>('img[ez--product-viewer-360="image"]');
  if (!wrapper || !container || !images?.length) {
    return;
  }

  // 360 Product view variables
  let timeout: number = 0;
  let currentVisibleImage: number = 0;
  let lastClickedMousePositionX: number = 0;
  let pointerIsDownInArea: boolean = false;
  let screenIsDesktop: boolean = window.screen.width > 991;
  let containerArea: Area = getElementArea(container);
  const minimXMovementToChangeImage: number =
    Math.round(container.getBoundingClientRect().width / images.length) / 2;
  const style: StyleOptions = {
    borderRadius: wrapper.getAttribute('ez--product-viewer-360-border-radius'),
    color: wrapper.getAttribute('ez--product-viewer-360-color'),
    backgroundColor: wrapper.getAttribute('ez--product-viewer-360-bg-color'),
  };

  // Add general style
  const cursorStyleSheet: HTMLStyleElement = document.createElement('style');
  cursorStyleSheet.type = 'text/css';
  const cursorStyle: string = `body.cursor-hidden {cursor: none;}@media (hover: hover) {@keyframes pbRowProductHeaderCursorLabel {0% {-webkit-clip-path: inset(0 0 round ${
    style?.borderRadius ?? '0px'
  });clip-path: inset(0 0 round ${
    style?.borderRadius ?? '0px'
  });}to {-webkit-clip-path: inset(2px 4px round ${
    style?.borderRadius ?? '0px'
  });clip-path: inset(2px 4px round ${
    style?.borderRadius ?? '0px'
  });}}}@keyframes swipe {0% {transform: translate(-50%, -50%) rotate(-15deg);}100% {transform: translate(-50%, -50%) rotate(5deg);}}`;
  cursorStyleSheet.innerHTML = cursorStyle;
  document.getElementsByTagName('head')[0].appendChild(cursorStyleSheet);

  //Init image display
  for (let i = 0; i < images.length; i++) {
    images[i].setAttribute('ez--product-viewer-360', `image-${i}`); //not useful as of now
    if (i === currentVisibleImage) {
      images[currentVisibleImage].style.display = 'block';
    } else {
      images[i].style.display = 'none';
    }
  }

  // Add html elements
  const swiperContainer: HTMLElement = createSwiper(style);
  timeout = setTimeout(() => {
    if (!screenIsDesktop) {
      wrapper.prepend(swiperContainer);
    }
  }, 1500);

  const actionContainer: HTMLElement = createActionContainer(style);
  if (screenIsDesktop) {
    wrapper.prepend(actionContainer);
  } else {
    wrapper.append(actionContainer);
  }

  const slider: HTMLElement = createSlider(images.length, style);
  if (!screenIsDesktop) {
    wrapper.append(slider);
  }

  const cursorElement: CursorElement = createCursorElement(style);
  document.body.prepend(cursorElement.cursor);
  document.body.prepend(cursorElement.cursorLabel);

  const resetTimer = () => {
    if (timeout) {
      swiperContainer.remove();
      clearTimeout(timeout);
    }
  };
  //#endregion

  //#region Mouse and Touch
  addMultipleEventListener(container, ['touchmove'], resetTimer);

  addMultipleEventListener(window, ['mousedown', 'touchstart'], (event: Event) => {
    const isTouchEvent: boolean = event.type === 'touchstart';
    containerArea = getElementArea(container);
    const pointerCoords: Coordinates = {
      x: isTouchEvent ? (<TouchEvent>event).touches[0].clientX : (<MouseEvent>event).clientX,
      y: isTouchEvent ? (<TouchEvent>event).touches[0].clientY : (<MouseEvent>event).clientY,
    };
    if (isPointInArea(pointerCoords, containerArea)) {
      lastClickedMousePositionX = isTouchEvent
        ? (<TouchEvent>event).touches[0].pageX
        : (<MouseEvent>event).pageX;
      pointerIsDownInArea = true;
    }
  });

  addMultipleEventListener(window, ['mouseup', 'touchend'], () => {
    if (pointerIsDownInArea) {
      unFocus();
    }
    pointerIsDownInArea = false;
  });

  addMultipleEventListener(window, ['mousemove', 'touchmove'], (event: Event) => {
    if (pointerIsDownInArea) {
      unFocus();
    }
    screenIsDesktop = window.screen.width > 991;
    const isTouchEvent: boolean = event.type === 'touchmove';
    containerArea = getElementArea(container);
    const pointerCoords: Coordinates = {
      x: isTouchEvent ? (<TouchEvent>event).touches[0].clientX : (<MouseEvent>event).clientX,
      y: isTouchEvent ? (<TouchEvent>event).touches[0].clientY : (<MouseEvent>event).clientY,
    };
    const percent = (pointerCoords.x - lastClickedMousePositionX) / minimXMovementToChangeImage;

    if (
      pointerIsDownInArea &&
      Math.abs(percent) >= 0.95 &&
      pointerCoords.x !== lastClickedMousePositionX
    ) {
      images[currentVisibleImage].style.display = 'none';
      let currentSlide = slider.querySelector<HTMLDivElement>(
        `div[ez--product-viewer-360="slide-${currentVisibleImage}"]`
      );
      if (currentSlide) {
        currentSlide.style.opacity = '.3';
      }
      if (percent < 0) {
        currentVisibleImage =
          currentVisibleImage === 0 ? images.length - 1 : currentVisibleImage - 1;
      } else if (percent > 0) {
        currentVisibleImage =
          currentVisibleImage === images.length - 1 ? 0 : currentVisibleImage + 1;
      }
      images[currentVisibleImage].style.display = 'block';
      currentSlide = slider.querySelector<HTMLDivElement>(
        `div[ez--product-viewer-360="slide-${currentVisibleImage}"]`
      );
      if (currentSlide) {
        currentSlide.style.opacity = '.65';
      }
      lastClickedMousePositionX = pointerCoords.x;
    }

    if (!isTouchEvent && screenIsDesktop) {
      if (isPointInArea(pointerCoords, containerArea) || pointerIsDownInArea) {
        document.body.classList.add('cursor-hidden');
        cursorElement.cursor.style.display = 'block';
        cursorElement.cursorLabel.style.display = 'block';
        setCursorPosition(cursorElement.cursor, <MouseEvent>event);
        setCursorPosition(cursorElement.cursorLabel, <MouseEvent>event);
      } else {
        document.body.classList.remove('cursor-hidden');
        cursorElement.cursor.style.display = 'none';
        cursorElement.cursorLabel.style.display = 'none';
      }
    }
  });
  //#endregion

  //#region KEYBORD
  window.addEventListener('keydown', (event) => {
    if (!images[currentVisibleImage]) {
      return;
    }
    let currentSlide = slider.querySelector<HTMLDivElement>(
      `div[ez--product-viewer-360="slide-${currentVisibleImage}"]`
    );

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      images[currentVisibleImage].style.display = 'none';
      if (currentSlide) {
        currentSlide.style.opacity = '.3';
      }
    }

    if (event.key === 'ArrowLeft') {
      currentVisibleImage = currentVisibleImage === 0 ? images.length - 1 : currentVisibleImage - 1;
      images[currentVisibleImage].style.display = 'block';
      currentSlide = slider.querySelector<HTMLDivElement>(
        `div[ez--product-viewer-360="slide-${currentVisibleImage}"]`
      );
      if (currentSlide) {
        currentSlide.style.opacity = '.65';
      }
    } else if (event.key === 'ArrowRight') {
      currentVisibleImage = currentVisibleImage === images.length - 1 ? 0 : currentVisibleImage + 1;
      images[currentVisibleImage].style.display = 'block';
      currentSlide = slider.querySelector<HTMLDivElement>(
        `div[ez--product-viewer-360="slide-${currentVisibleImage}"]`
      );
      if (currentSlide) {
        currentSlide.style.opacity = '.65';
      }
    }
  });
  //#endregion
});
