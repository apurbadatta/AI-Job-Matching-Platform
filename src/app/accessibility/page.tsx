export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Accessibility Statement</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Last updated: January 2025
        </p>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Our Commitment</h2>
          <p className="text-gray-600 dark:text-gray-400">
            JobPilot AI is committed to ensuring digital accessibility for all users, including people with disabilities. We continually work to improve the accessibility of our platform and ensure inclusivity for everyone.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Standards We Follow</h2>
          <p className="text-gray-600 dark:text-gray-400">
            We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Accessibility Features</h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
            <li><strong>Keyboard Navigation:</strong> All interactive elements are accessible via keyboard.</li>
            <li><strong>Screen Reader Support:</strong> We use semantic HTML and ARIA labels for screen reader compatibility.</li>
            <li><strong>Color Contrast:</strong> We maintain sufficient color contrast ratios for text and backgrounds.</li>
            <li><strong>Dark Mode:</strong> A dark mode option is available to reduce eye strain.</li>
            <li><strong>Responsive Design:</strong> Our platform is fully responsive and works on all device sizes.</li>
            <li><strong>Alt Text:</strong> Images include descriptive alt text where applicable.</li>
            <li><strong>Focus Indicators:</strong> Clear focus indicators are provided for keyboard navigation.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Known Limitations</h2>
          <p className="text-gray-600 dark:text-gray-400">
            While we strive to ensure accessibility across our platform, there may be some areas that need improvement. We are actively working to address any known limitations.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Feedback</h2>
          <p className="text-gray-600 dark:text-gray-400">
            We welcome your feedback on the accessibility of JobPilot AI. If you encounter accessibility barriers or have suggestions for improvement, please contact us at support@jobpilot.ai. We take all feedback seriously and will respond promptly.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Compatibility</h2>
          <p className="text-gray-600 dark:text-gray-400">
            JobPilot AI is designed to be compatible with modern browsers including Chrome, Firefox, Safari, and Edge. We also aim to be compatible with assistive technologies such as screen readers (NVDA, JAWS, VoiceOver) and magnification software.
          </p>
        </div>
      </div>
    </div>
  );
}
