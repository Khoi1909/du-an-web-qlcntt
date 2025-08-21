import { getIcon } from '@/utils/icons';

export class YamlFormatterTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('dev')}</div><div class="tool-title"><h2>YAML prettify and format</h2><p>Format and validate YAML (basic)</p></div></div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Input</h3></div>
            <textarea id="in" class="tool-textarea" rows="10" placeholder="name: example\nitems:\n  - 1\n  - 2"></textarea>
            <div class="tool-actions" style="margin-top:8px">
              <button id="fmt" class="btn btn-primary">${getIcon('conversion')} Format</button>
              <button id="min" class="btn btn-secondary">Minify</button>
              <button id="validate" class="btn btn-secondary">Validate</button>
            </div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Output</h3></div>
            <textarea id="out" class="tool-textarea" rows="12" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    this.container.querySelector('#fmt')?.addEventListener('click', () => this.format());
    this.container.querySelector('#min')?.addEventListener('click', () => this.minify());
    this.container.querySelector('#validate')?.addEventListener('click', () => this.validate());
  }

  private validate(): void {
    const s = (this.container.querySelector('#in') as HTMLTextAreaElement).value;
    const out = this.container.querySelector('#out') as HTMLTextAreaElement;
    try { this.yamlToJson(s); out.value = 'YAML is valid'; } catch (e:any) { out.value = `Invalid YAML: ${e.message}`; }
  }

  private format(): void {
    const s = (this.container.querySelector('#in') as HTMLTextAreaElement).value;
    const out = this.container.querySelector('#out') as HTMLTextAreaElement;
    try {
      const json = this.yamlToJson(s);
      out.value = this.jsonToYaml(json);
    } catch (e:any) {
      out.value = `Invalid YAML: ${e.message}`;
    }
  }

  private minify(): void {
    const s = (this.container.querySelector('#in') as HTMLTextAreaElement).value;
    const out = this.container.querySelector('#out') as HTMLTextAreaElement;
    try {
      const noComments = s.split('\n').map(l => l.replace(/\s+#.*$/, '')).filter(l => l.trim().length).join('\n');
      // validate
      this.yamlToJson(noComments);
      out.value = noComments;
    } catch (e:any) { out.value = `Invalid YAML: ${e.message}`; }
  }

  // Minimal YAML -> JSON (same approach as JsonYamlTool)
  private yamlToJson(yamlStr: string): any {
    const lines = yamlStr.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
    return this.parseYamlLines(lines);
  }

  private parseYamlLines(lines: string[]): any {
    const result: any = {};
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const indent = line.length - line.trimStart().length;
      const trimmed = line.trim();
      if (trimmed.includes(':')) {
        const [key, ...rest] = trimmed.split(':');
        const value = rest.join(':').trim();
        if (value) {
          result[key.trim()] = this.parseValue(value);
        } else {
          const nextIndent = this.getNextIndent(lines, i + 1);
          if (nextIndent > indent) {
            const sub = this.extractIndented(lines, i + 1, nextIndent);
            if (sub.length > 0 && sub[0].trim().startsWith('-')) {
              result[key.trim()] = this.parseYamlArray(sub);
            } else {
              result[key.trim()] = this.parseYamlLines(sub);
            }
            i += sub.length;
          } else {
            result[key.trim()] = {};
          }
        }
      }
      i++;
    }
    return result;
  }

  private parseYamlArray(lines: string[]): any[] {
    return lines.filter(l => l.trim().startsWith('-')).map(l => this.parseValue(l.trim().slice(1).trim()));
  }

  private parseValue(v: string): any {
    if (v === 'true') return true; if (v === 'false') return false; if (v === 'null' || v === '~') return null;
    if (/^-?\d+$/.test(v)) return parseInt(v, 10); if (/^-?\d*\.\d+$/.test(v)) return parseFloat(v);
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
    return v;
  }

  private getNextIndent(lines: string[], start: number): number {
    for (let i = start; i < lines.length; i++) { if (lines[i].trim()) return lines[i].length - lines[i].trimStart().length; }
    return 0;
  }

  private extractIndented(lines: string[], start: number, target: number): string[] {
    const res: string[] = []; for (let i = start; i < lines.length; i++) { const line = lines[i]; const ind = line.length - line.trimStart().length; if (line.trim() && ind < target) break; if (ind >= target) res.push(line.substring(target)); }
    return res;
  }

  // Minimal JSON -> YAML
  private jsonToYaml(obj: any, indent: number = 0): string {
    const spaces = '  '.repeat(indent);
    if (obj === null) return 'null'; if (typeof obj === 'boolean' || typeof obj === 'number') return String(obj); if (typeof obj === 'string') return obj;
    if (Array.isArray(obj)) { if (obj.length === 0) return '[]'; return obj.map(item => `${spaces}- ${this.jsonToYaml(item, indent + 1)}`).join('\n'); }
    const keys = Object.keys(obj); if (keys.length === 0) return '{}';
    return keys.map(k => { const v = obj[k]; if (v && typeof v === 'object' && !Array.isArray(v)) return `${spaces}${k}:\n${this.jsonToYaml(v, indent + 1)}`; if (Array.isArray(v)) return v.length ? `${spaces}${k}:\n${this.jsonToYaml(v, indent + 1)}` : `${spaces}${k}: []`; return `${spaces}${k}: ${this.jsonToYaml(v, indent)}`; }).join('\n');
  }
}


