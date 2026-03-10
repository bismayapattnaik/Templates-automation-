# Template Automation System - Complete Implementation Guide

## 🎯 Overview
This guide walks you through building a complete **Design-to-Template** automation system from scratch using Express.js backend and Claude Haiku 4.5 API.

---

# PHASE 1: BACKEND SETUP (Steps 1-5)

## STEP 1: Install Dependencies

```bash
cd /home/user/Templates-automation-

# Install dependencies
npm install

# Verify installation
npm list
```

**Expected output:**
```
templates-automation@1.0.0
├── express@4.18.2
├── @anthropic-ai/sdk@0.78.0
├── multer@1.4.5-lts.1
├── dotenv@16.4.5
├── axios@1.7.4
└── sharp@0.33.5
```

---

## STEP 2: Create Backend File Structure

```bash
# Create directory structure
mkdir -p backend/src/{config,controllers,services,types,utils,middleware}
mkdir -p frontend/src/{components,pages,styles,utils}
mkdir -p uploads
mkdir -p public
touch backend/src/index.ts
touch backend/src/config/environment.ts
touch backend/src/config/anthropic.ts
touch backend/src/services/claude.service.ts
touch backend/src/services/imageProcessor.ts
touch backend/src/controllers/template.controller.ts
touch backend/src/middleware/errorHandler.ts
touch backend/src/types/index.ts

# Create frontend files
touch frontend/src/index.html
touch frontend/src/styles/main.css
touch frontend/src/main.js
touch public/index.html
```

**Final structure:**
```
Templates-automation-/
├── backend/
│   └── src/
│       ├── config/
│       │   ├── environment.ts
│       │   └── anthropic.ts
│       ├── controllers/
│       │   └── template.controller.ts
│       ├── services/
│       │   ├── claude.service.ts
│       │   └── imageProcessor.ts
│       ├── middleware/
│       │   └── errorHandler.ts
│       ├── types/
│       │   └── index.ts
│       ├── utils/
│       │   └── logger.ts
│       └── index.ts
├── frontend/
│   └── src/
│       ├── main.js
│       ├── index.html
│       └── styles/
│           └── main.css
├── public/
│   └── index.html
├── uploads/
├── .env (created)
├── package.json (updated)
└── SYSTEM_BLUEPRINT.md (created)
```

---

## STEP 3: Configure Environment & Types

### File: `backend/src/config/environment.ts`

```typescript
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',

  // Claude
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  CLAUDE_MODEL: process.env.CLAUDE_MODEL || 'claude-haiku-4.5',
  CLAUDE_MAX_TOKENS: parseInt(process.env.CLAUDE_MAX_TOKENS || '3000'),
  CLAUDE_TIMEOUT: parseInt(process.env.CLAUDE_TIMEOUT || '30000'),

  // File Upload
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
  MAX_IMAGE_WIDTH: parseInt(process.env.MAX_IMAGE_WIDTH || '4096'),
  MAX_IMAGE_HEIGHT: parseInt(process.env.MAX_IMAGE_HEIGHT || '4096'),
  ALLOWED_MIMETYPES: (process.env.ALLOWED_MIMETYPES || 'image/jpeg,image/png,image/webp').split(','),

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // API Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
};

// Validation
if (!config.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is required in .env file');
}

export default config;
```

### File: `backend/src/types/index.ts`

```typescript
export interface GeneratedTemplate {
  html: string;
  css: string;
  js: string;
  variables_list: string[];
  variables_reference: Record<string, VariableInfo>;
}

export interface VariableInfo {
  type: 'text' | 'image';
  element: string;
  purpose: string;
  example?: string;
}

export interface GenerateSectionRequest {
  design_image: Express.Multer.File;
  section_type: string;
  style_preference: 'professional' | 'playful';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  timestamp: string;
}

export type SectionType =
  | 'hero'
  | 'stats'
  | 'course-list'
  | 'testimonial'
  | 'about'
  | 'lead-gen'
  | 'course-store'
  | 'course-hero'
  | 'course-plan'
  | 'circular-benefits'
  | 'course-feedback';

export type StylePreference = 'professional' | 'playful';
```

### File: `backend/src/utils/logger.ts`

```typescript
import config from '../config/environment';

type LogLevel = 'info' | 'error' | 'warn' | 'debug';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = LOG_LEVELS[config.LOG_LEVEL as LogLevel] || LOG_LEVELS.info;

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

export const logger = {
  info: (message: string, data?: any) => {
    if (currentLevel <= LOG_LEVELS.info) {
      console.log(`${colors.blue}[INFO]${colors.reset} ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  },

  error: (message: string, error?: any) => {
    if (currentLevel <= LOG_LEVELS.error) {
      console.error(`${colors.red}[ERROR]${colors.reset} ${message}`, error || '');
    }
  },

  warn: (message: string, data?: any) => {
    if (currentLevel <= LOG_LEVELS.warn) {
      console.warn(`${colors.yellow}[WARN]${colors.reset} ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  },

  debug: (message: string, data?: any) => {
    if (currentLevel <= LOG_LEVELS.debug) {
      console.log(`${colors.gray}[DEBUG]${colors.reset} ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  },
};
```

---

## STEP 4: Create Claude Service

### File: `backend/src/config/anthropic.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';
import config from './environment';

const client = new Anthropic({
  apiKey: config.ANTHROPIC_API_KEY,
});

export default client;
```

### File: `backend/src/services/claude.service.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';
import config from '../config/environment';
import { GeneratedTemplate } from '../types/index';
import { logger } from '../utils/logger';

interface ClaudeServiceOptions {
  imageBase64: string;
  imageMimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  sectionType: string;
  stylePreference: 'professional' | 'playful';
}

const SOP_PROMPT = `You are a senior frontend template engineer. Your task is to analyze a design screenshot and generate production-ready HTML following strict SOPs.

## RULES YOU MUST FOLLOW:

### 1. ID NAMING (MANDATORY)
- Section ID: sec-[SHORT_ID] (e.g., sec-prof1, sec-a1b2c3)
- Element ID: el-[SHORT_ID]-[descriptor] (e.g., el-prof1-heading)
- Style ID: stl-[SHORT_ID] (same as section)
- Script ID: scr-[SHORT_ID] (same as section)
- Every element MUST have both id and data-ai-id with identical values

### 2. DATA ATTRIBUTES (MANDATORY)
Every element must have:
- id="el-xxxx"
- data-ai-id="el-xxxx" (same as id)
- data-type="text|html|image|list" (appropriate type)

Example:
<h1 id="el-prof1-heading" data-ai-id="el-prof1-heading" data-type="text">%%HEADING%%</h1>

### 3. VARIABLES (ALL TEXT MUST USE VARIABLES)
Format: %%VARIABLE_NAME%%
Rules:
- UPPERCASE only
- Semantic names
- Pattern: [SECTION_NAME]_[ELEMENT_NAME]

Examples:
- %%HERO_HEADING%%
- %%HERO_DESCRIPTION%%
- %%HERO_CTA_TEXT%%
- %%HERO_IMAGE1%%

### 4. CSS VARIABLES ONLY (NO HARDCODING)
Available variables from global style:
Colors:
- var(--color-primary)
- var(--color-accent1)
- var(--color-accent2)
- var(--color-accent3)
- var(--color-neutral-lightest)
- var(--color-neutral-lighter)
- var(--color-neutral-light)
- var(--color-neutral)
- var(--color-neutral-dark)
- var(--color-neutral-darker)
- var(--color-neutral-darkest)

Semantic variables:
- var(--button-primary-bg)
- var(--button-secondary-bg)
- var(--card-bg)
- var(--heading-color)
- var(--body-color)
- var(--link-color)

Typography:
- var(--font-heading)
- var(--font-body)

### 5. PROFESSIONAL DESIGN RULES
- border-radius: 0px (sharp corners)
- NO hardcoded colors (use var(--color-*))
- NO hardcoded fonts (use var(--font-*))
- Hover states: shadow elevation only (NO transform, scale, rotate)
- NO background images or gradients on sections
- Solid color backgrounds only

### 6. RESPONSIVE DESIGN
Include @media queries:
- @media (max-width: 1024px)
- @media (max-width: 640px)

### 7. COLOR DISTRIBUTION (50-25-12-8-5 Rule)
- 50% Neutral (backgrounds, text, borders)
- 25% Primary (main CTAs, headings)
- 12% Accent1 (secondary elements, badges)
- 8% Accent2 (tertiary elements)
- 5% Accent3 (special highlights, if defined)

### 8. JAVASCRIPT RULES
- Design-only code (animations, visual effects)
- NO %> closing tags
- NO button click handlers
- NO form submissions
- NO navigation logic
- NO API calls
- Wrap in IIFE: (function() { ... })();

### 9. HTML STRUCTURE
\`\`\`html
<style id="stl-xxxx" data-ai-id="stl-xxxx">
  /* CSS here */
</style>

<section id="sec-xxxx" data-ai-id="sec-xxxx" data-section-type="[type]">
  <!-- HTML elements with id, data-ai-id, data-type -->
</section>

<script id="scr-xxxx" data-ai-id="scr-xxxx">
  // JavaScript here
</script>
\`\`\`

## TASK:
1. Analyze the design screenshot provided
2. Identify layout structure, hierarchy, sections, cards
3. Generate HTML with proper attributes and variables
4. Create scoped CSS using only variables
5. Add design-only JavaScript for interactions
6. Return JSON with html, css, js, variables_list, variables_reference

## OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "html": "...",
  "css": "...",
  "js": "...",
  "variables_list": ["%%VAR1%%", "%%VAR2%%", ...],
  "variables_reference": {
    "%%VAR1%%": {
      "type": "text",
      "element": "h1",
      "purpose": "...",
      "example": "..."
    }
  }
}

## IMPORTANT:
- Every element MUST have id and data-ai-id
- All text MUST be in %%VARIABLE%% format
- NO hardcoded colors or fonts
- border-radius: 0px on all elements
- Include hover states without transforms
- Include responsive breakpoints
`;

export class ClaudeService {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async generateTemplate(options: ClaudeServiceOptions): Promise<GeneratedTemplate> {
    const { imageBase64, imageMimeType, sectionType, stylePreference } = options;

    logger.info('Starting template generation', { sectionType, stylePreference });

    try {
      const prompt = `${SOP_PROMPT}

The design is for a "${sectionType}" section with "${stylePreference}" aesthetic.

Please analyze the provided screenshot and generate the HTML template.`;

      const message = await this.client.messages.create({
        model: config.CLAUDE_MODEL,
        max_tokens: config.CLAUDE_MAX_TOKENS,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: imageMimeType,
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
      });

      // Extract text content
      const responseText = message.content
        .filter((block) => block.type === 'text')
        .map((block) => (block as Anthropic.TextBlock).text)
        .join('\n');

      logger.debug('Claude response received', { length: responseText.length });

      // Parse JSON response
      let parsedResponse: GeneratedTemplate;
      try {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : responseText;
        parsedResponse = JSON.parse(jsonString);
      } catch (parseError) {
        logger.error('Failed to parse Claude response as JSON', parseError);
        throw new Error('Invalid response format from Claude');
      }

      // Validate response structure
      this.validateTemplate(parsedResponse);

      logger.info('Template generated successfully');
      return parsedResponse;
    } catch (error) {
      logger.error('Template generation failed', error);
      throw error;
    }
  }

  private validateTemplate(template: any): void {
    const required = ['html', 'css', 'js', 'variables_list', 'variables_reference'];
    const missing = required.filter((key) => !(key in template));

    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    if (typeof template.html !== 'string' || template.html.length === 0) {
      throw new Error('HTML must be a non-empty string');
    }

    if (typeof template.css !== 'string' || template.css.length === 0) {
      throw new Error('CSS must be a non-empty string');
    }

    if (!Array.isArray(template.variables_list)) {
      throw new Error('variables_list must be an array');
    }

    if (typeof template.variables_reference !== 'object') {
      throw new Error('variables_reference must be an object');
    }
  }
}

// Create singleton instance
const claudeService = new ClaudeService(config.ANTHROPIC_API_KEY);
export default claudeService;
```

---

## STEP 5: Create Image Processing Service

### File: `backend/src/services/imageProcessor.ts`

```typescript
import sharp from 'sharp';
import { logger } from '../utils/logger';
import config from '../config/environment';

export class ImageProcessor {
  async processScreenshot(filePath: string): Promise<{
    base64: string;
    mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  }> {
    try {
      logger.info('Processing screenshot', { filePath });

      // Read file
      let buffer = await sharp(filePath).toBuffer();

      // Get metadata
      const metadata = await sharp(filePath).metadata();
      logger.debug('Image metadata', { width: metadata.width, height: metadata.height, format: metadata.format });

      // Resize if too large
      if (
        metadata.width &&
        metadata.height &&
        (metadata.width > config.MAX_IMAGE_WIDTH || metadata.height > config.MAX_IMAGE_HEIGHT)
      ) {
        logger.info('Resizing oversized image');
        buffer = await sharp(buffer)
          .resize(config.MAX_IMAGE_WIDTH, config.MAX_IMAGE_HEIGHT, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .toBuffer();
      }

      // Convert to base64
      const base64 = buffer.toString('base64');

      // Determine MIME type
      let mimeType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg';
      if (metadata.format === 'png') {
        mimeType = 'image/png';
      } else if (metadata.format === 'webp') {
        mimeType = 'image/webp';
      }

      logger.info('Image processed successfully', { mimeType, size: base64.length });
      return { base64, mimeType };
    } catch (error) {
      logger.error('Image processing failed', error);
      throw new Error('Failed to process image');
    }
  }

  validateMimeType(mimeType: string): boolean {
    return config.ALLOWED_MIMETYPES.includes(mimeType);
  }

  validateFileSize(fileSize: number): boolean {
    return fileSize <= config.MAX_FILE_SIZE;
  }
}

export default new ImageProcessor();
```

---

## STEP 6: Create Controller

### File: `backend/src/controllers/template.controller.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import claudeService from '../services/claude.service';
import imageProcessor from '../services/imageProcessor';
import { GenerateSectionRequest, ApiResponse, GeneratedTemplate, SectionType } from '../types/index';
import { logger } from '../utils/logger';
import fs from 'fs/promises';

const VALID_SECTION_TYPES: SectionType[] = [
  'hero',
  'stats',
  'course-list',
  'testimonial',
  'about',
  'lead-gen',
  'course-store',
  'course-hero',
  'course-plan',
  'circular-benefits',
  'course-feedback',
];

export class TemplateController {
  async generateSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file as Express.Multer.File;
      const { section_type, style_preference } = req.body;

      // Validate inputs
      if (!file) {
        res.status(400).json({
          success: false,
          error: { message: 'No image file provided', code: 'NO_FILE' },
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
        return;
      }

      if (!section_type || !VALID_SECTION_TYPES.includes(section_type)) {
        res.status(400).json({
          success: false,
          error: {
            message: `Invalid section type. Valid types: ${VALID_SECTION_TYPES.join(', ')}`,
            code: 'INVALID_SECTION_TYPE',
          },
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
        return;
      }

      if (style_preference !== 'professional' && style_preference !== 'playful') {
        res.status(400).json({
          success: false,
          error: { message: 'style_preference must be "professional" or "playful"', code: 'INVALID_STYLE' },
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
        return;
      }

      // Validate file
      if (!imageProcessor.validateMimeType(file.mimetype)) {
        await fs.unlink(file.path);
        res.status(400).json({
          success: false,
          error: { message: 'Invalid file type. Allowed: JPEG, PNG, WebP', code: 'INVALID_FILE_TYPE' },
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
        return;
      }

      if (!imageProcessor.validateFileSize(file.size)) {
        await fs.unlink(file.path);
        res.status(400).json({
          success: false,
          error: { message: 'File size exceeds maximum (5MB)', code: 'FILE_TOO_LARGE' },
          timestamp: new Date().toISOString(),
        } as ApiResponse<null>);
        return;
      }

      // Process image
      const { base64, mimeType } = await imageProcessor.processScreenshot(file.path);

      // Generate template
      const template = await claudeService.generateTemplate({
        imageBase64: base64,
        imageMimeType: mimeType,
        sectionType,
        stylePreference,
      });

      // Clean up uploaded file
      await fs.unlink(file.path);

      // Return response
      res.status(200).json({
        success: true,
        data: template,
        timestamp: new Date().toISOString(),
      } as ApiResponse<GeneratedTemplate>);

      logger.info('Section generated successfully');
    } catch (error) {
      // Clean up file on error
      const file = req.file as Express.Multer.File;
      if (file?.path) {
        try {
          await fs.unlink(file.path);
        } catch (e) {
          logger.warn('Failed to clean up file', e);
        }
      }
      next(error);
    }
  }

  async health(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        claude_model: process.env.CLAUDE_MODEL || 'claude-haiku-4.5',
        environment: process.env.NODE_ENV || 'development',
      },
    });
  }
}

export default new TemplateController();
```

---

## STEP 7: Create Error Handler & Middleware

### File: `backend/src/middleware/errorHandler.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class ErrorHandler extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Request error', err);

  if (err instanceof ErrorHandler) {
    res.status(err.statusCode).json({
      success: false,
      error: { message: err.message, code: err.code },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
    timestamp: new Date().toISOString(),
  });
};
```

---

## STEP 8: Create Express Server

### File: `backend/src/index.ts`

```typescript
import express, { Express } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/environment';
import templateController from './controllers/template.controller';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../frontend/src')));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (config.ALLOWED_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Routes
app.get('/api/health', templateController.health);
app.post('/api/generate-section', upload.single('design_image'), templateController.generateSection.bind(templateController));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.PORT;
const HOST = config.HOST;

app.listen(PORT, () => {
  logger.info(`Server running at http://${HOST}:${PORT}`);
  logger.info(`Environment: ${config.NODE_ENV}`);
  logger.info(`Claude Model: ${config.CLAUDE_MODEL}`);
});

export default app;
```

---

# PHASE 2: FRONTEND SETUP (Steps 9-11)

## STEP 9: Create Frontend HTML

### File: `public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Template Automation - Design to Code</title>
    <link rel="stylesheet" href="styles/main.css" />
  </head>
  <body>
    <div class="app-container">
      <!-- Header -->
      <header class="header">
        <div class="header-content">
          <h1 class="logo">🎨 Template Automation</h1>
          <p class="tagline">Convert design screenshots into production-ready HTML templates</p>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Left Panel: Input Form -->
        <section class="panel left-panel">
          <h2>Design Input</h2>

          <form id="generatorForm" class="form">
            <!-- File Upload -->
            <div class="form-group">
              <label for="designImage">Upload Design Screenshot</label>
              <div id="dropZone" class="drop-zone">
                <svg class="drop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p class="drop-text">Drag and drop your screenshot here or click to browse</p>
                <input
                  id="designImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style="display: none"
                />
              </div>
              <div id="previewContainer" class="preview-container" style="display: none">
                <img id="imagePreview" alt="Preview" class="preview-image" />
                <button type="button" id="removeImage" class="remove-button">✕</button>
              </div>
            </div>

            <!-- Section Type -->
            <div class="form-group">
              <label for="sectionType">Section Type</label>
              <select id="sectionType" name="section_type" required>
                <option value="">-- Select Section Type --</option>
                <option value="hero">Hero Section</option>
                <option value="stats">Stats Section</option>
                <option value="course-list">Course List</option>
                <option value="testimonial">Testimonials</option>
                <option value="about">About Section</option>
                <option value="lead-gen">Lead Generation</option>
                <option value="course-store">Course Store</option>
                <option value="course-hero">Course Hero</option>
                <option value="course-plan">Course Plan</option>
                <option value="circular-benefits">Circular Benefits</option>
                <option value="course-feedback">Course Feedback</option>
              </select>
            </div>

            <!-- Style Preference -->
            <div class="form-group">
              <label>Style Preference</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input type="radio" name="style_preference" value="professional" checked />
                  Professional (Sharp, Minimal)
                </label>
                <label class="radio-label">
                  <input type="radio" name="style_preference" value="playful" />
                  Playful (Rounded, Animated)
                </label>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" id="generateButton" class="btn btn-primary btn-large">
              <span id="buttonText">Generate Template</span>
              <span id="loadingSpinner" class="spinner" style="display: none"></span>
            </button>
          </form>
        </section>

        <!-- Middle Panel: Live Preview -->
        <section class="panel middle-panel">
          <h2>Live Preview</h2>
          <div id="previewPane" class="preview-pane">
            <p class="placeholder-text">Generated template will appear here...</p>
            <iframe id="livePreview" class="preview-frame" style="display: none"></iframe>
          </div>
        </section>

        <!-- Right Panel: Code Display -->
        <section class="panel right-panel">
          <h2>Generated Code</h2>

          <div class="code-tabs">
            <button class="tab-button active" data-tab="html">HTML</button>
            <button class="tab-button" data-tab="css">CSS</button>
            <button class="tab-button" data-tab="js">JavaScript</button>
            <button class="tab-button" data-tab="variables">Variables</button>
          </div>

          <div class="tab-content">
            <div id="html-tab" class="tab-pane active">
              <div class="code-header">
                <h3>HTML</h3>
                <button class="btn-copy" data-copy="html-code" title="Copy HTML">Copy</button>
              </div>
              <pre id="html-code" class="code-block"><code></code></pre>
            </div>

            <div id="css-tab" class="tab-pane">
              <div class="code-header">
                <h3>CSS</h3>
                <button class="btn-copy" data-copy="css-code" title="Copy CSS">Copy</button>
              </div>
              <pre id="css-code" class="code-block"><code></code></pre>
            </div>

            <div id="js-tab" class="tab-pane">
              <div class="code-header">
                <h3>JavaScript</h3>
                <button class="btn-copy" data-copy="js-code" title="Copy JS">Copy</button>
              </div>
              <pre id="js-code" class="code-block"><code></code></pre>
            </div>

            <div id="variables-tab" class="tab-pane">
              <div class="code-header">
                <h3>Variables Reference</h3>
                <button class="btn-copy" data-copy="variables-list" title="Copy Variables">Copy</button>
              </div>
              <pre id="variables-list" class="code-block"><code></code></pre>
            </div>
          </div>

          <div class="download-section" id="downloadSection" style="display: none">
            <button id="downloadHtml" class="btn btn-secondary">Download HTML</button>
            <button id="downloadAll" class="btn btn-secondary">Download All (ZIP)</button>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <p class="footer-text">Status: <span id="statusText">Ready</span></p>
      </footer>

      <!-- Toast Notification -->
      <div id="toast" class="toast" style="display: none"></div>
    </div>

    <script src="main.js"></script>
  </body>
</html>
```

---

## STEP 10: Create Frontend CSS

### File: `public/styles/main.css`

```css
/* ==================== RESET & BASE ==================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  background-color: #f5f5f5;
  color: #2c2c2c;
  height: 100%;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

input,
select,
textarea {
  font-family: inherit;
}

/* ==================== LAYOUT ==================== */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  background: linear-gradient(135deg, #1e4e79 0%, #5fa8d3 100%);
  color: white;
  padding: 32px 20px;
  text-align: center;
}

.header-content h1 {
  font-size: 28px;
  margin-bottom: 8px;
}

.tagline {
  font-size: 14px;
  opacity: 0.9;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  flex: 1;
  padding: 20px;
  overflow: hidden;
}

.panel {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.panel h2 {
  font-size: 18px;
  margin-bottom: 16px;
  color: #1e4e79;
}

/* ==================== FORM ==================== */
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #2c2c2c;
  font-size: 14px;
}

.form-group input[type='text'],
.form-group input[type='email'],
.form-group select,
.form-group textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input[type='text']:focus,
.form-group input[type='email']:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1e4e79;
  box-shadow: 0 0 0 3px rgba(30, 78, 121, 0.1);
}

/* ==================== DROP ZONE ==================== */
.drop-zone {
  border: 2px dashed #5fa8d3;
  border-radius: 8px;
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f9f9f9;
}

.drop-zone:hover {
  border-color: #1e4e79;
  background-color: #f0f5ff;
}

.drop-zone.dragover {
  border-color: #1e4e79;
  background-color: #e3edf6;
}

.drop-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  color: #5fa8d3;
}

.drop-text {
  font-size: 14px;
  color: #666;
}

/* ==================== PREVIEW ==================== */
.preview-container {
  position: relative;
  margin-top: 12px;
}

.preview-image {
  width: 100%;
  height: auto;
  border-radius: 4px;
  max-height: 200px;
  object-fit: cover;
}

.remove-button {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border-radius: 50%;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.remove-button:hover {
  background: rgba(255, 0, 0, 1);
}

/* ==================== RADIO GROUP ==================== */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: normal;
}

.radio-label input[type='radio'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* ==================== BUTTONS ==================== */
.btn {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #1e4e79;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #163b5c;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #2c2c2c;
  border: 1px solid #ddd;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.btn-large {
  padding: 12px 32px;
  font-size: 16px;
  width: 100%;
}

.btn-copy {
  padding: 6px 12px;
  font-size: 12px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-copy:hover {
  background-color: #1e4e79;
  color: white;
  border-color: #1e4e79;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ==================== PREVIEW PANE ==================== */
.preview-pane {
  flex: 1;
  background-color: #fafafa;
  border-radius: 4px;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.placeholder-text {
  color: #999;
  font-size: 14px;
}

.preview-frame {
  width: 100%;
  height: 100%;
  border: none;
}

/* ==================== CODE TABS ==================== */
.code-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  border-bottom: 1px solid #eee;
  flex-wrap: wrap;
}

.tab-button {
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  background: none;
}

.tab-button.active {
  color: #1e4e79;
  border-bottom-color: #1e4e79;
}

.tab-button:hover:not(.active) {
  color: #2c2c2c;
}

/* ==================== TAB CONTENT ==================== */
.tab-content {
  flex: 1;
  overflow-y: auto;
  position: relative;
}

.tab-pane {
  display: none;
}

.tab-pane.active {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.code-header h3 {
  font-size: 14px;
  margin: 0;
}

/* ==================== CODE BLOCK ==================== */
.code-block {
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 12px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
  overflow-x: auto;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
}

.code-block code {
  color: inherit;
}

/* ==================== DOWNLOAD SECTION ==================== */
.download-section {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.download-section .btn {
  flex: 1;
}

/* ==================== FOOTER ==================== */
.footer {
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
  padding: 12px 20px;
  font-size: 12px;
  color: #666;
}

/* ==================== TOAST ==================== */
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #323232;
  color: white;
  padding: 12px 20px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.toast.success {
  background-color: #4caf50;
}

.toast.error {
  background-color: #f44336;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .panel {
    max-height: 400px;
  }
}

@media (max-width: 768px) {
  .header-content h1 {
    font-size: 24px;
  }

  .panel {
    padding: 16px;
  }

  .code-block {
    font-size: 11px;
  }

  .radio-group {
    flex-direction: row;
    gap: 16px;
  }
}

@media (max-width: 640px) {
  .header {
    padding: 20px 16px;
  }

  .main-content {
    padding: 12px;
    gap: 12px;
  }

  .panel {
    padding: 12px;
  }

  .btn {
    font-size: 13px;
    padding: 8px 16px;
  }

  .btn-large {
    padding: 10px 20px;
  }

  .code-tabs {
    gap: 4px;
  }

  .tab-button {
    padding: 8px 12px;
    font-size: 12px;
  }
}
```

---

## STEP 11: Create Frontend JavaScript

### File: `public/main.js`

```javascript
// ==================== STATE ====================
let currentTemplate = null;

// ==================== DOM ELEMENTS ====================
const form = document.getElementById('generatorForm');
const fileInput = document.getElementById('designImage');
const dropZone = document.getElementById('dropZone');
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');
const removeImageBtn = document.getElementById('removeImage');
const sectionTypeSelect = document.getElementById('sectionType');
const generateBtn = document.getElementById('generateButton');
const buttonText = document.getElementById('buttonText');
const loadingSpinner = document.getElementById('loadingSpinner');
const livePreview = document.getElementById('livePreview');
const previewPane = document.getElementById('previewPane');
const htmlCode = document.getElementById('html-code').querySelector('code');
const cssCode = document.getElementById('css-code').querySelector('code');
const jsCode = document.getElementById('js-code').querySelector('code');
const variablesList = document.getElementById('variables-list').querySelector('code');
const statusText = document.getElementById('statusText');
const toast = document.getElementById('toast');
const downloadSection = document.getElementById('downloadSection');
const tabButtons = document.querySelectorAll('.tab-button');
const copyButtons = document.querySelectorAll('.btn-copy');

// ==================== FILE UPLOAD ====================
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    fileInput.files = files;
    handleFileSelect();
  }
});

fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect() {
  const file = fileInput.files[0];
  if (!file) return;

  // Validate file type
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    showToast('Invalid file type. Please use JPEG, PNG, or WebP.', 'error');
    return;
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    showToast('File size exceeds 5MB limit.', 'error');
    return;
  }

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.src = e.target.result;
    previewContainer.style.display = 'block';
    dropZone.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

removeImageBtn.addEventListener('click', () => {
  fileInput.value = '';
  previewContainer.style.display = 'none';
  dropZone.style.display = 'block';
});

// ==================== FORM SUBMISSION ====================
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate
  if (!fileInput.files[0]) {
    showToast('Please upload a design screenshot.', 'error');
    return;
  }

  if (!sectionTypeSelect.value) {
    showToast('Please select a section type.', 'error');
    return;
  }

  // Prepare form data
  const formData = new FormData();
  formData.append('design_image', fileInput.files[0]);
  formData.append('section_type', sectionTypeSelect.value);
  formData.append('style_preference', document.querySelector('input[name="style_preference"]:checked').value);

  // Disable button & show spinner
  generateBtn.disabled = true;
  buttonText.style.display = 'none';
  loadingSpinner.style.display = 'inline-block';
  statusText.textContent = 'Generating template...';

  try {
    const response = await fetch('/api/generate-section', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate template');
    }

    const result = await response.json();
    if (!result.success || !result.data) {
      throw new Error('Invalid response format');
    }

    currentTemplate = result.data;
    displayResults(currentTemplate);
    statusText.textContent = 'Template generated successfully!';
    showToast('✓ Template generated successfully!', 'success');
  } catch (error) {
    console.error('Error:', error);
    statusText.textContent = 'Error generating template';
    showToast(error.message || 'Failed to generate template', 'error');
  } finally {
    generateBtn.disabled = false;
    buttonText.style.display = 'inline';
    loadingSpinner.style.display = 'none';
  }
});

// ==================== DISPLAY RESULTS ====================
function displayResults(template) {
  // Display code
  htmlCode.textContent = template.html;
  cssCode.textContent = template.css;
  jsCode.textContent = template.js;
  variablesList.textContent = JSON.stringify(template.variables_reference, null, 2);

  // Show download section
  downloadSection.style.display = 'flex';

  // Show live preview
  updateLivePreview(template.html, template.css, template.js);
}

function updateLivePreview(html, css, js) {
  const globalStyles = `
    :root {
      --color-primary-lightest: #E3EDF6;
      --color-primary-lighter: #B3CBE1;
      --color-primary-light: #6F97BD;
      --color-primary: #1E4E79;
      --color-primary-dark: #163B5C;
      --color-primary-darker: #0F2A42;
      --color-accent1-lightest: #E8F4FB;
      --color-accent1-lighter: #C7E3F4;
      --color-accent1-light: #89C3E6;
      --color-accent1: #5FA8D3;
      --color-accent1-dark: #4B85A7;
      --color-accent2-lightest: #E4E8EC;
      --color-accent2-lighter: #B5C0CC;
      --color-accent2-light: #73859A;
      --color-accent2: #12263A;
      --color-neutral-lightest: #E6E6E6;
      --color-neutral-lighter: #BCBCBC;
      --color-neutral-light: #808080;
      --color-neutral: #2C2C2C;
      --color-neutral-dark: #202020;
      --color-neutral-darker: #151515;
      --color-neutral-darkest: #0B0B0B;
      --color-accent3-lightest: #FFF4E6;
      --color-accent3-lighter: #FFE0B2;
      --color-accent3-light: #FFB74D;
      --color-accent3: #FF9800;
      --font-heading: 'Poppins', sans-serif;
      --font-body: 'Source Serif Pro', serif;
      --button-primary-bg: var(--color-primary);
      --button-primary-hover-bg: var(--color-primary-dark);
      --button-primary-text: var(--color-neutral-lightest);
      --button-secondary-bg: var(--color-neutral-lightest);
      --button-secondary-border: var(--color-neutral-light);
      --button-secondary-text: var(--color-primary-dark);
      --link-color: var(--color-primary);
      --link-hover-color: var(--color-primary-dark);
      --heading-color: var(--color-neutral-darkest);
      --body-color: var(--color-neutral);
      --card-bg: var(--color-neutral-lightest);
      --card-border: var(--color-neutral-lighter);
      --badge-bg: var(--color-accent1);
      --icon-color: var(--color-primary);
      --icon-secondary-color: var(--color-accent2);
    }
    body { margin: 0; font-family: var(--font-body); background: #fff; }
  `;

  const previewHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${globalStyles}${css}</style>
    </head>
    <body>
      ${html}
      <script>${js}</script>
    </body>
    </html>
  `;

  livePreview.style.display = 'block';
  previewPane.style.background = 'white';
  livePreview.srcDoc = previewHTML;
}

// ==================== TAB SWITCHING ====================
tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const tabName = button.getAttribute('data-tab');

    // Remove active from all
    tabButtons.forEach((btn) => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach((pane) => pane.classList.remove('active'));

    // Add active to current
    button.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
  });
});

// ==================== COPY TO CLIPBOARD ====================
copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const elementId = button.getAttribute('data-copy');
    const element = document.getElementById(elementId);
    const text = element.textContent;

    try {
      await navigator.clipboard.writeText(text);
      showToast('✓ Copied to clipboard!', 'success');
    } catch {
      showToast('Failed to copy', 'error');
    }
  });
});

// ==================== DOWNLOAD ====================
document.getElementById('downloadHtml')?.addEventListener('click', () => {
  if (!currentTemplate) return;

  const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Template</title>
  <style>
    ${currentTemplate.css}
  </style>
</head>
<body>
  ${currentTemplate.html}
  <script>
    ${currentTemplate.js}
  </script>
</body>
</html>`;

  downloadFile(content, 'template.html', 'text/html');
});

document.getElementById('downloadAll')?.addEventListener('click', () => {
  if (!currentTemplate) return;
  showToast('ZIP download feature coming soon!', 'success');
});

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = 'info') {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// ==================== INIT ====================
console.log('✓ Template Automation System loaded');
```

---

# PHASE 3: BUILD & RUN (Steps 12-13)

## STEP 12: Build TypeScript

```bash
cd /home/user/Templates-automation-

# Compile TypeScript
npm run build

# Verify dist folder created
ls -la dist/
```

---

## STEP 13: Run the System

```bash
# Development mode with hot reload
npm run dev

# Output should show:
# [INFO] Server running at http://localhost:3000
# [INFO] Environment: development
# [INFO] Claude Model: claude-haiku-4.5
```

**Open browser:** `http://localhost:3000`

✅ **System is now running!**

---

# PHASE 4: TESTING (Step 14)

## STEP 14: Test End-to-End

1. **Upload a screenshot**
   - Go to `http://localhost:3000`
   - Upload a design image (JPEG, PNG, or WebP)

2. **Select section type**
   - Choose "Hero" from dropdown

3. **Select style**
   - Choose "Professional"

4. **Generate**
   - Click "Generate Template"
   - Wait for Claude to analyze & generate

5. **View results**
   - Check live preview
   - Review HTML/CSS/JS code
   - Copy or download template

---

## 🎉 Complete!

Your **Template Automation System** is now fully functional!

**What you have:**
✅ Express backend with Claude API integration
✅ Image upload & processing
✅ Template generation service
✅ Complete frontend UI
✅ Live preview & code display
✅ Copy & download functionality

**Next steps:**
- Deploy to production
- Add database for storing templates
- Add user authentication
- Build admin dashboard

---

## 📚 Quick Reference

**Start server:**
```bash
npm run dev
```

**Build:**
```bash
npm run build
```

**Format code:**
```bash
npm run format
```

**Lint code:**
```bash
npm run lint
```

---

**Questions?** Check the logs with:
```bash
npm run dev 2>&1 | grep -E "\[INFO\]|\[ERROR\]"
```

Enjoy! 🚀
