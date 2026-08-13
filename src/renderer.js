// StoreCraft Studio — Browser-side renderer
// This script runs in the Playwright-controlled browser context.
// It exposes a global API that the MCP server / CLI can call via page.evaluate().

import { CanvasRenderer } from './canvas.js';
import { PRESETS, COLOR_THEMES } from './presets.js';

// Expose globally for Playwright interaction
window.StoreCraft = {
  renderer: null,
  canvas: null,

  init() {
    this.canvas = document.getElementById('render-canvas');
    this.renderer = new CanvasRenderer(this.canvas);
    console.log('[StoreCraft] Renderer initialized');
    return { ready: true, presets: Object.keys(PRESETS), themes: COLOR_THEMES.map(t => ({ id: t.id, name: t.name })) };
  },

  async renderSlide(slideConfig, scale = 2) {
    if (!this.renderer) this.init();

    // Resolve image URLs to absolute paths if they are relative
    const resolved = { ...slideConfig };
    if (resolved.screenshotUrl && !resolved.screenshotUrl.startsWith('http') && !resolved.screenshotUrl.startsWith('file:') && !resolved.screenshotUrl.startsWith('data:')) {
      resolved.screenshotUrl = window.location.origin + resolved.screenshotUrl;
    }
    if (resolved.screenshotUrl2 && !resolved.screenshotUrl2.startsWith('http') && !resolved.screenshotUrl2.startsWith('file:') && !resolved.screenshotUrl2.startsWith('data:')) {
      resolved.screenshotUrl2 = window.location.origin + resolved.screenshotUrl2;
    }
    if (resolved.screenshotUrl3 && !resolved.screenshotUrl3.startsWith('http') && !resolved.screenshotUrl3.startsWith('file:') && !resolved.screenshotUrl3.startsWith('data:')) {
      resolved.screenshotUrl3 = window.location.origin + resolved.screenshotUrl3;
    }

    await this.renderer.render(resolved, { scale });

    const dataUrl = this.canvas.toDataURL('image/png');
    return dataUrl.replace(/^data:image\/png;base64,/, '');
  },

  getPresets() {
    return PRESETS;
  },

  getThemes() {
    return COLOR_THEMES;
  },

  createSlideFromTemplate(template) {
    // Merge template with sensible defaults
    const preset = PRESETS[template.presetId || 'marketplace-hero-1080p'];
    const theme = COLOR_THEMES.find(t => t.id === (template.themeId || 'swiss-light')) || COLOR_THEMES[0];

    return {
      id: 'slide_' + Math.random().toString(36).substring(2, 9),
      name: template.name || 'Untitled Design',
      presetId: preset.id,
      width: template.width || preset.width,
      height: template.height || preset.height,

      // Background
      bgType: template.bgType || theme.bgType || 'solid',
      bgAngle: template.bgAngle || theme.bgAngle || 135,
      bgColor1: template.bgColor1 || theme.bgColor1 || '#fbfaf7',
      bgColor2: template.bgColor2 || theme.bgColor2 || '#f4f1ea',
      gridEnabled: template.gridEnabled !== undefined ? template.gridEnabled : true,
      gridSize: template.gridSize || 28,
      gridColor: template.gridColor || theme.gridColor || 'rgba(24, 32, 47, 0.04)',

      // Accent and styling
      accentColor: template.accentColor || theme.accentColor || '#d97706',
      accentColor2: template.accentColor2 || theme.accentColor2 || '#b45309',
      accentLight: template.accentLight || theme.accentLight || '#fef3c7',
      textColor: template.textColor || theme.textColor || '#18202f',
      subtitleColor: template.subtitleColor || theme.subtitleColor || '#5f6e85',
      cardBg: template.cardBg || theme.cardBg || '#ffffff',
      cardBorder: template.cardBorder || theme.cardBorder || '#e4dfd5',

      // Window frame
      frameStyle: template.frameStyle || 'macos',
      framePadding: template.framePadding || 56,
      frameCornerRadius: template.frameCornerRadius || 10,
      frameBg: template.frameBg || theme.frameBg || '#ffffff',
      frameBorder: template.frameBorder || theme.frameBorder || '#e4dfd5',
      frameHeaderBg: template.frameHeaderBg || theme.frameHeaderBg || '#f4f1ea',
      frameShadowBlur: template.frameShadowBlur || 30,
      frameShadowColor: template.frameShadowColor || theme.shadowColor || 'rgba(24, 32, 47, 0.08)',

      // Screenshot
      screenshotUrl: template.screenshotUrl || null,
      screenshotUrl2: template.screenshotUrl2 || null,
      screenshotUrl3: template.screenshotUrl3 || null,
      caption1: template.caption1 || '',
      caption2: template.caption2 || '',
      caption3: template.caption3 || '',
      screenshotFit: template.screenshotFit || 'contain',
      screenshotScale: template.screenshotScale || 100,
      screenshotOffsetX: template.screenshotOffsetX || 0,
      screenshotOffsetY: template.screenshotOffsetY || 0,

      // Layout
      layoutMode: template.layoutMode || 'hero-centered',

      // Typography
      kicker: template.kicker || '',
      headline: template.headline || template.name || 'Design Title',
      headlineFontSize: template.headlineFontSize || 48,
      headlineFontFamily: template.headlineFontFamily || 'Inter',
      headlineColor: template.headlineColor || theme.textColor || '#18202f',
      headlineGradientEnabled: template.headlineGradientEnabled || false,
      headlineGradientColor2: template.headlineGradientColor2 || theme.accentColor || '#d97706',
      headlineAlign: template.headlineAlign || 'center',

      subtitle: template.subtitle || '',
      subtitleFontSize: template.subtitleFontSize || 18,
      subtitleFontFamily: template.subtitleFontFamily || 'Inter',
      subtitleColor: template.subtitleColor || theme.subtitleColor || '#5f6e85',
      subtitleAlign: template.subtitleAlign || 'center',

      // Badges
      badges: template.badges || [],
      badgesPosition: template.badgesPosition || 'top',

      // Callouts
      callouts: template.callouts || []
    };
  }
};

// Auto-initialize when page loads
window.StoreCraft.init();
