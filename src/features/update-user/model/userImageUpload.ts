export interface UploadConfig {
  maxFiles: number;
  maxSizeMB: number;
}

export type UploadError = 'TOO_MANY_FILES' | 'FILE_TOO_LARGE';
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
