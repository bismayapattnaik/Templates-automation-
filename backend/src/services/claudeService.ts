import Anthropic from '@anthropic-ai/sdk';
import { anthropicClient, claudeConfig } from '../config/anthropic.js';
import config from '../config/environment.js';
import { logger } from '../utils/logger.js';
import { DesignInput } from '../types/index.js';

type MessageContent = Anthropic.TextBlockParam | Anthropic.ImageBlockParam;

export class ClaudeService {
  private client: Anthropic | null;
  private useOllama: boolean;

  constructor() {
    this.useOllama = !config.anthropicApiKey || config.anthropicApiKey.length === 0;
    this.client = this.useOllama ? null : anthropicClient;
    logger.info(`Using ${this.useOllama ? 'Ollama' : 'Anthropic API'} for Claude service`);
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
      logger.info(`Calling ${this.useOllama ? 'Ollama' : 'Claude'} API for template generation`);

      if (this.useOllama) {
        // Simplify prompt for Ollama
        const simplifiedPrompt = this.simplifyPromptForOllama();
        return await this.generateWithOllama(simplifiedPrompt, userPrompt, designInput);
      } else {
        return await this.generateWithAnthropic(systemPrompt, userPrompt, designInput);
      }
    } catch (error) {
      logger.error('Template generation error', error);
      throw this.handleError(error);
    }
  }

  private async generateWithAnthropic(
    systemPrompt: string,
    userPrompt: string,
    designInput: DesignInput
  ): Promise<string> {
    // Build message content with image if provided
    const messageContent = this.buildMessageContent(userPrompt, designInput);

    // Call Claude API
    const response = await this.client!.messages.create({
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
  }

  private async generateWithOllama(
    systemPrompt: string,
    userPrompt: string,
    designInput: DesignInput
  ): Promise<string> {
    // Build message content
    let fullPrompt = userPrompt;
    if (designInput.type === 'url' && designInput.data) {
      fullPrompt = `Design Reference URL: ${designInput.data}\n\n${userPrompt}`;
    }

    const response = await fetch(`${config.ollamaBaseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.ollamaModel,
        prompt: `${systemPrompt}\n\n${fullPrompt}`,
        stream: false,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = (await response.json()) as { response?: string };
    logger.info('Ollama API response received successfully');

    const responseText = data.response || '';
    logger.info('Ollama raw response', {
      length: responseText.length,
      first200Chars: responseText.substring(0, 200),
      last100Chars: responseText.substring(Math.max(0, responseText.length - 100))
    });

    return responseText;
  }

  /**
   * Simplify prompt for Ollama - it doesn't handle long complex prompts well
   */
  private simplifyPromptForOllama(): string {
    return `You are an expert frontend template engineer. Generate HTML/CSS/JS templates following these rules:

1. Use semantic HTML with proper structure
2. Use CSS variables for colors and fonts only
3. NO hardcoded colors or fonts
4. Return ONLY valid JSON in this exact format with NO other text:

\`\`\`json
{
  "html": "...",
  "css": "...",
  "js": "...",
  "variables": {"colors": {}, "fonts": {}},
  "metadata": {"sectionId": "...", "elementsCount": 0}
}
\`\`\`

IMPORTANT: Return ONLY the JSON block. No explanations, no preamble, no text after the closing brace.`;
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
      if (this.useOllama) {
        logger.info('Testing Ollama connection');
        const response = await fetch(`${config.ollamaBaseUrl}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: config.ollamaModel,
            prompt: 'Say "Connection successful" if you can read this.',
            stream: false,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error(`Ollama connection failed: ${response.statusText}`);
        }
      } else {
        logger.info('Testing Claude API connection');

        await this.client!.messages.create({
          model: claudeConfig.model,
          max_tokens: 100,
          messages: [
            {
              role: 'user',
              content: 'Say "Connection successful" if you can read this.',
            },
          ],
        });
      }

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
