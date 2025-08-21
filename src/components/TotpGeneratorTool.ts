import { getIcon } from '@/utils/icons';

function base32Decode(input: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = input.replace(/=+$/,'').toUpperCase().replace(/\s+/g,'');
  let bits = 0, value = 0; const out: number[] = [];
  for (const ch of clean) {
    const idx = alphabet.indexOf(ch);
    if (idx === -1) continue;
    value = (value << 5) | idx; bits += 5;
    if (bits >= 8) { out.push((value >>> (bits - 8)) & 0xff); bits -= 8; }
  }
  return new Uint8Array(out);
}

async function hmacSha1(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, data);
  return new Uint8Array(sig);
}

async function totp(secretB32: string, timeStepSec = 30, digits = 6): Promise<string> {
  const key = base32Decode(secretB32);
  const counter = Math.floor(Date.now() / 1000 / timeStepSec);
  const msg = new Uint8Array(8);
  for (let i = 7, v = counter; i >= 0; i--) { msg[i] = v & 0xff; v = Math.floor(v / 256); }
  const h = await hmacSha1(key, msg);
  const offset = h[h.length - 1] & 0x0f;
  const bin = ((h[offset] & 0x7f) << 24) | (h[offset+1] << 16) | (h[offset+2] << 8) | (h[offset+3]);
  const code = (bin % 10**digits).toString().padStart(digits, '0');
  return code;
}

export class TotpGeneratorTool {
  private container: HTMLElement;
  private timer?: number;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('generation')}</div><div class="tool-title"><h2>OTP (TOTP) generator</h2><p>Time-based one-time passwords (RFC 6238)</p></div></div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Secret</h3></div>
            <input id="secret" class="tool-input" placeholder="Base32 secret (e.g. JBSWY3DPEHPK3PXP)" />
            <div class="input-group">
              <label>Digits</label>
              <select id="digits" class="tool-input"><option>6</option><option>8</option></select>
              <label>Step (sec)</label>
              <input id="step" type="number" class="tool-input" value="30" min="10" max="120" />
            </div>
            <div class="tool-actions"><button id="start" class="btn btn-primary">${getIcon('generation')} Start</button><button id="stop" class="btn btn-secondary">Stop</button></div>
            <div class="results-summary" style="margin-top:8px">
              <div class="summary-item"><span class="summary-label">Code:</span> <span id="code" class="summary-value">-</span></div>
              <div class="summary-item"><span class="summary-label">Refresh in:</span> <span id="remain" class="summary-value">-</span></div>
            </div>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    this.container.querySelector('#start')?.addEventListener('click', () => this.start());
    this.container.querySelector('#stop')?.addEventListener('click', () => this.stop());
  }

  private async tick(): Promise<void> {
    const secret = (this.container.querySelector('#secret') as HTMLInputElement).value.trim();
    const digits = parseInt((this.container.querySelector('#digits') as HTMLSelectElement).value, 10);
    const step = parseInt((this.container.querySelector('#step') as HTMLInputElement).value, 10);
    if (!secret) { (this.container.querySelector('#code') as HTMLElement).textContent = '-'; (this.container.querySelector('#remain') as HTMLElement).textContent = '-'; return; }
    try {
      const code = await totp(secret, step, digits);
      (this.container.querySelector('#code') as HTMLElement).textContent = code;
    } catch { (this.container.querySelector('#code') as HTMLElement).textContent = 'Invalid secret'; }
    const remain = step - (Math.floor(Date.now()/1000) % step);
    (this.container.querySelector('#remain') as HTMLElement).textContent = `${remain}s`;
  }

  private start(): void {
    if (this.timer) return;
    this.tick();
    this.timer = window.setInterval(() => this.tick(), 1000);
  }

  private stop(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = undefined; }
  }
}


