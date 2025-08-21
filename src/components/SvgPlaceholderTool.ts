import { getIcon } from '@/utils/icons';

function buildSvg(w: number, h: number, bg: string, fg: string, text: string): string {
  const fontSize = Math.max(10, Math.min(w, h) / 6);
  const escaped = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" fill="${fg}">${escaped}</text></svg>`;
}

export class SvgPlaceholderTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); this.update(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('generation')}</div><div class="tool-title"><h2>SVG placeholder generator</h2><p>Create on-the-fly SVG placeholders</p></div></div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Options</h3></div>
            <div class="input-group">
              <label>Width</label><input id="w" class="tool-input" type="number" value="600" min="16" max="4096" />
              <label>Height</label><input id="h" class="tool-input" type="number" value="320" min="16" max="4096" />
              <label>Background</label><input id="bg" class="tool-input" value="#e9ecef" />
              <label>Foreground</label><input id="fg" class="tool-input" value="#6c757d" />
              <label>Text</label><input id="text" class="tool-input" value="600 x 320" />
            </div>
            <div class="tool-actions"><button id="refresh" class="btn btn-primary">${getIcon('generation')} Refresh</button><button id="copy" class="btn btn-secondary">${getIcon('copy')} Copy SVG</button></div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Preview</h3></div>
            <div id="preview" style="border:1px dashed var(--border-color);padding:8px"></div>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    this.container.querySelector('#refresh')?.addEventListener('click', () => this.update());
    this.container.querySelector('#copy')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText(this.currentSvg()); } catch {} });
  }

  private currentSvg(): string {
    const w = parseInt((this.container.querySelector('#w') as HTMLInputElement).value, 10);
    const h = parseInt((this.container.querySelector('#h') as HTMLInputElement).value, 10);
    const bg = (this.container.querySelector('#bg') as HTMLInputElement).value;
    const fg = (this.container.querySelector('#fg') as HTMLInputElement).value;
    const text = (this.container.querySelector('#text') as HTMLInputElement).value;
    return buildSvg(w, h, bg, fg, text);
  }

  private update(): void {
    const svg = this.currentSvg();
    const preview = this.container.querySelector('#preview') as HTMLElement;
    preview.innerHTML = `<img alt="SVG placeholder" src="data:image/svg+xml;utf8,${encodeURIComponent(svg)}" />`;
  }
}


