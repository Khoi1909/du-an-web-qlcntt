import { getIcon } from '@/utils/icons';

// Minimal English wordlist subset for demo (not full 2048 words). In real use, load full list.
const WORDS = ['abandon','ability','able','about','above','absent','absorb','abstract','absurd','abuse','access','accident','account','accuse','achieve','acid','acoustic','acquire','across','act','action','actor','actress','actual','adapt','add','addict','address','adjust','admit','adult','advance','advice','aerobic','affair','afford','afraid','again','age','agent','agree'];

function randomWords(n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  return out;
}

export class BIP39Tool {
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
          <div class="tool-icon">${getIcon('crypto')}</div>
          <div class="tool-title">
            <h2>BIP39 passphrase generator</h2>
            <p>Generate/validate mnemonic (demo wordlist)</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Generate</h3></div>
            <label>Words count
              <select id="count" class="tool-input" style="max-width:120px">
                <option>12</option>
                <option>15</option>
                <option>18</option>
                <option>21</option>
                <option>24</option>
              </select>
            </label>
            <div class="tool-actions" style="margin-top:8px">
              <button id="gen" class="btn btn-primary">${getIcon('generation')} Generate</button>
              <button id="copy" class="btn btn-secondary">${getIcon('copy')} Copy</button>
            </div>
            <textarea id="mnemonic" class="tool-textarea" rows="3" readonly></textarea>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Validate</h3></div>
            <textarea id="check" class="tool-textarea" rows="3" placeholder="Enter mnemonic (space-separated)"></textarea>
            <div class="tool-actions" style="margin-top:8px">
              <button id="validate" class="btn btn-primary">${getIcon('check')} Validate</button>
              <span id="status" style="margin-left:8px"></span>
            </div>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    const count = this.container.querySelector('#count') as HTMLSelectElement;
    const mnemonic = this.container.querySelector('#mnemonic') as HTMLTextAreaElement;
    const validateArea = this.container.querySelector('#check') as HTMLTextAreaElement;
    const status = this.container.querySelector('#status') as HTMLSpanElement;

    this.container.querySelector('#gen')?.addEventListener('click', () => {
      const n = parseInt(count.value, 10) || 12;
      mnemonic.value = randomWords(n).join(' ');
    });
    this.container.querySelector('#copy')?.addEventListener('click', async () => { if (mnemonic.value) { try { await navigator.clipboard.writeText(mnemonic.value); } catch {} } });
    this.container.querySelector('#validate')?.addEventListener('click', () => {
      const words = validateArea.value.trim().split(/\s+/);
      const ok = words.length >= 12 && words.every(w => WORDS.includes(w));
      status.textContent = ok ? 'Looks valid (demo check)' : 'Invalid (unknown words or length)';
      status.style.color = ok ? '#22c55e' : '#ef4444';
    });
  }

  public destroy(): void {}
}


