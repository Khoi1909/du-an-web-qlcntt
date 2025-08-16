import { getIcon } from '@/utils/icons';

interface TimestampResult {
  unix: number;
  iso: string;
  utc: string;
  local: string;
  relative: string;
}

export class TimestampTool {
  private container: HTMLElement;
  private updateInterval: number | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.attachEventListeners();
    this.startLiveClock();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('timestamp')}</div>
          <div class="tool-title">
            <h2>Timestamp Converter</h2>
            <p>Convert between Unix timestamps, ISO dates, and human-readable formats</p>
          </div>
        </div>

        <div class="tool-content">
          <div class="current-time-section">
            <div class="section-header">
              <h3>Current Time</h3>
              <div class="tool-actions">
                <button id="refresh-time" class="btn btn-secondary">
                  ${getIcon('generation')} Refresh
                </button>
              </div>
            </div>
            <div class="current-time-display">
              <div class="time-card">
                <div class="time-label">Unix Timestamp</div>
                <div class="time-value" id="current-unix">0</div>
                <button class="copy-time-btn" data-value="current-unix" title="Copy Unix timestamp">
                  ${getIcon('copy')}
                </button>
              </div>
              <div class="time-card">
                <div class="time-label">ISO 8601</div>
                <div class="time-value" id="current-iso">-</div>
                <button class="copy-time-btn" data-value="current-iso" title="Copy ISO date">
                  ${getIcon('copy')}
                </button>
              </div>
              <div class="time-card">
                <div class="time-label">Local Time</div>
                <div class="time-value" id="current-local">-</div>
                <button class="copy-time-btn" data-value="current-local" title="Copy local time">
                  ${getIcon('copy')}
                </button>
              </div>
              <div class="time-card">
                <div class="time-label">UTC Time</div>
                <div class="time-value" id="current-utc">-</div>
                <button class="copy-time-btn" data-value="current-utc" title="Copy UTC time">
                  ${getIcon('copy')}
                </button>
              </div>
            </div>
          </div>

          <div class="converter-section">
            <div class="section-header">
              <h3>Convert Timestamp</h3>
            </div>
            
            <div class="converter-tabs">
              <div class="tab-buttons">
                <button class="tab-btn active" data-tab="to-human">To Human Readable</button>
                <button class="tab-btn" data-tab="to-timestamp">To Timestamp</button>
                <button class="tab-btn" data-tab="batch-convert">Batch Convert</button>
              </div>

              <div class="tab-content">
                <div id="to-human-tab" class="tab-panel active">
                  <div class="input-section">
                    <label for="timestamp-input">Enter Unix Timestamp:</label>
                    <div class="input-group">
                      <input 
                        type="text" 
                        id="timestamp-input" 
                        placeholder="1234567890"
                        class="tool-input"
                      />
                      <select id="timestamp-unit" class="tool-input">
                        <option value="seconds">Seconds</option>
                        <option value="milliseconds">Milliseconds</option>
                        <option value="microseconds">Microseconds</option>
                      </select>
                      <button id="convert-to-human" class="btn btn-primary">Convert</button>
                    </div>
                    <div class="quick-actions">
                      <button id="use-current-timestamp" class="btn btn-secondary">Use Current</button>
                      <button id="paste-timestamp" class="btn btn-secondary">Paste</button>
                    </div>
                  </div>
                  <div class="output-section">
                    <div id="human-readable-output" class="conversion-output">
                      <div class="output-empty">Enter a timestamp to see conversion</div>
                    </div>
                  </div>
                </div>

                <div id="to-timestamp-tab" class="tab-panel">
                  <div class="input-section">
                    <label for="date-input">Enter Date/Time:</label>
                    <div class="date-input-options">
                      <div class="input-method">
                        <label class="radio-label">
                          <input type="radio" name="date-method" value="picker" checked />
                          Date Picker
                        </label>
                        <div class="date-picker-inputs">
                          <input type="datetime-local" id="datetime-picker" class="tool-input" />
                        </div>
                      </div>
                      <div class="input-method">
                        <label class="radio-label">
                          <input type="radio" name="date-method" value="text" />
                          Text Input
                        </label>
                        <div class="text-input-container">
                          <input 
                            type="text" 
                            id="date-text-input" 
                            placeholder="2024-01-01 12:00:00 or ISO format"
                            class="tool-input"
                            disabled
                          />
                          <div class="date-format-hints">
                            <small>Supported formats: ISO 8601, YYYY-MM-DD HH:mm:ss, MM/DD/YYYY, etc.</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="timezone-selector">
                      <label for="timezone-select">Timezone:</label>
                      <select id="timezone-select" class="tool-input">
                        <option value="local">Local Time</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">New York (EST/EDT)</option>
                        <option value="America/Los_Angeles">Los Angeles (PST/PDT)</option>
                        <option value="Europe/London">London (GMT/BST)</option>
                        <option value="Europe/Paris">Paris (CET/CEST)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                        <option value="Asia/Shanghai">Shanghai (CST)</option>
                        <option value="Australia/Sydney">Sydney (AEST/AEDT)</option>
                      </select>
                    </div>
                    <div class="convert-actions">
                      <button id="convert-to-timestamp" class="btn btn-primary">Convert to Timestamp</button>
                      <button id="use-current-time" class="btn btn-secondary">Use Current Time</button>
                    </div>
                  </div>
                  <div class="output-section">
                    <div id="timestamp-output" class="conversion-output">
                      <div class="output-empty">Select a date/time to see timestamp</div>
                    </div>
                  </div>
                </div>

                <div id="batch-convert-tab" class="tab-panel">
                  <div class="batch-input-section">
                    <label for="batch-input">Enter multiple timestamps (one per line):</label>
                    <textarea 
                      id="batch-input" 
                      placeholder="1234567890&#10;1640995200&#10;1672531200"
                      class="tool-textarea"
                      rows="6"
                    ></textarea>
                    <div class="batch-options">
                      <select id="batch-unit" class="tool-input">
                        <option value="seconds">Seconds</option>
                        <option value="milliseconds">Milliseconds</option>
                      </select>
                      <button id="batch-convert" class="btn btn-primary">Convert All</button>
                      <button id="clear-batch" class="btn btn-secondary">Clear</button>
                    </div>
                  </div>
                  <div class="batch-output-section">
                    <div class="section-header">
                      <h4>Batch Results</h4>
                      <div class="tool-actions">
                        <button id="copy-batch-results" class="btn btn-secondary">
                          ${getIcon('copy')} Copy Results
                        </button>
                        <button id="export-batch-csv" class="btn btn-secondary">
                          Export CSV
                        </button>
                      </div>
                    </div>
                    <div id="batch-results" class="batch-results">
                      <div class="output-empty">Enter timestamps to see batch conversion</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="time-utilities-section">
            <div class="section-header">
              <h3>Time Utilities</h3>
            </div>
            
            <div class="utilities-grid">
              <div class="utility-card">
                <h4>Time Difference Calculator</h4>
                <div class="time-diff-inputs">
                  <div class="input-group">
                    <label>Start Time:</label>
                    <input type="datetime-local" id="start-time" class="tool-input" />
                  </div>
                  <div class="input-group">
                    <label>End Time:</label>
                    <input type="datetime-local" id="end-time" class="tool-input" />
                  </div>
                  <button id="calculate-diff" class="btn btn-primary">Calculate Difference</button>
                </div>
                <div id="time-diff-result" class="utility-result"></div>
              </div>

              <div class="utility-card">
                <h4>Add/Subtract Time</h4>
                <div class="time-math-inputs">
                  <div class="input-group">
                    <label>Base Time:</label>
                    <input type="datetime-local" id="base-time" class="tool-input" />
                  </div>
                  <div class="input-group">
                    <label>Operation:</label>
                    <select id="time-operation" class="tool-input">
                      <option value="add">Add</option>
                      <option value="subtract">Subtract</option>
                    </select>
                  </div>
                  <div class="input-group">
                    <label>Amount:</label>
                    <input type="number" id="time-amount" class="tool-input" placeholder="0" />
                    <select id="time-unit" class="tool-input">
                      <option value="seconds">Seconds</option>
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                  <button id="calculate-time-math" class="btn btn-primary">Calculate</button>
                </div>
                <div id="time-math-result" class="utility-result"></div>
              </div>
            </div>
          </div>

          <div class="timezone-converter-section">
            <div class="section-header">
              <h3>Timezone Converter</h3>
            </div>
            <div class="timezone-converter">
              <div class="timezone-input">
                <label>Input Time & Timezone:</label>
                <div class="input-group">
                  <input type="datetime-local" id="tz-input-time" class="tool-input" />
                  <select id="tz-input-zone" class="tool-input">
                    <option value="local">Local Time</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">New York</option>
                    <option value="America/Los_Angeles">Los Angeles</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="Asia/Shanghai">Shanghai</option>
                    <option value="Australia/Sydney">Sydney</option>
                  </select>
                </div>
              </div>
              <div class="timezone-outputs" id="timezone-outputs">
                <div class="output-empty">Select a time to see timezone conversions</div>
              </div>
            </div>
          </div>

          <div class="tool-info">
            <div class="info-item">
              <strong>Unix Timestamp:</strong>
              <p>Number of seconds since January 1, 1970 00:00:00 UTC (Unix Epoch).</p>
            </div>
            <div class="info-item">
              <strong>ISO 8601:</strong>
              <p>International standard for date and time representation (YYYY-MM-DDTHH:mm:ss.sssZ).</p>
            </div>
            <div class="info-item">
              <strong>Timezone Support:</strong>
              <p>Supports major timezones with automatic DST handling where applicable.</p>
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
        this.switchTab(tabName!);
      });
    });

    // Current time actions
    this.container.querySelector('#refresh-time')?.addEventListener('click', () => {
      this.updateCurrentTime();
    });

    // Copy current time buttons
    this.container.querySelectorAll('.copy-time-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const valueId = (e.target as HTMLElement).getAttribute('data-value');
        this.copyCurrentTime(valueId!);
      });
    });

    // To human readable conversion
    this.container.querySelector('#convert-to-human')?.addEventListener('click', () => {
      this.convertToHuman();
    });

    this.container.querySelector('#use-current-timestamp')?.addEventListener('click', () => {
      const currentUnix = Math.floor(Date.now() / 1000);
      (this.container.querySelector('#timestamp-input') as HTMLInputElement).value = currentUnix.toString();
      this.convertToHuman();
    });

    this.container.querySelector('#paste-timestamp')?.addEventListener('click', () => {
      this.pasteTimestamp();
    });

    // To timestamp conversion
    this.container.querySelector('#convert-to-timestamp')?.addEventListener('click', () => {
      this.convertToTimestamp();
    });

    this.container.querySelector('#use-current-time')?.addEventListener('click', () => {
      this.setCurrentDateTime();
    });

    // Date input method switching
    this.container.querySelectorAll('input[name="date-method"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.switchDateInputMethod((e.target as HTMLInputElement).value);
      });
    });

    // Batch conversion
    this.container.querySelector('#batch-convert')?.addEventListener('click', () => {
      this.batchConvert();
    });

    this.container.querySelector('#clear-batch')?.addEventListener('click', () => {
      this.clearBatch();
    });

    this.container.querySelector('#copy-batch-results')?.addEventListener('click', () => {
      this.copyBatchResults();
    });

    this.container.querySelector('#export-batch-csv')?.addEventListener('click', () => {
      this.exportBatchCsv();
    });

    // Time utilities
    this.container.querySelector('#calculate-diff')?.addEventListener('click', () => {
      this.calculateTimeDifference();
    });

    this.container.querySelector('#calculate-time-math')?.addEventListener('click', () => {
      this.calculateTimeMath();
    });

    // Timezone converter
    this.container.querySelector('#tz-input-time')?.addEventListener('change', () => {
      this.updateTimezoneConversions();
    });

    this.container.querySelector('#tz-input-zone')?.addEventListener('change', () => {
      this.updateTimezoneConversions();
    });

    // Real-time updates
    this.container.querySelector('#timestamp-input')?.addEventListener('input', () => {
      this.convertToHuman();
    });

    // Initialize current time
    this.updateCurrentTime();
  }

  private startLiveClock(): void {
    this.updateInterval = window.setInterval(() => {
      this.updateCurrentTime();
    }, 1000);
  }

  private updateCurrentTime(): void {
    const now = new Date();
    const unix = Math.floor(now.getTime() / 1000);
    const iso = now.toISOString();
    const local = now.toLocaleString();
    const utc = now.toUTCString();

    (this.container.querySelector('#current-unix') as HTMLElement).textContent = unix.toString();
    (this.container.querySelector('#current-iso') as HTMLElement).textContent = iso;
    (this.container.querySelector('#current-local') as HTMLElement).textContent = local;
    (this.container.querySelector('#current-utc') as HTMLElement).textContent = utc;
  }

  private switchTab(tabName: string): void {
    // Update tab buttons
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    this.container.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

    // Update tab panels
    this.container.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    this.container.querySelector(`#${tabName}-tab`)?.classList.add('active');
  }

  private convertToHuman(): void {
    const timestampInput = this.container.querySelector('#timestamp-input') as HTMLInputElement;
    const unit = (this.container.querySelector('#timestamp-unit') as HTMLSelectElement).value;
    const output = this.container.querySelector('#human-readable-output') as HTMLElement;

    const timestampStr = timestampInput.value.trim();
    if (!timestampStr) {
      output.innerHTML = '<div class="output-empty">Enter a timestamp to see conversion</div>';
      return;
    }

    try {
      let timestamp = parseFloat(timestampStr);
      
      // Convert to milliseconds based on unit
      switch (unit) {
        case 'seconds':
          timestamp *= 1000;
          break;
        case 'milliseconds':
          // Already in milliseconds
          break;
        case 'microseconds':
          timestamp /= 1000;
          break;
      }

      const date = new Date(timestamp);
      
      if (isNaN(date.getTime())) {
        throw new Error('Invalid timestamp');
      }

      const result = this.formatTimestampResult(date);
      this.displayHumanReadableResult(result);
    } catch (error) {
      output.innerHTML = `<div class="output-error">Error: ${(error as Error).message}</div>`;
    }
  }

  private formatTimestampResult(date: Date): TimestampResult {
    const unix = Math.floor(date.getTime() / 1000);
    const iso = date.toISOString();
    const utc = date.toUTCString();
    const local = date.toLocaleString();
    const relative = this.getRelativeTime(date);

    return { unix, iso, utc, local, relative };
  }

  private displayHumanReadableResult(result: TimestampResult): void {
    const output = this.container.querySelector('#human-readable-output') as HTMLElement;
    
    output.innerHTML = `
      <div class="conversion-result">
        <div class="result-item">
          <div class="result-label">Unix Timestamp:</div>
          <div class="result-value">${result.unix}</div>
          <button class="copy-result-btn" data-value="${result.unix}" title="Copy">
            ${getIcon('copy')}
          </button>
        </div>
        <div class="result-item">
          <div class="result-label">ISO 8601:</div>
          <div class="result-value">${result.iso}</div>
          <button class="copy-result-btn" data-value="${result.iso}" title="Copy">
            ${getIcon('copy')}
          </button>
        </div>
        <div class="result-item">
          <div class="result-label">Local Time:</div>
          <div class="result-value">${result.local}</div>
          <button class="copy-result-btn" data-value="${result.local}" title="Copy">
            ${getIcon('copy')}
          </button>
        </div>
        <div class="result-item">
          <div class="result-label">UTC Time:</div>
          <div class="result-value">${result.utc}</div>
          <button class="copy-result-btn" data-value="${result.utc}" title="Copy">
            ${getIcon('copy')}
          </button>
        </div>
        <div class="result-item">
          <div class="result-label">Relative Time:</div>
          <div class="result-value">${result.relative}</div>
        </div>
      </div>
    `;

    // Add copy functionality
    output.querySelectorAll('.copy-result-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const value = (e.target as HTMLElement).getAttribute('data-value');
        this.copyToClipboard(value!);
      });
    });
  }

  private convertToTimestamp(): void {
    const method = (this.container.querySelector('input[name="date-method"]:checked') as HTMLInputElement).value;
    const timezone = (this.container.querySelector('#timezone-select') as HTMLSelectElement).value;
    const output = this.container.querySelector('#timestamp-output') as HTMLElement;

    try {
      let date: Date;

      if (method === 'picker') {
        const datetimeValue = (this.container.querySelector('#datetime-picker') as HTMLInputElement).value;
        if (!datetimeValue) {
          output.innerHTML = '<div class="output-empty">Select a date/time to see timestamp</div>';
          return;
        }
        date = new Date(datetimeValue);
      } else {
        const textValue = (this.container.querySelector('#date-text-input') as HTMLInputElement).value.trim();
        if (!textValue) {
          output.innerHTML = '<div class="output-empty">Enter a date/time to see timestamp</div>';
          return;
        }
        date = new Date(textValue);
      }

      if (isNaN(date.getTime())) {
        throw new Error('Invalid date/time format');
      }

      // Adjust for timezone if needed
      if (timezone !== 'local' && timezone !== 'UTC') {
        // Note: This is a simplified timezone handling
        // In a real application, you'd use a library like date-fns-tz or moment-timezone
        console.warn('Advanced timezone conversion not implemented in this demo');
      }

      const result = this.formatTimestampResult(date);
      this.displayTimestampResult(result);
    } catch (error) {
      output.innerHTML = `<div class="output-error">Error: ${(error as Error).message}</div>`;
    }
  }

  private displayTimestampResult(result: TimestampResult): void {
    const output = this.container.querySelector('#timestamp-output') as HTMLElement;
    
    output.innerHTML = `
      <div class="conversion-result">
        <div class="result-item featured">
          <div class="result-label">Unix Timestamp (seconds):</div>
          <div class="result-value timestamp-value">${result.unix}</div>
          <button class="copy-result-btn" data-value="${result.unix}" title="Copy">
            ${getIcon('copy')}
          </button>
        </div>
        <div class="result-item">
          <div class="result-label">Milliseconds:</div>
          <div class="result-value">${result.unix * 1000}</div>
          <button class="copy-result-btn" data-value="${result.unix * 1000}" title="Copy">
            ${getIcon('copy')}
          </button>
        </div>
        <div class="result-item">
          <div class="result-label">ISO 8601:</div>
          <div class="result-value">${result.iso}</div>
          <button class="copy-result-btn" data-value="${result.iso}" title="Copy">
            ${getIcon('copy')}
          </button>
        </div>
      </div>
    `;

    // Add copy functionality
    output.querySelectorAll('.copy-result-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const value = (e.target as HTMLElement).getAttribute('data-value');
        this.copyToClipboard(value!);
      });
    });
  }

  private switchDateInputMethod(method: string): void {
    const datetimePicker = this.container.querySelector('#datetime-picker') as HTMLInputElement;
    const textInput = this.container.querySelector('#date-text-input') as HTMLInputElement;

    if (method === 'picker') {
      datetimePicker.disabled = false;
      textInput.disabled = true;
    } else {
      datetimePicker.disabled = true;
      textInput.disabled = false;
    }
  }

  private setCurrentDateTime(): void {
    const now = new Date();
    const datetimeLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    (this.container.querySelector('#datetime-picker') as HTMLInputElement).value = datetimeLocal;
    this.convertToTimestamp();
  }

  private batchConvert(): void {
    const batchInput = this.container.querySelector('#batch-input') as HTMLTextAreaElement;
    const unit = (this.container.querySelector('#batch-unit') as HTMLSelectElement).value;
    const results = this.container.querySelector('#batch-results') as HTMLElement;

    const timestamps = batchInput.value.trim().split('\n').filter(line => line.trim());
    
    if (timestamps.length === 0) {
      results.innerHTML = '<div class="output-empty">Enter timestamps to see batch conversion</div>';
      return;
    }

    const convertedResults: Array<{input: string, result?: TimestampResult, error?: string}> = [];

    timestamps.forEach(timestampStr => {
      try {
        let timestamp = parseFloat(timestampStr.trim());
        
        if (unit === 'seconds') {
          timestamp *= 1000;
        }

        const date = new Date(timestamp);
        
        if (isNaN(date.getTime())) {
          throw new Error('Invalid timestamp');
        }

        convertedResults.push({
          input: timestampStr.trim(),
          result: this.formatTimestampResult(date)
        });
      } catch (error) {
        convertedResults.push({
          input: timestampStr.trim(),
          error: (error as Error).message
        });
      }
    });

    this.displayBatchResults(convertedResults);
  }

  private displayBatchResults(results: Array<{input: string, result?: TimestampResult, error?: string}>): void {
    const container = this.container.querySelector('#batch-results') as HTMLElement;
    
    const tableHtml = `
      <table class="batch-results-table">
        <thead>
          <tr>
            <th>Input</th>
            <th>Local Time</th>
            <th>ISO 8601</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${results.map(item => {
            if (item.error) {
              return `
                <tr class="error-row">
                  <td>${item.input}</td>
                  <td colspan="2">Error: ${item.error}</td>
                  <td><span class="status-error">Failed</span></td>
                </tr>
              `;
            } else if (item.result) {
              return `
                <tr>
                  <td>${item.input}</td>
                  <td>${item.result.local}</td>
                  <td>${item.result.iso}</td>
                  <td><span class="status-success">Success</span></td>
                </tr>
              `;
            }
            return '';
          }).join('')}
        </tbody>
      </table>
    `;

    container.innerHTML = tableHtml;
  }

  private calculateTimeDifference(): void {
    const startTime = (this.container.querySelector('#start-time') as HTMLInputElement).value;
    const endTime = (this.container.querySelector('#end-time') as HTMLInputElement).value;
    const result = this.container.querySelector('#time-diff-result') as HTMLElement;

    if (!startTime || !endTime) {
      result.innerHTML = '<div class="utility-empty">Select both start and end times</div>';
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = Math.abs(end.getTime() - start.getTime());

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    result.innerHTML = `
      <div class="time-diff-display">
        <div class="diff-item"><strong>${diff}</strong> milliseconds</div>
        <div class="diff-item"><strong>${seconds}</strong> seconds</div>
        <div class="diff-item"><strong>${minutes}</strong> minutes</div>
        <div class="diff-item"><strong>${hours}</strong> hours</div>
        <div class="diff-item"><strong>${days}</strong> days</div>
        <div class="diff-formatted">
          <strong>Formatted:</strong> ${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s
        </div>
      </div>
    `;
  }

  private calculateTimeMath(): void {
    const baseTime = (this.container.querySelector('#base-time') as HTMLInputElement).value;
    const operation = (this.container.querySelector('#time-operation') as HTMLSelectElement).value;
    const amount = parseInt((this.container.querySelector('#time-amount') as HTMLInputElement).value) || 0;
    const unit = (this.container.querySelector('#time-unit') as HTMLSelectElement).value;
    const result = this.container.querySelector('#time-math-result') as HTMLElement;

    if (!baseTime) {
      result.innerHTML = '<div class="utility-empty">Select a base time</div>';
      return;
    }

    const base = new Date(baseTime);
    let multiplier = 1;

    switch (unit) {
      case 'seconds': multiplier = 1000; break;
      case 'minutes': multiplier = 60 * 1000; break;
      case 'hours': multiplier = 60 * 60 * 1000; break;
      case 'days': multiplier = 24 * 60 * 60 * 1000; break;
      case 'weeks': multiplier = 7 * 24 * 60 * 60 * 1000; break;
      case 'months': multiplier = 30 * 24 * 60 * 60 * 1000; break; // Approximate
      case 'years': multiplier = 365 * 24 * 60 * 60 * 1000; break; // Approximate
    }

    const offset = amount * multiplier * (operation === 'add' ? 1 : -1);
    const newDate = new Date(base.getTime() + offset);

    result.innerHTML = `
      <div class="time-math-display">
        <div class="math-result">
          <strong>Result:</strong> ${newDate.toLocaleString()}
        </div>
        <div class="math-details">
          <div><strong>ISO:</strong> ${newDate.toISOString()}</div>
          <div><strong>Unix:</strong> ${Math.floor(newDate.getTime() / 1000)}</div>
        </div>
      </div>
    `;
  }

  private updateTimezoneConversions(): void {
    const inputTime = (this.container.querySelector('#tz-input-time') as HTMLInputElement).value;
    const inputZone = (this.container.querySelector('#tz-input-zone') as HTMLSelectElement).value;
    const output = this.container.querySelector('#timezone-outputs') as HTMLElement;

    if (!inputTime) {
      output.innerHTML = '<div class="output-empty">Select a time to see timezone conversions</div>';
      return;
    }

    const date = new Date(inputTime);
    const timezones = [
      { name: 'UTC', value: 'UTC' },
      { name: 'New York', value: 'America/New_York' },
      { name: 'Los Angeles', value: 'America/Los_Angeles' },
      { name: 'London', value: 'Europe/London' },
      { name: 'Paris', value: 'Europe/Paris' },
      { name: 'Tokyo', value: 'Asia/Tokyo' },
      { name: 'Shanghai', value: 'Asia/Shanghai' },
      { name: 'Sydney', value: 'Australia/Sydney' }
    ];

    const conversions = timezones.map(tz => {
      try {
        const converted = new Intl.DateTimeFormat('en-US', {
          timeZone: tz.value,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(date);
        
        return { name: tz.name, time: converted, zone: tz.value };
      } catch {
        return { name: tz.name, time: 'Not supported', zone: tz.value };
      }
    });

    output.innerHTML = `
      <div class="timezone-conversions">
        ${conversions.map(conv => `
          <div class="timezone-item">
            <div class="timezone-name">${conv.name}</div>
            <div class="timezone-time">${conv.time}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const absDiff = Math.abs(diff);
    
    const seconds = Math.floor(absDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    const prefix = diff > 0 ? '' : 'in ';
    const suffix = diff > 0 ? ' ago' : '';

    if (years > 0) return `${prefix}${years} year${years !== 1 ? 's' : ''}${suffix}`;
    if (months > 0) return `${prefix}${months} month${months !== 1 ? 's' : ''}${suffix}`;
    if (days > 0) return `${prefix}${days} day${days !== 1 ? 's' : ''}${suffix}`;
    if (hours > 0) return `${prefix}${hours} hour${hours !== 1 ? 's' : ''}${suffix}`;
    if (minutes > 0) return `${prefix}${minutes} minute${minutes !== 1 ? 's' : ''}${suffix}`;
    if (seconds > 30) return `${prefix}${seconds} second${seconds !== 1 ? 's' : ''}${suffix}`;
    
    return 'just now';
  }

  private async copyCurrentTime(elementId: string): Promise<void> {
    const element = this.container.querySelector(`#${elementId}`) as HTMLElement;
    const value = element.textContent || '';
    
    try {
      await navigator.clipboard.writeText(value);
      this.showNotification('Time copied to clipboard', 'success');
    } catch (error) {
      this.showNotification('Failed to copy time', 'error');
    }
  }

  private async copyToClipboard(value: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      this.showNotification('Value copied to clipboard', 'success');
    } catch (error) {
      this.showNotification('Failed to copy value', 'error');
    }
  }

  private async pasteTimestamp(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      (this.container.querySelector('#timestamp-input') as HTMLInputElement).value = text.trim();
      this.convertToHuman();
      this.showNotification('Timestamp pasted', 'success');
    } catch (error) {
      this.showNotification('Failed to paste timestamp', 'error');
    }
  }

  private clearBatch(): void {
    (this.container.querySelector('#batch-input') as HTMLTextAreaElement).value = '';
    (this.container.querySelector('#batch-results') as HTMLElement).innerHTML = 
      '<div class="output-empty">Enter timestamps to see batch conversion</div>';
    this.showNotification('Batch input cleared', 'success');
  }

  private async copyBatchResults(): Promise<void> {
    const table = this.container.querySelector('.batch-results-table');
    if (!table) {
      this.showNotification('No batch results to copy', 'error');
      return;
    }

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const text = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td'));
      return cells.map(cell => cell.textContent?.trim()).join('\t');
    }).join('\n');

    try {
      await navigator.clipboard.writeText(text);
      this.showNotification('Batch results copied to clipboard', 'success');
    } catch (error) {
      this.showNotification('Failed to copy batch results', 'error');
    }
  }

  private exportBatchCsv(): void {
    const table = this.container.querySelector('.batch-results-table');
    if (!table) {
      this.showNotification('No batch results to export', 'error');
      return;
    }

    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim()).join(',');
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(row => {
      const cells = Array.from(row.querySelectorAll('td'));
      return cells.map(cell => `"${(cell.textContent?.trim() || '').replace(/"/g, '""')}"`).join(',');
    });

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'timestamp_conversions.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.showNotification('CSV file exported', 'success');
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
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}
