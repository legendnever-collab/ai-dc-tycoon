# Visual Design System — v0.7

Theme: Premium sci-fi strategy engineering dashboard.

Shared tokens: background #07111c, panel #101e2c, line #294255, primary optical #77d9de, substrate/success #95ddba, electrical/compute #79b3e5, network #b4a2ec, warning #e9c47c.

Hierarchy: global Campaign shell → Chapter objective → Mission step → live world → control workbench → Simulation result/reward → optional engineering detail.

Typography uses system/Noto Sans KR fallback, clamp25–36px headings,12–14px body,10–11px metadata. Shared radius8/14/20px and spacing6/12/18/24/32px. Buttons have44px default target, visible selected/hover/focus states and descriptive labels.

Navigator stays visible in Data Center, CPO Package, OE, Substrate and Lab. All5 steps stay in one row; mobile short labels retain accessible full chapter/status names. Study content stacks on narrow screens. Control panels move before the world on touch layouts.16 channels use4-column desktop/2-column mobile inspector.

Native SVG diagrams show component boundaries and typed connectivity. Signal dash/glow indicates candidate path state, not EM field. Reward reveal and signal motion honor prefers-reduced-motion. No network font or image asset is loaded.
