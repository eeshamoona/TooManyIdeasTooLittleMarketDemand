import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColorPoint, HSL, Palette, RGB } from '../models/color.model';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private palettes = new BehaviorSubject<Palette[]>([]);
  private selectedPalette = new BehaviorSubject<Palette | null>(null);
  
  // Chart dimensions for coordinate calculations
  readonly chartWidth = 600;
  readonly chartHeight = 400;

  constructor() {}

  rgbToHex(rgb: RGB): string {
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  hexToRgb(hex: string): RGB {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      throw new Error('Invalid HEX color format');
    }
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }

  rgbToHsl(rgb: RGB): HSL {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  createPalette(name: string): void {
    const newPalette: Palette = {
      id: crypto.randomUUID(),
      name,
      colors: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const currentPalettes = this.palettes.value;
    this.palettes.next([...currentPalettes, newPalette]);
    
    // Auto-select newly created palette
    this.selectPalette(newPalette.id);
  }

  addColorToPalette(paletteId: string, color: ColorPoint): void {
    const palettes = this.palettes.value;
    const paletteIndex = palettes.findIndex(p => p.id === paletteId);
    
    if (paletteIndex !== -1) {
      const updatedPalette = {
        ...palettes[paletteIndex],
        colors: [...palettes[paletteIndex].colors, color],
        updatedAt: new Date()
      };
      
      palettes[paletteIndex] = updatedPalette;
      this.palettes.next([...palettes]);
    }
  }

  getPalettes(): Observable<Palette[]> {
    return this.palettes.asObservable();
  }

  getSelectedPalette(): Observable<Palette | null> {
    return this.selectedPalette.asObservable();
  }

  selectPalette(paletteId: string): void {
    const palette = this.palettes.value.find(p => p.id === paletteId);
    this.selectedPalette.next(palette || null);
  }

  getComplementaryColor(color: RGB): RGB {
    return {
      r: 255 - color.r,
      g: 255 - color.g,
      b: 255 - color.b
    };
  }
}