# Complete Template Output Example

This is the EXACT format the system should return. Copy this structure when generating new templates.

## API Response Format

```json
{
  "success": true,
  "data": {
    "html": "<!-- Complete HTML here -->",
    "css": "/* Complete CSS here */",
    "js": "/* Complete JavaScript here */",
    "variables": {
      "colors": {
        "primary": "#1E4E79",
        "accent1": "#5FA8D3",
        "neutral": "#F5F5F5"
      },
      "fonts": {
        "heading": "var(--font-heading)",
        "body": "var(--font-body)"
      }
    },
    "validation": {
      "passed": true,
      "sopResults": {},
      "errors": [],
      "warnings": []
    }
  },
  "metadata": {
    "processingTime": 1234,
    "modelUsed": "ollama",
    "tokenUsage": { "input": 0, "output": 0 }
  }
}
```

---

## HTML Section (Complete)

```html
<section id="sec-hero2-k8m3" data-ai-id="sec-hero2-k8m3" data-section-type="home_hero">
  <!-- Full-bleed background image -->
  <img
    id="el-h2-bg-k8m3"
    data-ai-id="el-h2-bg-k8m3"
    class="h2-bg"
    src="%%HERO_BG_IMAGE%%"
    alt="Hero background"
    data-type="image"
    style="aspect-ratio:16/9;"
  >

  <!-- Dark gradient overlay -->
  <div id="el-h2-overlay-k8m3" data-ai-id="el-h2-overlay-k8m3" class="h2-overlay" data-type="html"></div>

  <!-- Bottom bar: content left, social icons right -->
  <div id="el-h2-bottom-k8m3" data-ai-id="el-h2-bottom-k8m3" class="h2-bottom" data-type="html">
    <!-- LEFT: name, subtext, CTAs -->
    <div id="el-h2-left-k8m3" data-ai-id="el-h2-left-k8m3" class="h2-left" data-type="html">
      <!-- Name: two-tone design -->
      <h1 id="el-h2-name-k8m3" data-ai-id="el-h2-name-k8m3" class="h2-name" data-type="html">
        <span id="el-h2-firstname-k8m3" data-ai-id="el-h2-firstname-k8m3" class="h2-firstname" data-type="text">%%HERO_FIRSTNAME%%</span>
        <span id="el-h2-lastname-k8m3" data-ai-id="el-h2-lastname-k8m3" class="h2-lastname" data-type="text">%%HERO_LASTNAME%%</span>
      </h1>

      <!-- Subtext description -->
      <p id="el-h2-sub-k8m3" data-ai-id="el-h2-sub-k8m3" class="h2-sub" data-type="text">
        %%HERO_SUBTEXT%%
      </p>

      <!-- CTA buttons -->
      <div id="el-h2-ctas-k8m3" data-ai-id="el-h2-ctas-k8m3" class="h2-ctas" data-type="html">
        <button id="el-hero2-cta1" data-ai-id="el-hero2-cta1" data-type="html" data-cta-type="primary" class="hero2-cta-primary">
          <span id="el-hero2-cta1-text" data-ai-id="el-hero2-cta1-text" data-type="text">%%CTA_PRIMARY%%</span>
        </button>
        <button id="el-hero2-cta2" data-ai-id="el-hero2-cta2" data-type="html" data-cta-type="secondary" class="hero2-cta-secondary">
          <span id="el-hero2-cta2-text" data-ai-id="el-hero2-cta2-text" data-type="text">%%CTA_SECONDARY%%</span>
          <span id="el-hero2-arrow" data-ai-id="el-hero2-arrow" data-type="html" class="arrow-icon">→</span>
        </button>
      </div>
    </div>

    <!-- RIGHT: Social icons -->
    <div id="el-h2-socials-k8m3" data-ai-id="el-h2-socials-k8m3" class="h2-socials" data-type="html">
      <!-- Instagram -->
      <a id="el-h2-ig-k8m3" data-ai-id="el-h2-ig-k8m3" class="h2-social-btn h2-social-ig" data-cta-type="social_instagram" href="%%HERO_INSTAGRAM_URL%%" data-type="attrs" aria-label="Instagram">
        <svg id="el-h2-igsvg-k8m3" data-ai-id="el-h2-igsvg-k8m3" data-type="html" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" stroke-width="2"/>
          <circle cx="12" cy="12" r="4" stroke="white" stroke-width="2"/>
          <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
        </svg>
      </a>

      <!-- Twitter -->
      <a id="el-h2-tw-k8m3" data-ai-id="el-h2-tw-k8m3" class="h2-social-btn h2-social-tw" data-cta-type="social_twitter" href="%%HERO_TWITTER_URL%%" data-type="attrs" aria-label="Twitter">
        <svg id="el-h2-twsvg-k8m3" data-ai-id="el-h2-twsvg-k8m3" data-type="html" width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L2.37 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>

      <!-- LinkedIn -->
      <a id="el-h2-li-k8m3" data-ai-id="el-h2-li-k8m3" class="h2-social-btn h2-social-li" data-cta-type="social_linkedin" href="%%HERO_LINKEDIN_URL%%" data-type="attrs" aria-label="LinkedIn">
        <svg id="el-h2-lisvg-k8m3" data-ai-id="el-h2-lisvg-k8m3" data-type="html" width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      </a>
    </div>
  </div>
</section>
```

---

## CSS Section (Complete)

```css
<style id="stl-hero2-k8m3" data-ai-id="stl-hero2-k8m3">

/* ═════════════════════════════════════════════════════ */
/* RESET & BASE STYLES                                  */
/* ═════════════════════════════════════════════════════ */

#sec-hero2-k8m3 *,
#sec-hero2-k8m3 *::before,
#sec-hero2-k8m3 *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ═════════════════════════════════════════════════════ */
/* SECTION CONTAINER                                    */
/* ═════════════════════════════════════════════════════ */

#sec-hero2-k8m3 {
  position: relative;
  width: 100%;
  height: 78vh;
  min-height: 520px;
  max-height: 860px;
  border-radius: 0px;
  overflow: hidden;
  background-color: var(--color-neutral-darkest);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

/* ═════════════════════════════════════════════════════ */
/* BACKGROUND IMAGE                                     */
/* ═════════════════════════════════════════════════════ */

#sec-hero2-k8m3 .h2-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 15%;
  display: block;
  z-index: 0;
  opacity: 0;
  transition: opacity 1.1s ease;
}

/* ═════════════════════════════════════════════════════ */
/* DARK GRADIENT OVERLAY                                */
/* ═════════════════════════════════════════════════════ */

#sec-hero2-k8m3 .h2-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(
      to top,
      rgba(26, 26, 26, 0.96) 0%,
      rgba(26, 26, 26, 0.72) 22%,
      rgba(26, 26, 26, 0.22) 50%,
      transparent 72%
    ),
    linear-gradient(
      to right,
      rgba(26, 26, 26, 0.55) 0%,
      transparent 42%
    );
  pointer-events: none;
}

/* ═════════════════════════════════════════════════════ */
/* BOTTOM CONTENT BAR                                   */
/* ═════════════════════════════════════════════════════ */

#sec-hero2-k8m3 .h2-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 6% 44px 6%;
  gap: 20px;
}

/* ═════════════════════════════════════════════════════ */
/* LEFT COLUMN (NAME, TEXT, BUTTONS)                    */
/* ═════════════════════════════════════════════════════ */

#sec-hero2-k8m3 .h2-left {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 580px;
}

/* HEADING */

#sec-hero2-k8m3 .h2-name {
  font-size: clamp(3.2rem, 7vw, 7.5rem);
  line-height: 1.0;
  letter-spacing: -0.025em;
  margin-bottom: 16px;
  display: block;
  font-weight: 700;
}

#sec-hero2-k8m3 .h2-firstname {
  font-family: var(--font-heading);
  font-weight: 900;
  color: var(--color-neutral-lightest);
  display: inline;
  margin-right: 0.2em;
}

#sec-hero2-k8m3 .h2-lastname {
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 400;
  font-style: italic;
  color: rgba(210, 218, 230, 0.48);
  display: inline;
  letter-spacing: -0.01em;
}

/* SUBTEXT */

#sec-hero2-k8m3 .h2-sub {
  font-size: clamp(0.82rem, 1.05vw, 0.94rem);
  line-height: 1.68;
  color: rgba(195, 205, 220, 0.65);
  max-width: 420px;
  font-weight: 400;
  margin-bottom: 28px;
  font-family: var(--font-body);
}

/* ═════════════════════════════════════════════════════ */
/* CTA BUTTONS                                          */
/* ═════════════════════════════════════════════════════ */

#sec-hero2-k8m3 .h2-ctas {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

/* Primary Button */

#sec-hero2-k8m3 .hero2-cta-primary {
  font-family: var(--font-heading);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 13px 28px;
  background: var(--color-neutral-lightest);
  color: var(--color-neutral-darkest);
  border: none;
  border-radius: 0px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  transition: background 0.22s ease, color 0.22s ease;
}

#sec-hero2-k8m3 .hero2-cta-primary:hover {
  background: rgba(255, 255, 255, 0.85);
}

#sec-hero2-k8m3 .hero2-cta-primary:focus {
  outline: 2px solid rgba(255, 255, 255, 0.6);
  outline-offset: 3px;
}

/* Secondary Button */

#sec-hero2-k8m3 .hero2-cta-secondary {
  font-family: var(--font-heading);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 13px 28px;
  background: transparent;
  color: var(--color-neutral-lightest);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 0px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  white-space: nowrap;
  transition: border-color 0.22s ease, background 0.22s ease;
}

#sec-hero2-k8m3 .hero2-cta-secondary:hover {
  border-color: rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.06);
}

#sec-hero2-k8m3 .hero2-cta-secondary:focus {
  outline: 2px solid rgba(255, 255, 255, 0.4);
  outline-offset: 3px;
}

#sec-hero2-k8m3 .arrow-icon {
  font-size: 1rem;
  line-height: 1;
  display: inline-block;
  transition: transform 0.18s ease;
}

#sec-hero2-k8m3 .hero2-cta-secondary:hover .arrow-icon {
  transform: translateX(5px);
}

/* ═════════════════════════════════════════════════════ */
/* SOCIAL ICONS                                         */
/* ═════════════════════════════════════════════════════ */

#sec-hero2-k8m3 .h2-socials {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  flex-shrink: 0;
}

#sec-hero2-k8m3 .h2-social-btn {
  width: 52px;
  height: 52px;
  border-radius: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease, box-shadow 0.2s ease;
  flex-shrink: 0;
  border: none;
}

#sec-hero2-k8m3 .h2-social-btn:hover {
  opacity: 0.88;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
}

#sec-hero2-k8m3 .h2-social-btn:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 3px;
}

/* Instagram — Brand colors */
#sec-hero2-k8m3 .h2-social-ig {
  background: linear-gradient(135deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%);
}

/* Twitter — Dark */
#sec-hero2-k8m3 .h2-social-tw {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

/* LinkedIn — Brand blue */
#sec-hero2-k8m3 .h2-social-li {
  background: #0a66c2;
}

/* ═════════════════════════════════════════════════════ */
/* ENTRANCE ANIMATIONS                                  */
/* ═════════════════════════════════════════════════════ */

#sec-hero2-k8m3 .h2-name {
  opacity: 0;
  transform: translateY(24px);
  animation: h2FadeUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.2s;
}

#sec-hero2-k8m3 .h2-sub {
  opacity: 0;
  transform: translateY(16px);
  animation: h2FadeUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.6s;
}

#sec-hero2-k8m3 .h2-ctas {
  opacity: 0;
  transform: translateY(14px);
  animation: h2FadeUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.85s;
}

#sec-hero2-k8m3 .h2-socials {
  opacity: 0;
  transform: translateY(12px);
  animation: h2FadeUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards 1s;
}

@keyframes h2FadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ═════════════════════════════════════════════════════ */
/* RESPONSIVE DESIGN                                    */
/* ═════════════════════════════════════════════════════ */

@media (max-width: 860px) {
  #sec-hero2-k8m3 {
    height: auto;
    min-height: 100svh;
    max-height: none;
    border-radius: 0px;
  }

  #sec-hero2-k8m3 .h2-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 28px;
    padding: 0 28px 40px;
  }

  #sec-hero2-k8m3 .h2-socials {
    align-self: flex-end;
  }

  #sec-hero2-k8m3 .h2-name {
    font-size: clamp(2.8rem, 10vw, 5rem);
  }
}

@media (max-width: 480px) {
  #sec-hero2-k8m3 {
    border-radius: 0px;
  }

  #sec-hero2-k8m3 .h2-ctas {
    flex-direction: column;
    max-width: 240px;
  }

  #sec-hero2-k8m3 .hero2-cta-primary,
  #sec-hero2-k8m3 .hero2-cta-secondary {
    width: 100%;
  }

  #sec-hero2-k8m3 .h2-bottom {
    padding: 0 16px 32px;
  }
}

</style>
```

---

## JavaScript Section (Complete)

```javascript
<script id="scr-hero2-k8m3" data-ai-id="scr-hero2-k8m3">
(function () {
  'use strict';

  // Get section element
  var sec = document.getElementById('sec-hero2-k8m3');
  if (!sec) return;

  // Fade-in background image on load
  var bg = sec.querySelector('.h2-bg');
  if (bg) {
    function fadeInBg() {
      bg.style.opacity = '1';
    }

    // Load event
    bg.addEventListener('load', fadeInBg);

    // If already loaded
    if (bg.complete && bg.naturalWidth) {
      fadeInBg();
    }
  }

  // Optional: Add smooth scroll behavior
  var ctaButtons = sec.querySelectorAll('[data-cta-type]');
  ctaButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      // Design-only - no navigation logic
      console.log('CTA clicked:', btn.getAttribute('data-cta-type'));
    });
  });
})();
</script>
```

---

## CSS Variables Definition

Add this to your global stylesheet or main `<style>` tag:

```css
:root {
  /* Fonts */
  --font-heading: 'Poppins', 'Inter', sans-serif;
  --font-body: 'Source Serif Pro', Georgia, serif;

  /* Primary Colors (25%) */
  --color-primary: #1E4E79;
  --color-primary-dark: #163B5C;
  --color-primary-light: #6F97BD;

  /* Accent 1 (12%) */
  --color-accent1: #5FA8D3;
  --color-accent1-dark: #4B85A7;

  /* Accent 2 (8%) */
  --color-accent2: #12263A;
  --color-accent2-dark: #0D1C2B;

  /* Accent 3 (5%) */
  --color-accent3: #FF9800;

  /* Neutral (50%) */
  --color-neutral-lightest: #F5F5F5;
  --color-neutral-lighter: #EBEBEB;
  --color-neutral-light: #CCCCCC;
  --color-neutral: #999999;
  --color-neutral-dark: #333333;
  --color-neutral-darkest: #1A1A1A;

  /* Shadows */
  --shadow-sm: 0px 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0px 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0px 4px 16px rgba(0, 0, 0, 0.12);
}
```

---

## Key Points for Generation

✅ **DO:**
- Include all `id`, `data-ai-id`, `data-type` attributes
- Use `%%PLACEHOLDER%%` format for all text content
- Put CSS in `<style id="stl-xxx">` block
- Put JS in `<script id="scr-xxx">` IIFE wrapper
- Use CSS variables for primary colors
- Allow brand colors (social buttons, gradients) to be hardcoded
- Include responsive design with `@media` queries
- Add smooth animations and hover states
- Semantic HTML structure

❌ **DON'T:**
- Hardcode primary/neutral colors (use variables)
- Mix CSS in HTML (style attributes)
- Use `!important` anywhere
- Put form handlers or navigation logic in JS
- Forget `data-type="html"` or `data-type="text"` attributes
- Use rounded corners (except special design needs)
- Return raw HTML - must be in JSON format with html/css/js fields
