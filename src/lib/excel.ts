import type { Product } from "@/data/catalog";
import type { DraftLine } from "@/lib/draft-store";

type ExcelCell = {
  value?: unknown;
  fill?: unknown;
  font?: unknown;
  alignment?: unknown;
  border?: unknown;
};

const HEADER_FILL = {
  type: "pattern" as const,
  pattern: "solid" as const,
  fgColor: { argb: "FFF5C242" },
};
const FACTORY_FILL = {
  type: "pattern" as const,
  pattern: "solid" as const,
  fgColor: { argb: "FFE23B3B" },
};
const THIN = {
  style: "thin" as const,
  color: { argb: "FFD0D0D0" },
};

const SIZE_COLS = [
  { key: "XS", label: "XS" },
  { key: "S", label: "S (26)" },
  { key: "M", label: "M (27)" },
  { key: "L", label: "L (28)" },
  { key: "XL", label: "XL" },
  { key: "XXL", label: "XXL" },
] as const;

function todaySlash(d = new Date()): string {
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

function todayFile(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function styleHeader(cell: ExcelCell) {
  cell.fill = HEADER_FILL;
  cell.font = { name: "Microsoft YaHei", size: 10, bold: true };
  cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  cell.border = { top: THIN, left: THIN, bottom: THIN, right: THIN };
}

function styleBody(cell: ExcelCell, align: "left" | "center" = "center") {
  cell.font = { name: "Microsoft YaHei", size: 10 };
  cell.alignment = { vertical: "middle", horizontal: align, wrapText: true };
  cell.border = { top: THIN, left: THIN, bottom: THIN, right: THIN };
}

function sizeRange(sizes: string[]): string {
  const clean = sizes.map((s) => s.trim()).filter(Boolean);
  if (!clean.length) return "";
  if (clean.length === 1) return clean[0];
  return `${clean[0]}-${clean[clean.length - 1]}`;
}

function colLetter(i: number) {
  let n = i;
  let s = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

export type DraftExcelInput = {
  lines: DraftLine[];
  productMap: Map<string, Product>;
};

function photosFor(product: Product | undefined, color: string) {
  const colorImg = product?.colors.find((c) => c.name === color)?.image || null;
  const front = product?.imageFront || colorImg || null;
  const extra =
    colorImg && colorImg !== front
      ? colorImg
      : product?.imageSide && product.imageSide !== front
        ? product.imageSide
        : null;
  return { front, extra };
}

function bytesToBase64(bytes: Uint8Array): string {
  if (typeof btoa === "function") {
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }
  return Buffer.from(bytes).toString("base64");
}

async function loadPhoto(
  src: string,
): Promise<{ base64: string; extension: "jpeg" | "png" } | null> {
  try {
    if (src.startsWith("data:")) {
      const m = src.match(
        /^data:image\/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=\s]+)$/i,
      );
      if (!m) return null;
      const extension = m[1].toLowerCase() === "png" ? "png" : "jpeg";
      return { base64: m[2].replace(/\s+/g, ""), extension };
    }
    const url =
      src.startsWith("http://") || src.startsWith("https://")
        ? src
        : typeof window !== "undefined"
          ? new URL(src, window.location.origin).href
          : src;
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    if (buf.length < 32) return null;
    const ct = res.headers.get("content-type") || "";
    const png =
      /png/i.test(ct) ||
      src.toLowerCase().includes(".png") ||
      (buf[0] === 0x89 && buf[1] === 0x50);
    return { base64: bytesToBase64(buf), extension: png ? "png" : "jpeg" };
  } catch {
    return null;
  }
}

async function loadWorkbook() {
  const mod = (await import("exceljs")) as {
    default?: { Workbook: new () => InstanceType<typeof import("exceljs").Workbook> };
    Workbook?: new () => InstanceType<typeof import("exceljs").Workbook>;
  };
  const ExcelJS = mod.default ?? mod;
  if (!ExcelJS.Workbook) throw new Error("exceljs 加载失败");
  return new ExcelJS.Workbook();
}

export async function buildDraftWorkbook(input: DraftExcelInput) {
  const wb = await loadWorkbook();
  wb.creator = "启序改标";
  wb.created = new Date();
  const date = todaySlash();

  const extraSizeKeys: string[] = [];
  for (const line of input.lines) {
    if (line.qty <= 0) continue;
    const key = line.factorySize.trim().toUpperCase();
    if (!SIZE_COLS.some((s) => s.key === key) && !extraSizeKeys.includes(key)) {
      extraSizeKeys.push(key);
    }
  }
  const sizeCols = [
    ...SIZE_COLS.map((s) => ({ key: s.key, label: s.label })),
    ...extraSizeKeys.map((k) => ({ key: k, label: k })),
  ];

  const groups = new Map<string, DraftLine[]>();
  for (const line of input.lines) {
    if (line.qty <= 0) continue;
    const k = `${line.productId}||${line.color}`;
    const arr = groups.get(k) ?? [];
    arr.push(line);
    groups.set(k, arr);
  }

  const sheet = wb.addWorksheet("改标单", {
    views: [{ state: "frozen", ySplit: 2, showGridLines: true }],
    pageSetup: {
      orientation: "landscape",
      paperSize: 9,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      horizontalDpi: 96,
      verticalDpi: 96,
    },
  });

  const sizeStart = 10; // J
  const lastSize = sizeStart + sizeCols.length - 1;
  const totalCol = lastSize + 1;
  const ruleCol = totalCol + 1;
  const afterCol = ruleCol + 1;
  const noteCol = afterCol + 1;

  const leftHeaders = [
    "上架日期",
    "改标日期",
    "工厂",
    "原款号",
    "款号",
    "颜色",
    "面料",
    "图片（正面）",
    "图片（侧面/多色）",
  ];
  leftHeaders.forEach((h, i) => {
    const cell = sheet.getCell(1, i + 1);
    cell.value = h;
    styleHeader(cell);
    sheet.mergeCells(1, i + 1, 2, i + 1);
  });

  if (sizeCols.length) {
    sheet.mergeCells(1, sizeStart, 1, lastSize);
    const qtyHead = sheet.getCell(1, sizeStart);
    qtyHead.value = "数量";
    styleHeader(qtyHead);
    for (let c = sizeStart; c <= lastSize; c += 1) styleHeader(sheet.getCell(1, c));
  }
  sizeCols.forEach((sz, i) => {
    const cell = sheet.getCell(2, sizeStart + i);
    cell.value = sz.label;
    styleHeader(cell);
  });

  [
    [totalCol, "总"],
    [ruleCol, "改标要求"],
    [afterCol, "启序改标后尺码范围"],
    [noteCol, "备注"],
  ].forEach(([c, label]) => {
    const cell = sheet.getCell(1, c as number);
    cell.value = label as string;
    styleHeader(cell);
    sheet.mergeCells(1, c as number, 2, c as number);
  });

  sheet.getRow(1).height = 22;
  sheet.getRow(2).height = 22;
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 2, column: noteCol },
  };

  const photoCache = new Map<string, number | null>();
  async function imageIdFor(src: string | null): Promise<number | null> {
    if (!src) return null;
    if (photoCache.has(src)) return photoCache.get(src) ?? null;
    const loaded = await loadPhoto(src);
    if (!loaded) {
      photoCache.set(src, null);
      return null;
    }
    const id = wb.addImage({
      base64: loaded.base64,
      extension: loaded.extension,
    });
    photoCache.set(src, id);
    return id;
  }

  let r = 3;
  for (const [, lines] of groups) {
    const first = lines[0];
    const product = input.productMap.get(first.productId);
    const qtyBy: Record<string, number> = {};
    let sum = 0;
    for (const line of lines) {
      const key = line.factorySize.trim().toUpperCase();
      qtyBy[key] = (qtyBy[key] ?? 0) + line.qty;
      sum += line.qty;
    }

    const leftVals = [
      product?.listMonth ?? "",
      date,
      first.factory,
      first.originalSku ?? "—",
      first.productId,
      first.color,
      first.fabric,
      "",
      "",
    ];
    leftVals.forEach((v, i) => {
      const cell = sheet.getCell(r, i + 1);
      cell.value = v;
      styleBody(cell, i === 6 ? "left" : "center");
    });

    const factoryCell = sheet.getCell(r, 3);
    factoryCell.fill = FACTORY_FILL;
    factoryCell.font = {
      name: "Microsoft YaHei",
      size: 10,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    sizeCols.forEach((sz, i) => {
      const cell = sheet.getCell(r, sizeStart + i);
      const n = qtyBy[sz.key] ?? 0;
      cell.value = n || "";
      styleBody(cell);
    });

    const totalCell = sheet.getCell(r, totalCol);
    totalCell.value = sum;
    styleBody(totalCell);

    const ruleCell = sheet.getCell(r, ruleCol);
    ruleCell.value = first.ruleLabel;
    styleBody(ruleCell, "left");

    const afterCell = sheet.getCell(r, afterCol);
    afterCell.value = sizeRange(product?.qixuSizes ?? []);
    styleBody(afterCell);

    const noteCell = sheet.getCell(r, noteCol);
    noteCell.value = product?.extraNote ?? "";
    styleBody(noteCell, "left");

    sheet.getRow(r).height = 86;

    const { front, extra } = photosFor(product, first.color);
    const frontId = await imageIdFor(front);
    if (frontId != null) {
      sheet.addImage(frontId, {
        tl: { col: 7.08, row: r - 1 + 0.08 },
        ext: { width: 58, height: 76 },
        editAs: "oneCell",
      });
    }
    const extraId = await imageIdFor(extra);
    if (extraId != null) {
      sheet.addImage(extraId, {
        tl: { col: 8.08, row: r - 1 + 0.08 },
        ext: { width: 58, height: 76 },
        editAs: "oneCell",
      });
    }

    r += 1;
  }

  const widths = [12, 12, 10, 14, 12, 12, 22, 14, 16];
  widths.forEach((w, i) => {
    sheet.getColumn(i + 1).width = w;
  });
  sizeCols.forEach((_, i) => {
    sheet.getColumn(sizeStart + i).width = 9;
  });
  sheet.getColumn(totalCol).width = 8;
  sheet.getColumn(ruleCol).width = 22;
  sheet.getColumn(afterCol).width = 12;
  sheet.getColumn(noteCol).width = 16;

  return wb;
}

export async function downloadDraftExcel(input: DraftExcelInput) {
  const wb = await buildDraftWorkbook(input);
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `启序改标单_${todayFile()}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}
