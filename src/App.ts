import { AppController } from '@/controllers/AppController';
import { HeaderView } from '@/views/HeaderView';
import { SidebarView } from '@/views/SidebarView';
import { MainContentView } from '@/views/MainContentView';
import { ThemeMode } from '@/models/Tool';

export class App {
  private controller!: AppController;
  private headerView!: HeaderView;
  private sidebarView!: SidebarView;
  private mainContentView!: MainContentView;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    // Initialize controller (but don't setup routes yet)
    this.controller = new AppController();
    
    // Wait for controller to initialize tools
    await this.controller.waitForInitialization();
    
    // Make controller globally accessible for debugging and button callbacks
    (window as any).appController = this.controller;

    // Create app structure
    this.createAppStructure();

    // Initialize views first
    await this.initializeViews();

    // Setup theme
    this.setupTheme();

    // Setup global event listeners
    this.setupGlobalEvents();

    // Now setup routes after everything is ready
    this.controller.initializeRouting();
  }

  private createAppStructure(): void {
    document.body.innerHTML = `
      <div class="app">
        <div id="sidebar-container"></div>
        <div class="app-container">
          <div id="header-container"></div>
          <div id="main-container"></div>
        </div>
      </div>
    `;
  }

  private async initializeViews(): Promise<void> {
    // Get containers
    const headerContainer = document.getElementById('header-container')!;
    const sidebarContainer = document.getElementById('sidebar-container')!;
    const mainContainer = document.getElementById('main-container')!;

    // Initialize views
    this.headerView = new HeaderView(this.controller, headerContainer);
    this.sidebarView = new SidebarView(this.controller, sidebarContainer);
    this.mainContentView = new MainContentView(this.controller, mainContainer);
  }

  private setupTheme(): void {
    // Apply initial theme
    this.applyTheme(this.controller.getTheme());

    // Listen for theme changes
    this.controller.on('theme-changed', (theme: ThemeMode) => {
      this.applyTheme(theme);
    });
  }

  private applyTheme(theme: ThemeMode): void {
    // Add transition class before changing theme
    document.documentElement.classList.add('theme-transitioning');
    
    // Apply the new theme
    document.documentElement.setAttribute('data-theme', theme);
    
    // Remove transition class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 300);
  }

  private setupGlobalEvents(): void {
    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // Escape to clear search or go home
      if (e.key === 'Escape') {
        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        if (searchInput && searchInput === document.activeElement) {
          searchInput.blur();
          this.controller.clearSearch();
        } else if (this.controller.getCurrentTool()) {
          this.controller.goHome();
        }
      }

      // Ctrl/Cmd + / for sidebar toggle
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        this.controller.toggleSidebar();
      }
    });

    // Handle click outside to close search results
    document.addEventListener('click', (e) => {
      const searchContainer = document.querySelector('.search-container');
      const searchResults = document.getElementById('search-results');
      
      if (searchContainer && searchResults && !searchContainer.contains(e.target as Node)) {
        searchResults.style.display = 'none';
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Initial resize handling
    this.handleResize();
  }

  private handleResize(): void {
    const isMobile = window.innerWidth <= 768;
    
    // Auto-collapse sidebar on mobile
    if (isMobile && !this.controller.isSidebarCollapsed()) {
      this.controller.toggleSidebar();
    }
  }

  // Public method to get controller (for debugging)
  getController(): AppController {
    return this.controller;
  }
}
