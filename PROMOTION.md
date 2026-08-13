# StoreCraft Studio — promotion assets

Copy-paste drafts for sharing. Repo: https://github.com/NiL4gh/storecraft-studio

---

## Reddit — r/mcp

**Title:** I built an MCP server that turns JSON configs into high-res design assets (banners, social posts, marketplace screenshots)

**Body:**
I got tired of AI agents being able to write code but not produce actual marketing images — "make me a Gumroad banner" always ended in HTML you'd screenshot yourself.

So I built **StoreCraft Studio**: an MCP server + CLI that renders JSON configs to high-res PNGs via Canvas 2D + Playwright.

The loop is fully agentic:
1. Agent calls `list_presets` → finds `marketplace-hero-1080p`
2. Agent calls `list_themes` → picks `swiss-dark`
3. Agent composes a config from your description
4. Agent calls `render_design` → returns the PNG

What's inside:
- 35+ platform presets (Gumroad, Chrome Web Store, Instagram, LinkedIn, YouTube, Discord, Pinterest, OpenGraph, ads)
- 8 curated color themes
- 7 composable layouts
- Deterministic output, no API keys, fully local

Demo images in the README: https://github.com/NiL4gh/storecraft-studio

Would love feedback — especially on which platforms/presets you'd want added next.

---

## Hacker News — "Show HN"

**Title:** Show HN: StoreCraft Studio — MCP server that generates design assets from JSON configs

**Body:**
Show HN: StoreCraft Studio is an MCP server + CLI that turns plain JSON into production-ready marketing images — banners, social posts, marketplace screenshots, covers.

Why I built it: LLMs can write code but can't usually hand you a finished PNG. "Make me a banner for my Chrome extension" ended in an HTML file. So the tool closes that loop — the agent picks a preset (35+ platforms), a theme (8 curated palettes), composes a config from your description, and `render_design` returns a high-res PNG.

Key properties:
- Deterministic: same config → same pixel-perfect PNG. No LLM at render time, no API keys.
- Canvas 2D + Playwright under the hood — no external render service.
- Works locally and offline.
- Two interfaces: MCP (for Claude/Cursor/etc.) and a plain CLI.

Demo images: https://github.com/NiL4gh/storecraft-studio

Happy to answer questions. The obvious next step is publishing to npm + a hosted endpoint — feedback on whether that matters for your workflow is welcome.

---

## Twitter / X

**Post 1 (launch):**
Your AI agent can now make you a Gumroad banner, Instagram post, or CWS screenshot — a real PNG, not HTML.

StoreCraft Studio is an MCP server that turns JSON configs into high-res design assets.

35+ presets · 8 themes · deterministic · no API keys

github.com/NiL4gh/storecraft-studio

[attach demo/hero-banner.png]

**Post 2 (hook):**
"Make me a banner for my extension"

Until now that sentence ended in a screenshot of an HTML file. StoreCraft Studio closes the loop: JSON config → high-res PNG, fully deterministic.

MCP server + CLI. Local. Free. Open source.

github.com/NiL4gh/storecraft-studio

[attach demo/cws-screenshot.png]

**Post 3 (differentiator):**
Most MCP "design" servers need an LLM + API key to guess at a design.

StoreCraft Studio doesn't. It renders 35+ platform-specific presets from JSON — the same config always gives the same pixel-perfect PNG. No keys, no guesswork, works offline.

github.com/NiL4gh/storecraft-studio

[attach demo/instagram-post.png]
