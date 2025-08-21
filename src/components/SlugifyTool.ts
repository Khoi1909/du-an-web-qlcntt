import { getIcon } from '@/utils/icons';

export class SlugifyTool {
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
            <h2>Slugify string</h2>
            <p>Create URL-friendly slugs, remove diacritics, choose separator</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header">
              <h3>Input</h3>
              <div class="tool-actions">
                <label class="checkbox"><input type="checkbox" id="lower" checked> Lowercase</label>
                <label class="checkbox"><input type="checkbox" id="remove-diacritics" checked> Remove diacritics</label>
                <label class="checkbox">Sep: <input type="text" id="sep" value="-" class="tool-input" style="width:60px"></label>
              </div>
            </div>
            <textarea id="slug-input" class="tool-textarea" rows="4" placeholder="Tiêu đề bài viết số 1!"></textarea>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Output</h3></div>
            <textarea id="slug-output" class="tool-textarea" rows="2" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    const input = this.container.querySelector('#slug-input') as HTMLTextAreaElement;
    const output = this.container.querySelector('#slug-output') as HTMLTextAreaElement;
    const lower = this.container.querySelector('#lower') as HTMLInputElement;
    const remove = this.container.querySelector('#remove-diacritics') as HTMLInputElement;
    const sep = this.container.querySelector('#sep') as HTMLInputElement;
    const update = () => {
      output.value = this.slugify(input.value, { lowercase: lower.checked, removeDiacritics: remove.checked, sep: sep.value || '-' });
    };
    input.addEventListener('input', update);
    lower.addEventListener('change', update);
    remove.addEventListener('change', update);
    sep.addEventListener('input', update);
    update();
  }

  private slugify(text: string, opts: { lowercase: boolean; removeDiacritics: boolean; sep: string }): string {
    let s = text.trim();
    if (opts.removeDiacritics) {
      s = s.normalize('NFD').replace(/\p{Diacritic}+/gu, '');
    }
    if (opts.lowercase) s = s.toLowerCase();
    s = s.replace(/[^a-z0-9\s_-]/gi, ' ');
    s = s.replace(/[\s_-]+/g, ' ').trim();
    return s.replace(/\s+/g, opts.sep);
  }

  public destroy(): void {}
}

