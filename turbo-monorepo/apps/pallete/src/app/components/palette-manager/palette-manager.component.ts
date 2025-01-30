import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorService } from '../../services/color.service';
import { Palette } from '../../models/color.model';

@Component({
  selector: 'app-palette-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="palette-manager">
      <div class="palette-controls">
        <input type="text" 
               [(ngModel)]="newPaletteName" 
               placeholder="New Palette Name"
               (keyup.enter)="createPalette()">
        <button (click)="createPalette()">Create Palette</button>
      </div>

      <div *ngIf="selectedPalette$ | async as selectedPalette" class="color-input">
        <input type="text" 
               [(ngModel)]="hexColor" 
               placeholder="Enter HEX color (e.g., #FF0000)"
               pattern="^#([A-Fa-f0-9]{6})$"
               #hexInput="ngModel">
        <button (click)="addColorToPalette(selectedPalette.id)" 
                [disabled]="!hexInput.valid">
          Add Color
        </button>
        <div *ngIf="hexInput.invalid && hexInput.touched" class="error">
          Please enter a valid HEX color (e.g., #FF0000)
        </div>
      </div>

      <div class="palettes-list">
        <div *ngFor="let palette of palettes$ | async" 
             class="palette-item"
             [class.selected]="(selectedPalette$ | async)?.id === palette.id"
             (click)="selectPalette(palette.id)">
          <h3>{{palette.name}}</h3>
          <div class="color-swatches">
            <div *ngFor="let color of palette.colors" 
                 class="color-swatch"
                 [style.backgroundColor]="colorService.rgbToHex(color.rgb)"
                 [attr.title]="colorService.rgbToHex(color.rgb)">
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .palette-manager {
      padding: 20px;
    }

    .palette-controls {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
    }

    .color-input {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
      align-items: start;
      flex-wrap: wrap;
    }

    .error {
      width: 100%;
      color: #dc3545;
      font-size: 0.875em;
      margin-top: 5px;
    }

    .palette-controls input,
    .color-input input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-family: monospace;
    }

    .color-input input.ng-invalid.ng-touched {
      border-color: #dc3545;
    }

    button {
      padding: 8px 16px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .palettes-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .palette-item {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 15px;
      cursor: pointer;
    }

    .palette-item.selected {
      border-color: #4CAF50;
      background: rgba(76, 175, 80, 0.1);
    }

    .color-swatches {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
      margin-top: 10px;
    }

    .color-swatch {
      width: 30px;
      height: 30px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  `]
})
export class PaletteManagerComponent {
  palettes$ = this.colorService.getPalettes();
  selectedPalette$ = this.colorService.getSelectedPalette();
  newPaletteName = '';
  hexColor = '';

  constructor(public colorService: ColorService) {}

  createPalette() {
    if (this.newPaletteName.trim()) {
      this.colorService.createPalette(this.newPaletteName);
      this.newPaletteName = '';
    }
  }

  selectPalette(id: string) {
    this.colorService.selectPalette(id);
  }

  addColorToPalette(paletteId: string) {
    if (this.hexColor && /^#([A-Fa-f0-9]{6})$/.test(this.hexColor)) {
      const rgb = this.colorService.hexToRgb(this.hexColor);
      const hsl = this.colorService.rgbToHsl(rgb);
      
      const colorPoint = {
        id: crypto.randomUUID(),
        hex: this.hexColor,
        rgb,
        hsl,
        x: (hsl.h / 360) * this.colorService.chartWidth,
        y: (1 - hsl.l / 100) * this.colorService.chartHeight
      };

      this.colorService.addColorToPalette(paletteId, colorPoint);
      this.hexColor = '';
    }
  }
}