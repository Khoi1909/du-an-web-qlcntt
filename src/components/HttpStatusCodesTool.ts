import { getIcon } from '@/utils/icons';

type Code = { code: number; text: string; desc: string };

const CODES: Code[] = [
  { code: 100, text: 'Continue', desc: 'Request received, continue' },
  { code: 101, text: 'Switching Protocols', desc: '' },
  { code: 200, text: 'OK', desc: 'Success' },
  { code: 201, text: 'Created', desc: 'Resource created' },
  { code: 204, text: 'No Content', desc: 'Success with no body' },
  { code: 301, text: 'Moved Permanently', desc: 'Permanent redirect' },
  { code: 302, text: 'Found', desc: 'Temporary redirect' },
  { code: 304, text: 'Not Modified', desc: 'Use cached response' },
  { code: 400, text: 'Bad Request', desc: 'Invalid request' },
  { code: 401, text: 'Unauthorized', desc: 'Authentication required' },
  { code: 403, text: 'Forbidden', desc: 'Insufficient permissions' },
  { code: 404, text: 'Not Found', desc: 'Resource not found' },
  { code: 405, text: 'Method Not Allowed', desc: '' },
  { code: 409, text: 'Conflict', desc: '' },
  { code: 415, text: 'Unsupported Media Type', desc: '' },
  { code: 418, text: "I'm a teapot", desc: 'RFC 2324' },
  { code: 429, text: 'Too Many Requests', desc: 'Rate limited' },
  { code: 500, text: 'Internal Server Error', desc: 'Server error' },
  { code: 501, text: 'Not Implemented', desc: '' },
  { code: 502, text: 'Bad Gateway', desc: '' },
  { code: 503, text: 'Service Unavailable', desc: 'Overloaded or down' },
  { code: 504, text: 'Gateway Timeout', desc: '' },
];

export class HttpStatusCodesTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); this.renderList(''); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('dev')}</div><div class="tool-title"><h2>HTTP status codes</h2><p>Search common HTTP status codes</p></div></div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Search</h3></div>
            <input id="q" class="tool-input" placeholder="e.g. 404, unauthorized, redirect" />
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Codes</h3></div>
            <div id="list" class="tools-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));"></div>
          </div>
        </div>
      </div>`;
  }

  private bind(): void { (this.container.querySelector('#q') as HTMLInputElement).addEventListener('input', (e) => this.renderList((e.target as HTMLInputElement).value)); }

  private renderList(q: string): void {
    const list = this.container.querySelector('#list') as HTMLElement;
    const query = (q || '').toLowerCase().trim();
    const items = CODES.filter(c => !query || c.code.toString().includes(query) || c.text.toLowerCase().includes(query) || c.desc.toLowerCase().includes(query));
    list.innerHTML = items.map(c => `<div class="string-case-card"><div class="string-case-title">${c.code} ${c.text}</div><div class="string-case-output">${c.desc || ''}</div></div>`).join('');
  }
}


