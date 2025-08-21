import { getIcon } from '@/utils/icons';

function randomBytes(length: number): Uint8Array { const arr = new Uint8Array(length); crypto.getRandomValues(arr); return arr; }
function toHex(bytes: Uint8Array): string { return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(''); }
function toBase64(bytes: Uint8Array): string { return btoa(String.fromCharCode(...bytes)); }

export class TokenGeneratorTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); this.generate(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('generation')}</div><div class="tool-title"><h2>Token generator</h2><p>Secure random tokens</p></div></div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Settings</h3></div>
            <div class="input-group">
              <label>Length (bytes)</label>
              <input id="len" type="number" min="8" max="128" value="32" class="tool-input" />
              <label>Encoding</label>
              <select id="enc" class="tool-input">
                <option value="hex">HEX</option>
                <option value="base64">Base64</option>
              </select>
            </div>
            <div class="tool-actions"><button id="gen" class="btn btn-primary">${getIcon('generation')} Generate</button><button id="copy" class="btn btn-secondary">${getIcon('copy')} Copy</button></div>
            <textarea id="out" class="tool-textarea" rows="4" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    this.container.querySelector('#gen')?.addEventListener('click', () => this.generate());
    this.container.querySelector('#copy')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText((this.container.querySelector('#out') as HTMLTextAreaElement).value); } catch {} });
  }

  private generate(): void {
    const len = Math.max(8, Math.min(128, parseInt((this.container.querySelector('#len') as HTMLInputElement).value || '32', 10)));
    const enc = (this.container.querySelector('#enc') as HTMLSelectElement).value;
    const bytes = randomBytes(len);
    (this.container.querySelector('#out') as HTMLTextAreaElement).value = enc === 'hex' ? toHex(bytes) : toBase64(bytes);
  }
}


