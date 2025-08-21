import { getIcon } from '@/utils/icons';

export class XmlFormatterTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('dev')}</div><div class="tool-title"><h2>XML formatter</h2><p>Pretty-print and minify XML (basic)</p></div></div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Input</h3></div>
            <textarea id="in" class="tool-textarea" rows="8" placeholder="<root><a x='1'>text</a></root>"></textarea>
            <div class="tool-actions" style="margin-top:8px">
              <button id="format" class="btn btn-primary">${getIcon('conversion')} Format</button>
              <button id="min" class="btn btn-secondary">Minify</button>
            </div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Output</h3></div>
            <textarea id="out" class="tool-textarea" rows="10" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    this.container.querySelector('#format')?.addEventListener('click', () => this.format());
    this.container.querySelector('#min')?.addEventListener('click', () => this.minify());
  }

  private format(): void {
    const s = (this.container.querySelector('#in') as HTMLTextAreaElement).value;
    const out = this.container.querySelector('#out') as HTMLTextAreaElement;
    try {
      const formatted = this.prettyXml(s);
      out.value = formatted;
    } catch (e:any) {
      out.value = `Invalid XML: ${e.message}`;
    }
  }

  private minify(): void {
    const s = (this.container.querySelector('#in') as HTMLTextAreaElement).value;
    const out = this.container.querySelector('#out') as HTMLTextAreaElement;
    try {
      const min = s.replace(/>\s+</g, '><').trim();
      // Validate by attempting to parse
      new DOMParser().parseFromString(min, 'application/xml');
      out.value = min;
    } catch (e:any) {
      out.value = `Invalid XML: ${e.message}`;
    }
  }

  private prettyXml(xml: string): string {
    const PADDING = '  ';
    let pad = 0;
    return xml
      .replace(/>\s+</g, '><')
      .replace(/</g, '~::~<')
      .split('~::~')
      .map((node) => {
        if (node.match(/^<\/.+/)) pad = Math.max(pad - 1, 0);
        const line = PADDING.repeat(pad) + node;
        if (node.match(/^<[^!?]+[^\/]>/)) pad += 1;
        return line;
      })
      .join('\n')
      .trim();
  }
}


