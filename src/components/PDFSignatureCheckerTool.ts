import { getIcon } from '@/utils/icons';

export class PDFSignatureCheckerTool {
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
          <div class="tool-icon">${getIcon('crypto')}</div>
          <div class="tool-title">
            <h2>PDF signature checker</h2>
            <p>Basic detector that inspects a PDF for digital signature markers</p>
          </div>
        </div>

        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header">
              <h3>Upload PDF</h3>
              <div class="tool-actions">
                <button id="clear" class="btn btn-secondary">${getIcon('trash')} Clear</button>
              </div>
            </div>
            <input id="file" type="file" accept="application/pdf" class="tool-input" />
            <div id="file-info" class="input-info" style="display:none"></div>
          </div>

          <div class="tool-section">
            <div class="section-header"><h3>Result</h3></div>
            <div id="status" class="validation-message" style="display:none"></div>
            <div id="summary" class="results-summary" style="margin-top:12px; display:none"></div>
          </div>

          <div class="tool-section">
            <div class="section-header"><h3>Details</h3></div>
            <div id="details" class="matches-list"><div class="no-matches">No file loaded</div></div>
          </div>
        </div>
      </div>
    `;
  }

  private bind(): void {
    const fileInput = this.q('#file') as HTMLInputElement;
    const clearBtn = this.q('#clear');
    fileInput.addEventListener('change', () => this.handleFile());
    clearBtn?.addEventListener('click', () => this.reset());
  }

  private q(sel: string): HTMLElement | null { return this.container.querySelector(sel); }

  private reset(): void {
    const fileInput = this.q('#file') as HTMLInputElement;
    fileInput.value = '';
    (this.q('#file-info') as HTMLElement).style.display = 'none';
    (this.q('#status') as HTMLElement).style.display = 'none';
    (this.q('#summary') as HTMLElement).style.display = 'none';
    (this.q('#details') as HTMLElement).innerHTML = '<div class="no-matches">No file loaded</div>';
  }

  private async handleFile(): Promise<void> {
    const input = this.q('#file') as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    (this.q('#file-info') as HTMLElement).style.display = 'block';
    (this.q('#file-info') as HTMLElement).textContent = `${file.name} • ${this.formatBytes(file.size)}`;

    try {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      const ascii = this.toAscii(bytes);
      const analysis = this.analyze(ascii);
      this.renderResult(analysis);
    } catch (e) {
      this.renderError((e as Error).message);
    }
  }

  private formatBytes(n: number): string {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n/1024).toFixed(1)} KB`;
    return `${(n/1024/1024).toFixed(1)} MB`;
  }

  private toAscii(bytes: Uint8Array): string {
    let s = '';
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return s;
  }

  private analyze(ascii: string): {
    isSigned: boolean;
    indicators: Array<{ label: string; count: number }>;
    snippets: string[];
  } {
    const indicators: Array<{ label: string; regex: RegExp }> = [
      { label: 'Type /Sig', regex: /\/Type\s*\/Sig\b/g },
      { label: 'ByteRange', regex: /\/ByteRange\s*\[/g },
      { label: 'Contents', regex: /\/Contents\s*</g },
      { label: 'AcroForm', regex: /\/AcroForm\b/g },
    ];
    const counts = indicators.map(i => ({ label: i.label, count: (ascii.match(i.regex) || []).length }));
    const isSigned = counts.some(c => c.count > 0 && (c.label === 'Type /Sig' || c.label === 'ByteRange' || c.label === 'Contents'));

    // Extract a few ByteRange snippets for context
    const snippets: string[] = [];
    const br = ascii.match(/\/ByteRange\s*\[[^\]]+\]/g);
    if (br) {
      br.slice(0, 5).forEach(m => snippets.push(m.slice(0, 200)));
    }
    const sigObjs = ascii.match(/\/Type\s*\/Sig[^>]*>>/g);
    if (sigObjs) {
      sigObjs.slice(0, 3).forEach(m => snippets.push(m.slice(0, 200)));
    }

    return { isSigned, indicators: counts, snippets };
  }

  private renderResult(res: { isSigned: boolean; indicators: Array<{ label: string; count: number }>; snippets: string[] }): void {
    const status = this.q('#status') as HTMLElement;
    status.style.display = 'block';
    status.className = `validation-message ${res.isSigned ? 'validation-success' : 'validation-warning'}`;
    status.innerHTML = `${res.isSigned ? getIcon('check') + ' Signed PDF detected' : getIcon('alert') + ' No signature markers found'}`;

    const summary = this.q('#summary') as HTMLElement;
    summary.style.display = 'block';
    summary.innerHTML = res.indicators.map(i => `
      <div class="summary-item"><span class="summary-label">${i.label}:</span> <span class="summary-value">${i.count}</span></div>
    `).join('');

    const details = this.q('#details') as HTMLElement;
    if (res.snippets.length === 0) {
      details.innerHTML = '<div class="no-matches">No signature object snippets</div>';
    } else {
      details.innerHTML = res.snippets.map((s, idx) => `
        <div class="match-item">
          <div class="match-header"><span class="match-number">Snippet ${idx + 1}</span></div>
          <div class="match-content"><code class="match-text">${this.escapeHtml(s)}</code></div>
        </div>
      `).join('');
    }
  }

  private renderError(msg: string): void {
    const status = this.q('#status') as HTMLElement;
    status.style.display = 'block';
    status.className = 'validation-message validation-error';
    status.innerHTML = `${getIcon('alert')} ${this.escapeHtml(msg)}`;
    (this.q('#summary') as HTMLElement).style.display = 'none';
    (this.q('#details') as HTMLElement).innerHTML = '';
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  public destroy(): void {}
}


