import heic2any from 'heic2any';
import * as exifr from 'exifr';

export interface JpegOptions {
  quality?: number; // 0~1 (기본 0.85)
  maxWidth?: number;
  maxHeight?: number;
  fileNameBase?: string;
}

const getExt = (name: string) => {
  const i = name.lastIndexOf('.');
  return i > -1 ? name.slice(i + 1).toLowerCase() : '';
};
const isHeic = (f: File) => f.type === 'image/heic' || getExt(f.name) === 'heic';

async function loadBitmap(blob: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(blob, { imageOrientation: 'from-image' });
    } catch {}
  }
  const url = URL.createObjectURL(blob);
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = url;
  });
  URL.revokeObjectURL(url);
  return img;
}

function applyOrientation(ctx: CanvasRenderingContext2D, o: number, w: number, h: number) {
  switch (o) {
    case 2:
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      break;
    case 3:
      ctx.translate(w, h);
      ctx.rotate(Math.PI);
      break;
    case 4:
      ctx.translate(0, h);
      ctx.scale(1, -1);
      break;
    case 5:
      ctx.rotate(1.5 * Math.PI);
      ctx.scale(1, -1);
      ctx.translate(-h, 0);
      break;
    case 6:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -h);
      break;
    case 7:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(w, -h);
      ctx.scale(-1, 1);
      break;
    case 8:
      ctx.rotate(1.5 * Math.PI);
      ctx.translate(-w, 0);
      break;
    default:
      break;
  }
}

function fitSize(sw: number, sh: number, mw?: number, mh?: number) {
  if (!mw && !mh) return { w: sw, h: sh };
  const r = sw / sh;
  let w = sw,
    h = sh;
  if (mw && w > mw) {
    w = mw;
    h = Math.round(w / r);
  }
  if (mh && h > mh) {
    h = mh;
    w = Math.round(h * r);
  }
  return { w, h };
}

export async function convertToJPEG(original: File, opts: JpegOptions = {}) {
  const { quality = 0.85, maxWidth, maxHeight, fileNameBase } = opts;

  let baseBlob: Blob;
  if (isHeic(original)) {
    baseBlob = (await heic2any({ blob: original, toType: 'image/jpeg', quality })) as Blob;
  } else {
    baseBlob = original;
  }

  const bmpOrImg = await loadBitmap(baseBlob);
  const sw = (bmpOrImg as any).width;
  const sh = (bmpOrImg as any).height;

  // 3) <img> fallback 시 EXIF Orientation 수동 보정
  let orientation = 1;
  if (bmpOrImg instanceof HTMLImageElement) {
    try {
      const exif = await exifr.parse(baseBlob, { tiff: true, exif: true });
      orientation = (exif?.Orientation ?? 1) as number;
    } catch {}
  }

  // 4) 캔버스에 리사이즈/회전 반영
  const { w: outW0, h: outH0 } = fitSize(sw, sh, maxWidth, maxHeight);
  const swap = [5, 6, 7, 8].includes(orientation);
  const canvas = document.createElement('canvas');
  canvas.width = swap ? outH0 : outW0;
  canvas.height = swap ? outW0 : outH0;
  const ctx = canvas.getContext('2d', { alpha: false })!;
  ctx.save();
  applyOrientation(ctx, orientation, canvas.width, canvas.height);
  ctx.drawImage(bmpOrImg as any, 0, 0, sw, sh, 0, 0, outW0, outH0);
  ctx.restore();

  // 5) 최종 JPEG 출력
  const mime = 'image/jpeg';
  const blob: Blob = await new Promise((r) => canvas.toBlob((b) => r(b!), mime, quality));
  const base = (fileNameBase && fileNameBase.trim()) || original.name.replace(/\.[^.]$/, '');
  const file = new File([blob], `${base}.jpg`, { type: mime });

  return {
    blob,
    file,
    width: canvas.width,
    height: canvas.height,
    mime,
    ext: 'jpg' as const,
    original,
  };
}

export async function convertManyToJPEG(list: FileList | File[], opts?: JpegOptions): Promise<File[]> {
  const files = Array.from(list);
  const converted = await Promise.all(files.map((f) => convertToJPEG(f, opts).then((r) => r.file)));
  return converted;
}

export async function convertOnlyHeic(files: FileList | File[], opts?: { quality?: number }) {
  const arr = Array.from(files);
  const out: File[] = [];
  for (const f of arr) {
    if (isHeic(f)) {
      const { file } = await convertToJPEG(f, { quality: opts?.quality ?? 0.85 });
      out.push(file);
    } else {
      out.push(f); // 그대로
    }
  }
  return out;
}
