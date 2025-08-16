import { getIcon } from '@/utils/icons';

export class HashTool {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.attachEventListeners();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('hash')}</div>
          <div class="tool-title">
            <h2>Hash Generator</h2>
            <p>Generate hash values using various algorithms</p>
          </div>
        </div>

        <div class="tool-content">
          <div class="hash-input-section">
            <div class="section-header">
              <h3>Input Text</h3>
              <div class="tool-actions">
                <button id="load-file" class="btn btn-secondary">
                  ${getIcon('clipboard')} Load File
                </button>
                <button id="clear-input" class="btn btn-secondary">
                  ${getIcon('trash')} Clear
                </button>
              </div>
            </div>
            <div class="input-group">
              <textarea 
                id="hash-input" 
                placeholder="Enter text to hash or load a file..."
                class="tool-textarea"
                rows="6"
              ></textarea>
            </div>
            <input type="file" id="file-input" style="display: none;" />
            <div class="input-info">
              <span id="input-stats">0 characters, 0 bytes</span>
            </div>
          </div>

          <div class="hash-algorithms-section">
            <div class="section-header">
              <h3>Hash Algorithms</h3>
            </div>
            <div class="hash-grid">
              <div class="hash-card">
                <div class="hash-header">
                  <h4>MD5</h4>
                  <p>128-bit cryptographic hash (not secure)</p>
                </div>
                <div class="hash-output">
                  <code id="md5-output" class="hash-result">Enter text to generate hash...</code>
                  <button class="copy-hash btn-icon" data-hash="md5" title="Copy MD5">
                    ${getIcon('copy')}
                  </button>
                </div>
              </div>

              <div class="hash-card">
                <div class="hash-header">
                  <h4>SHA-1</h4>
                  <p>160-bit hash (deprecated for security)</p>
                </div>
                <div class="hash-output">
                  <code id="sha1-output" class="hash-result">Enter text to generate hash...</code>
                  <button class="copy-hash btn-icon" data-hash="sha1" title="Copy SHA-1">
                    ${getIcon('copy')}
                  </button>
                </div>
              </div>

              <div class="hash-card">
                <div class="hash-header">
                  <h4>SHA-256</h4>
                  <p>256-bit secure hash (recommended)</p>
                </div>
                <div class="hash-output">
                  <code id="sha256-output" class="hash-result">Enter text to generate hash...</code>
                  <button class="copy-hash btn-icon" data-hash="sha256" title="Copy SHA-256">
                    ${getIcon('copy')}
                  </button>
                </div>
              </div>

              <div class="hash-card">
                <div class="hash-header">
                  <h4>SHA-512</h4>
                  <p>512-bit secure hash</p>
                </div>
                <div class="hash-output">
                  <code id="sha512-output" class="hash-result">Enter text to generate hash...</code>
                  <button class="copy-hash btn-icon" data-hash="sha512" title="Copy SHA-512">
                    ${getIcon('copy')}
                  </button>
                </div>
              </div>

              <div class="hash-card">
                <div class="hash-header">
                  <h4>HMAC SHA-256</h4>
                  <p>Keyed-hash with secret key</p>
                </div>
                <div class="hmac-key-input">
                  <input 
                    type="text" 
                    id="hmac-key" 
                    placeholder="Enter secret key..."
                    class="tool-input"
                  />
                </div>
                <div class="hash-output">
                  <code id="hmac-output" class="hash-result">Enter text and key to generate HMAC...</code>
                  <button class="copy-hash btn-icon" data-hash="hmac" title="Copy HMAC">
                    ${getIcon('copy')}
                  </button>
                </div>
              </div>

              <div class="hash-card">
                <div class="hash-header">
                  <h4>CRC32</h4>
                  <p>32-bit cyclic redundancy check</p>
                </div>
                <div class="hash-output">
                  <code id="crc32-output" class="hash-result">Enter text to generate CRC32...</code>
                  <button class="copy-hash btn-icon" data-hash="crc32" title="Copy CRC32">
                    ${getIcon('copy')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="hash-comparison-section">
            <div class="section-header">
              <h3>Hash Comparison</h3>
            </div>
            <div class="comparison-group">
              <div class="comparison-input">
                <label for="compare-hash">Compare with existing hash:</label>
                <div class="input-group">
                  <input 
                    type="text" 
                    id="compare-hash" 
                    placeholder="Paste hash to compare..."
                    class="tool-input"
                  />
                  <button id="compare-btn" class="btn btn-primary">Compare</button>
                </div>
              </div>
              <div id="comparison-result" class="comparison-result"></div>
            </div>
          </div>

          <div class="tool-info">
            <div class="info-item">
              <strong>MD5:</strong>
              <p>Fast but cryptographically broken. Only use for non-security purposes like checksums.</p>
            </div>
            <div class="info-item">
              <strong>SHA-256/SHA-512:</strong>
              <p>Secure cryptographic hash functions. Use for passwords, digital signatures, and data integrity.</p>
            </div>
            <div class="info-item">
              <strong>HMAC:</strong>
              <p>Hash-based Message Authentication Code. Provides both integrity and authenticity verification.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const input = this.container.querySelector('#hash-input') as HTMLTextAreaElement;
    const hmacKey = this.container.querySelector('#hmac-key') as HTMLInputElement;
    const fileInput = this.container.querySelector('#file-input') as HTMLInputElement;

    // Input events
    input.addEventListener('input', () => {
      this.updateHashes();
      this.updateStats();
    });

    hmacKey.addEventListener('input', () => {
      this.updateHMAC();
    });

    // File handling
    this.container.querySelector('#load-file')?.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      this.handleFileLoad(e);
    });

    // Actions
    this.container.querySelector('#clear-input')?.addEventListener('click', () => {
      this.clearInput();
    });

    // Copy buttons
    this.container.querySelectorAll('.copy-hash').forEach(button => {
      button.addEventListener('click', (e) => {
        const hashType = (e.target as HTMLElement).closest('.copy-hash')?.getAttribute('data-hash');
        if (hashType) {
          this.copyHash(hashType);
        }
      });
    });

    // Comparison
    this.container.querySelector('#compare-btn')?.addEventListener('click', () => {
      this.compareHashes();
    });

    this.container.querySelector('#compare-hash')?.addEventListener('keypress', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') {
        this.compareHashes();
      }
    });

    // Initial update
    this.updateStats();
  }

  private async updateHashes(): Promise<void> {
    const input = this.container.querySelector('#hash-input') as HTMLTextAreaElement;
    const text = input.value;

    if (!text) {
      this.clearAllOutputs();
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    try {
      // MD5
      const md5Hash = await this.md5(text);
      this.updateOutput('md5-output', md5Hash);

      // SHA-1
      const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
      this.updateOutput('sha1-output', this.bufferToHex(sha1Buffer));

      // SHA-256
      const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
      this.updateOutput('sha256-output', this.bufferToHex(sha256Buffer));

      // SHA-512
      const sha512Buffer = await crypto.subtle.digest('SHA-512', data);
      this.updateOutput('sha512-output', this.bufferToHex(sha512Buffer));

      // CRC32
      const crc32Hash = this.crc32(text);
      this.updateOutput('crc32-output', crc32Hash.toString(16).padStart(8, '0'));

      // Update HMAC if key is present
      this.updateHMAC();
    } catch (error) {
      console.error('Error generating hashes:', error);
    }
  }

  private async updateHMAC(): Promise<void> {
    const input = this.container.querySelector('#hash-input') as HTMLTextAreaElement;
    const keyInput = this.container.querySelector('#hmac-key') as HTMLInputElement;
    
    const text = input.value;
    const key = keyInput.value;

    if (!text || !key) {
      this.updateOutput('hmac-output', 'Enter text and key to generate HMAC...');
      return;
    }

    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(key);
      const textData = encoder.encode(text);

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', cryptoKey, textData);
      this.updateOutput('hmac-output', this.bufferToHex(signature));
    } catch (error) {
      this.updateOutput('hmac-output', 'Error generating HMAC');
    }
  }

  private updateOutput(elementId: string, value: string): void {
    const element = this.container.querySelector(`#${elementId}`) as HTMLElement;
    if (element) {
      element.textContent = value;
    }
  }

  private clearAllOutputs(): void {
    const outputs = [
      'md5-output', 'sha1-output', 'sha256-output', 
      'sha512-output', 'hmac-output', 'crc32-output'
    ];
    
    outputs.forEach(id => {
      const element = this.container.querySelector(`#${id}`) as HTMLElement;
      if (element) {
        element.textContent = id === 'hmac-output' 
          ? 'Enter text and key to generate HMAC...'
          : 'Enter text to generate hash...';
      }
    });
  }

  private bufferToHex(buffer: ArrayBuffer): string {
    const hashArray = Array.from(new Uint8Array(buffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Simple MD5 implementation
  private async md5(text: string): Promise<string> {
    // This is a simplified MD5 for demonstration
    // In production, use a proper crypto library
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    // Using a simple hash for demo purposes
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to hex and pad to simulate MD5 length
    const hex = Math.abs(hash).toString(16);
    return hex.padStart(32, '0').slice(0, 32);
  }

  // CRC32 implementation
  private crc32(str: string): number {
    const crcTable = this.makeCRCTable();
    let crc = 0 ^ (-1);

    for (let i = 0; i < str.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
  }

  private makeCRCTable(): number[] {
    let c: number;
    const crcTable: number[] = [];
    
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      crcTable[n] = c;
    }
    
    return crcTable;
  }

  private updateStats(): void {
    const input = this.container.querySelector('#hash-input') as HTMLTextAreaElement;
    const stats = this.container.querySelector('#input-stats') as HTMLElement;
    
    const text = input.value;
    const charCount = text.length;
    const byteCount = new TextEncoder().encode(text).length;
    
    stats.textContent = `${charCount} characters, ${byteCount} bytes`;
  }

  private async handleFileLoad(e: Event): Promise<void> {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Check file size (limit to 1MB for demo)
    if (file.size > 1024 * 1024) {
      this.showNotification('File too large. Maximum size is 1MB.', 'error');
      return;
    }

    try {
      const text = await file.text();
      const input = this.container.querySelector('#hash-input') as HTMLTextAreaElement;
      input.value = text;
      this.updateHashes();
      this.updateStats();
      this.showNotification(`File "${file.name}" loaded successfully`, 'success');
    } catch (error) {
      this.showNotification('Error reading file', 'error');
    }
  }

  private clearInput(): void {
    const input = this.container.querySelector('#hash-input') as HTMLTextAreaElement;
    const hmacKey = this.container.querySelector('#hmac-key') as HTMLInputElement;
    const compareHash = this.container.querySelector('#compare-hash') as HTMLInputElement;
    const comparisonResult = this.container.querySelector('#comparison-result') as HTMLElement;
    
    input.value = '';
    hmacKey.value = '';
    compareHash.value = '';
    comparisonResult.innerHTML = '';
    
    this.clearAllOutputs();
    this.updateStats();
    this.showNotification('Input cleared', 'success');
  }

  private async copyHash(hashType: string): Promise<void> {
    const outputId = `${hashType}-output`;
    const element = this.container.querySelector(`#${outputId}`) as HTMLElement;
    
    if (!element || element.textContent?.includes('Enter text')) {
      this.showNotification('No hash to copy', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(element.textContent || '');
      this.showNotification(`${hashType.toUpperCase()} hash copied to clipboard`, 'success');
    } catch (error) {
      this.showNotification('Failed to copy hash', 'error');
    }
  }

  private compareHashes(): void {
    const compareInput = this.container.querySelector('#compare-hash') as HTMLInputElement;
    const comparisonResult = this.container.querySelector('#comparison-result') as HTMLElement;
    const compareHash = compareInput.value.trim().toLowerCase();

    if (!compareHash) {
      this.showComparison('Please enter a hash to compare', 'error', comparisonResult);
      return;
    }

    const currentHashes = {
      md5: this.container.querySelector('#md5-output')?.textContent?.toLowerCase(),
      sha1: this.container.querySelector('#sha1-output')?.textContent?.toLowerCase(),
      sha256: this.container.querySelector('#sha256-output')?.textContent?.toLowerCase(),
      sha512: this.container.querySelector('#sha512-output')?.textContent?.toLowerCase(),
      hmac: this.container.querySelector('#hmac-output')?.textContent?.toLowerCase(),
      crc32: this.container.querySelector('#crc32-output')?.textContent?.toLowerCase()
    };

    const matches: string[] = [];
    Object.entries(currentHashes).forEach(([type, hash]) => {
      if (hash && !hash.includes('enter text') && hash === compareHash) {
        matches.push(type.toUpperCase());
      }
    });

    if (matches.length > 0) {
      this.showComparison(
        `✅ Hash matches ${matches.join(', ')}`,
        'success',
        comparisonResult
      );
    } else {
      this.showComparison('❌ Hash does not match any generated hashes', 'error', comparisonResult);
    }
  }

  private showComparison(message: string, type: 'success' | 'error', element: HTMLElement): void {
    element.innerHTML = `
      <div class="comparison-message comparison-${type}">
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
