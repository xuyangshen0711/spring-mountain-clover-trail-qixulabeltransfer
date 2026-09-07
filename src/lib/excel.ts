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
  fgColor: { argb: "FFF7D774" },
};
const TITLE_FILL = {
  type: "pattern" as const,
  pattern: "solid" as const,
  fgColor: { argb: "FF4D5C4F" },
};
const THIN = {
  style: "thin" as const,
  color: { argb: "FFCFC4B3" },
};

function todayLabel(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function styleHeader(cell: ExcelCell, bold = true) {
  cell.fill = HEADER_FILL;
  cell.font = { name: "Microsoft YaHei", size: 11, bold };
  cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  cell.border = { top: THIN, left: THIN, bottom: THIN, right: THIN };
}

function styleBody(cell: ExcelCell, align: "left" | "center" = "center") {
  cell.font = { name: "Microsoft YaHei", size: 10 };
  cell.alignment = { vertical: "middle", horizontal: align, wrapText: true };
  cell.border = { top: THIN, left: THIN, bottom: THIN, right: THIN };
}

export type DraftExcelInput = {
  lines: DraftLine[];
  productMap: Map<string, Product>;
};

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
  const date = todayLabel();

  const qixuCols: string[] = [];
  for (const line of input.lines) {
    if (line.qty > 0 && !qixuCols.includes(line.qixuSize)) qixuCols.push(line.qixuSize);
  }
  const preferred = ["XS", "S", "M", "L", "XL", "XXL", "F"];
  qixuCols.sort((a, b) => {
    const ia = preferred.indexOf(a.toUpperCase());
    const ib = preferred.indexOf(b.toUpperCase());
    if (ia >= 0 && ib >= 0) return ia - ib;
    if (ia >= 0) return -1;
    if (ib >= 0) return 1;
    return a.localeCompare(b, "zh");
  });

  const groups = new Map<string, DraftLine[]>();
  for (const line of input.lines) {
    if (line.qty <= 0) continue;
    const k = `${line.productId}||${line.color}`;
    const arr = groups.get(k) ?? [];
    arr.push(line);
    groups.set(k, arr);
  }

  const sheet = wb.addWorksheet("改标明细", {
    views: [{ showGridLines: false }],
    pageSetup: {
      orientation: "landscape",
      paperSize: 9,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      horizontalDpi: 96,
      verticalDpi: 96,
    },
  });

  const sizeStart = 10;
  const lastCol = sizeStart + qixuCols.length; // 合计
  const colLetter = (i: number) => {
    let n = i;
    let s = "";
    while (n > 0) {
      const r = (n - 1) % 26;
      s = String.fromCharCode(65 + r) + s;
      n = Math.floor((n - 1) / 26);
    }
    return s;
  };

  sheet.mergeCells(`A1:${colLetter(lastCol)}1`);
  const title = sheet.getCell("A1");
  title.value = `启序改标单    改标日期 ${date}`;
  title.fill = TITLE_FILL;
  title.font = { name: "Microsoft YaHei", size: 16, bold: true, color: { argb: "FFF4EFE6" } };
  title.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(1).height = 28;

  const headers1 = [
    "序号",
    "工厂",
    "原款号",
    "启序款号",
    "颜色",
    "面料",
    "改标要求",
    "改标前",
    "改标后",
  ];
  headers1.forEach((h, i) => {
    const cell = sheet.getCell(2, i + 1);
    cell.value = h;
    styleHeader(cell);
    sheet.mergeCells(2, i + 1, 3, i + 1);
  });

  if (qixuCols.length) {
    sheet.mergeCells(2, sizeStart, 2, lastCol - 1);
    const qtyHead = sheet.getCell(2, sizeStart);
    qtyHead.value = "数量（启序尺码）";
    styleHeader(qtyHead);
  }
  qixuCols.forEach((sz, i) => {
    const cell = sheet.getCell(3, sizeStart + i);
    cell.value = sz;
    styleHeader(cell);
  });
  const totalHead = sheet.getCell(2, lastCol);
  totalHead.value = "合计";
  styleHeader(totalHead);
  sheet.mergeCells(2, lastCol, 3, lastCol);

  sheet.getRow(2).height = 22;
  sheet.getRow(3).height = 22;

  let r = 4;
  let idx = 1;
  for (const [, lines] of groups) {
    const first = lines[0];
    const product = input.productMap.get(first.productId);
    const qtyByQixu: Record<string, number> = {};
    let sum = 0;
    for (const line of lines) {
      qtyByQixu[line.qixuSize] = (qtyByQixu[line.qixuSize] ?? 0) + line.qty;
      sum += line.qty;
    }
    const values = [
      idx,
      first.factory,
      first.originalSku ?? "—",
      first.productId,
      first.color,
      first.fabric,
      first.ruleLabel,
      product?.factorySizes.join("/") ?? "",
      product?.qixuSizes.join("/") ?? "",
    ];
    values.forEach((v, i) => {
      const cell = sheet.getCell(r, i + 1);
      cell.value = v as string | number;
      styleBody(cell, i === 5 || i === 6 ? "left" : "center");
    });
    qixuCols.forEach((sz, i) => {
      const cell = sheet.getCell(r, sizeStart + i);
      const n = qtyByQixu[sz] ?? 0;
      cell.value = n || "";
      styleBody(cell);
    });
    const sumCell = sheet.getCell(r, lastCol);
    sumCell.value = sum;
    styleBody(sumCell);
    sheet.getRow(r).height = 32;
    r += 1;
    idx += 1;
  }

  const widths = [8, 10, 14, 14, 12, 28, 18, 16, 16];
  widths.forEach((w, i) => {
    sheet.getColumn(i + 1).width = w;
  });
  qixuCols.forEach((_, i) => {
    sheet.getColumn(sizeStart + i).width = 8;
  });
  sheet.getColumn(lastCol).width = 10;

  const mapSheet = wb.addWorksheet("尺码对照", {
    pageSetup: {
      orientation: "landscape",
      paperSize: 9,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      horizontalDpi: 96,
      verticalDpi: 96,
    },
  });
  mapSheet.mergeCells("A1:F1");
  const t2 = mapSheet.getCell("A1");
  t2.value = `启序尺码对照    ${date}`;
  t2.fill = TITLE_FILL;
  t2.font = { name: "Microsoft YaHei", size: 16, bold: true, color: { argb: "FFF4EFE6" } };
  t2.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  mapSheet.getRow(1).height = 28;

  ["工厂", "原款号", "启序款号", "改标要求", "工厂尺码", "启序尺码"].forEach((h, i) => {
    const cell = mapSheet.getCell(2, i + 1);
    cell.value = h;
    styleHeader(cell);
  });

  const seen = new Set<string>();
  let mr = 3;
  for (const line of input.lines) {
    if (seen.has(line.productId)) continue;
    seen.add(line.productId);
    const product = input.productMap.get(line.productId);
    const vals = [
      line.factory,
      line.originalSku ?? "—",
      line.productId,
      line.ruleLabel,
      product?.factorySizes.join("/") ?? "",
      product?.qixuSizes.join("/") ?? "",
    ];
    vals.forEach((v, i) => {
      const cell = mapSheet.getCell(mr, i + 1);
      cell.value = v;
      styleBody(cell, i === 3 ? "left" : "center");
    });
    mapSheet.getRow(mr).height = 24;
    mr += 1;
  }
  [12, 14, 14, 22, 18, 18].forEach((w, i) => {
    mapSheet.getColumn(i + 1).width = w;
  });

  return wb;
}

export async function downloadDraftExcel(input: DraftExcelInput) {
  const wb = await buildDraftWorkbook(input);
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const date = todayLabel();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `启序改标单_${date}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}
