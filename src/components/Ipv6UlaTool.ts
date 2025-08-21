import { getIcon } from '@/utils/icons';

function toHex2(n: number): string { return n.toString(16).padStart(2, '0'); }

export class Ipv6UlaTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('network')}</div>
          <div class="tool-title">
            <h2>IPv6 ULA generator</h2>
            <p>Generate RFC4193 Unique Local Address prefixes (fdXX:...) </p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Generate</h3></div>
            <div class="tool-actions"><button id="gen" class="btn btn-primary">${getIcon('generation')} Generate /48</button></div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Result</h3></div>
            <input id="out" class="tool-input" readonly />
          </div>
        </div>
      </div>`;
  }

  private bind(): void { this.container.querySelector('#gen')?.addEventListener('click', () => this.generate()); this.generate(); }

  private generate(): void {
    const rnd = new Uint8Array(5); // 40-bit Global ID
    crypto.getRandomValues(rnd);
    const gid = Array.from(rnd).map(toHex2).join('');
    const prefix = `fd${gid.slice(0,2)}:${gid.slice(2,6)}:${gid.slice(6,10)}::/48`;
    (this.container.querySelector('#out') as HTMLInputElement).value = prefix;
  }
}


