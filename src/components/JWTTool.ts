import { getIcon } from '@/utils/icons';

export class JWTTool {
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
          <div class="tool-icon">${getIcon('jwt')}</div>
          <div class="tool-title">
            <h2>JWT Decoder</h2>
            <p>Decode and verify JSON Web Tokens</p>
          </div>
        </div>

        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header">
              <h3>JWT Token Input</h3>
              <div class="tool-actions">
                <button id="clear-jwt-input" class="btn btn-secondary">
                  ${getIcon('trash')} Clear
                </button>
                <button id="paste-jwt-input" class="btn btn-secondary">
                  ${getIcon('clipboard')} Paste
                </button>
                <button id="sample-jwt" class="btn btn-secondary">
                  ${getIcon('code')} Sample JWT
                </button>
              </div>
            </div>
            <textarea 
              id="jwt-input" 
              placeholder="Paste your JWT token here (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
              class="tool-textarea"
              rows="4"
            ></textarea>
            <div id="jwt-validation" class="jwt-validation"></div>
          </div>

          <div class="jwt-sections">
            <!-- Header Section -->
            <div class="jwt-section">
              <div class="section-header">
                <h3>Header</h3>
                <div class="tool-actions">
                  <button id="copy-header" class="btn btn-secondary">
                    ${getIcon('copy')} Copy
                  </button>
                </div>
              </div>
              <div class="jwt-part-info">
                <span class="jwt-part-label">Algorithm & Token Type</span>
              </div>
              <textarea 
                id="jwt-header" 
                placeholder="Decoded header will appear here..."
                class="tool-textarea jwt-output"
                readonly
                rows="4"
              ></textarea>
            </div>

            <!-- Payload Section -->
            <div class="jwt-section">
              <div class="section-header">
                <h3>Payload</h3>
                <div class="tool-actions">
                  <button id="copy-payload" class="btn btn-secondary">
                    ${getIcon('copy')} Copy
                  </button>
                </div>
              </div>
              <div class="jwt-part-info">
                <span class="jwt-part-label">Data & Claims</span>
              </div>
              <textarea 
                id="jwt-payload" 
                placeholder="Decoded payload will appear here..."
                class="tool-textarea jwt-output"
                readonly
                rows="8"
              ></textarea>
            </div>

            <!-- Signature Section -->
            <div class="jwt-section">
              <div class="section-header">
                <h3>Signature</h3>
                <div class="tool-actions">
                  <button id="copy-signature" class="btn btn-secondary">
                    ${getIcon('copy')} Copy
                  </button>
                </div>
              </div>
              <div class="jwt-part-info">
                <span class="jwt-part-label">Signature (Base64 encoded)</span>
              </div>
              <textarea 
                id="jwt-signature" 
                placeholder="Signature will appear here..."
                class="tool-textarea jwt-output"
                readonly
                rows="3"
              ></textarea>
            </div>
          </div>

          <div class="tool-info">
            <div class="info-item">
              <strong>What is JWT?</strong>
              <p>JSON Web Token (JWT) is a compact, URL-safe means of representing claims between two parties. JWTs consist of three parts: Header, Payload, and Signature.</p>
            </div>
            <div class="info-item">
              <strong>Common JWT Claims:</strong>
              <p><code>iss</code> (issuer), <code>sub</code> (subject), <code>aud</code> (audience), <code>exp</code> (expiration), <code>iat</code> (issued at), <code>nbf</code> (not before)</p>
            </div>
            <div class="info-item">
              <strong>Note:</strong>
              <p>This tool only decodes JWTs. It does not verify signatures as that requires the secret key.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const jwtInput = this.container.querySelector('#jwt-input') as HTMLTextAreaElement;
    const headerOutput = this.container.querySelector('#jwt-header') as HTMLTextAreaElement;
    const payloadOutput = this.container.querySelector('#jwt-payload') as HTMLTextAreaElement;
    const signatureOutput = this.container.querySelector('#jwt-signature') as HTMLTextAreaElement;
    const validationDiv = this.container.querySelector('#jwt-validation') as HTMLElement;
    
    const clearInputBtn = this.container.querySelector('#clear-jwt-input') as HTMLButtonElement;
    const pasteInputBtn = this.container.querySelector('#paste-jwt-input') as HTMLButtonElement;
    const sampleJwtBtn = this.container.querySelector('#sample-jwt') as HTMLButtonElement;
    const copyHeaderBtn = this.container.querySelector('#copy-header') as HTMLButtonElement;
    const copyPayloadBtn = this.container.querySelector('#copy-payload') as HTMLButtonElement;
    const copySignatureBtn = this.container.querySelector('#copy-signature') as HTMLButtonElement;

    // Auto-decode on input
    jwtInput.addEventListener('input', () => {
      this.decodeJWT(jwtInput.value.trim());
    });

    // Clear button
    clearInputBtn.addEventListener('click', () => {
      jwtInput.value = '';
      this.clearOutputs();
      jwtInput.focus();
    });

    // Paste button
    pasteInputBtn.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        jwtInput.value = text;
        this.decodeJWT(text);
        this.showSuccess('Pasted from clipboard');
      } catch (error) {
        this.showError('Failed to paste from clipboard');
      }
    });

    // Sample JWT button
    sampleJwtBtn.addEventListener('click', () => {
      const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzM5NDgzOTksImF1ZCI6InNhbXBsZS1hdWRpZW5jZSIsImlzcyI6InNhbXBsZS1pc3N1ZXIifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      jwtInput.value = sampleJWT;
      this.decodeJWT(sampleJWT);
      this.showSuccess('Sample JWT loaded');
    });

    // Copy buttons
    copyHeaderBtn.addEventListener('click', () => this.copyToClipboard(headerOutput.value, 'Header'));
    copyPayloadBtn.addEventListener('click', () => this.copyToClipboard(payloadOutput.value, 'Payload'));
    copySignatureBtn.addEventListener('click', () => this.copyToClipboard(signatureOutput.value, 'Signature'));
  }

  private decodeJWT(token: string): void {
    if (!token) {
      this.clearOutputs();
      return;
    }

    try {
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        this.showValidationError('Invalid JWT format. JWT must have 3 parts separated by dots.');
        this.clearOutputs();
        return;
      }

      // Decode header
      try {
        const headerDecoded = this.base64UrlDecode(parts[0]);
        const headerJson = JSON.parse(headerDecoded);
        (this.container.querySelector('#jwt-header') as HTMLTextAreaElement).value = 
          JSON.stringify(headerJson, null, 2);
      } catch (error) {
        this.showValidationError('Invalid header: ' + (error as Error).message);
        return;
      }

      // Decode payload
      try {
        const payloadDecoded = this.base64UrlDecode(parts[1]);
        const payloadJson = JSON.parse(payloadDecoded);
        
        // Add human-readable timestamps
        const enrichedPayload = this.enrichPayloadWithDates(payloadJson);
        
        (this.container.querySelector('#jwt-payload') as HTMLTextAreaElement).value = 
          JSON.stringify(enrichedPayload, null, 2);
      } catch (error) {
        this.showValidationError('Invalid payload: ' + (error as Error).message);
        return;
      }

      // Show signature (base64url encoded)
      (this.container.querySelector('#jwt-signature') as HTMLTextAreaElement).value = parts[2];

      this.showValidationSuccess('JWT decoded successfully');
      this.checkExpiration(JSON.parse(this.base64UrlDecode(parts[1])));

    } catch (error) {
      this.showValidationError('Failed to decode JWT: ' + (error as Error).message);
      this.clearOutputs();
    }
  }

  private base64UrlDecode(str: string): string {
    // Add padding if needed
    const padding = 4 - (str.length % 4);
    if (padding !== 4) {
      str += '='.repeat(padding);
    }
    
    // Replace URL-safe characters
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (error) {
      throw new Error('Invalid base64url encoding');
    }
  }

  private enrichPayloadWithDates(payload: any): any {
    const enriched = { ...payload };
    
    // Add human-readable dates for common timestamp fields
    const timestampFields = ['exp', 'iat', 'nbf'];
    timestampFields.forEach(field => {
      if (payload[field] && typeof payload[field] === 'number') {
        const date = new Date(payload[field] * 1000);
        enriched[`${field}_readable`] = date.toISOString() + ' (' + date.toLocaleString() + ')';
      }
    });
    
    return enriched;
  }

  private checkExpiration(payload: any): void {
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      const now = new Date();
      
      if (expDate < now) {
        this.showValidationWarning(`Token expired on ${expDate.toLocaleString()}`);
      } else {
        const timeLeft = Math.round((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (timeLeft <= 7) {
          this.showValidationWarning(`Token expires in ${timeLeft} days (${expDate.toLocaleString()})`);
        }
      }
    }
  }

  private clearOutputs(): void {
    (this.container.querySelector('#jwt-header') as HTMLTextAreaElement).value = '';
    (this.container.querySelector('#jwt-payload') as HTMLTextAreaElement).value = '';
    (this.container.querySelector('#jwt-signature') as HTMLTextAreaElement).value = '';
    (this.container.querySelector('#jwt-validation') as HTMLElement).innerHTML = '';
  }

  private showValidationSuccess(message: string): void {
    const validationDiv = this.container.querySelector('#jwt-validation') as HTMLElement;
    validationDiv.innerHTML = `
      <div class="validation-message validation-success">
        ${getIcon('check')} ${message}
      </div>
    `;
  }

  private showValidationError(message: string): void {
    const validationDiv = this.container.querySelector('#jwt-validation') as HTMLElement;
    validationDiv.innerHTML = `
      <div class="validation-message validation-error">
        ${getIcon('alert')} ${message}
      </div>
    `;
  }

  private showValidationWarning(message: string): void {
    const validationDiv = this.container.querySelector('#jwt-validation') as HTMLElement;
    validationDiv.innerHTML = `
      <div class="validation-message validation-warning">
        ${getIcon('alert')} ${message}
      </div>
    `;
  }

  private async copyToClipboard(text: string, section: string): Promise<void> {
    if (!text) {
      this.showError(`No ${section.toLowerCase()} to copy`);
      return;
    }
    
    try {
      await navigator.clipboard.writeText(text);
      this.showSuccess(`${section} copied to clipboard`);
    } catch (error) {
      this.showError(`Failed to copy ${section.toLowerCase()}`);
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
