import { getIcon } from '@/utils/icons';

interface RequestHistory {
  id: string;
  method: string;
  url: string;
  timestamp: Date;
  status?: number;
  duration?: number;
}

export class ApiTool {
  private container: HTMLElement;
  private requestHistory: RequestHistory[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.attachEventListeners();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('apiTester')}</div>
          <div class="tool-title">
            <h2>API Tester</h2>
            <p>Test REST APIs with full HTTP method support and response analysis</p>
          </div>
        </div>

        <div class="tool-content">
          <div class="api-request-section">
            <div class="section-header">
              <h3>Request Configuration</h3>
              <div class="tool-actions">
                <button id="send-request" class="btn btn-primary">
                  ${getIcon('api')} Send Request
                </button>
                <button id="clear-request" class="btn btn-secondary">
                  ${getIcon('trash')} Clear
                </button>
              </div>
            </div>

            <div class="request-config">
              <div class="request-line">
                <select id="http-method" class="method-select">
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                  <option value="HEAD">HEAD</option>
                  <option value="OPTIONS">OPTIONS</option>
                </select>
                <input 
                  type="text" 
                  id="api-url" 
                  placeholder="https://api.example.com/endpoint"
                  class="url-input"
                />
              </div>

              <div class="request-tabs">
                <div class="tab-buttons">
                  <button class="tab-btn active" data-tab="headers">Headers</button>
                  <button class="tab-btn" data-tab="body">Body</button>
                  <button class="tab-btn" data-tab="auth">Auth</button>
                  <button class="tab-btn" data-tab="params">Query Params</button>
                </div>

                <div class="tab-content">
                  <div id="headers-tab" class="tab-panel active">
                    <div class="headers-section">
                      <div class="header-controls">
                        <button id="add-header" class="btn btn-secondary">
                          ${getIcon('string')} Add Header
                        </button>
                        <div class="preset-headers">
                          <select id="preset-headers">
                            <option value="">Add preset header...</option>
                            <option value="Content-Type:application/json">Content-Type: JSON</option>
                            <option value="Content-Type:application/xml">Content-Type: XML</option>
                            <option value="Accept:application/json">Accept: JSON</option>
                            <option value="User-Agent:API-Tester/1.0">User-Agent: API Tester</option>
                          </select>
                        </div>
                      </div>
                      <div id="headers-list" class="headers-list">
                        <!-- Dynamic headers will be added here -->
                      </div>
                    </div>
                  </div>

                  <div id="body-tab" class="tab-panel">
                    <div class="body-section">
                      <div class="body-type-selector">
                        <label class="radio-label">
                          <input type="radio" name="body-type" value="none" checked />
                          None
                        </label>
                        <label class="radio-label">
                          <input type="radio" name="body-type" value="json" />
                          JSON
                        </label>
                        <label class="radio-label">
                          <input type="radio" name="body-type" value="xml" />
                          XML
                        </label>
                        <label class="radio-label">
                          <input type="radio" name="body-type" value="form" />
                          Form Data
                        </label>
                        <label class="radio-label">
                          <input type="radio" name="body-type" value="text" />
                          Raw Text
                        </label>
                      </div>
                      <div class="body-content">
                        <textarea 
                          id="request-body" 
                          placeholder="Request body content..."
                          class="tool-textarea"
                          rows="8"
                          style="display: none;"
                        ></textarea>
                        <div id="form-data" class="form-data-section" style="display: none;">
                          <button id="add-form-field" class="btn btn-secondary">Add Field</button>
                          <div id="form-fields" class="form-fields"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="auth-tab" class="tab-panel">
                    <div class="auth-section">
                      <div class="auth-type-selector">
                        <label class="radio-label">
                          <input type="radio" name="auth-type" value="none" checked />
                          No Auth
                        </label>
                        <label class="radio-label">
                          <input type="radio" name="auth-type" value="bearer" />
                          Bearer Token
                        </label>
                        <label class="radio-label">
                          <input type="radio" name="auth-type" value="basic" />
                          Basic Auth
                        </label>
                        <label class="radio-label">
                          <input type="radio" name="auth-type" value="apikey" />
                          API Key
                        </label>
                      </div>
                      <div id="auth-config" class="auth-config"></div>
                    </div>
                  </div>

                  <div id="params-tab" class="tab-panel">
                    <div class="params-section">
                      <button id="add-param" class="btn btn-secondary">
                        ${getIcon('string')} Add Parameter
                      </button>
                      <div id="params-list" class="params-list">
                        <!-- Dynamic params will be added here -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="api-response-section">
            <div class="section-header">
              <h3>Response</h3>
              <div class="tool-actions">
                <button id="copy-response" class="btn btn-secondary">
                  ${getIcon('copy')} Copy Response
                </button>
                <button id="save-response" class="btn btn-secondary">
                  ${getIcon('clipboard')} Save to File
                </button>
              </div>
            </div>

            <div class="response-container">
              <div id="response-status" class="response-status" style="display: none;">
                <div class="status-info">
                  <span class="status-code"></span>
                  <span class="status-text"></span>
                  <span class="response-time"></span>
                  <span class="response-size"></span>
                </div>
              </div>

              <div class="response-tabs">
                <div class="tab-buttons">
                  <button class="tab-btn active" data-tab="response-body">Body</button>
                  <button class="tab-btn" data-tab="response-headers">Headers</button>
                  <button class="tab-btn" data-tab="response-raw">Raw</button>
                </div>

                <div class="tab-content">
                  <div id="response-body-tab" class="tab-panel active">
                    <div class="response-body-controls">
                      <button id="format-json" class="btn btn-secondary">Format JSON</button>
                      <button id="format-xml" class="btn btn-secondary">Format XML</button>
                    </div>
                    <pre id="response-body" class="response-content">No response yet. Send a request to see results.</pre>
                  </div>

                  <div id="response-headers-tab" class="tab-panel">
                    <pre id="response-headers" class="response-content">No headers yet.</pre>
                  </div>

                  <div id="response-raw-tab" class="tab-panel">
                    <pre id="response-raw" class="response-content">No raw response yet.</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="api-history-section">
            <div class="section-header">
              <h3>Request History</h3>
              <div class="tool-actions">
                <button id="clear-history" class="btn btn-secondary">
                  ${getIcon('trash')} Clear History
                </button>
              </div>
            </div>
            <div id="history-list" class="history-list">
              <div class="history-empty">No requests yet. Send your first API request!</div>
            </div>
          </div>

          <div class="tool-info">
            <div class="info-item">
              <strong>CORS:</strong>
              <p>Browser CORS policies may block some requests. Consider using a CORS proxy for testing.</p>
            </div>
            <div class="info-item">
              <strong>Authentication:</strong>
              <p>Support for Bearer tokens, Basic auth, and API key authentication methods.</p>
            </div>
            <div class="info-item">
              <strong>Response Formats:</strong>
              <p>Automatic formatting for JSON and XML responses with syntax highlighting.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    // Tab switching
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabName = (e.target as HTMLElement).getAttribute('data-tab');
        this.switchTab(btn.closest('.request-tabs, .response-tabs') as HTMLElement, tabName!);
      });
    });

    // Request actions
    this.container.querySelector('#send-request')?.addEventListener('click', () => {
      this.sendRequest();
    });

    this.container.querySelector('#clear-request')?.addEventListener('click', () => {
      this.clearRequest();
    });

    // Headers
    this.container.querySelector('#add-header')?.addEventListener('click', () => {
      this.addHeader();
    });

    this.container.querySelector('#preset-headers')?.addEventListener('change', (e) => {
      const preset = (e.target as HTMLSelectElement).value;
      if (preset) {
        const [key, value] = preset.split(':');
        this.addHeader(key, value);
        (e.target as HTMLSelectElement).value = '';
      }
    });

    // Body type switching
    this.container.querySelectorAll('input[name="body-type"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.switchBodyType((e.target as HTMLInputElement).value);
      });
    });

    // Auth type switching
    this.container.querySelectorAll('input[name="auth-type"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.switchAuthType((e.target as HTMLInputElement).value);
      });
    });

    // Parameters
    this.container.querySelector('#add-param')?.addEventListener('click', () => {
      this.addParameter();
    });

    // Form data
    this.container.querySelector('#add-form-field')?.addEventListener('click', () => {
      this.addFormField();
    });

    // Response actions
    this.container.querySelector('#copy-response')?.addEventListener('click', () => {
      this.copyResponse();
    });

    this.container.querySelector('#format-json')?.addEventListener('click', () => {
      this.formatResponse('json');
    });

    this.container.querySelector('#format-xml')?.addEventListener('click', () => {
      this.formatResponse('xml');
    });

    // History
    this.container.querySelector('#clear-history')?.addEventListener('click', () => {
      this.clearHistory();
    });

    // URL validation
    this.container.querySelector('#api-url')?.addEventListener('input', (e) => {
      this.validateUrl((e.target as HTMLInputElement).value);
    });
  }

  private switchTab(container: HTMLElement, tabName: string): void {
    // Update tab buttons
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    container.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

    // Update tab panels
    container.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    container.querySelector(`#${tabName}-tab, #${tabName}`)?.classList.add('active');
  }

  private addHeader(key: string = '', value: string = ''): void {
    const headersList = this.container.querySelector('#headers-list') as HTMLElement;
    const headerId = `header-${Date.now()}`;
    
    const headerElement = document.createElement('div');
    headerElement.className = 'header-item';
    headerElement.innerHTML = `
      <input type="text" placeholder="Header name" value="${key}" class="header-key" />
      <input type="text" placeholder="Header value" value="${value}" class="header-value" />
      <button class="btn-icon remove-header" data-id="${headerId}">
        ${getIcon('x')}
      </button>
    `;

    headerElement.querySelector('.remove-header')?.addEventListener('click', () => {
      headerElement.remove();
    });

    headersList.appendChild(headerElement);
  }

  private addParameter(): void {
    const paramsList = this.container.querySelector('#params-list') as HTMLElement;
    const paramId = `param-${Date.now()}`;
    
    const paramElement = document.createElement('div');
    paramElement.className = 'param-item';
    paramElement.innerHTML = `
      <input type="text" placeholder="Parameter name" class="param-key" />
      <input type="text" placeholder="Parameter value" class="param-value" />
      <button class="btn-icon remove-param" data-id="${paramId}">
        ${getIcon('x')}
      </button>
    `;

    paramElement.querySelector('.remove-param')?.addEventListener('click', () => {
      paramElement.remove();
    });

    paramsList.appendChild(paramElement);
  }

  private addFormField(): void {
    const formFields = this.container.querySelector('#form-fields') as HTMLElement;
    const fieldId = `field-${Date.now()}`;
    
    const fieldElement = document.createElement('div');
    fieldElement.className = 'form-field-item';
    fieldElement.innerHTML = `
      <input type="text" placeholder="Field name" class="field-key" />
      <input type="text" placeholder="Field value" class="field-value" />
      <button class="btn-icon remove-field" data-id="${fieldId}">
        ${getIcon('x')}
      </button>
    `;

    fieldElement.querySelector('.remove-field')?.addEventListener('click', () => {
      fieldElement.remove();
    });

    formFields.appendChild(fieldElement);
  }

  private switchBodyType(type: string): void {
    const bodyTextarea = this.container.querySelector('#request-body') as HTMLTextAreaElement;
    const formData = this.container.querySelector('#form-data') as HTMLElement;

    // Hide all body inputs
    bodyTextarea.style.display = 'none';
    formData.style.display = 'none';

    switch (type) {
      case 'json':
        bodyTextarea.style.display = 'block';
        bodyTextarea.placeholder = '{\n  "key": "value"\n}';
        break;
      case 'xml':
        bodyTextarea.style.display = 'block';
        bodyTextarea.placeholder = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <key>value</key>\n</root>';
        break;
      case 'text':
        bodyTextarea.style.display = 'block';
        bodyTextarea.placeholder = 'Raw text content...';
        break;
      case 'form':
        formData.style.display = 'block';
        break;
    }
  }

  private switchAuthType(type: string): void {
    const authConfig = this.container.querySelector('#auth-config') as HTMLElement;
    
    switch (type) {
      case 'bearer':
        authConfig.innerHTML = `
          <div class="auth-field">
            <label>Bearer Token:</label>
            <input type="text" id="bearer-token" placeholder="Enter bearer token" class="tool-input" />
          </div>
        `;
        break;
      case 'basic':
        authConfig.innerHTML = `
          <div class="auth-field">
            <label>Username:</label>
            <input type="text" id="basic-username" placeholder="Username" class="tool-input" />
          </div>
          <div class="auth-field">
            <label>Password:</label>
            <input type="password" id="basic-password" placeholder="Password" class="tool-input" />
          </div>
        `;
        break;
      case 'apikey':
        authConfig.innerHTML = `
          <div class="auth-field">
            <label>API Key:</label>
            <input type="text" id="api-key" placeholder="Enter API key" class="tool-input" />
          </div>
          <div class="auth-field">
            <label>Add to:</label>
            <select id="apikey-location" class="tool-input">
              <option value="header">Header</option>
              <option value="query">Query Parameter</option>
            </select>
          </div>
          <div class="auth-field">
            <label>Key Name:</label>
            <input type="text" id="apikey-name" placeholder="X-API-Key" class="tool-input" />
          </div>
        `;
        break;
      default:
        authConfig.innerHTML = '<p class="auth-none">No authentication required.</p>';
    }
  }

  private validateUrl(url: string): void {
    const urlInput = this.container.querySelector('#api-url') as HTMLInputElement;
    
    try {
      new URL(url);
      urlInput.classList.remove('invalid');
      urlInput.classList.add('valid');
    } catch {
      urlInput.classList.remove('valid');
      if (url.length > 0) {
        urlInput.classList.add('invalid');
      }
    }
  }

  private async sendRequest(): Promise<void> {
    const method = (this.container.querySelector('#http-method') as HTMLSelectElement).value;
    const url = (this.container.querySelector('#api-url') as HTMLInputElement).value.trim();

    if (!url) {
      this.showNotification('Please enter a URL', 'error');
      return;
    }

    try {
      new URL(url);
    } catch {
      this.showNotification('Please enter a valid URL', 'error');
      return;
    }

    const startTime = Date.now();
    this.showLoading(true);

    try {
      const requestConfig = this.buildRequestConfig(method, url);
      const response = await fetch(url, requestConfig);
      const endTime = Date.now();
      const duration = endTime - startTime;

      await this.handleResponse(response, duration);
      this.addToHistory(method, url, response.status, duration);
      this.showNotification('Request completed successfully', 'success');
    } catch (error) {
      this.handleError(error as Error);
      this.addToHistory(method, url);
    } finally {
      this.showLoading(false);
    }
  }

  private buildRequestConfig(method: string, url: string): RequestInit {
    const config: RequestInit = {
      method,
      headers: {},
    };

    // Add headers
    this.container.querySelectorAll('.header-item').forEach(item => {
      const key = (item.querySelector('.header-key') as HTMLInputElement).value.trim();
      const value = (item.querySelector('.header-value') as HTMLInputElement).value.trim();
      if (key && value) {
        (config.headers as Record<string, string>)[key] = value;
      }
    });

    // Add authentication
    const authType = (this.container.querySelector('input[name="auth-type"]:checked') as HTMLInputElement).value;
    this.addAuthToConfig(config, authType);

    // Add body
    const bodyType = (this.container.querySelector('input[name="body-type"]:checked') as HTMLInputElement).value;
    this.addBodyToConfig(config, bodyType);

    return config;
  }

  private addAuthToConfig(config: RequestInit, authType: string): void {
    const headers = config.headers as Record<string, string>;

    switch (authType) {
      case 'bearer':
        const bearerToken = (this.container.querySelector('#bearer-token') as HTMLInputElement)?.value;
        if (bearerToken) {
          headers['Authorization'] = `Bearer ${bearerToken}`;
        }
        break;
      case 'basic':
        const username = (this.container.querySelector('#basic-username') as HTMLInputElement)?.value;
        const password = (this.container.querySelector('#basic-password') as HTMLInputElement)?.value;
        if (username && password) {
          headers['Authorization'] = `Basic ${btoa(`${username}:${password}`)}`;
        }
        break;
      case 'apikey':
        const apiKey = (this.container.querySelector('#api-key') as HTMLInputElement)?.value;
        const keyName = (this.container.querySelector('#apikey-name') as HTMLInputElement)?.value || 'X-API-Key';
        const location = (this.container.querySelector('#apikey-location') as HTMLSelectElement)?.value;
        if (apiKey && location === 'header') {
          headers[keyName] = apiKey;
        }
        // Query parameter handling would need URL modification
        break;
    }
  }

  private addBodyToConfig(config: RequestInit, bodyType: string): void {
    switch (bodyType) {
      case 'json':
        const jsonBody = (this.container.querySelector('#request-body') as HTMLTextAreaElement).value.trim();
        if (jsonBody) {
          config.body = jsonBody;
          (config.headers as Record<string, string>)['Content-Type'] = 'application/json';
        }
        break;
      case 'xml':
        const xmlBody = (this.container.querySelector('#request-body') as HTMLTextAreaElement).value.trim();
        if (xmlBody) {
          config.body = xmlBody;
          (config.headers as Record<string, string>)['Content-Type'] = 'application/xml';
        }
        break;
      case 'text':
        const textBody = (this.container.querySelector('#request-body') as HTMLTextAreaElement).value.trim();
        if (textBody) {
          config.body = textBody;
          (config.headers as Record<string, string>)['Content-Type'] = 'text/plain';
        }
        break;
      case 'form':
        const formData = new FormData();
        this.container.querySelectorAll('.form-field-item').forEach(item => {
          const key = (item.querySelector('.field-key') as HTMLInputElement).value.trim();
          const value = (item.querySelector('.field-value') as HTMLInputElement).value.trim();
          if (key && value) {
            formData.append(key, value);
          }
        });
        if (formData.entries().next().value) {
          config.body = formData;
        }
        break;
    }
  }

  private async handleResponse(response: Response, duration: number): Promise<void> {
    const responseText = await response.text();
    const responseSize = new Blob([responseText]).size;

    // Update status
    this.updateResponseStatus(response.status, response.statusText, duration, responseSize);

    // Update body
    this.updateResponseBody(responseText, response.headers.get('content-type') || '');

    // Update headers
    this.updateResponseHeaders(response.headers);

    // Update raw
    this.updateResponseRaw(response, responseText);
  }

  private updateResponseStatus(status: number, statusText: string, duration: number, size: number): void {
    const statusElement = this.container.querySelector('#response-status') as HTMLElement;
    const statusCode = statusElement.querySelector('.status-code') as HTMLElement;
    const statusTextElement = statusElement.querySelector('.status-text') as HTMLElement;
    const responseTime = statusElement.querySelector('.response-time') as HTMLElement;
    const responseSize = statusElement.querySelector('.response-size') as HTMLElement;

    statusCode.textContent = status.toString();
    statusCode.className = `status-code ${this.getStatusClass(status)}`;
    statusTextElement.textContent = statusText;
    responseTime.textContent = `${duration}ms`;
    responseSize.textContent = this.formatBytes(size);

    statusElement.style.display = 'block';
  }

  private updateResponseBody(body: string, contentType: string): void {
    const bodyElement = this.container.querySelector('#response-body') as HTMLElement;
    
    if (contentType.includes('application/json')) {
      try {
        const formatted = JSON.stringify(JSON.parse(body), null, 2);
        bodyElement.textContent = formatted;
      } catch {
        bodyElement.textContent = body;
      }
    } else {
      bodyElement.textContent = body;
    }
  }

  private updateResponseHeaders(headers: Headers): void {
    const headersElement = this.container.querySelector('#response-headers') as HTMLElement;
    const headersList: string[] = [];
    
    headers.forEach((value, key) => {
      headersList.push(`${key}: ${value}`);
    });
    
    headersElement.textContent = headersList.join('\n');
  }

  private updateResponseRaw(response: Response, body: string): void {
    const rawElement = this.container.querySelector('#response-raw') as HTMLElement;
    const rawResponse = `HTTP/1.1 ${response.status} ${response.statusText}\n${Array.from(response.headers.entries()).map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${body}`;
    rawElement.textContent = rawResponse;
  }

  private handleError(error: Error): void {
    const bodyElement = this.container.querySelector('#response-body') as HTMLElement;
    bodyElement.textContent = `Error: ${error.message}`;
    
    const statusElement = this.container.querySelector('#response-status') as HTMLElement;
    statusElement.style.display = 'none';
    
    this.showNotification(`Request failed: ${error.message}`, 'error');
  }

  private addToHistory(method: string, url: string, status?: number, duration?: number): void {
    const historyItem: RequestHistory = {
      id: Date.now().toString(),
      method,
      url,
      timestamp: new Date(),
      status,
      duration
    };

    this.requestHistory.unshift(historyItem);
    if (this.requestHistory.length > 50) {
      this.requestHistory = this.requestHistory.slice(0, 50);
    }

    this.updateHistoryDisplay();
  }

  private updateHistoryDisplay(): void {
    const historyList = this.container.querySelector('#history-list') as HTMLElement;
    
    if (this.requestHistory.length === 0) {
      historyList.innerHTML = '<div class="history-empty">No requests yet. Send your first API request!</div>';
      return;
    }

    historyList.innerHTML = this.requestHistory.map(item => `
      <div class="history-item" data-id="${item.id}">
        <div class="history-method ${item.method.toLowerCase()}">${item.method}</div>
        <div class="history-url">${item.url}</div>
        <div class="history-status ${item.status ? this.getStatusClass(item.status) : 'error'}">
          ${item.status || 'Error'}
        </div>
        <div class="history-time">${item.duration || 0}ms</div>
        <div class="history-timestamp">${item.timestamp.toLocaleTimeString()}</div>
      </div>
    `).join('');
  }

  private getStatusClass(status: number): string {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 300 && status < 400) return 'redirect';
    if (status >= 400 && status < 500) return 'client-error';
    if (status >= 500) return 'server-error';
    return '';
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private formatResponse(type: 'json' | 'xml'): void {
    const bodyElement = this.container.querySelector('#response-body') as HTMLElement;
    const content = bodyElement.textContent || '';

    try {
      if (type === 'json') {
        const parsed = JSON.parse(content);
        bodyElement.textContent = JSON.stringify(parsed, null, 2);
      } else if (type === 'xml') {
        // Basic XML formatting
        const formatted = content.replace(/></g, '>\n<');
        bodyElement.textContent = formatted;
      }
    } catch (error) {
      this.showNotification(`Failed to format as ${type.toUpperCase()}`, 'error');
    }
  }

  private async copyResponse(): Promise<void> {
    const bodyElement = this.container.querySelector('#response-body') as HTMLElement;
    const content = bodyElement.textContent || '';

    if (!content || content === 'No response yet. Send a request to see results.') {
      this.showNotification('No response to copy', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      this.showNotification('Response copied to clipboard', 'success');
    } catch (error) {
      this.showNotification('Failed to copy response', 'error');
    }
  }

  private clearRequest(): void {
    // Clear URL and method
    (this.container.querySelector('#api-url') as HTMLInputElement).value = '';
    (this.container.querySelector('#http-method') as HTMLSelectElement).value = 'GET';

    // Clear headers
    (this.container.querySelector('#headers-list') as HTMLElement).innerHTML = '';

    // Clear body
    (this.container.querySelector('#request-body') as HTMLTextAreaElement).value = '';

    // Clear form fields
    (this.container.querySelector('#form-fields') as HTMLElement).innerHTML = '';

    // Clear parameters
    (this.container.querySelector('#params-list') as HTMLElement).innerHTML = '';

    // Reset body type
    (this.container.querySelector('input[name="body-type"][value="none"]') as HTMLInputElement).checked = true;
    this.switchBodyType('none');

    // Reset auth type
    (this.container.querySelector('input[name="auth-type"][value="none"]') as HTMLInputElement).checked = true;
    this.switchAuthType('none');

    this.showNotification('Request cleared', 'success');
  }

  private clearHistory(): void {
    this.requestHistory = [];
    this.updateHistoryDisplay();
    this.showNotification('History cleared', 'success');
  }

  private showLoading(show: boolean): void {
    const sendButton = this.container.querySelector('#send-request') as HTMLButtonElement;
    if (show) {
      sendButton.disabled = true;
      sendButton.textContent = 'Sending...';
    } else {
      sendButton.disabled = false;
      sendButton.innerHTML = `${getIcon('api')} Send Request`;
    }
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
