export interface UploadConfig {
  maxFiles: number;
  maxSizeMB: number;
  allowedExt?: readonly string[];
  allowedMime?: readonly string[];
}

export type UploadError = 'TOO_MANY_FILES' | 'FILE_TOO_LARGE' | 'INVALID_TYPE';
export type ValidateResult = { ok: true; next: File[] } | { ok: false; error: UploadError };

export function validateAndMergeFiles(current: File[], incoming: File[] | FileList, cfg: UploadConfig): ValidateResult {
  const arr = Array.from(incoming);

  // 1) 용량 제한 위반 파일 수집
  const limitBytes = cfg.maxSizeMB * 1024 * 1024;
  const offenders = arr.filter((f) => f.size > limitBytes).map((f) => f.name);
  if (offenders.length > 0) {
    return {
      ok: false,
      error: 'FILE_TOO_LARGE',
    };
  }

  // 2) 개수 제한 체크 (병합 기준)
  const merged = [...(current ?? []), ...arr];
  if (merged.length > cfg.maxFiles) {
    return {
      ok: false,
      error: 'TOO_MANY_FILES',
    };
  }

  return { ok: true, next: merged };
}

// 이미지 파일 제한 버전 검증
export type RejectReason = 'INVALID_TYPE' | 'FILE_TOO_LARGE';
export interface RejectItem {
  name: string;
  reason: RejectReason;
  size?: number; // bytes
  type?: string; // mime
}
export type ValidateResultV2 = { ok: true; next: File[] } | { ok: false; error: UploadError; rejects: RejectItem[] };

function getExt(file: File) {
  return file.name.split('.').pop()?.toLowerCase();
}

function isAllowedByType(file: File, allowedExt?: readonly string[], allowedMime?: readonly string[]) {
  const ext = getExt(file);
  const byExt = !!ext && !!allowedExt && allowedExt.includes(ext);
  const byMime = !!allowedMime && allowedMime.includes(file.type as any);
  // 둘 중 하나라도 허용되면 OK (운영 정책에 따라 AND로 바꿔도 됨)
  return allowedExt || allowedMime ? byExt || byMime : true;
}

export function validateAndMergeFilesV2(
  current: File[],
  incoming: File[] | FileList,
  cfg: UploadConfig,
): ValidateResultV2 {
  const arr = Array.from(incoming);
  const limitBytes = cfg.maxSizeMB * 1024 * 1024;
  const rejects: RejectItem[] = [];
  const valids: File[] = [];

  for (const f of arr) {
    if (!isAllowedByType(f, cfg.allowedExt, cfg.allowedMime)) {
      rejects.push({ name: f.name, reason: 'INVALID_TYPE', size: f.size, type: f.type });
      continue;
    }
    if (f.size > limitBytes) {
      rejects.push({ name: f.name, reason: 'FILE_TOO_LARGE', size: f.size, type: f.type });
      continue;
    }
    valids.push(f);
  }

  // 리젝트가 하나라도 있으면 에러 반환 (최대 개수 체크 전에 즉시 반려)
  if (rejects.length > 0) {
    // 대표 에러코드: 타입 문제 우선, 아니면 용량
    const error: UploadError = rejects.some((r) => r.reason === 'INVALID_TYPE') ? 'INVALID_TYPE' : 'FILE_TOO_LARGE';
    return { ok: false, error, rejects };
  }

  // 개수 제한 체크 (병합 후)
  const merged = [...(current ?? []), ...valids];
  if (merged.length > cfg.maxFiles) {
    return { ok: false, error: 'TOO_MANY_FILES', rejects: [] };
  }

  return { ok: true, next: merged };
}

// (선택) input accept 속성 문자열 생성기
export function toAcceptAttr(allowedExt?: readonly string[], allowedMime?: readonly string[]) {
  const exts = (allowedExt ?? []).map((e) => (e.startsWith('.') ? e : `.${e}`));
  const mimes = allowedMime ?? [];
  return [...mimes, ...exts].join(',');
}
