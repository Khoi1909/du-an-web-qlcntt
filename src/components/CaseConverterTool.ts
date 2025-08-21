import { getIcon } from '@/utils/icons';

export class CaseConverterTool {
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
          <div class="tool-icon">${getIcon('string')}</div>
          <div class="tool-title">
            <h2>Case converter</h2>
            <p>Convert text to camelCase, snake_case, kebab-case, Title Case, UPPER, lower</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Input</h3></div>
            <textarea id="case-input" class="tool-textarea" rows="6" placeholder="Enter text..."></textarea>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Output</h3></div>
            <div class="tools-grid" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));">
              <div>
                <div class="tool-card-title">camelCase</div>
                <textarea id="out-camel" class="tool-textarea" rows="2" readonly></textarea>
              </div>
              <div>
                <div class="tool-card-title">PascalCase</div>
                <textarea id="out-pascal" class="tool-textarea" rows="2" readonly></textarea>
              </div>
              <div>
                <div class="tool-card-title">snake_case</div>
                <textarea id="out-snake" class="tool-textarea" rows="2" readonly></textarea>
              </div>
              <div>
                <div class="tool-card-title">kebab-case</div>
                <textarea id="out-kebab" class="tool-textarea" rows="2" readonly></textarea>
              </div>
              <div>
                <div class="tool-card-title">Title Case</div>
                <textarea id="out-title" class="tool-textarea" rows="2" readonly></textarea>
              </div>
              <div>
                <div class="tool-card-title">UPPERCASE / lowercase</div>
                <textarea id="out-upper" class="tool-textarea" rows="2" readonly></textarea>
                <textarea id="out-lower" class="tool-textarea" rows="2" readonly></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    const input = this.container.querySelector('#case-input') as HTMLTextAreaElement;
    const update = () => {
      const val = input.value;
      (this.container.querySelector('#out-camel') as HTMLTextAreaElement).value = this.toCamel(val);
      (this.container.querySelector('#out-pascal') as HTMLTextAreaElement).value = this.toPascal(val);
      (this.container.querySelector('#out-snake') as HTMLTextAreaElement).value = this.toSnake(val);
      (this.container.querySelector('#out-kebab') as HTMLTextAreaElement).value = this.toKebab(val);
      (this.container.querySelector('#out-title') as HTMLTextAreaElement).value = this.toTitle(val);
      (this.container.querySelector('#out-upper') as HTMLTextAreaElement).value = val.toUpperCase();
      (this.container.querySelector('#out-lower') as HTMLTextAreaElement).value = val.toLowerCase();
    };
    input.addEventListener('input', update);
    update();
  }

  private words(s: string): string[] {
    return s
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .trim()
      .split(/\s+/);
  }

  private toCamel(s: string): string {
    const w = this.words(s.toLowerCase());
    if (w.length === 0) return '';
    return w[0] + w.slice(1).map(x => x.charAt(0).toUpperCase() + x.slice(1)).join('');
  }

  private toPascal(s: string): string {
    const w = this.words(s.toLowerCase());
    return w.map(x => x.charAt(0).toUpperCase() + x.slice(1)).join('');
  }

  private toSnake(s: string): string {
    return this.words(s).map(x => x.toLowerCase()).join('_');
  }

  private toKebab(s: string): string {
    return this.words(s).map(x => x.toLowerCase()).join('-');
  }

  private toTitle(s: string): string {
    return this.words(s).map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join(' ');
  }

  public destroy(): void {}
}

