import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || 'localhost',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Anthropic API
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  claudeModel: process.env.CLAUDE_MODEL || 'claude-haiku-4.5',
  claudeMaxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS || '3000', 10),
  claudeTimeout: parseInt(process.env.CLAUDE_TIMEOUT || '30000', 10),

  // File Upload
  maxImageSize: parseInt(process.env.MAX_IMAGE_SIZE || '5242880', 10), // 5MB
  maxImageWidth: parseInt(process.env.MAX_IMAGE_WIDTH || '4096', 10),
  maxImageHeight: parseInt(process.env.MAX_IMAGE_HEIGHT || '4096', 10),
  allowedImageTypes: (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp').split(','),

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
};

// Validation
if (!config.anthropicApiKey) {
  throw new Error('ANTHROPIC_API_KEY environment variable is required');
}

export default config;
