import { getIcon } from '@/utils/icons';

export class CrontabGeneratorTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); this.update(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('dev')}</div>
          <div class="tool-title">
            <h2>Crontab generator</h2>
            <p>Create cron expressions with examples</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Schedule</h3></div>
            <div class="input-group">
              <input id="m" class="tool-input" placeholder="Minute" value="*" />
              <input id="h" class="tool-input" placeholder="Hour" value="*" />
              <input id="dom" class="tool-input" placeholder="Day of month" value="*" />
              <input id="mon" class="tool-input" placeholder="Month" value="*" />
              <input id="dow" class="tool-input" placeholder="Day of week" value="*" />
            </div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Expression</h3></div>
            <input id="expr" class="tool-input" readonly />
            <div class="tool-actions" style="margin-top:8px"><button id="copy" class="btn btn-secondary">${getIcon('copy')} Copy</button></div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Examples</h3></div>
            <div class="tools-grid" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));">
              ${this.example('Every minute','* * * * *')}
              ${this.example('Every 5 minutes','*/5 * * * *')}
              ${this.example('Hourly','0 * * * *')}
              ${this.example('Daily at 02:30','30 2 * * *')}
              ${this.example('Weekly Sun 20:00','0 20 * * 0')}
              ${this.example('Monthly 1st 09:00','0 9 1 * *')}
            </div>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    ['m','h','dom','mon','dow'].forEach(id => (this.container.querySelector('#'+id) as HTMLInputElement).addEventListener('input', () => this.update()));
    this.container.querySelector('#copy')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText((this.container.querySelector('#expr') as HTMLInputElement).value); } catch {} });
  }

  private update(): void { (this.container.querySelector('#expr') as HTMLInputElement).value = ['m','h','dom','mon','dow'].map(id => (this.container.querySelector('#'+id) as HTMLInputElement).value || '*').join(' '); }

  private example(name: string, expr: string): string { return `<div class="string-case-card"><div class="string-case-title">${name}</div><div class="string-case-output"><code>${expr}</code></div></div>`; }
}


