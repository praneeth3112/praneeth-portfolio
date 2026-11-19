export class SlidingWindowLimiter {
  readonly limit: number;
  readonly window: number;
  private readonly clock: () => number;
  private readonly hits = new Map<string, number[]>();

  constructor(limit: number, window = 3600, clock: () => number = () => Date.now() / 1000) {
    if (limit < 1 || window <= 0) {
      throw new Error("limit must be >= 1 and window > 0");
    }
    this.limit = limit;
    this.window = window;
    this.clock = clock;
  }

  private prune(key: string, now: number): number[] {
    let entries = this.hits.get(key);
    if (!entries) {
      entries = [];
      this.hits.set(key, entries);
    }
    while (entries.length > 0 && now - entries[0] >= this.window) {
      entries.shift();
    }
    return entries;
  }

  allow(key: string): boolean {
    const now = this.clock();
    const hits = this.prune(key, now);
    if (hits.length >= this.limit) {
      return false;
    }
    hits.push(now);
    return true;
  }

  retryAfter(key: string): number {
    const now = this.clock();
    const hits = this.prune(key, now);
    if (hits.length < this.limit) {
      return 0;
    }
    return Math.max(1, Math.floor(this.window - (now - hits[0])) + 1);
  }
}
