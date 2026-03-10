# ✅ MCP Server Ready - Start Using Now!

Your Templates Automation system is now **MCP-enabled**. You can use Claude directly to generate templates without REST API overhead.

---

## 🚀 Quick Start (Copy & Paste)

### Terminal 1: Start MCP Server
```bash
cd /home/user/Templates-automation-

# First time only: install dependencies
npm install

# Build TypeScript
npm run build

# Start MCP server
npm run start:mcp
```

**Expected output:**
```
✅ MCP Server started and connected via stdio
```

**Keep this terminal open!**

---

### Terminal 2: Use with Claude Code

```bash
# Start Claude Code
claude code
```

---

## 💬 Example: Ask Claude to Generate a Template

In Claude Code, ask:

```
I want you to generate a hero section template. Here's what I need:

Section type: hero
Template name: modern-hero-design
Color scheme: 3 colors
Company vibe: Modern, minimalist, tech startup

Current HTML structure:
<section id="sec-hero" data-ai-id="sec-hero"></section>

Generate the complete HTML, CSS, and JavaScript following all SOPs.
Include proper color variables, animations, and responsive design.
```

**Claude will:**
1. ✅ Call the `generate_template` tool
2. ✅ Process your design requirements
3. ✅ Generate complete HTML/CSS/JS
4. ✅ Return color variables and SOP validation
5. ✅ Show you the result with explanations

---

## 📋 What's New

### Created Files:
```
✅ backend/src/mcp/server.ts          - MCP server with 3 tools
✅ claude-config.json                 - Claude configuration
✅ MCP_SETUP.md                       - Detailed setup guide
✅ MCP_QUICKSTART.md                  - 5-minute quick start
✅ package.json (updated)             - MCP dependencies & scripts
```

### MCP Tools Available:

| Tool | Purpose |
|------|---------|
| **generate_template** | Generate HTML/CSS/JS from design input |
| **get_section_types** | List available section types |
| **get_sop_instructions** | Get SOP rules for compliance |

---

## 🎯 Common Usage Patterns

### Pattern 1: Generate a Features Section
```
Generate a features section with:
- 3 feature cards in a grid
- Each card has icon, title, description
- Color scheme: 4 colors (primary, accent1, accent2, accent3)
- Company vibe: Professional SaaS startup

Return complete HTML, CSS, and JavaScript.
```

### Pattern 2: Generate with Design Reference
```
I'm attaching a screenshot of a design I want to match.

Create a [section-type] section that:
- Looks similar to the design
- Uses 3 colors from the design
- Includes proper animations
- Follows all SOPs

Current structure:
<section id="sec-example"></section>
```

### Pattern 3: Batch Generation
```
Generate 3 templates for me:

1. Hero section - modern, clean (3 colors)
2. Features grid - professional (4 colors)
3. CTA section - conversion-focused (3 colors)

For each, return complete HTML, CSS, and JavaScript.
```

---

## 🔄 Architecture Comparison

### Before (REST API)
```
Claude Code → HTTP Request → Express Server → Claude API → Response
```

### After (MCP)
```
Claude Code → MCP Tool Call → MCP Server → Claude API → Instant Response
```

**Benefits:**
- ✅ No HTTP overhead
- ✅ Direct tool invocation
- ✅ Better context preservation
- ✅ Native Claude integration
- ✅ Streaming support

---

## 📝 Next Steps

### 1. Start the Server
```bash
npm run start:mcp
```

### 2. Open Claude Code
```bash
claude code
```

### 3. Ask for Templates
```
Generate templates using the tools I've set up. Here's what I need...
```

### 4. Copy the Generated Code
- Copy HTML from Claude's response
- Copy CSS from Claude's response
- Copy JavaScript from Claude's response
- Use in your project

### 5. Style & Customize
- Replace `%%PLACEHOLDER%%` variables with actual content
- Adjust colors if needed
- Test responsiveness

---

## 🛠️ Troubleshooting

### Issue: "MCP Server won't start"
```bash
# Check dependencies
npm install

# Build TypeScript
npm run build

# Try again
npm run start:mcp
```

### Issue: "Claude can't find the tools"
- ✅ Ensure Terminal 1 shows "MCP Server started"
- ✅ Check you're using Claude Code (not just chat)
- ✅ Restart Claude Code after server starts

### Issue: "Tool returns empty response"
- ✅ Check environment variables: `echo $ANTHROPIC_API_KEY`
- ✅ Ensure Ollama is running (if using): `ollama serve` in another terminal
- ✅ Check MCP server logs for errors

### Issue: "Timeout on large templates"
- Templates usually take 30-60 seconds
- Wait a bit longer or try simpler designs first

---

## 📚 Documentation

For detailed information:
- **Quick Start:** Read `MCP_QUICKSTART.md` (5 min)
- **Full Setup:** Read `MCP_SETUP.md` (20 min)
- **API Reference:** Check `backend/src/mcp/server.ts`
- **Output Format:** Check `TEMPLATE_EXAMPLE.md`

---

## 🎨 Example Workflow

```bash
# Terminal 1: Start server
npm run start:mcp

# Terminal 2: Start Claude Code
claude code
```

**In Claude Code:**
```
I need a hero section. Generate it with:
- Section type: hero
- Company vibe: modern tech startup
- Colors: 3
- Features:
  - Full-width background
  - Headline + subtext
  - 2 CTA buttons
  - Social icons

Return HTML, CSS, JS that follows all SOPs.
```

**Claude responds with:**
- Complete `<section>` HTML with all required attributes
- Full `<style>` block with animations and responsive design
- `<script>` IIFE wrapper with JavaScript
- Color variables and metadata

**You copy it into your project and customize!**

---

## ✨ Key Features

- ✅ **Direct Integration:** No HTTP requests needed
- ✅ **SOPs Compliance:** Automatic validation against all standards
- ✅ **Complete Output:** HTML + CSS + JS ready to use
- ✅ **Variables:** Color and font variables for theming
- ✅ **Responsive:** Built-in mobile design
- ✅ **Animations:** Smooth entrance animations included
- ✅ **Multiple Sections:** Hero, Features, Testimonials, CTA, Pricing, Stats, About, Footer

---

## 🚀 Ready to Start?

1. **Terminal 1:** `npm run start:mcp`
2. **Terminal 2:** `claude code`
3. **Claude:** Ask for templates
4. **Copy:** Paste into your project
5. **Customize:** Replace placeholders

You're all set! 🎉

---

## Support

If issues persist:
1. Check MCP server terminal for error messages
2. Verify environment variables are set
3. Ensure Ollama is running (if needed)
4. Check `MCP_SETUP.md` for detailed troubleshooting

Happy templating! 🎨✨
