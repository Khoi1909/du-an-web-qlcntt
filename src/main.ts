import { App } from './App';
import '../assets/css/styles.css';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    const app = new App();
    console.log('🚀 Dev Tools Platform initialized successfully');
    
    // Make app globally accessible for debugging
    (window as any).devToolsApp = app;
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    
    // Show error message to user
    document.body.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background-color: #f8fafc;
        color: #1f2937;
      ">
        <div style="text-align: center; max-width: 500px; padding: 40px;">
          <h1 style="font-size: 24px; margin-bottom: 16px; color: #dc2626;">
            ⚠️ Application Error
          </h1>
          <p style="margin-bottom: 24px; color: #6b7280; line-height: 1.6;">
            Failed to load the Developer Tools Platform. Please refresh the page or check the console for more details.
          </p>
          <button 
            onclick="window.location.reload()" 
            style="
              background-color: #1e40af;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              transition: background-color 0.2s;
            "
            onmouseover="this.style.backgroundColor='#1d4ed8'"
            onmouseout="this.style.backgroundColor='#1e40af'"
          >
            🔄 Reload Page
          </button>
        </div>
      </div>
    `;
  }
});

// Add some global utilities for debugging
(window as any).devToolsUtils = {
  // Theme switching
  setTheme: (theme: 'light' | 'dark') => {
    const app = (window as any).devToolsApp;
    if (app) {
      const controller = app.getController();
      if (controller.getTheme() !== theme) {
        controller.toggleTheme();
      }
    }
  },
  
  // Direct tool selection
  selectTool: (toolId: string) => {
    const app = (window as any).devToolsApp;
    if (app) {
      app.getController().selectTool(toolId);
    }
  },
  
  // Search tools
  search: (query: string) => {
    const app = (window as any).devToolsApp;
    if (app) {
      return app.getController().search(query);
    }
  },
  
  // Get all available tools
  getAllTools: () => {
    const app = (window as any).devToolsApp;
    if (app) {
      return app.getController().getAllTools();
    }
  }
};

// Service Worker registration for PWA capabilities (future enhancement)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // This will be implemented later for offline support
    console.log('💡 Service Worker support detected - PWA features available');
  });
}

// Handle uncaught errors gracefully
window.addEventListener('error', (event) => {
  console.error('💥 Uncaught error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('💥 Unhandled promise rejection:', event.reason);
});
