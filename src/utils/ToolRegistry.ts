import { Base64Tool } from '@/components/Base64Tool';
import { JWTTool } from '@/components/JWTTool';
import { JsonYamlTool } from '@/components/JsonYamlTool';
import { UUIDTool } from '@/components/UUIDTool';
import { HashTool } from '@/components/HashTool';
import { StringTool } from '@/components/StringTool';
import { ApiTool } from '@/components/ApiTool';
import { RegexTool } from '@/components/RegexTool';
import { CsvJsonTool } from '@/components/CsvJsonTool';
import { TimestampTool } from '@/components/TimestampTool';

// Tool constructor interface
export interface ToolConstructor {
  new (container: HTMLElement): any;
}

// Tool registry - tự động mapping tool ID với class
export class ToolRegistry {
  private static tools: Map<string, ToolConstructor> = new Map();

  // Đăng ký tool tự động
  static register(id: string, toolClass: ToolConstructor): void {
    this.tools.set(id, toolClass);
  }

  // Lấy tool class theo ID
  static get(id: string): ToolConstructor | undefined {
    return this.tools.get(id);
  }

  // Tạo instance tool
  static create(id: string, container: HTMLElement): any {
    const ToolClass = this.get(id);
    if (!ToolClass) {
      throw new Error(`Tool with ID "${id}" not found in registry`);
    }
    return new ToolClass(container);
  }

  // Kiểm tra tool có tồn tại không
  static has(id: string): boolean {
    return this.tools.has(id);
  }

  // Lấy danh sách tất cả tool IDs
  static getRegisteredIds(): string[] {
    return Array.from(this.tools.keys());
  }
}

// Tự động đăng ký tất cả tools
export function registerAllTools(): void {
  ToolRegistry.register('base64-encoder', Base64Tool);
  ToolRegistry.register('jwt-decoder', JWTTool);
  ToolRegistry.register('json-yaml', JsonYamlTool);
  ToolRegistry.register('csv-json', CsvJsonTool);
  ToolRegistry.register('uuid-generator', UUIDTool);
  ToolRegistry.register('timestamp-converter', TimestampTool);
  ToolRegistry.register('hash-generator', HashTool);
  ToolRegistry.register('string-utilities', StringTool);
  ToolRegistry.register('api-tester', ApiTool);
  ToolRegistry.register('regex-tester', RegexTool);
}

// Khởi tạo registry khi import
registerAllTools();
