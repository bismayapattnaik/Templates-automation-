import { logger } from '../utils/logger.js';
import { ValidationReport, SOPValidationResult } from '../types/index.js';

export class SOPValidator {
  /**
   * Validates template against all SOPs
   */
  validateTemplate(html: string, css: string, js: string): ValidationReport {
    const report: ValidationReport = {
      passed: true,
      sopResults: {},
      errors: [],
      warnings: [],
    };

    // Run all SOP validators
    const sop1Result = this.validateSOP1TemplateCreation(html);
    const sop2Result = this.validateSOP2ColorVariables(css);
    const sop3Result = this.validateSOP3FontVariables(css);
    const sop4Result = this.validateSOP4ProfessionalVibe(css);
    const sop5Result = this.validateSOP5IDStructure(html, js);

    // Aggregate results
    report.sopResults['sop1_template_creation'] = sop1Result;
    report.sopResults['sop2_color_variables'] = sop2Result;
    report.sopResults['sop3_font_variables'] = sop3Result;
    report.sopResults['sop4_professional_vibe'] = sop4Result;
    report.sopResults['sop5_id_structure'] = sop5Result;

    // Check if any failed
    const allPassed = Object.values(report.sopResults).every((r) => r.passed);
    report.passed = allPassed;

    // Collect errors
    Object.entries(report.sopResults).forEach(([sopName, result]) => {
      if (!result.passed && result.violations) {
        result.violations.forEach((violation) => {
          report.errors.push({
            sop: sopName,
            violation: violation.violation,
            location: violation.location,
            suggestion: violation.suggestion,
          });
        });
      }
    });

    logger.info('SOP validation complete', { passed: report.passed, errors: report.errors.length });

    return report;
  }

  /**
   * SOP 1: Template Creation Structure
   */
  private validateSOP1TemplateCreation(html: string): SOPValidationResult {
    const violations: any[] = [];

    // Check for section with proper ID format
    const sectionRegex = /<section[^>]*id="(sec-[a-z0-9]+)"[^>]*>/gi;
    const sections = html.match(sectionRegex) || [];

    if (sections.length === 0) {
      violations.push({
        severity: 'error',
        violation: 'No sections found with sec- prefix ID',
        suggestion: 'Add <section id="sec-xxxxx" data-ai-id="sec-xxxxx">',
      });
    }

    // Check for data-ai-id attributes
    const hasDataAiId = /data-ai-id="[^"]*"/gi.test(html);
    if (!hasDataAiId) {
      violations.push({
        severity: 'error',
        violation: 'Missing data-ai-id attributes on elements',
        suggestion: 'Every element needs data-ai-id="el-xxx"',
      });
    }

    // Check for data-type attributes on main elements
    const elementsWithoutType = html.match(/<(?:div|span|p|h[1-6])[^>]*id="el-[^"]*"(?!.*data-type)/gi) || [];
    if (elementsWithoutType.length > 0) {
      violations.push({
        severity: 'warning',
        violation: `${elementsWithoutType.length} elements missing data-type attribute`,
        suggestion: 'Add data-type="text|html|image|list" to all elements',
      });
    }

    // Check for inline styles
    const inlineStyles = html.match(/style="[^"]*"/gi) || [];
    if (inlineStyles.length > 0) {
      violations.push({
        severity: 'error',
        violation: `${inlineStyles.length} inline style attributes found`,
        suggestion: 'Move all styles to CSS, use classes instead',
      });
    }

    return {
      sop: 'SOP 1: Template Creation',
      passed: violations.length === 0,
      violations: violations.length > 0 ? violations : undefined,
    };
  }

  /**
   * SOP 2: Color Variables
   */
  private validateSOP2ColorVariables(css: string): SOPValidationResult {
    const violations: any[] = [];

    // Check for hardcoded colors (hex)
    const hexColors = css.match(/#[0-9a-f]{6}(?!\s*;)/gi) || [];
    const allowedExceptions = ['0px', '00', '10', '20', '30', '40', '50', '60', '70', '80', '90'];
    const realHexColors = hexColors.filter(
      (color) => !allowedExceptions.some((exc) => color.includes(exc))
    );

    if (realHexColors.length > 0) {
      violations.push({
        severity: 'error',
        violation: `${realHexColors.length} hardcoded hex colors found: ${realHexColors.slice(0, 3).join(', ')}...`,
        suggestion: 'Use var(--color-*) instead of hex codes',
      });
    }

    // Check for rgb/rgba colors
    const rgbColors = css.match(/(?:rgb|rgba)\([^)]*\)/gi) || [];
    const shadowExceptions = rgbColors.filter((color) => !color.includes('box-shadow'));

    if (shadowExceptions.length > 0) {
      violations.push({
        severity: 'error',
        violation: `${shadowExceptions.length} rgb/rgba colors found (except shadows)`,
        suggestion: 'Use var(--color-*) instead of rgb/rgba',
      });
    }

    // Check for CSS variables used
    const hasColorVariables = /var\(--color-[a-z-]*\)/gi.test(css);
    if (!hasColorVariables) {
      violations.push({
        severity: 'error',
        violation: 'No CSS color variables found',
        suggestion: 'Use var(--color-primary), var(--color-accent1), etc.',
      });
    }

    // Check color distribution (estimate)
    const neutralUsage = (css.match(/var\(--color-neutral[^)]*\)/gi) || []).length;
    const primaryUsage = (css.match(/var\(--color-primary[^)]*\)/gi) || []).length;
    // const accent1Usage = (css.match(/var\(--color-accent1[^)]*\)/gi) || []).length; // Reserved for future use

    if (neutralUsage === 0 && primaryUsage === 0) {
      violations.push({
        severity: 'warning',
        violation: 'Color distribution cannot be verified (color variables may be minimal)',
        suggestion: 'Ensure 50% NEUTRAL, 25% PRIMARY, 12% ACCENT1, 8% ACCENT2 distribution',
      });
    }

    return {
      sop: 'SOP 2: Color Variables',
      passed: violations.length === 0,
      violations: violations.length > 0 ? violations : undefined,
    };
  }

  /**
   * SOP 3: Font Variables
   */
  private validateSOP3FontVariables(css: string): SOPValidationResult {
    const violations: any[] = [];

    // Check for hardcoded fonts
    const hardcodedFonts = css.match(/font-family\s*:\s*['"][^'"]+['"]/gi) || [];

    if (hardcodedFonts.length > 0) {
      violations.push({
        severity: 'error',
        violation: `${hardcodedFonts.length} hardcoded font-family values found`,
        suggestion:
          'Use var(--font-heading) and var(--font-body) only, not custom font names',
      });
    }

    // Check for font variables
    const headingFontUsed = /font-family\s*:\s*var\(--font-heading\)/gi.test(css);
    const bodyFontUsed = /font-family\s*:\s*var\(--font-body\)/gi.test(css);

    if (!headingFontUsed && !bodyFontUsed) {
      violations.push({
        severity: 'error',
        violation: 'Font variables not used',
        suggestion: 'Apply var(--font-heading) to h1-h6, var(--font-body) to p, div, span',
      });
    }

    return {
      sop: 'SOP 3: Font Variables',
      passed: violations.length === 0,
      violations: violations.length > 0 ? violations : undefined,
    };
  }

  /**
   * SOP 4: Professional Vibe
   */
  private validateSOP4ProfessionalVibe(css: string): SOPValidationResult {
    const violations: any[] = [];

    // Check for non-zero border-radius
    const roundedCorners = css.match(/border-radius\s*:\s*(?!0px)[^;]*/gi) || [];
    if (roundedCorners.length > 0) {
      violations.push({
        severity: 'error',
        violation: `${roundedCorners.length} non-zero border-radius values found (professional vibe requires 0px)`,
        suggestion: 'Change all border-radius to 0px for sharp corners',
      });
    }

    // Check for transforms (playful effects)
    const transforms = css.match(/transform\s*:\s*(?!none)[^;]*/gi) || [];
    if (transforms.length > 0) {
      violations.push({
        severity: 'error',
        violation: `${transforms.length} CSS transforms found (rotate, scale, translate)`,
        suggestion: 'Use box-shadow elevation only, no transforms for professional vibe',
      });
    }

    // Check for !important (bad practice)
    const important = css.match(/!important/gi) || [];
    if (important.length > 0) {
      violations.push({
        severity: 'warning',
        violation: `${important.length} !important declarations found`,
        suggestion: 'Avoid !important, use proper CSS specificity',
      });
    }

    // Check for animations
    const animations = css.match(/@keyframes|animation\s*:/gi) || [];
    if (animations.length > 0) {
      violations.push({
        severity: 'warning',
        violation: `${animations.length} animation declarations found`,
        suggestion: 'Keep animations minimal for professional appearance',
      });
    }

    return {
      sop: 'SOP 4: Professional Vibe',
      passed: violations.length === 0,
      violations: violations.length > 0 ? violations : undefined,
    };
  }

  /**
   * SOP 5: ID Structure
   */
  private validateSOP5IDStructure(html: string, _js: string): SOPValidationResult {
    const violations: any[] = [];

    // Check ID format
    const idRegex = /id="([^"]*)"/gi;
    const ids: string[] = [];
    let match;

    while ((match = idRegex.exec(html)) !== null) {
      ids.push(match[1]);
    }

    // Validate ID format
    const invalidIds = ids.filter(
      (id) => !id.match(/^(sec|el|stl|scr)-[a-z0-9]+(?:-[a-z0-9]+)*$/)
    );

    if (invalidIds.length > 0) {
      violations.push({
        severity: 'error',
        violation: `${invalidIds.length} invalid ID format(s): ${invalidIds.slice(0, 2).join(', ')}`,
        suggestion: 'Use format: sec-xxxxx, el-xxxxx-desc, stl-xxxxx, scr-xxxxx',
      });
    }

    // Check for id and data-ai-id mismatch
    const idMismatch = (html.match(/id="([^"]*)"\s+data-ai-id="([^"]*)"/gi) || []).filter(
      (match) => {
        const idMatch = match.match(/id="([^"]*)"/);
        const dataAiIdMatch = match.match(/data-ai-id="([^"]*)"/);
        return idMatch && dataAiIdMatch && idMatch[1] !== dataAiIdMatch[1];
      }
    );

    if (idMismatch.length > 0) {
      violations.push({
        severity: 'error',
        violation: `${idMismatch.length} id and data-ai-id mismatch(es)`,
        suggestion: 'id and data-ai-id must have identical values',
      });
    }

    // Check for CTA buttons with data-cta-type
    const ctaButtons = (html.match(/<button[^>]*class="[^"]*btn[^"]*"[^>]*>/gi) || []).filter(
      (btn) => !btn.includes('data-cta-type')
    );

    if (ctaButtons.length > 0) {
      violations.push({
        severity: 'warning',
        violation: `${ctaButtons.length} CTA button(s) missing data-cta-type attribute`,
        suggestion: 'Add data-cta-type="primary|secondary|tertiary" to buttons',
      });
    }

    return {
      sop: 'SOP 5: ID Structure',
      passed: violations.length === 0,
      violations: violations.length > 0 ? violations : undefined,
    };
  }
}

export const sopValidator = new SOPValidator();
export default sopValidator;
