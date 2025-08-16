import { getIcon } from '@/utils/icons';

interface CsvOptions {
  delimiter: string;
  hasHeaders: boolean;
  quoteChar: string;
  escapeChar: string;
  trimWhitespace: boolean;
}

export class CsvJsonTool {
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
          <div class="tool-icon">${getIcon('csv')}</div>
          <div class="tool-title">
            <h2>CSV ↔ JSON Converter</h2>
            <p>Convert between CSV and JSON formats with customizable options</p>
          </div>
        </div>

        <div class="tool-content">
          <div class="converter-layout">
            <div class="converter-panel">
              <div class="panel-header">
                <span>CSV Input</span>
                <div class="panel-actions">
                  <button id="load-csv-file" class="btn-icon" title="Load CSV file">
                    ${getIcon('clipboard')}
                  </button>
                  <button id="paste-csv" class="btn-icon" title="Paste CSV">
                    ${getIcon('clipboard')}
                  </button>
                  <button id="clear-csv" class="btn-icon" title="Clear CSV">
                    ${getIcon('trash')}
                  </button>
                </div>
              </div>
              <textarea 
                id="csv-input" 
                class="converter-input"
                placeholder="Paste CSV data here or load a file...&#10;&#10;Example:&#10;name,age,city&#10;John,25,New York&#10;Jane,30,London"
              ></textarea>
              <div class="input-validation" id="csv-validation"></div>
            </div>

            <div class="converter-arrows">
              <button id="csv-to-json" class="arrow-button" title="Convert CSV to JSON">
                ${getIcon('chevronRight')}
              </button>
              <button id="json-to-csv" class="arrow-button" title="Convert JSON to CSV">
                ${getIcon('chevronLeft')}
              </button>
            </div>

            <div class="converter-panel">
              <div class="panel-header">
                <span>JSON Output</span>
                <div class="panel-actions">
                  <button id="format-json" class="btn-icon" title="Format JSON">
                    ${getIcon('code')}
                  </button>
                  <button id="minify-json" class="btn-icon" title="Minify JSON">
                    ${getIcon('string')}
                  </button>
                  <button id="copy-json" class="btn-icon" title="Copy JSON">
                    ${getIcon('copy')}
                  </button>
                  <button id="save-json" class="btn-icon" title="Save JSON file">
                    ${getIcon('clipboard')}
                  </button>
                </div>
              </div>
              <textarea 
                id="json-output" 
                class="converter-output"
                placeholder="JSON output will appear here..."
                readonly
              ></textarea>
              <div class="output-validation" id="json-validation"></div>
            </div>
          </div>

          <div class="converter-options">
            <div class="section-header">
              <h3>Conversion Options</h3>
            </div>
            
            <div class="options-grid">
              <div class="option-group">
                <h4>CSV Options</h4>
                <div class="option-controls">
                  <div class="option-item">
                    <label for="csv-delimiter">Delimiter:</label>
                    <select id="csv-delimiter" class="tool-input">
                      <option value=",">Comma (,)</option>
                      <option value=";">Semicolon (;)</option>
                      <option value="\t">Tab (\\t)</option>
                      <option value="|">Pipe (|)</option>
                      <option value="custom">Custom</option>
                    </select>
                    <input 
                      type="text" 
                      id="custom-delimiter" 
                      placeholder="Enter delimiter"
                      class="tool-input"
                      style="display: none; width: 100px;"
                      maxlength="5"
                    />
                  </div>
                  
                  <div class="option-item">
                    <label for="quote-char">Quote Character:</label>
                    <select id="quote-char" class="tool-input">
                      <option value='"'>Double Quote (")</option>
                      <option value="'">Single Quote (')</option>
                      <option value="">None</option>
                    </select>
                  </div>
                  
                  <div class="option-item">
                    <label class="checkbox-label">
                      <input type="checkbox" id="has-headers" checked />
                      First row contains headers
                    </label>
                  </div>
                  
                  <div class="option-item">
                    <label class="checkbox-label">
                      <input type="checkbox" id="trim-whitespace" checked />
                      Trim whitespace
                    </label>
                  </div>
                </div>
              </div>

              <div class="option-group">
                <h4>JSON Options</h4>
                <div class="option-controls">
                  <div class="option-item">
                    <label for="json-format">Output Format:</label>
                    <select id="json-format" class="tool-input">
                      <option value="array">Array of Objects</option>
                      <option value="object">Object with Arrays</option>
                      <option value="rows">Array of Arrays</option>
                    </select>
                  </div>
                  
                  <div class="option-item">
                    <label for="json-indent">Indentation:</label>
                    <select id="json-indent" class="tool-input">
                      <option value="2">2 spaces</option>
                      <option value="4">4 spaces</option>
                      <option value="\t">Tab</option>
                      <option value="0">Minified</option>
                    </select>
                  </div>
                  
                  <div class="option-item">
                    <label class="checkbox-label">
                      <input type="checkbox" id="convert-types" checked />
                      Auto-convert data types
                    </label>
                  </div>
                  
                  <div class="option-item">
                    <label class="checkbox-label">
                      <input type="checkbox" id="sort-keys" />
                      Sort object keys
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="conversion-preview">
            <div class="section-header">
              <h3>Data Preview</h3>
            </div>
            <div class="preview-container">
              <div class="preview-table" id="preview-table">
                <div class="preview-empty">Load CSV data to see preview</div>
              </div>
            </div>
          </div>

          <div class="conversion-stats">
            <div class="section-header">
              <h3>Statistics</h3>
            </div>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Rows</div>
                <div class="stat-value" id="row-count">0</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Columns</div>
                <div class="stat-value" id="column-count">0</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">CSV Size</div>
                <div class="stat-value" id="csv-size">0 B</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">JSON Size</div>
                <div class="stat-value" id="json-size">0 B</div>
              </div>
            </div>
          </div>

          <div class="sample-data">
            <div class="section-header">
              <h3>Sample Data</h3>
            </div>
            <div class="sample-buttons">
              <button id="load-sample-users" class="btn btn-secondary">Load Users Sample</button>
              <button id="load-sample-products" class="btn btn-secondary">Load Products Sample</button>
              <button id="load-sample-sales" class="btn btn-secondary">Load Sales Sample</button>
            </div>
          </div>

          <input type="file" id="csv-file-input" accept=".csv,.txt" style="display: none;" />

          <div class="tool-info">
            <div class="info-item">
              <strong>CSV Format:</strong>
              <p>Supports various delimiters, quoted fields, and custom escape characters.</p>
            </div>
            <div class="info-item">
              <strong>JSON Formats:</strong>
              <p>Generate different JSON structures: array of objects, object with arrays, or raw arrays.</p>
            </div>
            <div class="info-item">
              <strong>Data Types:</strong>
              <p>Automatically detects and converts numbers, booleans, and null values when enabled.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const csvInput = this.container.querySelector('#csv-input') as HTMLTextAreaElement;
    const jsonOutput = this.container.querySelector('#json-output') as HTMLTextAreaElement;
    const fileInput = this.container.querySelector('#csv-file-input') as HTMLInputElement;

    // Input events
    csvInput.addEventListener('input', () => {
      this.updatePreview();
      this.updateStats();
    });

    // Conversion buttons
    this.container.querySelector('#csv-to-json')?.addEventListener('click', () => {
      this.convertCsvToJson();
    });

    this.container.querySelector('#json-to-csv')?.addEventListener('click', () => {
      this.convertJsonToCsv();
    });

    // File operations
    this.container.querySelector('#load-csv-file')?.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      this.handleFileLoad(e);
    });

    // Actions
    this.container.querySelector('#paste-csv')?.addEventListener('click', () => {
      this.pasteFromClipboard();
    });

    this.container.querySelector('#clear-csv')?.addEventListener('click', () => {
      this.clearCsv();
    });

    this.container.querySelector('#copy-json')?.addEventListener('click', () => {
      this.copyJson();
    });

    this.container.querySelector('#format-json')?.addEventListener('click', () => {
      this.formatJson();
    });

    this.container.querySelector('#minify-json')?.addEventListener('click', () => {
      this.minifyJson();
    });

    this.container.querySelector('#save-json')?.addEventListener('click', () => {
      this.saveJsonFile();
    });

    // Options
    this.container.querySelector('#csv-delimiter')?.addEventListener('change', (e) => {
      const delimiter = (e.target as HTMLSelectElement).value;
      const customDelimiter = this.container.querySelector('#custom-delimiter') as HTMLInputElement;
      customDelimiter.style.display = delimiter === 'custom' ? 'inline-block' : 'none';
      this.updatePreview();
    });

    this.container.querySelector('#custom-delimiter')?.addEventListener('input', () => {
      this.updatePreview();
    });

    this.container.querySelectorAll('#has-headers, #trim-whitespace, #convert-types, #sort-keys').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updatePreview();
      });
    });

    // Sample data
    this.container.querySelector('#load-sample-users')?.addEventListener('click', () => {
      this.loadSampleData('users');
    });

    this.container.querySelector('#load-sample-products')?.addEventListener('click', () => {
      this.loadSampleData('products');
    });

    this.container.querySelector('#load-sample-sales')?.addEventListener('click', () => {
      this.loadSampleData('sales');
    });

    // Initial setup
    this.updatePreview();
    this.updateStats();
  }

  private getCsvOptions(): CsvOptions {
    const delimiterSelect = this.container.querySelector('#csv-delimiter') as HTMLSelectElement;
    const customDelimiter = this.container.querySelector('#custom-delimiter') as HTMLInputElement;
    const quoteChar = (this.container.querySelector('#quote-char') as HTMLSelectElement).value;
    const hasHeaders = (this.container.querySelector('#has-headers') as HTMLInputElement).checked;
    const trimWhitespace = (this.container.querySelector('#trim-whitespace') as HTMLInputElement).checked;

    let delimiter = delimiterSelect.value;
    if (delimiter === 'custom') {
      delimiter = customDelimiter.value || ',';
    } else if (delimiter === '\t') {
      delimiter = '\t';
    }

    return {
      delimiter,
      hasHeaders,
      quoteChar,
      escapeChar: '\\',
      trimWhitespace
    };
  }

  private parseCsv(csvText: string, options: CsvOptions): any[] {
    if (!csvText.trim()) return [];

    const lines = csvText.split('\n').filter(line => line.trim());
    const result: any[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const fields = this.parseCsvLine(line, options);
      
      if (fields.length > 0) {
        result.push(fields);
      }
    }

    return result;
  }

  private parseCsvLine(line: string, options: CsvOptions): string[] {
    const fields: string[] = [];
    let currentField = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === options.quoteChar && !inQuotes) {
        inQuotes = true;
      } else if (char === options.quoteChar && inQuotes) {
        if (nextChar === options.quoteChar) {
          currentField += options.quoteChar;
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else if (char === options.delimiter && !inQuotes) {
        fields.push(options.trimWhitespace ? currentField.trim() : currentField);
        currentField = '';
      } else {
        currentField += char;
      }

      i++;
    }

    fields.push(options.trimWhitespace ? currentField.trim() : currentField);
    return fields;
  }

  private convertCsvToJson(): void {
    const csvInput = this.container.querySelector('#csv-input') as HTMLTextAreaElement;
    const jsonOutput = this.container.querySelector('#json-output') as HTMLTextAreaElement;
    const csvText = csvInput.value.trim();

    if (!csvText) {
      this.showValidation('Please enter CSV data', 'error', 'csv-validation');
      return;
    }

    try {
      const options = this.getCsvOptions();
      const parsedData = this.parseCsv(csvText, options);
      
      if (parsedData.length === 0) {
        throw new Error('No valid CSV data found');
      }

      const jsonFormat = (this.container.querySelector('#json-format') as HTMLSelectElement).value;
      const convertTypes = (this.container.querySelector('#convert-types') as HTMLInputElement).checked;
      const sortKeys = (this.container.querySelector('#sort-keys') as HTMLInputElement).checked;
      
      let jsonData = this.convertToJsonFormat(parsedData, options, jsonFormat, convertTypes);
      
      if (sortKeys && Array.isArray(jsonData) && jsonData.length > 0 && typeof jsonData[0] === 'object') {
        jsonData = jsonData.map(item => this.sortObjectKeys(item));
      }

      const indent = this.getJsonIndent();
      const jsonString = JSON.stringify(jsonData, null, indent);
      
      jsonOutput.value = jsonString;
      this.showValidation('CSV converted to JSON successfully', 'success', 'csv-validation');
      this.updateStats();
    } catch (error) {
      this.showValidation(`Error: ${(error as Error).message}`, 'error', 'csv-validation');
      jsonOutput.value = '';
    }
  }

  private convertToJsonFormat(data: any[], options: CsvOptions, format: string, convertTypes: boolean): any {
    if (data.length === 0) return [];

    const headers = options.hasHeaders ? data[0] : data[0].map((_: any, index: number) => `column_${index + 1}`);
    const rows = options.hasHeaders ? data.slice(1) : data;

    switch (format) {
      case 'array':
        return rows.map(row => {
          const obj: any = {};
          headers.forEach((header: string, index: number) => {
            const value = row[index] || '';
            obj[header] = convertTypes ? this.convertValue(value) : value;
          });
          return obj;
        });

      case 'object':
        const result: any = {};
        headers.forEach((header: string, index: number) => {
          result[header] = rows.map(row => {
            const value = row[index] || '';
            return convertTypes ? this.convertValue(value) : value;
          });
        });
        return result;

      case 'rows':
        const allRows = options.hasHeaders ? data : data;
        if (convertTypes) {
          return allRows.map(row => row.map((cell: string) => this.convertValue(cell)));
        }
        return allRows;

      default:
        return data;
    }
  }

  private convertValue(value: string): any {
    if (value === '') return '';
    if (value.toLowerCase() === 'null') return null;
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    
    const numberValue = Number(value);
    if (!isNaN(numberValue) && value.trim() !== '') {
      return numberValue;
    }
    
    return value;
  }

  private convertJsonToCsv(): void {
    const jsonOutput = this.container.querySelector('#json-output') as HTMLTextAreaElement;
    const csvInput = this.container.querySelector('#csv-input') as HTMLTextAreaElement;
    const jsonText = jsonOutput.value.trim();

    if (!jsonText) {
      this.showValidation('Please convert CSV to JSON first or enter JSON data', 'error', 'json-validation');
      return;
    }

    try {
      const jsonData = JSON.parse(jsonText);
      const options = this.getCsvOptions();
      const csvString = this.convertJsonToCsvString(jsonData, options);
      
      csvInput.value = csvString;
      this.showValidation('JSON converted to CSV successfully', 'success', 'json-validation');
      this.updatePreview();
      this.updateStats();
    } catch (error) {
      this.showValidation(`Error: ${(error as Error).message}`, 'error', 'json-validation');
    }
  }

  private convertJsonToCsvString(data: any, options: CsvOptions): string {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('JSON must be an array of objects');
    }

    const firstItem = data[0];
    let headers: string[] = [];
    let rows: string[][] = [];

    if (Array.isArray(firstItem)) {
      // Array of arrays
      rows = data;
      if (options.hasHeaders) {
        headers = firstItem.map((_, index) => `column_${index + 1}`);
      }
    } else if (typeof firstItem === 'object' && firstItem !== null) {
      // Array of objects
      headers = Object.keys(firstItem);
      rows = data.map(item => headers.map(header => String(item[header] || '')));
    } else {
      throw new Error('Unsupported JSON format for CSV conversion');
    }

    const csvLines: string[] = [];
    
    if (options.hasHeaders && headers.length > 0) {
      csvLines.push(this.formatCsvLine(headers, options));
    }
    
    rows.forEach(row => {
      csvLines.push(this.formatCsvLine(row, options));
    });

    return csvLines.join('\n');
  }

  private formatCsvLine(fields: string[], options: CsvOptions): string {
    return fields.map(field => {
      const stringField = String(field);
      const needsQuotes = stringField.includes(options.delimiter) || 
                         stringField.includes('\n') || 
                         stringField.includes('\r') ||
                         (options.quoteChar && stringField.includes(options.quoteChar));

      if (needsQuotes && options.quoteChar) {
        const escapedField = stringField.replace(new RegExp(options.quoteChar, 'g'), options.quoteChar + options.quoteChar);
        return options.quoteChar + escapedField + options.quoteChar;
      }

      return stringField;
    }).join(options.delimiter);
  }

  private updatePreview(): void {
    const csvInput = this.container.querySelector('#csv-input') as HTMLTextAreaElement;
    const previewTable = this.container.querySelector('#preview-table') as HTMLElement;
    const csvText = csvInput.value.trim();

    if (!csvText) {
      previewTable.innerHTML = '<div class="preview-empty">Load CSV data to see preview</div>';
      return;
    }

    try {
      const options = this.getCsvOptions();
      const parsedData = this.parseCsv(csvText, options);
      
      if (parsedData.length === 0) {
        previewTable.innerHTML = '<div class="preview-empty">No valid CSV data</div>';
        return;
      }

      const maxRows = Math.min(10, parsedData.length);
      const headers = options.hasHeaders ? parsedData[0] : parsedData[0].map((_: any, index: number) => `Col ${index + 1}`);
      const dataRows = options.hasHeaders ? parsedData.slice(1, maxRows + 1) : parsedData.slice(0, maxRows);

      let tableHtml = '<table class="preview-table-element"><thead><tr>';
      headers.forEach((header: string) => {
        tableHtml += `<th>${this.escapeHtml(header)}</th>`;
      });
      tableHtml += '</tr></thead><tbody>';

      dataRows.forEach((row: string[]) => {
        tableHtml += '<tr>';
        headers.forEach((_: string, index: number) => {
          const cellValue = row[index] || '';
          tableHtml += `<td>${this.escapeHtml(cellValue)}</td>`;
        });
        tableHtml += '</tr>';
      });

      tableHtml += '</tbody></table>';
      
      if (parsedData.length > maxRows) {
        tableHtml += `<div class="preview-note">Showing first ${maxRows} rows of ${parsedData.length}</div>`;
      }

      previewTable.innerHTML = tableHtml;
    } catch (error) {
      previewTable.innerHTML = `<div class="preview-error">Error parsing CSV: ${(error as Error).message}</div>`;
    }
  }

  private updateStats(): void {
    const csvInput = this.container.querySelector('#csv-input') as HTMLTextAreaElement;
    const jsonOutput = this.container.querySelector('#json-output') as HTMLTextAreaElement;
    
    const csvText = csvInput.value;
    const jsonText = jsonOutput.value;

    // Update sizes
    const csvSize = new Blob([csvText]).size;
    const jsonSize = new Blob([jsonText]).size;
    
    (this.container.querySelector('#csv-size') as HTMLElement).textContent = this.formatBytes(csvSize);
    (this.container.querySelector('#json-size') as HTMLElement).textContent = this.formatBytes(jsonSize);

    // Update row/column counts
    try {
      const options = this.getCsvOptions();
      const parsedData = this.parseCsv(csvText, options);
      
      const rowCount = Math.max(0, parsedData.length - (options.hasHeaders ? 1 : 0));
      const columnCount = parsedData.length > 0 ? parsedData[0].length : 0;
      
      (this.container.querySelector('#row-count') as HTMLElement).textContent = rowCount.toString();
      (this.container.querySelector('#column-count') as HTMLElement).textContent = columnCount.toString();
    } catch {
      (this.container.querySelector('#row-count') as HTMLElement).textContent = '0';
      (this.container.querySelector('#column-count') as HTMLElement).textContent = '0';
    }
  }

  private getJsonIndent(): string | number {
    const indentValue = (this.container.querySelector('#json-indent') as HTMLSelectElement).value;
    if (indentValue === '0') return 0;
    if (indentValue === '\t') return '\t';
    return parseInt(indentValue, 10);
  }

  private sortObjectKeys(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sorted: any = {};
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = obj[key];
    });
    return sorted;
  }

  private async handleFileLoad(e: Event): Promise<void> {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      this.showNotification('File too large. Maximum size is 5MB.', 'error');
      return;
    }

    try {
      const text = await file.text();
      const csvInput = this.container.querySelector('#csv-input') as HTMLTextAreaElement;
      csvInput.value = text;
      this.updatePreview();
      this.updateStats();
      this.showNotification(`File "${file.name}" loaded successfully`, 'success');
    } catch (error) {
      this.showNotification('Error reading file', 'error');
    }
  }

  private async pasteFromClipboard(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      const csvInput = this.container.querySelector('#csv-input') as HTMLTextAreaElement;
      csvInput.value = text;
      this.updatePreview();
      this.updateStats();
      this.showNotification('Text pasted from clipboard', 'success');
    } catch (error) {
      this.showNotification('Failed to paste from clipboard', 'error');
    }
  }

  private clearCsv(): void {
    const csvInput = this.container.querySelector('#csv-input') as HTMLTextAreaElement;
    const jsonOutput = this.container.querySelector('#json-output') as HTMLTextAreaElement;
    
    csvInput.value = '';
    jsonOutput.value = '';
    this.updatePreview();
    this.updateStats();
    this.showNotification('Data cleared', 'success');
  }

  private async copyJson(): Promise<void> {
    const jsonOutput = this.container.querySelector('#json-output') as HTMLTextAreaElement;
    const jsonText = jsonOutput.value;

    if (!jsonText) {
      this.showNotification('No JSON data to copy', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(jsonText);
      this.showNotification('JSON copied to clipboard', 'success');
    } catch (error) {
      this.showNotification('Failed to copy JSON', 'error');
    }
  }

  private formatJson(): void {
    const jsonOutput = this.container.querySelector('#json-output') as HTMLTextAreaElement;
    const jsonText = jsonOutput.value;

    if (!jsonText) {
      this.showNotification('No JSON data to format', 'error');
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      jsonOutput.value = formatted;
      this.showNotification('JSON formatted', 'success');
      this.updateStats();
    } catch (error) {
      this.showNotification('Invalid JSON format', 'error');
    }
  }

  private minifyJson(): void {
    const jsonOutput = this.container.querySelector('#json-output') as HTMLTextAreaElement;
    const jsonText = jsonOutput.value;

    if (!jsonText) {
      this.showNotification('No JSON data to minify', 'error');
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      const minified = JSON.stringify(parsed);
      jsonOutput.value = minified;
      this.showNotification('JSON minified', 'success');
      this.updateStats();
    } catch (error) {
      this.showNotification('Invalid JSON format', 'error');
    }
  }

  private saveJsonFile(): void {
    const jsonOutput = this.container.querySelector('#json-output') as HTMLTextAreaElement;
    const jsonText = jsonOutput.value;

    if (!jsonText) {
      this.showNotification('No JSON data to save', 'error');
      return;
    }

    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    this.showNotification('JSON file saved', 'success');
  }

  private loadSampleData(type: string): void {
    const csvInput = this.container.querySelector('#csv-input') as HTMLTextAreaElement;
    let sampleData = '';

    switch (type) {
      case 'users':
        sampleData = `name,age,email,city,country
John Doe,28,john@example.com,New York,USA
Jane Smith,32,jane@example.com,London,UK
Mike Johnson,25,mike@example.com,Toronto,Canada
Sarah Wilson,29,sarah@example.com,Sydney,Australia
David Brown,35,david@example.com,Berlin,Germany`;
        break;
      case 'products':
        sampleData = `id,name,price,category,inStock
1,Laptop,999.99,Electronics,true
2,Coffee Mug,12.50,Kitchen,true
3,Notebook,5.99,Office,false
4,Smartphone,599.00,Electronics,true
5,Desk Chair,149.99,Furniture,true`;
        break;
      case 'sales':
        sampleData = `date,product,quantity,revenue,salesperson
2024-01-15,Laptop,2,1999.98,John
2024-01-16,Coffee Mug,5,62.50,Jane
2024-01-17,Smartphone,1,599.00,Mike
2024-01-18,Desk Chair,3,449.97,Sarah
2024-01-19,Notebook,10,59.90,David`;
        break;
    }

    csvInput.value = sampleData;
    this.updatePreview();
    this.updateStats();
    this.showNotification(`${type} sample data loaded`, 'success');
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private showValidation(message: string, type: 'success' | 'error', elementId: string): void {
    const validationDiv = this.container.querySelector(`#${elementId}`) as HTMLElement;
    validationDiv.innerHTML = `
      <div class="validation-message validation-${type}">
        ${type === 'success' ? getIcon('check') : getIcon('alert')} 
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
