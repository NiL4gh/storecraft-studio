// StoreCraft Studio — Canvas Renderer (ported from legacy)
// All drawing happens on HTML Canvas 2D context.

export class CanvasRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.imageCache = new Map();
  }

  loadImage(url) {
    if (!url) return Promise.resolve(null);
    if (this.imageCache.has(url)) {
      return Promise.resolve(this.imageCache.get(url));
    }
    return new Promise((resolve) => {
      const img = new Image();
      if (!url.startsWith('file:') && !url.startsWith('data:')) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => {
        this.imageCache.set(url, img);
        resolve(img);
      };
      img.onerror = (e) => {
        console.error('Failed to load image:', url, e);
        resolve(null);
      };
      img.src = url;
    });
  }

  async render(slide, options = {}) {
    const scale = options.scale || 1;
    const width = slide.width * scale;
    const height = slide.height * scale;

    this.canvas.width = width;
    this.canvas.height = height;

    const ctx = this.ctx;
    ctx.save();
    ctx.scale(scale, scale);

    const screenshotImg = await this.loadImage(slide.screenshotUrl);
    const screenshotImg2 = await this.loadImage(slide.screenshotUrl2);
    const screenshotImg3 = await this.loadImage(slide.screenshotUrl3);

    this.drawBackground(ctx, slide);

    const layout = slide.layoutMode || 'split-feature-right';
    const padding = slide.framePadding || 56;

    if (layout === 'three-card-gallery') {
      this.renderThreeCardGallery(ctx, slide, screenshotImg, screenshotImg2, screenshotImg3, padding);
    } else if (layout === 'side-by-side-cards') {
      this.renderSideBySideCards(ctx, slide, screenshotImg, screenshotImg2, padding);
    } else if (layout === 'widescreen-showcase') {
      this.renderWidescreenShowcase(ctx, slide, screenshotImg, padding);
    } else if (layout === 'split-clean-dialog' || layout === 'split-feature-right') {
      this.renderSplitCleanDialog(ctx, slide, screenshotImg, padding, 'right');
    } else if (layout === 'split-feature-left') {
      this.renderSplitCleanDialog(ctx, slide, screenshotImg, padding, 'left');
    } else if (layout === 'hero-centered') {
      this.renderHeroCenteredLayout(ctx, slide, screenshotImg, padding);
    } else if (layout === 'full-window') {
      this.renderFullWindowLayout(ctx, slide, screenshotImg, padding);
    } else {
      this.renderSplitCleanDialog(ctx, slide, screenshotImg, padding, 'right');
    }

    ctx.restore();
  }

  drawBackground(ctx, slide) {
    const { width, height } = slide;

    if (slide.bgType === 'solid') {
      ctx.fillStyle = slide.bgColor1 || '#fbfaf7';
      ctx.fillRect(0, 0, width, height);
    } else {
      const angle = ((slide.bgAngle || 135) * Math.PI) / 180;
      const x2 = width * Math.cos(angle);
      const y2 = height * Math.sin(angle);
      const grad = ctx.createLinearGradient(0, 0, x2, y2);
      grad.addColorStop(0, slide.bgColor1 || '#fbfaf7');
      grad.addColorStop(1, slide.bgColor2 || '#f4f1ea');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    if (slide.gridEnabled !== false) {
      const gridSize = slide.gridSize || 28;
      const gridColor = slide.gridColor || 'rgba(24, 32, 47, 0.04)';
      ctx.save();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
      }
      ctx.stroke();
      this.drawCrosshair(ctx, 32, 32, slide.accentColor || '#d97706');
      this.drawCrosshair(ctx, width - 32, 32, slide.accentColor || '#d97706');
      this.drawCrosshair(ctx, 32, height - 32, slide.accentColor || '#d97706');
      this.drawCrosshair(ctx, width - 32, height - 32, slide.accentColor || '#d97706');
      ctx.restore();
    }
  }

  drawCrosshair(ctx, x, y, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.moveTo(x - 8, y);
    ctx.lineTo(x + 8, y);
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x, y + 8);
    ctx.stroke();
    ctx.restore();
  }
  renderSplitCleanDialog(ctx, slide, img, padding, mockupSide = 'right') {
    const totalW = slide.width;
    const totalH = slide.height;
    const colGap = 52;
    const textW = (totalW - padding * 2 - colGap) * 0.42;
    const mockupW = totalW - padding * 2 - colGap - textW;
    const mockupH = totalH - padding * 2;

    const textX = mockupSide === 'right' ? padding : padding + mockupW + colGap;
    const mockupX = mockupSide === 'right' ? padding + textW + colGap : padding;
    const mockupY = padding;

    let y = padding + 10;
    if (slide.kicker) {
      ctx.save();
      ctx.font = '700 12px "JetBrains Mono", monospace, sans-serif';
      ctx.fillStyle = slide.accentColor || '#d97706';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(slide.kicker.toUpperCase(), textX, y);
      ctx.restore();
      y += 24;
    }
    if (slide.headline) y = this.drawHeadline(ctx, slide, textX, y, textW, 'left') + 12;
    if (slide.subtitle) y = this.drawSubtitle(ctx, slide, textX, y, textW, 'left') + 18;
    if (slide.badges && slide.badges.length > 0) y = this.drawBadges(ctx, slide.badges, textX, y, 'left', textW) + 24;
    if (slide.callouts && slide.callouts.length > 0) {
      this.drawCalloutCards(ctx, slide, slide.callouts, textX, y, textW, totalH - padding - y);
    }

    const caption = slide.caption1 || 'ACTIVE ILLUSTRATOR RUNTIME DIALOG';
    this.drawCleanCard(ctx, slide, img, mockupX, mockupY, mockupW, mockupH, caption, false);
  }

  renderHeroCenteredLayout(ctx, slide, img, padding) {
    let y = padding;
    if (slide.kicker) {
      ctx.save();
      ctx.font = '700 13px "JetBrains Mono", monospace, sans-serif';
      ctx.fillStyle = slide.accentColor || '#d97706';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(slide.kicker.toUpperCase(), slide.width / 2, y);
      ctx.restore();
      y += 26;
    }
    if (slide.headline) y = this.drawHeadline(ctx, slide, slide.width / 2, y, slide.width - padding * 2, 'center') + 10;
    if (slide.subtitle) y = this.drawSubtitle(ctx, slide, slide.width / 2, y, slide.width - padding * 2, 'center') + 16;
    if (slide.badges && slide.badges.length > 0) y = this.drawBadges(ctx, slide.badges, slide.width / 2, y, 'center', slide.width - padding * 2) + 24;

    const hasBottomCallouts = slide.callouts && slide.callouts.length > 0;
    const bottomH = hasBottomCallouts ? 80 : 0;
    const frameW = slide.width - padding * 2;
    const frameH = Math.max(260, slide.height - y - padding - bottomH);
    const frameX = padding;
    const frameY = y;

    this.drawWindowFrame(ctx, slide, img, frameX, frameY, frameW, frameH);

    if (hasBottomCallouts) {
      const bottomY = frameY + frameH + 20;
      this.drawInlineCalloutBar(ctx, slide, slide.callouts, frameX, bottomY, frameW, bottomH - 20);
    }
  }

  renderFullWindowLayout(ctx, slide, img, padding) {
    let y = padding;
    if (slide.kicker) {
      ctx.save();
      ctx.font = '700 12px "JetBrains Mono", monospace, sans-serif';
      ctx.fillStyle = slide.accentColor || '#d97706';
      ctx.textAlign = 'center';
      ctx.fillText(slide.kicker.toUpperCase(), slide.width / 2, y);
      ctx.restore();
      y += 22;
    }
    if (slide.headline) y = this.drawHeadline(ctx, slide, slide.width / 2, y, slide.width - padding * 2, 'center') + 8;
    if (slide.badges && slide.badges.length > 0) y = this.drawBadges(ctx, slide.badges, slide.width / 2, y, 'center', slide.width - padding * 2) + 16;

    const frameW = slide.width - padding * 2;
    const frameH = Math.max(240, slide.height - y - padding);
    this.drawWindowFrame(ctx, slide, img, padding, y, frameW, frameH);
  }

  renderThreeCardGallery(ctx, slide, img1, img2, img3, padding) {
    let y = padding;
    if (slide.kicker) {
      ctx.save();
      ctx.font = '700 13px "JetBrains Mono", monospace, sans-serif';
      ctx.fillStyle = slide.accentColor || '#d97706';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(slide.kicker.toUpperCase(), slide.width / 2, y);
      ctx.restore();
      y += 26;
    }
    if (slide.headline) y = this.drawHeadline(ctx, slide, slide.width / 2, y, slide.width - padding * 2, 'center') + 10;
    if (slide.subtitle) y = this.drawSubtitle(ctx, slide, slide.width / 2, y, slide.width - padding * 2, 'center') + 16;
    if (slide.badges && slide.badges.length > 0) y = this.drawBadges(ctx, slide.badges, slide.width / 2, y, 'center', slide.width - padding * 2) + 24;

    const totalW = slide.width - padding * 2;
    let availH = Math.max(450, slide.height - y - padding);
    if (slide.callouts && slide.callouts.length > 0) {
      const gridH = 240;
      availH = Math.max(300, slide.height - y - padding - gridH - 20);
      this.draw2x2CalloutGrid(ctx, slide, slide.callouts, padding, slide.height - padding - gridH, totalW, gridH);
    }
    const gap = 36;
    const cardW = Math.floor((totalW - gap * 2) / 3);
    const c1 = slide.caption1 || '01 // TARGET PLATFORM PRESETS';
    const c2 = slide.caption2 || '02 // MULTI-FORMAT EXPORT ENGINE';
    const c3 = slide.caption3 || '03 // LIVE BATCH EXECUTION';
    this.drawCleanCard(ctx, slide, img1, padding, y, cardW, availH, c1, true);
    this.drawCleanCard(ctx, slide, img2, padding + cardW + gap, y, cardW, availH, c2, true);
    this.drawCleanCard(ctx, slide, img3, padding + (cardW + gap) * 2, y, cardW, availH, c3, true);
  }

  renderSideBySideCards(ctx, slide, img1, img2, padding) {
    let y = padding;
    if (slide.kicker) {
      ctx.save();
      ctx.font = '700 13px "JetBrains Mono", monospace, sans-serif';
      ctx.fillStyle = slide.accentColor || '#d97706';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(slide.kicker.toUpperCase(), slide.width / 2, y);
      ctx.restore();
      y += 26;
    }
    if (slide.headline) y = this.drawHeadline(ctx, slide, slide.width / 2, y, slide.width - padding * 2, 'center') + 10;
    if (slide.subtitle) y = this.drawSubtitle(ctx, slide, slide.width / 2, y, slide.width - padding * 2, 'center') + 16;
    if (slide.badges && slide.badges.length > 0) y = this.drawBadges(ctx, slide.badges, slide.width / 2, y, 'center', slide.width - padding * 2) + 24;

    const totalW = slide.width - padding * 2;
    let availH = Math.max(480, slide.height - y - padding);
    if (slide.callouts && slide.callouts.length > 0) {
      const gridH = 240;
      availH = Math.max(320, slide.height - y - padding - gridH - 20);
      this.draw2x2CalloutGrid(ctx, slide, slide.callouts, padding, slide.height - padding - gridH, totalW, gridH);
    }
    const gap = 44;
    const cardW = Math.floor((totalW - gap) / 2);
    const c1 = slide.caption1 || '01 // CUSTOM REGEX NAMING & METADATA';
    const c2 = slide.caption2 || '02 // CANVAS SIZING & PRE-FLIGHT CHECKS';
    this.drawCleanCard(ctx, slide, img1, padding, y, cardW, availH, c1, true);
    this.drawCleanCard(ctx, slide, img2, padding + cardW + gap, y, cardW, availH, c2, true);
  }

  renderWidescreenShowcase(ctx, slide, img, padding) {
    let y = padding;
    if (slide.kicker) {
      ctx.save();
      ctx.font = '700 13px "JetBrains Mono", monospace, sans-serif';
      ctx.fillStyle = slide.accentColor || '#d97706';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(slide.kicker.toUpperCase(), slide.width / 2, y);
      ctx.restore();
      y += 26;
    }
    if (slide.headline) y = this.drawHeadline(ctx, slide, slide.width / 2, y, slide.width - padding * 2, 'center') + 10;
    if (slide.subtitle) y = this.drawSubtitle(ctx, slide, slide.width / 2, y, slide.width - padding * 2, 'center') + 16;
    if (slide.badges && slide.badges.length > 0) y = this.drawBadges(ctx, slide.badges, slide.width / 2, y, 'center', slide.width - padding * 2) + 24;

    const totalW = slide.width - padding * 2;
    const availH = Math.max(460, slide.height - y - padding);
    const c1 = slide.caption1 || 'WINDOWS EXPLORER // AUTOMATED DIRECTORY SORTING & COMPLETED BATCH RESULTS';
    this.drawCleanCard(ctx, slide, img, padding, y, totalW, availH, c1, false);
  }

  drawCleanCard(ctx, slide, img, x, y, width, height, caption = '', alignTop = false) {
    ctx.save();
    const captionSpacing = caption ? 36 : 0;
    const availableImgH = Math.max(100, height - captionSpacing);
    const availableImgW = width;

    let winX = x, winY = y, winW = availableImgW, winH = availableImgH;

    if (img && img.width && img.height) {
      const imgAspect = img.width / img.height;
      const slotAspect = availableImgW / availableImgH;
      if (imgAspect > slotAspect) {
        winW = availableImgW;
        winH = winW / imgAspect;
        winX = x;
        winY = alignTop ? y + 8 : y + (availableImgH - winH) / 2;
      } else {
        winH = availableImgH;
        winW = winH * imgAspect;
        winX = x + (availableImgW - winW) / 2;
        winY = alignTop ? y + 8 : y + (availableImgH - winH) / 2;
      }
    }

    const radius = 8;
    if (img) {
      ctx.save();
      ctx.shadowColor = 'rgba(15, 23, 42, 0.22)';
      ctx.shadowBlur = 32;
      ctx.shadowOffsetY = 16;
      ctx.beginPath();
      this.roundRect(ctx, winX, winY, winW, winH, radius);
      ctx.fillStyle = '#1e1e1e';
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.beginPath();
      this.roundRect(ctx, winX, winY, winW, winH, radius);
      ctx.clip();
      ctx.drawImage(img, 0, 0, img.width, img.height, winX, winY, winW, winH);
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      this.roundRect(ctx, winX, winY, winW, winH, radius);
      ctx.strokeStyle = 'rgba(24, 32, 47, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.save();
      ctx.beginPath();
      this.roundRect(ctx, winX, winY, winW, winH, radius);
      ctx.fillStyle = '#faf8f5';
      ctx.fill();
      ctx.strokeStyle = '#e4dfd5';
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '36px sans-serif';
      ctx.fillText('??', winX + winW / 2, winY + winH / 2 - 16);
      ctx.font = '600 14px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Drop Capture Here', winX + winW / 2, winY + winH / 2 + 20);
      ctx.restore();
    }

    if (caption) {
      ctx.save();
      const captionY = winY + winH + 20;
      ctx.font = '700 13px "JetBrains Mono", monospace, sans-serif';
      ctx.fillStyle = slide.textColor || '#18202f';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(caption.toUpperCase(), winX + winW / 2, captionY);
      ctx.restore();
    }
    ctx.restore();
  }

  drawWindowFrame(ctx, slide, img, x, y, width, height, customTitle = null) {
    ctx.save();
    const shadowColor = slide.frameShadowColor || 'rgba(24, 32, 47, 0.08)';
    const shadowBlur = slide.frameShadowBlur || 30;
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetY = 12;

    const radius = slide.frameCornerRadius || 10;
    const frameBg = slide.frameBg || '#ffffff';
    const frameBorder = slide.frameBorder || '#e4dfd5';
    const headerBg = slide.frameHeaderBg || '#f4f1ea';

    ctx.beginPath();
    this.roundRect(ctx, x, y, width, height, radius);
    ctx.fillStyle = frameBg;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = frameBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const headerH = 40;
    ctx.fillStyle = headerBg;
    ctx.beginPath();
    this.roundRectTop(ctx, x, y, width, headerH, radius);
    ctx.fill();

    ctx.strokeStyle = frameBorder;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + headerH + 0.5);
    ctx.lineTo(x + width, y + headerH + 0.5);
    ctx.stroke();

    const dotY = y + headerH / 2;
    const dots = ['#ff5f56', '#ffbd2e', '#27c93f'];
    dots.forEach((color, i) => {
      ctx.beginPath();
      ctx.arc(x + 18 + i * 16, dotY, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    ctx.font = '600 12px "JetBrains Mono", monospace, sans-serif';
    ctx.fillStyle = slide.subtitleColor || '#5f6e85';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(customTitle || slide.frameTitle || 'Adobe Illustrator � StockVector Exporter Pro', x + width / 2, dotY);

    const contentX = x + 1;
    const contentY = y + headerH + 1;
    const contentW = width - 2;
    const contentH = height - headerH - 2;

    if (img) {
      ctx.save();
      ctx.beginPath();
      this.roundRectBottom(ctx, contentX, contentY, contentW, contentH, radius - 1);
      ctx.clip();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(contentX, contentY, contentW, contentH);
      this.drawScreenshotImage(ctx, img, contentX, contentY, contentW, contentH, slide);
      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = '#faf8f5';
      ctx.beginPath();
      this.roundRectBottom(ctx, contentX, contentY, contentW, contentH, radius - 1);
      ctx.fill();
      const dropW = contentW - 48;
      const dropH = contentH - 48;
      const dropX = contentX + 24;
      const dropY = contentY + 24;
      ctx.strokeStyle = '#d6cebe';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      this.roundRect(ctx, dropX, dropY, dropW, dropH, 8);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '42px sans-serif';
      ctx.fillText('???', contentX + contentW / 2, contentY + contentH / 2 - 32);
      ctx.font = '700 17px Inter, sans-serif';
      ctx.fillStyle = slide.textColor || '#18202f';
      ctx.fillText('Drop UI Screenshot Here', contentX + contentW / 2, contentY + contentH / 2 + 16);
      ctx.font = '500 13px Inter, sans-serif';
      ctx.fillStyle = slide.subtitleColor || '#5f6e85';
      ctx.fillText('Captures from Illustrator Dev/Pro JSX runtime', contentX + contentW / 2, contentY + contentH / 2 + 42);
      ctx.restore();
    }
    ctx.restore();
  }

  drawScreenshotImage(ctx, img, x, y, width, height, slide) {
    const fit = slide.screenshotFit || 'contain';
    const scale = (slide.screenshotScale || 100) / 100;
    const offX = slide.screenshotOffsetX || 0;
    const offY = slide.screenshotOffsetY || 0;
    const imgRatio = img.width / img.height;
    const viewRatio = width / height;
    let drawW, drawH, drawX, drawY;

    if (fit === 'contain') {
      if (imgRatio > viewRatio) {
        drawW = width * scale; drawH = (width / imgRatio) * scale;
      } else {
        drawH = height * scale; drawW = (height * imgRatio) * scale;
      }
    } else if (fit === 'cover') {
      if (imgRatio > viewRatio) {
        drawH = height * scale; drawW = (height * imgRatio) * scale;
      } else {
        drawW = width * scale; drawH = (width / imgRatio) * scale;
      }
    } else {
      drawW = width * scale; drawH = (width / imgRatio) * scale;
      drawX = x + (width - drawW) / 2 + offX;
      drawY = y + offY;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      return;
    }
    drawX = x + (width - drawW) / 2 + offX;
    drawY = y + (height - drawH) / 2 + offY;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  drawCalloutCards(ctx, slide, callouts, x, y, width, maxHeight) {
    if (!callouts || callouts.length === 0) return;
    ctx.save();
    const count = callouts.length;
    const gap = 12;
    const cardHeight = Math.min(84, (maxHeight - (count - 1) * gap) / count);

    callouts.forEach((item, index) => {
      const cardY = y + index * (cardHeight + gap);
      ctx.beginPath();
      this.roundRect(ctx, x, cardY, width, cardHeight, 8);
      ctx.fillStyle = slide.cardBg || '#ffffff';
      ctx.fill();
      ctx.strokeStyle = slide.cardBorder || '#e4dfd5';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      const iconSize = Math.min(36, cardHeight - 20);
      const iconX = x + 14;
      const iconY = cardY + (cardHeight - iconSize) / 2;
      ctx.beginPath();
      this.roundRect(ctx, iconX, iconY, iconSize, iconSize, 6);
      ctx.fillStyle = slide.accentLight || '#fef3c7';
      ctx.fill();
      ctx.strokeStyle = slide.accentColor || '#d97706';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.font = `${Math.round(iconSize * 0.55)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.icon || '?', iconX + iconSize / 2, iconY + iconSize / 2 + 1);

      const textLeft = iconX + iconSize + 14;
      const textMaxW = width - (iconSize + 42);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = '700 14px Inter, sans-serif';
      ctx.fillStyle = slide.textColor || '#18202f';
      ctx.fillText(item.title || '', textLeft, cardY + 12);
      ctx.font = '400 12px Inter, sans-serif';
      ctx.fillStyle = slide.subtitleColor || '#5f6e85';
      const descLines = this.getWrapLines(ctx, item.desc || '', textMaxW);
      if (descLines[0]) ctx.fillText(descLines[0], textLeft, cardY + 32);
      if (descLines[1] && cardHeight > 68) ctx.fillText(descLines[1], textLeft, cardY + 48);
    });
    ctx.restore();
  }

  draw2x2CalloutGrid(ctx, slide, callouts, x, y, width, height) {
    if (!callouts || callouts.length === 0) return;
    ctx.save();
    const count = Math.min(4, callouts.length);
    const cols = count > 1 ? 2 : 1;
    const rows = Math.ceil(count / cols);
    const colGap = 20;
    const rowGap = 16;
    const colW = Math.floor((width - (cols - 1) * colGap) / cols);
    const rowH = Math.min(110, Math.floor((height - (rows - 1) * rowGap) / rows));

    callouts.slice(0, 4).forEach((item, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const cardX = x + col * (colW + colGap);
      const cardY = y + row * (rowH + rowGap);
      ctx.beginPath();
      this.roundRect(ctx, cardX, cardY, colW, rowH, 8);
      ctx.fillStyle = slide.cardBg || '#ffffff';
      ctx.fill();
      ctx.strokeStyle = slide.cardBorder || '#e4dfd5';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      const iconSize = Math.min(38, rowH - 24);
      const iconX = cardX + 16;
      const iconY = cardY + 16;
      ctx.beginPath();
      this.roundRect(ctx, iconX, iconY, iconSize, iconSize, 6);
      ctx.fillStyle = slide.accentLight || '#fef3c7';
      ctx.fill();
      ctx.strokeStyle = slide.accentColor || '#d97706';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.font = `${Math.round(iconSize * 0.55)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.icon || '?', iconX + iconSize / 2, iconY + iconSize / 2 + 1);

      const textLeft = iconX + iconSize + 16;
      const textMaxW = colW - (iconSize + 48);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = '700 14px Inter, sans-serif';
      ctx.fillStyle = slide.textColor || '#18202f';
      ctx.fillText(item.title || '', textLeft, cardY + 14);
      ctx.font = '400 12px Inter, sans-serif';
      ctx.fillStyle = slide.subtitleColor || '#5f6e85';
      const descLines = this.getWrapLines(ctx, item.desc || '', textMaxW);
      if (descLines[0]) ctx.fillText(descLines[0], textLeft, cardY + 34);
      if (descLines[1] && rowH > 65) ctx.fillText(descLines[1], textLeft, cardY + 50);
      if (descLines[2] && rowH > 82) ctx.fillText(descLines[2], textLeft, cardY + 66);
    });
    ctx.restore();
  }

  drawInlineCalloutBar(ctx, slide, callouts, x, y, width, height) {
    if (!callouts || callouts.length === 0) return;
    ctx.save();
    const count = Math.min(4, callouts.length);
    const gap = 16;
    const colW = (width - (count - 1) * gap) / count;

    callouts.slice(0, count).forEach((item, i) => {
      const colX = x + i * (colW + gap);
      ctx.beginPath();
      this.roundRect(ctx, colX, y, colW, height, 8);
      ctx.fillStyle = slide.cardBg || '#ffffff';
      ctx.fill();
      ctx.strokeStyle = slide.cardBorder || '#e4dfd5';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = '18px sans-serif';
      ctx.fillText(item.icon || '?', colX + 12, y + height / 2);
      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillStyle = slide.textColor || '#18202f';
      ctx.fillText(item.title, colX + 38, y + height / 2 - 7);
      ctx.font = '400 11px Inter, sans-serif';
      ctx.fillStyle = slide.subtitleColor || '#5f6e85';
      ctx.fillText(item.desc || '', colX + 38, y + height / 2 + 8);
    });
    ctx.restore();
  }

  drawBadges(ctx, badges, x, y, align = 'left', maxWidth = 600) {
    if (!badges || badges.length === 0) return y;
    ctx.save();
    const badgeHeight = 28;
    const paddingX = 12;
    const gap = 8;
    ctx.font = '700 12px "JetBrains Mono", monospace, sans-serif';
    const rows = [[]];
    let rowW = 0;

    badges.forEach(badge => {
      const textW = ctx.measureText(badge.text).width;
      const pillW = textW + paddingX * 2;
      const itemW = pillW + (rows[rows.length - 1].length > 0 ? gap : 0);
      if (rows[rows.length - 1].length > 0 && rowW + itemW > maxWidth) {
        rows.push([{ ...badge, pillW }]);
        rowW = pillW;
      } else {
        rows[rows.length - 1].push({ ...badge, pillW });
        rowW += itemW;
      }
    });

    let currentY = y;
    rows.forEach((rowBadges) => {
      let rowTotalW = rowBadges.reduce((sum, b, i) => sum + b.pillW + (i > 0 ? gap : 0), 0);
      let currentX = x;
      if (align === 'center') currentX = x - rowTotalW / 2;
      rowBadges.forEach(badge => {
        ctx.beginPath();
        this.roundRect(ctx, currentX, currentY, badge.pillW, badgeHeight, 5);
        ctx.fillStyle = badge.bg || '#fef3c7';
        ctx.fill();
        ctx.strokeStyle = badge.color || '#d97706';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = badge.color || '#18202f';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(badge.text, currentX + paddingX, currentY + badgeHeight / 2 + 1);
        currentX += badge.pillW + gap;
      });
      currentY += badgeHeight + 8;
    });
    ctx.restore();
    return currentY - 8;
  }

  drawHeadline(ctx, slide, x, y, maxWidth, align = 'left') {
    ctx.save();
    const fontSize = slide.headlineFontSize || 44;
    const fontFamily = slide.headlineFontFamily || 'Inter';
    ctx.font = `800 ${fontSize}px ${fontFamily}, system-ui, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = 'top';
    const lines = this.getWrapLines(ctx, slide.headline, maxWidth);
    const lineHeight = fontSize * 1.18;

    lines.forEach((line, index) => {
      const lineY = y + index * lineHeight;
      if (slide.headlineGradientEnabled) {
        const textMetrics = ctx.measureText(line);
        let startX = x;
        if (align === 'center') startX = x - textMetrics.width / 2;
        const grad = ctx.createLinearGradient(startX, lineY, startX + textMetrics.width, lineY);
        grad.addColorStop(0, slide.headlineColor || '#18202f');
        grad.addColorStop(1, slide.headlineGradientColor2 || '#d97706');
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = slide.headlineColor || '#18202f';
      }
      ctx.fillText(line, x, lineY);
    });
    ctx.restore();
    return y + lines.length * lineHeight;
  }

  drawSubtitle(ctx, slide, x, y, maxWidth, align = 'left') {
    ctx.save();
    const fontSize = slide.subtitleFontSize || 18;
    const fontFamily = slide.subtitleFontFamily || 'Inter';
    ctx.font = `400 ${fontSize}px ${fontFamily}, system-ui, sans-serif`;
    ctx.fillStyle = slide.subtitleColor || '#5f6e85';
    ctx.textAlign = align;
    ctx.textBaseline = 'top';
    const lines = this.getWrapLines(ctx, slide.subtitle, maxWidth);
    const lineHeight = fontSize * 1.45;
    lines.forEach((line, index) => {
      ctx.fillText(line, x, y + index * lineHeight);
    });
    ctx.restore();
    return y + lines.length * lineHeight;
  }

  getWrapLines(ctx, text, maxWidth) {
    if (!text) return [];
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, width, height, radius);
    } else {
      ctx.rect(x, y, width, height);
    }
  }

  roundRectTop(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  roundRectBottom(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y);
    ctx.closePath();
  }
}
