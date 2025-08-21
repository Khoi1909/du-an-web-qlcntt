export class Router {
  private routes: Map<string, () => void> = new Map();
  private notFoundHandler: (() => void) | null = null;
  private base: string;

  constructor() {
    // Respect Vite base path both in dev and build
    const viteBase = (import.meta as any).env?.BASE_URL as string | undefined;
    this.base = (viteBase || '/').replace(/\/+$|^$/g, '/');
    // Listen for browser navigation (back/forward buttons)
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });
  }

  // Register a route
  public addRoute(path: string, handler: () => void): void {
    this.routes.set(path, handler);
  }

  // Set 404 handler
  public setNotFoundHandler(handler: () => void): void {
    this.notFoundHandler = handler;
  }

  // Navigate to a route programmatically
  public navigate(path: string): void {
    // Update URL without reloading
    const normalized = path.startsWith('/') ? path : `/${path}`;
    const prefix = this.base.endsWith('/') ? this.base.slice(0, -1) : this.base;
    window.history.pushState({}, '', `${prefix}${normalized}`);
    this.handleRoute();
  }

  // Handle current route
  public handleRoute(): void {
    const path = this.getCurrentPath();
    const handler = this.routes.get(path);

    if (handler) {
      handler();
    } else {
      // Try to find a route that matches with parameters
      const matchedRoute = this.findMatchingRoute(path);
      if (matchedRoute) {
        matchedRoute.handler();
      } else if (this.notFoundHandler) {
        this.notFoundHandler();
      } else {
        // Default to home
        this.navigate('/');
      }
    }
  }

  // Get current path
  public getCurrentPath(): string {
    const pathname = window.location.pathname;
    if (this.base && pathname.startsWith(this.base)) {
      const sub = pathname.slice(this.base.length - (this.base.endsWith('/') ? 1 : 0));
      return sub || '/';
    }
    return pathname || '/';
  }

  // Get query parameters
  public getQueryParams(): URLSearchParams {
    return new URLSearchParams(window.location.search);
  }

  // Find matching route with parameters
  private findMatchingRoute(path: string): { handler: () => void; params: Record<string, string> } | null {
    for (const [routePath, handler] of this.routes) {
      const match = this.matchRoute(routePath, path);
      if (match) {
        return { handler, params: match };
      }
    }
    return null;
  }

  // Match route with parameters (simple implementation)
  private matchRoute(routePath: string, actualPath: string): Record<string, string> | null {
    const routeParts = routePath.split('/');
    const actualParts = actualPath.split('/');

    if (routeParts.length !== actualParts.length) {
      return null;
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const actualPart = actualParts[i];

      if (routePart.startsWith(':')) {
        // Parameter
        const paramName = routePart.slice(1);
        params[paramName] = actualPart;
      } else if (routePart !== actualPart) {
        // Exact match required
        return null;
      }
    }

    return params;
  }

  // Initialize router
  public init(): void {
    // Handle initial route
    this.handleRoute();
  }
}
