const companyNotice = 'Jobbyist is a subsidiary of Gravitas Industries Pty Ltd, a private company registered in South Africa under registration number 2024/596436/07.';

const DataProtection = () => {
  return (
    <div className="min-h-screen bg-background">
      <title>Data Protection | Jobbyist - Your Data Rights & Security</title>
      <meta name="description" content="Learn about your data protection rights and how Jobbyist safeguards your personal information in compliance with POPIA and applicable privacy laws." />
      <link rel="canonical" href="https://jobbyist.africa/data-protection" />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Data Protection</h1>
          <p className="text-xl text-muted-foreground">
            Your rights and our commitment to protecting your personal data
          </p>
          <p className="text-lg text-muted-foreground">
            Last updated: June 4, 2026
          </p>
          <p className="mt-4 rounded-lg border bg-muted/30 p-4 text-muted-foreground">
            {companyNotice}
          </p>
        </header>

        <main className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Our Commitment to Data Protection</h2>
            <p className="text-muted-foreground mb-4">
              Jobbyist is committed to protecting your personal data and respecting your privacy rights. We aim to comply with applicable data protection laws, including the Protection of Personal Information Act (POPIA) in South Africa and other privacy rules that may apply to the regions where we operate.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Company Information</h2>
            <p className="text-muted-foreground mb-4">
              {companyNotice}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Legal Basis for Processing</h2>
            <p className="text-muted-foreground mb-4">
              We process personal data only where we have a lawful and appropriate basis to do so. These bases may include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Contractual necessity for account creation, job applications, subscriptions, and platform services</li>
              <li>Legitimate interests for platform security, fraud prevention, service improvement, analytics, and business operations</li>
              <li>Your consent for marketing communications, optional features, and selected third-party integrations</li>
              <li>Legal compliance where records must be retained or disclosed under applicable law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Your Data Protection Rights</h2>
            <p className="text-muted-foreground mb-4">
              Subject to applicable law, you may have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate or incomplete personal data</li>
              <li>Request deletion of personal data where lawful and appropriate</li>
              <li>Restrict or object to certain processing activities</li>
              <li>Request portability of personal data in a machine-readable format</li>
              <li>Withdraw consent for consent-based processing</li>
              <li>Opt out of direct marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. How to Exercise Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              Many account details can be updated directly in your profile. For requests that cannot be completed through your account, contact our privacy team and include your full name, email address, and the specific right you want to exercise.
            </p>
            <ul className="list-none pl-0 text-muted-foreground mb-4">
              <li>Email: dpo@jobbyist.africa</li>
              <li>Subject: Data Protection Rights Request</li>
              <li>Support: support@jobbyist.africa</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Data Security Measures</h2>
            <p className="text-muted-foreground mb-4">
              We use technical and organizational safeguards designed to protect personal data against unauthorized access, alteration, disclosure, or destruction. These measures may include secure HTTPS connections, access controls, encryption for sensitive data where appropriate, staff awareness, backup procedures, and incident response processes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Data Retention</h2>
            <p className="text-muted-foreground mb-4">
              We retain personal data only for as long as necessary for the purposes described in our Privacy Policy, to provide the platform, resolve disputes, maintain business records, comply with legal obligations, and protect our legitimate interests. Retention periods may vary by data category and region.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. International Data Transfers</h2>
            <p className="text-muted-foreground mb-4">
              Your information may be processed or stored in countries other than your own. Where cross-border transfers occur, we aim to use appropriate safeguards, contractual protections, vendor due diligence, and security controls.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Data Breach Notification</h2>
            <p className="text-muted-foreground mb-4">
              If a personal data breach occurs, we will assess the incident, take steps to contain and remediate it, and notify affected users and regulatory authorities where required by applicable law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Children's Data Protection</h2>
            <p className="text-muted-foreground mb-4">
              Our platform is not intended for children under 18 years of age. We do not knowingly collect personal data from children. If we become aware of such collection, we will take appropriate steps to delete the data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Supervisory Authority</h2>
            <p className="text-muted-foreground mb-4">
              If you believe we have not handled your personal data properly, you may contact us first so we can address your concern. South African users may also contact the Information Regulator South Africa.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For questions about data protection or to exercise your rights:
            </p>
            <ul className="list-none pl-0 text-muted-foreground">
              <li>Email: dpo@jobbyist.africa</li>
              <li>Privacy inquiries: privacy@jobbyist.africa</li>
              <li>Support: support@jobbyist.africa</li>
              <li>Address: Jobbyist Data Protection Office, Cape Town, South Africa</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DataProtection;