import Anthropic from '@anthropic-ai/sdk';
import config from './environment.js';

// Only create client if using Anthropic API
export const anthropicClient = config.anthropicApiKey
  ? new Anthropic({
      apiKey: config.anthropicApiKey,
    })
  : null;

export const claudeConfig = {
  model: config.claudeModel,
  maxTokens: config.claudeMaxTokens,
  temperature: 0.7,
  topP: 0.9,
};

export default anthropicClient;
