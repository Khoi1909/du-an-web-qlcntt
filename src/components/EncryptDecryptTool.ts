import { getIcon } from '@/utils/icons';

async function deriveKey(password: string, salt: Uint8Array, algo: 'AES-GCM-256' | 'AES-GCM-128'): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, baseKey, { name: 'AES-GCM', length: algo === 'AES-GCM-256' ? 256 : 128 }, false, ['encrypt', 'decrypt']);
  return key;
}

function bufToB64(arr: ArrayBuffer): string {
  const bytes = new Uint8Array(arr); let s = ''; for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s);
}
function b64ToBuf(b64: string): Uint8Array { const s = atob(b64); const arr = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) arr[i] = s.charCodeAt(i); return arr; }

export class EncryptDecryptTool {
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
          <div class="tool-icon">${getIcon('lock')}</div>
          <div class="tool-title">
            <h2>Encrypt / decrypt text</h2>
            <p>AES-GCM with PBKDF2 key derivation (client-side)</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header">
              <h3>Options</h3>
              <div class="tool-actions">
                <select id="strength" class="tool-input" style="max-width:180px">
                  <option value="AES-GCM-256">AES-GCM-256</option>
                  <option value="AES-GCM-128">AES-GCM-128</option>
                </select>
              </div>
            </div>
            <input id="password" class="tool-input" type="password" placeholder="Password" />
            <div style="height:8px"></div>
            <textarea id="plain" class="tool-textarea" rows="6" placeholder="Enter plaintext or paste ciphertext JSON"></textarea>
            <div class="tool-actions" style="margin-top:8px">
              <button id="enc" class="btn btn-primary">${getIcon('lock')} Encrypt</button>
              <button id="dec" class="btn btn-primary">${getIcon('unlock')} Decrypt</button>
              <button id="clear" class="btn btn-secondary">${getIcon('trash')} Clear</button>
            </div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Output</h3><div class="tool-actions"><button id="copy" class="btn btn-secondary">${getIcon('copy')} Copy</button></div></div>
            <textarea id="out" class="tool-textarea" rows="6" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    const strength = this.container.querySelector('#strength') as HTMLSelectElement;
    const pwd = this.container.querySelector('#password') as HTMLInputElement;
    const plain = this.container.querySelector('#plain') as HTMLTextAreaElement;
    const out = this.container.querySelector('#out') as HTMLTextAreaElement;

    this.container.querySelector('#enc')?.addEventListener('click', async () => {
      try {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(pwd.value, salt, strength.value as any);
        const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plain.value));
        const payload = { alg: strength.value, salt: bufToB64(salt), iv: bufToB64(iv), data: bufToB64(cipher) };
        out.value = JSON.stringify(payload);
      } catch { out.value = 'Encryption error'; }
    });

    this.container.querySelector('#dec')?.addEventListener('click', async () => {
      try {
        const payload = JSON.parse(plain.value);
        const salt = b64ToBuf(payload.salt);
        const iv = b64ToBuf(payload.iv);
        const data = b64ToBuf(payload.data);
        const key = await deriveKey(pwd.value, salt, payload.alg);
        const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
        out.value = new TextDecoder().decode(plainBuf);
      } catch { out.value = 'Decryption error'; }
    });

    this.container.querySelector('#clear')?.addEventListener('click', () => { plain.value=''; out.value=''; pwd.value=''; });
    this.container.querySelector('#copy')?.addEventListener('click', async () => { if (out.value) { try { await navigator.clipboard.writeText(out.value); } catch {} } });
  }

  public destroy(): void {}
}


