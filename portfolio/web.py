"""HTML routes: the portfolio page, robots.txt and sitemap.xml."""
from __future__ import annotations

from flask import Blueprint, Response, current_app, render_template

from . import content

bp = Blueprint("web", __name__)


@bp.get("/")
def index():
    return render_template(
        "index.html",
        profile=content.PROFILE,
        repo_url=content.REPO_URL,
        projects=content.PROJECTS,
        skills=content.SKILLS,
        education=content.EDUCATION,
        tech_counts=content.tech_frequency(),
        query_requirements=content.QUERY_REQUIREMENTS,
    )


@bp.get("/robots.txt")
def robots() -> Response:
    base = current_app.config["SITE_URL"]
    body = f"User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: {base}/sitemap.xml\n"
    return Response(body, mimetype="text/plain")


@bp.get("/sitemap.xml")
def sitemap() -> Response:
    base = current_app.config["SITE_URL"]
    body = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"  <url><loc>{base}/</loc></url>\n"
        "</urlset>\n"
    )
    return Response(body, mimetype="application/xml")
