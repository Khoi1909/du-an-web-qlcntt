import { getIcon } from '@/utils/icons';

export class HtmlEntitiesTool {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.bind();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('code')}</div>
          <div class="tool-title">
            <h2>Escape HTML entities</h2>
            <p>Escape or unescape characters like <, >, &, ' and "</p>
          </div>
        </div>

        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header">
              <h3>Input</h3>
              <div class="tool-actions">
                <button id="clear-input" class="btn btn-secondary">${getIcon('trash')} Clear</button>
                <button id="paste-input" class="btn btn-secondary">${getIcon('clipboard')} Paste</button>
              </div>
            </div>
            <textarea id="html-input" class="tool-textarea" rows="6" placeholder="Enter raw HTML or escaped text..."></textarea>
          </div>

          <div class="tool-actions-center">
            <button id="escape-btn" class="btn btn-primary">${getIcon('lock')} Escape</button>
            <button id="unescape-btn" class="btn btn-primary">${getIcon('unlock')} Unescape</button>
          </div>

          <div class="tool-section">
            <div class="section-header">
              <h3>Output</h3>
              <div class="tool-actions">
                <button id="copy-output" class="btn btn-secondary">${getIcon('copy')} Copy</button>
                <button id="clear-output" class="btn btn-secondary">${getIcon('trash')} Clear</button>
              </div>
            </div>
            <textarea id="html-output" class="tool-textarea" rows="6" readonly placeholder="Result will appear here..."></textarea>
          </div>
        </div>
      </div>
    `;
  }

  private bind(): void {
    const input = this.container.querySelector('#html-input') as HTMLTextAreaElement;
    const output = this.container.querySelector('#html-output') as HTMLTextAreaElement;
    const escapeBtn = this.container.querySelector('#escape-btn') as HTMLButtonElement;
    const unescapeBtn = this.container.querySelector('#unescape-btn') as HTMLButtonElement;
    const clearInput = this.container.querySelector('#clear-input') as HTMLButtonElement;
    const clearOutput = this.container.querySelector('#clear-output') as HTMLButtonElement;
    const copyOutput = this.container.querySelector('#copy-output') as HTMLButtonElement;
    const pasteInput = this.container.querySelector('#paste-input') as HTMLButtonElement;

    escapeBtn.addEventListener('click', () => {
      const text = input.value;
      const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      output.value = escaped;
      this.success('Escaped successfully');
    });

    unescapeBtn.addEventListener('click', () => {
      const text = input.value;
      const unescaped = text
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, '\'')
        .replace(/&amp;/g, '&');
      output.value = unescaped;
      this.success('Unescaped successfully');
    });

    clearInput.addEventListener('click', () => { input.value = ''; input.focus(); });
    clearOutput.addEventListener('click', () => { output.value = ''; });
    copyOutput.addEventListener('click', async () => {
      if (!output.value) { this.error('No output to copy'); return; }
      try { await navigator.clipboard.writeText(output.value); this.success('Copied'); } catch { this.error('Copy failed'); }
    });
    pasteInput.addEventListener('click', async () => {
      try { input.value = await navigator.clipboard.readText(); this.success('Pasted'); } catch { this.error('Paste failed'); }
    });
  }

  private success(msg: string): void { this.notify(msg, 'success'); }
  private error(msg: string): void { this.notify(msg, 'error'); }
  private notify(message: string, type: 'success'|'error'): void {
    const existing = this.container.querySelector('.notification');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = `notification notification-${type}`;
    el.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'success' ? getIcon('check') : getIcon('alert')}</span>
        <span class="notification-message">${message}</span>
      </div>`;
    this.container.insertBefore(el, this.container.firstChild);
    setTimeout(() => el.remove(), 3000);
  }

  public destroy(): void {}
}

