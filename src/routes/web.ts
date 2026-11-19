import { Router } from "express";
import type { AppConfig } from "../config.js";
import { EDUCATION, PROFILE, PROJECTS, SKILLS, techFrequency } from "../content.js";

export function createWebRouter(config: AppConfig): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    res.render("index", {
      profile: PROFILE,
      projects: PROJECTS,
      skills: SKILLS,
      education: EDUCATION,
      tech_counts: techFrequency(),
    });
  });

  router.get("/robots.txt", (_req, res) => {
    const base = config.siteUrl;
    const body = `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${base}/sitemap.xml\n`;
    res.type("text/plain").send(body);
  });

  router.get("/sitemap.xml", (_req, res) => {
    const base = config.siteUrl;
    const body =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      `  <url><loc>${base}/</loc></url>\n` +
      "</urlset>\n";
    res.type("application/xml").send(body);
  });

  return router;
}
