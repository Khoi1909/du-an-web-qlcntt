import { getIcon } from '@/utils/icons';

// Lightweight bcrypt replacement note: true bcrypt is heavy in browser. Here we emulate using PBKDF2 for demo.
async function bcryptLike(password: string, salt: string, rounds: number): Promise<string> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(salt), iterations: Math.max(1, rounds * 1000), hash: 'SHA-256' }, baseKey, 256);
  const hash = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `$demo$${rounds}$${btoa(salt)}$${hash}`;
}

export class BcryptTool {
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
            <h2>Bcrypt (demo)</h2>
            <p>Hash and verify (PBKDF2-based demo in browser)</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Hash</h3></div>
            <input id="pwd" type="password" class="tool-input" placeholder="Password" />
            <div style="height:8px"></div>
            <label>Salt</label>
            <input id="salt" class="tool-input" placeholder="auto (blank)" />
            <div class="tool-actions" style="margin-top:8px">
              <label class="checkbox">Rounds: <input id="rounds" type="number" value="10" min="4" max="14" class="tool-input" style="width:80px"></label>
              <button id="do-hash" class="btn btn-primary">${getIcon('lock')} Hash</button>
            </div>
            <textarea id="hash-out" class="tool-textarea" rows="3" readonly></textarea>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Verify</h3></div>
            <input id="verify-pwd" type="password" class="tool-input" placeholder="Password" />
            <div style="height:8px"></div>
            <input id="verify-hash" class="tool-input" placeholder="Paste hash from above" />
            <div class="tool-actions" style="margin-top:8px">
              <button id="do-verify" class="btn btn-primary">${getIcon('check')} Verify</button>
              <span id="verify-status" style="margin-left:8px"></span>
            </div>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    const enc = new TextEncoder();
    const pwd = this.container.querySelector('#pwd') as HTMLInputElement;
    const salt = this.container.querySelector('#salt') as HTMLInputElement;
    const rounds = this.container.querySelector('#rounds') as HTMLInputElement;
    const out = this.container.querySelector('#hash-out') as HTMLTextAreaElement;
    const vPwd = this.container.querySelector('#verify-pwd') as HTMLInputElement;
    const vHash = this.container.querySelector('#verify-hash') as HTMLInputElement;
    const vStatus = this.container.querySelector('#verify-status') as HTMLSpanElement;

    this.container.querySelector('#do-hash')?.addEventListener('click', async () => {
      const s = salt.value || crypto.getRandomValues(new Uint8Array(8)).reduce((a, b) => a + b.toString(16).padStart(2, '0'), '');
      const r = parseInt(rounds.value || '10', 10);
      out.value = await bcryptLike(pwd.value, s, r);
    });

    this.container.querySelector('#do-verify')?.addEventListener('click', async () => {
      try {
        const parts = vHash.value.split('$');
        const r = parseInt(parts[2], 10);
        const saltDecoded = atob(parts[3]);
        const fresh = await bcryptLike(vPwd.value, saltDecoded, r);
        const ok = fresh === vHash.value;
        vStatus.textContent = ok ? 'Match' : 'No match';
        vStatus.style.color = ok ? '#22c55e' : '#ef4444';
      } catch {
        vStatus.textContent = 'Invalid hash';
        vStatus.style.color = '#ef4444';
      }
    });
  }

  public destroy(): void {}
}


