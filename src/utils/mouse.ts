export type Area = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type Coordinates = {
  x: number;
  y: number;
};

export type StyleOptions = {
  borderRadius: string | null;
  color: string | null;
  backgroundColor: string | null;
};

export type CursorElement = {
  cursor: HTMLElement;
  cursorLabel: HTMLElement;
};

/**
 * Create Html Element.
 * @param {String} HTML representing a single element
 * @return {HTMLElement}
 */
const htmlToElement = (html: string): HTMLElement => {
  const template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return <HTMLElement>template.content.firstChild;
};

/**
 * Create Action container element.
 * @param {StyleOptions} options
 * @return {HTMLElement}
 */
export const createActionContainer = (options: StyleOptions | null = null): HTMLElement => {
  const actionContainer: HTMLElement = htmlToElement(
    `
<div class="product-action-container">
  <div>360°</div>
</div>`
  );
  actionContainer.style.zIndex = '2';
  actionContainer.style.opacity = '.65';
  actionContainer.style.color = options?.color ?? '#fff';
  actionContainer.style.backgroundColor = options?.backgroundColor ?? '#000';
  actionContainer.style.borderRadius = options?.borderRadius ?? '0px';
  actionContainer.style.padding = '.5rem 1rem';
  return actionContainer;
};

/**
 * Create cursor element.
 * @param {StyleOptions} options
 * @return {HTMLElement}
 */
export const createCursorElement = (options: StyleOptions | null = null): CursorElement => {
  const cursor: HTMLElement = htmlToElement(
    `
  <div class="product-viewer-cursor" product-viewer-360="cursor">
    <svg width="39" height="17" viewBox="0 0 39 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M39 7.05995C39 10.2566 34.1228 12.9952 26.802 13.9472C26.5767 13.976 26.3764 13.8082 26.3764 13.5899V11.6067C26.3764 11.4269 26.5166 11.2758 26.7019 11.2518C32.4403 10.494 35.3471 9.08633 35.3471 7.06715C35.3471 4.30456 28.5897 2.22062 19.6264 2.22062C10.6632 2.22062 3.90325 4.30216 3.90325 7.06475C3.90325 9.55156 9.04834 10.7362 13.3647 11.2902L13.933 11.3621V8.69544C13.933 8.40288 14.276 8.23261 14.5264 8.40288L20.3575 12.3741C20.5678 12.518 20.5678 12.8153 20.3575 12.9592L14.5264 16.9329C14.2786 17.1031 13.933 16.9329 13.933 16.6403V14.0671L13.4899 14.0144C5.54818 13.1007 0 10.2398 0 7.05995C0 5.21823 2.01297 3.46523 5.66836 2.1247C9.39635 0.752998 14.3537 0 19.6264 0C30.49 0 39 3.10072 39 7.05995Z" fill="white"></path>
    </svg>
  </div>`
  );
  const cursorLabel: HTMLElement = htmlToElement(
    `
  <div class="product-viewer-cursor-label" product-viewer-360="cursor-label">
    <p>
      <span>Drag or use arrows ← → to rotate</span>
    </p>
  </div>`
  );
  const cursorElement: CursorElement = { cursor, cursorLabel };
  const cursorStyleSheet: HTMLStyleElement = document.createElement('style');
  cursorStyleSheet.type = 'text/css';
  const cursorStyle: string = `body.cursor-hidden {
   cursor: none;
}

div.product-viewer-cursor[product-viewer-360="cursor"] {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  height: 17px;
  margin-left: -20px;
  margin-top: -8px;
  mix-blend-mode: difference;
  transform: translate(0);
  width: 39px;
  will-change: transform;
  opacity: 1;
  z-index: 2;
}

div.product-viewer-cursor-label[product-viewer-360="cursor-label"] {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: -42px;
  transform: translate(0);
  will-change: opacity, transform;
  opacity: 1;
  z-index: 4;
}

div.product-viewer-cursor-label[product-viewer-360="cursor-label"] p {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 27px;
  padding: 0 8px;
  transform: translateX(-50%);
  white-space: nowrap;
  line-height: 1;
  font-size: 14px;
  text-align: center;
  font-weight: 400;
  margin: 0;
  color: ${options?.color ?? '#fff'};
  opacity: 0.65;
}

div.product-viewer-cursor-label[product-viewer-360="cursor-label"] p::before {
  animation: pbRowProductHeaderCursorLabel 1s
    cubic-bezier(0.645, 0.045, 0.355, 1) infinite alternate both;
  background-color: ${options?.backgroundColor ?? '#000'} !important;
  bottom: -2px;
  content: "";
  left: -4px;
  position: absolute;
  right: -4px;
  top: -2px;
  border-radius: ${options?.borderRadius ?? '0px'};
}

div.product-viewer-cursor-label[product-viewer-360="cursor-label"] p span {
  position: relative;
}

@media (hover: hover) {
  @keyframes pbRowProductHeaderCursorLabel {
    0% {
      -webkit-clip-path: inset(0 0 round ${options?.borderRadius ?? '0px'});
      clip-path: inset(0 0 round ${options?.borderRadius ?? '0px'});
    }

    to {
      -webkit-clip-path: inset(2px 4px round ${options?.borderRadius ?? '0px'});
      clip-path: inset(2px 4px round ${options?.borderRadius ?? '0px'});
    }
  }
}`;
  cursorStyleSheet.innerHTML = cursorStyle;
  document.getElementsByTagName('head')[0].appendChild(cursorStyleSheet);
  return cursorElement;
};

/**
 * Get element area.
 * @param {HTMLElement} element
 * @return {Area}
 */
export const getElementArea = (element: HTMLElement): Area => {
  const elementBound = element.getBoundingClientRect();
  return {
    x1: elementBound.left,
    y1: elementBound.top,
    x2: elementBound.right,
    y2: elementBound.bottom,
  };
};

/**
 * Set position of the 360 cursor element
 * @param {HTMLElement} cursorElement
 * @param {MouseEvent} event
 */
export const setCursorPosition = (cursorElement: HTMLElement, event: MouseEvent) => {
  const mouseX = event.pageX;
  const mouseY = event.pageY;
  cursorElement.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
};

/**
 * Remove Selection.
 */
export const unFocus = () => {
  const selection = document.getSelection();
  if (selection) {
    selection.empty();
  } else {
    window.getSelection()?.removeAllRanges();
  }
};

/**
 * Check if point is in area. Returns true if correct.
 * @param {Coordinates} point
 * @param {Area} area
 * @return {boolean}
 */
export const isPointInArea = (point: Coordinates, area: Area): boolean => {
  if (point.x >= area.x1 && point.x <= area.x2) {
    if (point.y >= area.y1 && point.y <= area.y2) {
      return true;
    }
  }
  return false;
};
