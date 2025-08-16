import { getIcon } from '@/utils/icons';

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

export class RegexTool {
  private container: HTMLElement;
  private regexHistory: string[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.attachEventListeners();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('regexTool')}</div>
          <div class="tool-title">
            <h2>Regex Tester</h2>
            <p>Test and debug regular expressions with real-time matching and explanations</p>
          </div>
        </div>

        <div class="tool-content">
          <div class="regex-input-section">
            <div class="section-header">
              <h3>Regular Expression</h3>
              <div class="tool-actions">
                <button id="clear-regex" class="btn btn-secondary">
                  ${getIcon('trash')} Clear
                </button>
              </div>
            </div>

            <div class="regex-input-container">
              <div class="regex-input-wrapper">
                <span class="regex-delimiter">/</span>
                <input 
                  type="text" 
                  id="regex-pattern" 
                  placeholder="Enter your regex pattern..."
                  class="regex-input"
                />
                <span class="regex-delimiter">/</span>
                <input 
                  type="text" 
                  id="regex-flags" 
                  placeholder="flags"
                  class="regex-flags"
                  maxlength="10"
                />
              </div>
              <div class="regex-validation" id="regex-validation"></div>
            </div>

            <div class="regex-flags-helper">
              <span class="flags-label">Common flags:</span>
              <div class="flag-buttons">
                <button class="flag-btn" data-flag="g" title="Global - find all matches">g</button>
                <button class="flag-btn" data-flag="i" title="Ignore case">i</button>
                <button class="flag-btn" data-flag="m" title="Multiline">m</button>
                <button class="flag-btn" data-flag="s" title="Dot matches newline">s</button>
                <button class="flag-btn" data-flag="u" title="Unicode">u</button>
                <button class="flag-btn" data-flag="y" title="Sticky">y</button>
              </div>
            </div>

            <div class="regex-presets">
              <label for="regex-presets">Quick patterns:</label>
              <select id="regex-presets" class="tool-input">
                <option value="">Select a common pattern...</option>
                <option value="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}">Email Address</option>
                <option value="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)">URL</option>
                <option value="^\+?[1-9]\d{1,14}$">Phone Number</option>
                <option value="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$">IP Address (IPv4)</option>
                <option value="^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$">Hex Color</option>
                <option value="^\d{4}-\d{2}-\d{2}$">Date (YYYY-MM-DD)</option>
                <option value="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$">Strong Password</option>
                <option value="^[a-zA-Z0-9_-]+$">Username/Slug</option>
                <option value="^\d+(\.\d{1,2})?$">Price/Decimal</option>
                <option value="^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$">IBAN</option>
              </select>
            </div>
          </div>

          <div class="test-string-section">
            <div class="section-header">
              <h3>Test String</h3>
              <div class="tool-actions">
                <button id="paste-text" class="btn btn-secondary">
                  ${getIcon('clipboard')} Paste
                </button>
                <button id="clear-text" class="btn btn-secondary">
                  ${getIcon('trash')} Clear
                </button>
              </div>
            </div>
            <div class="test-input-container">
              <textarea 
                id="test-string" 
                placeholder="Enter test string to match against..."
                class="tool-textarea"
                rows="8"
              ></textarea>
              <div class="string-stats">
                <span id="string-length">0 characters</span>
                <span id="line-count">1 line</span>
              </div>
            </div>
          </div>

          <div class="results-section">
            <div class="section-header">
              <h3>Results</h3>
              <div class="tool-actions">
                <button id="copy-matches" class="btn btn-secondary">
                  ${getIcon('copy')} Copy Matches
                </button>
                <button id="export-results" class="btn btn-secondary">
                  ${getIcon('clipboard')} Export
                </button>
              </div>
            </div>

            <div class="results-container">
              <div class="results-summary" id="results-summary">
                <div class="summary-item">
                  <span class="summary-label">Matches:</span>
                  <span id="match-count" class="summary-value">0</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Groups:</span>
                  <span id="group-count" class="summary-value">0</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Execution Time:</span>
                  <span id="exec-time" class="summary-value">0ms</span>
                </div>
              </div>

              <div class="results-tabs">
                <div class="tab-buttons">
                  <button class="tab-btn active" data-tab="matches">Matches</button>
                  <button class="tab-btn" data-tab="groups">Groups</button>
                  <button class="tab-btn" data-tab="replace">Replace</button>
                  <button class="tab-btn" data-tab="explanation">Explanation</button>
                </div>

                <div class="tab-content">
                  <div id="matches-tab" class="tab-panel active">
                    <div id="matches-list" class="matches-list">
                      <div class="no-matches">Enter a regex pattern and test string to see matches</div>
                    </div>
                  </div>

                  <div id="groups-tab" class="tab-panel">
                    <div id="groups-list" class="groups-list">
                      <div class="no-groups">No capturing groups found</div>
                    </div>
                  </div>

                  <div id="replace-tab" class="tab-panel">
                    <div class="replace-section">
                      <div class="replace-input">
                        <label for="replace-string">Replacement string:</label>
                        <input 
                          type="text" 
                          id="replace-string" 
                          placeholder="$1, $2, etc. for groups"
                          class="tool-input"
                        />
                        <button id="perform-replace" class="btn btn-primary">Replace</button>
                      </div>
                      <div class="replace-result">
                        <label>Result:</label>
                        <textarea 
                          id="replace-output" 
                          readonly
                          class="tool-textarea"
                          rows="6"
                          placeholder="Replacement result will appear here..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div id="explanation-tab" class="tab-panel">
                    <div id="regex-explanation" class="regex-explanation">
                      <div class="no-explanation">Enter a regex pattern to see explanation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="regex-history-section">
            <div class="section-header">
              <h3>Pattern History</h3>
              <div class="tool-actions">
                <button id="clear-history" class="btn btn-secondary">
                  ${getIcon('trash')} Clear History
                </button>
              </div>
            </div>
            <div id="history-list" class="history-list">
              <div class="history-empty">No patterns in history</div>
            </div>
          </div>

          <div class="regex-cheatsheet">
            <div class="section-header">
              <h3>Quick Reference</h3>
            </div>
            <div class="cheatsheet-grid">
              <div class="cheatsheet-category">
                <h4>Character Classes</h4>
                <div class="cheatsheet-items">
                  <div class="cheatsheet-item"><code>.</code> Any character except newline</div>
                  <div class="cheatsheet-item"><code>\\d</code> Digit (0-9)</div>
                  <div class="cheatsheet-item"><code>\\w</code> Word character (a-z, A-Z, 0-9, _)</div>
                  <div class="cheatsheet-item"><code>\\s</code> Whitespace</div>
                  <div class="cheatsheet-item"><code>[abc]</code> Any of a, b, or c</div>
                  <div class="cheatsheet-item"><code>[^abc]</code> Not a, b, or c</div>
                </div>
              </div>

              <div class="cheatsheet-category">
                <h4>Quantifiers</h4>
                <div class="cheatsheet-items">
                  <div class="cheatsheet-item"><code>*</code> 0 or more</div>
                  <div class="cheatsheet-item"><code>+</code> 1 or more</div>
                  <div class="cheatsheet-item"><code>?</code> 0 or 1</div>
                  <div class="cheatsheet-item"><code>{3}</code> Exactly 3</div>
                  <div class="cheatsheet-item"><code>{3,}</code> 3 or more</div>
                  <div class="cheatsheet-item"><code>{3,5}</code> 3 to 5</div>
                </div>
              </div>

              <div class="cheatsheet-category">
                <h4>Anchors</h4>
                <div class="cheatsheet-items">
                  <div class="cheatsheet-item"><code>^</code> Start of string</div>
                  <div class="cheatsheet-item"><code>$</code> End of string</div>
                  <div class="cheatsheet-item"><code>\\b</code> Word boundary</div>
                  <div class="cheatsheet-item"><code>\\B</code> Not word boundary</div>
                </div>
              </div>

              <div class="cheatsheet-category">
                <h4>Groups</h4>
                <div class="cheatsheet-items">
                  <div class="cheatsheet-item"><code>(abc)</code> Capturing group</div>
                  <div class="cheatsheet-item"><code>(?:abc)</code> Non-capturing group</div>
                  <div class="cheatsheet-item"><code>(?=abc)</code> Positive lookahead</div>
                  <div class="cheatsheet-item"><code>(?!abc)</code> Negative lookahead</div>
                </div>
              </div>
            </div>
          </div>

          <div class="tool-info">
            <div class="info-item">
              <strong>JavaScript Regex:</strong>
              <p>This tool uses JavaScript's RegExp engine. Some features may differ from other languages.</p>
            </div>
            <div class="info-item">
              <strong>Performance:</strong>
              <p>Complex patterns on large strings may take time to process. Use with caution.</p>
            </div>
            <div class="info-item">
              <strong>Groups:</strong>
              <p>Use $1, $2, etc. in replacement strings to reference capturing groups.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const regexInput = this.container.querySelector('#regex-pattern') as HTMLInputElement;
    const flagsInput = this.container.querySelector('#regex-flags') as HTMLInputElement;
    const testString = this.container.querySelector('#test-string') as HTMLTextAreaElement;

    // Real-time testing
    regexInput.addEventListener('input', () => {
      this.testRegex();
      this.addToHistory(regexInput.value);
    });

    flagsInput.addEventListener('input', () => {
      this.testRegex();
    });

    testString.addEventListener('input', () => {
      this.testRegex();
      this.updateStringStats();
    });

    // Tab switching
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabName = (e.target as HTMLElement).getAttribute('data-tab');
        this.switchTab(tabName!);
      });
    });

    // Flag buttons
    this.container.querySelectorAll('.flag-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const flag = (e.target as HTMLElement).getAttribute('data-flag')!;
        this.toggleFlag(flag);
      });
    });

    // Preset patterns
    this.container.querySelector('#regex-presets')?.addEventListener('change', (e) => {
      const pattern = (e.target as HTMLSelectElement).value;
      if (pattern) {
        regexInput.value = pattern;
        this.testRegex();
        this.addToHistory(pattern);
        (e.target as HTMLSelectElement).value = '';
      }
    });

    // Actions
    this.container.querySelector('#clear-regex')?.addEventListener('click', () => {
      this.clearRegex();
    });

    this.container.querySelector('#paste-text')?.addEventListener('click', () => {
      this.pasteText();
    });

    this.container.querySelector('#clear-text')?.addEventListener('click', () => {
      this.clearText();
    });

    this.container.querySelector('#copy-matches')?.addEventListener('click', () => {
      this.copyMatches();
    });

    this.container.querySelector('#perform-replace')?.addEventListener('click', () => {
      this.performReplace();
    });

    this.container.querySelector('#replace-string')?.addEventListener('input', () => {
      this.performReplace();
    });

    this.container.querySelector('#clear-history')?.addEventListener('click', () => {
      this.clearHistory();
    });

    // Initial setup
    this.updateStringStats();
  }

  private testRegex(): void {
    const pattern = (this.container.querySelector('#regex-pattern') as HTMLInputElement).value;
    const flags = (this.container.querySelector('#regex-flags') as HTMLInputElement).value;
    const testString = (this.container.querySelector('#test-string') as HTMLTextAreaElement).value;

    if (!pattern) {
      this.clearResults();
      return;
    }

    const startTime = performance.now();

    try {
      const regex = new RegExp(pattern, flags);
      this.validateRegex(true);
      
      const matches = this.findMatches(regex, testString);
      const endTime = performance.now();
      
      this.updateResults(matches, endTime - startTime);
      this.generateExplanation(pattern);
    } catch (error) {
      this.validateRegex(false, (error as Error).message);
      this.clearResults();
    }
  }

  private validateRegex(isValid: boolean, errorMessage?: string): void {
    const validationDiv = this.container.querySelector('#regex-validation') as HTMLElement;
    const regexInput = this.container.querySelector('#regex-pattern') as HTMLInputElement;

    if (isValid) {
      validationDiv.innerHTML = `
        <div class="validation-message validation-success">
          ${getIcon('check')} Valid regex pattern
        </div>
      `;
      regexInput.classList.remove('invalid');
      regexInput.classList.add('valid');
    } else {
      validationDiv.innerHTML = `
        <div class="validation-message validation-error">
          ${getIcon('alert')} ${errorMessage || 'Invalid regex pattern'}
        </div>
      `;
      regexInput.classList.remove('valid');
      regexInput.classList.add('invalid');
    }
  }

  private findMatches(regex: RegExp, text: string): MatchResult[] {
    const matches: MatchResult[] = [];
    
    if (regex.global) {
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: Array.from(match).slice(1)
        });
        
        // Prevent infinite loop on zero-length matches
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    } else {
      const match = regex.exec(text);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: Array.from(match).slice(1)
        });
      }
    }

    return matches;
  }

  private updateResults(matches: MatchResult[], executionTime: number): void {
    // Update summary
    (this.container.querySelector('#match-count') as HTMLElement).textContent = matches.length.toString();
    (this.container.querySelector('#group-count') as HTMLElement).textContent = 
      matches.reduce((total, match) => total + match.groups.length, 0).toString();
    (this.container.querySelector('#exec-time') as HTMLElement).textContent = `${executionTime.toFixed(2)}ms`;

    // Update matches list
    this.updateMatchesList(matches);
    
    // Update groups list
    this.updateGroupsList(matches);
  }

  private updateMatchesList(matches: MatchResult[]): void {
    const matchesList = this.container.querySelector('#matches-list') as HTMLElement;

    if (matches.length === 0) {
      matchesList.innerHTML = '<div class="no-matches">No matches found</div>';
      return;
    }

    matchesList.innerHTML = matches.map((match, index) => `
      <div class="match-item">
        <div class="match-header">
          <span class="match-number">Match ${index + 1}</span>
          <span class="match-position">Position: ${match.index}</span>
          <span class="match-length">Length: ${match.match.length}</span>
        </div>
        <div class="match-content">
          <code class="match-text">${this.escapeHtml(match.match)}</code>
        </div>
      </div>
    `).join('');
  }

  private updateGroupsList(matches: MatchResult[]): void {
    const groupsList = this.container.querySelector('#groups-list') as HTMLElement;
    
    const allGroups = matches.flatMap((match, matchIndex) => 
      match.groups.map((group, groupIndex) => ({
        matchIndex: matchIndex + 1,
        groupIndex: groupIndex + 1,
        value: group
      }))
    );

    if (allGroups.length === 0) {
      groupsList.innerHTML = '<div class="no-groups">No capturing groups found</div>';
      return;
    }

    groupsList.innerHTML = allGroups.map(group => `
      <div class="group-item">
        <div class="group-header">
          <span class="group-reference">$${group.groupIndex}</span>
          <span class="group-match">Match ${group.matchIndex}</span>
        </div>
        <div class="group-content">
          <code class="group-text">${this.escapeHtml(group.value || '')}</code>
        </div>
      </div>
    `).join('');
  }

  private performReplace(): void {
    const pattern = (this.container.querySelector('#regex-pattern') as HTMLInputElement).value;
    const flags = (this.container.querySelector('#regex-flags') as HTMLInputElement).value;
    const testString = (this.container.querySelector('#test-string') as HTMLTextAreaElement).value;
    const replaceString = (this.container.querySelector('#replace-string') as HTMLInputElement).value;
    const outputElement = this.container.querySelector('#replace-output') as HTMLTextAreaElement;

    if (!pattern || !testString) {
      outputElement.value = '';
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const result = testString.replace(regex, replaceString);
      outputElement.value = result;
    } catch (error) {
      outputElement.value = `Error: ${(error as Error).message}`;
    }
  }

  private generateExplanation(pattern: string): void {
    const explanationDiv = this.container.querySelector('#regex-explanation') as HTMLElement;
    
    // Basic explanation - this could be expanded with a full regex parser
    const explanations: Array<{pattern: RegExp, explanation: string}> = [
      { pattern: /\\\d/, explanation: '\\d matches any digit (0-9)' },
      { pattern: /\\\w/, explanation: '\\w matches any word character (a-z, A-Z, 0-9, _)' },
      { pattern: /\\\s/, explanation: '\\s matches any whitespace character' },
      { pattern: /\./, explanation: '. matches any character except newline' },
      { pattern: /\*/, explanation: '* matches 0 or more of the preceding element' },
      { pattern: /\+/, explanation: '+ matches 1 or more of the preceding element' },
      { pattern: /\?/, explanation: '? matches 0 or 1 of the preceding element' },
      { pattern: /\^/, explanation: '^ matches the start of the string' },
      { pattern: /\$/, explanation: '$ matches the end of the string' },
      { pattern: /\[.*?\]/, explanation: 'Character class [] matches any character inside' },
      { pattern: /\(.*?\)/, explanation: 'Group () captures the matched text' },
      { pattern: /\{\\d+\}/, explanation: '{n} matches exactly n occurrences' },
      { pattern: /\{\\d+,\}/, explanation: '{n,} matches n or more occurrences' },
      { pattern: /\{\\d+,\\d+\}/, explanation: '{n,m} matches between n and m occurrences' }
    ];

    const foundExplanations = explanations
      .filter(item => item.pattern.test(pattern))
      .map(item => `<div class="explanation-item">${item.explanation}</div>`)
      .join('');

    if (foundExplanations) {
      explanationDiv.innerHTML = `
        <div class="explanation-content">
          <h4>Pattern Breakdown:</h4>
          ${foundExplanations}
        </div>
      `;
    } else {
      explanationDiv.innerHTML = `
        <div class="explanation-content">
          <p>Enter a regex pattern to see detailed explanation of its components.</p>
        </div>
      `;
    }
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

  private toggleFlag(flag: string): void {
    const flagsInput = this.container.querySelector('#regex-flags') as HTMLInputElement;
    const currentFlags = flagsInput.value;
    
    if (currentFlags.includes(flag)) {
      flagsInput.value = currentFlags.replace(flag, '');
    } else {
      flagsInput.value = currentFlags + flag;
    }
    
    this.testRegex();
  }

  private addToHistory(pattern: string): void {
    if (!pattern || this.regexHistory.includes(pattern)) return;
    
    this.regexHistory.unshift(pattern);
    if (this.regexHistory.length > 20) {
      this.regexHistory = this.regexHistory.slice(0, 20);
    }
    
    this.updateHistoryDisplay();
  }

  private updateHistoryDisplay(): void {
    const historyList = this.container.querySelector('#history-list') as HTMLElement;
    
    if (this.regexHistory.length === 0) {
      historyList.innerHTML = '<div class="history-empty">No patterns in history</div>';
      return;
    }

    historyList.innerHTML = this.regexHistory.map(pattern => `
      <div class="history-item" data-pattern="${this.escapeHtml(pattern)}">
        <code class="history-pattern">${this.escapeHtml(pattern)}</code>
        <button class="btn-icon use-pattern" title="Use this pattern">
          ${getIcon('chevronRight')}
        </button>
      </div>
    `).join('');

    // Add click handlers for history items
    this.container.querySelectorAll('.use-pattern').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pattern = (e.target as HTMLElement).closest('.history-item')?.getAttribute('data-pattern') || '';
        (this.container.querySelector('#regex-pattern') as HTMLInputElement).value = pattern;
        this.testRegex();
      });
    });
  }

  private updateStringStats(): void {
    const testString = (this.container.querySelector('#test-string') as HTMLTextAreaElement).value;
    const length = testString.length;
    const lines = testString.split('\n').length;
    
    (this.container.querySelector('#string-length') as HTMLElement).textContent = `${length} characters`;
    (this.container.querySelector('#line-count') as HTMLElement).textContent = `${lines} line${lines !== 1 ? 's' : ''}`;
  }

  private clearResults(): void {
    (this.container.querySelector('#match-count') as HTMLElement).textContent = '0';
    (this.container.querySelector('#group-count') as HTMLElement).textContent = '0';
    (this.container.querySelector('#exec-time') as HTMLElement).textContent = '0ms';
    
    (this.container.querySelector('#matches-list') as HTMLElement).innerHTML = 
      '<div class="no-matches">Enter a regex pattern and test string to see matches</div>';
    (this.container.querySelector('#groups-list') as HTMLElement).innerHTML = 
      '<div class="no-groups">No capturing groups found</div>';
    (this.container.querySelector('#replace-output') as HTMLTextAreaElement).value = '';
  }

  private clearRegex(): void {
    (this.container.querySelector('#regex-pattern') as HTMLInputElement).value = '';
    (this.container.querySelector('#regex-flags') as HTMLInputElement).value = '';
    (this.container.querySelector('#regex-validation') as HTMLElement).innerHTML = '';
    this.clearResults();
    this.showNotification('Regex cleared', 'success');
  }

  private clearText(): void {
    (this.container.querySelector('#test-string') as HTMLTextAreaElement).value = '';
    this.updateStringStats();
    this.testRegex();
    this.showNotification('Test string cleared', 'success');
  }

  private async pasteText(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      (this.container.querySelector('#test-string') as HTMLTextAreaElement).value = text;
      this.updateStringStats();
      this.testRegex();
      this.showNotification('Text pasted from clipboard', 'success');
    } catch (error) {
      this.showNotification('Failed to paste from clipboard', 'error');
    }
  }

  private async copyMatches(): Promise<void> {
    const matchesList = this.container.querySelector('#matches-list') as HTMLElement;
    const matchItems = matchesList.querySelectorAll('.match-text');
    
    if (matchItems.length === 0) {
      this.showNotification('No matches to copy', 'error');
      return;
    }

    const matches = Array.from(matchItems).map(item => item.textContent).join('\n');
    
    try {
      await navigator.clipboard.writeText(matches);
      this.showNotification('Matches copied to clipboard', 'success');
    } catch (error) {
      this.showNotification('Failed to copy matches', 'error');
    }
  }

  private clearHistory(): void {
    this.regexHistory = [];
    this.updateHistoryDisplay();
    this.showNotification('History cleared', 'success');
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
