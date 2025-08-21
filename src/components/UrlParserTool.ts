import { getIcon } from '@/utils/icons';

export class UrlParserTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('dev')}</div><div class="tool-title"><h2>URL parser</h2><p>Inspect and extract URL components</p></div></div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Input</h3></div>
            <input id="url" class="tool-input" placeholder="https://example.com:8443/path/name?x=1&y=2#hash" />
            <div class="tool-actions" style="margin-top:8px"><button id="parse" class="btn btn-primary">${getIcon('conversion')} Parse</button></div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Components</h3></div>
            <div id="summary" class="results-summary"></div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Query parameters</h3></div>
            <div id="params"></div>
          </div>
        </div>
      </div>`;
  }

  private bind(): void { this.container.querySelector('#parse')?.addEventListener('click', () => this.parse()); }

  private parse(): void {
    const input = (this.container.querySelector('#url') as HTMLInputElement).value.trim();
    const summary = this.container.querySelector('#summary') as HTMLElement;
    const paramsDiv = this.container.querySelector('#params') as HTMLElement;
    try {
      const u = new URL(input);
      summary.innerHTML = `
        <div class="summary-item"><span class="summary-label">Protocol:</span> <span class="summary-value">${u.protocol}</span></div>
        <div class="summary-item"><span class="summary-label">Origin:</span> <span class="summary-value">${u.origin}</span></div>
        <div class="summary-item"><span class="summary-label">Host:</span> <span class="summary-value">${u.host}</span></div>
        <div class="summary-item"><span class="summary-label">Hostname:</span> <span class="summary-value">${u.hostname}</span></div>
        <div class="summary-item"><span class="summary-label">Port:</span> <span class="summary-value">${u.port || '(default)'}</span></div>
        <div class="summary-item"><span class="summary-label">Pathname:</span> <span class="summary-value">${u.pathname}</span></div>
        <div class="summary-item"><span class="summary-label">Search:</span> <span class="summary-value">${u.search || '(none)'}</span></div>
        <div class="summary-item"><span class="summary-label">Hash:</span> <span class="summary-value">${u.hash || '(none)'}</span></div>
      `;
      const params = Array.from(u.searchParams.entries());
      if (params.length === 0) { paramsDiv.innerHTML = '<p>(no parameters)</p>'; return; }
      paramsDiv.innerHTML = params.map(([k,v]) => `<div class="summary-item"><span class="summary-label">${k}:</span> <span class="summary-value">${v}</span></div>`).join('');
    } catch (e:any) {
      summary.innerHTML = `<div class="summary-item"><span class="summary-label">Error:</span> <span class="summary-value">${e.message}</span></div>`;
      paramsDiv.innerHTML = '';
    }
  }
}


