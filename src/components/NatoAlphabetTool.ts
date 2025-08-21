import { getIcon } from '@/utils/icons';

const NATO: Record<string, string> = {
  A: 'Alpha', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo', F: 'Foxtrot',
  G: 'Golf', H: 'Hotel', I: 'India', J: 'Juliett', K: 'Kilo', L: 'Lima',
  M: 'Mike', N: 'November', O: 'Oscar', P: 'Papa', Q: 'Quebec', R: 'Romeo',
  S: 'Sierra', T: 'Tango', U: 'Uniform', V: 'Victor', W: 'Whiskey', X: 'X-ray',
  Y: 'Yankee', Z: 'Zulu'
};

export class NatoAlphabetTool {
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
            <h2>Text to NATO alphabet</h2>
            <p>Encode/Decode using NATO phonetic alphabet</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Input</h3></div>
            <textarea id="nato-input" class="tool-textarea" rows="4" placeholder="Hello"></textarea>
          </div>
          <div class="tool-actions-center">
            <button id="encode" class="btn btn-primary">${getIcon('lock')} Encode</button>
            <button id="decode" class="btn btn-primary">${getIcon('unlock')} Decode</button>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Output</h3></div>
            <textarea id="nato-output" class="tool-textarea" rows="4" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    const input = this.container.querySelector('#nato-input') as HTMLTextAreaElement;
    const output = this.container.querySelector('#nato-output') as HTMLTextAreaElement;
    this.container.querySelector('#encode')?.addEventListener('click', () => {
      const text = input.value;
      const out = Array.from(text).map(ch => {
        const up = ch.toUpperCase();
        return NATO[up] ?? ch;
      }).join(' ');
      output.value = out;
      this.success('Encoded');
    });
    this.container.querySelector('#decode')?.addEventListener('click', () => {
      const words = input.value.trim().split(/\s+/);
      const reverse: Record<string, string> = Object.fromEntries(Object.entries(NATO).map(([k,v]) => [v.toUpperCase(), k]));
      const out = words.map(w => reverse[w.toUpperCase()] ?? w).join('');
      output.value = out;
      this.success('Decoded');
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

