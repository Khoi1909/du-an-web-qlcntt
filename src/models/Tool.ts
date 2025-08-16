// Tool interface định nghĩa cấu trúc của một công cụ
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  component: string;
  keywords: string[];
  featured: boolean;
}

// Enum các category của tools
export enum ToolCategory {
  ENCODING = 'encoding',
  CONVERSION = 'conversion',
  GENERATION = 'generation',
  STRING = 'string',
  API = 'api',
  REGEX = 'regex',
  CRYPTO = 'crypto',
  DATETIME = 'datetime',
  NETWORK = 'network',
  DEV = 'dev'
}

// Theme mode
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark'
}

// Navigation item
export interface NavItem {
  id: string;
  label: string;
  category: ToolCategory;
  tools: Tool[];
  icon: string;
  expanded?: boolean;
}
