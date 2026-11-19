import { useState } from 'react';
import { ParticleCanvas } from './components/ParticleCanvas';
import { ProjectQueriesSection } from './components/ProjectQueriesSection';
import {
  EDUCATION,
  PROFILE,
  PROJECT_CATEGORIES,
  PROJECTS,
  SKILLS,
  type ProjectCategory,
} from './data/portfolioData';

export default function App() {
  const [category, setCategory] = useState<ProjectCategory>('All');
  const [queryProject, setQueryProject] = useState<string>(PROJECTS[0].title);

  const visibleProjects =
    category === 'All' ? PROJECTS : PROJECTS.filter((project) => project.category === category);

  const handleAskAboutProject = (projectTitle: string) => {
    setQueryProject(projectTitle);
    const target = document.getElementById('project-queries');
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f2efe9] selection:bg-[#ffb347] selection:text-black">
      <header className="sticky top-0 z-20 border-b border-[#26241f] bg-[#050505]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-8 px-6">
          <a
            href="#top"
            className="font-display text-lg font-extrabold tracking-tight whitespace-nowrap shrink-0"
          >
            {PROFILE.shortName}
          </a>

          <nav
            aria-label="Main"
            className="hidden sm:flex items-center gap-6 text-sm text-[#9a968e]"
          >
            <a
              href="#projects"
              className="hover:text-[#f2efe9] transition-colors whitespace-nowrap shrink-0"
            >
              Projects
            </a>
            <a
              href="#skills"
              className="hover:text-[#f2efe9] transition-colors whitespace-nowrap shrink-0"
            >
              Skills
            </a>
            <a
              href="#education"
              className="hover:text-[#f2efe9] transition-colors whitespace-nowrap shrink-0"
            >
              Education
            </a>
            <a
              href="#contact"
              className="hover:text-[#f2efe9] transition-colors whitespace-nowrap shrink-0"
            >
              Contact
            </a>
            <a
              href="#project-queries"
              className="hover:text-[#f2efe9] transition-colors whitespace-nowrap shrink-0"
            >
              Queries
            </a>
          </nav>

          <a
            href={PROFILE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#ffb347] px-4 py-2 text-xs font-semibold text-black hover:bg-[#f2efe9] transition-colors whitespace-nowrap shrink-0"
          >
            GitHub
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative overflow-hidden border-b border-[#26241f]">
          <ParticleCanvas />
          <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
            <h1 className="font-display max-w-3xl text-balance text-5xl font-extrabold leading-[0.96] tracking-tight sm:text-7xl">
              {PROFILE.name}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[#cfcac0] sm:text-xl">
              {PROFILE.headline}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="rounded-full bg-[#ffb347] px-6 py-3 text-sm font-semibold text-black hover:bg-[#f2efe9] transition-colors whitespace-nowrap shrink-0"
              >
                See my projects
              </a>
              <a
                href={PROFILE.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#f2efe9]/60 px-6 py-3 text-sm font-semibold text-[#f2efe9] hover:bg-[#f2efe9] hover:text-black transition-colors whitespace-nowrap shrink-0"
              >
                View Python repo
              </a>
            </div>
          </div>
        </section>

        <section id="projects" className="border-b border-[#26241f] py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Projects
              </h2>
              <div className="flex flex-wrap gap-1 rounded-lg border border-[#26241f] bg-[#0e0d0b] p-1">
                {PROJECT_CATEGORIES.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setCategory(tab)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      category === tab
                        ? 'bg-[#ffb347] text-black'
                        : 'text-[#9a968e] hover:text-[#f2efe9]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-[#26241f]">
              {visibleProjects.map((project) => (
                <article
                  key={project.slug}
                  className="grid gap-4 py-8 first:pt-0 last:pb-0 md:grid-cols-[1fr_1.6fr] md:gap-12"
                >
                  <div>
                    <h3 className="font-display text-2xl font-semibold">{project.title}</h3>
                    <p className="mt-1.5 text-sm text-[#ffb347]">{project.tech}</p>
                  </div>
                  <div>
                    {project.summary.map((paragraph) => (
                      <p key={paragraph} className="mb-3 max-w-2xl leading-relaxed text-[#cfcac0]">
                        {paragraph}
                      </p>
                    ))}
                    <div className="mt-4 flex flex-wrap items-center gap-6 text-sm font-semibold">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-[#ffb347] underline-offset-4 hover:text-[#ffb347]"
                      >
                        {project.liveLabel}
                      </a>
                      {project.codeUrl && (
                        <a
                          href={project.codeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-[#ffb347] underline-offset-4 hover:text-[#ffb347]"
                        >
                          View the code
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleAskAboutProject(project.title)}
                        className="text-[#9a968e] underline decoration-[#26241f] underline-offset-4 hover:text-[#ffb347] hover:decoration-[#ffb347] transition-colors cursor-pointer"
                      >
                        Ask a query
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="border-b border-[#26241f] py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-display mb-10 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Skills
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {SKILLS.map((group) => (
                <div key={group.title}>
                  <h3 className="font-display text-lg font-semibold text-[#ffb347]">
                    {group.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#cfcac0]">{group.items}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="border-b border-[#26241f] py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-display mb-10 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Education
            </h2>
            <div className="flex flex-wrap items-start justify-between gap-8">
              <div>
                <h3 className="font-display text-2xl font-semibold">{EDUCATION.degree}</h3>
                <p className="mt-1 text-[#9a968e]">{EDUCATION.institution}</p>
              </div>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm tabular-nums">
                {EDUCATION.semesters.map((item) => (
                  <div key={item.semester} className="contents">
                    <dt className="text-[#9a968e]">{item.semester}</dt>
                    <dd className="font-semibold text-right">{item.sgpa}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="contact" className="border-b border-[#26241f] py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-display mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Contact
            </h2>
            <p className="mb-8 max-w-xl leading-relaxed text-[#cfcac0]">
              I’m open to AI/ML internships. You can reach me directly via email at{' '}
              <a
                href={`mailto:${PROFILE.email}`}
                className="font-semibold text-[#f2efe9] underline decoration-[#ffb347] underline-offset-4 hover:text-[#ffb347]"
              >
                {PROFILE.email}
              </a>{' '}
              or explore my work on GitHub.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${PROFILE.email}`}
                className="inline-block rounded-full bg-[#ffb347] px-6 py-3 text-sm font-semibold text-black hover:bg-[#f2efe9] transition-colors whitespace-nowrap shrink-0"
              >
                Email me
              </a>
              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full border border-[#f2efe9]/60 px-6 py-3 text-sm font-semibold text-[#f2efe9] hover:bg-[#f2efe9] hover:text-black transition-colors whitespace-nowrap shrink-0"
              >
                Message me on GitHub
              </a>
            </div>
          </div>
        </section>

        <ProjectQueriesSection
          selectedProject={queryProject}
          onSelectProject={setQueryProject}
        />
      </main>

      <footer className="py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 text-sm text-[#9a968e]">
          <span>{PROFILE.name}</span>
          <div className="flex items-center gap-6">
            <a
              href={`mailto:${PROFILE.email}`}
              className="hover:text-[#f2efe9] transition-colors"
            >
              {PROFILE.email}
            </a>
            <a
              href={PROFILE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#f2efe9] transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
