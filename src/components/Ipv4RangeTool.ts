import { getIcon } from '@/utils/icons';

function ipToInt(ip: string): number | null {
  const parts = ip.trim().split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => Number.isNaN(p) || p < 0 || p > 255)) return null;
  return ((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}
function intToIp(n: number): string { return [n>>>24&255,n>>>16&255,n>>>8&255,n&255].join('.'); }

export class Ipv4RangeTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('network')}</div>
          <div class="tool-title">
            <h2>IPv4 range expander</h2>
            <p>Expand a start–end range (capped to 4096 addresses)</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Range</h3></div>
            <div class="input-group">
              <input id="start" class="tool-input" placeholder="Start: 192.168.1.10" />
              <input id="end" class="tool-input" placeholder="End: 192.168.1.200" />
              <button id="expand" class="btn btn-primary">${getIcon('conversion')} Expand</button>
            </div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Addresses</h3></div>
            <textarea id="out" class="tool-textarea" rows="10" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    this.container.querySelector('#expand')?.addEventListener('click', () => this.expand());
  }

  private expand(): void {
    const s = (this.container.querySelector('#start') as HTMLInputElement).value;
    const e = (this.container.querySelector('#end') as HTMLInputElement).value;
    const a = ipToInt(s); const b = ipToInt(e);
    const out = this.container.querySelector('#out') as HTMLTextAreaElement;
    if (a == null || b == null) { out.value = 'Invalid input'; return; }
    const lo = Math.min(a,b), hi = Math.max(a,b);
    const count = hi - lo + 1; if (count > 4096) { out.value = 'Range too large (cap 4096)'; return; }
    const list: string[] = [];
    for (let n = lo; n <= hi; n++) list.push(intToIp(n >>> 0));
    out.value = list.join('\n');
  }
}


