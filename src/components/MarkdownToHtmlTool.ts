import { getIcon } from '@/utils/icons';

export class MarkdownToHtmlTool {
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
          <div class="tool-icon">${getIcon('conversion')}</div>
          <div class="tool-title">
            <h2>Markdown to HTML</h2>
            <p>Convert basic Markdown to HTML with live preview</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="converter-layout">
            <div class="converter-section">
              <div class="section-header"><h3>Markdown</h3></div>
              <textarea id="md-input" class="tool-textarea converter-textarea" rows="12" placeholder="# Title\n\n**Bold** _Italic_\n\n- Item 1\n- Item 2"></textarea>
            </div>
            <div class="converter-section">
              <div class="section-header"><h3>HTML</h3></div>
              <textarea id="html-output" class="tool-textarea converter-textarea" rows="12" readonly></textarea>
            </div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Preview</h3></div>
            <div id="preview" class="tool-preview" style="padding:12px;border:1px solid #e5e7eb;border-radius:8px"></div>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    const md = this.container.querySelector('#md-input') as HTMLTextAreaElement;
    const html = this.container.querySelector('#html-output') as HTMLTextAreaElement;
    const preview = this.container.querySelector('#preview') as HTMLDivElement;
    const update = () => {
      const out = this.simpleMarkdown(md.value);
      html.value = out;
      preview.innerHTML = out;
    };
    md.addEventListener('input', update);
    update();
  }

  // Minimal MD to HTML converter (headings, bold, italic, code, lists, links)
  private simpleMarkdown(src: string): string {
    let s = src;
    // Escape HTML first
    s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // Headings
    s = s.replace(/^######\s?(.*)$/gm, '<h6>$1</h6>')
         .replace(/^#####\s?(.*)$/gm, '<h5>$1</h5>')
         .replace(/^####\s?(.*)$/gm, '<h4>$1</h4>')
         .replace(/^###\s?(.*)$/gm, '<h3>$1</h3>')
         .replace(/^##\s?(.*)$/gm, '<h2>$1</h2>')
         .replace(/^#\s?(.*)$/gm, '<h1>$1</h1>');
    // Bold/Italic/Code
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
         .replace(/_(.+?)_/g, '<em>$1</em>')
         .replace(/`([^`]+)`/g, '<code>$1</code>');
    // Links [text](url)
    s = s.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    // Lists (very simple)
    s = s.replace(/(?:^|\n)(?:-\s.+\n?)+/g, (block) => {
      const items = block.trim().split(/\n/).map(line => line.replace(/^[-*]\s+/, ''));
      return '<ul>' + items.map(i => `<li>${i}</li>`).join('') + '</ul>';
    });
    // Paragraphs
    s = s.split(/\n{2,}/).map(p => /<h\d|<ul>/.test(p) ? p : `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('\n');
    return s;
  }

  public destroy(): void {}
}

