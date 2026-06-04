const companyNotice = 'Jobbyist is a subsidiary of Gravitas Industries Pty Ltd, a private company registered in South Africa under registration number 2024/596436/07.';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <title>Terms of Service | Jobbyist - Platform Usage Agreement</title>
      <meta name="description" content="Read Jobbyist's terms of service and user agreement. Understand your rights and responsibilities when using our job platform." />
      <link rel="canonical" href="https://jobbyist.africa/terms-of-service" />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-xl text-muted-foreground">
            Last updated: June 4, 2026
          </p>
          <p className="mt-4 rounded-lg border bg-muted/30 p-4 text-muted-foreground">
            {companyNotice}
          </p>
        </header>

        <main className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using Jobbyist ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Company Information</h2>
            <p className="text-muted-foreground mb-4">
              {companyNotice}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              Jobbyist is an online job platform connecting job seekers with employers across Africa, with regional portals including South Africa, Nigeria, Kenya, Ghana, Egypt, and Morocco. We provide tools for job searching, application management, and career development.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. User Accounts</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">4.1 Account Creation</h3>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>One person may maintain only one active account</li>
              <li>You must be at least 18 years old to create an account</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3">4.2 Account Responsibilities</h3>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Keep your login credentials confidential</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Update your information to keep it current and accurate</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. User Conduct</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">5.1 Permitted Use</h3>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Search and apply for legitimate job opportunities</li>
              <li>Create and maintain professional profiles</li>
              <li>Communicate respectfully with other users</li>
              <li>Use the platform for lawful purposes only</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3">5.2 Prohibited Activities</h3>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Posting false, misleading, or fraudulent information</li>
              <li>Harassment, discrimination, or inappropriate behavior</li>
              <li>Spamming or unsolicited communications</li>
              <li>Attempting to circumvent platform security measures</li>
              <li>Using automated tools without permission</li>
              <li>Posting jobs or content that violate local laws</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Content and Intellectual Property</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">6.1 User Content</h3>
            <p className="text-muted-foreground mb-4">
              You retain ownership of content you upload but grant Jobbyist a license to use, display, and distribute such content in connection with our services.
            </p>

            <h3 className="text-xl font-medium text-foreground mb-3">6.2 Platform Content</h3>
            <p className="text-muted-foreground mb-4">
              All platform features, design, and functionality are owned by or licensed to Jobbyist and protected by copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Job Postings and Applications</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">7.1 For Job Seekers</h3>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Applications submitted through our platform are your responsibility</li>
              <li>We do not guarantee job placement, interviews, hiring outcomes, or employer responses</li>
              <li>Verify job legitimacy before sharing personal information</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3">7.2 For Employers</h3>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Job postings must be legitimate and comply with applicable laws</li>
              <li>You are responsible for your hiring practices and decisions</li>
              <li>Treat all candidates fairly and without discrimination</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Privacy and Data Protection</h2>
            <p className="text-muted-foreground mb-4">
              Your privacy is important to us. Please review our Privacy Policy and Data Protection page to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Platform Availability</h2>
            <p className="text-muted-foreground mb-4">
              We strive to maintain platform availability but do not guarantee uninterrupted access. We may suspend services for maintenance, updates, security, compliance, or other operational reasons.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Disclaimers and Limitations</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">10.1 No Warranties</h3>
            <p className="text-muted-foreground mb-4">
              The platform is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of job postings or user content.
            </p>

            <h3 className="text-xl font-medium text-foreground mb-3">10.2 Limitation of Liability</h3>
            <p className="text-muted-foreground mb-4">
              To the maximum extent permitted by law, Jobbyist and Gravitas Industries Pty Ltd shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Account Termination</h2>
            <p className="text-muted-foreground mb-4">
              We may suspend or terminate accounts that violate these Terms. You may delete your account at any time through your account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We may modify these Terms from time to time. Continued use of the platform after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These Terms are governed by the laws of South Africa. Any disputes will be resolved in the courts of Cape Town, South Africa, unless another court has mandatory jurisdiction under applicable law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">14. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For questions about these Terms, please contact us:
            </p>
            <ul className="list-none pl-0 text-muted-foreground">
              <li>Email: legal@jobbyist.africa</li>
              <li>Support: support@jobbyist.africa</li>
              <li>Address: Jobbyist Legal Team, Cape Town, South Africa</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default TermsOfService;