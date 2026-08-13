#!/usr/bin/env node
// StoreCraft Studio - CLI Wrapper
// Usage: node cli.js render <config.json> [--output path.png] [--scale 2]

import { readFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    console.log([
      '',
      'StoreCraft Studio CLI',
      '',
      'Usage:',
      '  node cli.js render <config.json> [--output path.png] [--scale 2]',
      "  node cli.js render '{\"preset\":\"swiss-dark\",\"headline\":\"Hello\"}' [--output path.png]",
      '  node cli.js presets',
      '  node cli.js themes',
      '',
      'Examples:',
      '  node cli.js render templates/demo-extension.json --output output/demo.png',
      "  node cli.js render '{\"preset\":\"marketplace-hero-1080p\",\"theme\":\"swiss-dark\",\"headline\":\"My Extension\"}'",
      '',
    ].join('\n'));
    process.exit(0);
  }

  if (command === 'presets') {
    const { PRESETS } = await import('./src/presets.js');
    console.log(JSON.stringify(PRESETS, null, 2));
    process.exit(0);
  }

  if (command === 'themes') {
    const { COLOR_THEMES } = await import('./src/presets.js');
    console.log(JSON.stringify(COLOR_THEMES, null, 2));
    process.exit(0);
  }

  if (command === 'render') {
    const configInput = args[1];
    if (!configInput) {
      console.error('ERROR: Provide a JSON config file path or inline JSON string');
      process.exit(1);
    }

    let outputPath = null;
    let scale = 2;
    for (let i = 2; i < args.length; i++) {
      if (args[i] === '--output' && args[i + 1]) outputPath = args[++i];
      if (args[i] === '--scale' && args[i + 1]) scale = parseInt(args[++i], 10);
    }

    let config;
    if (existsSync(configInput)) {
      config = JSON.parse(readFileSync(configInput, 'utf8'));
    } else {
      try {
        config = JSON.parse(configInput);
      } catch {
        console.error('ERROR: Could not parse config as JSON or file path');
        process.exit(1);
      }
    }

    const { PRESETS, COLOR_THEMES } = await import('./src/presets.js');
    let slideConfig = { ...config };
    if (config.preset && PRESETS[config.preset]) {
      const preset = PRESETS[config.preset];
      slideConfig.width = config.width || preset.width;
      slideConfig.height = config.height || preset.height;
    }
    slideConfig.width = slideConfig.width || 1920;
    slideConfig.height = slideConfig.height || 1080;

    if (config.theme) {
      const theme = COLOR_THEMES.find(t => t.id === config.theme);
      if (theme) {
        Object.assign(slideConfig, {
          bgType: theme.bgType, bgColor1: theme.bgColor1, bgColor2: theme.bgColor2,
          bgAngle: theme.bgAngle || 135, accentColor: theme.accentColor, accentColor2: theme.accentColor2,
          accentLight: theme.accentLight, textColor: theme.textColor, subtitleColor: theme.subtitleColor,
          cardBg: theme.cardBg, cardBorder: theme.cardBorder, gridColor: theme.gridColor,
          frameBg: theme.frameBg, frameBorder: theme.frameBorder, frameHeaderBg: theme.frameHeaderBg,
          shadowColor: theme.shadowColor,
        });
      }
    }

    slideConfig.layoutMode = config.layout || 'split-feature-right';

    const { chromium } = await import('playwright');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: slideConfig.width, height: slideConfig.height } });

    console.log('Rendering ' + slideConfig.width + 'x' + slideConfig.height + '...');
    await page.goto('http://localhost:3100', { waitUntil: 'networkidle', timeout: 15000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    await page.evaluate((cfg) => {
      window.StoreCraft.init(cfg);
      window.StoreCraft.renderSlide(cfg);
    }, slideConfig);
    await page.waitForTimeout(300);

    const outPath = outputPath || resolve(__dirname, 'output', 'design-' + Date.now() + '.png');
    const outDir = dirname(outPath);
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

    const canvas = await page.$('canvas');
    if (!canvas) {
      console.error('ERROR: Canvas element not found');
      await browser.close();
      process.exit(1);
    }

    await canvas.screenshot({ path: outPath, type: 'png' });
    await browser.close();
    console.log('Saved: ' + outPath);
    process.exit(0);
  }

  console.error('Unknown command: ' + command);
  process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
