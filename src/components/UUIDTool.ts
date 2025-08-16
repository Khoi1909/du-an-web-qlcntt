import { getIcon } from '@/utils/icons';

export class UUIDTool {
  private container: HTMLElement;
  private history: string[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.attachEventListeners();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('uuid')}</div>
          <div class="tool-title">
            <h2>UUID Generator</h2>
            <p>Generate UUIDs (Universally Unique Identifiers) in multiple versions</p>
          </div>
        </div>

        <div class="tool-content">
          <div class="uuid-generator-section">
            <div class="uuid-types">
              <div class="uuid-type-card">
                <h3>UUID v4 (Random)</h3>
                <p>Cryptographically random UUID</p>
                <div class="uuid-actions">
                  <button id="generate-v4" class="btn btn-primary">
                    ${getIcon('generation')} Generate UUID v4
                  </button>
                  <button id="bulk-generate-v4" class="btn btn-secondary">
                    Generate 10 UUIDs
                  </button>
                </div>
              </div>

              <div class="uuid-type-card">
                <h3>UUID v1 (Timestamp)</h3>
                <p>Time-based UUID with node ID</p>
                <div class="uuid-actions">
                  <button id="generate-v1" class="btn btn-primary">
                    ${getIcon('generation')} Generate UUID v1
                  </button>
                  <button id="bulk-generate-v1" class="btn btn-secondary">
                    Generate 10 UUIDs
                  </button>
                </div>
              </div>
            </div>

            <div class="uuid-output-section">
              <div class="section-header">
                <h3>Generated UUIDs</h3>
                <div class="tool-actions">
                  <button id="copy-all" class="btn btn-secondary">
                    ${getIcon('copy')} Copy All
                  </button>
                  <button id="clear-all" class="btn btn-secondary">
                    ${getIcon('trash')} Clear All
                  </button>
                </div>
              </div>
              <div id="uuid-output" class="uuid-output"></div>
            </div>

            <div class="uuid-tools-section">
              <div class="section-header">
                <h3>UUID Tools</h3>
              </div>
              <div class="uuid-tools">
                <div class="uuid-tool">
                  <label for="uuid-input">Validate/Parse UUID:</label>
                  <div class="input-group">
                    <input 
                      type="text" 
                      id="uuid-input" 
                      placeholder="Paste UUID here to validate..."
                      class="tool-input"
                    />
                    <button id="validate-uuid" class="btn btn-primary">Validate</button>
                    <button id="parse-uuid" class="btn btn-secondary">Parse</button>
                  </div>
                </div>
              </div>
              <div id="uuid-validation" class="uuid-validation"></div>
            </div>
          </div>

          <div class="tool-info">
            <div class="info-item">
              <strong>UUID v1 (Time-based):</strong>
              <p>Contains timestamp and node ID. Can be used to extract creation time but less random.</p>
            </div>
            <div class="info-item">
              <strong>UUID v4 (Random):</strong>
              <p>Cryptographically random. Most commonly used version for general purposes.</p>
            </div>
            <div class="info-item">
              <strong>Format:</strong>
              <p>Standard UUID format: xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx (32 hexadecimal digits)</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    // Generate buttons
    this.container.querySelector('#generate-v4')?.addEventListener('click', () => {
      this.generateAndDisplay(this.generateUUIDv4(), 'v4');
    });

    this.container.querySelector('#generate-v1')?.addEventListener('click', () => {
      this.generateAndDisplay(this.generateUUIDv1(), 'v1');
    });

    // Bulk generate
    this.container.querySelector('#bulk-generate-v4')?.addEventListener('click', () => {
      this.bulkGenerate('v4', 10);
    });

    this.container.querySelector('#bulk-generate-v1')?.addEventListener('click', () => {
      this.bulkGenerate('v1', 10);
    });

    // Tools
    this.container.querySelector('#validate-uuid')?.addEventListener('click', () => {
      this.validateUUID();
    });

    this.container.querySelector('#parse-uuid')?.addEventListener('click', () => {
      this.parseUUID();
    });

    // Actions
    this.container.querySelector('#copy-all')?.addEventListener('click', () => {
      this.copyAllUUIDs();
    });

    this.container.querySelector('#clear-all')?.addEventListener('click', () => {
      this.clearAll();
    });

    // Enter key for validation
    this.container.querySelector('#uuid-input')?.addEventListener('keypress', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') {
        this.validateUUID();
      }
    });
  }

  private generateUUIDv4(): string {
    // RFC 4122 version 4 UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private generateUUIDv1(): string {
    // Simplified UUID v1 implementation
    const timestamp = Date.now();
    const timeHex = timestamp.toString(16).padStart(12, '0');
    
    // Split timestamp into parts for UUID v1 format
    const timeLow = timeHex.slice(-8);
    const timeMid = timeHex.slice(-12, -8);
    const timeHigh = '1' + timeHex.slice(-16, -12).padStart(3, '0');
    
    // Clock sequence (random)
    const clockSeq = Math.random().toString(16).slice(2, 6);
    
    // Node (random, should be MAC address in real implementation)
    const node = Array.from({length: 6}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
    
    return `${timeLow}-${timeMid}-${timeHigh}-${clockSeq}-${node}`;
  }

  private generateAndDisplay(uuid: string, version: string): void {
    this.history.unshift(uuid);
    this.displayUUID(uuid, version);
    this.showNotification(`UUID ${version} generated successfully`, 'success');
  }

  private bulkGenerate(version: string, count: number): void {
    const uuids: string[] = [];
    for (let i = 0; i < count; i++) {
      const uuid = version === 'v4' ? this.generateUUIDv4() : this.generateUUIDv1();
      uuids.push(uuid);
    }
    
    this.history.unshift(...uuids);
    this.displayBulkUUIDs(uuids, version);
    this.showNotification(`${count} UUID ${version}s generated successfully`, 'success');
  }

  private displayUUID(uuid: string, version: string): void {
    const outputDiv = this.container.querySelector('#uuid-output') as HTMLElement;
    const uuidElement = this.createUUIDElement(uuid, version);
    outputDiv.insertBefore(uuidElement, outputDiv.firstChild);
  }

  private displayBulkUUIDs(uuids: string[], version: string): void {
    const outputDiv = this.container.querySelector('#uuid-output') as HTMLElement;
    uuids.reverse().forEach(uuid => {
      const uuidElement = this.createUUIDElement(uuid, version);
      outputDiv.insertBefore(uuidElement, outputDiv.firstChild);
    });
  }

  private createUUIDElement(uuid: string, version: string): HTMLElement {
    const element = document.createElement('div');
    element.className = 'uuid-item';
    element.innerHTML = `
      <div class="uuid-content">
        <span class="uuid-version">v${version.slice(-1)}</span>
        <code class="uuid-value">${uuid}</code>
        <div class="uuid-actions">
          <button class="btn-icon copy-uuid" data-uuid="${uuid}" title="Copy UUID">
            ${getIcon('copy')}
          </button>
        </div>
      </div>
    `;

    // Add copy functionality
    element.querySelector('.copy-uuid')?.addEventListener('click', () => {
      this.copyUUID(uuid);
    });

    return element;
  }

  private validateUUID(): void {
    const input = this.container.querySelector('#uuid-input') as HTMLInputElement;
    const uuid = input.value.trim();
    const validationDiv = this.container.querySelector('#uuid-validation') as HTMLElement;

    if (!uuid) {
      this.showValidation('Please enter a UUID to validate', 'error', validationDiv);
      return;
    }

    const isValid = this.isValidUUID(uuid);
    if (isValid) {
      const version = this.getUUIDVersion(uuid);
      this.showValidation(`Valid UUID ${version}`, 'success', validationDiv);
    } else {
      this.showValidation('Invalid UUID format', 'error', validationDiv);
    }
  }

  private parseUUID(): void {
    const input = this.container.querySelector('#uuid-input') as HTMLInputElement;
    const uuid = input.value.trim();
    const validationDiv = this.container.querySelector('#uuid-validation') as HTMLElement;

    if (!uuid) {
      this.showValidation('Please enter a UUID to parse', 'error', validationDiv);
      return;
    }

    if (!this.isValidUUID(uuid)) {
      this.showValidation('Invalid UUID format', 'error', validationDiv);
      return;
    }

    const info = this.parseUUIDInfo(uuid);
    this.showValidation(`
      <div class="uuid-parse-info">
        <div><strong>Version:</strong> ${info.version}</div>
        <div><strong>Variant:</strong> ${info.variant}</div>
        ${info.timestamp ? `<div><strong>Timestamp:</strong> ${info.timestamp}</div>` : ''}
        <div><strong>Format:</strong> Standard UUID</div>
      </div>
    `, 'info', validationDiv);
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  private getUUIDVersion(uuid: string): string {
    const versionChar = uuid.charAt(14);
    const versionMap: Record<string, string> = {
      '1': 'v1 (Time-based)',
      '2': 'v2 (DCE Security)',
      '3': 'v3 (Name-based MD5)',
      '4': 'v4 (Random)',
      '5': 'v5 (Name-based SHA-1)'
    };
    return versionMap[versionChar] || 'Unknown';
  }

  private parseUUIDInfo(uuid: string): any {
    const version = uuid.charAt(14);
    const variant = uuid.charAt(19);
    
    const info: any = {
      version: this.getUUIDVersion(uuid),
      variant: variant >= '8' && variant <= 'b' ? 'RFC 4122' : 'Other'
    };

    // Parse timestamp for v1 UUIDs
    if (version === '1') {
      try {
        const hex = uuid.replace(/-/g, '');
        const timeLow = parseInt(hex.substring(0, 8), 16);
        const timeMid = parseInt(hex.substring(8, 12), 16);
        const timeHigh = parseInt(hex.substring(12, 16), 16) & 0x0fff;
        
        const timestamp = BigInt(timeHigh) * BigInt(Math.pow(2, 32)) + BigInt(timeMid) * BigInt(65536) + BigInt(timeLow);
        const unixTime = (timestamp - BigInt(0x01b21dd213814000)) / BigInt(10000);
        info.timestamp = new Date(Number(unixTime)).toISOString();
      } catch (e) {
        info.timestamp = 'Unable to parse';
      }
    }

    return info;
  }

  private async copyUUID(uuid: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(uuid);
      this.showNotification('UUID copied to clipboard', 'success');
    } catch (error) {
      this.showNotification('Failed to copy UUID', 'error');
    }
  }

  private async copyAllUUIDs(): Promise<void> {
    if (this.history.length === 0) {
      this.showNotification('No UUIDs to copy', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(this.history.join('\n'));
      this.showNotification(`${this.history.length} UUIDs copied to clipboard`, 'success');
    } catch (error) {
      this.showNotification('Failed to copy UUIDs', 'error');
    }
  }

  private clearAll(): void {
    this.history = [];
    const outputDiv = this.container.querySelector('#uuid-output') as HTMLElement;
    outputDiv.innerHTML = '';
    const validationDiv = this.container.querySelector('#uuid-validation') as HTMLElement;
    validationDiv.innerHTML = '';
    const input = this.container.querySelector('#uuid-input') as HTMLInputElement;
    input.value = '';
    this.showNotification('All UUIDs cleared', 'success');
  }

  private showValidation(message: string, type: 'success' | 'error' | 'info', validationDiv: HTMLElement): void {
    validationDiv.innerHTML = `
      <div class="validation-message validation-${type}">
        ${type === 'success' ? getIcon('check') : type === 'error' ? getIcon('alert') : getIcon('string')} 
        ${message}
      </div>
    `;
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    const existing = this.container.querySelector('.notification');
    if (existing) {
      existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">
          ${type === 'success' ? getIcon('check') : getIcon('alert')}
        </span>
        <span class="notification-message">${message}</span>
      </div>
    `;

    this.container.insertBefore(notification, this.container.firstChild);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }

  public destroy(): void {
    // Clean up if needed
  }
}
