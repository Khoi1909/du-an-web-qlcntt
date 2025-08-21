import { getIcon } from '@/utils/icons';

export class RomanNumeralTool {
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
            <h2>Roman numeral converter</h2>
            <p>Convert numbers to/from Roman numerals</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Input</h3></div>
            <textarea id="roman-input" class="tool-textarea" rows="4" placeholder="e.g. 1999 or MCMXCIX"></textarea>
          </div>
          <div class="tool-actions-center">
            <button id="to-roman" class="btn btn-primary">${getIcon('conversion')} Number → Roman</button>
            <button id="to-number" class="btn btn-primary">${getIcon('conversion')} Roman → Number</button>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Output</h3></div>
            <textarea id="roman-output" class="tool-textarea" rows="4" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    const input = this.container.querySelector('#roman-input') as HTMLTextAreaElement;
    const output = this.container.querySelector('#roman-output') as HTMLTextAreaElement;
    this.container.querySelector('#to-roman')?.addEventListener('click', () => {
      const n = parseInt(input.value.trim(), 10);
      if (Number.isNaN(n) || n <= 0 || n >= 4000) { this.error('Enter 1..3999'); return; }
      output.value = this.toRoman(n);
      this.success('Converted');
    });
    this.container.querySelector('#to-number')?.addEventListener('click', () => {
      const r = input.value.trim().toUpperCase();
      try {
        const n = this.fromRoman(r);
        output.value = String(n);
        this.success('Converted');
      } catch { this.error('Invalid roman numeral'); }
    });
  }

  private toRoman(num: number): string {
    const map: [number, string][] = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let n = num, out = '';
    for (const [v, s] of map) { while (n >= v) { out += s; n -= v; } }
    return out;
  }

  private fromRoman(roman: string): number {
    const vals: Record<string, number> = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
    let total = 0, prev = 0;
    for (let i = roman.length - 1; i >= 0; i--) {
      const v = vals[roman[i]]; if (!v) throw new Error('bad');
      if (v < prev) total -= v; else { total += v; prev = v; }
    }
    const check = this.toRoman(total);
    if (check !== roman) throw new Error('bad');
    return total;
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

