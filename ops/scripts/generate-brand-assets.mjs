import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, "../../apps/web/public/brand");

const palette = {
  accent: "#0B63CE",
  accentSoft: "#C4A46A",
  base: "#102033",
  line: "#D8E0EA",
  mist: "#F6F8FB",
  slate: "#5E738C",
  white: "#FFFFFF"
};

const gridPattern = `
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.base}" />
      <stop offset="58%" stop-color="#123B66" />
      <stop offset="100%" stop-color="#0C1726" />
    </linearGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M 64 0 L 0 0 0 64" fill="none" stroke="${palette.line}" stroke-opacity="0.08" stroke-width="1"/>
    </pattern>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="30" />
    </filter>
  </defs>
`;

function wrapSvg({ body, height, width }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  ${gridPattern}
  ${body}
</svg>
`;
}

function renderFrame({ code, label, height, width }) {
  return `
  <rect width="${width}" height="${height}" rx="48" fill="url(#bgGradient)" />
  <rect x="44" y="44" width="${width - 88}" height="${height - 88}" rx="36" fill="url(#bgGradient)" stroke="${palette.white}" stroke-opacity="0.08" />
  <rect width="${width}" height="${height}" rx="48" fill="url(#grid)" />
  <circle cx="${width - 220}" cy="136" r="92" fill="${palette.accent}" fill-opacity="0.12" filter="url(#softGlow)" />
  <rect x="88" y="88" rx="999" ry="999" width="176" height="42" fill="${palette.white}" fill-opacity="0.1" />
  <text x="116" y="116" fill="${palette.white}" fill-opacity="0.9" font-family="IBM Plex Sans, Segoe UI, Helvetica Neue, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="1.6">${label}</text>
  <rect x="88" y="${height - 174}" rx="28" ry="28" width="${width - 176}" height="90" fill="${palette.base}" fill-opacity="0.5" stroke="${palette.white}" stroke-opacity="0.08" />
  <text x="128" y="${height - 122}" fill="${palette.white}" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="44" font-weight="700" letter-spacing="6">${code}</text>
  `;
}

function renderHero() {
  const width = 1600;
  const height = 900;

  const body = `
  <rect width="${width}" height="${height}" rx="56" fill="url(#bgGradient)" />
  <rect x="64" y="64" width="${width - 128}" height="${height - 128}" rx="44" fill="none" stroke="${palette.white}" stroke-opacity="0.08" />
  <rect width="${width}" height="${height}" rx="56" fill="url(#grid)" />
  <path d="M 90 708 C 308 468 562 416 792 504 C 1024 592 1208 662 1512 406" stroke="${palette.accentSoft}" stroke-width="8" stroke-linecap="round" stroke-opacity="0.85"/>
  <path d="M 168 620 L 412 620 L 412 340 L 720 340 L 720 540 L 986 540 L 986 250 L 1328 250" stroke="${palette.white}" stroke-opacity="0.22" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="1080" y="468" width="280" height="186" rx="26" fill="${palette.white}" fill-opacity="0.08" stroke="${palette.white}" stroke-opacity="0.1"/>
  <rect x="1130" y="510" width="180" height="20" rx="10" fill="${palette.white}" fill-opacity="0.62"/>
  <rect x="1130" y="554" width="132" height="16" rx="8" fill="${palette.white}" fill-opacity="0.24"/>
  <rect x="1130" y="592" width="166" height="16" rx="8" fill="${palette.accent}" fill-opacity="0.45"/>
  <path d="M 118 206 H 360" stroke="${palette.accentSoft}" stroke-width="3" stroke-linecap="round" />
  <path d="M 118 236 H 324" stroke="${palette.white}" stroke-opacity="0.6" stroke-width="3" stroke-linecap="round" />
  <circle cx="1118" cy="186" r="132" fill="${palette.accent}" fill-opacity="0.12" filter="url(#softGlow)" />
  <circle cx="348" cy="242" r="10" fill="${palette.accentSoft}" />
  <circle cx="480" cy="620" r="10" fill="${palette.accentSoft}" />
  <circle cx="866" cy="538" r="10" fill="${palette.accentSoft}" />
  <circle cx="986" cy="250" r="10" fill="${palette.accentSoft}" />
  <text x="118" y="168" fill="${palette.white}" fill-opacity="0.86" font-family="IBM Plex Sans, Segoe UI, Helvetica Neue, Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="2.4">FORMACION TECNICA PRESENCIAL</text>
  `;

  return wrapSvg({ body, height, width });
}

function renderAdministrativeMotif() {
  return `
  <rect x="200" y="210" width="178" height="360" rx="22" fill="${palette.white}" fill-opacity="0.1" />
  <rect x="420" y="170" width="210" height="420" rx="22" fill="${palette.accent}" fill-opacity="0.22" />
  <rect x="678" y="248" width="220" height="286" rx="22" fill="${palette.white}" fill-opacity="0.1" />
  <path d="M 258 290 H 318 M 258 332 H 344 M 258 374 H 334 M 478 258 H 566 M 478 302 H 590 M 478 346 H 582 M 736 324 H 836 M 736 366 H 810" stroke="${palette.white}" stroke-opacity="0.68" stroke-width="12" stroke-linecap="round"/>
  `;
}

function renderStylingMotif() {
  return `
  <path d="M 248 612 C 272 430 362 252 540 222 C 686 198 790 286 824 454" stroke="${palette.accentSoft}" stroke-width="16" stroke-linecap="round" />
  <path d="M 312 632 C 328 494 404 342 554 320 C 676 304 768 378 796 514" stroke="${palette.white}" stroke-opacity="0.44" stroke-width="12" stroke-linecap="round" />
  <path d="M 486 202 C 718 202 806 330 806 504" stroke="${palette.accent}" stroke-opacity="0.46" stroke-width="32" stroke-linecap="round"/>
  <circle cx="854" cy="604" r="84" fill="${palette.white}" fill-opacity="0.08" stroke="${palette.white}" stroke-opacity="0.22" />
  `;
}

function renderPatternMotif() {
  return `
  <path d="M 194 582 L 478 298 L 722 542 L 930 334" stroke="${palette.accentSoft}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 214 404 L 512 106" stroke="${palette.white}" stroke-opacity="0.3" stroke-width="8" />
  <path d="M 302 670 L 756 216" stroke="${palette.white}" stroke-opacity="0.3" stroke-width="8" />
  <path d="M 474 702 L 936 240" stroke="${palette.white}" stroke-opacity="0.3" stroke-width="8" />
  <rect x="538" y="226" width="244" height="244" rx="20" fill="none" stroke="${palette.accent}" stroke-opacity="0.34" stroke-width="10" stroke-dasharray="14 18"/>
  `;
}

function renderBakeryMotif() {
  return `
  <ellipse cx="402" cy="454" rx="162" ry="122" fill="${palette.white}" fill-opacity="0.12"/>
  <ellipse cx="618" cy="410" rx="180" ry="138" fill="${palette.accent}" fill-opacity="0.16"/>
  <ellipse cx="786" cy="502" rx="154" ry="110" fill="${palette.white}" fill-opacity="0.1"/>
  <path d="M 302 430 C 352 380 458 380 504 430" stroke="${palette.accentSoft}" stroke-width="16" stroke-linecap="round"/>
  <path d="M 520 390 C 576 334 680 334 740 390" stroke="${palette.white}" stroke-opacity="0.7" stroke-width="14" stroke-linecap="round"/>
  <path d="M 696 482 C 736 444 822 444 860 482" stroke="${palette.accentSoft}" stroke-width="14" stroke-linecap="round"/>
  `;
}

function renderStorageMotif() {
  return `
  <path d="M 250 544 L 446 430 L 446 628 L 250 740 Z" fill="${palette.white}" fill-opacity="0.1" stroke="${palette.white}" stroke-opacity="0.18"/>
  <path d="M 446 430 L 654 548 L 654 748 L 446 628 Z" fill="${palette.accent}" fill-opacity="0.24" stroke="${palette.white}" stroke-opacity="0.18"/>
  <path d="M 250 544 L 458 664 L 654 548 L 446 430 Z" fill="${palette.white}" fill-opacity="0.14" stroke="${palette.white}" stroke-opacity="0.18"/>
  <path d="M 612 282 L 772 190 L 772 352 L 612 444 Z" fill="${palette.white}" fill-opacity="0.08" stroke="${palette.white}" stroke-opacity="0.14"/>
  <path d="M 772 190 L 952 294 L 952 456 L 772 352 Z" fill="${palette.accentSoft}" fill-opacity="0.18" stroke="${palette.white}" stroke-opacity="0.14"/>
  <path d="M 612 282 L 792 386 L 952 294 L 772 190 Z" fill="${palette.white}" fill-opacity="0.12" stroke="${palette.white}" stroke-opacity="0.14"/>
  `;
}

function renderProgrammingMotif() {
  return `
  <path d="M 252 286 L 162 404 L 252 522" stroke="${palette.accentSoft}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 846 286 L 936 404 L 846 522" stroke="${palette.accentSoft}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 506 230 L 406 576" stroke="${palette.white}" stroke-opacity="0.62" stroke-width="14" stroke-linecap="round"/>
  <rect x="314" y="302" width="442" height="208" rx="28" fill="${palette.white}" fill-opacity="0.08" stroke="${palette.white}" stroke-opacity="0.18"/>
  <circle cx="404" cy="404" r="16" fill="${palette.accent}" />
  <circle cx="526" cy="404" r="16" fill="${palette.white}" fill-opacity="0.8" />
  <circle cx="648" cy="404" r="16" fill="${palette.accentSoft}" />
  <path d="M 404 404 H 648" stroke="${palette.white}" stroke-opacity="0.32" stroke-width="6" />
  `;
}

function renderElectronicsMotif() {
  return `
  <path d="M 236 504 H 456 V 332 H 646 V 572 H 904" stroke="${palette.white}" stroke-opacity="0.44" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 312 238 V 402 H 468" stroke="${palette.accentSoft}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 728 270 V 408 H 870" stroke="${palette.accent}" stroke-opacity="0.52" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="236" cy="504" r="18" fill="${palette.accentSoft}" />
  <circle cx="456" cy="332" r="18" fill="${palette.white}" fill-opacity="0.78" />
  <circle cx="646" cy="572" r="18" fill="${palette.accent}" />
  <circle cx="904" cy="572" r="18" fill="${palette.white}" fill-opacity="0.78" />
  <circle cx="312" cy="238" r="18" fill="${palette.accent}" />
  <circle cx="870" cy="408" r="18" fill="${palette.accentSoft}" />
  `;
}

function renderProgramSvg({ code, filename, label, motif }) {
  const width = 1200;
  const height = 1200;
  const body = `
  ${renderFrame({ code, label, height, width })}
  ${motif()}
  `;

  return {
    filename,
    content: wrapSvg({ body, height, width })
  };
}

const assets = [
  {
    filename: "hero-campus.svg",
    content: renderHero()
  },
  renderProgramSvg({
    code: "ADM",
    filename: "program-apoyo-administrativo.svg",
    label: "APOYO ADMINISTRATIVO",
    motif: renderAdministrativeMotif
  }),
  renderProgramSvg({
    code: "EST",
    filename: "program-estilismo.svg",
    label: "ESTILISMO",
    motif: renderStylingMotif
  }),
  renderProgramSvg({
    code: "PAT",
    filename: "program-patronaje.svg",
    label: "PATRONAJE",
    motif: renderPatternMotif
  }),
  renderProgramSvg({
    code: "PAN",
    filename: "program-panificacion-industrial.svg",
    label: "PANIFICACION INDUSTRIAL",
    motif: renderBakeryMotif
  }),
  renderProgramSvg({
    code: "LOG",
    filename: "program-control-almacenamiento.svg",
    label: "CONTROL DE ALMACENAMIENTO",
    motif: renderStorageMotif
  }),
  renderProgramSvg({
    code: "DEV",
    filename: "program-programacion-sistemas.svg",
    label: "PROGRAMACION DE SISTEMAS",
    motif: renderProgrammingMotif
  }),
  renderProgramSvg({
    code: "ELE",
    filename: "program-mantenimiento-electronico.svg",
    label: "MANTENIMIENTO ELECTRONICO",
    motif: renderElectronicsMotif
  })
];

await mkdir(outputDir, { recursive: true });

for (const asset of assets) {
  await writeFile(path.join(outputDir, asset.filename), asset.content, "utf8");
}

console.log(`Generated ${assets.length} brand assets in ${outputDir}`);
