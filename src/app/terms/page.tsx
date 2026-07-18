import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - JobPilot AI",
  description: "JobPilot AI's terms of service governing your use of our platform and services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-blue-100">Last updated: July 18, 2026</p>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the JobPilot AI platform, website, and services (collectively, the &quot;Service&quot;),
              you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms,
              you must not use the Service. These Terms constitute a legally binding agreement between you and
              JobPilot AI Inc. (&quot;JobPilot AI,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
            </p>

            <h2>2. Eligibility</h2>
            <p>
              You must be at least 18 years old to use the Service. By using the Service, you represent and
              warrant that you meet this age requirement and have the legal capacity to enter into these Terms.
              If you are using the Service on behalf of an organization, you represent that you have the authority
              to bind that organization to these Terms.
            </p>

            <h2>3. Account Registration</h2>
            <ul>
              <li>You must provide accurate, complete, and current information during registration and keep your account information updated.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</li>
              <li>You must notify us immediately of any unauthorized use of your account at support@jobpilot.ai.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
            </ul>

            <h2>4. User Roles and Responsibilities</h2>
            <h3>4.1 Candidates</h3>
            <ul>
              <li>You are responsible for the accuracy of your profile, resume, and application information.</li>
              <li>You understand that applying for jobs through the Service does not guarantee employment.</li>
              <li>You are responsible for evaluating job opportunities and employers independently.</li>
              <li>You may not misrepresent your qualifications, experience, or identity.</li>
            </ul>
            <h3>4.2 Employers</h3>
            <ul>
              <li>You must have the authority to post jobs and represent the hiring organization.</li>
              <li>All job postings must be genuine, lawful, and comply with applicable employment laws.</li>
              <li>You may not discriminate against applicants based on protected characteristics.</li>
              <li>You must handle applicant data in compliance with applicable data protection laws.</li>
              <li>Job postings must not contain misleading information about compensation, duties, or employment terms.</li>
            </ul>

            <h2>5. Subscriptions and Payments</h2>
            <ul>
              <li>The Service offers free and paid subscription tiers. Paid subscriptions are billed in advance on a monthly or annual basis.</li>
              <li>All payments are processed through Stripe. By providing payment information, you authorize us to charge your payment method for recurring subscription fees.</li>
              <li>Subscription fees are non-refundable except as required by applicable law or as described in our refund policy.</li>
              <li>We reserve the right to change subscription prices with 30 days&apos; prior notice. Price changes will take effect at the start of your next billing cycle.</li>
              <li>You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of the current billing period.</li>
              <li>If you cancel a paid subscription, your account will revert to the free tier at the end of the current billing period.</li>
            </ul>

            <h2>6. Content and Intellectual Property</h2>
            <h3>6.1 Your Content</h3>
            <p>
              You retain ownership of content you submit to the Service, including your profile information,
              resume, cover letters, and reviews. By submitting content, you grant JobPilot AI a worldwide,
              non-exclusive, royalty-free license to use, display, reproduce, and distribute your content
              solely for the purpose of operating and improving the Service.
            </p>
            <h3>6.2 Our Content</h3>
            <p>
              The Service, including its design, features, text, graphics, logos, icons, software, and AI-generated
              content, is owned by JobPilot AI and protected by copyright, trademark, and other intellectual property
              laws. You may not copy, modify, distribute, or reverse-engineer any part of the Service without our
              written permission.
            </p>
            <h3>6.3 AI-Generated Content</h3>
            <p>
              Content generated by our AI features (job descriptions, cover letters, recommendations) is provided
              for your reference and use. You are responsible for reviewing and editing AI-generated content before
              using it in applications or publications. We do not guarantee the accuracy or completeness of
              AI-generated content.
            </p>

            <h2>7. Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any unlawful purpose or in violation of any applicable laws or regulations.</li>
              <li>Post false, misleading, fraudulent, or discriminatory job listings.</li>
              <li>Impersonate another person or entity, or misrepresent your affiliation with any person or entity.</li>
              <li>Harass, abuse, threaten, or intimidate other users.</li>
              <li>Scrape, crawl, or use automated means to access the Service without our written permission.</li>
              <li>Interfere with or disrupt the Service, servers, or networks.</li>
              <li>Attempt to gain unauthorized access to any part of the Service or other users&apos; accounts.</li>
              <li>Collect or harvest personal information of other users for unauthorized purposes.</li>
              <li>Use the Service to send unsolicited communications or spam.</li>
              <li>Circumvent any subscription limits, paywalls, or access controls.</li>
              <li>Create multiple accounts to circumvent suspension or banning.</li>
            </ul>

            <h2>8. Reviews and Ratings</h2>
            <p>
              If you submit reviews or ratings, you must base them on genuine, firsthand experiences. Fake reviews,
              reviews submitted in exchange for compensation, or reviews that violate our content guidelines will
              be removed. We reserve the right to suspend accounts engaged in review manipulation.
            </p>

            <h2>9. Termination</h2>
            <p>
              We may suspend or terminate your access to the Service at any time, with or without cause, and with
              or without notice. Grounds for termination include but are not limited to: violation of these Terms,
              fraudulent or illegal activity, harassment of other users, and non-payment of subscription fees.
              Upon termination, your right to use the Service ceases immediately.
            </p>

            <h2>10. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS,
              IMPLIED, OR STATUTORY. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE,
              OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. WE DO NOT GUARANTEE THE ACCURACY, COMPLETENESS,
              OR RELIABILITY OF ANY JOB LISTINGS, RECOMMENDATIONS, OR OTHER CONTENT ON THE SERVICE.
            </p>

            <h2>11. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, JOBPILOT AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA,
              GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE.
              OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM THESE TERMS SHALL NOT EXCEED THE AMOUNT YOU PAID
              US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </p>

            <h2>12. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless JobPilot AI and its officers, directors, employees,
              and agents from any claims, liabilities, damages, losses, and expenses (including reasonable attorneys&apos;
              fees) arising from your use of the Service, violation of these Terms, or infringement of any
              third-party rights.
            </p>

            <h2>13. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms are governed by the laws of the State of California, United States, without regard to
              conflict of law principles. Any dispute arising from these Terms shall be resolved through binding
              arbitration administered by the American Arbitration Association in San Francisco, California,
              except for claims that may be brought in small claims court. You waive any right to participate in
              class action lawsuits or class-wide arbitrations.
            </p>

            <h2>14. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of material changes by
              posting the updated Terms on this page with a revised &quot;Last updated&quot; date and, for significant
              changes, sending you an email notification. Your continued use of the Service after changes are
              posted constitutes acceptance of the updated Terms.
            </p>

            <h2>15. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be
              limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain
              in full force and effect.
            </p>

            <h2>16. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy and any additional agreements you enter into with
              JobPilot AI, constitute the entire agreement between you and JobPilot AI regarding the Service
              and supersede all prior agreements and understandings.
            </p>

            <h2>17. Contact</h2>
            <p>
              For questions about these Terms of Service, please contact:
            </p>
            <ul>
              <li>Email: legal@jobpilot.ai</li>
              <li>Address: JobPilot AI Inc., 548 Market Street, Suite 35000, San Francisco, CA 94104, United States</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
