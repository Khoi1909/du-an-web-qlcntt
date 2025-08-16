import { getIcon } from '@/utils/icons';

export class StringTool {
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
          <div class="tool-icon">${getIcon('stringTool')}</div>
          <div class="tool-title">
            <h2>String Utilities</h2>
            <p>Comprehensive string manipulation and analysis tools</p>
          </div>
        </div>

        <div class="tool-content">
          <div class="string-input-section">
            <div class="section-header">
              <h3>Input Text</h3>
              <div class="tool-actions">
                <button id="paste-text" class="btn btn-secondary">
                  ${getIcon('clipboard')} Paste
                </button>
                <button id="clear-input" class="btn btn-secondary">
                  ${getIcon('trash')} Clear
                </button>
              </div>
            </div>
            <div class="input-group">
              <textarea 
                id="string-input" 
                placeholder="Enter text to manipulate..."
                class="tool-textarea"
                rows="8"
              ></textarea>
            </div>
            <div class="input-stats">
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-label">Characters:</span>
                  <span id="char-count">0</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Words:</span>
                  <span id="word-count">0</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Lines:</span>
                  <span id="line-count">0</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Bytes:</span>
                  <span id="byte-count">0</span>
                </div>
              </div>
            </div>
          </div>

          <div class="string-operations-section">
            <div class="section-header">
              <h3>String Operations</h3>
            </div>
            <div class="operations-grid">
              <div class="operation-category">
                <h4>Case Transformations</h4>
                <div class="operation-buttons">
                  <button class="operation-btn" data-operation="uppercase">UPPERCASE</button>
                  <button class="operation-btn" data-operation="lowercase">lowercase</button>
                  <button class="operation-btn" data-operation="capitalize">Capitalize Words</button>
                  <button class="operation-btn" data-operation="camelcase">camelCase</button>
                  <button class="operation-btn" data-operation="pascalcase">PascalCase</button>
                  <button class="operation-btn" data-operation="snakecase">snake_case</button>
                  <button class="operation-btn" data-operation="kebabcase">kebab-case</button>
                  <button class="operation-btn" data-operation="togglecase">tOGGLE cASE</button>
                </div>
              </div>

              <div class="operation-category">
                <h4>Encoding & Escaping</h4>
                <div class="operation-buttons">
                  <button class="operation-btn" data-operation="urlencode">URL Encode</button>
                  <button class="operation-btn" data-operation="urldecode">URL Decode</button>
                  <button class="operation-btn" data-operation="htmlencode">HTML Encode</button>
                  <button class="operation-btn" data-operation="htmldecode">HTML Decode</button>
                  <button class="operation-btn" data-operation="base64encode">Base64 Encode</button>
                  <button class="operation-btn" data-operation="base64decode">Base64 Decode</button>
                  <button class="operation-btn" data-operation="jsonescape">JSON Escape</button>
                  <button class="operation-btn" data-operation="jsonunescape">JSON Unescape</button>
                </div>
              </div>

              <div class="operation-category">
                <h4>Text Processing</h4>
                <div class="operation-buttons">
                  <button class="operation-btn" data-operation="trim">Trim Whitespace</button>
                  <button class="operation-btn" data-operation="reverse">Reverse Text</button>
                  <button class="operation-btn" data-operation="sort">Sort Lines</button>
                  <button class="operation-btn" data-operation="unique">Unique Lines</button>
                  <button class="operation-btn" data-operation="removelines">Remove Empty Lines</button>
                  <button class="operation-btn" data-operation="addnumbers">Add Line Numbers</button>
                  <button class="operation-btn" data-operation="extractemails">Extract Emails</button>
                  <button class="operation-btn" data-operation="extracturls">Extract URLs</button>
                </div>
              </div>

              <div class="operation-category">
                <h4>Find & Replace</h4>
                <div class="find-replace-controls">
                  <div class="input-group">
                    <input type="text" id="find-text" placeholder="Find text..." class="tool-input" />
                    <input type="text" id="replace-text" placeholder="Replace with..." class="tool-input" />
                  </div>
                  <div class="replace-options">
                    <label class="checkbox-label">
                      <input type="checkbox" id="case-sensitive" />
                      Case sensitive
                    </label>
                    <label class="checkbox-label">
                      <input type="checkbox" id="use-regex" />
                      Use regex
                    </label>
                  </div>
                  <div class="operation-buttons">
                    <button class="operation-btn" data-operation="replace">Replace All</button>
                    <button class="operation-btn" data-operation="highlight">Highlight Matches</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="string-output-section">
            <div class="section-header">
              <h3>Output</h3>
              <div class="tool-actions">
                <button id="copy-output" class="btn btn-primary">
                  ${getIcon('copy')} Copy Result
                </button>
                <button id="use-output" class="btn btn-secondary">
                  Use as Input
                </button>
              </div>
            </div>
            <div class="output-container">
              <textarea 
                id="string-output" 
                placeholder="Results will appear here..."
                class="tool-textarea"
                rows="8"
                readonly
              ></textarea>
            </div>
          </div>

          <div class="string-analysis-section">
            <div class="section-header">
              <h3>Text Analysis</h3>
            </div>
            <div class="analysis-grid">
              <div class="analysis-card">
                <h4>Character Analysis</h4>
                <div id="char-analysis" class="analysis-content">
                  <div class="analysis-item">
                    <span>Letters:</span>
                    <span id="letter-count">0</span>
                  </div>
                  <div class="analysis-item">
                    <span>Numbers:</span>
                    <span id="number-count">0</span>
                  </div>
                  <div class="analysis-item">
                    <span>Spaces:</span>
                    <span id="space-count">0</span>
                  </div>
                  <div class="analysis-item">
                    <span>Special chars:</span>
                    <span id="special-count">0</span>
                  </div>
                </div>
              </div>

              <div class="analysis-card">
                <h4>Pattern Analysis</h4>
                <div id="pattern-analysis" class="analysis-content">
                  <div class="analysis-item">
                    <span>Email addresses:</span>
                    <span id="email-count">0</span>
                  </div>
                  <div class="analysis-item">
                    <span>URLs:</span>
                    <span id="url-count">0</span>
                  </div>
                  <div class="analysis-item">
                    <span>Phone numbers:</span>
                    <span id="phone-count">0</span>
                  </div>
                  <div class="analysis-item">
                    <span>IP addresses:</span>
                    <span id="ip-count">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="tool-info">
            <div class="info-item">
              <strong>Case Transformations:</strong>
              <p>Convert text between different naming conventions and cases.</p>
            </div>
            <div class="info-item">
              <strong>Encoding:</strong>
              <p>Encode/decode text for URLs, HTML, Base64, and JSON formats.</p>
            </div>
            <div class="info-item">
              <strong>Text Processing:</strong>
              <p>Manipulate text structure, extract patterns, and analyze content.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const input = this.container.querySelector('#string-input') as HTMLTextAreaElement;
    const output = this.container.querySelector('#string-output') as HTMLTextAreaElement;

    // Input monitoring
    input.addEventListener('input', () => {
      this.updateStats();
      this.analyzeText();
    });

    // Operation buttons
    this.container.querySelectorAll('.operation-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const operation = (e.target as HTMLElement).getAttribute('data-operation');
        if (operation) {
          this.performOperation(operation);
        }
      });
    });

    // Action buttons
    this.container.querySelector('#paste-text')?.addEventListener('click', () => {
      this.pasteText();
    });

    this.container.querySelector('#clear-input')?.addEventListener('click', () => {
      this.clearInput();
    });

    this.container.querySelector('#copy-output')?.addEventListener('click', () => {
      this.copyOutput();
    });

    this.container.querySelector('#use-output')?.addEventListener('click', () => {
      this.useOutputAsInput();
    });

    // Find & Replace events
    this.container.querySelector('#find-text')?.addEventListener('keypress', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') {
        this.performOperation('highlight');
      }
    });

    // Initial update
    this.updateStats();
    this.analyzeText();
  }

  private performOperation(operation: string): void {
    const input = this.container.querySelector('#string-input') as HTMLTextAreaElement;
    const output = this.container.querySelector('#string-output') as HTMLTextAreaElement;
    let text = input.value;

    if (!text && !['replace', 'highlight'].includes(operation)) {
      this.showNotification('Please enter some text first', 'error');
      return;
    }

    let result = '';

    try {
      switch (operation) {
        // Case transformations
        case 'uppercase':
          result = text.toUpperCase();
          break;
        case 'lowercase':
          result = text.toLowerCase();
          break;
        case 'capitalize':
          result = text.replace(/\b\w/g, l => l.toUpperCase());
          break;
        case 'camelcase':
          result = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
          }).replace(/\s+/g, '');
          break;
        case 'pascalcase':
          result = text.replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase()).replace(/\s+/g, '');
          break;
        case 'snakecase':
          result = text.toLowerCase().replace(/\s+/g, '_').replace(/[^\w_]/g, '');
          break;
        case 'kebabcase':
          result = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
          break;
        case 'togglecase':
          result = text.replace(/[a-zA-Z]/g, char => 
            char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
          );
          break;

        // Encoding & Escaping
        case 'urlencode':
          result = encodeURIComponent(text);
          break;
        case 'urldecode':
          result = decodeURIComponent(text);
          break;
        case 'htmlencode':
          result = text.replace(/[&<>"']/g, match => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
          }[match] || match));
          break;
        case 'htmldecode':
          result = text.replace(/&(amp|lt|gt|quot|#39);/g, match => ({
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'"
          }[match] || match));
          break;
        case 'base64encode':
          result = btoa(text);
          break;
        case 'base64decode':
          result = atob(text);
          break;
        case 'jsonescape':
          result = JSON.stringify(text).slice(1, -1);
          break;
        case 'jsonunescape':
          result = JSON.parse(`"${text}"`);
          break;

        // Text processing
        case 'trim':
          result = text.trim();
          break;
        case 'reverse':
          result = text.split('').reverse().join('');
          break;
        case 'sort':
          result = text.split('\n').sort().join('\n');
          break;
        case 'unique':
          result = [...new Set(text.split('\n'))].join('\n');
          break;
        case 'removelines':
          result = text.split('\n').filter(line => line.trim() !== '').join('\n');
          break;
        case 'addnumbers':
          result = text.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n');
          break;
        case 'extractemails':
          const emails = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g);
          result = emails ? emails.join('\n') : 'No email addresses found';
          break;
        case 'extracturls':
          const urls = text.match(/https?:\/\/[^\s]+/g);
          result = urls ? urls.join('\n') : 'No URLs found';
          break;

        // Find & Replace
        case 'replace':
          result = this.performFindReplace(text);
          break;
        case 'highlight':
          result = this.highlightMatches(text);
          break;

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }

      output.value = result;
      this.showNotification(`Operation "${operation}" completed successfully`, 'success');
    } catch (error) {
      this.showNotification(`Error performing ${operation}: ${error}`, 'error');
    }
  }

  private performFindReplace(text: string): string {
    const findText = (this.container.querySelector('#find-text') as HTMLInputElement).value;
    const replaceText = (this.container.querySelector('#replace-text') as HTMLInputElement).value;
    const caseSensitive = (this.container.querySelector('#case-sensitive') as HTMLInputElement).checked;
    const useRegex = (this.container.querySelector('#use-regex') as HTMLInputElement).checked;

    if (!findText) {
      throw new Error('Please enter text to find');
    }

    if (useRegex) {
      const flags = caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(findText, flags);
      return text.replace(regex, replaceText);
    } else {
      const flags = caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
      return text.replace(regex, replaceText);
    }
  }

  private highlightMatches(text: string): string {
    const findText = (this.container.querySelector('#find-text') as HTMLInputElement).value;
    const caseSensitive = (this.container.querySelector('#case-sensitive') as HTMLInputElement).checked;
    const useRegex = (this.container.querySelector('#use-regex') as HTMLInputElement).checked;

    if (!findText) {
      throw new Error('Please enter text to find');
    }

    if (useRegex) {
      const flags = caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(findText, flags);
      return text.replace(regex, match => `[MATCH: ${match}]`);
    } else {
      const flags = caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
      return text.replace(regex, match => `[MATCH: ${match}]`);
    }
  }

  private updateStats(): void {
    const input = this.container.querySelector('#string-input') as HTMLTextAreaElement;
    const text = input.value;

    // Basic stats
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lineCount = text.split('\n').length;
    const byteCount = new TextEncoder().encode(text).length;

    // Update display
    (this.container.querySelector('#char-count') as HTMLElement).textContent = charCount.toString();
    (this.container.querySelector('#word-count') as HTMLElement).textContent = wordCount.toString();
    (this.container.querySelector('#line-count') as HTMLElement).textContent = lineCount.toString();
    (this.container.querySelector('#byte-count') as HTMLElement).textContent = byteCount.toString();
  }

  private analyzeText(): void {
    const input = this.container.querySelector('#string-input') as HTMLTextAreaElement;
    const text = input.value;

    // Character analysis
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const numbers = (text.match(/[0-9]/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const special = text.length - letters - numbers - spaces;

    (this.container.querySelector('#letter-count') as HTMLElement).textContent = letters.toString();
    (this.container.querySelector('#number-count') as HTMLElement).textContent = numbers.toString();
    (this.container.querySelector('#space-count') as HTMLElement).textContent = spaces.toString();
    (this.container.querySelector('#special-count') as HTMLElement).textContent = special.toString();

    // Pattern analysis
    const emails = (text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || []).length;
    const urls = (text.match(/https?:\/\/[^\s]+/g) || []).length;
    const phones = (text.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g) || []).length;
    const ips = (text.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g) || []).length;

    (this.container.querySelector('#email-count') as HTMLElement).textContent = emails.toString();
    (this.container.querySelector('#url-count') as HTMLElement).textContent = urls.toString();
    (this.container.querySelector('#phone-count') as HTMLElement).textContent = phones.toString();
    (this.container.querySelector('#ip-count') as HTMLElement).textContent = ips.toString();
  }

  private async pasteText(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      const input = this.container.querySelector('#string-input') as HTMLTextAreaElement;
      input.value = text;
      this.updateStats();
      this.analyzeText();
      this.showNotification('Text pasted from clipboard', 'success');
    } catch (error) {
      this.showNotification('Failed to paste from clipboard', 'error');
    }
  }

  private clearInput(): void {
    const input = this.container.querySelector('#string-input') as HTMLTextAreaElement;
    const output = this.container.querySelector('#string-output') as HTMLTextAreaElement;
    const findText = this.container.querySelector('#find-text') as HTMLInputElement;
    const replaceText = this.container.querySelector('#replace-text') as HTMLInputElement;

    input.value = '';
    output.value = '';
    findText.value = '';
    replaceText.value = '';

    this.updateStats();
    this.analyzeText();
    this.showNotification('All fields cleared', 'success');
  }

  private async copyOutput(): Promise<void> {
    const output = this.container.querySelector('#string-output') as HTMLTextAreaElement;
    
    if (!output.value) {
      this.showNotification('No output to copy', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(output.value);
      this.showNotification('Output copied to clipboard', 'success');
    } catch (error) {
      this.showNotification('Failed to copy output', 'error');
    }
  }

  private useOutputAsInput(): void {
    const input = this.container.querySelector('#string-input') as HTMLTextAreaElement;
    const output = this.container.querySelector('#string-output') as HTMLTextAreaElement;

    if (!output.value) {
      this.showNotification('No output to use', 'error');
      return;
    }

    input.value = output.value;
    output.value = '';
    this.updateStats();
    this.analyzeText();
    this.showNotification('Output moved to input', 'success');
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
