import { getIcon } from '@/utils/icons';

// Minimal ULID generator (time-based, Crockford base32)
const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function encodeBase32(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let output = '';
  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) {
      output += CROCKFORD[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += CROCKFORD[(value << (5 - bits)) & 31];
  return output;
}

function ulid(now: number = Date.now()): string {
  // 48-bit timestamp, 80-bit randomness → total 26 chars
  const timeBytes = new Uint8Array(6);
  let t = now;
  for (let i = 5; i >= 0; i--) { timeBytes[i] = t & 0xff; t = Math.floor(t / 256); }
  const rand = new Uint8Array(10);
  crypto.getRandomValues(rand);
  const timeStr = encodeBase32(timeBytes).slice(0, 10);
  const randStr = encodeBase32(rand).slice(0, 16);
  return (timeStr + randStr).slice(0, 26);
}

export class UlidGeneratorTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); this.generate(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('generation')}</div><div class="tool-title"><h2>ULID generator</h2><p>Monotonic-friendly unique IDs</p></div></div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Generate</h3></div>
            <div class="tool-actions"><button id="gen" class="btn btn-primary">${getIcon('generation')} Generate</button><button id="copy" class="btn btn-secondary">${getIcon('copy')} Copy</button></div>
            <input id="out" class="tool-input" readonly />
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    this.container.querySelector('#gen')?.addEventListener('click', () => this.generate());
    this.container.querySelector('#copy')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText((this.container.querySelector('#out') as HTMLInputElement).value); } catch {} });
  }

  private generate(): void { (this.container.querySelector('#out') as HTMLInputElement).value = ulid(); }
}


