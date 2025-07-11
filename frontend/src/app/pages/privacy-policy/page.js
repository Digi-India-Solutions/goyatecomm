import React from "react";

const page = () => {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen px-4 py-8 md:px-16 lg:px-32">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl p-4 md:p-8">
        <h1 className="text-2xl md:text-4xl font-bold green mb-6">
          Privacy Policy
        </h1>
        <p className="mb-6 text-lg">
          Welcome to <strong>GOYAT TRADING</strong>. We care about your
          privacy and are committed to safeguarding your personal information.
          This Privacy Policy outlines how we collect&#39; use&#39; and protect
          your data when you use our services.
        </p>

        {/* Section 1 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold green mb-2">
            1. What Information We Collect
          </h2>
          <p className="mb-2">We may collect the following types of data:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Personal Details: Name&#39; email&#39; phone number&#39; shipping
              address
            </li>
            <li>
              Payment Information (processed via secure third-party gateways)
            </li>
            <li>
              Browsing data&#39; IP address&#39; device info&#39; and cookies
            </li>
            <li>Order history and support messages</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold green mb-2">
            2. How We Use Your Data
          </h2>
          <p>We use your information to:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Fulfill and manage your orders</li>
            <li>Provide customer support</li>
            <li>
              Send updates&#39; promotions&#39; and offers (opt-out anytime)
            </li>
            <li>Improve our platform and prevent fraud</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold green mb-2">
            3. Data Sharing & Third Parties
          </h2>
          <p className="mb-2">
            We never sell your data. However&#39; we may share it with trusted
            partners for order fulfillment&#39; analytics&#39; and payment
            processing&#39; such as:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Payment gateways (Razorpay&#39; Stripe&#39; etc.)</li>
            <li>Delivery/logistics partners</li>
            <li>Marketing tools (Google Ads&#39; Meta Pixel anonymized)</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold green mb-2">
            4. Cookies and Tracking Technologies
          </h2>
          <p>
            We use cookies to enhance your browsing experience&#39; remember
            preferences&#39; and analyze website traffic. You can manage cookie
            settings through your browser at any time.
          </p>
        </div>

        {/* Section 5 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold green mb-2">
            5. Data Retention
          </h2>
          <p>
            We retain your personal data only as long as necessary to provide
            our services or as required by law. When no longer needed&#39; your
            data is securely deleted.
          </p>
        </div>

        {/* Section 6 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold green mb-2">
            6. Your Rights
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Right to access and update your data</li>
            <li>Right to request deletion</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent</li>
          </ul>
          <p className="mt-2">
            Contact us at{" "}
            <a
              href="mailto:support@bitekmart.com"
              className="green underline"
            >
              support@bitekmart.com
            </a>{" "}
            for any privacy-related requests.
          </p>
        </div>

        {/* Section 7 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold green mb-2">
            7. Security Measures
          </h2>
          <p>
            We implement advanced security practices&#39; including HTTPS&#39;
            encryption&#39; and secure third-party services to keep your data
            safe. However&#39; no method of transmission is 100% secure.
          </p>
        </div>

        {/* Section 8 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold green mb-2">
            8. Children&lsquo;s Privacy
          </h2>
          <p>
            Our website is not intended for children under the age of 13. We do
            not knowingly collect data from minors.
          </p>
        </div>

        {/* Section 9 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold green mb-2">
            9. Policy Updates
          </h2>
          <p>
            We may revise this policy from time to time. Changes will be
            reflected on this page with the updated effective date.
          </p>
        </div>

        <p className="text-sm text-gray-500">Last updated: May 4&#39; 2025</p>
      </div>
    </div>
  );
};

export default page;
