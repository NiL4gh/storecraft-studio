// StoreCraft Studio — Expanded presets for all design types

export const PRESETS = {
  // Marketplace
  'marketplace-hero-1080p': { id: 'marketplace-hero-1080p', name: '1920 x 1080 (16:9 Hero)', category: 'Marketplace', width: 1920, height: 1080, aspect: '16:9', description: 'Full HD hero banner for Gumroad, Envato, Creative Market' },
  'marketplace-standard': { id: 'marketplace-standard', name: '1280 x 800 (16:10 Showcase)', category: 'Marketplace', width: 1280, height: 800, aspect: '16:10', description: 'Standard product detail screenshot' },
  'marketplace-hd': { id: 'marketplace-hd', name: '1280 x 720 (16:9 HD)', category: 'Marketplace', width: 1280, height: 720, aspect: '16:9', description: 'Compact 720p product feature banner' },
  'square-thumbnail': { id: 'square-thumbnail', name: '1000 x 1000 (1:1 Square)', category: 'Marketplace', width: 1000, height: 1000, aspect: '1:1', description: 'Square marketplace catalog card' },
  'envato-banner': { id: 'envato-banner', name: '590 x 300 (Envato Preview)', category: 'Marketplace', width: 590, height: 300, aspect: '59:30', description: 'Envato Market item thumbnail' },

  // Chrome Web Store
  'cws-screenshot': { id: 'cws-screenshot', name: '1280 x 800 (CWS Screenshot)', category: 'Chrome Web Store', width: 1280, height: 800, aspect: '16:10', description: 'Chrome Web Store promotional screenshot' },
  'cws-small-tile': { id: 'cws-small-tile', name: '440 x 280 (CWS Small Tile)', category: 'Chrome Web Store', width: 440, height: 280, aspect: '11:7', description: 'CWS small promotional tile' },
  'cws-marquee': { id: 'cws-marquee', name: '1400 x 560 (CWS Marquee)', category: 'Chrome Web Store', width: 1400, height: 560, aspect: '5:2', description: 'CWS marquee promotional banner' },
  'cws-icon': { id: 'cws-icon', name: '512 x 512 (Extension Icon)', category: 'Chrome Web Store', width: 512, height: 512, aspect: '1:1', description: 'Chrome Web Store extension icon' },

  // Social Media
  'twitter-header': { id: 'twitter-header', name: '1500 x 500 (Twitter/X Header)', category: 'Social Media', width: 1500, height: 500, aspect: '3:1', description: 'Twitter/X profile header banner' },
  'twitter-post': { id: 'twitter-post', name: '1600 x 900 (Twitter/X Post)', category: 'Social Media', width: 1600, height: 900, aspect: '16:9', description: 'Twitter/X timeline image post' },
  'instagram-post': { id: 'instagram-post', name: '1080 x 1080 (Instagram Square)', category: 'Social Media', width: 1080, height: 1080, aspect: '1:1', description: 'Instagram feed square post' },
  'instagram-story': { id: 'instagram-story', name: '1080 x 1920 (Instagram Story)', category: 'Social Media', width: 1080, height: 1920, aspect: '9:16', description: 'Instagram story / Reels cover' },
  'instagram-carousel': { id: 'instagram-carousel', name: '1080 x 1350 (Instagram Carousel)', category: 'Social Media', width: 1080, height: 1350, aspect: '4:5', description: 'Instagram carousel / portrait post' },
  'linkedin-post': { id: 'linkedin-post', name: '1200 x 627 (LinkedIn Post)', category: 'Social Media', width: 1200, height: 627, aspect: '1.91:1', description: 'LinkedIn timeline share image' },
  'linkedin-banner': { id: 'linkedin-banner', name: '1584 x 396 (LinkedIn Banner)', category: 'Social Media', width: 1584, height: 396, aspect: '4:1', description: 'LinkedIn profile background banner' },
  'facebook-post': { id: 'facebook-post', name: '1200 x 630 (Facebook Post)', category: 'Social Media', width: 1200, height: 630, aspect: '1.91:1', description: 'Facebook timeline share image' },
  'facebook-cover': { id: 'facebook-cover', name: '820 x 312 (Facebook Cover)', category: 'Social Media', width: 820, height: 312, aspect: '2.63:1', description: 'Facebook page cover photo' },
  'youtube-thumbnail': { id: 'youtube-thumbnail', name: '1280 x 720 (YouTube Thumbnail)', category: 'Social Media', width: 1280, height: 720, aspect: '16:9', description: 'YouTube video thumbnail' },
  'youtube-banner': { id: 'youtube-banner', name: '2560 x 1440 (YouTube Banner)', category: 'Social Media', width: 2560, height: 1440, aspect: '16:9', description: 'YouTube channel art / banner' },
  'discord-banner': { id: 'discord-banner', name: '800 x 200 (Discord Banner)', category: 'Social Media', width: 800, height: 200, aspect: '4:1', description: 'Discord server banner' },
  'tiktok-thumbnail': { id: 'tiktok-thumbnail', name: '1080 x 1920 (TikTok Cover)', category: 'Social Media', width: 1080, height: 1920, aspect: '9:16', description: 'TikTok video cover' },
  'pinterest-pin': { id: 'pinterest-pin', name: '1000 x 1500 (Pinterest Pin)', category: 'Social Media', width: 1000, height: 1500, aspect: '2:3', description: 'Pinterest standard pin' },

  // OpenGraph
  'opengraph-card': { id: 'opengraph-card', name: '1200 x 630 (OpenGraph Card)', category: 'OpenGraph', width: 1200, height: 630, aspect: '1.91:1', description: 'Universal social sharing card' },

  // Banners
  'blog-hero': { id: 'blog-hero', name: '1920 x 640 (Blog Hero)', category: 'Banners', width: 1920, height: 640, aspect: '3:1', description: 'Blog post hero banner' },
  'newsletter-header': { id: 'newsletter-header', name: '600 x 200 (Newsletter Header)', category: 'Banners', width: 600, height: 200, aspect: '3:1', description: 'Email newsletter header' },
  'podcast-cover': { id: 'podcast-cover', name: '3000 x 3000 (Podcast Cover)', category: 'Banners', width: 3000, height: 3000, aspect: '1:1', description: 'Podcast cover art' },
  'banner-leaderboard': { id: 'banner-leaderboard', name: '728 x 90 (Leaderboard Ad)', category: 'Banners', width: 728, height: 90, aspect: '8:1', description: 'Web leaderboard advertisement' },
  'banner-medium': { id: 'banner-medium', name: '300 x 250 (Medium Rect Ad)', category: 'Banners', width: 300, height: 250, aspect: '6:5', description: 'Web medium rectangle ad' },
  'banner-skyscraper': { id: 'banner-skyscraper', name: '160 x 600 (Skyscraper Ad)', category: 'Banners', width: 160, height: 600, aspect: '4:15', description: 'Web skyscraper advertisement' },

  // Presentations
  'slides-16-9': { id: 'slides-16-9', name: '1920 x 1080 (Slides 16:9)', category: 'Presentations', width: 1920, height: 1080, aspect: '16:9', description: 'Standard presentation slide' },
  'slides-4-3': { id: 'slides-4-3', name: '1440 x 1080 (Slides 4:3)', category: 'Presentations', width: 1440, height: 1080, aspect: '4:3', description: 'Classic presentation format' },

  // Custom
  'custom': { id: 'custom', name: 'Custom Dimension', category: 'Custom', width: 1920, height: 1080, aspect: 'Custom', description: 'User defined width & height' }
};
export const COLOR_THEMES = [
  {
    id: 'swiss-light', name: 'Swiss Light',
    bgType: 'solid', bgColor1: '#fbfaf7', bgColor2: '#f4f1ea',
    accentColor: '#d97706', accentColor2: '#b45309', accentLight: '#fef3c7',
    textColor: '#18202f', subtitleColor: '#5f6e85',
    cardBg: '#ffffff', cardBorder: '#e4dfd5',
    gridColor: 'rgba(24, 32, 47, 0.04)',
    frameBg: '#ffffff', frameBorder: '#e4dfd5', frameHeaderBg: '#f4f1ea',
    shadowColor: 'rgba(24, 32, 47, 0.08)'
  },
  {
    id: 'warm-paper', name: 'Warm Craft Paper',
    bgType: 'solid', bgColor1: '#f4efe6', bgColor2: '#eae2d5',
    accentColor: '#059669', accentColor2: '#047857', accentLight: '#d1fae5',
    textColor: '#1c1917', subtitleColor: '#57534e',
    cardBg: '#ffffff', cardBorder: '#d6cebe',
    gridColor: 'rgba(28, 25, 23, 0.04)',
    frameBg: '#ffffff', frameBorder: '#d6cebe', frameHeaderBg: '#ede6da',
    shadowColor: 'rgba(28, 25, 23, 0.08)'
  },
  {
    id: 'swiss-dark', name: 'Technical Dark Slate',
    bgType: 'gradient', bgAngle: 135, bgColor1: '#0f172a', bgColor2: '#1e293b',
    accentColor: '#f59e0b', accentColor2: '#d97706', accentLight: 'rgba(245, 158, 11, 0.15)',
    textColor: '#f8fafc', subtitleColor: '#94a3b8',
    cardBg: '#1e293b', cardBorder: '#334155',
    gridColor: 'rgba(255, 255, 255, 0.03)',
    frameBg: '#0f172a', frameBorder: '#334155', frameHeaderBg: '#1e293b',
    shadowColor: 'rgba(0, 0, 0, 0.5)'
  },
  {
    id: 'obsidian-indigo', name: 'Obsidian & Indigo',
    bgType: 'gradient', bgAngle: 145, bgColor1: '#090d16', bgColor2: '#131b2e',
    accentColor: '#6366f1', accentColor2: '#4f46e5', accentLight: 'rgba(99, 102, 241, 0.15)',
    textColor: '#ffffff', subtitleColor: '#94a3b8',
    cardBg: '#111827', cardBorder: '#1f2937',
    gridColor: 'rgba(255, 255, 255, 0.03)',
    frameBg: '#0b0f19', frameBorder: '#1f2937', frameHeaderBg: '#111827',
    shadowColor: 'rgba(0, 0, 0, 0.6)'
  },
  {
    id: 'ocean-blue', name: 'Ocean Blue',
    bgType: 'gradient', bgAngle: 135, bgColor1: '#0c1929', bgColor2: '#162544',
    accentColor: '#38bdf8', accentColor2: '#0ea5e9', accentLight: 'rgba(56, 189, 248, 0.15)',
    textColor: '#f0f9ff', subtitleColor: '#7dd3fc',
    cardBg: '#1e3a5f', cardBorder: '#2563eb',
    gridColor: 'rgba(255, 255, 255, 0.03)',
    frameBg: '#0c1929', frameBorder: '#2563eb', frameHeaderBg: '#1e3a5f',
    shadowColor: 'rgba(0, 0, 0, 0.5)'
  },
  {
    id: 'emerald-dark', name: 'Emerald Dark',
    bgType: 'gradient', bgAngle: 135, bgColor1: '#022c22', bgColor2: '#064e3b',
    accentColor: '#34d399', accentColor2: '#10b981', accentLight: 'rgba(52, 211, 153, 0.15)',
    textColor: '#f0fdf4', subtitleColor: '#6ee7b7',
    cardBg: '#064e3b', cardBorder: '#065f46',
    gridColor: 'rgba(255, 255, 255, 0.03)',
    frameBg: '#022c22', frameBorder: '#065f46', frameHeaderBg: '#064e3b',
    shadowColor: 'rgba(0, 0, 0, 0.5)'
  },
  {
    id: 'rose-dark', name: 'Rose Dark',
    bgType: 'gradient', bgAngle: 135, bgColor1: '#1c1017', bgColor2: '#2d1a25',
    accentColor: '#fb7185', accentColor2: '#f43f5e', accentLight: 'rgba(251, 113, 133, 0.15)',
    textColor: '#fff1f2', subtitleColor: '#fda4af',
    cardBg: '#2d1a25', cardBorder: '#4c1d36',
    gridColor: 'rgba(255, 255, 255, 0.03)',
    frameBg: '#1c1017', frameBorder: '#4c1d36', frameHeaderBg: '#2d1a25',
    shadowColor: 'rgba(0, 0, 0, 0.5)'
  },
  {
    id: 'minimal-white', name: 'Minimal White',
    bgType: 'solid', bgColor1: '#ffffff', bgColor2: '#f9fafb',
    accentColor: '#111827', accentColor2: '#374151', accentLight: '#f3f4f6',
    textColor: '#111827', subtitleColor: '#6b7280',
    cardBg: '#ffffff', cardBorder: '#e5e7eb',
    gridColor: 'rgba(0, 0, 0, 0.03)',
    frameBg: '#ffffff', frameBorder: '#e5e7eb', frameHeaderBg: '#f9fafb',
    shadowColor: 'rgba(0, 0, 0, 0.06)'
  }
];
