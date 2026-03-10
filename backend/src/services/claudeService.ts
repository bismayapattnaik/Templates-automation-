import Anthropic from '@anthropic-ai/sdk';
import { anthropicClient, claudeConfig } from '../config/anthropic.js';
import { logger } from '../utils/logger.js';
import { DesignInput } from '../types/index.js';

type MessageContent = Anthropic.TextBlockParam | Anthropic.ImageBlockParam;

export class ClaudeService {
  private client: Anthropic;

  constructor() {
    this.client = anthropicClient;
  }

  /**
   * Analyzes design input and generates template
   * Supports both image screenshots and URL-based designs
   */
  async generateTemplate(
    systemPrompt: string,
    userPrompt: string,
    designInput: DesignInput
  ): Promise<string> {
    try {
      logger.info('Calling Claude API for template generation');

      // Build message content with image if provided
      const messageContent = this.buildMessageContent(userPrompt, designInput);

      // Call Claude API
      const response = await this.client.messages.create({
        model: claudeConfig.model,
        max_tokens: claudeConfig.maxTokens,
        temperature: claudeConfig.temperature,
        top_p: claudeConfig.topP,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: messageContent,
          },
        ],
      });

      // Extract text response
      const textContent = response.content.find((block) => block.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text response from Claude');
      }

      logger.info('Claude API response received successfully', {
        tokens_used: response.usage?.input_tokens + response.usage?.output_tokens,
      });

      return textContent.text;
    } catch (error) {
      logger.error('Claude API error', error);
      throw this.handleError(error);
    }
  }

  /**
   * Builds message content with optional image attachment
   */
  private buildMessageContent(userPrompt: string, designInput: DesignInput): MessageContent[] {
    const content: MessageContent[] = [];

    // Add image if screenshot provided
    if (designInput.type === 'screenshot' && designInput.data) {
      // Extract base64 from data URL if present
      const base64Data = designInput.data.includes(',')
        ? designInput.data.split(',')[1]
        : designInput.data;

      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: 'image/jpeg',
          data: base64Data,
        },
      });
    }

    // Add URL reference if provided
    if (designInput.type === 'url' && designInput.data) {
      const urlText = `Design Reference URL: ${designInput.data}\n\nPlease analyze this website for design inspiration.`;
      content.push({
        type: 'text',
        text: urlText,
      });
    }

    // Add main prompt
    content.push({
      type: 'text',
      text: userPrompt,
    });

    return content;
  }

  /**
   * Handles API errors with helpful messages
   */
  private handleError(error: any): Error {
    if (error?.status === 401) {
      return new Error('Invalid Anthropic API key. Check ANTHROPIC_API_KEY in .env');
    }

    if (error?.status === 429) {
      return new Error('Rate limit exceeded. Please try again in a moment.');
    }

    if (error?.status === 500) {
      return new Error('Anthropic API service error. Please try again later.');
    }

    if (error?.message?.includes('timeout')) {
      return new Error('Request timeout. The design analysis took too long. Please try again.');
    }

    return new Error(error?.message || 'Failed to generate template');
  }

  /**
   * Tests the API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      logger.info('Testing Claude API connection');

      await this.client.messages.create({
        model: claudeConfig.model,
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'Say "Connection successful" if you can read this.',
          },
        ],
      });

      logger.info('Connection test passed');
      return true;
    } catch (error) {
      logger.error('Connection test failed', error);
      return false;
    }
  }
}

export const claudeService = new ClaudeService();
export default claudeService;
