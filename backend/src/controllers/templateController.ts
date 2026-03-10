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

      // Parse response
      let parsedResponse: any;
      try {
        // Extract JSON from response with multiple strategies
        let jsonString: string | null = null;

        // Strategy 1: Look for markdown code blocks
        const markdownMatch = claudeResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (markdownMatch && markdownMatch[1]) {
          jsonString = markdownMatch[1].trim();
        }

        // Strategy 2: Find first { and last }
        if (!jsonString || !this.isValidJson(jsonString)) {
          const openBrace = claudeResponse.indexOf('{');
          const closeBrace = claudeResponse.lastIndexOf('}');
          if (openBrace !== -1 && closeBrace !== -1 && closeBrace > openBrace) {
            jsonString = claudeResponse.substring(openBrace, closeBrace + 1);
          }
        }

        if (!jsonString) {
          logger.error('No JSON found in response', {
            response: claudeResponse.substring(0, 500),
            length: claudeResponse.length
          });
          throw new Error('No JSON found in response');
        }

        // Clean up common issues
        jsonString = jsonString
          .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, ' ') // Remove control characters
          .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
          .trim();

        parsedResponse = JSON.parse(jsonString);
      } catch (parseError) {
        logger.error('Failed to parse Claude response as JSON', {
          error: parseError,
          responseStart: claudeResponse.substring(0, 500),
          responseLength: claudeResponse.length
        });
        throw new Error(
          'Claude response was not valid JSON. Please try again or check your input.'
        );
      }

      // Check for errors in response
      if (parsedResponse.error || parsedResponse.violations) {
        logger.warn('Claude returned SOP violations', parsedResponse.violations);

        const response: GenerateTemplateResponse = {
          success: false,
          error: {
            code: 'SOP_COMPLIANCE_FAILED',
            message: 'Generated template violates SOP requirements',
            sopViolations: (parsedResponse.violations || []).map((v: any) => ({
              sop: v.sop,
              violation: v.violation,
              suggestion: v.fix,
            })),
          },
        };

        res.status(422).json(response);
        return;
      }

      // Extract components
      const { html, css, js, variables, metadata } = parsedResponse;

      if (!html || !css) {
        throw new Error('Claude response missing HTML or CSS');
      }

      // Run SOP validation
      const validation = sopValidator.validateTemplate(html, css, js || '');

      // Prepare response
      const response: GenerateTemplateResponse = {
        success: true,
        data: {
          html,
          css,
          js: js || '',
          variables,
          validation,
        },
        metadata: {
          processingTime: Date.now() - startTime,
          modelUsed: 'claude-haiku-4.5',
          tokenUsage: {
            input: 0, // Would be provided by Claude API
            output: 0,
          },
        },
      };

      logger.info('Template generated successfully', {
        time: response.metadata?.processingTime,
        sectionId: metadata?.sectionId,
        elements: metadata?.elementsCount,
        sopPassed: validation.passed,
      });

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
   * Check if a string is valid JSON
   */
  private isValidJson(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
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
