export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Cookie Policy</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Last updated: January 2025
        </p>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. What Are Cookies</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. How We Use Cookies</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-3">We use cookies for the following purposes:</p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
            <li><strong>Authentication:</strong> To keep you signed in and maintain your session.</li>
            <li><strong>Preferences:</strong> To remember your settings like dark mode and language preferences.</li>
            <li><strong>Analytics:</strong> To understand how visitors interact with our platform and improve our services.</li>
            <li><strong>Security:</strong> To protect against fraud and unauthorized access.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. Types of Cookies We Use</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2"><strong>Essential Cookies:</strong> Required for the platform to function. These cannot be disabled.</p>
          <p className="text-gray-600 dark:text-gray-400 mb-2"><strong>Functional Cookies:</strong> Remember your preferences and settings to enhance your experience.</p>
          <p className="text-gray-600 dark:text-gray-400 mb-2"><strong>Analytics Cookies:</strong> Help us understand how visitors use our platform so we can improve it.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Managing Cookies</h2>
          <p className="text-gray-600 dark:text-gray-400">
            You can control and manage cookies through your browser settings. Please note that disabling essential cookies may affect the functionality of our platform. You can typically find cookie settings in your browser&apos;s &quot;Preferences&quot; or &quot;Settings&quot; menu.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. Third-Party Cookies</h2>
          <p className="text-gray-600 dark:text-gray-400">
            We may use third-party services (such as Google Analytics and Stripe) that set their own cookies. These cookies are subject to the respective third party&apos;s privacy policies.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">6. Updates to This Policy</h2>
          <p className="text-gray-600 dark:text-gray-400">
            We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated &quot;Last updated&quot; date.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">7. Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-400">
            If you have any questions about our use of cookies, please contact us at support@jobpilot.ai.
          </p>
        </div>
      </div>
    </div>
  );
}
