/**
 * One-time utility: removes outer background from kume.png via corner flood-fill.
 * Run: node scripts/make-kume-transparent.mjs
 */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const input = join(root, "public/kume/kume.png");
const output = join(root, "public/kume/kume-transparent.png");

function colorDist(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

async function main() {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const idx = (x, y) => (y * width + x) * channels;

  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  let bgR = 0,
    bgG = 0,
    bgB = 0;
  for (const [x, y] of corners) {
    const i = idx(x, y);
    bgR += data[i];
    bgG += data[i + 1];
    bgB += data[i + 2];
  }
  bgR /= corners.length;
  bgG /= corners.length;
  bgB /= corners.length;

  const TOLERANCE = 48;
  const isBg = (x, y) => {
    const i = idx(x, y);
    return colorDist(data[i], data[i + 1], data[i + 2], bgR, bgG, bgB) <= TOLERANCE;
  };

  const visited = new Uint8Array(width * height);
  const queue = [];

  for (let x = 0; x < width; x++) {
    queue.push([x, 0], [x, height - 1]);
  }
  for (let y = 0; y < height; y++) {
    queue.push([0, y], [width - 1, y]);
  }

  while (queue.length > 0) {
    const [x, y] = queue.pop();
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const vi = y * width + x;
    if (visited[vi]) continue;
    if (!isBg(x, y)) continue;
    visited[vi] = 1;
    queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const vi = y * width + x;
      const i = idx(x, y);
      if (visited[vi]) {
        data[i + 3] = 0;
        continue;
      }
      // Soft edge against background-colored fringe pixels
      let minDist = 999;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          if (visited[ny * width + nx]) {
            const ni = idx(nx, ny);
            const d = colorDist(data[i], data[i + 1], data[i + 2], bgR, bgG, bgB);
            minDist = Math.min(minDist, d);
          }
        }
      }
      if (minDist < TOLERANCE + 18) {
        const feather = Math.min(1, Math.max(0, (minDist - TOLERANCE) / 18));
        data[i + 3] = Math.round(data[i + 3] * feather);
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } }).png().toFile(output);
  console.log(`Wrote ${output}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
