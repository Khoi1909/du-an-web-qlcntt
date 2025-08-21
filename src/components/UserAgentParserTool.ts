import { getIcon } from '@/utils/icons';

export class UserAgentParserTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); this.parse(navigator.userAgent); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('network')}</div>
          <div class="tool-title">
            <h2>User-agent parser</h2>
            <p>Basic browser, engine, OS detection from a UA string</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Input</h3></div>
            <textarea id="ua" class="tool-textarea" rows="4" placeholder="Paste a user-agent..."></textarea>
            <div class="tool-actions" style="margin-top:8px"><button id="parse" class="btn btn-primary">${getIcon('conversion')} Parse</button></div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Result</h3></div>
            <div id="sum" class="results-summary"></div>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    this.container.querySelector('#parse')?.addEventListener('click', () => this.parse((this.container.querySelector('#ua') as HTMLTextAreaElement).value));
  }

  private parse(ua: string): void {
    const sum = this.container.querySelector('#sum') as HTMLElement;
    const s = ua || navigator.userAgent;
    const browser = this.detectBrowser(s);
    const os = this.detectOS(s);
    const engine = this.detectEngine(s);
    sum.innerHTML = `
      <div class="summary-item"><span class="summary-label">Browser:</span> <span class="summary-value">${browser}</span></div>
      <div class="summary-item"><span class="summary-label">Engine:</span> <span class="summary-value">${engine}</span></div>
      <div class="summary-item"><span class="summary-label">OS:</span> <span class="summary-value">${os}</span></div>
      <div class="summary-item"><span class="summary-label">UA:</span> <span class="summary-value">${this.esc(s)}</span></div>
    `;
    (this.container.querySelector('#ua') as HTMLTextAreaElement).value = s;
  }

  private esc(t: string): string { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  private detectBrowser(ua: string): string {
    if (/Edg\//.test(ua)) return 'Edge';
    if (/Chrome\//.test(ua) && !/OPR\//.test(ua)) return 'Chrome';
    if (/Safari\//.test(ua) && /Version\//.test(ua)) return 'Safari';
    if (/Firefox\//.test(ua)) return 'Firefox';
    if (/OPR\//.test(ua)) return 'Opera';
    return 'Unknown';
  }
  private detectEngine(ua: string): string {
    if (/AppleWebKit\//.test(ua)) return 'WebKit/Blink';
    if (/Gecko\//.test(ua) && /Firefox\//.test(ua)) return 'Gecko';
    return 'Unknown';
  }
  private detectOS(ua: string): string {
    if (/Windows NT 10/.test(ua)) return 'Windows 10+';
    if (/Windows NT/.test(ua)) return 'Windows';
    if (/Mac OS X/.test(ua)) return 'macOS';
    if (/Android/.test(ua)) return 'Android';
    if (/(iPhone|iPad|iPod)/.test(ua)) return 'iOS';
    if (/Linux/.test(ua)) return 'Linux';
    return 'Unknown';
  }
}


