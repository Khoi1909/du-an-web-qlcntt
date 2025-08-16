import { Tool, ThemeMode, NavItem, ToolCategory } from '@/models/Tool';
import { ToolDiscoveryService } from '@/utils/ToolDiscoveryService';
import { FavoriteManager } from '@/utils/FavoriteManager';
import { DynamicToolLoader } from '@/utils/DynamicToolLoader';
import { getIcon } from '@/utils/icons';
import { Router } from '@/utils/Router';

export class AppController {
  private currentTool: Tool | null = null;
  private searchQuery: string = '';
  private themeMode: ThemeMode = ThemeMode.LIGHT;
  private sidebarCollapsed: boolean = false;
  private tools: Tool[] = [];
  private router: Router;
  private initialized: boolean = false;
  
  // Event listeners
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.router = new Router();
    this.loadSettings();
    this.initializeTools();
    this.startBackgroundOptimizations();
    // Don't setup routes here - will be called later from App
  }

  // Initialize tools from discovery service
  private async initializeTools(): Promise<void> {
    try {
      this.tools = await ToolDiscoveryService.discoverTools();
      console.log(`🔧 Discovered ${this.tools.length} tools`);
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize tools:', error);
      this.tools = [];
      this.initialized = true; // Mark as initialized even if failed
    }
  }

  // Start background optimizations
  private async startBackgroundOptimizations(): Promise<void> {
    // Wait a bit for initial load, then preload popular tools
    setTimeout(async () => {
      try {
        await DynamicToolLoader.preloadPopularTools();
        console.log('🚀 Popular tools preloaded for better performance');
      } catch (error) {
        console.warn('Failed to preload popular tools:', error);
      }
    }, 2000); // Wait 2 seconds after initial load
  }

  // Wait for initialization to complete
  public async waitForInitialization(): Promise<void> {
    if (this.initialized) return;
    
    // Wait for initialization with timeout
    let attempts = 0;
    while (!this.initialized && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (!this.initialized) {
      console.warn('Tool initialization timed out');
    }
  }

  // Initialize routing after views are ready
  public initializeRouting(): void {
    console.log('🎬 Initializing routing after views are ready...');
    this.setupRoutes();
  }

  // Event system
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data?: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => callback(data));
    }
  }

  // Theme management
  toggleTheme(): void {
    this.themeMode = this.themeMode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
    this.saveSettings();
    this.emit('theme-changed', this.themeMode);
  }

  getTheme(): ThemeMode {
    return this.themeMode;
  }

  // Sidebar management
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.emit('sidebar-toggled', this.sidebarCollapsed);
  }

  isSidebarCollapsed(): boolean {
    return this.sidebarCollapsed;
  }

  // Tool management
  getCurrentTool(): Tool | null {
    return this.currentTool;
  }

  getAllTools(): Tool[] {
    return this.tools;
  }

  async getFeaturedTools(): Promise<Tool[]> {
    // Thay thế featured tools bằng favorite tools
    return await this.getFavoriteTools();
  }

  // Lấy favorite tools
  async getFavoriteTools(): Promise<Tool[]> {
    const allTools = await ToolDiscoveryService.discoverTools();
    const favoriteIds = FavoriteManager.getFavorites();
    return allTools.filter(tool => favoriteIds.includes(tool.id));
  }

  // Search functionality
  async search(query: string): Promise<Tool[]> {
    this.searchQuery = query;
    const results = await ToolDiscoveryService.searchTools(query);
    this.emit('search-results', results);
    return results;
  }

  getSearchQuery(): string {
    return this.searchQuery;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.emit('search-cleared');
  }

  // Favorite management
  toggleFavorite(toolId: string): boolean {
    const isFavorite = FavoriteManager.toggleFavorite(toolId);
    this.emit('favorite-changed', { toolId, isFavorite });
    this.emit('favorites-updated', FavoriteManager.getFavorites());
    return isFavorite;
  }

  isFavorite(toolId: string): boolean {
    return FavoriteManager.isFavorite(toolId);
  }

  getFavoriteCount(): number {
    return FavoriteManager.getCount();
  }

  clearAllFavorites(): void {
    FavoriteManager.clearAll();
    this.emit('favorites-cleared');
    this.emit('favorites-updated', []);
  }

  // Navigation
  async getNavigationItems(): Promise<NavItem[]> {
    const categories = Object.values(ToolCategory);
    const navItems: NavItem[] = [];
    
    for (const category of categories) {
      const tools = await ToolDiscoveryService.getToolsByCategory(category);
      if (tools.length > 0) { // Only show categories that have tools
        navItems.push({
          id: category,
          label: this.getCategoryLabel(category),
          category: category,
          tools: tools,
          icon: this.getCategoryIcon(category),
          expanded: false
        });
      }
    }
    
    return navItems;
  }

  private getCategoryLabel(category: ToolCategory): string {
    const labels: Record<ToolCategory, string> = {
      [ToolCategory.ENCODING]: 'Encoding',
      [ToolCategory.CONVERSION]: 'Conversion',
      [ToolCategory.GENERATION]: 'Generation',
      [ToolCategory.STRING]: 'String Utils',
      [ToolCategory.API]: 'API Testing',
      [ToolCategory.REGEX]: 'Regex',
      [ToolCategory.CRYPTO]: 'Cryptography',
      [ToolCategory.DATETIME]: 'Date & Time',
      [ToolCategory.NETWORK]: 'Network',
      [ToolCategory.DEV]: 'Development'
    };
    return labels[category];
  }

  private getCategoryIcon(category: ToolCategory): string {
    const iconMap: Record<ToolCategory, string> = {
      [ToolCategory.ENCODING]: getIcon('encoding'),
      [ToolCategory.CONVERSION]: getIcon('conversion'),
      [ToolCategory.GENERATION]: getIcon('generation'),
      [ToolCategory.STRING]: getIcon('string'),
      [ToolCategory.API]: getIcon('api'),
      [ToolCategory.REGEX]: getIcon('regex'),
      [ToolCategory.CRYPTO]: getIcon('crypto'),
      [ToolCategory.DATETIME]: getIcon('datetime'),
      [ToolCategory.NETWORK]: getIcon('network'),
      [ToolCategory.DEV]: getIcon('dev')
    };
    return iconMap[category];
  }

  // Settings persistence
  private loadSettings(): void {
    try {
      const savedTheme = localStorage.getItem('dev-tools-theme');
      if (savedTheme && Object.values(ThemeMode).includes(savedTheme as ThemeMode)) {
        this.themeMode = savedTheme as ThemeMode;
      }

      const savedSidebar = localStorage.getItem('dev-tools-sidebar-collapsed');
      if (savedSidebar !== null) {
        this.sidebarCollapsed = JSON.parse(savedSidebar);
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('dev-tools-theme', this.themeMode);
      localStorage.setItem('dev-tools-sidebar-collapsed', JSON.stringify(this.sidebarCollapsed));
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error);
    }
  }

  private initializeNavigation(): void {
    // Navigation will be handled by router
    // This method is kept for potential future use
  }

  // Navigation actions
  goHome(): void {
    this.currentTool = null;
    this.clearSearch();
    // Update document title
    document.title = 'Dev Tools Platform - Developer Utilities';
    this.router.navigate('/');
    this.emit('show-home');
  }

  openGitHub(): void {
    window.open('https://github.com', '_blank');
  }

  // Routing setup
  private setupRoutes(): void {
    console.log('🚀 Setting up routes...');
    
    // Home route
    this.router.addRoute('/', () => {
      console.log('🏠 Home route triggered');
      this.currentTool = null;
      this.clearSearch();
      document.title = 'Dev Tools Platform - Developer Utilities';
      this.emit('show-home');
    });

    // Tool route with parameter
    this.router.addRoute('/tool/:id', () => {
      const path = this.router.getCurrentPath();
      const toolId = path.split('/')[2]; // Extract tool ID from path
      console.log('🔧 Tool route triggered for:', toolId);
      if (toolId) {
        this.selectToolById(toolId);
      } else {
        this.goHome();
      }
    });

    // 404 handler
    this.router.setNotFoundHandler(() => {
      console.log('❌ 404 handler triggered');
      this.goHome();
    });

    console.log('✅ Routes registered, initializing router...');
    // Initialize router
    this.router.init();
  }

  // Tool selection with routing
  selectTool(toolId: string): void {
    this.router.navigate(`/tool/${toolId}`);
  }

  private selectToolById(toolId: string): void {
    const tool = this.tools.find(t => t.id === toolId);
    if (tool) {
      this.currentTool = tool;
      // Update document title
      document.title = `${tool.name} - Dev Tools Platform`;
      this.emit('tool-selected', tool);
    } else {
      // Tool not found, go home
      this.goHome();
    }
  }

  // Get router instance for external use
  getRouter(): Router {
    return this.router;
  }
}
