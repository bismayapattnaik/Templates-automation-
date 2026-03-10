export type SectionType = 'hero' | 'features' | 'testimonials' | 'cta' | 'pricing' | 'footer' | 'stats' | 'about';

export type DesignInputType = 'screenshot' | 'url';

export type ColorScheme = 3 | 4;

export interface DesignInput {
  type: DesignInputType;
  data: string; // base64 for screenshot, URL string for URL input
}

export interface TemplateConfig {
  sectionType: SectionType;
  templateName: string;
  colorScheme: ColorScheme;
  companyVibe?: string;
}

export interface GenerateTemplateRequest {
  designInput: DesignInput;
  currentHtml: string;
  templateConfig: TemplateConfig;
}

export interface ColorVariables {
  [key: string]: {
    hex: string;
    variable: string;
    usage: string;
  };
}

export interface FontVariables {
  heading: {
    name: string;
    variable: string;
  };
  body: {
    name: string;
    variable: string;
  };
}

export interface Variables {
  colors: ColorVariables;
  fonts: FontVariables;
  [key: string]: any;
}

export interface SOPValidationResult {
  sop: string;
  passed: boolean;
  violations?: {
    severity: 'error' | 'warning';
    violation: string;
    location?: string;
    suggestion?: string;
  }[];
}

export interface ValidationReport {
  passed: boolean;
  sopResults: {
    [key: string]: SOPValidationResult;
  };
  errors: {
    sop: string;
    violation: string;
    location?: string;
    suggestion?: string;
  }[];
  warnings: {
    sop: string;
    message: string;
  }[];
}

export interface TemplateOutput {
  html: string;
  css: string;
  js: string;
  variables: Variables;
  metadata: {
    sectionId?: string;
    elementsCount?: number;
    createdAt?: string;
  };
}

export interface GenerateTemplateResponse {
  success: boolean;
  data?: {
    html: string;
    css: string;
    js: string;
    variables: Variables;
    validation: ValidationReport;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
    sopViolations?: Array<{
      sop: string;
      violation: string;
      location?: string;
      suggestion?: string;
    }>;
  };
  metadata?: {
    processingTime: number;
    modelUsed: string;
    tokenUsage?: {
      input: number;
      output: number;
    };
  };
}

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string | any[];
}

export interface ImageContent {
  type: 'image';
  source: {
    type: 'base64' | 'url';
    media_type?: string;
    data?: string;
    url?: string;
  };
}

export interface TextContent {
  type: 'text';
  text: string;
}
