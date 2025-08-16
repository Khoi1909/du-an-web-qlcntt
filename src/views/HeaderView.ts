import { AppController } from '@/controllers/AppController';
import { Tool, ThemeMode } from '@/models/Tool';
import { getIcon } from '@/utils/icons';

export class HeaderView {
  private controller: AppController;
  private container: HTMLElement;

  constructor(controller: AppController, container: HTMLElement) {
    this.controller = controller;
    this.container = container;
    this.init();
    this.bindEvents();
  }

  private init(): void {
    this.container.innerHTML = `
      <header class="app-header">
        <div class="header-left">
          <button class="home-btn" id="home-btn">
            <span class="icon">${getIcon('home')}</span>
            <span class="text">Home</span>
          </button>
        </div>
        
        <div class="header-center">
          <div class="search-container">
            <input 
              type="text" 
              class="search-input" 
              id="search-input"
              placeholder="Search tools..."
              autocomplete="off"
            />
            <button class="search-clear" id="search-clear" style="display: none;">
              <span class="icon">${getIcon('x')}</span>
            </button>
          </div>
          <div class="search-results" id="search-results" style="display: none;"></div>
        </div>
        
        <div class="header-right">
          <button class="github-btn" id="github-btn" title="View on GitHub">
            <span class="icon">${getIcon('github')}</span>
          </button>
          <button class="theme-toggle" id="theme-toggle" title="Toggle theme">
            <span class="icon">${this.controller.getTheme() === ThemeMode.LIGHT ? getIcon('moon') : getIcon('sun')}</span>
          </button>
        </div>
      </header>
    `;
  }

  private bindEvents(): void {
    // Home button
    const homeBtn = this.container.querySelector('#home-btn') as HTMLButtonElement;
    homeBtn?.addEventListener('click', () => {
      this.controller.goHome();
    });

    // Theme toggle
    const themeBtn = this.container.querySelector('#theme-toggle') as HTMLButtonElement;
    themeBtn?.addEventListener('click', () => {
      // Add switching animation class
      themeBtn.classList.add('switching');
      
      // Remove class after animation
      setTimeout(() => {
        themeBtn.classList.remove('switching');
      }, 400);
      
      this.controller.toggleTheme();
    });

    // GitHub button
    const githubBtn = this.container.querySelector('#github-btn') as HTMLButtonElement;
    githubBtn?.addEventListener('click', () => {
      this.controller.openGitHub();
    });

    // Search functionality
    const searchInput = this.container.querySelector('#search-input') as HTMLInputElement;
    const searchClear = this.container.querySelector('#search-clear') as HTMLButtonElement;
    const searchResults = this.container.querySelector('#search-results') as HTMLDivElement;

    searchInput?.addEventListener('input', async (e) => {
      const query = (e.target as HTMLInputElement).value;
      await this.handleSearch(query, searchClear, searchResults);
    });

    searchClear?.addEventListener('click', () => {
      searchInput.value = '';
      this.controller.clearSearch();
      searchClear.style.display = 'none';
      searchResults.style.display = 'none';
    });

    // Controller events
    this.controller.on('theme-changed', (theme: ThemeMode) => {
      this.updateThemeIcon(theme);
    });

    this.controller.on('search-results', (results: Tool[]) => {
      this.displaySearchResults(results, searchResults);
    });

    this.controller.on('search-cleared', () => {
      searchResults.style.display = 'none';
    });
  }

  private async handleSearch(query: string, clearBtn: HTMLButtonElement, resultsContainer: HTMLDivElement): Promise<void> {
    if (query.trim()) {
      clearBtn.style.display = 'block';
      const results = await this.controller.search(query);
      this.displaySearchResults(results, resultsContainer);
    } else {
      clearBtn.style.display = 'none';
      resultsContainer.style.display = 'none';
      this.controller.clearSearch();
    }
  }

  private displaySearchResults(results: Tool[], container: HTMLDivElement): void {
    if (results.length === 0) {
      container.innerHTML = '<div class="search-no-results">No tools found</div>';
    } else {
      container.innerHTML = results.map(tool => `
        <div class="search-result-item" data-tool-id="${tool.id}">
          <span class="tool-icon">${getIcon(tool.icon as any)}</span>
          <div class="tool-info">
            <div class="tool-name">${tool.name}</div>
            <div class="tool-description">${tool.description}</div>
          </div>
        </div>
      `).join('');

      // Add click handlers for search results
      container.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const toolId = item.getAttribute('data-tool-id');
          if (toolId) {
            this.controller.selectTool(toolId);
            container.style.display = 'none';
          }
        });
      });
    }
    
    container.style.display = 'block';
  }

  private updateThemeIcon(theme: ThemeMode): void {
    const themeBtn = this.container.querySelector('#theme-toggle .icon') as HTMLSpanElement;
    if (themeBtn) {
      themeBtn.innerHTML = theme === ThemeMode.LIGHT ? getIcon('moon') : getIcon('sun');
    }
  }
}
