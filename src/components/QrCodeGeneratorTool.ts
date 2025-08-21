import { getIcon } from '@/utils/icons';
import QRCode from 'qrcode';

export class QrCodeGeneratorTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('generation')}</div><div class="tool-title"><h2>QR Code generator</h2><p>Create QR codes from text or URLs</p></div></div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Input</h3></div>
            <textarea id="text" class="tool-textarea" rows="4" placeholder="https://example.com"></textarea>
            <div class="input-group"><label>Size</label><input id="size" type="number" class="tool-input" value="200" min="100" max="512" /></div>
            <div class="tool-actions"><button id="gen" class="btn btn-primary">${getIcon('generation')} Generate</button></div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Preview</h3></div>
            <div id="preview" style="display:flex;align-items:center;gap:12px"></div>
          </div>
        </div>
      </div>`;
  }

  private bind(): void { this.container.querySelector('#gen')?.addEventListener('click', () => this.generate()); }

  private async generate(): Promise<void> {
    const text = (this.container.querySelector('#text') as HTMLTextAreaElement).value.trim();
    const size = Math.max(100, Math.min(512, parseInt((this.container.querySelector('#size') as HTMLInputElement).value || '200', 10)));
    const preview = this.container.querySelector('#preview') as HTMLElement;
    if (!text) { preview.innerHTML = '<p>Enter text to generate QR.</p>'; return; }
    try {
      const dataUrl = await QRCode.toDataURL(text, { width: size, margin: 1, errorCorrectionLevel: 'M' });
      const img = new Image(); img.width = size; img.height = size; img.src = dataUrl; img.alt = 'QR code';
      preview.innerHTML = ''; preview.appendChild(img);
    } catch (e) {
      preview.innerHTML = `<p class="output-error">Failed to generate QR: ${(e as Error).message}</p>`;
    }
  }
}


