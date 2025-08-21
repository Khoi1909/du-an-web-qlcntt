import { getIcon } from '@/utils/icons';

export class ListConverterTool {
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
            <h2>List converter</h2>
            <p>Convert line list ↔ JSON array, trim/unique options</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header">
              <h3>Input</h3>
              <div class="tool-actions">
                <label class="checkbox"><input type="checkbox" id="trim" checked> Trim</label>
                <label class="checkbox"><input type="checkbox" id="unique"> Unique</label>
              </div>
            </div>
            <textarea id="list-input" class="tool-textarea" rows="8" placeholder="a\nb\na"></textarea>
          </div>
          <div class="tool-actions-center">
            <button id="to-json" class="btn btn-primary">${getIcon('conversion')} List → JSON</button>
            <button id="to-list" class="btn btn-primary">${getIcon('conversion')} JSON → List</button>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Output</h3></div>
            <textarea id="list-output" class="tool-textarea" rows="8" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    const input = this.container.querySelector('#list-input') as HTMLTextAreaElement;
    const output = this.container.querySelector('#list-output') as HTMLTextAreaElement;
    const trim = this.container.querySelector('#trim') as HTMLInputElement;
    const unique = this.container.querySelector('#unique') as HTMLInputElement;

    this.container.querySelector('#to-json')?.addEventListener('click', () => {
      let items = input.value.split(/\r?\n/);
      if (trim.checked) items = items.map(s => s.trim()).filter(s => s.length > 0);
      if (unique.checked) items = Array.from(new Set(items));
      output.value = JSON.stringify(items, null, 2);
    });

    this.container.querySelector('#to-list')?.addEventListener('click', () => {
      try {
        const arr = JSON.parse(input.value);
        if (!Array.isArray(arr)) throw new Error('not array');
        let items = arr.map((x) => String(x));
        if (trim.checked) items = items.map(s => s.trim()).filter(s => s.length > 0);
        if (unique.checked) items = Array.from(new Set(items));
        output.value = items.join('\n');
      } catch { output.value = 'Invalid JSON array'; }
    });
  }

  public destroy(): void {}
}

