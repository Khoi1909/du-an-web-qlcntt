import { getIcon } from '@/utils/icons';

export class BaseConverterTool {
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
            <h2>Integer base converter</h2>
            <p>Convert integers between bases 2–36</p>
          </div>
        </div>

        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header">
              <h3>Input</h3>
              <div class="tool-actions">
                <input id="from-base" class="tool-input" type="number" min="2" max="36" value="10" style="width:100px" />
                <span>→</span>
                <input id="to-base" class="tool-input" type="number" min="2" max="36" value="16" style="width:100px" />
                <button id="swap-bases" class="btn btn-secondary">Swap</button>
              </div>
            </div>
            <textarea id="base-input" class="tool-textarea" rows="4" placeholder="Enter integer (prefixes like 0x, 0b allowed)"></textarea>
          </div>

          <div class="tool-actions-center">
            <button id="convert-btn" class="btn btn-primary">${getIcon('conversion')} Convert</button>
          </div>

          <div class="tool-section">
            <div class="section-header">
              <h3>Output</h3>
              <div class="tool-actions">
                <button id="copy-output" class="btn btn-secondary">${getIcon('copy')} Copy</button>
              </div>
            </div>
            <textarea id="base-output" class="tool-textarea" rows="4" readonly></textarea>
          </div>
        </div>
      </div>
    `;
  }

  private bind(): void {
    const fromBase = this.container.querySelector('#from-base') as HTMLInputElement;
    const toBase = this.container.querySelector('#to-base') as HTMLInputElement;
    const input = this.container.querySelector('#base-input') as HTMLTextAreaElement;
    const output = this.container.querySelector('#base-output') as HTMLTextAreaElement;
    const convertBtn = this.container.querySelector('#convert-btn') as HTMLButtonElement;
    const swapBtn = this.container.querySelector('#swap-bases') as HTMLButtonElement;
    const copyOutput = this.container.querySelector('#copy-output') as HTMLButtonElement;

    swapBtn.addEventListener('click', () => {
      const a = fromBase.value; fromBase.value = toBase.value; toBase.value = a;
    });

    convertBtn.addEventListener('click', () => {
      try {
        const src = this.detectBase(input.value.trim(), parseInt(fromBase.value, 10));
        const val = BigInt(src.value);
        const result = this.toBase(val, parseInt(toBase.value, 10));
        output.value = result;
        this.success('Converted');
      } catch (e) {
        this.error('Invalid number for the selected base');
      }
    });

    copyOutput.addEventListener('click', async () => {
      if (!output.value) { this.error('No output'); return; }
      try { await navigator.clipboard.writeText(output.value); this.success('Copied'); } catch { this.error('Copy failed'); }
    });
  }

  private detectBase(text: string, defaultBase: number): { value: string; base: number } {
    if (/^0x[0-9a-f]+$/i.test(text)) return { value: text.slice(2), base: 16 };
    if (/^0b[01]+$/i.test(text)) return { value: parseInt(text.slice(2), 2).toString(), base: 10 };
    if (/^0o[0-7]+$/i.test(text)) return { value: parseInt(text.slice(2), 8).toString(), base: 10 };
    if (/^[0-9a-z]+$/i.test(text)) return { value: BigInt(parseInt(text, defaultBase)).toString(), base: defaultBase };
    return { value: BigInt(parseInt(text, defaultBase)).toString(), base: defaultBase };
  }

  private toBase(value: bigint, base: number): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    if (base === 10) return value.toString(10);
    let v = value;
    const negative = v < 0n; if (negative) v = -v;
    let out = '';
    const b = BigInt(base);
    while (v > 0n) {
      const rem = Number(v % b);
      out = chars[rem] + out;
      v = v / b;
    }
    return (negative ? '-' : '') + (out || '0');
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

