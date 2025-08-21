import { getIcon } from '@/utils/icons';

type Mime = { ext: string; type: string; desc: string };

const MIMES: Mime[] = [
  { ext: 'html', type: 'text/html', desc: 'HTML document' },
  { ext: 'css', type: 'text/css', desc: 'Stylesheet' },
  { ext: 'js', type: 'application/javascript', desc: 'JavaScript' },
  { ext: 'json', type: 'application/json', desc: 'JSON data' },
  { ext: 'xml', type: 'application/xml', desc: 'XML data' },
  { ext: 'png', type: 'image/png', desc: 'PNG image' },
  { ext: 'jpg', type: 'image/jpeg', desc: 'JPEG image' },
  { ext: 'gif', type: 'image/gif', desc: 'GIF image' },
  { ext: 'svg', type: 'image/svg+xml', desc: 'SVG vector image' },
  { ext: 'webp', type: 'image/webp', desc: 'WebP image' },
  { ext: 'ico', type: 'image/x-icon', desc: 'Icon' },
  { ext: 'pdf', type: 'application/pdf', desc: 'PDF document' },
  { ext: 'zip', type: 'application/zip', desc: 'ZIP archive' },
  { ext: 'gz', type: 'application/gzip', desc: 'GZip archive' },
  { ext: 'tar', type: 'application/x-tar', desc: 'TAR archive' },
  { ext: 'mp3', type: 'audio/mpeg', desc: 'MP3 audio' },
  { ext: 'mp4', type: 'video/mp4', desc: 'MP4 video' },
  { ext: 'csv', type: 'text/csv', desc: 'CSV' },
  { ext: 'txt', type: 'text/plain', desc: 'Plain text' },
  { ext: 'wasm', type: 'application/wasm', desc: 'WebAssembly' },
];

export class MimeTypesTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); this.renderList(''); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('dev')}</div><div class="tool-title"><h2>MIME types</h2><p>Lookup by extension or type</p></div></div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Search</h3></div>
            <input id="q" class="tool-input" placeholder="e.g. json, image/, text/html" />
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Results</h3></div>
            <div id="list" class="tools-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));"></div>
          </div>
        </div>
      </div>`;
  }

  private bind(): void { (this.container.querySelector('#q') as HTMLInputElement).addEventListener('input', (e) => this.renderList((e.target as HTMLInputElement).value)); }

  private renderList(q: string): void {
    const list = this.container.querySelector('#list') as HTMLElement;
    const query = (q || '').toLowerCase().trim();
    const items = MIMES.filter(m => !query || m.ext.includes(query) || m.type.toLowerCase().includes(query) || m.desc.toLowerCase().includes(query));
    list.innerHTML = items.map(m => `<div class=\"string-case-card\"><div class=\"string-case-title\">.${m.ext}</div><div class=\"string-case-output\"><code>${m.type}</code><div>${m.desc}</div></div></div>`).join('');
  }
}


