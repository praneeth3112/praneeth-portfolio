const API_ROOT = "https://api.github.com";

export interface RawGitHubRepo {
  name?: string;
  description?: string | null;
  language?: string | null;
  stargazers_count?: number;
  html_url?: string;
  pushed_at?: string | null;
  updated_at?: string | null;
  fork?: boolean;
}

export interface RepoSummary {
  name: string;
  description: string;
  language: string | null;
  stars: number;
  url: string;
  updated: string;
}

export interface GitHubPayload {
  repos: RepoSummary[];
  languages: Record<string, number>;
  source: "live" | "cache" | "stale" | "unavailable";
}

export type Fetcher = (url: string, timeoutSeconds: number) => Promise<RawGitHubRepo[]>;

export async function defaultFetcher(url: string, timeoutSeconds: number): Promise<RawGitHubRepo[]> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "portfolio-node-app",
    },
    signal: AbortSignal.timeout(Math.max(100, timeoutSeconds * 1000)),
  });
  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}`);
  }
  const data = (await response.json()) as unknown;
  if (!Array.isArray(data)) {
    throw new Error("Unexpected GitHub API payload");
  }
  return data as RawGitHubRepo[];
}

export function summariseRepo(raw: RawGitHubRepo): RepoSummary {
  const dateStr = raw.pushed_at || raw.updated_at || "";
  return {
    name: raw.name ?? "",
    description: raw.description || "",
    language: raw.language ?? null,
    stars: Number(raw.stargazers_count ?? 0),
    url: raw.html_url ?? "",
    updated: dateStr.slice(0, 10),
  };
}

export function languageBreakdown(repos: Array<{ language: string | null }>): Record<string, number> {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (repo.language) {
      counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
    }
  }
  const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  return Object.fromEntries(sorted);
}

export class GitHubService {
  readonly username: string;
  readonly ttl: number;
  readonly timeout: number;
  private readonly fetcher: Fetcher;
  private readonly clock: () => number;
  private cached: RepoSummary[] | null = null;
  private cachedAt = 0;

  constructor(
    username: string,
    ttl = 600,
    timeout = 4,
    fetcher: Fetcher = defaultFetcher,
    clock: () => number = () => Date.now() / 1000,
  ) {
    this.username = username;
    this.ttl = ttl;
    this.timeout = timeout;
    this.fetcher = fetcher;
    this.clock = clock;
  }

  private isFresh(): boolean {
    return this.cached !== null && this.clock() - this.cachedAt < this.ttl;
  }

  async repos(): Promise<GitHubPayload> {
    if (this.isFresh()) {
      return this.payload(this.cached ?? [], "cache");
    }

    const url = `${API_ROOT}/users/${encodeURIComponent(this.username)}/repos?per_page=100&sort=pushed`;
    try {
      const raw = await this.fetcher(url, this.timeout);
      const repos = raw
        .filter((r) => !r.fork)
        .map(summariseRepo)
        .sort((a, b) => b.updated.localeCompare(a.updated));
      this.cached = repos;
      this.cachedAt = this.clock();
      return this.payload(repos, "live");
    } catch {
      if (this.cached !== null) {
        return this.payload(this.cached, "stale");
      }
      return this.payload([], "unavailable");
    }
  }

  private payload(repos: RepoSummary[], source: GitHubPayload["source"]): GitHubPayload {
    return {
      repos,
      languages: languageBreakdown(repos),
      source,
    };
  }
}
