import { Tool, ToolCategory } from '@/models/Tool';
import { DynamicToolLoader } from './DynamicToolLoader';

// Tool metadata decorator - để tự động phát hiện tool
export function ToolMetadata(metadata: Omit<Tool, 'id'>) {
  return function <T extends { new (...args: any[]): any }>(constructor: T) {
    // Lưu metadata vào constructor
    (constructor as any).toolMetadata = metadata;
    return constructor;
  };
}

// Auto discovery service
export class ToolDiscoveryService {
  private static discoveredTools: Tool[] = [];

  // Phát hiện tự động tools từ directory
  static async discoverTools(): Promise<Tool[]> {
    if (this.discoveredTools.length > 0) {
      return this.discoveredTools;
    }

    // Danh sách tools hiện tại (sẽ được tự động hóa trong tương lai)
    const toolConfigs = [
      {
        id: 'base64-encoder',
        name: 'Base64 Encoder/Decoder',
        description: 'Encode and decode Base64 strings',
        category: ToolCategory.ENCODING,
        icon: 'base64',
        component: 'Base64Tool',
        keywords: ['base64', 'encode', 'decode', 'encoding'],
        featured: true
      },
      {
        id: 'jwt-decoder',
        name: 'JWT Decoder',
        description: 'Decode and verify JWT tokens',
        category: ToolCategory.ENCODING,
        icon: 'jwt',
        component: 'JWTTool',
        keywords: ['jwt', 'token', 'decode', 'json web token'],
        featured: true
      },
      {
        id: 'json-yaml',
        name: 'JSON ↔ YAML Converter',
        description: 'Convert between JSON and YAML formats',
        category: ToolCategory.CONVERSION,
        icon: 'json',
        component: 'JsonYamlTool',
        keywords: ['json', 'yaml', 'convert', 'format'],
        featured: true
      },
      {
        id: 'csv-json',
        name: 'CSV ↔ JSON Converter',
        description: 'Convert between CSV and JSON formats',
        category: ToolCategory.CONVERSION,
        icon: 'csv',
        component: 'CsvJsonTool',
        keywords: ['csv', 'json', 'convert', 'data'],
        featured: false
      },
      {
        id: 'uuid-generator',
        name: 'UUID Generator',
        description: 'Generate UUIDs (v1, v4, v5)',
        category: ToolCategory.GENERATION,
        icon: 'uuid',
        component: 'UUIDTool',
        keywords: ['uuid', 'generate', 'guid', 'unique'],
        featured: true
      },
      {
        id: 'timestamp-converter',
        name: 'Timestamp Converter',
        description: 'Convert timestamps and work with dates',
        category: ToolCategory.DATETIME,
        icon: 'timestamp',
        component: 'TimestampTool',
        keywords: ['timestamp', 'date', 'time', 'convert', 'unix'],
        featured: false
      },
      {
        id: 'hash-generator',
        name: 'Hash Generator',
        description: 'Generate MD5, SHA1, SHA256 hashes',
        category: ToolCategory.CRYPTO,
        icon: 'hash',
        component: 'HashTool',
        keywords: ['hash', 'md5', 'sha1', 'sha256', 'crypto'],
        featured: true
      },
      {
        id: 'string-utilities',
        name: 'String Utilities',
        description: 'String manipulation and transformation tools',
        category: ToolCategory.STRING,
        icon: 'string',
        component: 'StringTool',
        keywords: ['string', 'text', 'transform', 'utilities'],
        featured: false
      },
      {
        id: 'api-tester',
        name: 'API Tester',
        description: 'Test REST APIs like Postman',
        category: ToolCategory.API,
        icon: 'api',
        component: 'ApiTool',
        keywords: ['api', 'rest', 'http', 'postman', 'test'],
        featured: true
      },
      {
        id: 'regex-tester',
        name: 'Regex Tester',
        description: 'Test and debug regular expressions',
        category: ToolCategory.REGEX,
        icon: 'regex',
        component: 'RegexTool',
        keywords: ['regex', 'regexp', 'pattern', 'test'],
        featured: false
      }
    ];

    // Validate tools với DynamicToolLoader
    this.discoveredTools = toolConfigs.filter(tool => {
      const hasLoader = DynamicToolLoader.has(tool.id);
      if (!hasLoader) {
        console.warn(`Tool "${tool.id}" not registered in DynamicToolLoader`);
      }
      return hasLoader;
    });

    return this.discoveredTools;
  }

  // Lấy tools theo category
  static async getToolsByCategory(category: ToolCategory): Promise<Tool[]> {
    const tools = await this.discoverTools();
    return tools.filter(tool => tool.category === category);
  }

  // Lấy featured tools
  static async getFeaturedTools(): Promise<Tool[]> {
    const tools = await this.discoverTools();
    return tools.filter(tool => tool.featured);
  }

  // Search tools
  static async searchTools(query: string): Promise<Tool[]> {
    const tools = await this.discoverTools();
    const searchTerm = query.toLowerCase();
    
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(searchTerm) ||
      tool.description.toLowerCase().includes(searchTerm) ||
      tool.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    );
  }

  // Reset cache
  static resetCache(): void {
    this.discoveredTools = [];
  }
}
