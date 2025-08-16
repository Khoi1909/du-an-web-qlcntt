import { getIcon } from '@/utils/icons';

export class Base64Tool {
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
          <div class="tool-icon">${getIcon('code')}</div>
          <div class="tool-title">
            <h2>Base64 Encoder/Decoder</h2>
            <p>Encode and decode text to/from Base64 format</p>
          </div>
        </div>

        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header">
              <h3>Input</h3>
              <div class="tool-actions">
                <button id="clear-input" class="btn btn-secondary">
                  ${getIcon('trash')} Clear
                </button>
                <button id="paste-input" class="btn btn-secondary">
                  ${getIcon('clipboard')} Paste
                </button>
              </div>
            </div>
            <textarea 
              id="base64-input" 
              placeholder="Enter text to encode or Base64 string to decode..."
              class="tool-textarea"
              rows="6"
            ></textarea>
          </div>

          <div class="tool-actions-center">
            <button id="encode-btn" class="btn btn-primary">
              ${getIcon('lock')} Encode to Base64
            </button>
            <button id="decode-btn" class="btn btn-primary">
              ${getIcon('unlock')} Decode from Base64
            </button>
          </div>

          <div class="tool-section">
            <div class="section-header">
              <h3>Output</h3>
              <div class="tool-actions">
                <button id="copy-output" class="btn btn-secondary">
                  ${getIcon('copy')} Copy
                </button>
                <button id="clear-output" class="btn btn-secondary">
                  ${getIcon('trash')} Clear
                </button>
              </div>
            </div>
            <textarea 
              id="base64-output" 
              placeholder="Result will appear here..."
              class="tool-textarea"
              readonly
              rows="6"
            ></textarea>
          </div>

          <div class="tool-info">
            <div class="info-item">
              <strong>What is Base64?</strong>
              <p>Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format.</p>
            </div>
            <div class="info-item">
              <strong>Common uses:</strong>
              <p>Email attachments, data URLs, API tokens, storing binary data in text formats.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const inputTextarea = this.container.querySelector('#base64-input') as HTMLTextAreaElement;
    const outputTextarea = this.container.querySelector('#base64-output') as HTMLTextAreaElement;
    
    const encodeBtn = this.container.querySelector('#encode-btn') as HTMLButtonElement;
    const decodeBtn = this.container.querySelector('#decode-btn') as HTMLButtonElement;
    
    const clearInputBtn = this.container.querySelector('#clear-input') as HTMLButtonElement;
    const clearOutputBtn = this.container.querySelector('#clear-output') as HTMLButtonElement;
    const copyOutputBtn = this.container.querySelector('#copy-output') as HTMLButtonElement;
    const pasteInputBtn = this.container.querySelector('#paste-input') as HTMLButtonElement;

    // Encode button
    encodeBtn.addEventListener('click', () => {
      const input = inputTextarea.value.trim();
      if (!input) {
        this.showError('Please enter text to encode');
        return;
      }
      
      try {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        outputTextarea.value = encoded;
        this.showSuccess('Text encoded successfully');
      } catch (error) {
        this.showError('Error encoding text: ' + (error as Error).message);
      }
    });

    // Decode button
    decodeBtn.addEventListener('click', () => {
      const input = inputTextarea.value.trim();
      if (!input) {
        this.showError('Please enter Base64 string to decode');
        return;
      }
      
      try {
        const decoded = decodeURIComponent(escape(atob(input)));
        outputTextarea.value = decoded;
        this.showSuccess('Base64 decoded successfully');
      } catch (error) {
        this.showError('Invalid Base64 string');
      }
    });

    // Clear buttons
    clearInputBtn.addEventListener('click', () => {
      inputTextarea.value = '';
      inputTextarea.focus();
    });

    clearOutputBtn.addEventListener('click', () => {
      outputTextarea.value = '';
    });

    // Copy button
    copyOutputBtn.addEventListener('click', async () => {
      if (!outputTextarea.value) {
        this.showError('No output to copy');
        return;
      }
      
      try {
        await navigator.clipboard.writeText(outputTextarea.value);
        this.showSuccess('Copied to clipboard');
      } catch (error) {
        this.showError('Failed to copy to clipboard');
      }
    });

    // Paste button
    pasteInputBtn.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        inputTextarea.value = text;
        this.showSuccess('Pasted from clipboard');
      } catch (error) {
        this.showError('Failed to paste from clipboard');
      }
    });

    // Auto-detect and suggest action
    inputTextarea.addEventListener('input', () => {
      const value = inputTextarea.value.trim();
      if (value) {
        this.updateButtonSuggestions(value);
      }
    });
  }

  private updateButtonSuggestions(input: string): void {
    const encodeBtn = this.container.querySelector('#encode-btn') as HTMLButtonElement;
    const decodeBtn = this.container.querySelector('#decode-btn') as HTMLButtonElement;
    
    // Simple Base64 detection (not perfect but good enough)
    const isBase64Like = /^[A-Za-z0-9+/]*={0,2}$/.test(input) && input.length % 4 === 0;
    
    if (isBase64Like && input.length > 4) {
      decodeBtn.classList.add('btn-suggested');
      encodeBtn.classList.remove('btn-suggested');
    } else {
      encodeBtn.classList.add('btn-suggested');
      decodeBtn.classList.remove('btn-suggested');
    }
  }

  private showSuccess(message: string): void {
    this.showNotification(message, 'success');
  }

  private showError(message: string): void {
    this.showNotification(message, 'error');
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    // Remove existing notifications
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

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }

  public destroy(): void {
    // Clean up event listeners if needed
  }
}
