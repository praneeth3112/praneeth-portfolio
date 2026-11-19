export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  tech: string[];
  tech_line: string;
  summary: string[];
  links: ProjectLink[];
}

export interface SkillGroup {
  name: string;
  items: string[];
  items_line: string;
}

export interface Semester {
  number: number;
  sgpa: number;
}

export interface Education {
  degree: string;
  university: string;
  status: string;
  semesters: Semester[];
}

export interface Profile {
  name: string;
  short_name: string;
  headline: string;
  github_user: string;
  github_url: string;
  looking_for: string;
}

const GITHUB_USER = "praneeth3112";
const GITHUB_URL = `https://github.com/${GITHUB_USER}`;
const REPO_URL = `${GITHUB_URL}/python-learning`;

export const PROFILE: Profile = {
  name: "Praneeth Reddy Kadavakolla",
  short_name: "Praneeth",
  headline:
    "I\u2019m a second-year BTech student in AI & ML at Jain University. " +
    "I build with Python and JavaScript, and I\u2019m looking for an AI/ML " +
    "internship where I can learn by shipping real models.",
  github_user: GITHUB_USER,
  github_url: GITHUB_URL,
  looking_for: "AI/ML internships",
};

function makeProject(
  slug: string,
  title: string,
  tech: string[],
  summary: string[],
  links: ProjectLink[] = [],
): Project {
  return {
    slug,
    title,
    tech,
    tech_line: tech.join(", "),
    summary,
    links,
  };
}

export const PROJECTS: Project[] = [
  makeProject(
    "manga-tracker",
    "My Manga Tracker",
    ["HTML", "CSS", "JavaScript", "AniList API", "Gemini API"],
    [
      "A single-page app that loads live manga data from the AniList GraphQL " +
        "API, with search, status filters and pagination.",
      "It calls the Google Gemini API to suggest new manga based on the series " +
        "you have completed. You can also import a CSV, track a completed counter, " +
        "and keep your progress saved in the browser.",
    ],
    [
      { label: "Open the live app", url: "https://mymangatracke.netlify.app" },
      { label: "View the code", url: `${REPO_URL}/blob/main/animegng%20.html` },
    ],
  ),
  makeProject(
    "neon-arena",
    "Neon Arena",
    ["HTML5 Canvas", "JavaScript"],
    [
      "A twin-stick arena shooter that runs in the browser. Play 2-player versus " +
        "on one keyboard, or take on 3 AI bots that chase, strafe and fire at the " +
        "nearest player.",
      "I wrote the game logic from scratch: collision detection, bullet physics, " +
        "dash and reload mechanics, particle effects and a live kill feed. It plays " +
        "with keyboard, mobile touch joysticks or a gamepad.",
    ],
    [
      { label: "Play it live", url: "https://neonarenapvpandbot.netlify.app" },
      {
        label: "View the code",
        url:
          `${REPO_URL}/blob/main/pythonlearning/` +
          "neon-arena-2p-keyboard-mobile-console-shooter.html",
      },
    ],
  ),
  makeProject(
    "python-learning",
    "Python Learning",
    ["Python", "Git"],
    [
      "My practice repository of Python programs and exercises, kept under " +
        "version control as I learn.",
    ],
    [{ label: "View the repository", url: REPO_URL }],
  ),
  makeProject(
    "portfolio-backend",
    "This Portfolio (Node.js / Express)",
    ["TypeScript", "Node.js", "Express", "EJS"],
    [
      "The site you are looking at is an Express and TypeScript application. Content is typed " +
        "data served as HTML and JSON, the contact form is validated and " +
        "rate-limited on the server, and my GitHub repos " +
        "are fetched and cached by a small service layer.",
    ],
    [{ label: "View the code", url: REPO_URL }],
  ),
];

function makeSkillGroup(name: string, items: string[]): SkillGroup {
  return {
    name,
    items,
    items_line: items.join(", "),
  };
}

export const SKILLS: SkillGroup[] = [
  makeSkillGroup("Languages", ["Python", "C", "JavaScript", "TypeScript"]),
  makeSkillGroup("AI and data", ["NumPy", "SQL", "Google Gemini API"]),
  makeSkillGroup("Web", ["HTML", "CSS", "React", "Flask"]),
  makeSkillGroup("Tools", ["Git", "Linux", "VS Code"]),
];

export const EDUCATION: Education = {
  degree: "B.Tech in Computer Science & Engineering (AI & ML)",
  university: "Jain University",
  status: "currently in the second year",
  semesters: [
    { number: 1, sgpa: 7.65 },
    { number: 2, sgpa: 6.435 },
  ],
};

export function findProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function projectToDto(project: Project) {
  return {
    slug: project.slug,
    title: project.title,
    tech: [...project.tech],
    summary: [...project.summary],
    links: project.links.map((link) => ({ ...link })),
  };
}

export function techFrequency(): Record<string, number> {
  const counts = new Map<string, number>();
  for (const project of PROJECTS) {
    for (const tech of project.tech) {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
  }
  const sorted = Array.from(counts.entries()).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].toLowerCase().localeCompare(b[0].toLowerCase());
  });
  return Object.fromEntries(sorted);
}

export function skillsAsDict(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const group of SKILLS) {
    result[group.name] = [...group.items];
  }
  return result;
}

export function profileAsDict() {
  return {
    name: PROFILE.name,
    short_name: PROFILE.short_name,
    headline: PROFILE.headline,
    github_user: PROFILE.github_user,
    looking_for: PROFILE.looking_for,
    github_url: PROFILE.github_url,
    education: {
      degree: EDUCATION.degree,
      university: EDUCATION.university,
      status: EDUCATION.status,
      semesters: EDUCATION.semesters.map((s) => ({ ...s })),
    },
  };
}
