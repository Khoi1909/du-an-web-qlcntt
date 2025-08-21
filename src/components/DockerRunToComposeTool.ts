import { getIcon } from '@/utils/icons';

type ParsedRun = {
  containerName?: string;
  image?: string;
  command?: string[];
  ports: string[];
  env: Record<string, string>;
  envFiles: string[];
  volumes: string[];
  restart?: string;
};

export class DockerRunToComposeTool {
  private container: HTMLElement;
  constructor(container: HTMLElement) { this.container = container; this.render(); this.bind(); }

  private render(): void {
    this.container.innerHTML = `
      <div class="tool-container">
        <div class="tool-header">
          <div class="tool-icon">${getIcon('dev')}</div>
          <div class="tool-title">
            <h2>Docker run → Compose converter</h2>
            <p>Convert a docker run command into docker-compose YAML</p>
          </div>
        </div>
        <div class="tool-content">
          <div class="tool-section">
            <div class="section-header"><h3>docker run command</h3></div>
            <textarea id="input" class="tool-textarea" rows="6" placeholder="docker run --name myapp -p 8080:80 -e NODE_ENV=production -v ./data:/data --restart unless-stopped -d nginx:alpine"></textarea>
            <div class="tool-actions" style="margin-top:8px">
              <button id="convert" class="btn btn-primary">${getIcon('conversion')} Convert</button>
              <button id="copy" class="btn btn-secondary">${getIcon('copy')} Copy YAML</button>
            </div>
          </div>
          <div class="tool-section">
            <div class="section-header"><h3>docker-compose</h3></div>
            <textarea id="output" class="tool-textarea" rows="14" readonly></textarea>
          </div>
        </div>
      </div>`;
  }

  private bind(): void {
    this.container.querySelector('#convert')?.addEventListener('click', () => this.convert());
    this.container.querySelector('#copy')?.addEventListener('click', async () => {
      const out = (this.container.querySelector('#output') as HTMLTextAreaElement).value;
      try { await navigator.clipboard.writeText(out); } catch {}
    });
  }

  private convert(): void {
    const cmd = (this.container.querySelector('#input') as HTMLTextAreaElement).value.trim();
    const parsed = this.parse(cmd);
    (this.container.querySelector('#output') as HTMLTextAreaElement).value = this.toComposeYaml(parsed);
  }

  private parse(command: string): ParsedRun {
    const tokens = this.tokenize(command);
    const parsed: ParsedRun = { ports: [], env: {}, envFiles: [], volumes: [] };

    // Expect: docker run [opts] image [cmd]
    let i = 0;
    if (tokens[i] === 'docker') i++;
    if (tokens[i] === 'run') i++;

    while (i < tokens.length) {
      const t = tokens[i];
      if (t === '--name' && i + 1 < tokens.length) { parsed.containerName = tokens[++i]; i++; continue; }
      if (t.startsWith('--name=')) { parsed.containerName = t.split('=')[1]; i++; continue; }

      if ((t === '-p' || t === '--publish') && i + 1 < tokens.length) { parsed.ports.push(tokens[++i]); i++; continue; }
      if (t.startsWith('-p') && t.length > 2) { parsed.ports.push(t.slice(2)); i++; continue; }
      if (t.startsWith('--publish=')) { parsed.ports.push(t.split('=')[1]); i++; continue; }

      if ((t === '-e' || t === '--env') && i + 1 < tokens.length) { const kv = tokens[++i]; const [k, v = ''] = kv.split('='); parsed.env[k] = v; i++; continue; }
      if (t.startsWith('-e') && t.length > 2) { const kv = t.slice(2); const [k, v = ''] = kv.split('='); parsed.env[k] = v; i++; continue; }
      if (t.startsWith('--env=')) { const kv = t.split('=')[1]; const [k, v = ''] = kv.split('='); parsed.env[k] = v; i++; continue; }
      if ((t === '--env-file') && i + 1 < tokens.length) { parsed.envFiles.push(tokens[++i]); i++; continue; }
      if (t.startsWith('--env-file=')) { parsed.envFiles.push(t.split('=')[1]); i++; continue; }

      if ((t === '-v' || t === '--volume') && i + 1 < tokens.length) { parsed.volumes.push(tokens[++i]); i++; continue; }
      if (t.startsWith('-v') && t.length > 2) { parsed.volumes.push(t.slice(2)); i++; continue; }
      if (t.startsWith('--volume=')) { parsed.volumes.push(t.split('=')[1]); i++; continue; }

      if (t === '--restart' && i + 1 < tokens.length) { parsed.restart = tokens[++i]; i++; continue; }
      if (t.startsWith('--restart=')) { parsed.restart = t.split('=')[1]; i++; continue; }

      if (t === '-d' || t === '--detach' || t === '--rm' || t === '--init' || t === '--privileged') { i++; continue; }

      // First non-flag token is image
      if (!t.startsWith('-') && !parsed.image) { parsed.image = t; i++; continue; }
      // Remaining tokens become command
      if (parsed.image) { parsed.command = tokens.slice(i); break; }
      i++;
    }
    return parsed;
  }

  private tokenize(s: string): string[] {
    const result: string[] = [];
    let current = '';
    let quote: '"' | "'" | null = null;
    for (let idx = 0; idx < s.length; idx++) {
      const ch = s[idx];
      if (quote) {
        if (ch === quote) { quote = null; continue; }
        if (ch === '\\' && idx + 1 < s.length) { current += s[++idx]; continue; }
        current += ch; continue;
      }
      if (ch === '"' || ch === "'") { quote = ch as any; continue; }
      if (/\s/.test(ch)) { if (current) { result.push(current); current = ''; } continue; }
      if (ch === '=' && current && !current.includes('=')) { current += '='; continue; }
      current += ch;
    }
    if (current) result.push(current);
    return result;
  }

  private toComposeYaml(p: ParsedRun): string {
    const serviceName = (p.containerName || (p.image || 'app').replace(/[^a-zA-Z0-9_.-]/g, '-')).toLowerCase();
    const lines: string[] = [];
    lines.push('services:');
    lines.push(`  ${serviceName}:`);
    if (p.image) lines.push(`    image: ${p.image}`);
    if (p.containerName) lines.push(`    container_name: ${p.containerName}`);
    if (p.ports.length) {
      lines.push('    ports:');
      p.ports.forEach(pr => lines.push(`      - "${pr}"`));
    }
    const envKeys = Object.keys(p.env);
    if (envKeys.length) {
      lines.push('    environment:');
      envKeys.forEach(k => lines.push(`      ${k}: "${p.env[k]}"`));
    }
    if (p.envFiles.length) {
      lines.push('    env_file:');
      p.envFiles.forEach(f => lines.push(`      - ${f}`));
    }
    if (p.volumes.length) {
      lines.push('    volumes:');
      p.volumes.forEach(v => lines.push(`      - "${v}"`));
    }
    if (p.restart) lines.push(`    restart: ${p.restart}`);
    if (p.command && p.command.length) {
      const cmd = p.command.map(x => (/\s/.test(x) ? `'${x.replace(/'/g, "''")}'` : x)).join(' ');
      lines.push(`    command: ${cmd}`);
    }
    return lines.join('\n');
  }
}


