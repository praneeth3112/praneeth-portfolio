export type ProjectCategory = 'All' | 'AI & Web' | 'Games' | 'Python';

export interface ProjectItem {
  slug: string;
  title: string;
  category: Exclude<ProjectCategory, 'All'>;
  tech: string;
  summary: string[];
  liveLabel: string;
  liveUrl: string;
  codeUrl?: string;
}

export interface SkillGroupItem {
  title: string;
  items: string;
}

export interface SemesterItem {
  semester: string;
  sgpa: string;
}

export interface QueryRequirementItem {
  index: string;
  title: string;
  detail: string;
}

export const PROFILE = {
  name: 'Praneeth Reddy Kadavakolla',
  shortName: 'Praneeth',
  email: 'praneethreddy.kadavakolla@gmail.com',
  githubUsername: 'praneeth3112',
  githubUrl: 'https://github.com/praneeth3112',
  repoUrl: 'https://github.com/praneeth3112/python-learning',
  headline:
    'I’m a second-year B.Tech student in AI & ML at Jain University. I build with Python and JavaScript, and I’m looking for an AI/ML internship where I can learn by shipping real models.',
};

export const PROJECT_CATEGORIES: ProjectCategory[] = ['All', 'AI & Web', 'Games', 'Python'];

export const PROJECTS: ProjectItem[] = [
  {
    slug: 'my-manga-tracker',
    title: 'My Manga Tracker',
    category: 'AI & Web',
    tech: 'HTML · CSS · JavaScript · AniList API · Gemini API',
    summary: [
      'A single-page app loading live manga data from the AniList GraphQL API with search, status filters, and pagination.',
      'Calls the Google Gemini API to recommend new series from completed lists, with CSV import and browser persistence.',
    ],
    liveLabel: 'Open live app',
    liveUrl: 'https://mymangatracke.netlify.app',
    codeUrl: 'https://github.com/praneeth3112/python-learning/blob/main/animegng%20.html',
  },
  {
    slug: 'neon-arena',
    title: 'Neon Arena',
    category: 'Games',
    tech: 'HTML5 Canvas · JavaScript',
    summary: [
      'A twin-stick arena shooter in the browser supporting 2-player local versus or 3 AI bots that chase, strafe, and fire.',
      'Built collision detection, bullet physics, dash and reload mechanics, particle effects, and keyboard, touch, or gamepad input.',
    ],
    liveLabel: 'Play it live',
    liveUrl: 'https://neonarenapvpandbot.netlify.app',
    codeUrl:
      'https://github.com/praneeth3112/python-learning/blob/main/pythonlearning/neon-arena-2p-keyboard-mobile-console-shooter.html',
  },
  {
    slug: 'python-learning',
    title: 'Python Learning',
    category: 'Python',
    tech: 'Python · Flask · Git',
    summary: [
      'Practice repository of Python programs, algorithms, and exercises maintained under version control.',
    ],
    liveLabel: 'View repository',
    liveUrl: 'https://github.com/praneeth3112/python-learning',
  },
];

export const SKILLS: SkillGroupItem[] = [
  { title: 'Languages', items: 'Python, C, JavaScript, TypeScript' },
  { title: 'AI and data', items: 'NumPy, SQL, Google Gemini API' },
  { title: 'Web', items: 'HTML, CSS, React, Flask' },
  { title: 'Tools', items: 'Git, Linux, VS Code' },
];

export const EDUCATION = {
  degree: 'B.Tech in Computer Science & Engineering (AI & ML)',
  institution: 'Jain University, currently in the second year',
  semesters: [
    { semester: 'Semester 1', sgpa: '7.65' },
    { semester: 'Semester 2', sgpa: '6.435' },
  ] as SemesterItem[],
};

export const QUERY_DETAILS_CHECKLIST: QueryRequirementItem[] = [
  {
    index: '01.',
    title: 'Your Name & Context',
    detail: 'Include your full name and whether you are a developer, student, collaborator, or recruiter.',
  },
  {
    index: '02.',
    title: 'Project Reference',
    detail: 'Specify the project name (such as My Manga Tracker, Neon Arena, or Python Learning).',
  },
  {
    index: '03.',
    title: 'Your Specific Query',
    detail: 'Describe your question, setup issue, bug reproduction steps, or feature inquiry clearly.',
  },
  {
    index: '04.',
    title: 'Your Reply Email or GitHub Handle',
    detail: 'Provide your email address or @github handle so I can reply directly through Email or GitHub.',
  },
];
