import { htmlToElement } from './helper';
import type { StyleOptions } from './types';

/**
 * Create Action container element.
 * @param {StyleOptions} options
 * @return {HTMLElement}
 */
export const createActionContainer = (options: StyleOptions | null = null): HTMLElement => {
  const screenIsDesktop: boolean = window.screen.width > 991;

  const container: HTMLElement = htmlToElement(`<div class="product-action-container"></div>`);
  container.style.zIndex = '2';
  container.style.width = '100%';
  container.style.display = 'flex';
  container.style.gap = '10px';
  container.style.justifyContent = screenIsDesktop ? 'flex-start' : 'space-between';

  const infoElement: HTMLElement = htmlToElement(`<div class="360-info"><div>360°</div></div>`);
  infoElement.style.opacity = '.65';
  infoElement.style.color = options?.color ?? '#fff';
  infoElement.style.backgroundColor = options?.backgroundColor ?? '#000';
  infoElement.style.borderRadius = options?.borderRadius ?? '0px';
  infoElement.style.padding = screenIsDesktop ? '.5rem 1rem' : '.25rem .65rem';
  infoElement.style.margin = '0 10px';
  infoElement.style.fontSize = screenIsDesktop ? '1rem' : '0.8rem';
  container.append(infoElement);

  return container;
};

/**
 * Create Slider point container element.
 * @param {number} length
 * @param {StyleOptions} options
 * @return {HTMLElement}
 */
export const createSlider = (length: number, options: StyleOptions | null = null): HTMLElement => {
  const container: HTMLElement = htmlToElement(`<div class="product-slider"></div>`);
  container.style.zIndex = '2';
  container.style.width = '100%';
  container.style.display = 'flex';
  container.style.gap = '4px';
  container.style.justifyContent = 'center';
  container.style.margin = '10px 0px';

  for (let i = 0; i < length; i++) {
    const slide: HTMLElement = htmlToElement(
      `<div class="product-slide" ez--product-viewer-360="slide-${i}"></div>`
    );
    slide.style.width = '6px';
    slide.style.height = '6px';
    slide.style.backgroundColor = options?.backgroundColor ?? '#000';
    slide.style.borderRadius = '50%';
    slide.style.opacity = i === 0 ? '.65' : '.3';
    container.append(slide);
  }
  return container;
};
