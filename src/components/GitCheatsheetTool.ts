import { getIcon } from '@/utils/icons';

export class GitCheatsheetTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('dev')}</div>
          <div class="tool-title">
            <h2>Git cheatsheet</h2>
            <p>Frequently used commands</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tools-grid" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));">
            ${this.card('Setup', [
              ['Set name', 'git config --global user.name "Your Name"'],
              ['Set email', 'git config --global user.email you@example.com'],
            ])}
            ${this.card('Basics', [
              ['Init repo', 'git init'],
              ['Clone', 'git clone <url>'],
              ['Status', 'git status'],
              ['Add', 'git add <file>'],
              ['Commit', 'git commit -m "msg"'],
            ])}
            ${this.card('Branches', [
              ['List', 'git branch'],
              ['Create', 'git branch <name>'],
              ['Switch', 'git checkout <name>'],
              ['Create+Switch', 'git checkout -b <name>'],
              ['Merge', 'git merge <name>'],
            ])}
            ${this.card('Remote', [
              ['Add origin', 'git remote add origin <url>'],
              ['Fetch', 'git fetch'],
              ['Pull', 'git pull'],
              ['Push', 'git push -u origin <branch>'],
            ])}
            ${this.card('History', [
              ['Log', 'git log --oneline --graph --decorate --all'],
              ['Diff staged', 'git diff --staged'],
              ['Show commit', 'git show <hash>'],
            ])}
            ${this.card('Undo', [
              ['Unstage', 'git reset <file>'],
              ['Amend', 'git commit --amend'],
              ['Revert', 'git revert <hash>'],
            ])}
          </div>
        </div>
      </div>`;
  }

  private card(title: string, rows: [string,string][]): string {
    return `<div class="string-case-card"><div class="string-case-title">${title}</div>${rows.map(([k,v]) => `<div class="string-case-output"><strong>${k}:</strong> <code>${v}</code></div>`).join('')}</div>`;
  }
}


