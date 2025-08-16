import { AppController } from '@/controllers/AppController';
import { Tool } from '@/models/Tool';
import { getIcon } from '@/utils/icons';
import { DynamicToolLoader } from '@/utils/DynamicToolLoader';
import { ToolDiscoveryService } from '@/utils/ToolDiscoveryService';

export class MainContentView {
  private controller: AppController;
  private container: HTMLElement;
  private currentTool: any = null;

  constructor(controller: AppController, container: HTMLElement) {
    this.controller = controller;
    this.container = container;
    this.init();
    this.bindEvents();
  }

  private init(): void {
    // Show loading state while router determines initial route
    this.container.innerHTML = `
      <main class="main-content loading">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </main>
    `;
  }

  private bindEvents(): void {
    this.controller.on('tool-selected', async (tool: Tool) => {
      // Skip animation on initial load to prevent flash
      if (this.container.innerHTML.includes('loading-container')) {
        await this.showTool(tool);
      } else {
        this.animateContentChange(async () => await this.showTool(tool));
      }
    });

    this.controller.on('show-home', async () => {
      // Skip animation on initial load to prevent flash
      if (this.container.innerHTML.includes('loading-container')) {
        await this.showHome();
      } else {
        this.animateContentChange(async () => await this.showHome());
      }
    });
  }

  private animateContentChange(callback: () => Promise<void> | void): void {
    // Add slide out animation
    this.container.classList.add('slide-out');
    
    setTimeout(() => {
      // Execute the content change
      callback();
      
      // Remove slide out and add slide in
      this.container.classList.remove('slide-out');
      this.container.classList.add('slide-in');
      
      // Remove slide in class after animation
      setTimeout(() => {
        this.container.classList.remove('slide-in');
      }, 400);
    }, 300);
  }

  private async showHome(): Promise<void> {
    const favoriteTools = await this.controller.getFavoriteTools();
    const allTools = this.controller.getAllTools();
    
    this.container.innerHTML = `
      <main class="main-content home">
        <div class="home-header">
          <h1 class="home-title">Developer Tools Platform</h1>
          <p class="home-subtitle">
            A comprehensive collection of utility tools for developers and IT professionals
          </p>
        </div>

        ${favoriteTools.length > 0 ? `
        <section class="favorite-tools">
          <h2 class="section-title">
            <span class="icon">${getIcon('heartFilled')}</span>
            Your Favorite Tools (${favoriteTools.length})
          </h2>
          <div class="tools-grid">
            ${favoriteTools.map((tool: Tool) => this.renderToolCard(tool)).join('')}
          </div>
        </section>
        ` : ''}

        <section class="all-tools">
          <h2 class="section-title">
            <span class="icon">${getIcon('tools')}</span>
            All Tools (${allTools.length})
          </h2>
          <div class="tools-grid">
            ${allTools.map((tool: Tool) => this.renderToolCard(tool)).join('')}
          </div>
        </section>

        <section class="platform-info">
          <div class="info-cards">
            <div class="info-card">
              <div class="info-icon">${getIcon('rocket')}</div>
              <h3>Fast & Efficient</h3>
              <p>All tools run client-side for maximum speed and privacy</p>
            </div>
            <div class="info-card">
              <div class="info-icon">${getIcon('shield')}</div>
              <h3>Privacy First</h3>
              <p>No data is sent to servers - everything stays in your browser</p>
            </div>
            <div class="info-card">
              <div class="info-icon">${getIcon('smartphone')}</div>
              <h3>Responsive Design</h3>
              <p>Works perfectly on desktop, tablet, and mobile devices</p>
            </div>
            <div class="info-card">
              <div class="info-icon">${getIcon('gift')}</div>
              <h3>Completely Free</h3>
              <p>Open source and free to use - no registration required</p>
            </div>
          </div>
        </section>
      </main>
    `;

    this.bindToolCardEvents();
  }

  private async showTool(tool: Tool): Promise<void> {
    // Cleanup current tool if exists
    if (this.currentTool && this.currentTool.destroy) {
      this.currentTool.destroy();
      this.currentTool = null;
    }

    this.container.innerHTML = `
      <main class="main-content tool-view">
        <div class="tool-content" id="tool-content">
          <!-- Tool component will be rendered here -->
        </div>
      </main>
    `;

    // Load and render the tool component
    await this.renderToolComponent(tool);
  }

  private async renderToolComponent(tool: Tool): Promise<void> {
    const toolContainer = this.container.querySelector('#tool-content') as HTMLElement;
    
    try {
      // Show loading state
      toolContainer.innerHTML = `
        <div class="tool-loading">
          <div class="loading-spinner"></div>
          <p>Loading ${tool.name}...</p>
        </div>
      `;

      // Load tool dynamically
      this.currentTool = await DynamicToolLoader.loadTool(tool.id, toolContainer);
      
    } catch (error) {
      console.error(`Failed to load tool "${tool.id}":`, error);
      toolContainer.innerHTML = `
        <div class="tool-error">
          <div class="error-icon">${getIcon('alert')}</div>
          <h3>Failed to load tool</h3>
          <p>The tool "${tool.name}" could not be loaded. Please try again.</p>
          <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
        </div>
      `;
    }
  }

  private renderToolCard(tool: Tool): string {
    const isFavorite = this.controller.isFavorite(tool.id);
    
    return `
      <div class="tool-card" data-tool-id="${tool.id}">
        <div class="tool-card-header">
          <span class="tool-card-icon">${getIcon(tool.icon as any)}</span>
          <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                  data-tool-id="${tool.id}" 
                  title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
            ${isFavorite ? getIcon('heartFilled') : getIcon('heart')}
          </button>
        </div>
        <div class="tool-card-body">
          <h3 class="tool-card-title">${tool.name}</h3>
          <p class="tool-card-description">${tool.description}</p>
          <div class="tool-card-category">${this.getCategoryLabel(tool.category)}</div>
        </div>
        <div class="tool-card-footer">
          <button class="tool-card-button">Open Tool</button>
        </div>
      </div>
    `;
  }

  private getToolFeatures(toolId: string): string[] {
    const features: Record<string, string[]> = {
      'base64-encoder': [
        'Encode text to Base64',
        'Decode Base64 to text',
        'Handle file encoding',
        'Copy to clipboard functionality'
      ],
      'jwt-decoder': [
        'Decode JWT header and payload',
        'Verify JWT signature',
        'Pretty print JSON',
        'Token validation'
      ],
      'json-yaml': [
        'Convert JSON to YAML',
        'Convert YAML to JSON',
        'Syntax highlighting',
        'Error validation'
      ],
      'uuid-generator': [
        'Generate UUID v1, v4, v5',
        'Bulk generation',
        'Custom namespace support',
        'Copy multiple UUIDs'
      ],
      'hash-generator': [
        'MD5 hash generation',
        'SHA1, SHA256, SHA512 support',
        'File hash calculation',
        'Compare hashes'
      ],
      'api-tester': [
        'Send HTTP requests',
        'Multiple request methods',
        'Custom headers support',
        'Response formatting'
      ],
      'regex-tester': [
        'Test regex patterns',
        'Highlight matches',
        'Group capture support',
        'Common regex library'
      ]
    };

    return features[toolId] || ['Feature-rich implementation', 'User-friendly interface', 'Fast performance'];
  }

  private bindToolCardEvents(): void {
    // Bind tool card clicks
    this.container.querySelectorAll('.tool-card').forEach(card => {
      // Handle tool card click (excluding favorite button)
      card.addEventListener('click', (e) => {
        // Don't trigger tool selection if favorite button was clicked
        if ((e.target as HTMLElement).closest('.favorite-btn')) {
          return;
        }
        
        const toolId = card.getAttribute('data-tool-id');
        if (toolId) {
          this.controller.selectTool(toolId);
        }
      });
    });

    // Bind favorite button clicks
    this.container.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation(); // Prevent tool card click
        
        const toolCard = btn.closest('.tool-card');
        const toolId = toolCard?.getAttribute('data-tool-id');
        
        if (toolId) {
          // Toggle favorite state
          const newFavoriteState = this.controller.toggleFavorite(toolId);
          
          // Update ALL favorite buttons with the same toolId (both in favorites section and all tools section)
          this.updateAllFavoriteButtons(toolId, newFavoriteState);
          
          // Always refresh the home view to update favorite section
          // This ensures real-time updates without manual page reload
          await this.refreshFavoriteSection();
        }
      });
    });
  }

  private isShowingFavorites(): boolean {
    // Check if we're currently showing the favorites section
    const favoriteSection = this.container.querySelector('.favorite-tools-section') as HTMLElement;
    return favoriteSection !== null && favoriteSection.style.display !== 'none';
  }

  private async refreshFavoriteSection(): Promise<void> {
    // Find the existing favorite section
    const existingFavoriteSection = this.container.querySelector('.favorite-tools-section');
    const favoriteTools = await this.controller.getFavoriteTools();
    
    if (favoriteTools.length > 0) {
      // Create new favorite section HTML
      const favoriteHTML = `
        <section class="tools-section favorite-tools-section">
          <div class="section-header">
            <h2><i class="fas fa-heart"></i> Your Favorite Tools</h2>
            <p>Quick access to your most-used tools</p>
          </div>
          <div class="tools-grid">
            ${favoriteTools.map((tool: Tool) => this.renderToolCard(tool)).join('')}
          </div>
        </section>
      `;
      
      if (existingFavoriteSection) {
        // Replace existing section
        existingFavoriteSection.outerHTML = favoriteHTML;
      } else {
        // Add new section at the top of main content
        const mainContent = this.container.querySelector('.main-content');
        if (mainContent) {
          const firstSection = mainContent.querySelector('.tools-section');
          if (firstSection) {
            firstSection.insertAdjacentHTML('beforebegin', favoriteHTML);
          } else {
            mainContent.insertAdjacentHTML('afterbegin', favoriteHTML);
          }
        }
      }
    } else {
      // Remove favorite section if no favorites
      if (existingFavoriteSection) {
        existingFavoriteSection.remove();
      }
    }
    
    // Only bind events for the newly created favorite section
    if (favoriteTools.length > 0) {
      this.bindFavoriteSectionEvents();
    }
  }

  private bindFavoriteSectionEvents(): void {
    // Only bind events for favorite section tool cards
    const favoriteSection = this.container.querySelector('.favorite-tools-section');
    if (!favoriteSection) return;

    // Bind tool card clicks for favorite section
    favoriteSection.querySelectorAll('.tool-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('.favorite-btn')) {
          return;
        }
        
        const toolId = card.getAttribute('data-tool-id');
        if (toolId) {
          this.controller.selectTool(toolId);
        }
      });
    });

    // Bind favorite button clicks for favorite section
    favoriteSection.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        
        const toolCard = btn.closest('.tool-card');
        const toolId = toolCard?.getAttribute('data-tool-id');
        
        if (toolId) {
          const newFavoriteState = this.controller.toggleFavorite(toolId);
          
          // Update all favorite buttons
          this.updateAllFavoriteButtons(toolId, newFavoriteState);
          
          await this.refreshFavoriteSection();
        }
      });
    });
  }

  private updateAllFavoriteButtons(toolId: string, isFavorite: boolean): void {
    // Update all favorite buttons with the same toolId across the entire container
    const allFavoriteButtons = this.container.querySelectorAll(`.favorite-btn[data-tool-id="${toolId}"]`);
    
    allFavoriteButtons.forEach(btn => {
      btn.innerHTML = isFavorite ? getIcon('heartFilled') : getIcon('heart');
      btn.classList.toggle('active', isFavorite);
      btn.setAttribute('title', isFavorite ? 'Remove from favorites' : 'Add to favorites');
    });
  }

  private getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'encoding': 'Encoding',
      'conversion': 'Conversion',
      'generation': 'Generation',
      'string': 'String Utils',
      'api': 'API Testing',
      'regex': 'Regex',
      'crypto': 'Cryptography',
      'datetime': 'Date & Time',
      'network': 'Network',
      'dev': 'Development'
    };
    return labels[category] || category;
  }
}
