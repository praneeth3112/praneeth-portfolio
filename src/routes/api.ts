import crypto from "node:crypto";
import { Router, type Request } from "express";
import type { AppConfig } from "../config.js";
import {
  PROJECTS,
  findProject,
  profileAsDict,
  projectToDto,
  skillsAsDict,
  techFrequency,
} from "../content.js";
import type { MessageStore } from "../database.js";
import type { GitHubService } from "../services/github.js";
import type { SlidingWindowLimiter } from "../services/ratelimit.js";
import { ValidationError, validateContact } from "../validators.js";

export interface ApiDeps {
  config: AppConfig;
  store: MessageStore;
  github: GitHubService;
  contactLimiter: SlidingWindowLimiter;
}

function clientHash(req: Request, secret: string): string {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  return crypto.createHash("sha256").update(`${secret}:${ip}`).digest("hex").slice(0, 32);
}

export function createApiRouter(deps: ApiDeps): Router {
  const router = Router();
  const { config, store, github, contactLimiter } = deps;

  router.get("/health", (_req, res) => {
    res.json({ status: "ok", messages: store.countMessages() });
  });

  router.get("/profile", (_req, res) => {
    res.json(profileAsDict());
  });

  router.get("/projects", (req, res) => {
    const tech = typeof req.query.tech === "string" ? req.query.tech.trim().toLowerCase() : "";
    const items = PROJECTS.filter(
      (p) => !tech || p.tech.some((t) => t.toLowerCase() === tech),
    );
    res.json({
      count: items.length,
      projects: items.map(projectToDto),
    });
  });

  router.get("/projects/:slug", (req, res) => {
    const slug = req.params.slug;
    const project = findProject(slug);
    if (!project) {
      res.status(404).json({
        error: "Not Found",
        message: `No project called '${slug}'.`,
      });
      return;
    }
    res.json(projectToDto(project));
  });

  router.get("/skills", (_req, res) => {
    res.json({
      skills: skillsAsDict(),
      used_in_projects: techFrequency(),
    });
  });

  router.get("/github", async (_req, res) => {
    const payload = await github.repos();
    res.json(payload);
  });

  router.post("/contact", (req, res) => {
    const client = clientHash(req, config.secretKey);
    if (!contactLimiter.allow(client)) {
      res
        .status(429)
        .set("Retry-After", String(contactLimiter.retryAfter(client)))
        .json({
          error: "Too Many Requests",
          message: "You have sent a few messages already. Try again later.",
        });
      return;
    }

    const isJson = req.is("application/json");
    const payload = isJson ? req.body : null;

    try {
      const data = validateContact(payload);
      const messageId = store.saveMessage(data.name, data.email, data.message, client);
      res.status(201).json({
        ok: true,
        id: messageId,
        message: "Thanks, your message was received.",
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(422).json({
          error: "Validation Failed",
          fields: error.errors,
        });
        return;
      }
      throw error;
    }
  });

  router.get("/messages", (req, res) => {
    const token = config.adminToken;
    if (!token) {
      res.status(404).json({
        error: "Not Found",
        message: "The requested URL was not found on the server.",
      });
      return;
    }

    const supplied = req.get("X-Admin-Token") ?? "";
    const tokenBuf = Buffer.from(token, "utf8");
    const suppliedBuf = Buffer.from(supplied, "utf8");
    const matches =
      tokenBuf.length === suppliedBuf.length &&
      crypto.timingSafeEqual(tokenBuf, suppliedBuf);

    if (!matches) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Missing or invalid admin token.",
      });
      return;
    }

    const rawLimit = typeof req.query.limit === "string" ? Number.parseInt(req.query.limit, 10) : 50;
    const limit = Number.isFinite(rawLimit) ? rawLimit : 50;
    res.json({ messages: store.listMessages(limit) });
  });

  return router;
}
