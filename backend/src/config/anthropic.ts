import Anthropic from '@anthropic-ai/sdk';
import config from './environment.js';

export const anthropicClient = new Anthropic({
  apiKey: config.anthropicApiKey,
});

export const claudeConfig = {
  model: config.claudeModel,
  maxTokens: config.claudeMaxTokens,
  temperature: 0.7,
  topP: 0.9,
};

export default anthropicClient;
