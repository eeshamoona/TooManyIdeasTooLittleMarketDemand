export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface ColorPoint {
  id: string;
  hex: string;
  rgb: RGB;
  hsl: HSL;
  x: number;
  y: number;
}

export interface Palette {
  id: string;
  name: string;
  colors: ColorPoint[];
  createdAt: Date;
  updatedAt: Date;
}