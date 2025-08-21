import { getIcon } from '@/utils/icons';

export class ColorConverterTool {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.bind();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('conversion')}</div>
          <div class="tool-title">
            <h2>Color converter</h2>
            <p>Convert between HEX, RGB, and HSL</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Input</h3></div>
            <textarea id="color-input" class="tool-textarea" rows="3" placeholder="#3498db or rgb(52,152,219) or hsl(204,70%,53%)"></textarea>
          </div>
          <div class="tool-actions-center">
            <button id="convert" class="btn btn-primary">${getIcon('conversion')} Convert</button>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Output</h3></div>
            <div id="swatch" style="width:48px;height:48px;border-radius:8px;border:1px solid #e5e7eb"></div>
            <textarea id="color-output" class="tool-textarea" rows="4" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    const input = this.container.querySelector('#color-input') as HTMLTextAreaElement;
    const output = this.container.querySelector('#color-output') as HTMLTextAreaElement;
    const swatch = this.container.querySelector('#swatch') as HTMLDivElement;
    this.container.querySelector('#convert')?.addEventListener('click', () => {
      try {
        const { r, g, b } = this.parseColor(input.value.trim());
        const hex = this.rgbToHex(r, g, b);
        const hsl = this.rgbToHsl(r, g, b);
        swatch.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        output.value = `HEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        this.success('Converted');
      } catch {
        this.error('Unsupported color format');
      }
    });
  }

  private parseColor(text: string): { r: number; g: number; b: number } {
    // HEX
    const hex = text.replace(/^#/, '');
    if (/^[0-9a-f]{3}$/i.test(hex)) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return { r, g, b };
    }
    if (/^[0-9a-f]{6}$/i.test(hex)) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b };
    }
    // RGB
    const mRgb = text.match(/^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
    if (mRgb) {
      return { r: +mRgb[1], g: +mRgb[2], b: +mRgb[3] };
    }
    // HSL
    const mHsl = text.match(/^hsl\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i);
    if (mHsl) {
      return this.hslToRgb(+mHsl[1], +mHsl[2], +mHsl[3]);
    }
    throw new Error('bad');
  }

  private rgbToHex(r: number, g: number, b: number): string {
    const to = (n: number) => n.toString(16).padStart(2, '0');
    return `#${to(r)}${to(g)}${to(b)}`.toLowerCase();
    }

  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0; const l = (max + min) / 2;
    const d = max - min;
    if (d !== 0) {
      s = d / (1 - Math.abs(2 * l - 1));
      switch (max) {
        case r: h = 60 * (((g - b) / d) % 6); break;
        case g: h = 60 * ((b - r) / d + 2); break;
        case b: h = 60 * ((r - g) / d + 4); break;
      }
    }
    if (h < 0) h += 360;
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  private hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    s /= 100; l /= 100; const c = (1 - Math.abs(2 * l - 1)) * s; const x = c * (1 - Math.abs((h / 60) % 2 - 1)); const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
  }

  private success(m: string) { this.notify(m, 'success'); }
  private error(m: string) { this.notify(m, 'error'); }
  private notify(message: string, type: 'success'|'error') {
    const existing = this.container.querySelector('.notification');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = `notification notification-${type}`;
    el.innerHTML = `<div class="notification-content"><span class="notification-icon">${type === 'success' ? getIcon('check') : getIcon('alert')}</span><span class="notification-message">${message}</span></div>`;
    this.container.insertBefore(el, this.container.firstChild);
    setTimeout(() => el.remove(), 3000);
  }

  public destroy(): void {}
}

