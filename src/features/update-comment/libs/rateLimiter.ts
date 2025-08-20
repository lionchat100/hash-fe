const SHORT_MS = 3_000; // 3초에 1개
const LONG_MS = 60_000; // 1분에 5개
const LONG_LIMIT = 5;

export const rateLimiter = (() => {
  const map = new Map<number, number[]>(); // feedId -> timestamps(ms)

  const prune = (feedId: number, now: number) => {
    const arr = map.get(feedId) ?? [];
    const pruned = arr.filter((t) => now - t <= LONG_MS);
    map.set(feedId, pruned);
    return pruned;
  };

  return {
    canSend(feedId: number, now = Date.now()): boolean {
      const arr = prune(feedId, now);
      const last = arr[arr.length - 1];
      if (last && now - last < SHORT_MS) return false; // 3초 제한
      if (arr.length >= LONG_LIMIT) return false; // 1분 5개 제한
      return true;
    },
    record(feedId: number, at = Date.now()) {
      const arr = map.get(feedId) ?? [];
      arr.push(at);
      map.set(feedId, arr);
    },
  };
})();
