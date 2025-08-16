import { ToolConstructor } from './ToolRegistry';

// Dynamic tool loader với lazy loading và preloading
export class DynamicToolLoader {
  private static toolModules: Map<string, () => Promise<any>> = new Map();
  private static preloadedModules: Map<string, Promise<any>> = new Map();
  
  // Popular tools để preload
  private static popularTools = ['base64-encoder', 'jwt-decoder', 'json-yaml', 'uuid-generator'];

  // Đăng ký tool với dynamic import
  static register(id: string, importFn: () => Promise<any>): void {
    this.toolModules.set(id, importFn);
  }

  // Preload popular tools trong background
  static async preloadPopularTools(): Promise<void> {
    const preloadPromises = this.popularTools.map(async (toolId) => {
      const importFn = this.toolModules.get(toolId);
      if (importFn && !this.preloadedModules.has(toolId)) {
        const promise = importFn();
        this.preloadedModules.set(toolId, promise);
        try {
          await promise;
          console.log(`✅ Preloaded tool: ${toolId}`);
        } catch (error) {
          console.warn(`❌ Failed to preload tool: ${toolId}`, error);
        }
      }
    });
    
    await Promise.allSettled(preloadPromises);
  }

  // Load tool động và tạo instance
  static async loadTool(id: string, container: HTMLElement): Promise<any> {
    try {
      let module;
      
      // Check if already preloaded
      if (this.preloadedModules.has(id)) {
        module = await this.preloadedModules.get(id);
      } else {
        const importFn = this.toolModules.get(id);
        if (!importFn) {
          throw new Error(`Tool with ID "${id}" not registered for dynamic loading`);
        }
        module = await importFn();
      }
      
      // Lấy tool class từ module (convention: tên class = tên file)
      const toolClassName = this.getToolClassName(id);
      const ToolClass = module[toolClassName] as ToolConstructor;
      
      if (!ToolClass) {
        throw new Error(`Tool class "${toolClassName}" not found in module for "${id}"`);
      }

      // Tạo instance
      return new ToolClass(container);
    } catch (error) {
      console.error(`Failed to load tool "${id}":`, error);
      throw error;
    }
  }

  // Convert tool ID thành class name theo convention
  private static getToolClassName(id: string): string {
    // Ví dụ: 'base64-encoder' -> 'Base64Tool'
    const classMap: Record<string, string> = {
      'base64-encoder': 'Base64Tool',
      'jwt-decoder': 'JWTTool',
      'json-yaml': 'JsonYamlTool',
      'csv-json': 'CsvJsonTool',
      'uuid-generator': 'UUIDTool',
      'timestamp-converter': 'TimestampTool',
      'hash-generator': 'HashTool',
      'string-utilities': 'StringTool',
      'api-tester': 'ApiTool',
      'regex-tester': 'RegexTool'
    };

    return classMap[id] || this.pascalCase(id) + 'Tool';
  }

  // Helper: convert kebab-case thành PascalCase
  private static pascalCase(str: string): string {
    return str
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }

  // Kiểm tra tool có được đăng ký không
  static has(id: string): boolean {
    return this.toolModules.has(id);
  }

  // Lấy danh sách tool IDs
  static getRegisteredIds(): string[] {
    return Array.from(this.toolModules.keys());
  }
}

// Đăng ký tất cả tools với dynamic import
export function registerDynamicTools(): void {
  DynamicToolLoader.register('base64-encoder', () => import('@/components/Base64Tool'));
  DynamicToolLoader.register('jwt-decoder', () => import('@/components/JWTTool'));
  DynamicToolLoader.register('json-yaml', () => import('@/components/JsonYamlTool'));
  DynamicToolLoader.register('csv-json', () => import('@/components/CsvJsonTool'));
  DynamicToolLoader.register('uuid-generator', () => import('@/components/UUIDTool'));
  DynamicToolLoader.register('timestamp-converter', () => import('@/components/TimestampTool'));
  DynamicToolLoader.register('hash-generator', () => import('@/components/HashTool'));
  DynamicToolLoader.register('string-utilities', () => import('@/components/StringTool'));
  DynamicToolLoader.register('api-tester', () => import('@/components/ApiTool'));
  DynamicToolLoader.register('regex-tester', () => import('@/components/RegexTool'));
}

// Khởi tạo dynamic loading
registerDynamicTools();
