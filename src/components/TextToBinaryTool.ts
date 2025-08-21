import { getIcon } from '@/utils/icons';

export class TextToBinaryTool {
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
          <div class="tool-icon">${getIcon('conversion')}</div>
          <div class="tool-title">
            <h2>Text to ASCII binary</h2>
            <p>Encode/decode text using 8-bit ASCII binary</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header">
              <h3>Input</h3>
              <div class="tool-actions">
                <label class="checkbox"><input type="checkbox" id="use-spaces" checked> Use spaces between bytes</label>
              </div>
            </div>
            <textarea id="txt-input" rows="5" class="tool-textarea" placeholder="Enter text or binary like 01001000 01101001"></textarea>
          </div>
          <div class="tool-actions-center">
            <button id="encode" class="btn btn-primary">${getIcon('lock')} Encode</button>
            <button id="decode" class="btn btn-primary">${getIcon('unlock')} Decode</button>
          </div>
          <div class="tool-section">
            <div class="section-header">
              <h3>Output</h3>
              <div class="tool-actions">
                <button id="copy" class="btn btn-secondary">${getIcon('copy')} Copy</button>
              </div>
            </div>
            <textarea id="txt-output" rows="5" class="tool-textarea" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    const input = this.container.querySelector('#txt-input') as HTMLTextAreaElement;
    const output = this.container.querySelector('#txt-output') as HTMLTextAreaElement;
    const encode = this.container.querySelector('#encode') as HTMLButtonElement;
    const decode = this.container.querySelector('#decode') as HTMLButtonElement;
    const copy = this.container.querySelector('#copy') as HTMLButtonElement;
    const useSpaces = this.container.querySelector('#use-spaces') as HTMLInputElement;

    encode.addEventListener('click', () => {
      const res = Array.from(input.value).map(c => c.charCodeAt(0).toString(2).padStart(8, '0'));
      output.value = useSpaces.checked ? res.join(' ') : res.join('');
      this.success('Encoded');
    });
    decode.addEventListener('click', () => {
      try {
        const bits = input.value.replace(/\s+/g, '');
        if (bits.length % 8 !== 0) throw new Error('Length not multiple of 8');
        let out = '';
        for (let i = 0; i < bits.length; i += 8) {
          out += String.fromCharCode(parseInt(bits.slice(i, i + 8), 2));
        }
        output.value = out;
        this.success('Decoded');
      } catch {
        this.error('Invalid binary text');
      }
    });
    copy.addEventListener('click', async () => {
      if (!output.value) { this.error('No output'); return; }
      try { await navigator.clipboard.writeText(output.value); this.success('Copied'); } catch { this.error('Copy failed'); }
    });
  }

  private success(m: string) { this.notify(m, 'success'); }
  private error(m: string) { this.notify(m, 'error'); }
  private notify(message: string, type: 'success'|'error') {
    const existing = this.container.querySelector('.notification');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = `notification notification-${type}`;
    el.innerHTML = `<div class="notification-content"><span class="notification-icon">${type === 'success' ? getIcon('check') : getIcon('alert')}</span><span class="notification-message">${message}</span></div>`;
    this.container.insertBefore(el, this.container.firstChild);
    setTimeout(() => el.remove(), 3000);
  }

  public destroy(): void {}
}

