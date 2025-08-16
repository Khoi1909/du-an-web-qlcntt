import { getIcon } from '@/utils/icons';

export class JsonYamlTool {
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
          <div class="tool-icon">${getIcon('json')}</div>
          <div class="tool-title">
            <h2>JSON ↔ YAML Converter</h2>
            <p>Convert between JSON and YAML formats with validation</p>
          </div>
        </div>

        <div class="tool-content">
          <div class="converter-layout">
            <!-- JSON Section -->
            <div class="converter-section">
              <div class="section-header">
                <h3>JSON</h3>
                <div class="tool-actions">
                  <button id="json-to-yaml" class="btn btn-primary">
                    ${getIcon('conversion')} Convert to YAML
                  </button>
                  <button id="paste-json" class="btn btn-secondary">
                    ${getIcon('clipboard')} Paste
                  </button>
                  <button id="clear-json" class="btn btn-secondary">
                    ${getIcon('trash')} Clear
                  </button>
                </div>
              </div>
              <textarea 
                id="json-input" 
                placeholder='{"name": "example", "items": [1, 2, 3]}'
                class="tool-textarea converter-textarea"
                rows="12"
              ></textarea>
              <div class="format-actions">
                <button id="format-json" class="btn btn-secondary">Format JSON</button>
                <button id="minify-json" class="btn btn-secondary">Minify JSON</button>
                <button id="copy-json" class="btn btn-secondary">${getIcon('copy')} Copy</button>
              </div>
            </div>

            <!-- YAML Section -->
            <div class="converter-section">
              <div class="section-header">
                <h3>YAML</h3>
                <div class="tool-actions">
                  <button id="yaml-to-json" class="btn btn-primary">
                    ${getIcon('conversion')} Convert to JSON
                  </button>
                  <button id="paste-yaml" class="btn btn-secondary">
                    ${getIcon('clipboard')} Paste
                  </button>
                  <button id="clear-yaml" class="btn btn-secondary">
                    ${getIcon('trash')} Clear
                  </button>
                </div>
              </div>
              <textarea 
                id="yaml-input" 
                placeholder="name: example\nitems:\n  - 1\n  - 2\n  - 3"
                class="tool-textarea converter-textarea"
                rows="12"
              ></textarea>
              <div class="format-actions">
                <button id="validate-yaml" class="btn btn-secondary">Validate YAML</button>
                <button id="copy-yaml" class="btn btn-secondary">${getIcon('copy')} Copy</button>
              </div>
            </div>
          </div>

          <div id="conversion-status" class="conversion-status"></div>

          <div class="tool-info">
            <div class="info-item">
              <strong>JSON (JavaScript Object Notation):</strong>
              <p>Lightweight data interchange format, easy for humans to read and write.</p>
            </div>
            <div class="info-item">
              <strong>YAML (YAML Ain't Markup Language):</strong>
              <p>Human-readable data serialization standard, commonly used for configuration files.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const jsonInput = this.container.querySelector('#json-input') as HTMLTextAreaElement;
    const yamlInput = this.container.querySelector('#yaml-input') as HTMLTextAreaElement;
    const statusDiv = this.container.querySelector('#conversion-status') as HTMLElement;

    // Convert buttons
    this.container.querySelector('#json-to-yaml')?.addEventListener('click', () => {
      this.convertJsonToYaml(jsonInput.value, yamlInput, statusDiv);
    });

    this.container.querySelector('#yaml-to-json')?.addEventListener('click', () => {
      this.convertYamlToJson(yamlInput.value, jsonInput, statusDiv);
    });

    // JSON actions
    this.container.querySelector('#format-json')?.addEventListener('click', () => {
      this.formatJson(jsonInput, statusDiv);
    });

    this.container.querySelector('#minify-json')?.addEventListener('click', () => {
      this.minifyJson(jsonInput, statusDiv);
    });

    // Validation
    this.container.querySelector('#validate-yaml')?.addEventListener('click', () => {
      this.validateYaml(yamlInput.value, statusDiv);
    });

    // Copy/Paste/Clear actions
    this.setupCopyPasteClear();
  }

  private convertJsonToYaml(jsonStr: string, yamlOutput: HTMLTextAreaElement, statusDiv: HTMLElement): void {
    if (!jsonStr.trim()) {
      this.showStatus('Please enter JSON to convert', 'error', statusDiv);
      return;
    }

    try {
      const jsonObj = JSON.parse(jsonStr);
      const yamlStr = this.jsonToYaml(jsonObj);
      yamlOutput.value = yamlStr;
      this.showStatus('Successfully converted JSON to YAML', 'success', statusDiv);
    } catch (error) {
      this.showStatus('Invalid JSON: ' + (error as Error).message, 'error', statusDiv);
    }
  }

  private convertYamlToJson(yamlStr: string, jsonOutput: HTMLTextAreaElement, statusDiv: HTMLElement): void {
    if (!yamlStr.trim()) {
      this.showStatus('Please enter YAML to convert', 'error', statusDiv);
      return;
    }

    try {
      const jsonObj = this.yamlToJson(yamlStr);
      jsonOutput.value = JSON.stringify(jsonObj, null, 2);
      this.showStatus('Successfully converted YAML to JSON', 'success', statusDiv);
    } catch (error) {
      this.showStatus('Invalid YAML: ' + (error as Error).message, 'error', statusDiv);
    }
  }

  private formatJson(jsonInput: HTMLTextAreaElement, statusDiv: HTMLElement): void {
    try {
      const jsonObj = JSON.parse(jsonInput.value);
      jsonInput.value = JSON.stringify(jsonObj, null, 2);
      this.showStatus('JSON formatted successfully', 'success', statusDiv);
    } catch (error) {
      this.showStatus('Invalid JSON: ' + (error as Error).message, 'error', statusDiv);
    }
  }

  private minifyJson(jsonInput: HTMLTextAreaElement, statusDiv: HTMLElement): void {
    try {
      const jsonObj = JSON.parse(jsonInput.value);
      jsonInput.value = JSON.stringify(jsonObj);
      this.showStatus('JSON minified successfully', 'success', statusDiv);
    } catch (error) {
      this.showStatus('Invalid JSON: ' + (error as Error).message, 'error', statusDiv);
    }
  }

  private validateYaml(yamlStr: string, statusDiv: HTMLElement): void {
    try {
      this.yamlToJson(yamlStr);
      this.showStatus('YAML is valid', 'success', statusDiv);
    } catch (error) {
      this.showStatus('Invalid YAML: ' + (error as Error).message, 'error', statusDiv);
    }
  }

  // Simple YAML to JSON converter
  private yamlToJson(yamlStr: string): any {
    const lines = yamlStr.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
    return this.parseYamlLines(lines);
  }

  private parseYamlLines(lines: string[]): any {
    const result: any = {};
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const indent = line.length - line.trimStart().length;
      const trimmed = line.trim();

      if (trimmed.includes(':')) {
        const [key, ...valueParts] = trimmed.split(':');
        const value = valueParts.join(':').trim();
        
        if (value) {
          // Simple value
          result[key.trim()] = this.parseValue(value);
        } else {
          // Object or array
          const nextIndent = this.getNextIndent(lines, i + 1);
          if (nextIndent > indent) {
            const subLines = this.extractIndentedLines(lines, i + 1, nextIndent);
            if (subLines.length > 0 && subLines[0].trim().startsWith('-')) {
              // Array
              result[key.trim()] = this.parseYamlArray(subLines);
            } else {
              // Object
              result[key.trim()] = this.parseYamlLines(subLines);
            }
            i += subLines.length;
          }
        }
      }
      i++;
    }

    return result;
  }

  private parseValue(value: string): any {
    value = value.trim();
    
    // Boolean
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    // Null
    if (value === 'null' || value === '~') return null;
    
    // Number
    if (/^-?\d+$/.test(value)) return parseInt(value);
    if (/^-?\d*\.\d+$/.test(value)) return parseFloat(value);
    
    // String (remove quotes if present)
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    
    return value;
  }

  private parseYamlArray(lines: string[]): any[] {
    return lines
      .filter(line => line.trim().startsWith('-'))
      .map(line => {
        const value = line.trim().substring(1).trim();
        return this.parseValue(value);
      });
  }

  private getNextIndent(lines: string[], startIndex: number): number {
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim()) {
        return line.length - line.trimStart().length;
      }
    }
    return 0;
  }

  private extractIndentedLines(lines: string[], startIndex: number, targetIndent: number): string[] {
    const result: string[] = [];
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      const indent = line.length - line.trimStart().length;
      
      if (line.trim() && indent < targetIndent) {
        break;
      }
      
      if (indent >= targetIndent) {
        result.push(line.substring(targetIndent));
      }
    }
    
    return result;
  }

  // Simple JSON to YAML converter
  private jsonToYaml(obj: any, indent: number = 0): string {
    const spaces = '  '.repeat(indent);
    
    if (obj === null) return 'null';
    if (typeof obj === 'boolean') return obj.toString();
    if (typeof obj === 'number') return obj.toString();
    if (typeof obj === 'string') return obj;
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      return obj.map(item => `${spaces}- ${this.jsonToYaml(item, indent + 1)}`).join('\n');
    }
    
    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      
      return keys.map(key => {
        const value = obj[key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          return `${spaces}${key}:\n${this.jsonToYaml(value, indent + 1)}`;
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            return `${spaces}${key}: []`;
          }
          return `${spaces}${key}:\n${this.jsonToYaml(value, indent + 1)}`;
        } else {
          return `${spaces}${key}: ${this.jsonToYaml(value, indent)}`;
        }
      }).join('\n');
    }
    
    return String(obj);
  }

  private setupCopyPasteClear(): void {
    // Copy buttons
    this.container.querySelector('#copy-json')?.addEventListener('click', () => {
      const input = this.container.querySelector('#json-input') as HTMLTextAreaElement;
      this.copyToClipboard(input.value, 'JSON');
    });

    this.container.querySelector('#copy-yaml')?.addEventListener('click', () => {
      const input = this.container.querySelector('#yaml-input') as HTMLTextAreaElement;
      this.copyToClipboard(input.value, 'YAML');
    });

    // Paste buttons
    this.container.querySelector('#paste-json')?.addEventListener('click', () => {
      const input = this.container.querySelector('#json-input') as HTMLTextAreaElement;
      this.pasteFromClipboard(input, 'JSON');
    });

    this.container.querySelector('#paste-yaml')?.addEventListener('click', () => {
      const input = this.container.querySelector('#yaml-input') as HTMLTextAreaElement;
      this.pasteFromClipboard(input, 'YAML');
    });

    // Clear buttons
    this.container.querySelector('#clear-json')?.addEventListener('click', () => {
      (this.container.querySelector('#json-input') as HTMLTextAreaElement).value = '';
    });

    this.container.querySelector('#clear-yaml')?.addEventListener('click', () => {
      (this.container.querySelector('#yaml-input') as HTMLTextAreaElement).value = '';
    });
  }

  private async copyToClipboard(text: string, format: string): Promise<void> {
    if (!text.trim()) {
      this.showNotification(`No ${format} to copy`, 'error');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(text);
      this.showNotification(`${format} copied to clipboard`, 'success');
    } catch (error) {
      this.showNotification(`Failed to copy ${format}`, 'error');
    }
  }

  private async pasteFromClipboard(input: HTMLTextAreaElement, format: string): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      input.value = text;
      this.showNotification(`${format} pasted from clipboard`, 'success');
    } catch (error) {
      this.showNotification(`Failed to paste ${format}`, 'error');
    }
  }

  private showStatus(message: string, type: 'success' | 'error', statusDiv: HTMLElement): void {
    statusDiv.innerHTML = `
      <div class="status-message status-${type}">
        ${type === 'success' ? getIcon('check') : getIcon('alert')} ${message}
      </div>
    `;
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
