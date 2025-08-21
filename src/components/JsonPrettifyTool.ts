import { getIcon } from '@/utils/icons';

export class JsonPrettifyTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('dev')}</div><div class="tool-title"><h2>JSON prettify and format</h2><p>Pretty-print JSON with validation</p></div></div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Input</h3></div>
            <textarea id="in" class="tool-textarea" rows="8" placeholder='{"a":1}'></textarea>
            <div class="tool-actions" style="margin-top:8px">
              <button id="format" class="btn btn-primary">${getIcon('conversion')} Format</button>
              <button id="min" class="btn btn-secondary">Minify</button>
              <button id="clean" class="btn btn-secondary">Clean</button>
            </div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Output</h3></div>
            <textarea id="out" class="tool-textarea" rows="8" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    this.container.querySelector('#format')?.addEventListener('click', () => this.run(true));
    this.container.querySelector('#min')?.addEventListener('click', () => this.run(false));
    this.container.querySelector('#clean')?.addEventListener('click', () => this.clean());
  }

  private run(pretty: boolean): void {
    const input = (this.container.querySelector('#in') as HTMLTextAreaElement).value;
    const out = this.container.querySelector('#out') as HTMLTextAreaElement;
    try {
      const obj = JSON.parse(input);
      out.value = pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
    } catch (e:any) {
      out.value = `Invalid JSON: ${e.message}`;
    }
  }

  private clean(): void {
    const input = (this.container.querySelector('#in') as HTMLTextAreaElement).value;
    const out = this.container.querySelector('#out') as HTMLTextAreaElement;
    try {
      const obj = JSON.parse(input);
      // Canonical: sort keys recursively and remove insignificant whitespace
      const sorted = this.sortKeys(obj);
      out.value = JSON.stringify(sorted);
    } catch (e:any) {
      out.value = `Invalid JSON: ${e.message}`;
    }
  }

  private sortKeys(value: any): any {
    if (Array.isArray(value)) return value.map(v => this.sortKeys(v));
    if (value && typeof value === 'object') {
      const keys = Object.keys(value).sort();
      const obj: Record<string, any> = {};
      for (const k of keys) obj[k] = this.sortKeys(value[k]);
      return obj;
    }
    return value;
  }
}


