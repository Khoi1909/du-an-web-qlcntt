import { getIcon } from '@/utils/icons';

function ipToInt(ip: string): number | null {
  const parts = ip.trim().split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => Number.isNaN(p) || p < 0 || p > 255)) return null;
  return ((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}
function intToIp(n: number): string {
  return [n >>> 24 & 255, n >>> 16 & 255, n >>> 8 & 255, n & 255].join('.');
}

export class Ipv4ConverterTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('network')}</div>
          <div class="tool-title">
            <h2>IPv4 address converter</h2>
            <p>Convert IPv4 between dotted decimal, integer, and binary</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Input</h3></div>
            <input id="input" class="tool-input" placeholder="192.168.1.1 or 3232235777 or 11000000 10101000 00000001 00000001" />
            <div class="tool-actions" style="margin-top:8px">
              <button id="parse" class="btn btn-primary">${getIcon('conversion')} Convert</button>
              <button id="clear" class="btn btn-secondary">${getIcon('trash')} Clear</button>
            </div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Results</h3></div>
            <div class="results-summary" id="sum"></div>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    this.container.querySelector('#parse')?.addEventListener('click', () => this.convert());
    this.container.querySelector('#clear')?.addEventListener('click', () => { (this.container.querySelector('#input') as HTMLInputElement).value=''; (this.container.querySelector('#sum') as HTMLElement).innerHTML=''; });
  }

  private convert(): void {
    const raw = (this.container.querySelector('#input') as HTMLInputElement).value.trim();
    const sum = this.container.querySelector('#sum') as HTMLElement;
    if (!raw) { sum.innerHTML=''; return; }

    let int: number | null = null;
    if (/^\d+\.\d+\.\d+\.\d+$/.test(raw)) int = ipToInt(raw);
    else if (/^\d+$/.test(raw)) int = Number(raw) >>> 0;
    else if (/^[01\s]+$/.test(raw)) {
      const bits = raw.replace(/\s+/g, ''); if (bits.length !== 32) { sum.innerHTML = '<div class="validation-message validation-error">Binary must be 32 bits</div>'; return; }
      int = parseInt(bits, 2) >>> 0;
    }

    if (int == null || Number.isNaN(int)) { sum.innerHTML = '<div class="validation-message validation-error">Invalid input</div>'; return; }
    const ip = intToIp(int);
    const bin = (int >>> 0).toString(2).padStart(32, '0').replace(/(.{8})/g, '$1 ').trim();
    sum.innerHTML = `
      <div class="summary-item"><span class="summary-label">IP:</span> <span class="summary-value">${ip}</span></div>
      <div class="summary-item"><span class="summary-label">Integer:</span> <span class="summary-value">${int >>> 0}</span></div>
      <div class="summary-item"><span class="summary-label">Binary:</span> <span class="summary-value">${bin}</span></div>
    `;
  }
}


