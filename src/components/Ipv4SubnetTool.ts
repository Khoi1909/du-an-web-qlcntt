import { getIcon } from '@/utils/icons';

function ipToInt(ip: string): number | null {
  const parts = ip.trim().split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => Number.isNaN(p) || p < 0 || p > 255)) return null;
  return ((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}

function intToIp(n: number): string {
  return [n >>> 24 & 255, n >>> 16 & 255, n >>> 8 & 255, n & 255].join('.');
}

export class Ipv4SubnetTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('network')}</div>
          <div class="tool-title">
            <h2>IPv4 subnet calculator</h2>
            <p>Compute network, broadcast, usable range and host count</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Input (CIDR)</h3></div>
            <div class="input-group">
              <input id="ip" class="tool-input" placeholder="192.168.1.10" style="max-width:220px" />
              <span style="align-self:center">/</span>
              <input id="mask" class="tool-input" type="number" value="24" min="0" max="32" style="max-width:100px" />
              <button id="calc" class="btn btn-primary">${getIcon('conversion')} Calculate</button>
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
    const run = () => this.calculate();
    this.container.querySelector('#calc')?.addEventListener('click', run);
    (this.container.querySelector('#ip') as HTMLInputElement).addEventListener('input', run);
    (this.container.querySelector('#mask') as HTMLInputElement).addEventListener('input', run);
    this.calculate();
  }

  private calculate(): void {
    const ipStr = (this.container.querySelector('#ip') as HTMLInputElement).value || '192.168.1.10';
    const maskLen = parseInt((this.container.querySelector('#mask') as HTMLInputElement).value || '24', 10);
    const hostIp = ipToInt(ipStr);
    const sum = this.container.querySelector('#sum') as HTMLElement;
    if (hostIp === null || maskLen < 0 || maskLen > 32) { sum.innerHTML = '<div class="validation-message validation-error">Invalid input</div>'; return; }
    const mask = maskLen === 0 ? 0 : (0xFFFFFFFF << (32 - maskLen)) >>> 0;
    const network = (hostIp & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const totalHosts = maskLen === 32 ? 1 : (maskLen === 31 ? 2 : Math.max(0, (broadcast - network - 1)));
    const firstUsable = maskLen >= 31 ? network : (network + 1) >>> 0;
    const lastUsable = maskLen >= 31 ? broadcast : (broadcast - 1) >>> 0;
    sum.innerHTML = `
      <div class="summary-item"><span class="summary-label">Network:</span> <span class="summary-value">${intToIp(network)}</span></div>
      <div class="summary-item"><span class="summary-label">Broadcast:</span> <span class="summary-value">${intToIp(broadcast)}</span></div>
      <div class="summary-item"><span class="summary-label">First usable:</span> <span class="summary-value">${intToIp(firstUsable)}</span></div>
      <div class="summary-item"><span class="summary-label">Last usable:</span> <span class="summary-value">${intToIp(lastUsable)}</span></div>
      <div class="summary-item"><span class="summary-label">Hosts:</span> <span class="summary-value">${totalHosts}</span></div>
      <div class="summary-item"><span class="summary-label">Subnet mask:</span> <span class="summary-value">${intToIp(mask)}</span></div>
    `;
  }
}


