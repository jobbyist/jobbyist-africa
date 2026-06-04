import { useState, type FormEvent } from 'react';
import { ArrowRight, Download, Lock, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Footer from '@/components/Footer';

const ACCESS_CODE = 'IronHorse1901!';
const PDF_PATH = '/roundone.pdf';

const quickStats = [
  { label: 'Round target', value: 'US$1,800', note: 'Approx R29,466' },
  { label: 'Minimum close', value: 'US$1,350', note: 'By 1 July 2026' },
  { label: 'MVP launch', value: '15 July 2026', note: 'South Africa first' },
  { label: 'Equity offer', value: 'Up to 3.0%', note: 'Non-voting/economic equity' },
];

const useOfFunds = [
  {
    item: 'Digital asset acquisition and protection',
    amount: 'US$150',
    detail: 'Regional domains, trademark/copyright preparation, storage, analytics and user-data protection.',
  },
  {
    item: '.cv registrar accreditation and integration',
    amount: 'US$1,000',
    detail: 'Launch-critical deposit and setup for the hello.cv pathway and professional identity features.',
  },
  {
    item: 'AI backend integration services',
    amount: 'US$150',
    detail: 'First-month usage credits for Gemini and OpenAI to support CV, matching and guidance workflows.',
  },
  {
    item: 'Workflow automations, development credits and SEO',
    amount: 'US$250',
    detail: 'Development credits, workflow automation, launch SEO and platform-readiness work.',
  },
  {
    item: 'Mobile prototyping and testing',
    amount: 'US$250',
    detail: 'Android and iOS prototype validation, device-flow testing and app-readiness exploration.',
  },
];

const milestones = [
  ['3 June 2026', 'Proposal finalised and investor materials prepared.'],
  ['By 15 June 2026', 'Investor conversations, soft commitments and documentation path confirmed.'],
  ['By 1 July 2026', 'Minimum close of 75% secured to protect the launch schedule.'],
  ['1-14 July 2026', 'Launch-readiness sprint: deposits, credits, QA, integrations and support setup.'],
  ['15 July 2026', 'South Africa MVP launch and first public onboarding cycle.'],
  ['31 July 2026', 'First launch performance snapshot for spend, users, issues and next priorities.'],
  ['Q3-Q4 2026', 'Use MVP data to prepare the next investment and expansion case.'],
];

const risks = [
  'This is a high-risk, pre-launch micro-seed opportunity and investors may lose all invested capital.',
  'The MVP depends on integrations, data protection controls, AI credits and a focused launch scope.',
  'No return, dividend, exit, valuation increase, liquidity event or job-placement outcome is guaranteed.',
  'Final terms must be documented through appropriate legal, accounting and company-secretarial processes.',
];

const FoundingMembers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = PDF_PATH;
    link.download = 'roundone.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleAccessSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (accessCode.trim() !== ACCESS_CODE) {
      setError('That access code is incorrect. Please check the code and try again.');
      return;
    }

    setError('');
    setIsModalOpen(false);
    setAccessCode('');
    handleDownload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <title>Founding Members | Jobbyist Round 1 Equity Proposal</title>
      <meta
        name="description"
        content="Review the Jobbyist SA Round 1 Founding Members equity proposal, launch plan, use of funds, milestones and access-gated equity proposal download."
      />
      <link rel="canonical" href="https://jobbyist.africa/founding-members" />

      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <a href="/" aria-label="Jobbyist home">
            <img src="/jobbyist26.svg" alt="Jobbyist Logo" className="w-[180px] h-auto" />
          </a>
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            <Lock className="mr-2 h-4 w-4" />
            Access Proposal
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-36 pt-12 md:pt-18">
        <section className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <Badge variant="secondary" className="mb-5 px-4 py-2 text-sm">
              Founding Members Round 1 - private micro-seed launch capital
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              Help launch Jobbyist SA with a focused, accountable first round.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-5">
              Jobbyist SA is raising a small, launch-critical round to move from a nearly ready platform to a live South African MVP. The round is designed to fund only the dependencies needed for launch: digital asset protection, the .cv registrar pathway, AI backend credits, development support, SEO and mobile prototype testing.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              This page summarises the private Round 1 equity proposal for early angel investors and strategic supporters. It is not a public offer, prospectus, financial advice, tax advice or legal advice.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={() => setIsModalOpen(true)}>
                Download The Equity Proposal
                <Download className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="mailto:support@jobbyist.africa?subject=Founding%20Members%20Round%201%20Inquiry">
                  Ask a question
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <Card className="p-6 md:p-8 shadow-xl bg-background/90 border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-muted-foreground font-semibold">Proposal snapshot</p>
                <h2 className="text-2xl font-bold">Lean launch capital</h2>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground leading-relaxed">
              Recommended structure: up to 3.0% non-voting/economic ordinary equity for the full target, with founder control preserved and investor reporting built into the launch period.
            </div>
          </Card>
        </section>

        <section className="max-w-6xl mx-auto py-16 grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <Users className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Problem focus</h3>
            <p className="text-muted-foreground leading-relaxed">
              Jobseekers face scattered job boards, weak CVs, poor tracking and low follow-through. Jobbyist responds with structured workflows, curated listings, career assets and guided support.
            </p>
          </Card>
          <Card className="p-6">
            <ShieldCheck className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">MVP discipline</h3>
            <p className="text-muted-foreground leading-relaxed">
              The South African MVP is positioned as a focused launch platform, not a finished continent-wide marketplace. The goal is to prove execution, demand and paid intent.
            </p>
          </Card>
          <Card className="p-6">
            <TrendingUp className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Revenue pathway</h3>
            <p className="text-muted-foreground leading-relaxed">
              Early revenue can come from career toolkits, guided sprints, premium support, AI-assisted utilities, professional identity products and future recruiter/employer features.
            </p>
          </Card>
        </section>

        <section className="max-w-6xl mx-auto py-10">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">Use of funds</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Every budget line is tied to launch readiness.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The proposal keeps the first round narrow so the team can reach launch, collect evidence and prepare a stronger second-phase funding story later in 2026.
            </p>
          </div>
          <div className="grid gap-4">
            {useOfFunds.map((fund) => (
              <Card key={fund.item} className="p-5 md:p-6 grid gap-3 md:grid-cols-[1fr_auto_1.4fr] md:items-center">
                <h3 className="font-semibold text-lg">{fund.item}</h3>
                <p className="text-2xl font-bold text-primary">{fund.amount}</p>
                <p className="text-muted-foreground leading-relaxed">{fund.detail}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-16 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <Card className="p-6 md:p-8 bg-primary text-primary-foreground">
            <p className="text-sm font-semibold uppercase tracking-wide opacity-80 mb-3">Equity terms</p>
            <h2 className="text-3xl font-bold mb-4">A clear economic stake without operational control.</h2>
            <p className="leading-relaxed opacity-90 mb-5">
              The proposal recommends non-voting/economic equity or a SAFE/convertible-style agreement if share issuance needs to wait for legal structuring. Investors should not receive day-to-day control, product vetoes, code ownership, account access or unilateral spending authority.
            </p>
            <p className="text-sm leading-relaxed opacity-85">
              If Jobbyist SA is not separately authorised to issue shares at the point of investment, the proposal contemplates documentation through Gravitas Industries Pty Ltd with ring-fenced beneficial economic rights linked to Jobbyist SA until the correct subsidiary structure is completed.
            </p>
          </Card>

          <div className="grid gap-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Investor ticket examples</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['US$250', '0.4167%'],
                  ['US$500', '0.8333%'],
                  ['US$900', '1.5000%'],
                  ['US$1,350', '2.2500%'],
                  ['US$1,800', '3.0000%'],
                ].map(([ticket, equity]) => (
                  <div key={ticket} className="rounded-xl bg-muted/40 p-4 flex justify-between gap-4">
                    <span className="font-medium">{ticket}</span>
                    <span className="font-semibold text-primary">{equity}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6 border-amber-200 bg-amber-50/50 dark:bg-amber-950/10">
              <h3 className="text-xl font-semibold mb-3">Founder-protection red line</h3>
              <p className="text-muted-foreground leading-relaxed">
                For US$1,800, Jobbyist should not sell a double-digit ownership stake, surrender product control or accept heavy anti-dilution rights. If an investor wants more than 4.0%, the proposal recommends a different structure rather than ordinary equity.
              </p>
            </Card>
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-10">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">Milestones</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">A fixed launch window with investor-visible outputs.</h2>
          </div>
          <div className="relative border-l border-primary/30 pl-6 space-y-6">
            {milestones.map(([date, detail]) => (
              <div key={date} className="relative">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary" />
                <p className="font-semibold text-foreground">{date}</p>
                <p className="text-muted-foreground leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-16 grid gap-8 lg:grid-cols-2">
          <Card className="p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">Risk factors</p>
            <h2 className="text-3xl font-bold mb-5">Plain risk language matters.</h2>
            <ul className="space-y-3 text-muted-foreground leading-relaxed">
              {risks.map((risk) => (
                <li key={risk} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary flex-none" />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">Reporting and governance</p>
            <h2 className="text-3xl font-bold mb-5">Simple governance for a micro-round.</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The proposal calls for clean documentation before funds are accepted, approved use-of-funds controls, monthly updates until launch, quarterly updates thereafter, retained receipts and confidentiality around investor materials, roadmaps, credentials and user data.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This round is a launch catalyst, not a mature-company investment. Investors are backing execution speed, disciplined spending, early traction data and a stronger second-phase raise story.
            </p>
          </Card>
        </section>

        <section className="max-w-6xl mx-auto py-8">
          <Card className="p-6 md:p-8 border-primary/20 bg-background/90">
            <h2 className="text-3xl font-bold mb-4">Company notice</h2>
            <p className="text-muted-foreground leading-relaxed">
              Jobbyist is a subsidiary of Gravitas Industries Pty Ltd, a private company registered in South Africa under registration number 2024/596436/07. Investor documentation should be reviewed independently, and all final terms are subject to applicable legal, accounting, tax, company-secretarial and regulatory checks.
            </p>
          </Card>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pointer-events-none">
        <Button
          size="lg"
          className="pointer-events-auto w-full max-w-xl shadow-2xl py-7 text-base md:text-lg rounded-2xl"
          onClick={() => setIsModalOpen(true)}
        >
          <Download className="mr-2 h-5 w-5" />
          Download The Equity Proposal
        </Button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-labelledby="proposal-modal-title">
          <Card className="w-full max-w-lg p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h2 id="proposal-modal-title" className="text-2xl font-bold">Enter access code</h2>
                <p className="text-sm text-muted-foreground">The equity proposal is restricted to authorised readers.</p>
              </div>
            </div>
            <form onSubmit={handleAccessSubmit} className="space-y-4">
              <label className="block text-sm font-medium" htmlFor="access-code">
                Access code
              </label>
              <input
                id="access-code"
                type="password"
                value={accessCode}
                onChange={(event) => setAccessCode(event.target.value)}
                className="w-full rounded-md border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter the access code"
                autoFocus
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Unlock and download
                  <Download className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default FoundingMembers;
