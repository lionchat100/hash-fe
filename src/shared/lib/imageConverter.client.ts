/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import heic2any from 'heic2any';
import * as exifr from 'exifr';

export interface JpegOptions {
  quality?: number; // 0~1
}

const getExt = (name: string) => {
  const i = name.lastIndexOf('.');
  return i > -1 ? name.slice(i + 1).toLowerCase() : '';
};
const isHeic = (f: File) => f.type === 'image/heic' || getExt(f.name) === 'heic';

async function loadBitmap(blob: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
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

// EXIF Orientation(1~8) 보정
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

/** 원본 크기 그대로 JPEG로 변환 (HEIC 지원, 회전 보정) */
export async function convertToJPEG(original: File, opts: JpegOptions = {}) {
  const { quality = 0.85 } = opts;

  let baseBlob: Blob;
  if (isHeic(original)) {
    baseBlob = (await heic2any({ blob: original, toType: 'image/jpeg', quality })) as Blob;
  } else {
    baseBlob = original;
  }

  const bmpOrImg = await loadBitmap(baseBlob);
  const sw = (bmpOrImg as any).width;
  const sh = (bmpOrImg as any).height;

  // <img> fallback일 때만 EXIF 수동 보정
  let orientation = 1;
  if (bmpOrImg instanceof HTMLImageElement) {
    try {
      const exif = await exifr.parse(baseBlob, { tiff: true, exif: true });
      orientation = (exif?.Orientation ?? 1) as number;
    } catch {}
  }

  const swap = [5, 6, 7, 8].includes(orientation);
  const canvas = document.createElement('canvas');
  canvas.width = swap ? sh : sw;
  canvas.height = swap ? sw : sh;

  const ctx = canvas.getContext('2d', { alpha: false })!;
  ctx.save();
  applyOrientation(ctx, orientation, canvas.width, canvas.height);
  ctx.drawImage(bmpOrImg as any, 0, 0, sw, sh, 0, 0, sw, sh);
  ctx.restore();

  const mime = 'image/jpeg';
  const blob: Blob = await new Promise((r) => canvas.toBlob((b) => r(b!), mime, quality));
  const base = original.name.replace(/\.[^.]+$/, '');
  const file = new File([blob], `${base}.jpg`, { type: mime });

  return { file, blob, width: canvas.width, height: canvas.height, mime: 'image/jpeg' as const, ext: 'jpg' as const };
}

const _isHeic = (f: File) => isHeic(f);

/** HEIC만 변환, 그 외는 그대로 통과 */
export async function convertOnlyHeic(list: FileList | File[], opts?: JpegOptions): Promise<File[]> {
  const arr = Array.from(list);
  const out: File[] = [];
  for (const f of arr) {
    if (_isHeic(f)) {
      const { file } = await convertToJPEG(f, { quality: opts?.quality ?? 0.85 });
      out.push(file);
    } else {
      out.push(f);
    }
  }
  return out;
}
