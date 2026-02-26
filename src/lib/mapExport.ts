import type { Map as MapboxMap } from 'mapbox-gl';
import type { LayerLegend, LegendGradient, LegendSymbol } from '@/types';

// ── Layout constants ─────────────────────────────────────────────
const PAD = 24;
const TITLE_FONT = 'bold 20px "Inter", "Helvetica Neue", Arial, sans-serif';
const TITLE_H = 56; // title bar height
const LABEL_FONT = '12px "Inter", "Helvetica Neue", Arial, sans-serif';
const SMALL_FONT = '10px "Inter", "Helvetica Neue", Arial, sans-serif';
const LEGEND_TITLE_FONT = 'bold 13px "Inter", "Helvetica Neue", Arial, sans-serif';
const LEGEND_LAYER_FONT = 'bold 12px "Inter", "Helvetica Neue", Arial, sans-serif';
const BG = '#ffffff';
const INK = '#141d2d';
const MUTED = '#6b7280';
const BORDER = '#d1d5db';
const NORTH_SIZE = 40;
const SCALE_MAX_PX = 150;
const SWATCH = 14;
const LINE_H = 20;
const GRAD_H = 14;
const GRAD_W = 180;
const LEGEND_W = 220;
const ATTRIB_H = 28;

// ── Public types ─────────────────────────────────────────────────
export interface ExportLayer {
  id: string;
  title: string;
  legend?: LayerLegend;
  styleType?: string; // 'circle' | 'line' | 'fill'
  citation?: string;
}

export interface ExportOptions {
  map: MapboxMap;
  title: string;
  layers: ExportLayer[];
}

export interface ExportResult {
  mapCanvas: HTMLCanvasElement;
  citationsCanvas: HTMLCanvasElement | null;
}

const LOGO_H = 48;
const CITATION_TITLE_FONT = 'bold 16px "Inter", "Helvetica Neue", Arial, sans-serif';
const CITATION_LAYER_FONT = 'bold 12px "Inter", "Helvetica Neue", Arial, sans-serif';
const CITATION_TEXT_FONT = '11px "Inter", "Helvetica Neue", Arial, sans-serif';
const CITATION_W = 700;

// ── Load image helper ───────────────────────────────────────────
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// ── Capture map canvas via render-event trick ────────────────────
function captureMapCanvas(map: MapboxMap): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    map.once('render', () => {
      const src = map.getCanvas();
      const copy = document.createElement('canvas');
      copy.width = src.width;
      copy.height = src.height;
      copy.getContext('2d')!.drawImage(src, 0, 0);
      resolve(copy);
    });
    map.triggerRepaint();
  });
}

// ── Measure legend height ────────────────────────────────────────
function measureLegendHeight(layers: ExportLayer[]): number {
  if (layers.length === 0) return 0;
  let h = PAD + LINE_H + 8; // "Legend" header
  for (const layer of layers) {
    h += LINE_H; // layer title
    if (layer.legend?.type === 'gradient') {
      h += GRAD_H + LINE_H + 8;
    } else if (layer.legend?.type === 'symbol') {
      h += (layer.legend as LegendSymbol).items.length * LINE_H + 4;
    }
    h += 10; // gap between layers
  }
  h += PAD;
  return h;
}

// ── Draw helpers ─────────────────────────────────────────────────
function drawNorthArrow(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  size: number, bearing: number,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((-bearing * Math.PI) / 180);
  const hh = size / 2;
  const hw = size / 4;

  // Dark half
  ctx.beginPath();
  ctx.moveTo(0, -hh);
  ctx.lineTo(hw, hh * 0.4);
  ctx.lineTo(0, hh * 0.15);
  ctx.closePath();
  ctx.fillStyle = INK;
  ctx.fill();

  // Light half
  ctx.beginPath();
  ctx.moveTo(0, -hh);
  ctx.lineTo(-hw, hh * 0.4);
  ctx.lineTo(0, hh * 0.15);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1;
  ctx.stroke();

  // "N" label
  ctx.fillStyle = INK;
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('N', 0, -hh - 4);
  ctx.restore();
}

function getNiceDistance(maxMeters: number): number {
  const nice = [
    1, 2, 5, 10, 20, 50, 100, 200, 500,
    1000, 2000, 5000, 10_000, 20_000, 50_000, 100_000,
    200_000, 500_000, 1_000_000, 2_000_000, 5_000_000,
  ];
  let best = nice[0];
  for (const n of nice) {
    if (n <= maxMeters) best = n;
    else break;
  }
  return best;
}

function drawScaleBar(
  ctx: CanvasRenderingContext2D,
  map: MapboxMap,
  x: number, y: number,
) {
  const center = map.getCenter();
  const zoom = map.getZoom();
  const mpp = (156543.03392 * Math.cos((center.lat * Math.PI) / 180)) / Math.pow(2, zoom);
  const maxDist = mpp * SCALE_MAX_PX;
  const dist = getNiceDistance(maxDist);
  const barPx = dist / mpp;
  const label = dist >= 1000 ? `${dist / 1000} km` : `${dist} m`;

  const barH = 5;
  // Bar background (white outline for visibility)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 1, y - barH - 1, barPx + 2, barH + 2);
  // Bar fill
  ctx.fillStyle = INK;
  ctx.fillRect(x, y - barH, barPx, barH);
  // Tick marks
  ctx.fillRect(x, y - barH - 4, 1.5, barH + 4);
  ctx.fillRect(x + barPx - 1.5, y - barH - 4, 1.5, barH + 4);

  // Label
  ctx.fillStyle = INK;
  ctx.font = LABEL_FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(label, x + barPx / 2, y + 4);
}

function parseCssGradientColors(gradient: string): string[] {
  const match = gradient.match(/linear-gradient\([^,]+,(.+)\)/);
  if (!match) return [];
  const raw = match[1];
  const colors: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of raw) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      const t = cur.trim();
      if (t) colors.push(t);
      cur = '';
    } else {
      cur += ch;
    }
  }
  const last = cur.trim();
  if (last) colors.push(last);
  // Strip percentage suffixes (e.g. "rgb(1,2,3) 50%")
  return colors.map((c) => c.replace(/\s+[\d.]+%$/, ''));
}

function drawGradientLegend(
  ctx: CanvasRenderingContext2D,
  legend: LegendGradient,
  x: number, y: number,
  width: number,
): number {
  const gw = Math.min(width, GRAD_W);
  const colors = legend.colors?.length ? legend.colors : parseCssGradientColors(legend.gradient);

  if (colors.length > 0) {
    const g = ctx.createLinearGradient(x, y, x + gw, y);
    colors.forEach((c, i) => g.addColorStop(i / Math.max(colors.length - 1, 1), c));
    ctx.fillStyle = g;
    ctx.fillRect(x, y, gw, GRAD_H);
  }
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 0.5;
  ctx.strokeRect(x, y, gw, GRAD_H);

  ctx.fillStyle = MUTED;
  ctx.font = SMALL_FONT;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(String(legend.min), x, y + GRAD_H + 3);
  ctx.textAlign = 'right';
  ctx.fillText(`${legend.max} ${legend.unit}`, x + gw, y + GRAD_H + 3);

  return GRAD_H + LINE_H + 8;
}

function drawSymbolItem(
  ctx: CanvasRenderingContext2D,
  item: { color: string; label: string },
  styleType: string | undefined,
  x: number, y: number,
) {
  const sy = y + (LINE_H - SWATCH) / 2;

  if (styleType === 'line') {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, sy + SWATCH / 2);
    ctx.lineTo(x + SWATCH + 4, sy + SWATCH / 2);
    ctx.stroke();
  } else if (styleType === 'fill') {
    ctx.fillStyle = item.color;
    ctx.fillRect(x, sy, SWATCH, SWATCH);
    ctx.strokeStyle = BORDER;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x, sy, SWATCH, SWATCH);
  } else {
    ctx.beginPath();
    ctx.arc(x + SWATCH / 2, sy + SWATCH / 2, SWATCH / 2, 0, Math.PI * 2);
    ctx.fillStyle = item.color;
    ctx.fill();
    ctx.strokeStyle = BORDER;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  ctx.fillStyle = INK;
  ctx.font = LABEL_FONT;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(item.label, x + SWATCH + 8, y + LINE_H / 2);
}

function truncate(ctx: CanvasRenderingContext2D, text: string, max: number): string {
  if (ctx.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 0 && ctx.measureText(t + '…').width > max) t = t.slice(0, -1);
  return t + '…';
}

function drawLegend(
  ctx: CanvasRenderingContext2D,
  layers: ExportLayer[],
  x: number, y: number,
  width: number,
) {
  let cy = y + PAD;

  // Header
  ctx.fillStyle = INK;
  ctx.font = LEGEND_TITLE_FONT;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Legend', x, cy);
  cy += LINE_H + 8;

  for (const layer of layers) {
    // Layer title
    ctx.fillStyle = INK;
    ctx.font = LEGEND_LAYER_FONT;
    ctx.fillText(truncate(ctx, layer.title, width - 8), x, cy);
    cy += LINE_H;

    if (layer.legend?.type === 'gradient') {
      cy += drawGradientLegend(ctx, layer.legend as LegendGradient, x, cy, width - 8);
    } else if (layer.legend?.type === 'symbol') {
      const items = (layer.legend as LegendSymbol).items;
      for (const item of items) {
        drawSymbolItem(ctx, item, layer.styleType, x, cy);
        cy += LINE_H;
      }
      cy += 4;
    }

    cy += 10;
  }
}

// ── Main export function ─────────────────────────────────────────
export async function compositeMapImage(opts: ExportOptions): Promise<HTMLCanvasElement> {
  const { map, title, layers } = opts;
  const captured = await captureMapCanvas(map);

  // Map display dimensions (CSS pixels)
  const mapW = map.getContainer().clientWidth;
  const mapH = map.getContainer().clientHeight;

  // Legend dimensions
  const hasLegend = layers.length > 0;
  const legendH = measureLegendHeight(layers);
  const legendPanelW = hasLegend ? LEGEND_W + PAD : 0;

  // Composite canvas
  const cw = PAD + mapW + legendPanelW + PAD;
  const ch = Math.max(TITLE_H + mapH + ATTRIB_H, TITLE_H + legendH + ATTRIB_H);

  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d')!;

  // 1. White background
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, cw, ch);

  // 2. Map image
  const mapX = PAD;
  const mapY = TITLE_H;
  ctx.drawImage(captured, 0, 0, captured.width, captured.height, mapX, mapY, mapW, mapH);
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 1;
  ctx.strokeRect(mapX, mapY, mapW, mapH);

  // 3. Title
  ctx.fillStyle = INK;
  ctx.font = TITLE_FONT;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, PAD, TITLE_H / 2);

  // 4. North arrow (top-left of map area)
  drawNorthArrow(
    ctx,
    mapX + PAD + NORTH_SIZE / 2,
    mapY + PAD + NORTH_SIZE / 2,
    NORTH_SIZE,
    map.getBearing(),
  );

  // 5. Scale bar (bottom-left of map area)
  drawScaleBar(ctx, map, mapX + PAD, mapY + mapH - PAD);

  // 6. Legend (right of map)
  if (hasLegend) {
    const lx = PAD + mapW + PAD;
    drawLegend(ctx, layers, lx, mapY, LEGEND_W);
  }

  // 7. Logo (bottom-right of map area)
  try {
    const logo = await loadImage('/pi-logo.png');
    const logoScale = LOGO_H / logo.naturalHeight;
    const logoW = logo.naturalWidth * logoScale;
    ctx.drawImage(logo, mapX + mapW - logoW - PAD / 2, mapY + mapH - LOGO_H - PAD / 2, logoW, LOGO_H);
  } catch {
    // Logo failed to load — skip silently
  }

  // 8. Attribution
  ctx.fillStyle = MUTED;
  ctx.font = SMALL_FONT;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText(
    '\u00A9 Mapbox \u00A9 OpenStreetMap contributors | Project InnerSpace',
    PAD,
    ch - 8,
  );

  return canvas;
}

// ── Citations page ──────────────────────────────────────────────
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function composeCitationsImage(
  title: string,
  layers: ExportLayer[],
): HTMLCanvasElement | null {
  const withCitation = layers.filter((l) => l.citation);
  if (withCitation.length === 0) return null;

  // Measure total height
  const measureCanvas = document.createElement('canvas');
  const mCtx = measureCanvas.getContext('2d')!;

  let totalH = PAD + 30 + 16; // top pad + title + gap
  for (const layer of withCitation) {
    totalH += 20; // layer title
    mCtx.font = CITATION_TEXT_FONT;
    const lines = wrapText(mCtx, layer.citation!, CITATION_W - PAD * 2);
    totalH += lines.length * 16 + 12; // text lines + gap
  }
  totalH += PAD; // bottom pad

  const canvas = document.createElement('canvas');
  canvas.width = CITATION_W;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, CITATION_W, totalH);

  let cy = PAD;

  // Title
  ctx.fillStyle = INK;
  ctx.font = CITATION_TITLE_FONT;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`${title} — Citations & Sources`, PAD, cy);
  cy += 30;

  // Separator line
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, cy);
  ctx.lineTo(CITATION_W - PAD, cy);
  ctx.stroke();
  cy += 16;

  // Each layer
  for (const layer of withCitation) {
    // Layer title
    ctx.fillStyle = INK;
    ctx.font = CITATION_LAYER_FONT;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(layer.title, PAD, cy);
    cy += 20;

    // Citation text (wrapped)
    ctx.fillStyle = MUTED;
    ctx.font = CITATION_TEXT_FONT;
    const lines = wrapText(ctx, layer.citation!, CITATION_W - PAD * 2);
    for (const line of lines) {
      ctx.fillText(line, PAD, cy);
      cy += 16;
    }
    cy += 12;
  }

  return canvas;
}

// ── Download helper ──────────────────────────────────────────────
export function downloadCanvasAsPNG(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
