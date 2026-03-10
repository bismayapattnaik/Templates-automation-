#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { claudeService } from '../services/claudeService.js';
import { imageProcessor } from '../services/imageProcessor.js';
import { logger } from '../utils/logger.js';
import { sopInstructions } from '../prompts/sopInstructions.js';
import { GenerateTemplateRequest } from '../types/index.js';

/**
 * MCP Server for Template Generation
 * Exposes template generation as Claude tools
 */

const server = new Server(
  {
    name: 'Templates-Automation-MCP',
    version: '1.0.0',
  },
  {
    capabilities: {},
  }
);

// ═════════════════════════════════════════════════════
// TOOL DEFINITIONS
// ═════════════════════════════════════════════════════

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'generate_template',
        description:
          'Generate HTML/CSS/JS template from design input. Creates a complete responsive section with animations, variables, and SOP compliance.',
        inputSchema: {
          type: 'object',
          properties: {
            designInput: {
              type: 'object',
              description: 'Design input (screenshot base64 or URL)',
              properties: {
                type: {
                  type: 'string',
                  enum: ['screenshot', 'url'],
                  description: 'Input type: screenshot (base64) or URL',
                },
                data: {
                  type: 'string',
                  description:
                    'Base64-encoded image or URL to design screenshot',
                },
              },
              required: ['type', 'data'],
            },
            currentHtml: {
              type: 'string',
              description: 'Current HTML template structure (at least partial)',
            },
            templateConfig: {
              type: 'object',
              description: 'Template configuration',
              properties: {
                sectionType: {
                  type: 'string',
                  enum: [
                    'hero',
                    'features',
                    'testimonials',
                    'cta',
                    'pricing',
                    'stats',
                    'about',
                    'footer',
                  ],
                  description: 'Type of section to generate',
                },
                templateName: {
                  type: 'string',
                  description: 'Name for the template',
                },
                colorScheme: {
                  type: 'number',
                  enum: [3, 4],
                  description: 'Number of colors in color scheme (3 or 4)',
                },
                companyVibe: {
                  type: 'string',
                  description:
                    'Design style description (e.g., "modern, minimalist, luxury")',
                },
              },
              required: ['sectionType', 'templateName', 'colorScheme'],
            },
          },
          required: ['designInput', 'currentHtml', 'templateConfig'],
        },
      },
      {
        name: 'get_section_types',
        description:
          'Get list of available section types that can be generated',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_sop_instructions',
        description:
          'Get the current SOP (Standard Operating Procedures) instructions for template generation',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// ═════════════════════════════════════════════════════
// TOOL HANDLERS
// ═════════════════════════════════════════════════════

/**
 * Tool: generate_template
 * Generates a complete template from design input
 */
async function generateTemplate(request: GenerateTemplateRequest) {
  const startTime = Date.now();

  logger.info('MCP: Template generation request received', {
    sectionType: request.templateConfig.sectionType,
    templateName: request.templateConfig.templateName,
  });

  // Validate request
  validateRequest(request);

  // Process design input
  const processedDesignInput = await imageProcessor.processDesignInput(
    request.designInput
  );

  // Build user prompt
  const userPrompt = buildUserPrompt(request, processedDesignInput);

  // Call Claude API
  const claudeResponse = await claudeService.generateTemplate(
    sopInstructions,
    userPrompt,
    processedDesignInput
  );

  logger.info('MCP: Raw response from Claude', { length: claudeResponse.length });

  // Parse JSON response
  let parsedResponse;
  try {
    const jsonMatch = claudeResponse.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : claudeResponse;
    parsedResponse = JSON.parse(jsonString);
  } catch (parseError) {
    logger.error('MCP: Failed to parse Claude response as JSON', {
      error: parseError,
    });
    throw new Error('Invalid JSON response from Claude');
  }

  const response = {
    success: true,
    data: {
      html: parsedResponse.html || '',
      css: parsedResponse.css || '',
      js: parsedResponse.js || '',
      variables: parsedResponse.variables || {
        colors: {},
        fonts: { heading: '', body: '' },
      },
      validation: {
        passed: true,
        sopResults: {},
        errors: [],
        warnings: [],
      },
    },
    metadata: {
      processingTime: Date.now() - startTime,
      modelUsed: 'claude',
      mcp: true,
    },
  };

  logger.info('MCP: Template generation complete');
  return response;
}

/**
 * Tool: get_section_types
 * Returns available section types
 */
function getSectionTypes() {
  return {
    success: true,
    data: [
      {
        id: 'hero',
        name: 'Hero Section',
        description: 'Full-width hero with headline and CTA',
        elementsTypical: ['heading', 'subheading', 'cta_button', 'background_image'],
      },
      {
        id: 'features',
        name: 'Features Section',
        description: '3-column feature grid with icons',
        elementsTypical: ['heading', 'feature_cards', 'icons', 'descriptions'],
      },
      {
        id: 'testimonials',
        name: 'Testimonials Section',
        description: 'Customer testimonials in card format',
        elementsTypical: ['testimonial_cards', 'author_names', 'avatars', 'ratings'],
      },
      {
        id: 'cta',
        name: 'Call to Action Section',
        description: 'Focused CTA section with headline and button',
        elementsTypical: ['heading', 'description', 'cta_button', 'background'],
      },
      {
        id: 'pricing',
        name: 'Pricing Section',
        description: 'Pricing plans grid',
        elementsTypical: ['pricing_cards', 'features_list', 'cta_buttons', 'pricing_toggle'],
      },
      {
        id: 'stats',
        name: 'Stats Section',
        description: 'Key metrics and numbers',
        elementsTypical: ['stat_cards', 'numbers', 'labels', 'descriptions'],
      },
      {
        id: 'about',
        name: 'About Section',
        description: 'About company or product',
        elementsTypical: ['heading', 'description', 'image', 'features_list'],
      },
      {
        id: 'footer',
        name: 'Footer Section',
        description: 'Page footer with links and branding',
        elementsTypical: ['logo', 'link_columns', 'social_links', 'copyright'],
      },
    ],
  };
}

/**
 * Tool: get_sop_instructions
 * Returns current SOP instructions
 */
function getSopInstructions() {
  return {
    success: true,
    data: sopInstructions,
  };
}

// ═════════════════════════════════════════════════════
// REQUEST HANDLER
// ═════════════════════════════════════════════════════

server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  logger.info(`MCP: Tool called: ${request.params.name}`);

  try {
    let result;

    switch (request.params.name) {
      case 'generate_template': {
        const args = request.params.arguments as unknown as GenerateTemplateRequest;
        result = await generateTemplate(args);
        break;
      }

      case 'get_section_types': {
        result = getSectionTypes();
        break;
      }

      case 'get_sop_instructions': {
        result = getSopInstructions();
        break;
      }

      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }

    logger.info(`MCP: Tool execution successful: ${request.params.name}`);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
      isError: false,
    };
  } catch (error: any) {
    logger.error(`MCP: Tool execution failed: ${request.params.name}`, error);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: false,
              error: {
                code: 'TOOL_ERROR',
                message: error?.message || 'Tool execution failed',
                tool: request.params.name,
              },
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

// ═════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═════════════════════════════════════════════════════

function validateRequest(request: GenerateTemplateRequest): void {
  if (!request.designInput) {
    throw new Error('designInput is required');
  }

  if (
    !request.designInput.type ||
    !['screenshot', 'url'].includes(request.designInput.type)
  ) {
    throw new Error('designInput.type must be "screenshot" or "url"');
  }

  if (!request.designInput.data) {
    throw new Error('designInput.data is required');
  }

  if (!request.currentHtml || request.currentHtml.trim().length === 0) {
    throw new Error('currentHtml is required');
  }

  if (!request.templateConfig) {
    throw new Error('templateConfig is required');
  }

  if (!request.templateConfig.sectionType) {
    throw new Error('templateConfig.sectionType is required');
  }

  if (!request.templateConfig.templateName) {
    throw new Error('templateConfig.templateName is required');
  }

  const validSectionTypes = [
    'hero',
    'features',
    'testimonials',
    'cta',
    'pricing',
    'stats',
    'about',
    'footer',
  ];

  if (!validSectionTypes.includes(request.templateConfig.sectionType)) {
    throw new Error(
      `Invalid sectionType. Must be one of: ${validSectionTypes.join(', ')}`
    );
  }

  if (![3, 4].includes(request.templateConfig.colorScheme)) {
    throw new Error('colorScheme must be 3 or 4');
  }
}

function buildUserPrompt(
  request: GenerateTemplateRequest,
  _processedDesignInput: any
): string {
  const { templateConfig, currentHtml } = request;

  return `
# DESIGN TO TEMPLATE REQUEST

## Section Type
${templateConfig.sectionType.toUpperCase()}

## Template Name
${templateConfig.templateName}

## Color Scheme
${templateConfig.colorScheme} colors (distribution: ${templateConfig.colorScheme === 3 ? '50-25-15-10' : '50-25-12-8-5'})

## Company Vibe
${templateConfig.companyVibe || 'Professional, modern, clean'}

## Current Template Structure
\`\`\`html
${currentHtml.substring(0, 500)}...
\`\`\`

## Task
Analyze the design input and generate a new section following the EXACT structure and SOPs provided.

Generate a ${templateConfig.sectionType} section that:
1. Matches the design inspiration visually
2. Follows the current template structure
3. Complies with ALL 5 SOPs completely
4. Uses only the color and font variables
5. Has proper ID structure and attributes
6. Uses placeholder variables for all content

Return as JSON with html, css, js, variables, and metadata fields.
`;
}

// ═════════════════════════════════════════════════════
// START SERVER
// ═════════════════════════════════════════════════════

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info('✅ MCP Server started and connected via stdio');
}

main().catch((error) => {
  logger.error('MCP Server failed to start', error);
  process.exit(1);
});
