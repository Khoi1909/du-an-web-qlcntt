import { AppController } from '@/controllers/AppController';
import { NavItem, Tool } from '@/models/Tool';
import { getIcon } from '@/utils/icons';

export class SidebarView {
  private controller: AppController;
  private container: HTMLElement;
  private navItems: NavItem[] = [];

  constructor(controller: AppController, container: HTMLElement) {
    this.controller = controller;
    this.container = container;
    this.init();
    this.bindEvents();
  }

  private async init(): Promise<void> {
    this.navItems = await this.controller.getNavigationItems();
    this.render();
  }

  private render(): void {
    const isCollapsed = this.controller.isSidebarCollapsed();
    
    this.container.innerHTML = `
      <aside class="sidebar ${isCollapsed ? 'collapsed' : ''}">
        <div class="sidebar-header">
          <button class="sidebar-toggle" id="sidebar-toggle">
            <span class="icon">${isCollapsed ? getIcon('menu') : getIcon('chevronLeft')}</span>
          </button>
          <h2 class="sidebar-title sidebar-content">Dev Tools</h2>
        </div>
        
        <nav class="sidebar-nav">
          ${this.renderNavItems()}
        </nav>
      </aside>
    `;

    // After render, ensure expanded categories have proper dynamic height
    this.applyDynamicHeights();
  }

  private renderNavItems(): string {
    const isCollapsed = this.controller.isSidebarCollapsed();
    
    return this.navItems.map(navItem => {
      const hasTools = navItem.tools.length > 0;
      
      return `
        <div class="nav-category" data-category="${navItem.category}">
          <div class="nav-category-header ${hasTools ? 'clickable' : ''}" ${hasTools ? `data-category="${navItem.category}"` : ''}>
            <span class="category-icon">${navItem.icon}</span>
            ${!isCollapsed ? `
              <span class="category-label">${navItem.label}</span>
              ${hasTools ? `<span class="category-arrow ${navItem.expanded ? 'expanded' : ''}">${getIcon('chevronRight')}</span>` : ''}
            ` : ''}
          </div>
          
          ${!isCollapsed && hasTools ? `
            <div class="nav-tools ${navItem.expanded ? 'expanded' : ''}">
              ${navItem.tools.map(tool => `
                <div class="nav-tool" data-tool-id="${tool.id}">
                  <span class="tool-icon">${getIcon(tool.icon as any)}</span>
                  <span class="tool-name">${tool.name}</span>
                  ${this.renderToolBadges(tool)}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${isCollapsed && hasTools ? `
            <div class="nav-tooltip">
              <div class="tooltip-content">
                <div class="tooltip-title">${navItem.label}</div>
                <div class="tooltip-tools">
                  ${navItem.tools.map(tool => `
                    <div class="tooltip-tool" data-tool-id="${tool.id}">
                      ${getIcon(tool.icon as any)} ${tool.name}
                      ${this.renderToolBadges(tool)}
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  private renderToolBadges(tool: Tool): string {
    // Only show favorite heart badge
    if (this.controller.isFavorite(tool.id)) {
      return `<span class="favorite-badge">${getIcon('heartFilled')}</span>`;
    }
    
    return '';
  }

  private bindEvents(): void {
    // Sidebar toggle
    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('#sidebar-toggle')) {
        this.animateSidebarToggle();
      }
      
      // Category expansion
      if (target.closest('.nav-category-header.clickable')) {
        const categoryElement = target.closest('.nav-category') as HTMLElement;
        const categoryId = categoryElement?.dataset.category;
        if (categoryId) {
          this.toggleCategory(categoryId);
        }
      }
      
      // Tool selection
      if (target.closest('.nav-tool') || target.closest('.tooltip-tool')) {
        const toolElement = target.closest('[data-tool-id]') as HTMLElement;
        const toolId = toolElement?.dataset.toolId;
        if (toolId) {
          this.controller.selectTool(toolId);
        }
      }
    });

    // Controller events
    this.controller.on('sidebar-toggled', () => {
      this.render();
    });

    this.controller.on('tool-selected', (tool: Tool) => {
      this.highlightSelectedTool(tool.id);
    });

    // Listen for favorite changes to update badges
    this.controller.on('favorite-changed', () => {
      this.render();
    });

    this.controller.on('show-home', () => {
      this.clearSelection();
    });
  }

  private toggleCategory(categoryId: string): void {
    const navItem = this.navItems.find(item => item.category === categoryId);
    if (navItem) {
      navItem.expanded = !navItem.expanded;
      
      // Update the specific category in DOM
      const categoryElement = this.container.querySelector(`[data-category="${categoryId}"]`) as HTMLElement;
      if (categoryElement) {
        const toolsContainer = categoryElement.querySelector('.nav-tools');
        const arrow = categoryElement.querySelector('.category-arrow');
        
        if (toolsContainer && arrow) {
          if (navItem.expanded) {
            toolsContainer.classList.add('expanded');
            arrow.classList.add('expanded');
            // Set dynamic height to fit its content
            (toolsContainer as HTMLElement).style.maxHeight = `${(toolsContainer as HTMLElement).scrollHeight}px`;
            (toolsContainer as HTMLElement).style.opacity = '1';
          } else {
            toolsContainer.classList.remove('expanded');
            arrow.classList.remove('expanded');
            // Collapse to zero height
            (toolsContainer as HTMLElement).style.maxHeight = '0px';
            (toolsContainer as HTMLElement).style.opacity = '0';
          }
        }
      }
    }
  }

  // Ensure any already-expanded groups use their natural scroll height instead of a fixed cap
  private applyDynamicHeights(): void {
    this.container.querySelectorAll('.nav-tools').forEach((el) => {
      const container = el as HTMLElement;
      const isExpanded = container.classList.contains('expanded');
      if (isExpanded) {
        container.style.maxHeight = `${container.scrollHeight}px`;
        container.style.opacity = '1';
      } else {
        container.style.maxHeight = '0px';
        container.style.opacity = '0';
      }
    });
  }

  private highlightSelectedTool(toolId: string): void {
    // Remove previous selection
    this.container.querySelectorAll('.nav-tool.selected').forEach(el => {
      el.classList.remove('selected');
    });

    // Add selection to current tool
    const toolElement = this.container.querySelector(`[data-tool-id="${toolId}"]`);
    if (toolElement) {
      toolElement.classList.add('selected');
      
      // Expand parent category if needed
      const parentCategory = toolElement.closest('.nav-category') as HTMLElement;
      const categoryId = parentCategory?.dataset.category;
      if (categoryId) {
        const navItem = this.navItems.find(item => item.category === categoryId);
        if (navItem && !navItem.expanded) {
          this.toggleCategory(categoryId);
        }
      }
    }
  }

  private clearSelection(): void {
    this.container.querySelectorAll('.nav-tool.selected').forEach(el => {
      el.classList.remove('selected');
    });
  }

  private animateSidebarToggle(): void {
    const sidebar = this.container.querySelector('.sidebar') as HTMLElement;
    const isCurrentlyCollapsed = this.controller.isSidebarCollapsed();
    
    // Update controller state first
    this.controller.toggleSidebar();
    
    if (isCurrentlyCollapsed) {
      // Expanding: Remove collapsed class and add expanding animation
      sidebar.classList.remove('collapsed');
      sidebar.classList.add('expanding');
      
      // Update toggle icon to show collapse state
      const toggleIcon = sidebar.querySelector('#sidebar-toggle .icon') as HTMLElement;
      if (toggleIcon) {
        toggleIcon.innerHTML = getIcon('chevronLeft');
      }
      
      // Remove expanding class after animation completes
      setTimeout(() => {
        sidebar.classList.remove('expanding');
      }, 600);
    } else {
      // Collapsing: Add collapsing animation first
      sidebar.classList.add('collapsing');
      
      // Update toggle icon to show expand state after a short delay
      setTimeout(() => {
        const toggleIcon = sidebar.querySelector('#sidebar-toggle .icon') as HTMLElement;
        if (toggleIcon) {
          toggleIcon.innerHTML = getIcon('menu');
        }
      }, 150);
      
      // Add collapsed class after content fades out
      setTimeout(() => {
        sidebar.classList.add('collapsed');
        sidebar.classList.remove('collapsing');
      }, 300);
    }
  }
}
