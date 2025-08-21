import { getIcon } from '@/utils/icons';

function toHex2(n: number): string { return n.toString(16).padStart(2, '0'); }

export class MacGeneratorTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('network')}</div>
          <div class="tool-title">
            <h2>MAC address generator</h2>
            <p>Generate unicast/multicast and locally-administered addresses</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Options</h3></div>
            <label class="checkbox"><input id="loc" type="checkbox"> Locally administered</label>
            <label class="checkbox"><input id="multi" type="checkbox"> Multicast</label>
            <div class="tool-actions" style="margin-top:8px"><button id="gen" class="btn btn-primary">${getIcon('generation')} Generate</button></div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Result</h3></div>
            <input id="out" class="tool-input" readonly />
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    this.container.querySelector('#gen')?.addEventListener('click', () => this.generate());
  }

  private generate(): void {
    const isLoc = (this.container.querySelector('#loc') as HTMLInputElement).checked;
    const isMulti = (this.container.querySelector('#multi') as HTMLInputElement).checked;
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    let first = bytes[0];
    first = isLoc ? (first | 0x02) : (first & ~0x02);
    first = isMulti ? (first | 0x01) : (first & ~0x01);
    bytes[0] = first;
    const mac = Array.from(bytes).map(toHex2).join(':');
    (this.container.querySelector('#out') as HTMLInputElement).value = mac;
  }
}


