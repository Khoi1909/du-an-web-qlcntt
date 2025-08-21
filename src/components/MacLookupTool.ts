import { getIcon } from '@/utils/icons';

function normalize(mac: string): string | null {
  const hex = mac.replace(/[^0-9a-fA-F]/g, '').toLowerCase();
  if (hex.length !== 12) return null;
  return hex.match(/.{2}/g)!.join(':');
}

export class MacLookupTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('network')}</div>
          <div class="tool-title">
            <h2>MAC address lookup</h2>
            <p>Normalize and inspect basic flags (no vendor database)</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Input</h3></div>
            <input id="mac" class="tool-input" placeholder="00:1A:2B:3C:4D:5E or 001A.2B3C.4D5E" />
            <div class="tool-actions" style="margin-top:8px"><button id="check" class="btn btn-primary">${getIcon('conversion')} Check</button></div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Result</h3></div>
            <div id="sum" class="results-summary"></div>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    this.container.querySelector('#check')?.addEventListener('click', () => this.check());
  }

  private check(): void {
    const inp = (this.container.querySelector('#mac') as HTMLInputElement).value;
    const sum = this.container.querySelector('#sum') as HTMLElement;
    const norm = normalize(inp);
    if (!norm) { sum.innerHTML = '<div class="validation-message validation-error">Invalid MAC</div>'; return; }
    const firstByte = parseInt(norm.slice(0,2), 16);
    const isMulticast = (firstByte & 1) === 1;
    const isLocallyAdmin = (firstByte & 2) === 2;
    const oui = norm.split(':').slice(0,3).join('');
    sum.innerHTML = `
      <div class="summary-item"><span class="summary-label">Normalized:</span> <span class="summary-value">${norm}</span></div>
      <div class="summary-item"><span class="summary-label">OUI:</span> <span class="summary-value">${oui.toUpperCase()}</span></div>
      <div class="summary-item"><span class="summary-label">Type:</span> <span class="summary-value">${isMulticast ? 'Multicast' : 'Unicast'}</span></div>
      <div class="summary-item"><span class="summary-label">Admin:</span> <span class="summary-value">${isLocallyAdmin ? 'Locally administered' : 'Globally unique'}</span></div>
    `;
  }
}


