import { Tool, ToolCategory } from './Tool';
import { getIcon } from '@/utils/icons';

// Sample tools data
export const TOOLS_DATA: Tool[] = [
  // Encoding Tools
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
  
  // Conversion Tools
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
  
  // Generation Tools
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUIDs (v1, v4, v5)',
    category: ToolCategory.GENERATION,
    icon: 'uuid',
    component: 'UUIDTool',
    keywords: ['uuid', 'generate', 'identifier', 'random'],
    featured: true
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert between timestamp formats',
    category: ToolCategory.DATETIME,
    icon: 'timestamp',
    component: 'TimestampTool',
    keywords: ['timestamp', 'date', 'time', 'unix', 'convert'],
    featured: false
  },
  
  // Crypto Tools
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA1, SHA256 hashes',
    category: ToolCategory.CRYPTO,
    icon: 'hash',
    component: 'HashTool',
    keywords: ['hash', 'md5', 'sha', 'crypto', 'checksum'],
    featured: true
  },
  
  // String Tools
  {
    id: 'string-utilities',
    name: 'String Utilities',
    description: 'Trim, split, escape, and manipulate strings',
    category: ToolCategory.STRING,
    icon: 'stringTool',
    component: 'StringTool',
    keywords: ['string', 'trim', 'split', 'escape', 'text'],
    featured: false
  },
  
  // API Tools
  {
    id: 'api-tester',
    name: 'API Tester',
    description: 'Test REST APIs like Postman',
    category: ToolCategory.API,
    icon: 'apiTester',
    component: 'APITool',
    keywords: ['api', 'rest', 'http', 'postman', 'request'],
    featured: true
  },
  
  // Regex Tools
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and validate regular expressions',
    category: ToolCategory.REGEX,
    icon: 'regexTool',
    component: 'RegexTool',
    keywords: ['regex', 'pattern', 'match', 'test', 'regular expression'],
    featured: true
  }
];

// Get tools by category
export const getToolsByCategory = (category: ToolCategory): Tool[] => {
  return TOOLS_DATA.filter(tool => tool.category === category);
};

// Get featured tools
export const getFeaturedTools = (): Tool[] => {
  return TOOLS_DATA.filter(tool => tool.featured);
};

// Search tools by keyword
export const searchTools = (query: string): Tool[] => {
  const lowerQuery = query.toLowerCase();
  return TOOLS_DATA.filter(tool => 
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
  );
};
