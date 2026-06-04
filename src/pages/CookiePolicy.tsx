const companyNotice = 'Jobbyist is a subsidiary of Gravitas Industries Pty Ltd, a private company registered in South Africa under registration number 2024/596436/07.';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <title>Cookie Policy | Jobbyist - How We Use Cookies</title>
      <meta name="description" content="Learn about how Jobbyist uses cookies and similar technologies to enhance your experience on our job platform." />
      <link rel="canonical" href="https://jobbyist.africa/cookie-policy" />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
          <p className="text-xl text-muted-foreground">
            Last updated: June 4, 2026
          </p>
          <p className="mt-4 rounded-lg border bg-muted/30 p-4 text-muted-foreground">
            {companyNotice}
          </p>
        </header>

        <main className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. What Are Cookies?</h2>
            <p className="text-muted-foreground mb-4">
              Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Company Information</h2>
            <p className="text-muted-foreground mb-4">
              {companyNotice}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">3.1 Essential Cookies</h3>
            <p className="text-muted-foreground mb-4">
              These cookies are necessary for the website to function properly. They enable core functionality such as:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>User authentication and login sessions</li>
              <li>Security features and fraud prevention</li>
              <li>Application management and saved user preferences</li>
              <li>Load balancing and website performance</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3">3.2 Analytics Cookies</h3>
            <p className="text-muted-foreground mb-4">
              We use analytics cookies to understand how visitors interact with our website:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Pages visited and time spent on site</li>
              <li>Popular job searches and categories</li>
              <li>User journey and navigation patterns</li>
              <li>Technical performance and error tracking</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3">3.3 Functional Cookies</h3>
            <p className="text-muted-foreground mb-4">
              These cookies enhance your experience by remembering your choices:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Language and location preferences</li>
              <li>Job search filters and saved searches</li>
              <li>Accessibility settings and interface preferences</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3">3.4 Marketing Cookies</h3>
            <p className="text-muted-foreground mb-4">
              With your consent, we may use marketing cookies to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Show you relevant job recommendations</li>
              <li>Display personalized content and advertisements</li>
              <li>Track the effectiveness of our marketing campaigns</li>
              <li>Retarget visitors with relevant opportunities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Third-Party Cookies</h2>
            <p className="text-muted-foreground mb-4">
              We may allow trusted third parties to place cookies on our website for analytics, support, security, social media, advertising, and performance purposes. These providers may include analytics platforms, social media networks, advertising partners, and hosting or infrastructure providers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Cookie Consent</h2>
            <p className="text-muted-foreground mb-4">
              When you first visit our website, you may see a cookie consent banner. You can choose to accept cookies, reject non-essential cookies, or customize your preferences where available. You can also manage cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Managing Cookies</h2>
            <p className="text-muted-foreground mb-4">
              Most browsers allow you to block, delete, or manage cookies through settings. Disabling certain cookies may affect login sessions, saved preferences, personalized recommendations, and some website functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookie Retention</h2>
            <p className="text-muted-foreground mb-4">
              Cookies are stored for different periods depending on their purpose. Session cookies are deleted when you close your browser. Persistent cookies may remain for a defined period unless you delete them earlier.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Updates to This Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices. We will notify you of any significant changes by updating the date at the top of this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <ul className="list-none pl-0 text-muted-foreground">
              <li>Email: privacy@jobbyist.africa</li>
              <li>Support: support@jobbyist.africa</li>
              <li>Subject: Cookie Policy Inquiry</li>
              <li>Address: Jobbyist Privacy Team, Cape Town, South Africa</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CookiePolicy;