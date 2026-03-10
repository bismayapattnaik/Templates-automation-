# Template Automation System - Complete Blueprint

## 🎯 System Architecture

### **Core Flow**
```
User → Frontend UI → Backend (Claude) → Generated Template → Preview & Download
```

### **Technology Stack**
- **Frontend**: HTML, CSS, JavaScript (Vanilla or Fetch API)
- **Backend**: Express.js + Claude Haiku 4.5 API
- **Image Processing**: Sharp (for screenshot analysis)
- **Environment**: Node.js 18+

---

## 📊 Backend API Design

### **Endpoint 1: Generate Section**
```
POST /api/generate-section
Content-Type: multipart/form-data

Input:
{
  "design_image": <file>,           // Screenshot of design to replicate
  "section_type": "hero",           // hero|stats|course-list|testimonial|about|course-store|course-hero|course-plan|circular-benefits|course-feedback
  "style_preference": "professional" // professional|playful
}

Output:
{
  "success": true,
  "data": {
    "html": "<section>...</section>",
    "css": "<style>...</style>",
    "js": "<script>...</script>",
    "variables_list": ["%%HERO_HEADING%%", "%%HERO_IMAGE1%%", ...],
    "variables_reference": {...}
  }
}
```

### **Endpoint 2: Health Check**
```
GET /api/health

Output:
{
  "status": "ok",
  "timestamp": "2026-03-10T...",
  "claude_model": "claude-haiku-4.5"
}
```

---

## 🧠 Claude Prompt for Backend

The backend will send this comprehensive prompt to Claude Haiku:

```
You are a senior frontend template engineer. Your task is to:

1. ANALYZE the uploaded design screenshot
   - Identify layout structure
   - Extract visual hierarchy
   - Note spacing, alignment, card structures
   - Identify color usage patterns
   - List all content blocks

2. GENERATE HTML following these SOPs STRICTLY:
   [Include all the SOPs provided]

3. OUTPUT format:
   {
     "html": "...",
     "css": "...",
     "js": "...",
     "variables": ["%%VAR1%%", "%%VAR2%%", ...]
   }

MANDATORY RULES:
✅ MUST use data-ai-id on EVERY element
✅ MUST use CSS variables ONLY (no hardcoded colors)
✅ MUST follow ID naming: sec-*, el-*, stl-*, scr-*
✅ MUST use %%VARIABLE%% format for all text
✅ MUST have sharp corners (border-radius: 0px)
✅ MUST be responsive (640px, 1024px breakpoints)
✅ MUST include hover states but NO transforms
✅ NO %> closing tags in JavaScript
✅ NO button click handlers
```

---

## 💻 Frontend UI Design

### **Page Structure**
```
header
├─ Logo
└─ Title: "Template Automation"

main
├─ Left Panel (Input)
│  ├─ Upload Screenshot (drag & drop)
│  ├─ Section Type Selector (dropdown)
│  ├─ Style Preference (radio: professional/playful)
│  └─ Generate Button
│
├─ Middle Panel (Live Preview)
│  └─ <iframe> showing generated HTML
│
└─ Right Panel (Code)
   ├─ HTML Tab
   ├─ CSS Tab
   ├─ JS Tab
   ├─ Variables Tab
   └─ Copy/Download buttons

footer
└─ Status messages
```

### **Form Fields**
```
1. Design Screenshot Upload
   - Accept: image/jpeg, image/png, image/webp
   - Drag & drop area
   - Preview thumbnail

2. Section Type Dropdown
   Options:
   - Hero
   - Stats
   - Course List
   - Testimonial
   - About
   - Lead Gen
   - Course Store
   - Course Hero
   - Course Plan
   - Circular Benefits
   - Course Feedback

3. Style Preference
   - Professional (sharp, minimal)
   - Playful (rounded, animated)

4. Generate Button
   - Shows loading state
   - Disabled while processing
```

---

## 🔧 Backend Implementation Plan

### **File Structure**
```
backend/src/
├─ index.ts                 # Express server setup
├─ config/
│  ├─ environment.ts       # ENV variables
│  └─ anthropic.ts         # Claude client setup
├─ controllers/
│  └─ template.controller.ts   # API handlers
├─ services/
│  ├─ claude.service.ts    # Claude API integration
│  └─ imageProcessor.ts    # Screenshot analysis
├─ types/
│  ├─ index.ts             # TypeScript interfaces
│  └─ sop.types.ts         # SOP-related types
└─ utils/
   └─ logger.ts            # Logging

uploads/                    # Temporary image storage
dist/                       # Compiled JavaScript
```

### **Key Services**

#### **1. Claude Service** (`backend/src/services/claude.service.ts`)
```typescript
class ClaudeService {
  async generateTemplate(
    imageBase64: string,
    sectionType: string,
    stylePreference: string
  ): Promise<GeneratedTemplate> {
    // 1. Encode image to base64
    // 2. Create comprehensive SOP prompt
    // 3. Call Claude API with vision capability
    // 4. Parse JSON response
    // 5. Validate HTML/CSS/JS
    // 6. Return structured output
  }
}
```

#### **2. Image Processor** (`backend/src/services/imageProcessor.ts`)
```typescript
class ImageProcessor {
  async processScreenshot(filePath: string): Promise<Buffer> {
    // 1. Validate image format & size
    // 2. Resize if needed (max 4096x4096)
    // 3. Convert to base64
    // 4. Return for Claude API
  }
}
```

#### **3. Template Controller** (`backend/src/controllers/template.controller.ts`)
```typescript
// POST /api/generate-section
async function generateSection(req, res) {
  // 1. Validate request (file, section_type, style)
  // 2. Process uploaded image
  // 3. Call ClaudeService
  // 4. Return formatted response
  // 5. Store generated template (optional)
}
```

---

## 🎨 Frontend Implementation Steps

### **Step 1: Build Form UI**
- Create form with all inputs
- Add drag & drop for image upload
- Show file preview
- Add submit button

### **Step 2: Handle Form Submission**
```javascript
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('design_image', imageFile);
  formData.append('section_type', sectionType.value);
  formData.append('style_preference', stylePreference.value);

  const response = await fetch('/api/generate-section', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  displayResults(result.data);
});
```

### **Step 3: Display Results**
- Show generated HTML in code editor (or syntax-highlighted `<pre>`)
- Show CSS separately
- Show JS separately
- List all variables used
- Enable copy & download

### **Step 4: Live Preview**
```javascript
// Create iframe and inject generated HTML
const iframe = document.createElement('iframe');
iframe.srcDoc = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        ${generatedCSS}
        ${globalStyles} /* Include global color/font variables */
      </style>
    </head>
    <body>
      ${generatedHTML}
      <script>
        ${generatedJS}
      </script>
    </body>
  </html>
`;
```

---

## 🚀 Implementation Checklist

### **Phase 1: Backend Setup**
- [ ] Create `/api/generate-section` endpoint
- [ ] Integrate Claude Haiku 4.5 API
- [ ] Set up image upload handling (multer)
- [ ] Add error handling & validation
- [ ] Test with sample screenshots

### **Phase 2: Frontend Setup**
- [ ] Create form UI (upload, dropdowns, buttons)
- [ ] Implement form submission logic
- [ ] Add image preview
- [ ] Create results display (HTML/CSS/JS tabs)
- [ ] Add copy & download functionality

### **Phase 3: Integration**
- [ ] Connect frontend to backend API
- [ ] Test full flow (upload → generate → display)
- [ ] Add loading states & spinners
- [ ] Add error messages & validation feedback
- [ ] Test with all section types

### **Phase 4: Polish**
- [ ] Live preview in iframe
- [ ] Code syntax highlighting
- [ ] Mobile responsiveness
- [ ] Accessibility improvements
- [ ] Performance optimization

---

## 📝 API Response Format

```json
{
  "success": true,
  "data": {
    "html": "<section id=\"sec-a1b2c3\" data-ai-id=\"sec-a1b2c3\" data-section-type=\"hero\">...</section>",
    "css": "<style id=\"stl-a1b2c3\" data-ai-id=\"stl-a1b2c3\">...</style>",
    "js": "<script id=\"scr-a1b2c3\" data-ai-id=\"scr-a1b2c3\">...</script>",
    "variables_list": [
      "%%HERO_HEADING%%",
      "%%HERO_DESCRIPTION%%",
      "%%HERO_IMAGE1%%",
      "%%CTA_TEXT%%"
    ],
    "variables_reference": {
      "%%HERO_HEADING%%": {
        "type": "text",
        "element": "h1",
        "purpose": "Main headline"
      }
    }
  }
}
```

---

## 🔐 Security Considerations

- ✅ Validate file type (only images)
- ✅ Limit file size (< 5MB)
- ✅ Sanitize file names
- ✅ Store uploads in secure temp directory
- ✅ Clean up uploaded files after processing
- ✅ Rate limit API calls
- ✅ Validate API key in .env (never expose)

---

## 📦 Environment Variables (.env)

```bash
# Already configured:
ANTHROPIC_API_KEY=sk-ant-api03-...
CLAUDE_MODEL=claude-haiku-4.5
PORT=3000
NODE_ENV=development

# Add for uploads:
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
ALLOWED_MIMETYPES=image/jpeg,image/png,image/webp
```

---

## 🧪 Testing Workflow

1. **Test Screenshot 1**: Home Hero Section
   - Upload hero design screenshot
   - Select "Hero"
   - Verify output has all required attributes

2. **Test Screenshot 2**: Course List Section
   - Upload course card design
   - Select "Course List"
   - Check if responsive grid generated

3. **Test Screenshot 3**: Different Style
   - Upload screenshot
   - Toggle "Playful" style
   - Verify rounded corners & animations

---

## ✅ Validation Rules (Before Delivery)

- [ ] All elements have `id` and `data-ai-id`
- [ ] All elements have `data-type` attribute
- [ ] All text in `%%VARIABLES%%` format
- [ ] NO hardcoded colors (use `var(--*)`)
- [ ] NO hardcoded fonts (use `var(--font-*)`)
- [ ] `border-radius: 0px` (professional)
- [ ] Hover states without transforms
- [ ] Mobile breakpoints (640px, 1024px)
- [ ] NO `%>` closing tags in JS
- [ ] NO button click handlers

---

## 🎓 Resources

- [Claude API Docs](https://anthropic.com/docs)
- [Vision Capability](https://anthropic.com/docs/vision)
- [Express.js Guide](https://expressjs.com/)
- [Multer File Upload](https://github.com/expressjs/multer)

---

**Ready to implement?** Next steps:
1. Build backend endpoint
2. Create frontend UI
3. Test end-to-end
4. Deploy!
