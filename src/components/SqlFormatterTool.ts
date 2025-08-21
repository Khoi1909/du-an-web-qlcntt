import { getIcon } from '@/utils/icons';

export class SqlFormatterTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('dev')}</div><div class="tool-title"><h2>SQL prettify and format</h2><p>Indent keywords and line-break clauses (basic)</p></div></div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Input</h3></div>
            <textarea id="in" class="tool-textarea" rows="8" placeholder="select a,b from t where x=1 and y=2 order by a"></textarea>
            <div class="tool-actions" style="margin-top:8px"><button id="fmt" class="btn btn-primary">${getIcon('conversion')} Format</button></div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Output</h3></div>
            <textarea id="out" class="tool-textarea" rows="10" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void { this.container.querySelector('#fmt')?.addEventListener('click', () => this.format()); }

  private format(): void {
    const s = (this.container.querySelector('#in') as HTMLTextAreaElement).value;
    const out = this.container.querySelector('#out') as HTMLTextAreaElement;
    const keywords = ['select','from','where','group by','order by','having','limit','join','left join','right join','inner join','outer join','insert','into','values','update','set','delete'];
    let t = ' ' + s.trim().replace(/\s+/g, ' ') + ' ';
    for (const kw of keywords.sort((a,b)=>b.length-a.length)) {
      const re = new RegExp(`\\s${kw.replace(/\s/g,'\\s+')}\\s`,'ig');
      t = t.replace(re, (m) => `\n${m.trim().toUpperCase()}\n`);
    }
    t = t.replace(/\(/g, '( ').replace(/\)/g,' )');
    t = t.replace(/\n+/g,'\n').trim();
    // simple indentation
    const lines = t.split('\n');
    let indent = 0; const res: string[] = [];
    for (let line of lines) {
      if (/^\)/.test(line.trim())) indent = Math.max(0, indent - 1);
      res.push('  '.repeat(indent) + line.trim());
      if (/\($/.test(line.trim())) indent++;
    }
    out.value = res.join('\n');
  }
}


