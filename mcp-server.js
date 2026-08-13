// StoreCraft Studio — MCP Server
// Exposes design tools to AI agents via Model Context Protocol

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const TEMPLATES_DIR = join(__dirname, 'templates');
const OUTPUT_DIR = join(__dirname, 'output');

if (!existsSync(TEMPLATES_DIR)) mkdirSync(TEMPLATES_DIR, { recursive: true });
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

const { PRESETS, COLOR_THEMES } = await import('./src/presets.js');

const server = new McpServer({
  name: 'storecraft-studio',
  version: '1.0.0',
});

// Tool: list_presets
server.tool(
  'list_presets',
  'List all available design presets (sizes/platforms)',
  {},
  async () => {
    const categories = {};
    for (const [id, preset] of Object.entries(PRESETS)) {
      if (!categories[preset.category]) categories[preset.category] = [];
      categories[preset.category].push({ id, name: preset.name, width: preset.width, height: preset.height, description: preset.description });
    }
    return {
      content: [{ type: 'text', text: JSON.stringify(categories, null, 2) }],
    };
  }
);

// Tool: list_themes
server.tool(
  'list_themes',
  'List all available color themes',
  {},
  async () => {
    const themes = COLOR_THEMES.map(t => ({ id: t.id, name: t.name, bgType: t.bgType }));
    return {
      content: [{ type: 'text', text: JSON.stringify(themes, null, 2) }],
    };
  }
);

// Tool: render_design
server.tool(
  'render_design',
  'Render a design from a JSON config to a high-res PNG file',
  {
    config: z.object({
      preset: z.string().optional().describe('Preset ID (e.g. "marketplace-hero-1080p") sets width/height'),
      width: z.number().optional().describe('Canvas width in px (overrides preset)'),
      height: z.number().optional().describe('Canvas height in px (overrides preset)'),
      theme: z.string().optional().describe('Theme ID (e.g. "swiss-dark") applies color palette'),
      layout: z.string().optional().describe('Layout mode: split-feature-right, hero-centered, full-window, three-card-gallery, side-by-side-cards, widescreen-showcase'),
      headline: z.string().optional().describe('Main headline text'),
      subtitle: z.string().optional().describe('Subtitle / description text'),
      kicker: z.string().optional().describe('Small kicker tag above headline'),
      badges: z.array(z.object({
        text: z.string(),
        bg: z.string().optional(),
        color: z.string().optional(),
      })).optional().describe('Array of badge pills'),
      callouts: z.array(z.object({
        icon: z.string().optional(),
        title: z.string(),
        desc: z.string().optional(),
      })).optional().describe('Array of feature callout cards'),
      screenshotUrl: z.string().optional().describe('URL or file path to main screenshot image'),
      screenshotUrl2: z.string().optional().describe('URL or file path to second screenshot'),
      screenshotUrl3: z.string().optional().describe('URL or file path to third screenshot'),
      frameTitle: z.string().optional().describe('Window frame title bar text'),
      caption1: z.string().optional().describe('Caption below first card/screenshot'),
      caption2: z.string().optional().describe('Caption below second card'),
      caption3: z.string().optional().describe('Caption below third card'),
      gridEnabled: z.boolean().optional().describe('Show technical grid pattern (default true)'),
      framePadding: z.number().optional().describe('Outer padding in px (default 56)'),
    }).describe('The full design configuration'),
    outputPath: z.string().optional().describe('Output file path (default: output/design-<timestamp>.png)'),
    scale: z.number().optional().describe('Render scale factor (default 2 for high-DPI)'),
  },
  async ({ config, outputPath, scale }) => {
    try {
      const { chromium } = await import('playwright');
      const fs = await import('fs');
      const path = await import('path');

      // Resolve preset dimensions
      let slideConfig = { ...config };
      if (config.preset && PRESETS[config.preset]) {
        const preset = PRESETS[config.preset];
        slideConfig.width = config.width || preset.width;
        slideConfig.height = config.height || preset.height;
      }
      slideConfig.width = slideConfig.width || 1920;
      slideConfig.height = slideConfig.height || 1080;

      // Apply theme colors
      if (config.theme) {
        const theme = COLOR_THEMES.find(t => t.id === config.theme);
        if (theme) {
          slideConfig.bgType = theme.bgType;
          slideConfig.bgColor1 = theme.bgColor1;
          slideConfig.bgColor2 = theme.bgColor2;
          slideConfig.bgAngle = theme.bgAngle || 135;
          slideConfig.accentColor = theme.accentColor;
          slideConfig.accentColor2 = theme.accentColor2;
          slideConfig.accentLight = theme.accentLight;
          slideConfig.textColor = theme.textColor;
          slideConfig.subtitleColor = theme.subtitleColor;
          slideConfig.cardBg = theme.cardBg;
          slideConfig.cardBorder = theme.cardBorder;
          slideConfig.gridColor = theme.gridColor;
          slideConfig.frameBg = theme.frameBg;
          slideConfig.frameBorder = theme.frameBorder;
          slideConfig.frameHeaderBg = theme.frameHeaderBg;
          slideConfig.shadowColor = theme.shadowColor;
        }
      }

      slideConfig.layoutMode = config.layout || 'split-feature-right';

      // Launch Playwright and render
      const browser = await chromium.launch({ headless: true });
      const page = await browser.newPage({ viewport: { width: slideConfig.width, height: slideConfig.height } });

      await page.goto('http://localhost:3100', { waitUntil: 'networkidle', timeout: 15000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(500);

      await page.evaluate((cfg) => {
        window.StoreCraft.init(cfg);
        window.StoreCraft.renderSlide(cfg);
      }, slideConfig);

      await page.waitForTimeout(300);

      const outPath = outputPath || path.join('output', 'design-' + Date.now() + '.png');
      const outDir = path.dirname(outPath);
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

      const canvas = await page.$('canvas');
      if (!canvas) {
        await browser.close();
        return { content: [{ type: 'text', text: 'ERROR: Canvas element not found on page' }], isError: true };
      }

      await canvas.screenshot({ path: outPath, type: 'png' });
      await browser.close();

      return {
        content: [{ type: 'text', text: 'Rendered ' + slideConfig.width + 'x' + slideConfig.height + ' design saved to: ' + outPath }],
      };
    } catch (err) {
      return { content: [{ type: 'text', text: 'ERROR: ' + err.message }], isError: true };
    }
  }
);

// Tool: save_template
server.tool(
  'save_template',
  'Save a design config as a reusable JSON template',
  {
    name: z.string().describe('Template filename (without .json extension)'),
    config: z.object({}).passthrough().describe('Full design configuration object'),
  },
  async ({ name, config }) => {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(TEMPLATES_DIR, name + '.json');
      fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8');
      return {
        content: [{ type: 'text', text: 'Template saved to: ' + filePath }],
      };
    } catch (err) {
      return { content: [{ type: 'text', text: 'ERROR: ' + err.message }], isError: true };
    }
  }
);

// Tool: load_template
server.tool(
  'load_template',
  'Load a previously saved JSON template by name',
  {
    name: z.string().describe('Template filename (without .json extension)'),
  },
  async ({ name }) => {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(TEMPLATES_DIR, name + '.json');
      if (!fs.existsSync(filePath)) {
        return { content: [{ type: 'text', text: 'Template not found: ' + name }], isError: true };
      }
      const content = fs.readFileSync(filePath, 'utf8');
      return { content: [{ type: 'text', text: content }] };
    } catch (err) {
      return { content: [{ type: 'text', text: 'ERROR: ' + err.message }], isError: true };
    }
  }
);

// Tool: list_templates
server.tool(
  'list_templates',
  'List all saved JSON templates',
  {},
  async () => {
    try {
      const fs = await import('fs');
      const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.json'));
      return {
        content: [{ type: 'text', text: files.length > 0 ? files.join('\n') : 'No templates saved yet.' }],
      };
    } catch (err) {
      return { content: [{ type: 'text', text: 'ERROR: ' + err.message }], isError: true };
    }
  }
);

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('StoreCraft Studio MCP server running on stdio');
