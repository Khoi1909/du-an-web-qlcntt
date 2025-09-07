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
        id: 'hmac-generator',
        name: 'Hmac generator',
        description: 'Generate HMAC using SHA-256/512',
        category: ToolCategory.CRYPTO,
        icon: 'hash',
        component: 'HmacTool',
        keywords: ['hmac', 'sha256', 'sha512'],
        featured: false
      },
      {
        id: 'encrypt-decrypt',
        name: 'Encrypt / decrypt text',
        description: 'AES-GCM with PBKDF2 derivation',
        category: ToolCategory.CRYPTO,
        icon: 'lock',
        component: 'EncryptDecryptTool',
        keywords: ['aes', 'gcm', 'encrypt', 'decrypt'],
        featured: false
      },
      {
        id: 'bcrypt-demo',
        name: 'Bcrypt',
        description: 'Hash & verify (browser demo)',
        category: ToolCategory.CRYPTO,
        icon: 'hash',
        component: 'BcryptTool',
        keywords: ['bcrypt', 'hash', 'password'],
        featured: false
      },
      {
        id: 'rsa-keypair',
        name: 'RSA key pair generator',
        description: 'Generate RSA-OAEP keys and export PEM',
        category: ToolCategory.CRYPTO,
        icon: 'crypto',
        component: 'RSAKeyPairTool',
        keywords: ['rsa', 'key', 'pem'],
        featured: false
      },
      {
        id: 'bip39-generator',
        name: 'BIP39 passphrase generator',
        description: 'Generate/validate mnemonic (demo wordlist)',
        category: ToolCategory.CRYPTO,
        icon: 'crypto',
        component: 'BIP39Tool',
        keywords: ['bip39', 'mnemonic'],
        featured: false
      },
      {
        id: 'pdf-signature-checker',
        name: 'PDF signature checker',
        description: 'Detects presence of digital signature markers in a PDF',
        category: ToolCategory.CRYPTO,
        icon: 'crypto',
        component: 'PDFSignatureCheckerTool',
        keywords: ['pdf', 'signature', 'signed', 'verify'],
        featured: false
      },
      {
        id: 'case-converter',
        name: 'Case converter',
        description: 'Convert to camelCase, snake_case, kebab-case, Title Case',
        category: ToolCategory.STRING,
        icon: 'string',
        component: 'CaseConverterTool',
        keywords: ['case', 'camel', 'snake', 'kebab', 'title'],
        featured: false
      },
      {
        id: 'slugify',
        name: 'Slugify string',
        description: 'URL-friendly slugs with diacritics removal',
        category: ToolCategory.STRING,
        icon: 'string',
        component: 'SlugifyTool',
        keywords: ['slug', 'url', 'diacritics'],
        featured: false
      },
      {
        id: 'email-normalizer',
        name: 'Email normalizer',
        description: 'Normalize emails, Gmail dots and +tag rules',
        category: ToolCategory.STRING,
        icon: 'string',
        component: 'EmailNormalizerTool',
        keywords: ['email', 'normalize', 'gmail'],
        featured: false
      },
      {
        id: 'password-strength',
        name: 'Password strength analyzer',
        description: 'Score passwords and give feedback',
        category: ToolCategory.STRING,
        icon: 'string',
        component: 'PasswordStrengthTool',
        keywords: ['password', 'strength', 'security'],
        featured: false
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
        id: 'url-encoder',
        name: 'Encode/decode URL-form data',
        description: 'Percent-encode/decode strings for URLs and queries',
        category: ToolCategory.ENCODING,
        icon: 'encoding',
        component: 'UrlEncoderTool',
        keywords: ['url', 'percent', 'encode', 'decode', 'query'],
        featured: false
      },
      {
        id: 'html-entities',
        name: 'Escape HTML entities',
        description: 'Escape and unescape HTML entities (&, <, >, ", \')',
        category: ToolCategory.ENCODING,
        icon: 'encoding',
        component: 'HtmlEntitiesTool',
        keywords: ['html', 'entities', 'escape', 'unescape'],
        featured: false
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
        id: 'base-converter',
        name: 'Integer base converter',
        description: 'Convert integers between bases 2–36',
        category: ToolCategory.CONVERSION,
        icon: 'conversion',
        component: 'BaseConverterTool',
        keywords: ['base', 'radix', 'binary', 'hex', 'decimal'],
        featured: false
      },
      {
        id: 'text-to-binary',
        name: 'Text to ASCII binary',
        description: 'Encode/decode text using 8-bit ASCII',
        category: ToolCategory.CONVERSION,
        icon: 'conversion',
        component: 'TextToBinaryTool',
        keywords: ['ascii', 'binary', 'encode', 'decode'],
        featured: false
      },
      {
        id: 'text-to-unicode',
        name: 'Text to Unicode',
        description: 'Convert text to code points and back',
        category: ToolCategory.CONVERSION,
        icon: 'conversion',
        component: 'TextToUnicodeTool',
        keywords: ['unicode', 'codepoint', 'utf', 'u+'],
        featured: false
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
        id: 'roman-numeral',
        name: 'Roman numeral converter',
        description: 'Convert numbers to/from Roman numerals',
        category: ToolCategory.CONVERSION,
        icon: 'conversion',
        component: 'RomanNumeralTool',
        keywords: ['roman', 'numeral', 'number'],
        featured: false
      },
      {
        id: 'color-converter',
        name: 'Color converter',
        description: 'Convert between HEX, RGB, and HSL',
        category: ToolCategory.CONVERSION,
        icon: 'conversion',
        component: 'ColorConverterTool',
        keywords: ['color', 'hex', 'rgb', 'hsl'],
        featured: false
      },
      {
        id: 'markdown-to-html',
        name: 'Markdown to HTML',
        description: 'Convert basic Markdown to HTML with preview',
        category: ToolCategory.CONVERSION,
        icon: 'conversion',
        component: 'MarkdownToHtmlTool',
        keywords: ['markdown', 'html'],
        featured: false
      },
      {
        id: 'nato-alphabet',
        name: 'Text to NATO alphabet',
        description: 'Encode/Decode with NATO phonetic alphabet',
        category: ToolCategory.CONVERSION,
        icon: 'conversion',
        component: 'NatoAlphabetTool',
        keywords: ['nato', 'phonetic', 'alphabet'],
        featured: false
      },
      {
        id: 'xml-json',
        name: 'XML ↔ JSON converter',
        description: 'Basic conversion between XML and JSON',
        category: ToolCategory.CONVERSION,
        icon: 'conversion',
        component: 'XmlJsonTool',
        keywords: ['xml', 'json', 'convert'],
        featured: false
      },
      {
        id: 'list-converter',
        name: 'List converter',
        description: 'List ↔ JSON array converter with trim/unique',
        category: ToolCategory.CONVERSION,
        icon: 'conversion',
        component: 'ListConverterTool',
        keywords: ['list', 'array', 'json'],
        featured: false
      },
      {
        id: 'toml-converter',
        name: 'TOML converters',
        description: 'Convert TOML ↔ JSON and TOML ↔ YAML',
        category: ToolCategory.CONVERSION,
        icon: 'conversion',
        component: 'TomlConverterTool',
        keywords: ['toml', 'yaml', 'json', 'convert'],
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
        id: 'ulid-generator',
        name: 'ULID generator',
        description: 'Universally Unique Lexicographically Sortable Identifier',
        category: ToolCategory.GENERATION,
        icon: 'generation',
        component: 'UlidGeneratorTool',
        keywords: ['ulid', 'id', 'unique'],
        featured: false
      },
      {
        id: 'token-generator',
        name: 'Token generator',
        description: 'Secure random tokens (hex/base64)',
        category: ToolCategory.GENERATION,
        icon: 'generation',
        component: 'TokenGeneratorTool',
        keywords: ['token', 'random', 'secure'],
        featured: false
      },
      {
        id: 'totp-generator',
        name: 'OTP (TOTP) generator',
        description: 'Time-based one-time codes',
        category: ToolCategory.GENERATION,
        icon: 'generation',
        component: 'TotpGeneratorTool',
        keywords: ['otp', 'totp', '2fa'],
        featured: false
      },
      {
        id: 'qr-generator',
        name: 'QR Code generator',
        description: 'Generate QR images (online API)',
        category: ToolCategory.GENERATION,
        icon: 'generation',
        component: 'QrCodeGeneratorTool',
        keywords: ['qr', 'code'],
        featured: false
      },
      {
        id: 'wifi-qr-generator',
        name: 'WiFi QR Code generator',
        description: 'QR for WiFi credentials',
        category: ToolCategory.GENERATION,
        icon: 'generation',
        component: 'WifiQrGeneratorTool',
        keywords: ['wifi', 'qr'],
        featured: false
      },
      {
        id: 'svg-placeholder',
        name: 'SVG placeholder generator',
        description: 'Generate SVG placeholders',
        category: ToolCategory.GENERATION,
        icon: 'generation',
        component: 'SvgPlaceholderTool',
        keywords: ['svg', 'placeholder'],
        featured: false
      },
      {
        id: 'random-port',
        name: 'Random port generator',
        description: 'Generate a random port (1024-65535)',
        category: ToolCategory.GENERATION,
        icon: 'generation',
        component: 'RandomPortTool',
        keywords: ['port', 'random'],
        featured: false
      },
      {
        id: 'basic-auth-generator',
        name: 'Basic auth generator',
        description: 'Authorization header value',
        category: ToolCategory.GENERATION,
        icon: 'generation',
        component: 'BasicAuthGeneratorTool',
        keywords: ['basic', 'auth', 'header'],
        featured: false
      },
      {
        id: 'open-graph-meta',
        name: 'Open Graph meta generator',
        description: 'Generate Open Graph and Twitter tags',
        category: ToolCategory.GENERATION,
        icon: 'generation',
        component: 'OpenGraphMetaTool',
        keywords: ['open graph', 'og', 'meta', 'twitter'],
        featured: false
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
        id: 'ipv4-subnet',
        name: 'IPv4 subnet calculator',
        description: 'CIDR parsing, network/broadcast/usable/hosts',
        category: ToolCategory.NETWORK,
        icon: 'network',
        component: 'Ipv4SubnetTool',
        keywords: ['ipv4', 'subnet', 'cidr', 'network'],
        featured: false
      },
      {
        id: 'ipv4-converter',
        name: 'IPv4 address converter',
        description: 'Dotted decimal ↔ integer ↔ binary',
        category: ToolCategory.NETWORK,
        icon: 'network',
        component: 'Ipv4ConverterTool',
        keywords: ['ipv4', 'converter', 'binary'],
        featured: false
      },
      {
        id: 'ipv4-range',
        name: 'IPv4 range expander',
        description: 'Expand start–end range (cap 4096)',
        category: ToolCategory.NETWORK,
        icon: 'network',
        component: 'Ipv4RangeTool',
        keywords: ['ipv4', 'range'],
        featured: false
      },
      {
        id: 'mac-lookup',
        name: 'MAC address lookup',
        description: 'Normalize and inspect flags (no vendor DB)',
        category: ToolCategory.NETWORK,
        icon: 'network',
        component: 'MacLookupTool',
        keywords: ['mac', 'address', 'oui'],
        featured: false
      },
      {
        id: 'mac-generator',
        name: 'MAC address generator',
        description: 'Generate unicast/multicast, locally-administered',
        category: ToolCategory.NETWORK,
        icon: 'network',
        component: 'MacGeneratorTool',
        keywords: ['mac', 'generate'],
        featured: false
      },
      {
        id: 'ipv6-ula',
        name: 'IPv6 ULA generator',
        description: 'Generate RFC4193 ULA /48 prefix',
        category: ToolCategory.NETWORK,
        icon: 'network',
        component: 'Ipv6UlaTool',
        keywords: ['ipv6', 'ula', 'rfc4193'],
        featured: false
      },
      {
        id: 'user-agent-parser',
        name: 'User-agent parser',
        description: 'Basic browser/engine/OS detection',
        category: ToolCategory.NETWORK,
        icon: 'network',
        component: 'UserAgentParserTool',
        keywords: ['user-agent', 'parser'],
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
        id: 'git-cheatsheet',
        name: 'Git cheatsheet',
        description: 'Frequently used Git commands',
        category: ToolCategory.DEV,
        icon: 'dev',
        component: 'GitCheatsheetTool',
        keywords: ['git', 'cheatsheet'],
        featured: false
      },
      {
        id: 'crontab-generator',
        name: 'Crontab generator',
        description: 'Create cron expressions with examples',
        category: ToolCategory.DEV,
        icon: 'dev',
        component: 'CrontabGeneratorTool',
        keywords: ['cron', 'crontab'],
        featured: false
      },
      {
        id: 'json-prettify',
        name: 'JSON prettify and format',
        description: 'Pretty-print and minify JSON',
        category: ToolCategory.DEV,
        icon: 'dev',
        component: 'JsonPrettifyTool',
        keywords: ['json', 'format'],
        featured: false
      },
      {
        id: 'sql-formatter',
        name: 'SQL prettify and format',
        description: 'Indent keywords and line-break clauses',
        category: ToolCategory.DEV,
        icon: 'dev',
        component: 'SqlFormatterTool',
        keywords: ['sql', 'format'],
        featured: false
      },
      {
        id: 'chmod-calculator',
        name: 'Chmod calculator',
        description: 'Calculate Unix permissions',
        category: ToolCategory.DEV,
        icon: 'dev',
        component: 'ChmodCalculatorTool',
        keywords: ['chmod', 'permissions'],
        featured: false
      },
      {
        id: 'docker-cheatsheet',
        name: 'Docker cheatsheet',
        description: 'Essential Docker commands',
        category: ToolCategory.DEV,
        icon: 'dev',
        component: 'DockerCheatsheetTool',
        keywords: ['docker', 'cheatsheet'],
        featured: false
      },
      {
        id: 'docker-run-to-compose',
        name: 'Docker run → Compose',
        description: 'Convert docker run to docker-compose YAML',
        category: ToolCategory.DEV,
        icon: 'dev',
        component: 'DockerRunToComposeTool',
        keywords: ['docker', 'compose', 'convert'],
        featured: false
      },
      {
        id: 'xml-formatter',
        name: 'XML formatter',
        description: 'Pretty-print and minify XML',
        category: ToolCategory.DEV,
        icon: 'dev',
        component: 'XmlFormatterTool',
        keywords: ['xml', 'format'],
        featured: false
      },
      {
        id: 'yaml-formatter',
        name: 'YAML prettify and format',
        description: 'Format, minify, validate YAML',
        category: ToolCategory.DEV,
        icon: 'dev',
        component: 'YamlFormatterTool',
        keywords: ['yaml', 'format'],
        featured: false
      },
      {
        id: 'json-diff',
        name: 'JSON diff',
        description: 'Compare two JSON objects',
        category: ToolCategory.DEV,
        icon: 'dev',
        component: 'JsonDiffTool',
        keywords: ['json', 'diff', 'compare'],
        featured: false
      },
      {
        id: 'url-parser',
        name: 'URL parser',
        description: 'Inspect URL components and query params',
        category: ToolCategory.DEV,
        icon: 'dev',
        component: 'UrlParserTool',
        keywords: ['url', 'parse'],
        featured: false
      },
      {
        id: 'http-status-codes',
        name: 'HTTP status codes',
        description: 'Search common HTTP codes',
        category: ToolCategory.DEV,
        icon: 'dev',
        component: 'HttpStatusCodesTool',
        keywords: ['http', 'status', 'codes'],
        featured: false
      },
      {
        id: 'mime-types',
        name: 'MIME types',
        description: 'Lookup by extension or type',
        category: ToolCategory.DEV,
        icon: 'dev',
        component: 'MimeTypesTool',
        keywords: ['mime', 'content-type'],
        featured: false
      },
      
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
    console.log('ToolDiscoveryService.searchTools called with query:', query); // Debug log
    const tools = await this.discoverTools();
    console.log('Available tools:', tools.length); // Debug log
    const searchTerm = query.toLowerCase();
    
    const results = tools.filter(tool => 
      tool.name.toLowerCase().includes(searchTerm) ||
      tool.description.toLowerCase().includes(searchTerm) ||
      tool.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    );
    
    console.log('Filtered results:', results.length); // Debug log
    return results;
  }

  // Reset cache
  static resetCache(): void {
    this.discoveredTools = [];
  }
}
