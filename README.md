# Design to Template Automation System

Convert design inspiration (screenshots/URLs) into reusable HTML templates using Claude AI, following strict SOP guidelines.

## 🎯 Project Overview

This system automates the conversion of design inspiration into production-ready website templates following a comprehensive set of SOPs (Standard Operating Procedures):

- **Template Creation SOP** - HTML structure and naming conventions
- **Color Variable SOP** - Adaptive color distribution (50-25-12-8-5 or 50-25-15-10)
- **Font SOP** - Typography variables and usage rules
- **Professional Vibe SOP** - Design system with sharp corners, refined interactions
- **Prompt A1 Structure** - ID naming and data attribute conventions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Anthropic API key

### Installation

```bash
# Clone repository
git clone <repo-url>
cd Templates-automation-

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
```

### Development

```bash
# Start development server
npm run dev

# Server runs on http://localhost:3000
```

### Build & Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
Templates-automation-/
├── backend/
│   └── src/
│       ├── config/          # Configuration files
│       ├── controllers/      # Request handlers (Phase 2)
│       ├── services/         # Business logic (Phase 2)
│       ├── prompts/          # Claude prompts (Phase 2)
│       ├── utils/            # Utilities
│       ├── types/            # TypeScript types
│       └── middleware/       # Express middleware (Phase 2)
├── frontend/
│   ├── index.html           # Main UI
│   ├── css/                 # Stylesheets
│   │   ├── variables.css    # CSS variables
│   │   ├── layout.css       # Layout grid
│   │   ├── styles.css       # Component styles
│   │   └── components.css   # Utility styles
│   └── js/
│       ├── main.js          # Application entry point
│       ├── ui/              # UI components (Phase 2)
│       ├── api/             # API client (Phase 2)
│       └── utils/           # Utilities (Phase 2)
├── docs/                    # Documentation
├── tests/                   # Test suite (Phase 2)
├── package.json
├── tsconfig.json
└── .env.example
```

## 📋 Development Phases

### Phase 1: Foundation & Setup ✅ COMPLETE
- [x] Project structure initialized
- [x] TypeScript configuration
- [x] Express server skeleton
- [x] Frontend HTML/CSS/JS scaffold
- [x] Environment setup
- [x] Git workflow ready

### Phase 2: Core API Infrastructure (Next)
- [ ] Claude API integration
- [ ] Image processing pipeline
- [ ] Prompt engineering
- [ ] SOP validators
- [ ] Template generation endpoint

### Phase 3: SOP Validation Layer
- [ ] Color variable validator
- [ ] Font variable validator
- [ ] Template structure validator
- [ ] Professional vibe validator
- [ ] ID naming convention validator

### Phase 4: Backend API Endpoints
- [ ] POST /api/generate-template
- [ ] POST /api/validate-template
- [ ] GET /api/section-types
- [ ] Error handling & logging

### Phase 5: Frontend Application
- [ ] Form submission
- [ ] Real-time preview
- [ ] Code display & tabs
- [ ] Copy/download functionality
- [ ] Responsive design

### Phase 6: Integration & Testing
- [ ] End-to-end tests
- [ ] Unit tests
- [ ] SOP compliance tests
- [ ] Performance optimization

### Phase 7: Documentation & Deployment
- [ ] Complete documentation
- [ ] Deployment guide
- [ ] Go-live checklist

## 🔄 API Endpoints (Phase 2+)

### Generate Template
```http
POST /api/generate-template
Content-Type: application/json

{
  "designInput": {
    "type": "screenshot|url",
    "data": "base64_or_url"
  },
  "currentHtml": "<section>...</section>",
  "templateConfig": {
    "sectionType": "hero|features|testimonials|cta|pricing|footer|stats|about",
    "templateName": "string",
    "colorScheme": 3|4,
    "companyVibe": "optional description"
  }
}
```

### Get Section Types
```http
GET /api/section-types
```

### Validate Template
```http
POST /api/validate-template
Content-Type: application/json

{
  "html": "<template_html>",
  "css": "<template_css>",
  "js": "<template_js>",
  "variables": { "colors": {}, "fonts": {} }
}
```

## 🎨 Supported Section Types

- **Hero** - Full-width hero with headline and CTA
- **Features** - 3+ column feature grid with icons
- **Testimonials** - Customer testimonials in card format
- **CTA** - Focused call-to-action section
- **Pricing** - Pricing plans grid
- **Stats** - Key metrics and numbers
- **About** - Company/product information
- **Footer** - Footer with links and branding

## 📐 SOP Compliance

### Color Distribution
- **4-Color Scheme**: 50% Primary, 25% Secondary, 12% Accent1, 8% Accent2, 5% Accent3
- **3-Color Scheme**: 50% Primary, 25% Secondary, 15% Accent, 10% Neutral

### ID Naming Convention
- Sections: `sec-[short-id]` (e.g., `sec-hero`)
- Elements: `el-[short-id]-[descriptor]` (e.g., `el-hero-title`)
- Styles: `stl-[short-id]` (e.g., `stl-button-primary`)
- Scripts: `scr-[short-id]` (e.g., `scr-mobile-menu`)

### Font Variables
```css
--font-heading: 'Poppins', sans-serif;
--font-body: 'Source Serif Pro', serif;
```

### Required Attributes
Every element must have:
```html
<element id="el-xxx" data-ai-id="el-xxx" data-type="text|html|image|list">
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration
```

## 📝 Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Build TypeScript
npm run build
```

## 🔐 Environment Variables

See `.env.example` for full list. Required:

- `ANTHROPIC_API_KEY` - Your Anthropic API key
- `NODE_ENV` - development|production
- `PORT` - Server port (default: 3000)
- `CLAUDE_MODEL` - Model to use (default: claude-haiku-4.5)

## 📚 Documentation

- [Implementation Guide](./docs/IMPLEMENTATION_GUIDE.md) - Phase-by-phase implementation details
- [API Specification](./docs/API_SPECIFICATION.md) - Complete API documentation
- [Architecture](./docs/ARCHITECTURE.md) - System architecture and design patterns
- [SOP Reference](./docs/SOP_REFERENCE.md) - Detailed SOP explanations
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment

## 🚀 Next Steps

1. **Install dependencies**: `npm install`
2. **Configure environment**: Create `.env` file with API key
3. **Start development**: `npm run dev`
4. **Begin Phase 2**: Implement Claude API integration

## 📖 Learning Resources

- [Anthropic API Docs](https://docs.anthropic.com/)
- [Claude AI Guide](https://claude.ai/docs)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

This project uses strict SOP guidelines. All contributions must:
- Follow the implemented SOP structure
- Include proper TypeScript types
- Pass all validators
- Include tests (Phase 2+)
- Follow code quality standards

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Check documentation in `/docs` directory
- Review error messages and validation reports
- Check console logs for debugging information
- Review SOP guidelines before implementation

## 📊 Metrics

**Current Status**: Phase 1 Complete ✅
- Project structure: 100%
- Configuration: 100%
- Frontend scaffold: 100%
- Backend skeleton: 100%
- Documentation: 100%

**Next Phase**: Phase 2 Integration (Starting next)
- Claude API integration
- Image processing
- Prompt engineering
- SOP validators

---

**Last Updated**: 2026-03-10
**Phase**: 1 - Foundation & Setup ✅
**Status**: Ready for Phase 2 Development
