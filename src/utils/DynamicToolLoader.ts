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
      'regex-tester': 'RegexTool',
      // Newly added mappings
      'url-encoder': 'UrlEncoderTool',
      'html-entities': 'HtmlEntitiesTool',
      'base-converter': 'BaseConverterTool',
      'text-to-binary': 'TextToBinaryTool',
      'text-to-unicode': 'TextToUnicodeTool',
      'roman-numeral': 'RomanNumeralTool',
      'color-converter': 'ColorConverterTool',
      'markdown-to-html': 'MarkdownToHtmlTool',
      'nato-alphabet': 'NatoAlphabetTool',
      'xml-json': 'XmlJsonTool',
      'list-converter': 'ListConverterTool',
      'toml-converter': 'TomlConverterTool',
      'case-converter': 'CaseConverterTool',
      'slugify': 'SlugifyTool',
      'email-normalizer': 'EmailNormalizerTool',
      'password-strength': 'PasswordStrengthTool',
      'regex-cheatsheet': 'RegexCheatsheetTool',
      'hmac-generator': 'HmacTool',
      'encrypt-decrypt': 'EncryptDecryptTool',
      'bcrypt-demo': 'BcryptTool',
      'rsa-keypair': 'RSAKeyPairTool',
      'bip39-generator': 'BIP39Tool',
      'pdf-signature-checker': 'PDFSignatureCheckerTool',
      // Generation specific mappings where PascalCase differs from file export
      'qr-generator': 'QrCodeGeneratorTool'
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
  
  // New Encoding tools
  DynamicToolLoader.register('url-encoder', () => import('@/components/UrlEncoderTool'));
  DynamicToolLoader.register('html-entities', () => import('@/components/HtmlEntitiesTool'));
  // Conversion tools
  DynamicToolLoader.register('base-converter', () => import('@/components/BaseConverterTool'));
  DynamicToolLoader.register('text-to-binary', () => import('@/components/TextToBinaryTool'));
  DynamicToolLoader.register('text-to-unicode', () => import('@/components/TextToUnicodeTool'));
  DynamicToolLoader.register('roman-numeral', () => import('@/components/RomanNumeralTool'));
  DynamicToolLoader.register('color-converter', () => import('@/components/ColorConverterTool'));
  DynamicToolLoader.register('markdown-to-html', () => import('@/components/MarkdownToHtmlTool'));
  DynamicToolLoader.register('nato-alphabet', () => import('@/components/NatoAlphabetTool'));
  DynamicToolLoader.register('xml-json', () => import('@/components/XmlJsonTool'));
  DynamicToolLoader.register('list-converter', () => import('@/components/ListConverterTool'));
  DynamicToolLoader.register('toml-converter', () => import('@/components/TomlConverterTool'));
  // String & Regex tools
  DynamicToolLoader.register('case-converter', () => import('@/components/CaseConverterTool'));
  DynamicToolLoader.register('slugify', () => import('@/components/SlugifyTool'));
  DynamicToolLoader.register('email-normalizer', () => import('@/components/EmailNormalizerTool'));
  DynamicToolLoader.register('password-strength', () => import('@/components/PasswordStrengthTool'));
  
  // Crypto tools
  DynamicToolLoader.register('hmac-generator', () => import('@/components/HmacTool'));
  DynamicToolLoader.register('encrypt-decrypt', () => import('@/components/EncryptDecryptTool'));
  DynamicToolLoader.register('bcrypt-demo', () => import('@/components/BcryptTool'));
  DynamicToolLoader.register('rsa-keypair', () => import('@/components/RSAKeyPairTool'));
  DynamicToolLoader.register('bip39-generator', () => import('@/components/BIP39Tool'));
  DynamicToolLoader.register('pdf-signature-checker', () => import('@/components/PDFSignatureCheckerTool'));
  // Network tools
  DynamicToolLoader.register('ipv4-subnet', () => import('@/components/Ipv4SubnetTool'));
  DynamicToolLoader.register('ipv4-converter', () => import('@/components/Ipv4ConverterTool'));
  DynamicToolLoader.register('ipv4-range', () => import('@/components/Ipv4RangeTool'));
  DynamicToolLoader.register('mac-lookup', () => import('@/components/MacLookupTool'));
  DynamicToolLoader.register('mac-generator', () => import('@/components/MacGeneratorTool'));
  DynamicToolLoader.register('ipv6-ula', () => import('@/components/Ipv6UlaTool'));
  DynamicToolLoader.register('user-agent-parser', () => import('@/components/UserAgentParserTool'));
  // Development tools
  DynamicToolLoader.register('git-cheatsheet', () => import('@/components/GitCheatsheetTool'));
  DynamicToolLoader.register('crontab-generator', () => import('@/components/CrontabGeneratorTool'));
  DynamicToolLoader.register('json-prettify', () => import('@/components/JsonPrettifyTool'));
  DynamicToolLoader.register('sql-formatter', () => import('@/components/SqlFormatterTool'));
  DynamicToolLoader.register('chmod-calculator', () => import('@/components/ChmodCalculatorTool'));
  DynamicToolLoader.register('docker-cheatsheet', () => import('@/components/DockerCheatsheetTool'));
  DynamicToolLoader.register('docker-run-to-compose', () => import('@/components/DockerRunToComposeTool'));
  DynamicToolLoader.register('xml-formatter', () => import('@/components/XmlFormatterTool'));
  DynamicToolLoader.register('yaml-formatter', () => import('@/components/YamlFormatterTool'));
  DynamicToolLoader.register('json-diff', () => import('@/components/JsonDiffTool'));
  DynamicToolLoader.register('url-parser', () => import('@/components/UrlParserTool'));
  DynamicToolLoader.register('http-status-codes', () => import('@/components/HttpStatusCodesTool'));
  DynamicToolLoader.register('mime-types', () => import('@/components/MimeTypesTool'));
  // Generation
  DynamicToolLoader.register('ulid-generator', () => import('@/components/UlidGeneratorTool'));
  DynamicToolLoader.register('token-generator', () => import('@/components/TokenGeneratorTool'));
  DynamicToolLoader.register('totp-generator', () => import('@/components/TotpGeneratorTool'));
  DynamicToolLoader.register('qr-generator', () => import('@/components/QrCodeGeneratorTool'));
  DynamicToolLoader.register('wifi-qr-generator', () => import('@/components/WifiQrGeneratorTool'));
  DynamicToolLoader.register('svg-placeholder', () => import('@/components/SvgPlaceholderTool'));
  DynamicToolLoader.register('random-port', () => import('@/components/RandomPortTool'));
  DynamicToolLoader.register('basic-auth-generator', () => import('@/components/BasicAuthGeneratorTool'));
  DynamicToolLoader.register('open-graph-meta', () => import('@/components/OpenGraphMetaTool'));
}

// Khởi tạo dynamic loading
registerDynamicTools();
