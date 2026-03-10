# Phase 2 - Getting Started with Claude Integration

Now that Phase 2 is complete, the system is fully functional and ready to generate templates powered by Claude AI!

## What's New in Phase 2

✨ **Claude AI Integration** - Design analysis using vision
✨ **SOP Enforcement** - Automatic compliance validation
✨ **Template Generation** - Automated HTML/CSS/JS creation
✨ **Image Processing** - Screenshot and URL handling
✨ **Validation Reports** - SOP compliance details

## Quick Start

### 1. Setup (if not done yet)

```bash
# Navigate to project
cd Templates-automation-

# Setup environment file
cp .env.example .env

# Add your Anthropic API key to .env
# ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Install dependencies
npm install
```

### 2. Start the Server

```bash
npm run dev
```

You'll see:
```
[timestamp] [INFO] 🚀 Server running on http://localhost:3000
[timestamp] [INFO] 📝 API Health: http://localhost:3000/api/health
[timestamp] [INFO] 🎨 Frontend: http://localhost:3000
```

### 3. Open in Browser

Navigate to: **http://localhost:3000**

## How to Generate a Template

### Step 1: Provide Design Input

**Option A - Upload Screenshot**
- Click "Upload Design Screenshot"
- Select a JPG, PNG, or WebP file (max 5MB)
- Claude will analyze the visual design

**Option B - Enter URL**
- Paste a website URL in "Reference Website URL"
- Claude will fetch and analyze the design

### Step 2: Paste Current Template

- Paste your existing template HTML in "Current Template HTML"
- This helps Claude match your template structure
- Even a minimal example helps

### Step 3: Configure Template

- **Section Type**: Choose from 8 section types
  - Hero (full-width with CTA)
  - Features (3-column grid)
  - Testimonials (customer quotes)
  - CTA (call-to-action)
  - Pricing (plans grid)
  - Stats (key numbers)
  - About (company info)
  - Footer (bottom section)

- **Template Name**: Unique identifier (e.g., `hero-modern-v2`)

- **Color Scheme**: Choose 3-color or 4-color system
  - 3 colors: 50-25-15-10 distribution
  - 4 colors: 50-25-12-8-5 distribution

- **Company Vibe** (optional): Describe style
  - Examples: "modern, tech-forward, minimal"

### Step 4: Click Generate

Click **"Generate Template"** button

The system will:
1. ✅ Validate your inputs
2. ✅ Process design input (screenshot or URL)
3. ✅ Call Claude API with all 5 SOP instructions
4. ✅ Analyze design and generate template
5. ✅ Validate output against SOPs
6. ✅ Return HTML, CSS, JS, and variables

### Step 5: Review Results

**Live Preview Panel**
- See the generated template in real-time
- Check layout and styling

**Code Panels**
- **HTML Tab**: Generated section with proper IDs
- **CSS Tab**: Variable-only styling
- **JS Tab**: Design-related interactions
- **Variables Tab**: Color and font definitions
- **Validation Tab**: SOP compliance report

### Step 6: Download or Copy

**Copy Code**
- Click 📋 button on any tab
- Copy individual sections to clipboard

**Download Files**
- Click "⬇️ Download All Files"
- Get HTML, CSS, JS, and variable references

## Understanding the Output

### HTML Structure

Every element follows SOP requirements:

```html
<section id="sec-x1y2z3" data-ai-id="sec-x1y2z3" data-section-type="hero">
  <div id="el-x1y2z3-container" data-ai-id="el-x1y2z3-container" data-type="html">
    <!-- Content here -->
  </div>
</section>
```

**Required Attributes**:
- `id` - Unique identifier (sec-/el-/stl-/scr- prefix)
- `data-ai-id` - Same as id (for system processing)
- `data-type` - Element type (text/html/image/list)

### CSS (Variables Only)

All colors and fonts are variables:

```css
/* ✅ CORRECT */
color: var(--color-primary);
font-family: var(--font-heading);
background: var(--color-neutral-lightest);

/* ❌ NEVER hardcoded */
color: #000000;
font-family: 'Arial';
```

### Variables Reference

The generated variables include:

```json
{
  "colors": {
    "primary": "var(--color-primary)",
    "accent1": "var(--color-accent1)",
    "text": "var(--color-neutral-darkest)"
  },
  "fonts": {
    "heading": "var(--font-heading)",
    "body": "var(--font-body)"
  }
}
```

### Validation Report

Shows compliance with all 5 SOPs:

```
✓ SOP 1: Template Creation - PASSED
✓ SOP 2: Color Variables - PASSED
✓ SOP 3: Font Variables - PASSED
✓ SOP 4: Professional Vibe - PASSED
✓ SOP 5: ID Structure - PASSED
```

**If violations found**, see:
- What violated
- Which SOP was broken
- How to fix it

## Error Handling

### Common Issues

**"Please upload a screenshot or enter a URL"**
- Upload image OR enter URL (not both required)

**"Image size exceeds 5MB"**
- Compress screenshot or use URL instead

**"Invalid URL format"**
- Check URL starts with https:// or http://

**"API key not found"**
- Ensure ANTHROPIC_API_KEY is in .env
- Restart server after adding key

**"SOP violations detected"**
- Claude returned non-compliant template
- Check violation details in Validation tab
- Try adjusting company vibe or section type
- Regenerate with different inputs

### Getting Help

1. **Check Logs**: Look at terminal running `npm run dev`
2. **Browser Console**: Press F12, check Console tab
3. **Validation Report**: Detailed error messages
4. **API Health**: Visit `http://localhost:3000/api/health`

## Advanced Tips

### For Best Results

1. **Clear Screenshots**
   - Use high-quality, clear design screenshots
   - Ensure content is visible
   - Max 5MB file size

2. **Specific URLs**
   - Use live websites (not 404 pages)
   - Point to section you want to replicate
   - Avoid redirects

3. **Detailed Context**
   - Paste relevant current template HTML
   - More specific company vibe helps
   - Be explicit about section type

4. **Iterate**
   - Start with one section
   - Refine based on validation
   - Adjust company vibe if needed

### Troubleshooting Generation

**If Claude returns errors:**
- Try different company vibe description
- Change section type
- Use different design reference
- Simplify current template HTML

**If validation fails:**
- Check violation details
- Most common: hardcoded colors or fonts
- Try regenerating with same inputs
- Report any persistent issues

## API Details

### Request Format

```json
{
  "designInput": {
    "type": "screenshot|url",
    "data": "base64_or_url_string"
  },
  "currentHtml": "<existing_template>",
  "templateConfig": {
    "sectionType": "hero|features|testimonials|cta|pricing|stats|about|footer",
    "templateName": "unique-name",
    "colorScheme": 3 or 4,
    "companyVibe": "optional description"
  }
}
```

### Response Format

```json
{
  "success": true,
  "data": {
    "html": "<section>...</section>",
    "css": "/* styles */",
    "js": "// interactions",
    "variables": { "colors": {}, "fonts": {} },
    "validation": {
      "passed": true,
      "sopResults": { /* each SOP status */ }
    }
  },
  "metadata": {
    "processingTime": 1234,
    "modelUsed": "claude-haiku-4.5"
  }
}
```

## Performance Expectations

| Operation | Time |
|-----------|------|
| Image upload | <1s |
| Form validation | <1s |
| Claude API call | 3-8s |
| SOP validation | <100ms |
| **Total** | **4-10s** |

## What's Enabled

✅ 8 Section Types
✅ 2 Design Input Methods (screenshot + URL)
✅ 3 or 4 Color Schemes
✅ 5 SOP Validators
✅ Real-time Preview
✅ Code Copy & Download
✅ Validation Reports
✅ Error Recovery
✅ Type Safety
✅ Comprehensive Logging

## What's Coming (Phase 3)

- Unit & Integration Tests
- Performance Optimization
- Batch Generation
- Template History
- Advanced Customization

## Key Resources

- 📖 [README.md](./README.md) - Project overview
- 📚 [QUICKSTART.md](./QUICKSTART.md) - Quick setup
- 🔧 [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guide
- 📋 [docs/PHASE2_SUMMARY.md](./docs/PHASE2_SUMMARY.md) - Technical details

## Summary

**Phase 2 delivers a fully-functional AI-powered template generation system**:

1. Upload design inspiration (screenshot or URL)
2. Configure template options
3. Claude analyzes and generates
4. System validates compliance
5. You get production-ready code

All code follows your SOPs:
- ✅ Proper HTML structure
- ✅ Variable-only colors and fonts
- ✅ Professional vibe styling
- ✅ Complete ID naming convention
- ✅ Detailed validation

**Ready to start generating templates!** 🚀

---

**Need help?** Check the documentation or run `npm run dev` to start the server and try it out!
