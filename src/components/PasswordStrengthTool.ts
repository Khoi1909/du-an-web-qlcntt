import { getIcon } from '@/utils/icons';

export class PasswordStrengthTool {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.bind();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('string')}</div>
          <div class="tool-title">
            <h2>Password strength analyzer</h2>
            <p>Score passwords and provide actionable feedback</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>Input</h3></div>
            <input type="password" id="pwd-input" class="tool-input" placeholder="Enter password" />
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>Result</h3></div>
            <div id="score" style="font-weight:700;margin-bottom:8px"></div>
            <div id="bar" style="height:10px;border-radius:6px;background:#e5e7eb;overflow:hidden;margin-bottom:8px"><div id="bar-fill" style="height:100%;width:0;background:#ef4444"></div></div>
            <ul id="advice" style="margin-left:16px"></ul>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    const input = this.container.querySelector('#pwd-input') as HTMLInputElement;
    const scoreEl = this.container.querySelector('#score') as HTMLDivElement;
    const barFill = this.container.querySelector('#bar-fill') as HTMLDivElement;
    const adviceEl = this.container.querySelector('#advice') as HTMLUListElement;
    const update = () => {
      const { score, max, label, color, suggestions } = this.evaluate(input.value);
      scoreEl.textContent = `${label} (${score}/${max})`;
      barFill.style.width = `${Math.round((score / max) * 100)}%`;
      barFill.style.background = color;
      adviceEl.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
    };
    input.addEventListener('input', update);
    update();
  }

  private evaluate(pwd: string): { score: number; max: number; label: string; color: string; suggestions: string[] } {
    const max = 10;
    let score = 0;
    const sugg: string[] = [];
    if (pwd.length >= 12) score += 3; else if (pwd.length >= 8) score += 2; else if (pwd.length > 0) { score += 1; sugg.push('Use at least 12 characters'); }
    if (/[a-z]/.test(pwd)) score += 1; else sugg.push('Add lowercase letters');
    if (/[A-Z]/.test(pwd)) score += 1; else sugg.push('Add uppercase letters');
    if (/[0-9]/.test(pwd)) score += 1; else sugg.push('Add digits');
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1; else sugg.push('Add special characters');
    // penalty for repeats and sequences
    if (/(.)\1{2,}/.test(pwd)) { score -= 1; sugg.push('Avoid repeated characters'); }
    if (/(0123|1234|2345|abcd|qwer|asdf)/i.test(pwd)) { score -= 1; sugg.push('Avoid common sequences'); }
    if (pwd.length === 0) { score = 0; sugg.length = 0; }
    if (score < 0) score = 0; if (score > max) score = max;
    const pct = score / max;
    const label = pct >= 0.8 ? 'Strong' : pct >= 0.6 ? 'Good' : pct >= 0.4 ? 'Fair' : pct > 0 ? 'Weak' : 'Empty';
    const color = pct >= 0.8 ? '#22c55e' : pct >= 0.6 ? '#84cc16' : pct >= 0.4 ? '#f59e0b' : pct > 0 ? '#ef4444' : '#e5e7eb';
    return { score, max, label, color, suggestions: sugg };
  }

  public destroy(): void {}
}

