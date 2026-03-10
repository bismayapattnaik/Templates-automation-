import express, { Express, Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/environment.js';
import { logger } from './utils/logger.js';
import { templateController } from './controllers/templateController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../../frontend')));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Get available section types
app.get('/api/section-types', (_req: Request, res: Response) => {
  const sectionTypes = [
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
  ];

  res.json({
    success: true,
    data: sectionTypes,
  });
});

// Template generation endpoint
app.post('/api/generate-template', async (req: Request, res: Response) => {
  await templateController.generateTemplate(req, res);
});

// Fallback to index.html for SPA routing
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  });
});

// Error handler
app.use(
  (
    err: any,
    _req: Request,
    res: Response,
    _next: express.NextFunction
  ) => {
    logger.error('Unhandled error', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        ...(config.nodeEnv === 'development' && { details: err.message }),
      },
    });
  }
);

// Start server
const port = config.port;
app.listen(port, () => {
  logger.info(`🚀 Server running on http://${config.host}:${port}`);
  logger.info(`📝 API Health: http://${config.host}:${port}/api/health`);
  logger.info(`🎨 Frontend: http://${config.host}:${port}`);
});

export default app;
