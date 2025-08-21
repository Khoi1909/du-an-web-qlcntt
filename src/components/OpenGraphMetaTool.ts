import { getIcon } from '@/utils/icons';

export class OpenGraphMetaTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); this.update(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('generation')}</div><div class="tool-title"><h2>Open Graph meta generator</h2><p>Generate OG tags for social sharing</p></div></div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Inputs</h3></div>
            <div class="input-group">
              <label>Title</label><input id="title" class="tool-input" placeholder="My page title" />
              <label>Description</label><input id="desc" class="tool-input" placeholder="A nice description" />
              <label>URL</label><input id="url" class="tool-input" placeholder="https://example.com" />
              <label>Image URL</label><input id="img" class="tool-input" placeholder="https://example.com/og.png" />
              <label>Site name</label><input id="site" class="tool-input" placeholder="My Site" />
            </div>
            <div class="tool-actions"><button id="copy" class="btn btn-secondary">${getIcon('copy')} Copy</button></div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Output</h3></div>
            <textarea id="out" class="tool-textarea" rows="10" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    ['title','desc','url','img','site'].forEach(id => (this.container.querySelector('#'+id) as HTMLInputElement).addEventListener('input', () => this.update()));
    this.container.querySelector('#copy')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText((this.container.querySelector('#out') as HTMLTextAreaElement).value); } catch {} });
  }

  private update(): void {
    const title = (this.container.querySelector('#title') as HTMLInputElement).value;
    const desc = (this.container.querySelector('#desc') as HTMLInputElement).value;
    const url = (this.container.querySelector('#url') as HTMLInputElement).value;
    const img = (this.container.querySelector('#img') as HTMLInputElement).value;
    const site = (this.container.querySelector('#site') as HTMLInputElement).value;
    const tags = [
      ['og:title', title],
      ['og:description', desc],
      ['og:url', url],
      ['og:image', img],
      ['og:site_name', site],
      ['twitter:card', 'summary_large_image'],
      ['twitter:title', title],
      ['twitter:description', desc],
      ['twitter:image', img],
    ].filter(([,v]) => v && v.length > 0)
     .map(([k,v]) => `<meta property="${k}" content="${this.escape(v)}">`)
     .join('\n');
    (this.container.querySelector('#out') as HTMLTextAreaElement).value = tags;
  }

  private escape(v: string): string { return v.replace(/"/g, '&quot;'); }
}


