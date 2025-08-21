import { getIcon } from '@/utils/icons';

export class EmailNormalizerTool {
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
          <div class="tool-icon">${getIcon('string')}</div>
          <div class="tool-title">
            <h2>Email normalizer</h2>
            <p>Normalize emails (trim, lowercase local/domain, provider rules)</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header">
              <h3>Options</h3>
              <div class="tool-actions">
                <label class="checkbox"><input id="lower-local" type="checkbox" checked> Lowercase local</label>
                <label class="checkbox"><input id="lower-domain" type="checkbox" checked> Lowercase domain</label>
                <label class="checkbox"><input id="remove-dots" type="checkbox" checked> Gmail remove dots</label>
                <label class="checkbox"><input id="strip-plus" type="checkbox" checked> Strip +tag</label>
              </div>
            </div>
            <textarea id="email-input" class="tool-textarea" rows="6" placeholder="Ex: John.Doe+news@gmail.com\nUser@mail.EXAMPLE.com"></textarea>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Output</h3></div>
            <textarea id="email-output" class="tool-textarea" rows="6" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    const input = this.container.querySelector('#email-input') as HTMLTextAreaElement;
    const output = this.container.querySelector('#email-output') as HTMLTextAreaElement;
    const lowerLocal = this.container.querySelector('#lower-local') as HTMLInputElement;
    const lowerDomain = this.container.querySelector('#lower-domain') as HTMLInputElement;
    const removeDots = this.container.querySelector('#remove-dots') as HTMLInputElement;
    const stripPlus = this.container.querySelector('#strip-plus') as HTMLInputElement;
    const update = () => {
      const lines = input.value.split(/\r?\n/).filter(Boolean);
      const normalized = lines.map(line => this.normalize(line, {
        lowerLocal: lowerLocal.checked,
        lowerDomain: lowerDomain.checked,
        gmailRemoveDots: removeDots.checked,
        stripPlus: stripPlus.checked,
      }));
      output.value = normalized.join('\n');
    };
    input.addEventListener('input', update);
    lowerLocal.addEventListener('change', update);
    lowerDomain.addEventListener('change', update);
    removeDots.addEventListener('change', update);
    stripPlus.addEventListener('change', update);
    update();
  }

  private normalize(email: string, opts: { lowerLocal: boolean; lowerDomain: boolean; gmailRemoveDots: boolean; stripPlus: boolean }): string {
    let e = email.trim();
    const at = e.indexOf('@');
    if (at < 0) return e;
    let local = e.slice(0, at);
    let domain = e.slice(at + 1);
    if (opts.lowerLocal) local = local.toLowerCase();
    if (opts.lowerDomain) domain = domain.toLowerCase();
    if (opts.stripPlus) local = local.replace(/\+.*/, '');
    // gmail rules
    if (opts.gmailRemoveDots && /(^gmail\.com$|^googlemail\.com$)/i.test(domain)) {
      local = local.replace(/\./g, '');
    }
    return `${local}@${domain}`;
  }

  public destroy(): void {}
}

