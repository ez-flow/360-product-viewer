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
