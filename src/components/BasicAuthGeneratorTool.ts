import { getIcon } from '@/utils/icons';

export class BasicAuthGeneratorTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('generation')}</div><div class="tool-title"><h2>Basic auth generator</h2><p>Create Authorization header values</p></div></div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Credentials</h3></div>
            <div class="input-group">
              <label>Username</label><input id="u" class="tool-input" />
              <label>Password</label><input id="p" type="password" class="tool-input" />
            </div>
            <div class="tool-actions"><button id="gen" class="btn btn-primary">${getIcon('generation')} Generate</button><button id="copy" class="btn btn-secondary">${getIcon('copy')} Copy</button></div>
            <textarea id="out" class="tool-textarea" rows="3" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    this.container.querySelector('#gen')?.addEventListener('click', () => this.generate());
    this.container.querySelector('#copy')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText((this.container.querySelector('#out') as HTMLTextAreaElement).value); } catch {} });
  }

  private generate(): void {
    const u = (this.container.querySelector('#u') as HTMLInputElement).value;
    const p = (this.container.querySelector('#p') as HTMLInputElement).value;
    const header = 'Basic ' + btoa(`${u}:${p}`);
    (this.container.querySelector('#out') as HTMLTextAreaElement).value = header;
  }
}


