const MAX_SIDE = 560;
const QUALITY = 0.62;
const MAX_DATA_URL = 180_000;

function loadViaElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("图片打不开"));
    };
    img.src = url;
  });
}

function looksHeic(file: File): boolean {
  return /heic|heif/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
}

export async function compressImage(file: File): Promise<string> {
  if (!file.size) throw new Error("空文件");
  if (file.size > 20 * 1024 * 1024) throw new Error("图片超过 20MB，换一张小的");

  let width = 0;
  let height = 0;
  let draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  let close = () => {};

  try {
    const bitmap = await createImageBitmap(file);
    width = bitmap.width;
    height = bitmap.height;
    draw = (ctx, w, h) => ctx.drawImage(bitmap, 0, 0, w, h);
    close = () => bitmap.close();
  } catch {
    try {
      const img = await loadViaElement(file);
      width = img.naturalWidth;
      height = img.naturalHeight;
      draw = (ctx, w, h) => ctx.drawImage(img, 0, 0, w, h);
    } catch {
      throw new Error(
        looksHeic(file)
          ? "iPhone HEIC 传不上，请先在相册里转成 JPG 再选"
          : "图片打不开，请用 JPG / PNG / WebP",
      );
    }
  }

  if (!width || !height) {
    close();
    throw new Error("读不出图片尺寸");
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    close();
    throw new Error("无法压缩图片");
  }
  draw(ctx, w, h);
  close();

  let q = QUALITY;
  let out = canvas.toDataURL("image/jpeg", q);
  while (out.length > MAX_DATA_URL && q > 0.4) {
    q -= 0.08;
    out = canvas.toDataURL("image/jpeg", q);
  }
  if (out.length > 400_000) {
    throw new Error("压缩后还是太大，换一张更简单的图");
  }
  return out;
}
