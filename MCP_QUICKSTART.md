# MCP Quick Start (5 Minutes)

Use Claude MCP instead of REST API for template generation.

## What You'll Do

1. ✅ Install dependencies
2. ✅ Start MCP server
3. ✅ Chat with Claude
4. ✅ Get templates generated instantly

---

## Step 1: Install & Build

```bash
cd /home/user/Templates-automation-

# Install dependencies
npm install

# Build TypeScript (includes MCP server)
npm run build
```

---

## Step 2: Set Environment Variables

```bash
# Copy environment file
cp .env.example .env

# Edit if needed
nano .env
```

Make sure you have:
```
ANTHROPIC_API_KEY=sk-ant-...
OLLAMA_BASE_URL=http://localhost:11434
```

---

## Step 3: Start MCP Server

**In Terminal 1:**
```bash
npm run start:mcp
```

You should see:
```
✅ MCP Server started and connected via stdio
```

**Keep this terminal open!**

---

## Step 4: Use with Claude Code

**In Terminal 2:**
```bash
claude code
```

---

## Step 5: Ask Claude to Generate Templates

In Claude Code (or Claude Web/Desktop with this MCP server configured), ask:

```
Generate a hero section template with:
- Section type: hero
- Template name: modern-hero
- Color scheme: 3 colors
- Company vibe: modern, clean, tech
- Current HTML: <section id="sec-hero" data-ai-id="sec-hero"></section>

Use a professional design with gradient background and CTA buttons.
```

Claude will:
1. ✅ List available section types
2. ✅ Generate complete HTML/CSS/JS
3. ✅ Show you the color variables
4. ✅ Validate against SOPs
5. ✅ Return everything as structured code

---

## What You Get

```json
{
  "html": "<section id=\"sec-hero2-xxx\">...</section>",
  "css": "<style>...</style>",
  "js": "<script>...</script>",
  "variables": {
    "colors": { "primary": "#1E4E79", ... },
    "fonts": { "heading": "...", "body": "..." }
  }
}
```

Copy this directly into your project!

---

## Common Prompts

### Generate a Features Section
```
Create a features section with:
- 3-column grid layout
- 3 feature cards with icons
- Color scheme: 4 colors
- Company vibe: startup, modern
```

### Generate a Pricing Table
```
Generate a pricing section with:
- 3 pricing tiers
- Feature comparison
- CTA buttons
- Color scheme: 3 colors
- Modern, clean design
```

### Generate with Design Reference
```
I have a design screenshot. Generate a [section-type] section that matches it.
Color scheme: 3 colors
Company vibe: [your-style]
```

---

## Stop the Server

When done:
```bash
# In the MCP server terminal
Ctrl+C
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "MCP Server won't start" | Make sure `npm run build` completed successfully |
| "Claude can't find tools" | Ensure Terminal 1 still shows the MCP server running |
| "Tool execution fails" | Check environment variables are set: `env \| grep ANTHROPIC` |
| "Timeout errors" | Design generation is taking too long - try simpler designs first |

---

## Next

For detailed info, see `MCP_SETUP.md`.

Happy templating! 🎨
