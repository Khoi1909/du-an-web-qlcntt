import { getIcon } from '@/utils/icons';

export class DockerCheatsheetTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header"><div class="tool-icon">${getIcon('dev')}</div><div class="tool-title"><h2>Docker cheatsheet</h2><p>Essential Docker commands</p></div></div>
        <div class="tool-content">
          <div class="tools-grid" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));">
            ${this.card('Images', [
              ['List images', 'docker images'],
              ['Pull image', 'docker pull <image>'],
              ['Remove image', 'docker rmi <image>'],
            ])}
            ${this.card('Containers', [
              ['Run', 'docker run --name <name> -d <image>'],
              ['List', 'docker ps -a'],
              ['Logs', 'docker logs -f <name>'],
              ['Exec', 'docker exec -it <name> /bin/sh'],
              ['Stop/Remove', 'docker stop <name> && docker rm <name>'],
            ])}
            ${this.card('Build', [
              ['Build image', 'docker build -t <name>:<tag> .'],
              ['Prune', 'docker system prune -f'],
            ])}
            ${this.card('Compose', [
              ['Up', 'docker compose up -d'],
              ['Down', 'docker compose down'],
              ['Logs', 'docker compose logs -f'],
            ])}
          </div>
        </div>
      </div>`;
  }

  private card(title: string, rows: [string,string][]): string {
    return `<div class="string-case-card"><div class="string-case-title">${title}</div>${rows.map(([k,v]) => `<div class="string-case-output"><strong>${k}:</strong> <code>${v}</code></div>`).join('')}</div>`;
  }
}


