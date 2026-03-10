import { Request, Response } from 'express';
import { claudeService } from '../services/claudeService.js';
import { imageProcessor } from '../services/imageProcessor.js';
import { sopValidator } from '../services/sopValidator.js';
import { logger } from '../utils/logger.js';
import { GenerateTemplateRequest, GenerateTemplateResponse } from '../types/index.js';
import { sopInstructions } from '../prompts/sopInstructions.js';

export class TemplateController {
  /**
   * Handles template generation request
   */
  async generateTemplate(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    try {
      // Parse request
      const request = req.body as GenerateTemplateRequest;

      logger.info('Template generation request received', {
        sectionType: request.templateConfig.sectionType,
        templateName: request.templateConfig.templateName,
      });

      // Validate request
      this.validateRequest(request);

      // Process design input
      const processedDesignInput = await imageProcessor.processDesignInput(request.designInput);

      // Build user prompt
      const userPrompt = this.buildUserPrompt(request, processedDesignInput);

      // Call Claude API
      const claudeResponse = await claudeService.generateTemplate(
        sopInstructions,
        userPrompt,
        processedDesignInput
      );

      logger.info('Raw response from API', { length: claudeResponse.length });

      // Send raw response directly to client (no JSON parsing)
      const response: GenerateTemplateResponse = {
        success: true,
        data: {
          html: claudeResponse,
          css: '',
          js: '',
          variables: {},
          validation: { passed: true, violations: [] },
        },
        metadata: {
          processingTime: Date.now() - startTime,
          modelUsed: 'ollama',
          tokenUsage: { input: 0, output: 0 },
        },
      };

      logger.info('Response sent to client', { responseLength: claudeResponse.length });
      res.status(200).json(response);
    } catch (error: any) {
      logger.error('Template generation error', error);

      const response: GenerateTemplateResponse = {
        success: false,
        error: {
          code: 'GENERATION_ERROR',
          message: error?.message || 'Failed to generate template',
          details: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
        },
      };

      res.status(500).json(response);
    }
  }

  /**
   * Validates incoming request
   */
  private validateRequest(request: GenerateTemplateRequest): void {
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

  /**
   * Builds user prompt from request
   */
  private buildUserPrompt(request: GenerateTemplateRequest, _processedDesignInput: any): string {
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
}

export const templateController = new TemplateController();
export default templateController;
