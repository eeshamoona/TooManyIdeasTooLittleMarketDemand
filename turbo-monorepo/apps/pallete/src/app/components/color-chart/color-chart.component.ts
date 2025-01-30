import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ColorService } from '../../services/color.service';
import { RGB } from '../../models/color.model';

@Component({
  selector: 'app-color-chart',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <div class="color-chart-container">
      <canvas #colorChart
              (mousedown)="onMouseDown($event)"
              (mousemove)="onMouseMove($event)"
              (mouseup)="onMouseUp()"
              [attr.width]="width"
              [attr.height]="height">
      </canvas>
      <div class="color-info" *ngIf="hoveredColor">
        <p>RGB: {{hoveredColor.r}}, {{hoveredColor.g}}, {{hoveredColor.b}}</p>
        <p>HEX: {{colorService.rgbToHex(hoveredColor)}}</p>
        <p>HSL: {{hslColor.h | number:'1.0-0'}}°, 
           {{hslColor.s | number:'1.0-0'}}%, 
           {{hslColor.l | number:'1.0-0'}}%</p>
      </div>
    </div>
  `,
  styles: [`
    .color-chart-container {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 400px;
    }
    
    canvas {
      border: 1px solid #ccc;
      cursor: crosshair;
    }
    
    .color-info {
      position: absolute;
      bottom: 10px;
      left: 10px;
      background: rgba(255, 255, 255, 0.9);
      padding: 10px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class ColorChartComponent implements AfterViewInit {
  @ViewChild('colorChart') canvas!: ElementRef<HTMLCanvasElement>;
  
  width = 600;
  height = 400;
  isDragging = false;
  hoveredColor: RGB | null = null;
  hslColor: { h: number, s: number, l: number } = { h: 0, s: 0, l: 0 };
  
  private ctx!: CanvasRenderingContext2D;
  private scale = 1;
  private offsetX = 0;
  private offsetY = 0;

  constructor(public colorService: ColorService) {}

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.drawColorChart();

    // Subscribe to palette changes to redraw points
    this.colorService.getSelectedPalette().subscribe(palette => {
      this.drawColorChart();
      if (palette) {
        this.drawPalettePoints(palette);
      }
    });
  }

  private drawColorChart() {
    const { width, height } = this.canvas.nativeElement;
    
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const rgb = this.positionToColor(x, y);
        this.ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
        this.ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  private drawPalettePoints(palette: any) {
    palette.colors.forEach((color: any) => {
      this.ctx.beginPath();
      this.ctx.arc(color.x, color.y, 5, 0, Math.PI * 2);
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.fillStyle = color.hex;
      this.ctx.fill();
    });
  }

  private positionToColor(x: number, y: number): RGB {
    const hue = (x / this.width) * 360;
    const saturation = 100;
    const lightness = 100 - (y / this.height) * 100;

    // Convert HSL to RGB
    const h = hue / 360;
    const s = saturation / 100;
    const l = lightness / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.updateColorFromPosition(event);
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.updateColorFromPosition(event);
    }
  }

  onMouseUp() {
    this.isDragging = false;
  }

  private updateColorFromPosition(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.hoveredColor = this.positionToColor(x, y);
    this.hslColor = this.colorService.rgbToHsl(this.hoveredColor);
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    this.scale *= delta;
    this.scale = Math.max(0.5, Math.min(4, this.scale));
    this.drawColorChart();
  }
}