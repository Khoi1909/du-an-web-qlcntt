import { getIcon } from '@/utils/icons';

function randomPort(): number { return Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024; }

export class RandomPortTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); this.generate(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('generation')}</div><div class="tool-title"><h2>Random port generator</h2><p>Generate a random ephemeral TCP port</p></div></div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="tool-actions"><button id="gen" class="btn btn-primary">${getIcon('generation')} Generate</button><button id="copy" class="btn btn-secondary">${getIcon('copy')} Copy</button></div>
            <input id="out" class="tool-input" readonly />
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    this.container.querySelector('#gen')?.addEventListener('click', () => this.generate());
    this.container.querySelector('#copy')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText((this.container.querySelector('#out') as HTMLInputElement).value); } catch {} });
  }

  private generate(): void { (this.container.querySelector('#out') as HTMLInputElement).value = String(randomPort()); }
}


