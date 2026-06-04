import { ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Footer from '@/components/Footer';

const Whitepaper = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <title>Whitepaper 2026/27 | Jobbyist</title>
      <meta
        name="description"
        content="Jobbyist 2026/27 whitepaper covering the platform roadmap, regional expansion, career technology strategy and governance principles."
      />
      <link rel="canonical" href="https://jobbyist.africa/whitepaper" />

      <main className="container mx-auto px-4 py-16 md:py-24">
        <Card className="max-w-4xl mx-auto p-8 md:p-12 bg-background/90 shadow-xl">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
            <FileText className="h-7 w-7" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
            Whitepaper 2026/27
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Building Africa's career infrastructure for the next chapter of work.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-5">
            The Jobbyist 2026/27 whitepaper will outline the platform roadmap, regional growth strategy, candidate success model, employer/recruiter tools, professional identity products, AI-assisted career workflows and governance principles for responsible expansion.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Jobbyist is a subsidiary of Gravitas Industries Pty Ltd, a private company registered in South Africa under registration number 2024/596436/07.
          </p>
          <Button asChild size="lg">
            <a href="mailto:support@jobbyist.africa?subject=Whitepaper%202026%2F27%20Request">
              Request the whitepaper
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Whitepaper;
