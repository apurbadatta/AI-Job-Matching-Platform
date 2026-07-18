import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - JobPilot AI",
  description: "JobPilot AI's privacy policy explaining how we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-blue-100">Last updated: July 18, 2026</p>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400">
            <h2>1. Introduction</h2>
            <p>
              JobPilot AI Inc. (&quot;JobPilot AI,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
              use our website, mobile applications, and services (collectively, the &quot;Service&quot;). By using the Service,
              you agree to the collection and use of information in accordance with this policy.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Information You Provide</h3>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, password, phone number, and professional details such as work history, education, skills, and resume/CV content.</li>
              <li><strong>Profile Data:</strong> Professional headline, bio, location, industry, job preferences, salary expectations, and portfolio or website links.</li>
              <li><strong>Application Data:</strong> Cover letters, saved jobs, application history, and notes you add to applications.</li>
              <li><strong>Employer Data:</strong> Company name, description, logo, job postings, hiring preferences, and team member information.</li>
              <li><strong>Payment Information:</strong> Billing address and payment method details processed through our third-party payment processor (Stripe). We do not store full credit card numbers on our servers.</li>
              <li><strong>Communications:</strong> Messages you send through the platform, contact form submissions, and support requests.</li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <ul>
              <li><strong>Device Information:</strong> IP address, browser type and version, operating system, device type, and unique device identifiers.</li>
              <li><strong>Usage Data:</strong> Pages viewed, features used, search queries, click patterns, time spent on pages, and navigation paths through the Service.</li>
              <li><strong>Location Data:</strong> Approximate geographic location based on IP address, and precise location if you grant permission on a mobile device.</li>
              <li><strong>Cookies and Tracking:</strong> We use cookies, web beacons, and similar technologies to maintain session state, remember preferences, and analyze usage patterns. You can control cookies through your browser settings.</li>
            </ul>

            <h3>2.3 Information from Third Parties</h3>
            <ul>
              <li><strong>OAuth Providers:</strong> If you sign in using Google, we receive your name, email, and profile picture from the authentication provider.</li>
              <li><strong>Employer Partners:</strong> Job posting data and company information provided by employers who use our platform.</li>
              <li><strong>Public Sources:</strong> Professional information from public profiles and databases that helps us verify and enhance your profile.</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul>
              <li>Providing, maintaining, and improving the Service, including job matching, recommendations, and AI-powered features.</li>
              <li>Processing job applications and connecting candidates with employers.</li>
              <li>Generating personalized career recommendations, cover letters, and job descriptions using artificial intelligence.</li>
              <li>Processing payments and managing subscriptions.</li>
              <li>Communicating with you about account activity, service updates, security alerts, and marketing messages (with opt-out available).</li>
              <li>Detecting and preventing fraud, abuse, and security incidents.</li>
              <li>Complying with legal obligations and enforcing our terms of service.</li>
              <li>Conducting analytics and research to improve our platform and develop new features.</li>
            </ul>

            <h2>4. How We Share Your Information</h2>
            <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
            <ul>
              <li><strong>With Employers:</strong> When you apply for a job, your profile information and application materials are shared with the relevant employer.</li>
              <li><strong>With Service Providers:</strong> We share data with trusted third-party vendors who perform services on our behalf, including hosting, payment processing, analytics, and customer support.</li>
              <li><strong>For Legal Reasons:</strong> We may disclose information if required by law, court order, or governmental request, or to protect our rights, safety, or property.</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</li>
              <li><strong>With Your Consent:</strong> We may share information for purposes not described in this policy with your explicit consent.</li>
            </ul>

            <h2>5. AI and Automated Decision-Making</h2>
            <p>
              Our platform uses artificial intelligence for job matching, recommendation generation, cover letter
              writing, and job description creation. These AI features process your profile data, skills, and preferences
              to generate personalized outputs. AI-generated content is clearly labeled and should be reviewed by you
              before use. We do not make automated decisions with legal or similarly significant effects without human oversight.
            </p>

            <h2>6. Data Security</h2>
            <p>
              We implement industry-standard security measures including encryption in transit (TLS/SSL) and at rest,
              access controls, regular security audits, and employee training on data protection practices. However,
              no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee
              absolute security.
            </p>

            <h2>7. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide
              the Service. If you delete your account, we will remove your personal data within 30 days, except
              where we need to retain certain information for legal, legitimate business, or analytical purposes.
              Anonymized and aggregated data may be retained indefinitely.
            </p>

            <h2>8. Your Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data, subject to certain exceptions.</li>
              <li><strong>Portability:</strong> Request transfer of your data in a structured, machine-readable format.</li>
              <li><strong>Objection:</strong> Object to processing of your data for certain purposes.</li>
              <li><strong>Restriction:</strong> Request restriction of processing under certain circumstances.</li>
              <li><strong>Withdraw Consent:</strong> Withdraw previously given consent at any time.</li>
            </ul>
            <p>
              To exercise these rights, contact us at privacy@jobpilot.ai. We will respond to requests within 30 days.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              Your data may be processed in countries other than your own. We ensure adequate protection through
              standard contractual clauses and other appropriate safeguards as required by applicable data protection laws.
            </p>

            <h2>10. Children&apos;s Privacy</h2>
            <p>
              The Service is not intended for individuals under 18 years of age. We do not knowingly collect personal
              information from children. If we learn that we have collected information from a child, we will delete
              it promptly.
            </p>

            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting
              the updated policy on this page with a revised &quot;Last updated&quot; date and, for significant changes,
              sending you an email notification. Your continued use of the Service after changes are posted constitutes
              acceptance of the updated policy.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul>
              <li>Email: privacy@jobpilot.ai</li>
              <li>Address: JobPilot AI Inc., 548 Market Street, Suite 35000, San Francisco, CA 94104, United States</li>
              <li>Data Protection Officer: dpo@jobpilot.ai</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
