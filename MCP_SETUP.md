# Claude MCP Server Setup & Usage Guide

This document explains how to use the Templates Automation system via Claude's Model Context Protocol (MCP) instead of REST API.

## What is MCP?

**Model Context Protocol (MCP)** enables Claude to directly call tools/functions in your application without HTTP overhead. Claude becomes aware of your tools and can use them intelligently.

**Benefits over REST API:**
- ✅ No HTTP request/response cycles
- ✅ Direct tool invocation from Claude
- ✅ Better context preservation
- ✅ Streaming support for large responses
- ✅ Unified interface for Claude interactions

---

## Architecture

```
┌─────────────────┐
│   Claude Code   │ (Your development environment)
│    or Claude    │
│   Web/Desktop   │
└────────┬────────┘
         │ (stdio/HTTP communication)
         ▼
┌─────────────────────────────────┐
│  MCP Server (templates-automation)│
│  ┌──────────────────────────────┐│
│  │ Tools:                       ││
│  │ - generate_template          ││
│  │ - get_section_types          ││
│  │ - get_sop_instructions       ││
│  └──────────────────────────────┘│
└────────┬────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Core Services                   │
│  - Claude Service (AI)           │
│  - Image Processor               │
│  - SOP Validator                 │
└──────────────────────────────────┘
```

---

## Installation & Setup

### Step 1: Install Dependencies

```bash
cd /home/user/Templates-automation-

# Install Node dependencies (includes @modelcontextprotocol/sdk)
npm install

# Build TypeScript
npm run build
```

### Step 2: Set Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

Required variables:
```bash
ANTHROPIC_API_KEY=sk-ant-...          # Your Claude API key
OLLAMA_BASE_URL=http://localhost:11434  # Ollama server (if using)
NODE_ENV=production
```

### Step 3: Register MCP Server with Claude Code

There are **two ways** to use this MCP server:

#### **Option A: Direct Terminal Usage (Recommended)**

```bash
# Terminal 1: Start the MCP server
npm run start:mcp

# Terminal 2: Start Claude Code and chat with it
claude code
```

Claude Code will automatically detect MCP servers running on stdio.

#### **Option B: Claude Desktop/Web Configuration**

For Claude Desktop or Claude Web, add to your Claude config:

**On macOS/Linux:**
```bash
~/.claude/mcp-config.json
```

**Configuration:**
```json
{
  "mcpServers": {
    "templates-automation": {
      "command": "npm",
      "args": ["run", "start:mcp"],
      "cwd": "/home/user/Templates-automation-",
      "env": {
        "NODE_ENV": "production",
        "ANTHROPIC_API_KEY": "YOUR_API_KEY",
        "OLLAMA_BASE_URL": "http://localhost:11434"
      }
    }
  }
}
```

---

## Using the MCP Tools

Once the MCP server is running, Claude can directly access these tools:

### **Tool 1: generate_template**

Generates a complete HTML/CSS/JS template from design input.

**Example Claude prompt:**
```
Generate a hero section template with the following:
- Design input: [screenshot or URL]
- Current HTML: <section id="sec-hero" data-ai-id="sec-hero"></section>
- Section type: hero
- Template name: hero-design
- Color scheme: 3 colors
- Company vibe: modern, minimalist, professional
```

**Tool call (Claude executes automatically):**
```json
{
  "designInput": {
    "type": "screenshot",
    "data": "data:image/jpeg;base64,..."
  },
  "currentHtml": "<section id=\"sec-hero\">...</section>",
  "templateConfig": {
    "sectionType": "hero",
    "templateName": "hero-design",
    "colorScheme": 3,
    "companyVibe": "modern, minimalist, professional"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "html": "<section id=\"sec-hero2-k8m3\">...</section>",
    "css": "<style>...</style>",
    "js": "<script>...</script>",
    "variables": {
      "colors": { "primary": "#1E4E79", ... },
      "fonts": { "heading": "var(--font-heading)", ... }
    },
    "validation": { "passed": true, ... }
  },
  "metadata": {
    "processingTime": 1234,
    "modelUsed": "claude",
    "mcp": true
  }
}
```

### **Tool 2: get_section_types**

Returns available section types that can be generated.

**Example Claude prompt:**
```
What section types are available?
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "hero",
      "name": "Hero Section",
      "description": "Full-width hero with headline and CTA",
      "elementsTypical": ["heading", "subheading", "cta_button", "background_image"]
    },
    // ... more section types
  ]
}
```

### **Tool 3: get_sop_instructions**

Returns the current SOP (Standard Operating Procedures) instructions.

**Example Claude prompt:**
```
Show me the SOP instructions for template generation.
```

**Response:**
```json
{
  "success": true,
  "data": {
    "SOP1": "HTML Structure Requirements",
    "SOP2": "Color Variable System",
    // ... all SOP instructions
  }
}
```

---

## Complete Workflow Example

### **Scenario: Generate a Features Section**

**Step 1: Start the MCP server**
```bash
npm run start:mcp
```

**Step 2: Open Claude Code**
```bash
claude code
```

**Step 3: Ask Claude to generate a template**

```
I need a features section template. I have a design screenshot to base it on.
The section should:
- Be a 3-column grid layout
- Show 3 feature cards with icons
- Use a clean, modern design
- Color scheme: 3 colors (primary + 2 accents)
- Company vibe: tech startup, modern, professional

Here's my design reference: [paste screenshot or design URL]

Current template structure:
```html
<section id="sec-features" data-ai-id="sec-features"></section>
```
```

**Step 4: Claude executes tools automatically**

Claude will:
1. Call `get_section_types` to verify "features" is available
2. Call `generate_template` with your design and config
3. Show you the generated HTML, CSS, and JavaScript
4. Explain the design choices and color variables used

**Step 5: Use the generated code**

Copy the HTML, CSS, and JS from Claude's response into your project.

---

## Testing the MCP Server

### **Verify Server is Running**

```bash
# Check process is running
ps aux | grep "mcp/server"

# Check logs in terminal where you started it
# Should see: "✅ MCP Server started and connected via stdio"
```

### **Manual Tool Testing (Using Claude CLI)**

If you want to test without Claude Code, you can create a test client:

```bash
# Create a test script that sends JSON to the MCP server
cat > test-mcp.js << 'EOF'
import { spawn } from 'child_process';

const server = spawn('npm', ['run', 'start:mcp']);

// Send a tool request
const request = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list'
};

server.stdin.write(JSON.stringify(request) + '\n');

// Listen for response
server.stdout.on('data', (data) => {
  console.log('Response:', data.toString());
});

setTimeout(() => server.kill(), 5000);
EOF

node test-mcp.js
```

---

## Troubleshooting

### **Issue: MCP Server won't start**

```bash
# Check if dependencies are installed
npm list @modelcontextprotocol/sdk

# If missing, install
npm install

# Check if TypeScript is compiled
npm run build

# Verify file exists
ls -la backend/src/mcp/server.ts
```

### **Issue: Claude can't find the MCP server**

**Solution 1:** Ensure server is running in a terminal before starting Claude Code
```bash
# Terminal 1
npm run start:mcp

# Terminal 2
claude code
```

**Solution 2:** Check environment variables are set
```bash
echo $ANTHROPIC_API_KEY
echo $OLLAMA_BASE_URL
```

**Solution 3:** Check configuration file path
```bash
cat ~/.claude/mcp-config.json  # or your config location
```

### **Issue: Tool execution fails**

Check logs in the MCP server terminal for detailed error messages. Common issues:

- `ANTHROPIC_API_KEY` not set → Set in environment
- Ollama not running → Start Ollama: `ollama serve`
- Invalid design input → Use proper base64 or URL format
- SectionType not recognized → Use one of: hero, features, testimonials, cta, pricing, stats, about, footer

### **Issue: Timeout errors**

MCP server has a 5-minute timeout by default. For large templates:

1. Increase timeout in `claude-config.json`:
   ```json
   "timeout": 600000  // 10 minutes
   ```

2. Restart MCP server

---

## Advanced Usage

### **Batch Template Generation**

Generate multiple templates in one Claude session:

```
I need templates for:
1. Hero section - modern, minimalist (3 colors)
2. Features grid - clean, professional (4 colors)
3. Pricing table - luxury feel (3 colors)
4. Footer - simple, dark (2 colors)

Generate all of these using the design references I provided.
```

Claude will call `generate_template` multiple times and deliver all templates.

### **Custom SOP Requirements**

Ask Claude to generate templates following custom SOPs:

```
Using the SOP instructions, generate a template that:
- Follows all SOP requirements exactly
- Uses only CSS variables for theme colors (no hardcoded)
- Includes proper responsive design
- Has smooth animations and transitions
- Validates against border-radius and transform rules
```

### **Integration with Your Codebase**

Once you have the generated HTML/CSS/JS:

```javascript
// In your application
import generatedTemplate from './generated-hero.json';

export function renderTemplate() {
  return (
    <>
      <div id="template-container">
        {/* Inject the generated HTML */}
        <div dangerouslySetInnerHTML={{ __html: generatedTemplate.html }} />
      </div>
      <style>{generatedTemplate.css}</style>
      <script>{generatedTemplate.js}</script>
    </>
  );
}
```

---

## Comparing REST API vs MCP

| Aspect | REST API | MCP |
|--------|----------|-----|
| **Setup** | Express server + HTTP routes | Single stdio server |
| **Communication** | HTTP requests/responses | JSON-RPC over stdio |
| **Claude Integration** | HTTP calls from Claude | Native tool calls |
| **Latency** | Higher (HTTP overhead) | Lower (direct stdio) |
| **Error Handling** | Standard HTTP status codes | JSON-RPC error objects |
| **Streaming** | ❌ Not ideal | ✅ Better support |
| **Scalability** | Good for multiple clients | Best for single Claude instance |

---

## Next Steps

1. ✅ Start the MCP server: `npm run start:mcp`
2. ✅ Open Claude Code: `claude code`
3. ✅ Ask Claude to generate templates
4. ✅ Copy the generated code to your project
5. ✅ Style and customize as needed

---

## API Reference

For detailed information about each tool, refer to:
- `backend/src/mcp/server.ts` - Tool definitions and implementations
- `TEMPLATE_EXAMPLE.md` - Example output format
- `backend/src/types/index.ts` - TypeScript interfaces

---

## Support

If you encounter issues:

1. Check the MCP server logs (terminal where `npm run start:mcp` is running)
2. Verify environment variables: `env | grep -E "ANTHROPIC|OLLAMA"`
3. Test with Claude directly: Ask it to list available tools
4. Check GitHub issues: https://github.com/anthropics/claude-code/issues

Happy templating! 🎨
