import { getIcon } from '@/utils/icons';

export class ChmodCalculatorTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); this.update(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('dev')}</div><div class="tool-title"><h2>Chmod calculator</h2><p>Calculate Unix permissions (symbolic and octal)</p></div></div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Permissions</h3></div>
            <div class="tools-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));">
              ${this.group('Owner','u')}
              ${this.group('Group','g')}
              ${this.group('Others','o')}
            </div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Result</h3></div>
            <div id="sum" class="results-summary"></div>
          </div>
        </div>
      </div>`;
  }

  private group(title: string, prefix: string): string {
    return `<div class="string-case-card"><div class="string-case-title">${title}</div>
      <label class="checkbox"><input type="checkbox" id="${prefix}r"> read (r)</label>
      <label class="checkbox"><input type="checkbox" id="${prefix}w"> write (w)</label>
      <label class="checkbox"><input type="checkbox" id="${prefix}x"> execute (x)</label>
    </div>`;
  }

  private bind(): void { ['ur','uw','ux','gr','gw','gx','or','ow','ox'].forEach(id => (this.container.querySelector('#'+id) as HTMLInputElement).addEventListener('change', () => this.update())); }

  private update(): void {
    const val = (r:boolean,w:boolean,x:boolean) => (r?4:0)+(w?2:0)+(x?1:0);
    const ur=(this.q('ur')), uw=(this.q('uw')), ux=(this.q('ux'));
    const gr=(this.q('gr')), gw=(this.q('gw')), gx=(this.q('gx'));
    const orr=(this.q('or')), ow=(this.q('ow')), ox=(this.q('ox'));
    const u = val(ur,uw,ux), g = val(gr,gw,gx), o = val(orr,ow,ox);
    const symbolic = `${ur?'r':'-'}${uw?'w':'-'}${ux?'x':'-'}${gr?'r':'-'}${gw?'w':'-'}${gx?'x':'-'}${orr?'r':'-'}${ow?'w':'-'}${ox?'x':'-'}`;
    (this.container.querySelector('#sum') as HTMLElement).innerHTML = `
      <div class="summary-item"><span class="summary-label">Octal:</span> <span class="summary-value">${u}${g}${o}</span></div>
      <div class="summary-item"><span class="summary-label">Symbolic:</span> <span class="summary-value">${symbolic}</span></div>
    `;
  }

  private q(id: string): boolean { return (this.container.querySelector('#'+id) as HTMLInputElement).checked; }
}


