import { getIcon } from '@/utils/icons';
import QRCode from 'qrcode';

function buildWifiString(ssid: string, password: string, auth: string, hidden: boolean): string {
  // WIFI:T:<WPA|WEP|nopass>;S:<ssid>;P:<password>;H:true;;
  const esc = (s: string) => s.replace(/([\\;,:\"])/g, '\\$1');
  const t = auth === 'none' ? 'nopass' : (auth.toUpperCase());
  const parts = [`T:${t}`, `S:${esc(ssid)}`];
  if (t !== 'nopass') parts.push(`P:${esc(password)}`);
  if (hidden) parts.push('H:true');
  return `WIFI:${parts.join(';')};`;
}

export class WifiQrGeneratorTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('generation')}</div><div class="tool-title"><h2>WiFi QR Code generator</h2><p>Share WiFi credentials easily</p></div></div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Network</h3></div>
            <div class="input-group">
              <label>SSID</label><input id="ssid" class="tool-input" placeholder="MyWiFi" />
              <label>Password</label><input id="pwd" class="tool-input" placeholder="password" />
              <label>Security</label>
              <select id="auth" class="tool-input"><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="none">Open</option></select>
              <label>Hidden network</label><div class="checkbox-field"><input id="hidden" type="checkbox" /></div>
            </div>
            <div class="tool-actions"><button id="gen" class="btn btn-primary">${getIcon('generation')} Generate</button></div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>QR</h3></div>
            <div id="preview"></div>
          </div>
        </div>
      </div>`;
  }

  private bind(): void { this.container.querySelector('#gen')?.addEventListener('click', () => this.generate()); }

  private async generate(): Promise<void> {
    const ssid = (this.container.querySelector('#ssid') as HTMLInputElement).value.trim();
    const pwd = (this.container.querySelector('#pwd') as HTMLInputElement).value;
    const auth = (this.container.querySelector('#auth') as HTMLSelectElement).value;
    const hidden = (this.container.querySelector('#hidden') as HTMLInputElement).checked;
    const preview = this.container.querySelector('#preview') as HTMLElement;
    const payload = buildWifiString(ssid, pwd, auth, hidden);
    try {
      const dataUrl = await QRCode.toDataURL(payload, { width: 220, margin: 1, errorCorrectionLevel: 'M' });
      const img = new Image(); img.src = dataUrl; img.width = 220; img.height = 220; img.alt = 'WiFi QR';
      preview.innerHTML = ''; preview.appendChild(img);
    } catch (e) {
      preview.innerHTML = `<p class="output-error">Failed to generate QR: ${(e as Error).message}</p>`;
    }
  }
}


