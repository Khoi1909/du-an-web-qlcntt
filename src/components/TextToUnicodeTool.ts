import { getIcon } from '@/utils/icons';

export class TextToUnicodeTool {
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
            <h2>Text to Unicode</h2>
            <p>Encode text to code points and decode back</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header">
              <h3>Input</h3>
              <div class="tool-actions">
                <label class="checkbox"><input id="format-hex" type="radio" name="fmt" checked> Hex (U+0041)</label>
                <label class="checkbox"><input id="format-dec" type="radio" name="fmt"> Decimal</label>
                <label class="checkbox"><input id="use-prefix" type="checkbox" checked> Use U+ / 0x prefix</label>
              </div>
            </div>
            <textarea id="uni-input" class="tool-textarea" rows="5" placeholder="Enter text, or code points like U+0041 U+1F600 or 0x41 0x1F600 or 65 128512"></textarea>
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
            <textarea id="uni-output" class="tool-textarea" rows="5" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    const input = this.container.querySelector('#uni-input') as HTMLTextAreaElement;
    const output = this.container.querySelector('#uni-output') as HTMLTextAreaElement;
    const encode = this.container.querySelector('#encode') as HTMLButtonElement;
    const decode = this.container.querySelector('#decode') as HTMLButtonElement;
    const copy = this.container.querySelector('#copy') as HTMLButtonElement;
    const fmtHex = this.container.querySelector('#format-hex') as HTMLInputElement;
    const usePrefix = this.container.querySelector('#use-prefix') as HTMLInputElement;

    encode.addEventListener('click', () => {
      const cps = Array.from(input.value);
      const parts = cps.map(ch => ch.codePointAt(0) as number);
      if (fmtHex.checked) {
        output.value = parts.map(cp => (usePrefix.checked ? 'U+' : '') + cp.toString(16).toUpperCase().padStart(4, '0')).join(' ');
      } else {
        output.value = parts.map(cp => (usePrefix.checked ? '' : '') + cp.toString(10)).join(' ');
      }
      this.success('Encoded');
    });

    decode.addEventListener('click', () => {
      try {
        const tokens = input.value.trim().split(/\s+/);
        let text = '';
        for (const t of tokens) {
          if (!t) continue;
          let cp: number;
          if (/^(U\+|0x)/i.test(t)) {
            cp = parseInt(t.replace(/^(U\+|0x)/i, ''), 16);
          } else if (/^[0-9a-f]+$/i.test(t)) {
            // assume hex without prefix
            cp = parseInt(t, 16);
          } else {
            cp = parseInt(t, 10);
          }
          if (Number.isNaN(cp)) throw new Error('bad');
          text += String.fromCodePoint(cp);
        }
        output.value = text;
        this.success('Decoded');
      } catch {
        this.error('Invalid code point list');
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

