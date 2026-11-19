export interface AppConfig {
  secretKey: string;
  githubUser: string;
  githubCacheSeconds: number;
  githubTimeoutSeconds: number;
  adminToken: string;
  contactLimitPerHour: number;
  trustProxy: boolean;
  siteUrl: string;
  port: number;
}

export function loadConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  const port = Number.parseInt(process.env.PORT ?? "3000", 10);
  const cacheSeconds = Number.parseInt(process.env.GITHUB_CACHE_SECONDS ?? "600", 10);
  const timeoutSeconds = Number.parseFloat(process.env.GITHUB_TIMEOUT_SECONDS ?? "4");
  const contactLimit = Number.parseInt(process.env.CONTACT_LIMIT_PER_HOUR ?? "5", 10);

  return {
    secretKey: process.env.SECRET_KEY ?? "dev-only-change-me",
    githubUser: process.env.GITHUB_USER ?? "praneeth3112",
    githubCacheSeconds: Number.isFinite(cacheSeconds) ? cacheSeconds : 600,
    githubTimeoutSeconds: Number.isFinite(timeoutSeconds) ? timeoutSeconds : 4,
    adminToken: process.env.ADMIN_TOKEN ?? "",
    contactLimitPerHour: Number.isFinite(contactLimit) && contactLimit >= 1 ? contactLimit : 5,
    trustProxy: process.env.TRUST_PROXY === "1",
    siteUrl: (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, ""),
    port: Number.isFinite(port) ? port : 3000,
    ...overrides,
  };
}
