import { getIcon } from '@/utils/icons';

export class TomlConverterTool {
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
            <h2>TOML converters</h2>
            <p>Convert TOML ↔ JSON and TOML ↔ YAML (basic support)</p>
          </div>
        </div>

        <div class="tool-content">
          <div class="converter-layout">
            <div class="converter-section">
              <div class="section-header">
                <h3>Left</h3>
                <div class="tool-actions">
                  <button id="yaml-to-toml" class="btn btn-primary">YAML → TOML</button>
                  <button id="json-to-toml" class="btn btn-primary">JSON → TOML</button>
                </div>
              </div>
              <textarea id="left-input" class="tool-textarea converter-textarea" rows="12" placeholder="Paste YAML or JSON here"></textarea>
            </div>

            <div class="converter-section">
              <div class="section-header">
                <h3>Right</h3>
                <div class="tool-actions">
                  <button id="toml-to-json" class="btn btn-primary">TOML → JSON</button>
                  <button id="toml-to-yaml" class="btn btn-primary">TOML → YAML</button>
                </div>
              </div>
              <textarea id="right-input" class="tool-textarea converter-textarea" rows="12" placeholder="Paste TOML here"></textarea>
            </div>
          </div>

          <div id="status" class="conversion-status"></div>
        </div>
      </div>
    `;
  }

  private bind(): void {
    const left = this.container.querySelector('#left-input') as HTMLTextAreaElement;
    const right = this.container.querySelector('#right-input') as HTMLTextAreaElement;
    const status = this.container.querySelector('#status') as HTMLDivElement;

    this.container.querySelector('#yaml-to-toml')?.addEventListener('click', () => {
      try {
        const obj = this.yamlToJson(left.value);
        right.value = this.jsonToToml(obj);
        this.ok(status, 'Converted YAML → TOML');
      } catch (e) { this.err(status, 'Invalid YAML or unsupported structure'); }
    });

    this.container.querySelector('#json-to-toml')?.addEventListener('click', () => {
      try {
        const obj = JSON.parse(left.value);
        right.value = this.jsonToToml(obj);
        this.ok(status, 'Converted JSON → TOML');
      } catch (e) { this.err(status, 'Invalid JSON'); }
    });

    this.container.querySelector('#toml-to-json')?.addEventListener('click', () => {
      try {
        const obj = this.tomlToJson(right.value);
        left.value = JSON.stringify(obj, null, 2);
        this.ok(status, 'Converted TOML → JSON');
      } catch (e) { this.err(status, 'Invalid TOML or unsupported structure'); }
    });

    this.container.querySelector('#toml-to-yaml')?.addEventListener('click', () => {
      try {
        const obj = this.tomlToJson(right.value);
        left.value = this.jsonToYaml(obj);
        this.ok(status, 'Converted TOML → YAML');
      } catch (e) { this.err(status, 'Invalid TOML or unsupported structure'); }
    });
  }

  // Very small TOML parser sufficient for flat keys, dotted keys, tables and arrays
  private tomlToJson(toml: string): any {
    const result: any = {};
    let context: any = result;
    const lines = toml.split(/\r?\n/);
    for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      // Table header [a.b]
      const tableMatch = line.match(/^\[(.+)]$/);
      if (tableMatch) {
        const path = tableMatch[1].trim();
        context = this.ensurePath(result, path);
        continue;
      }
      // Key = value
      const kv = line.split('=');
      if (kv.length >= 2) {
        const key = kv[0].trim();
        const valueStr = kv.slice(1).join('=').trim();
        const value = this.parseTomlValue(valueStr);
        if (key.includes('.')) {
          const obj = this.ensurePath(context === result ? result : context, key);
          // last segment already assigned inside ensurePath, but we need to set actual final
          this.assignDeep(context === result ? result : context, key, value);
        } else {
          context[key] = value;
        }
      }
    }
    return result;
  }

  private ensurePath(root: any, dotted: string): any {
    const parts = dotted.split('.');
    let cur = root;
    for (const p of parts) {
      if (!(p in cur) || typeof cur[p] !== 'object' || cur[p] === null) cur[p] = {};
      cur = cur[p];
    }
    return cur;
  }

  private assignDeep(root: any, dotted: string, value: any): void {
    const parts = dotted.split('.');
    let cur = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (!(p in cur) || typeof cur[p] !== 'object' || cur[p] === null) cur[p] = {};
      cur = cur[p];
    }
    cur[parts[parts.length - 1]] = value;
  }

  private parseTomlValue(v: string): any {
    // String
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      return v.slice(1, -1);
    }
    // Boolean
    if (v === 'true') return true;
    if (v === 'false') return false;
    // Array (assume JSON-like)
    if (v.startsWith('[') && v.endsWith(']')) {
      try { return JSON.parse(v.replace(/'([^']*)'/g, '"$1"')); } catch { /* fallthrough */ }
    }
    // Number
    if (/^-?\d+$/.test(v)) return parseInt(v, 10);
    if (/^-?\d*\.\d+$/.test(v)) return parseFloat(v);
    // Fallback
    return v;
  }

  private jsonToToml(obj: any, parent: string = ''): string {
    const lines: string[] = [];
    const scalars: string[] = [];
    const tables: { key: string; value: any }[] = [];

    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        tables.push({ key, value });
      } else {
        scalars.push(`${key} = ${this.scalarToToml(value)}`);
      }
    }

    if (parent) {
      lines.push(`[${parent}]`);
    }
    lines.push(...scalars);

    for (const { key, value } of tables) {
      const nestedParent = parent ? `${parent}.${key}` : key;
      lines.push(this.jsonToToml(value, nestedParent));
    }

    return lines.filter(Boolean).join('\n');
  }

  private scalarToToml(value: any): string {
    if (typeof value === 'string') return `"${value.replace(/"/g, '\\"')}"`;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (Array.isArray(value)) {
      const items = value.map(v => this.scalarToToml(v));
      return `[${items.join(', ')}]`;
    }
    if (value === null || value === undefined) return '""';
    return `"${String(value)}"`;
  }

  // Minimal YAML → JSON (copied/trimmed from JSON/YAML tool)
  private yamlToJson(yamlStr: string): any {
    const lines = yamlStr.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
    return this.parseYamlLines(lines);
  }

  private parseYamlLines(lines: string[], indent: number = 0): any {
    const result: any = {};
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const currentIndent = line.length - line.trimStart().length;
      const trimmed = line.trim();
      if (trimmed.includes(':')) {
        const [rawKey, ...rest] = trimmed.split(':');
        const key = rawKey.trim();
        const after = rest.join(':').trim();
        if (after) {
          result[key] = this.parseYamlValue(after);
        } else {
          const nextIndent = this.getNextIndent(lines, i + 1);
          if (nextIndent > currentIndent) {
            const sub = this.extractIndented(lines, i + 1, nextIndent);
            if (sub.length > 0 && sub[0].trim().startsWith('-')) {
              result[key] = this.parseYamlArray(sub);
            } else {
              result[key] = this.parseYamlLines(sub, nextIndent);
            }
            i += sub.length;
          }
        }
      }
      i++;
    }
    return result;
  }

  private parseYamlValue(val: string): any {
    val = val.trim();
    if (val === 'true') return true;
    if (val === 'false') return false;
    if (val === 'null' || val === '~') return null;
    if (/^-?\d+$/.test(val)) return parseInt(val, 10);
    if (/^-?\d*\.\d+$/.test(val)) return parseFloat(val);
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) return val.slice(1, -1);
    return val;
  }

  private parseYamlArray(lines: string[]): any[] {
    return lines.filter(l => l.trim().startsWith('-')).map(l => this.parseYamlValue(l.trim().slice(1).trim()));
  }

  private getNextIndent(lines: string[], start: number): number {
    for (let i = start; i < lines.length; i++) {
      if (lines[i].trim()) return lines[i].length - lines[i].trimStart().length;
    }
    return 0;
  }

  private extractIndented(lines: string[], start: number, indent: number): string[] {
    const out: string[] = [];
    for (let i = start; i < lines.length; i++) {
      const l = lines[i];
      const ind = l.length - l.trimStart().length;
      if (l.trim() && ind < indent) break;
      if (ind >= indent) out.push(l.substring(indent));
    }
    return out;
  }

  // Minimal JSON → YAML (adapted from JsonYamlTool)
  private jsonToYaml(obj: any, indent: number = 0): string {
    const spaces = '  '.repeat(indent);
    if (obj === null) return 'null';
    if (typeof obj === 'boolean') return obj.toString();
    if (typeof obj === 'number') return obj.toString();
    if (typeof obj === 'string') return obj;
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      return obj.map(item => `${spaces}- ${this.jsonToYaml(item, indent + 1)}`).join('\n');
    }
    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      return keys.map(k => {
        const v = obj[k];
        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
          return `${spaces}${k}:\n${this.jsonToYaml(v, indent + 1)}`;
        } else if (Array.isArray(v)) {
          if (v.length === 0) return `${spaces}${k}: []`;
          return `${spaces}${k}:\n${this.jsonToYaml(v, indent + 1)}`;
        } else {
          return `${spaces}${k}: ${this.jsonToYaml(v, indent)}`;
        }
      }).join('\n');
    }
    return String(obj);
  }

  private ok(el: HTMLElement, msg: string) { el.innerHTML = `<div class="status-message status-success">${getIcon('check')} ${msg}</div>`; }
  private err(el: HTMLElement, msg: string) { el.innerHTML = `<div class="status-message status-error">${getIcon('alert')} ${msg}</div>`; }

  public destroy(): void {}
}


