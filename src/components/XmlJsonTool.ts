import { getIcon } from '@/utils/icons';

export class XmlJsonTool {
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
            <h2>XML ↔ JSON converter</h2>
            <p>Basic conversion between XML and JSON</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="converter-layout">
            <div class="converter-section">
              <div class="section-header"><h3>XML</h3>
                <div class="tool-actions"><button id="xml-to-json" class="btn btn-primary">${getIcon('conversion')} To JSON</button></div>
              </div>
              <textarea id="xml-input" class="tool-textarea converter-textarea" rows="12" placeholder="<note><to>Tove</to></note>"></textarea>
            </div>
            <div class="converter-section">
              <div class="section-header"><h3>JSON</h3>
                <div class="tool-actions"><button id="json-to-xml" class="btn btn-primary">${getIcon('conversion')} To XML</button></div>
              </div>
              <textarea id="json-input" class="tool-textarea converter-textarea" rows="12" placeholder='{"note":{"to":"Tove"}}'></textarea>
            </div>
          </div>
          <div id="status" class="conversion-status"></div>
        </div>
      </div>`;
  }

  private bind(): void {
    const xml = this.container.querySelector('#xml-input') as HTMLTextAreaElement;
    const json = this.container.querySelector('#json-input') as HTMLTextAreaElement;
    const status = this.container.querySelector('#status') as HTMLDivElement;
    this.container.querySelector('#xml-to-json')?.addEventListener('click', () => {
      try {
        const obj = this.xmlToJson(xml.value);
        json.value = JSON.stringify(obj, null, 2);
        this.ok(status, 'Converted XML to JSON');
      } catch (e) { this.err(status, 'Invalid XML'); }
    });
    this.container.querySelector('#json-to-xml')?.addEventListener('click', () => {
      try {
        const obj = JSON.parse(json.value);
        xml.value = this.jsonToXml(obj);
        this.ok(status, 'Converted JSON to XML');
      } catch (e) { this.err(status, 'Invalid JSON'); }
    });
  }

  // Minimal XML parser for simple element/text structures
  private xmlToJson(xmlStr: string): any {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, 'application/xml');
    const parseErr = doc.querySelector('parsererror');
    if (parseErr) throw new Error('bad');
    const walk = (el: Element): any => {
      const children = Array.from(el.children);
      if (children.length === 0) return el.textContent ?? '';
      const obj: any = {};
      for (const child of children) {
        const v = walk(child);
        if (obj[child.tagName]) {
          if (!Array.isArray(obj[child.tagName])) obj[child.tagName] = [obj[child.tagName]];
          obj[child.tagName].push(v);
        } else {
          obj[child.tagName] = v;
        }
      }
      return obj;
    };
    const root = doc.documentElement;
    const out: any = {};
    out[root.tagName] = walk(root);
    return out;
  }

  private jsonToXml(obj: any): string {
    const build = (key: string, val: any): string => {
      if (val === null || val === undefined) return `<${key}></${key}>`;
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        return `<${key}>${String(val)}</${key}>`;
      }
      if (Array.isArray(val)) {
        return val.map(v => build(key, v)).join('');
      }
      if (typeof val === 'object') {
        return `<${key}>${Object.entries(val).map(([k,v]) => build(k, v)).join('')}</${key}>`;
      }
      return `<${key}></${key}>`;
    };
    const [rootKey, rootVal] = Object.entries(obj)[0];
    return build(String(rootKey), rootVal);
  }

  private ok(el: HTMLElement, msg: string) { el.innerHTML = `<div class="status-message status-success">${getIcon('check')} ${msg}</div>`; }
  private err(el: HTMLElement, msg: string) { el.innerHTML = `<div class="status-message status-error">${getIcon('alert')} ${msg}</div>`; }

  public destroy(): void {}
}

