import { Base64Tool } from '@/components/Base64Tool';
import { JWTTool } from '@/components/JWTTool';
import { JsonYamlTool } from '@/components/JsonYamlTool';
import { UUIDTool } from '@/components/UUIDTool';
import { HashTool } from '@/components/HashTool';
import { StringTool } from '@/components/StringTool';
import { ApiTool } from '@/components/ApiTool';
import { CsvJsonTool } from '@/components/CsvJsonTool';
import { TimestampTool } from '@/components/TimestampTool';
import { UrlEncoderTool } from '@/components/UrlEncoderTool';
import { HtmlEntitiesTool } from '@/components/HtmlEntitiesTool';
import { BaseConverterTool } from '@/components/BaseConverterTool';
import { TextToBinaryTool } from '@/components/TextToBinaryTool';
import { TextToUnicodeTool } from '@/components/TextToUnicodeTool';
import { RomanNumeralTool } from '@/components/RomanNumeralTool';
import { ColorConverterTool } from '@/components/ColorConverterTool';
import { MarkdownToHtmlTool } from '@/components/MarkdownToHtmlTool';
import { NatoAlphabetTool } from '@/components/NatoAlphabetTool';
import { XmlJsonTool } from '@/components/XmlJsonTool';
import { ListConverterTool } from '@/components/ListConverterTool';
import { TomlConverterTool } from '@/components/TomlConverterTool';
import { CaseConverterTool } from '@/components/CaseConverterTool';
import { SlugifyTool } from '@/components/SlugifyTool';
import { EmailNormalizerTool } from '@/components/EmailNormalizerTool';
import { PasswordStrengthTool } from '@/components/PasswordStrengthTool';
 
import { HmacTool } from '@/components/HmacTool';
import { EncryptDecryptTool } from '@/components/EncryptDecryptTool';
import { BcryptTool } from '@/components/BcryptTool';
import { RSAKeyPairTool } from '@/components/RSAKeyPairTool';
import { BIP39Tool } from '@/components/BIP39Tool';
import { PDFSignatureCheckerTool } from '@/components/PDFSignatureCheckerTool';
import { Ipv4SubnetTool } from '@/components/Ipv4SubnetTool';
import { Ipv4ConverterTool } from '@/components/Ipv4ConverterTool';
import { Ipv4RangeTool } from '@/components/Ipv4RangeTool';
import { MacLookupTool } from '@/components/MacLookupTool';
import { MacGeneratorTool } from '@/components/MacGeneratorTool';
import { Ipv6UlaTool } from '@/components/Ipv6UlaTool';
import { UserAgentParserTool } from '@/components/UserAgentParserTool';
import { GitCheatsheetTool } from '@/components/GitCheatsheetTool';
import { CrontabGeneratorTool } from '@/components/CrontabGeneratorTool';
import { JsonPrettifyTool } from '@/components/JsonPrettifyTool';
import { SqlFormatterTool } from '@/components/SqlFormatterTool';
import { ChmodCalculatorTool } from '@/components/ChmodCalculatorTool';
import { DockerCheatsheetTool } from '@/components/DockerCheatsheetTool';
import { DockerRunToComposeTool } from '@/components/DockerRunToComposeTool';
import { XmlFormatterTool } from '@/components/XmlFormatterTool';
import { YamlFormatterTool } from '@/components/YamlFormatterTool';
import { JsonDiffTool } from '@/components/JsonDiffTool';
import { UrlParserTool } from '@/components/UrlParserTool';
import { HttpStatusCodesTool } from '@/components/HttpStatusCodesTool';
import { MimeTypesTool } from '@/components/MimeTypesTool';
import { UlidGeneratorTool } from '@/components/UlidGeneratorTool';
import { TokenGeneratorTool } from '@/components/TokenGeneratorTool';
import { TotpGeneratorTool } from '@/components/TotpGeneratorTool';
import { QrCodeGeneratorTool } from '@/components/QrCodeGeneratorTool';
import { WifiQrGeneratorTool } from '@/components/WifiQrGeneratorTool';
import { SvgPlaceholderTool } from '@/components/SvgPlaceholderTool';
import { RandomPortTool } from '@/components/RandomPortTool';
import { BasicAuthGeneratorTool } from '@/components/BasicAuthGeneratorTool';
import { OpenGraphMetaTool } from '@/components/OpenGraphMetaTool';

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
  ToolRegistry.register('url-encoder', UrlEncoderTool);
  ToolRegistry.register('html-entities', HtmlEntitiesTool);
  ToolRegistry.register('base-converter', BaseConverterTool);
  ToolRegistry.register('text-to-binary', TextToBinaryTool);
  ToolRegistry.register('text-to-unicode', TextToUnicodeTool);
  ToolRegistry.register('roman-numeral', RomanNumeralTool);
  ToolRegistry.register('color-converter', ColorConverterTool);
  ToolRegistry.register('markdown-to-html', MarkdownToHtmlTool);
  ToolRegistry.register('nato-alphabet', NatoAlphabetTool);
  ToolRegistry.register('xml-json', XmlJsonTool);
  ToolRegistry.register('list-converter', ListConverterTool);
  ToolRegistry.register('toml-converter', TomlConverterTool);
  ToolRegistry.register('case-converter', CaseConverterTool);
  ToolRegistry.register('slugify', SlugifyTool);
  ToolRegistry.register('email-normalizer', EmailNormalizerTool);
  ToolRegistry.register('password-strength', PasswordStrengthTool);
  ToolRegistry.register('hmac-generator', HmacTool);
  ToolRegistry.register('encrypt-decrypt', EncryptDecryptTool);
  ToolRegistry.register('bcrypt-demo', BcryptTool);
  ToolRegistry.register('rsa-keypair', RSAKeyPairTool);
  ToolRegistry.register('bip39-generator', BIP39Tool);
  ToolRegistry.register('pdf-signature-checker', PDFSignatureCheckerTool);
  // Network
  ToolRegistry.register('ipv4-subnet', Ipv4SubnetTool);
  ToolRegistry.register('ipv4-converter', Ipv4ConverterTool);
  ToolRegistry.register('ipv4-range', Ipv4RangeTool);
  ToolRegistry.register('mac-lookup', MacLookupTool);
  ToolRegistry.register('mac-generator', MacGeneratorTool);
  ToolRegistry.register('ipv6-ula', Ipv6UlaTool);
  ToolRegistry.register('user-agent-parser', UserAgentParserTool);
  // Development
  ToolRegistry.register('git-cheatsheet', GitCheatsheetTool);
  ToolRegistry.register('crontab-generator', CrontabGeneratorTool);
  ToolRegistry.register('json-prettify', JsonPrettifyTool);
  ToolRegistry.register('sql-formatter', SqlFormatterTool);
  ToolRegistry.register('chmod-calculator', ChmodCalculatorTool);
  ToolRegistry.register('docker-cheatsheet', DockerCheatsheetTool);
  ToolRegistry.register('docker-run-to-compose', DockerRunToComposeTool);
  ToolRegistry.register('xml-formatter', XmlFormatterTool);
  ToolRegistry.register('yaml-formatter', YamlFormatterTool);
  ToolRegistry.register('json-diff', JsonDiffTool);
  ToolRegistry.register('url-parser', UrlParserTool);
  ToolRegistry.register('http-status-codes', HttpStatusCodesTool);
  ToolRegistry.register('mime-types', MimeTypesTool);
  // Generation
  ToolRegistry.register('ulid-generator', UlidGeneratorTool);
  ToolRegistry.register('token-generator', TokenGeneratorTool);
  ToolRegistry.register('totp-generator', TotpGeneratorTool);
  ToolRegistry.register('qr-generator', QrCodeGeneratorTool);
  ToolRegistry.register('wifi-qr-generator', WifiQrGeneratorTool);
  ToolRegistry.register('svg-placeholder', SvgPlaceholderTool);
  ToolRegistry.register('random-port', RandomPortTool);
  ToolRegistry.register('basic-auth-generator', BasicAuthGeneratorTool);
  ToolRegistry.register('open-graph-meta', OpenGraphMetaTool);
}

// Khởi tạo registry khi import
registerAllTools();
