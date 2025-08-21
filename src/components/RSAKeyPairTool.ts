import { getIcon } from '@/utils/icons';

function arrayBufferToPem(buffer: ArrayBuffer, label: string): string {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  const lines = base64.match(/.{1,64}/g) || [];
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
}

export class RSAKeyPairTool {
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
            <h2>RSA key pair generator</h2>
            <p>Generate RSA-OAEP keys and export as PEM</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Options</h3></div>
            <label class="checkbox">Modulus length:
              <select id="modlen" class="tool-input" style="max-width:160px">
                <option value="2048">2048</option>
                <option value="3072">3072</option>
                <option value="4096">4096</option>
              </select>
            </label>
            <div class="tool-actions" style="margin-top:8px">
              <button id="gen" class="btn btn-primary">${getIcon('generation')} Generate</button>
            </div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Public key (PEM)</h3><div class="tool-actions"><button id="copy-pub" class="btn btn-secondary">${getIcon('copy')} Copy</button></div></div>
            <textarea id="pub" class="tool-textarea" rows="8" readonly></textarea>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Private key (PKCS8 PEM)</h3><div class="tool-actions"><button id="copy-priv" class="btn btn-secondary">${getIcon('copy')} Copy</button></div></div>
            <textarea id="priv" class="tool-textarea" rows="10" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    const modsel = this.container.querySelector('#modlen') as HTMLSelectElement;
    const pub = this.container.querySelector('#pub') as HTMLTextAreaElement;
    const priv = this.container.querySelector('#priv') as HTMLTextAreaElement;

    this.container.querySelector('#gen')?.addEventListener('click', async () => {
      try {
        const keyPair = await crypto.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: parseInt(modsel.value, 10), publicExponent: new Uint8Array([1,0,1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt']);
        const spki = await crypto.subtle.exportKey('spki', keyPair.publicKey);
        const pkcs8 = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
        pub.value = arrayBufferToPem(spki, 'PUBLIC KEY');
        priv.value = arrayBufferToPem(pkcs8, 'PRIVATE KEY');
      } catch {
        pub.value = 'Generation failed';
        priv.value = '';
      }
    });

    this.container.querySelector('#copy-pub')?.addEventListener('click', async () => { if (pub.value) { try { await navigator.clipboard.writeText(pub.value); } catch {} } });
    this.container.querySelector('#copy-priv')?.addEventListener('click', async () => { if (priv.value) { try { await navigator.clipboard.writeText(priv.value); } catch {} } });
  }

  public destroy(): void {}
}


