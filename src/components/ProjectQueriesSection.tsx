import { useEffect, useState } from 'react';
import { Check, Copy, ExternalLink, Mail } from 'lucide-react';
import { PROFILE, PROJECTS, QUERY_DETAILS_CHECKLIST } from '../data/portfolioData';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

interface ProjectQueriesSectionProps {
  selectedProject: string;
  onSelectProject: (projectTitle: string) => void;
}

const PROJECT_OPTIONS = [...PROJECTS.map((p) => p.title), 'General / Other Project'];

export function ProjectQueriesSection({
  selectedProject,
  onSelectProject,
}: ProjectQueriesSectionProps) {
  const [visitorName, setVisitorName] = useState('');
  const [visitorReplyChannel, setVisitorReplyChannel] = useState('');
  const [visitorRole, setVisitorRole] = useState('');
  const [queryText, setQueryText] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    if (!copiedEmail) return;
    const timer = window.setTimeout(() => setCopiedEmail(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copiedEmail]);

  useEffect(() => {
    if (!copiedDraft) return;
    const timer = window.setTimeout(() => setCopiedDraft(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copiedDraft]);

  const activeProject = PROJECT_OPTIONS.includes(selectedProject)
    ? selectedProject
    : PROJECT_OPTIONS[0];

  const buildFormattedQuery = () => {
    const nameLine = visitorName.trim() || 'Not provided';
    const roleLine = visitorRole.trim() || 'Not specified';
    const replyLine = visitorReplyChannel.trim() || 'Not provided';
    const questionLine = queryText.trim() || '[Write your project question here]';

    return [
      `Project: ${activeProject}`,
      `From: ${nameLine}`,
      `Role / Context: ${roleLine}`,
      `Reply Email or GitHub Handle: ${replyLine}`,
      '',
      'Query Details:',
      questionLine,
    ].join('\n');
  };

  const buildMailtoHref = (useDraft: boolean) => {
    const subject = encodeURIComponent(`Project Query: ${activeProject}`);
    const body = encodeURIComponent(
      useDraft
        ? buildFormattedQuery()
        : `Hi Praneeth,\n\nI have a query about your project (${activeProject}):\n\n- Name:\n- My Email or GitHub handle:\n- Question:\n`
    );
    return `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  };

  const buildGithubIssueHref = (useDraft: boolean) => {
    const title = encodeURIComponent(`[Query] ${activeProject}: ${visitorName.trim() || 'Project Question'}`);
    const body = encodeURIComponent(
      useDraft
        ? buildFormattedQuery()
        : `### Project\n${activeProject}\n\n### Your Details\n- Name:\n- GitHub handle / Email:\n\n### Query\n`
    );
    return `${PROFILE.repoUrl}/issues/new?title=${title}&body=${body}`;
  };

  const validateDraft = (): boolean => {
    if (visitorName.trim().length < 2) {
      setFeedback({
        kind: 'error',
        text: 'Enter your name (at least 2 characters) before launching a pre-filled query.',
      });
      return false;
    }
    if (visitorReplyChannel.trim().length < 3) {
      setFeedback({
        kind: 'error',
        text: 'Enter your email address or GitHub handle so Praneeth can reply to you.',
      });
      return false;
    }
    if (queryText.trim().length < 10) {
      setFeedback({
        kind: 'error',
        text: 'Describe your project query in at least 10 characters.',
      });
      return false;
    }
    setFeedback(null);
    return true;
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopiedEmail(true);
    } catch {
      setFeedback({
        kind: 'info',
        text: `Copy manually: ${PROFILE.email}`,
      });
    }
  };

  const handleLaunchEmail = () => {
    if (!validateDraft()) return;
    setFeedback({
      kind: 'info',
      text: `Opening your email client addressed to ${PROFILE.email}.`,
    });
    window.location.href = buildMailtoHref(true);
  };

  const handleLaunchGithub = () => {
    if (!validateDraft()) return;
    setFeedback({
      kind: 'info',
      text: 'Opening a pre-filled GitHub issue template in a new tab.',
    });
    const anchor = document.createElement('a');
    anchor.href = buildGithubIssueHref(true);
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.click();
  };

  const handleCopyFormattedDraft = async () => {
    if (!validateDraft()) return;
    try {
      await navigator.clipboard.writeText(buildFormattedQuery());
      setCopiedDraft(true);
      setFeedback({
        kind: 'info',
        text: `Formatted query copied. Paste it into an email to ${PROFILE.email} or a GitHub issue.`,
      });
    } catch {
      setFeedback({
        kind: 'error',
        text: 'Clipboard access was blocked by the browser. Use Send via Email or Ask on GitHub directly.',
      });
    }
  };

  return (
    <section id="project-queries" className="border-b border-[#26241f] py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            Project Queries
          </h2>
          <p className="mt-4 leading-relaxed text-[#cfcac0]">
            Have a question about how one of my projects works, want to report an issue, or need
            clarification on the code? Queries about my projects are accepted{' '}
            <span className="font-semibold text-[#f2efe9]">only through Email or GitHub</span>.
          </p>
        </div>

        {/* Direct Allowed Channels: Email & GitHub */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-xl border border-[#26241f] bg-[#0b0a09] p-6">
            <div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-[#ffb347]">
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Channel 01 · Email Only</span>
              </div>
              <h3 className="font-display mt-3 text-xl font-semibold text-[#f2efe9]">
                {PROFILE.email}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#9a968e]">
                Use email for architecture questions, project walkthroughs, dataset/API setup help,
                or private collaboration queries.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={buildMailtoHref(false)}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[#ffb347] px-5 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#f2efe9] whitespace-nowrap shrink-0"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Email Query</span>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#26241f] px-4 py-2 text-xs font-semibold text-[#f2efe9] transition-colors hover:border-[#f2efe9] whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#ffb347]" aria-hidden="true" />
                    <span>Email Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-[#26241f] bg-[#0b0a09] p-6">
            <div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-[#ffb347]">
                <GitHubIcon className="h-4 w-4 shrink-0" />
                <span>Channel 02 · GitHub Only</span>
              </div>
              <h3 className="font-display mt-3 text-xl font-semibold text-[#f2efe9]">
                github.com/{PROFILE.githubUsername}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#9a968e]">
                Use GitHub Issues on the project repository for code-specific questions, bug
                reports, or implementation discussions.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={buildGithubIssueHref(false)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[#ffb347] px-5 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#f2efe9] whitespace-nowrap shrink-0"
              >
                <GitHubIcon className="h-3.5 w-3.5" />
                <span>Open GitHub Issue</span>
              </a>
              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#26241f] px-4 py-2 text-xs font-semibold text-[#f2efe9] transition-colors hover:border-[#f2efe9] whitespace-nowrap shrink-0"
              >
                <span>GitHub Profile</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* User Details Guide + Interactive Email/GitHub Draft Composer */}
        <div className="mt-12 grid gap-10 border-t border-[#26241f] pt-10 lg:grid-cols-[1fr_1.35fr] lg:gap-12">
          <div>
            <h3 className="font-display text-xl font-semibold text-[#f2efe9]">
              Details to Include in Your Query
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#9a968e]">
              To get a clear, fast response via Email or GitHub, include these user and project
              details when reaching out:
            </p>

            <ol className="mt-6 space-y-5">
              {QUERY_DETAILS_CHECKLIST.map((item) => (
                <li key={item.index} className="border-b border-[#26241f]/70 pb-4 last:border-b-0 last:pb-0">
                  <div className="text-sm font-semibold text-[#f2efe9]">
                    <span className="mr-2 font-mono text-[#ffb347]">{item.index}</span>
                    {item.title}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-[#9a968e]">{item.detail}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-[#26241f] bg-[#0b0a09] p-6">
            <h3 className="font-display text-xl font-semibold text-[#f2efe9]">
              Prepare Your Query for Email or GitHub
            </h3>
            <p className="mt-1.5 text-sm text-[#9a968e]">
              Fill in your details below to open a pre-formatted email to{' '}
              <span className="text-[#f2efe9]">{PROFILE.email}</span> or a GitHub issue on{' '}
              <span className="text-[#f2efe9]">{PROFILE.githubUsername}/python-learning</span>.
            </p>

            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-medium text-[#9a968e]">
                  <span>Your Name</span>
                  <input
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="e.g., Aarav Sharma"
                    maxLength={80}
                    className="rounded-lg border border-[#26241f] bg-[#050505] px-3.5 py-2.5 text-sm text-[#f2efe9] placeholder:text-[#9a968e]/50 focus:border-[#ffb347] focus:outline-none"
                  />
                </label>

                <label className="grid gap-1.5 text-xs font-medium text-[#9a968e]">
                  <span>Your Email or GitHub Handle</span>
                  <input
                    type="text"
                    value={visitorReplyChannel}
                    onChange={(e) => setVisitorReplyChannel(e.target.value)}
                    placeholder="you@example.com or @handle"
                    maxLength={120}
                    className="rounded-lg border border-[#26241f] bg-[#050505] px-3.5 py-2.5 text-sm text-[#f2efe9] placeholder:text-[#9a968e]/50 focus:border-[#ffb347] focus:outline-none"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-medium text-[#9a968e]">
                  <span>Project</span>
                  <select
                    value={activeProject}
                    onChange={(e) => onSelectProject(e.target.value)}
                    className="rounded-lg border border-[#26241f] bg-[#050505] px-3.5 py-2.5 text-sm text-[#f2efe9] focus:border-[#ffb347] focus:outline-none"
                  >
                    {PROJECT_OPTIONS.map((projectName) => (
                      <option key={projectName} value={projectName}>
                        {projectName}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1.5 text-xs font-medium text-[#9a968e]">
                  <span>Role / Context (optional)</span>
                  <input
                    type="text"
                    value={visitorRole}
                    onChange={(e) => setVisitorRole(e.target.value)}
                    placeholder="e.g., Developer, Student, Recruiter"
                    maxLength={80}
                    className="rounded-lg border border-[#26241f] bg-[#050505] px-3.5 py-2.5 text-sm text-[#f2efe9] placeholder:text-[#9a968e]/50 focus:border-[#ffb347] focus:outline-none"
                  />
                </label>
              </div>

              <label className="grid gap-1.5 text-xs font-medium text-[#9a968e]">
                <span>Your Project Query</span>
                <textarea
                  rows={4}
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Describe your question, bug, or topic about the selected project..."
                  maxLength={1500}
                  className="rounded-lg border border-[#26241f] bg-[#050505] px-3.5 py-2.5 text-sm text-[#f2efe9] placeholder:text-[#9a968e]/50 focus:border-[#ffb347] focus:outline-none"
                />
              </label>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleLaunchEmail}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[#ffb347] px-5 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#f2efe9] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Send via Email</span>
                </button>

                <button
                  type="button"
                  onClick={handleLaunchGithub}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#f2efe9]/60 px-5 py-2 text-xs font-semibold text-[#f2efe9] transition-colors hover:bg-[#f2efe9] hover:text-black whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <GitHubIcon className="h-3.5 w-3.5" />
                  <span>Ask on GitHub</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyFormattedDraft}
                  className="inline-flex min-h-[40px] items-center gap-1.5 px-2 py-2 text-xs font-medium text-[#9a968e] transition-colors hover:text-[#ffb347] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedDraft ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#ffb347]" aria-hidden="true" />
                      <span className="text-[#ffb347]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy formatted query</span>
                    </>
                  )}
                </button>
              </div>

              {feedback && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`text-sm ${
                    feedback.kind === 'error' ? 'text-[#ff7a6b]' : 'text-[#ffb347]'
                  }`}
                >
                  {feedback.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
