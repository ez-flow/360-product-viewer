import type { Area, Coordinates, CursorElement, StyleOptions } from '$utils/mouse';
import {
  createActionContainer,
  createCursorElement,
  getElementArea,
  isPointInArea,
  setCursorPosition,
  unFocus,
} from '$utils/mouse';
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
  let currentVisibleImage: number = 0;
  let lastClickedMousePositionX: number = 0;
  let mouseIsDownInArea: boolean = false;
  let containerArea: Area = getElementArea(container);
  const minimXMovementToChangeImage: number =
    Math.round(container.getBoundingClientRect().width / images.length) / 2;
  const style: StyleOptions = {
    borderRadius: wrapper.getAttribute('ez--product-viewer-360-border-radius'),
    color: wrapper.getAttribute('ez--product-viewer-360-color'),
    backgroundColor: wrapper.getAttribute('ez--product-viewer-360-bg-color'),
  };

  //Init image display
  for (let i = 0; i < images.length; i++) {
    images[i].setAttribute('ez--product-viewer-360', `image-${i}`); //not useful as of now
    if (i === currentVisibleImage) {
      images[currentVisibleImage].style.display = 'block';
    } else {
      images[i].style.display = 'none';
    }
  }

  // Add 360 info + cursor
  const actionContainer: HTMLElement = createActionContainer(style);
  wrapper.prepend(actionContainer);

  const cursorElement: CursorElement = createCursorElement(style);
  document.body.prepend(cursorElement.cursor);
  document.body.prepend(cursorElement.cursorLabel);
  //#endregion

  //#region Mouse
  window.addEventListener('mousedown', (event) => {
    containerArea = getElementArea(container);
    const mouseCoords: Coordinates = {
      x: event.clientX,
      y: event.clientY,
    };
    if (isPointInArea(mouseCoords, containerArea)) {
      lastClickedMousePositionX = event.pageX;
      mouseIsDownInArea = true;
    }
  });

  window.addEventListener('mouseup', () => {
    if (mouseIsDownInArea) {
      unFocus();
    }
    mouseIsDownInArea = false;
  });

  window.addEventListener('mousemove', (event: MouseEvent) => {
    if (mouseIsDownInArea) {
      unFocus();
    }
    containerArea = getElementArea(container);
    const mouseCoords = {
      x: event.clientX,
      y: event.clientY,
    };
    const percent = (mouseCoords.x - lastClickedMousePositionX) / minimXMovementToChangeImage;

    if (
      mouseIsDownInArea &&
      Math.abs(percent) >= 0.95 &&
      mouseCoords.x !== lastClickedMousePositionX
    ) {
      images[currentVisibleImage].style.display = 'none';
      if (percent < 0) {
        currentVisibleImage =
          currentVisibleImage === 0 ? images.length - 1 : currentVisibleImage - 1;
      } else if (percent > 0) {
        currentVisibleImage =
          currentVisibleImage === images.length - 1 ? 0 : currentVisibleImage + 1;
      }
      images[currentVisibleImage].style.display = 'block';
      lastClickedMousePositionX = mouseCoords.x;
    }

    if (isPointInArea(mouseCoords, containerArea) || mouseIsDownInArea) {
      document.body.classList.add('cursor-hidden');
      cursorElement.cursor.style.display = 'block';
      cursorElement.cursorLabel.style.display = 'block';
      setCursorPosition(cursorElement.cursor, event);
      setCursorPosition(cursorElement.cursorLabel, event);
    } else {
      document.body.classList.remove('cursor-hidden');
      cursorElement.cursor.style.display = 'none';
      cursorElement.cursorLabel.style.display = 'none';
    }
  });
  //#endregion

  //#region KEYBORD
  window.addEventListener('keydown', (event) => {
    if (!images[currentVisibleImage]) {
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      images[currentVisibleImage].style.display = 'none';
    }
    if (event.key === 'ArrowLeft') {
      currentVisibleImage = currentVisibleImage === 0 ? images.length - 1 : currentVisibleImage - 1;
      images[currentVisibleImage].style.display = 'block';
    } else if (event.key === 'ArrowRight') {
      currentVisibleImage = currentVisibleImage === images.length - 1 ? 0 : currentVisibleImage + 1;
      images[currentVisibleImage].style.display = 'block';
    }
  });
  //#endregion
});
