import { getIcon } from '@/utils/icons';

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function textToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

export class HmacTool {
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
          <div class="tool-icon">${getIcon('hash')}</div>
          <div class="tool-title">
            <h2>HMAC generator</h2>
            <p>Generate HMAC with SHA-256 or SHA-512; output as hex or Base64</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header">
              <h3>Input</h3>
              <div class="tool-actions">
                <select id="algo" class="tool-input" style="max-width:160px">
                  <option value="SHA-256">SHA-256</option>
                  <option value="SHA-512">SHA-512</option>
                </select>
                <select id="encoding" class="tool-input" style="max-width:160px">
                  <option value="hex">Hex</option>
                  <option value="base64">Base64</option>
                </select>
              </div>
            </div>
            <label>Secret key</label>
            <input id="secret" class="tool-input" placeholder="Enter secret" />
            <div style="height:8px"></div>
            <label>Message</label>
            <textarea id="message" class="tool-textarea" rows="6" placeholder="Enter message to sign"></textarea>
            <div class="tool-actions" style="margin-top:8px">
              <button id="sign" class="btn btn-primary">${getIcon('lock')} Generate HMAC</button>
              <button id="clear" class="btn btn-secondary">${getIcon('trash')} Clear</button>
            </div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Output</h3>
              <div class="tool-actions">
                <button id="copy" class="btn btn-secondary">${getIcon('copy')} Copy</button>
              </div>
            </div>
            <textarea id="output" class="tool-textarea" rows="4" readonly></textarea>
          </div>
        </div>
      </div>
    `;
  }

  private bind(): void {
    const algoSel = this.container.querySelector('#algo') as HTMLSelectElement;
    const encSel = this.container.querySelector('#encoding') as HTMLSelectElement;
    const secretEl = this.container.querySelector('#secret') as HTMLInputElement;
    const msgEl = this.container.querySelector('#message') as HTMLTextAreaElement;
    const outEl = this.container.querySelector('#output') as HTMLTextAreaElement;
    const copyBtn = this.container.querySelector('#copy') as HTMLButtonElement;

    this.container.querySelector('#sign')?.addEventListener('click', async () => {
      try {
        const key = await crypto.subtle.importKey(
          'raw',
          textToBytes(secretEl.value),
          { name: 'HMAC', hash: algoSel.value },
          false,
          ['sign']
        );
        const sig = await crypto.subtle.sign('HMAC', key, textToBytes(msgEl.value));
        outEl.value = encSel.value === 'hex' ? toHex(sig) : toBase64(sig);
      } catch (e) {
        outEl.value = 'Error generating HMAC';
      }
    });

    this.container.querySelector('#clear')?.addEventListener('click', () => {
      secretEl.value = '';
      msgEl.value = '';
      outEl.value = '';
    });

    copyBtn.addEventListener('click', async () => {
      if (!outEl.value) return;
      try { await navigator.clipboard.writeText(outEl.value); } catch {}
    });
  }

  public destroy(): void {}
}


