"""All portfolio content lives here as typed Python data.

The HTML templates and the JSON API both read from these objects, so there is
a single source of truth: edit this file to add a project or skill and both the
page and ``/api/*`` update together.
"""
from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass(frozen=True)
class Link:
    label: str
    url: str


@dataclass(frozen=True)
class Project:
    slug: str
    title: str
    tech: tuple[str, ...]
    summary: tuple[str, ...]
    links: tuple[Link, ...] = field(default_factory=tuple)

    @property
    def tech_line(self) -> str:
        return ", ".join(self.tech)

    def to_dict(self) -> dict[str, Any]:
        return {
            "slug": self.slug,
            "title": self.title,
            "tech": list(self.tech),
            "summary": list(self.summary),
            "links": [asdict(link) for link in self.links],
        }


@dataclass(frozen=True)
class SkillGroup:
    name: str
    items: tuple[str, ...]

    @property
    def items_line(self) -> str:
        return ", ".join(self.items)


@dataclass(frozen=True)
class Semester:
    number: int
    sgpa: float


@dataclass(frozen=True)
class Education:
    degree: str
    university: str
    status: str
    semesters: tuple[Semester, ...]


@dataclass(frozen=True)
class QueryRequirement:
    index: str
    title: str
    detail: str


@dataclass(frozen=True)
class Profile:
    name: str
    short_name: str
    headline: str
    github_user: str
    looking_for: str
    email: str = "praneethreddy.kadavakolla@gmail.com"

    @property
    def github_url(self) -> str:
        return f"https://github.com/{self.github_user}"


PROFILE = Profile(
    name="Praneeth Reddy Kadavakolla",
    short_name="Praneeth",
    headline=(
        "I\u2019m a second-year BTech student in AI & ML at Jain University. "
        "I build with Python and JavaScript, and I\u2019m looking for an AI/ML "
        "internship where I can learn by shipping real models."
    ),
    github_user="praneeth3112",
    looking_for="AI/ML internships",
    email="praneethreddy.kadavakolla@gmail.com",
)

REPO_URL = f"{PROFILE.github_url}/python-learning"

QUERY_REQUIREMENTS: tuple[QueryRequirement, ...] = (
    QueryRequirement(
        "01.",
        "Your Name & Context",
        "Include your full name and whether you are a developer, student, collaborator, or recruiter.",
    ),
    QueryRequirement(
        "02.",
        "Project Reference",
        "Specify the project name (such as My Manga Tracker, Neon Arena, or Python Learning).",
    ),
    QueryRequirement(
        "03.",
        "Your Specific Query",
        "Describe your question, setup issue, bug reproduction steps, or feature inquiry clearly.",
    ),
    QueryRequirement(
        "04.",
        "Your Reply Email or GitHub Handle",
        "Provide your email address or @github handle so I can reply directly through Email or GitHub.",
    ),
)

PROJECTS: tuple[Project, ...] = (
    Project(
        slug="manga-tracker",
        title="My Manga Tracker",
        tech=("HTML", "CSS", "JavaScript", "AniList API", "Gemini API"),
        summary=(
            "A single-page app that loads live manga data from the AniList GraphQL "
            "API, with search, status filters and pagination.",
            "It calls the Google Gemini API to suggest new manga based on the series "
            "you have completed. You can also import a CSV, track a completed counter, "
            "and keep your progress saved in the browser.",
        ),
        links=(
            Link("Open the live app", "https://mymangatracke.netlify.app"),
            Link("View the code", f"{REPO_URL}/blob/main/animegng%20.html"),
        ),
    ),
    Project(
        slug="neon-arena",
        title="Neon Arena",
        tech=("HTML5 Canvas", "JavaScript"),
        summary=(
            "A twin-stick arena shooter that runs in the browser. Play 2-player versus "
            "on one keyboard, or take on 3 AI bots that chase, strafe and fire at the "
            "nearest player.",
            "I wrote the game logic from scratch: collision detection, bullet physics, "
            "dash and reload mechanics, particle effects and a live kill feed. It plays "
            "with keyboard, mobile touch joysticks or a gamepad.",
        ),
        links=(
            Link("Play it live", "https://neonarenapvpandbot.netlify.app"),
            Link(
                "View the code",
                f"{REPO_URL}/blob/main/pythonlearning/"
                "neon-arena-2p-keyboard-mobile-console-shooter.html",
            ),
        ),
    ),
    Project(
        slug="python-learning",
        title="Python Learning",
        tech=("Python", "Git"),
        summary=(
            "My practice repository of Python programs and exercises, kept under "
            "version control as I learn.",
        ),
        links=(Link("View the repository", REPO_URL),),
    ),
    Project(
        slug="portfolio-backend",
        title="This Portfolio (Flask)",
        tech=("Python", "Flask", "SQLite", "Jinja2"),
        summary=(
            "The site you are looking at is a Flask application. Content is typed "
            "Python data served as HTML and JSON, the contact form is validated and "
            "rate-limited on the server and stored in SQLite, and my GitHub repos "
            "are fetched and cached by a small service layer.",
        ),
        links=(Link("View the code", REPO_URL),),
    ),
)

SKILLS: tuple[SkillGroup, ...] = (
    SkillGroup("Languages", ("Python", "C", "JavaScript", "TypeScript")),
    SkillGroup("AI and data", ("NumPy", "SQL", "Google Gemini API")),
    SkillGroup("Web", ("HTML", "CSS", "React", "Flask")),
    SkillGroup("Tools", ("Git", "Linux", "VS Code")),
)

EDUCATION = Education(
    degree="B.Tech in Computer Science & Engineering (AI & ML)",
    university="Jain University",
    status="currently in the second year",
    semesters=(Semester(1, 7.65), Semester(2, 6.435)),
)


def find_project(slug: str) -> Project | None:
    """Return the project with this slug, or ``None``."""
    return next((p for p in PROJECTS if p.slug == slug), None)


def tech_frequency() -> dict[str, int]:
    """How many projects use each technology, most-used first."""
    counts: dict[str, int] = {}
    for project in PROJECTS:
        for tech in project.tech:
            counts[tech] = counts.get(tech, 0) + 1
    return dict(sorted(counts.items(), key=lambda kv: (-kv[1], kv[0].lower())))


def skills_as_dict() -> dict[str, list[str]]:
    return {group.name: list(group.items) for group in SKILLS}


def profile_as_dict() -> dict[str, Any]:
    data = asdict(PROFILE)
    data["github_url"] = PROFILE.github_url
    data["education"] = {
        "degree": EDUCATION.degree,
        "university": EDUCATION.university,
        "status": EDUCATION.status,
        "semesters": [asdict(s) for s in EDUCATION.semesters],
    }
    return data
