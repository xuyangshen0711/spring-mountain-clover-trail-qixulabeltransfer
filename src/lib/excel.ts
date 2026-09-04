import { PRODUCT_BY_ID, productAfterRange, type Product } from "@/data/catalog";
import type { DraftRow } from "@/lib/draft-store";
import {
  QTY_COLS,
  factoryQtysToCols,
  qtyTotal,
  shiftFactoryQtysToQixu,
  type QtyCol,
} from "@/lib/relabel";

type ExcelJSMod = typeof import("exceljs");
type Workbook = InstanceType<ExcelJSMod["Workbook"]>;
type Worksheet = ReturnType<Workbook["addWorksheet"]>;

const HEADER_FILL = "F4C430";
const BODY_FILL = "E2EFDA";
const SKU_FILL = "C6E0B4";
const HEADER_FONT = {
  name: "微软雅黑",
  size: 10,
  bold: true,
  color: { argb: "FF1C1916" },
};
const BODY_FONT = { name: "微软雅黑", size: 10, color: { argb: "FF1C1916" } };
const MONO_FONT = { name: "Consolas", size: 10, bold: true, color: { argb: "FF1C1916" } };

const THIN = {
  style: "thin" as const,
  color: { argb: "FFB7C4B0" },
};
const BOX = { top: THIN, left: THIN, bottom: THIN, right: THIN };

const COLS: Array<{ key: string; width: number }> = [
  { key: "listMonth", width: 12 },
  { key: "relabelDate", width: 12 },
  { key: "factory", width: 10 },
  { key: "originalSku", width: 14 },
  { key: "sku", width: 14 },
  { key: "color", width: 12 },
  { key: "fabric", width: 28 },
  { key: "imgFront", width: 12 },
  { key: "imgSide", width: 14 },
  { key: "XS", width: 8 },
  { key: "S", width: 10 },
  { key: "M", width: 10 },
  { key: "L", width: 10 },
  { key: "XL", width: 8 },
  { key: "XXL", width: 8 },
  { key: "total", width: 8 },
  { key: "rule", width: 22 },
  { key: "after", width: 22 },
  { key: "note", width: 16 },
];

function paintHeader(cell: { fill: unknown; font: unknown; alignment: unknown; border: unknown }) {
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: `FF${HEADER_FILL}` },
  };
  cell.font = HEADER_FONT;
  cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  cell.border = BOX;
}

function paintBody(
  cell: { fill: unknown; font: unknown; alignment: unknown; border: unknown },
  kind: "body" | "sku" | "num",
) {
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: `FF${kind === "sku" ? SKU_FILL : BODY_FILL}` },
  };
  cell.font = kind === "sku" ? MONO_FONT : BODY_FONT;
  cell.alignment = {
    horizontal: kind === "num" || kind === "sku" ? "center" : "center",
    vertical: "middle",
    wrapText: true,
  };
  cell.border = BOX;
}

type ExportLine = {
  product: Product;
  row: DraftRow;
  qtys: Record<QtyCol, number>;
  total: number;
  after: string;
  note: string;
  fabric: string;
};

function toLines(
  rows: DraftRow[],
  mode: "factory" | "qixu",
  byId: Map<string, Product>,
): ExportLine[] {
  const out: ExportLine[] = [];
  for (const row of rows) {
    const product = byId.get(row.productId);
    if (!product) continue;
    const color = product.colors.find((c) => c.name === row.color) ?? product.colors[0];
    const qtys =
      mode === "factory"
        ? factoryQtysToCols(row.qtys)
        : shiftFactoryQtysToQixu(product.kind, row.qtys);
    const onesize = product.kind === "onesize" ? qtyTotal(row.qtys) : 0;
    const total =
      product.kind === "onesize"
        ? onesize
        : QTY_COLS.reduce((a, k) => a + (qtys[k] ?? 0), 0);
    const after = productAfterRange(product);
    const notes: string[] = [];
    if (product.kind === "onesize" && onesize) notes.push(`均码 ${onesize}`);
    if (row.note) notes.push(row.note);
    out.push({
      product,
      row,
      qtys,
      total,
      after:
        product.kind === "numeric" && product.extraNote
          ? `${after}（改标尺码） ${product.extraNote}`
          : after,
      note: notes.join("；"),
      fabric: (color?.fabric ?? "").replace(/\n/g, " ").replace(/\s+/g, " ").trim(),
    });
  }
  return out;
}

function fillSheet(ws: Worksheet, mode: "factory" | "qixu", lines: ExportLine[]) {
  ws.properties.defaultRowHeight = 18;
  ws.views = [{ state: "frozen", ySplit: 2, activeCell: "A3", showGridLines: true }];

  COLS.forEach((c, i) => {
    ws.getColumn(i + 1).width = c.width;
  });

  const lastCol = 19;
  const lastRow = Math.max(2, lines.length + 2);

  ws.mergeCells("A1:A2");
  ws.mergeCells("B1:B2");
  ws.mergeCells("C1:C2");
  ws.mergeCells("D1:D2");
  ws.mergeCells("E1:E2");
  ws.mergeCells("F1:F2");
  ws.mergeCells("G1:G2");
  ws.mergeCells("H1:H2");
  ws.mergeCells("I1:I2");
  ws.mergeCells("J1:O1");
  ws.mergeCells("P1:P2");
  ws.mergeCells("Q1:Q2");
  ws.mergeCells("R1:R2");
  ws.mergeCells("S1:S2");

  const titles: Array<[string, string]> = [
    ["A1", "上架日期"],
    ["B1", "该标日期"],
    ["C1", "工厂"],
    ["D1", "原款号"],
    ["E1", "款号"],
    ["F1", "颜色"],
    ["G1", "面料"],
    ["H1", "图片（正面）"],
    ["I1", "图片（侧面/多色）"],
    ["J1", "数量"],
    ["P1", "总"],
    ["Q1", "改标要求"],
    ["R1", "改标后尺码"],
    ["S1", "备注"],
  ];
  for (const [ref, label] of titles) {
    const cell = ws.getCell(ref);
    cell.value = label;
    paintHeader(cell);
  }
  const sizeHeaders = ["xs", "S (26)", "M (27)", "L (28)", "XL", "XXL"] as const;
  sizeHeaders.forEach((label, i) => {
    const cell = ws.getCell(2, 10 + i);
    cell.value = label;
    paintHeader(cell);
  });

  // Paint merged header slaves so fill covers the block.
  for (const col of [1, 2, 3, 4, 5, 6, 7, 8, 9, 16, 17, 18, 19]) {
    paintHeader(ws.getCell(2, col));
  }
  for (let c = 11; c <= 15; c++) paintHeader(ws.getCell(1, c));

  ws.getRow(1).height = 20;
  ws.getRow(2).height = 20;

  lines.forEach((line, idx) => {
    const r = idx + 3;
    const row = ws.getRow(r);
    row.height = 52;
    const values: Array<string | number | null> = [
      line.product.listMonth,
      line.row.relabelDate,
      line.product.factory,
      line.product.originalSku ?? "",
      line.product.id,
      line.row.color,
      line.fabric,
      null,
      null,
      line.qtys.XS || null,
      line.qtys.S || null,
      line.qtys.M || null,
      line.qtys.L || null,
      line.qtys.XL || null,
      line.qtys.XXL || null,
      line.total || null,
      line.product.ruleLabel,
      line.after,
      line.note,
    ];
    values.forEach((v, i) => {
      const cell = row.getCell(i + 1);
      if (v !== null && v !== "") cell.value = v;
      const kind =
        i === 3 || i === 4 ? "sku" : i >= 9 && i <= 15 ? "num" : "body";
      paintBody(cell, kind);
    });
  });

  // Group-merge like the sample: same 款 + 该标日期, split by color.
  let i = 0;
  while (i < lines.length) {
    let j = i;
    while (
      j + 1 < lines.length &&
      lines[j]!.product.id === lines[j + 1]!.product.id &&
      lines[j]!.row.relabelDate === lines[j + 1]!.row.relabelDate
    ) {
      j += 1;
    }
    if (j > i) {
      const r1 = i + 3;
      const r2 = j + 3;
      for (const col of [1, 3, 4, 5, 7, 17, 18]) {
        try {
          ws.mergeCells(r1, col, r2, col);
        } catch {
          /* overlapping merge — skip */
        }
      }
    }
    i = j + 1;
  }

  if (lines.length > 0) {
    ws.autoFilter = {
      from: { row: 2, column: 1 },
      to: { row: lastRow, column: lastCol },
    };
  }

  void mode;
}

export async function downloadDraftExcel(
  rows: DraftRow[],
  products: Product[],
): Promise<void> {
  const byId = new Map<string, Product>();
  for (const p of PRODUCT_BY_ID.values()) byId.set(p.id, p);
  for (const p of products) byId.set(p.id, p);
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = "启序改标";
  wb.created = new Date();

  const factoryLines = toLines(rows, "factory", byId);
  const qixuLines = toLines(rows, "qixu", byId);

  const ws1 = wb.addWorksheet("工作表1", {
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      paperSize: 9,
      horizontalDpi: 96,
      verticalDpi: 96,
    },
  });
  fillSheet(ws1, "factory", factoryLines);

  const ws2 = wb.addWorksheet("改标计算", {
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      paperSize: 9,
      horizontalDpi: 96,
      verticalDpi: 96,
    },
  });
  fillSheet(ws2, "qixu", qixuLines);

  const buffer = await wb.xlsx.writeBuffer();
  const bytes =
    buffer instanceof Uint8Array
      ? buffer
      : new Uint8Array(buffer as ArrayBuffer);
  const blob = new Blob([bytes], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const today = new Date();
  const name = `启序改标_${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}.xlsx`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
