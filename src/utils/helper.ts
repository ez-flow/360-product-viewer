/**
 * Create Html Element.
 * @param {String} HTML representing a single element
 * @return {HTMLElement}
 */
export const htmlToElement = (html: string): HTMLElement => {
  const template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return <HTMLElement>template.content.firstChild;
};

export const addMultipleEventListener = (
  element: Window,
  events: string[],
  eventHandler: EventListenerOrEventListenerObject
) => {
  events.forEach((event: string) => element.addEventListener(event, eventHandler));
};
