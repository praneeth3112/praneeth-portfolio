import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import { loadConfig, type AppConfig } from "./config.js";
import { PROFILE } from "./content.js";
import { MessageStore } from "./database.js";
import { createApiRouter } from "./routes/api.js";
import { createWebRouter } from "./routes/web.js";
import { GitHubService } from "./services/github.js";
import { SlidingWindowLimiter } from "./services/ratelimit.js";

const CSP = [
  "default-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data:",
  "script-src 'self'",
  "connect-src 'self'",
  "base-uri 'none'",
  "form-action 'self'",
].join("; ");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

export function createApp(overrides: Partial<AppConfig> = {}): Express {
  const config = loadConfig(overrides);
  const app = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(ROOT_DIR, "views"));
  if (config.trustProxy) {
    app.set("trust proxy", 1);
  }

  app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", CSP);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    if (req.path.startsWith("/api/")) {
      res.setHeader("Cache-Control", "no-store");
    }
    next();
  });

  app.use(express.json());
  app.use((err: unknown, _req: Request, _res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && "status" in err && (err as { status?: number }).status === 400) {
      // Treat malformed JSON body as invalid/null payload in validators
      _req.body = null;
      next();
      return;
    }
    next(err);
  });

  app.use("/static", express.static(path.join(ROOT_DIR, "public")));

  const store = new MessageStore();
  const github = new GitHubService(
    config.githubUser,
    config.githubCacheSeconds,
    config.githubTimeoutSeconds,
  );
  const contactLimiter = new SlidingWindowLimiter(config.contactLimitPerHour, 3600);

  app.locals.config = config;
  app.locals.store = store;
  app.locals.github = github;
  app.locals.contactLimiter = contactLimiter;

  app.use("/", createWebRouter(config));
  app.use("/api", createApiRouter({ config, store, github, contactLimiter }));

  app.use((req, res) => {
    if (req.path.startsWith("/api/")) {
      res.status(404).json({
        error: "Not Found",
        message: "The requested URL was not found on the server.",
      });
      return;
    }
    res.status(404).render("404", {
      profile: { name: PROFILE.name },
      serverError: false,
    });
  });

  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error:", err);
    if (req.path.startsWith("/api/")) {
      res.status(500).json({
        error: "Internal Server Error",
        message: "Something went wrong.",
      });
      return;
    }
    res.status(500).render("404", {
      profile: { name: PROFILE.name },
      serverError: true,
    });
  });

  return app;
}
