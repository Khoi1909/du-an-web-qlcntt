import { getIcon } from '@/utils/icons';

type DiffEntry = { path: string; type: 'added' | 'removed' | 'changed'; oldValue?: any; newValue?: any };

export class JsonDiffTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('dev')}</div><div class="tool-title"><h2>JSON diff</h2><p>Compare two JSON objects</p></div></div>
        <div class="tool-content">
          <div class="converter-layout">
            <div class="converter-section">
              <div class="section-header"><h3>Left</h3>
                <div class="tool-actions"><button id="diff" class="btn btn-primary">${getIcon('conversion')} Diff</button></div>
              </div>
              <textarea id="left" class="tool-textarea converter-textarea" rows="12" placeholder='{"a":1,"b":2}'></textarea>
            </div>
            <div class="converter-section">
              <div class="section-header"><h3>Right</h3></div>
              <textarea id="right" class="tool-textarea converter-textarea" rows="12" placeholder='{"a":1,"b":3,"c":4}'></textarea>
            </div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Changes</h3></div>
            <pre id="out" class="response-content">No diff yet.</pre>
          </div>
        </div>
      </div>`;
  }

  private bind(): void { this.container.querySelector('#diff')?.addEventListener('click', () => this.run()); }

  private run(): void {
    const out = this.container.querySelector('#out') as HTMLElement;
    try {
      const left = JSON.parse((this.container.querySelector('#left') as HTMLTextAreaElement).value || 'null');
      const right = JSON.parse((this.container.querySelector('#right') as HTMLTextAreaElement).value || 'null');
      const diffs: DiffEntry[] = [];
      this.diff('', left, right, diffs);
      if (diffs.length === 0) { out.textContent = 'No differences.'; return; }
      out.textContent = diffs.map(d => this.formatEntry(d)).join('\n');
    } catch (e:any) { out.textContent = `Invalid JSON: ${e.message}`; }
  }

  private diff(path: string, a: any, b: any, out: DiffEntry[]): void {
    if (this.equals(a, b)) return;
    if (a === undefined) { out.push({ path, type: 'added', newValue: b }); return; }
    if (b === undefined) { out.push({ path, type: 'removed', oldValue: a }); return; }
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) { out.push({ path, type: 'changed', oldValue: a, newValue: b }); return; }
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) this.diff(this.join(path, k), (a as any)[k], (b as any)[k], out);
  }

  private equals(a: any, b: any): boolean { return JSON.stringify(a) === JSON.stringify(b); }
  private join(base: string, key: string): string { return base ? `${base}.${key}` : key; }
  private formatEntry(e: DiffEntry): string {
    const show = (v:any) => typeof v === 'string' ? JSON.stringify(v) : JSON.stringify(v);
    if (e.type === 'added') return `+ ${e.path}: ${show(e.newValue)}`;
    if (e.type === 'removed') return `- ${e.path}: ${show(e.oldValue)}`;
    return `~ ${e.path}: ${show(e.oldValue)} → ${show(e.newValue)}`;
  }
}


