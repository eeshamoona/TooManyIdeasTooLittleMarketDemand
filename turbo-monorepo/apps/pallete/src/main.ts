import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ColorChartComponent } from './app/components/color-chart/color-chart.component';
import { PaletteManagerComponent } from './app/components/palette-manager/palette-manager.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ColorChartComponent, PaletteManagerComponent],
  template: `
    <div class="app-container">
      <header>
        <h1>Color Palette Manager</h1>
      </header>
      
      <main>
        <div class="color-chart-section">
          <h2>Color Chart</h2>
          <app-color-chart></app-color-chart>
        </div>
        
        <div class="palette-section">
          <h2>Palettes</h2>
          <app-palette-manager></app-palette-manager>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    header {
      margin-bottom: 30px;
      text-align: center;
    }

    main {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
    }

    h1 {
      color: #333;
      font-size: 2.5em;
      margin-bottom: 10px;
    }

    h2 {
      color: #666;
      margin-bottom: 20px;
    }

    .color-chart-section,
    .palette-section {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class App {
  name = 'Color Palette Manager';
}

bootstrapApplication(App);