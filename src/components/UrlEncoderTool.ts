import { getIcon } from '@/utils/icons';

export class UrlEncoderTool {
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
            <h2>Encode/decode URL-form data</h2>
            <p>Percent-encode or decode text for URLs and query strings</p>
          </div>
        </div>

        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header">
              <h3>Input</h3>
              <div class="tool-actions">
                <label class="checkbox">
                  <input type="checkbox" id="use-encodeURIComponent" checked />
                  Use encodeURIComponent
                </label>
                <label class="checkbox">
                  <input type="checkbox" id="space-plus" />
                  Treat space as +
                </label>
                <button id="clear-input" class="btn btn-secondary">${getIcon('trash')} Clear</button>
                <button id="paste-input" class="btn btn-secondary">${getIcon('clipboard')} Paste</button>
              </div>
            </div>
            <textarea id="url-input" class="tool-textarea" rows="6" placeholder="Enter text or URL-encoded string..."></textarea>
          </div>

          <div class="tool-actions-center">
            <button id="encode-btn" class="btn btn-primary">${getIcon('lock')} Encode</button>
            <button id="decode-btn" class="btn btn-primary">${getIcon('unlock')} Decode</button>
          </div>

          <div class="tool-section">
            <div class="section-header">
              <h3>Output</h3>
              <div class="tool-actions">
                <button id="copy-output" class="btn btn-secondary">${getIcon('copy')} Copy</button>
                <button id="clear-output" class="btn btn-secondary">${getIcon('trash')} Clear</button>
              </div>
            </div>
            <textarea id="url-output" class="tool-textarea" rows="6" readonly placeholder="Result will appear here..."></textarea>
          </div>
        </div>
      </div>
    `;
  }

  private bind(): void {
    const input = this.container.querySelector('#url-input') as HTMLTextAreaElement;
    const output = this.container.querySelector('#url-output') as HTMLTextAreaElement;
    const encodeBtn = this.container.querySelector('#encode-btn') as HTMLButtonElement;
    const decodeBtn = this.container.querySelector('#decode-btn') as HTMLButtonElement;
    const clearInput = this.container.querySelector('#clear-input') as HTMLButtonElement;
    const clearOutput = this.container.querySelector('#clear-output') as HTMLButtonElement;
    const copyOutput = this.container.querySelector('#copy-output') as HTMLButtonElement;
    const pasteInput = this.container.querySelector('#paste-input') as HTMLButtonElement;
    const useEncodeURIComponent = this.container.querySelector('#use-encodeURIComponent') as HTMLInputElement;
    const spaceAsPlus = this.container.querySelector('#space-plus') as HTMLInputElement;

    encodeBtn.addEventListener('click', () => {
      const text = input.value;
      try {
        const encoded = useEncodeURIComponent.checked ? encodeURIComponent(text) : encodeURI(text);
        output.value = spaceAsPlus.checked ? encoded.replace(/%20/g, '+') : encoded;
        this.success('Encoded successfully');
      } catch (e) {
        this.error('Failed to encode');
      }
    });

    decodeBtn.addEventListener('click', () => {
      let text = input.value;
      try {
        if (spaceAsPlus.checked) {
          text = text.replace(/\+/g, '%20');
        }
        const decoded = decodeURIComponent(text);
        output.value = decoded;
        this.success('Decoded successfully');
      } catch (e) {
        try {
          // Fallback attempt
          output.value = decodeURI(text);
          this.success('Decoded with decodeURI');
        } catch {
          this.error('Invalid percent-encoding');
        }
      }
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

