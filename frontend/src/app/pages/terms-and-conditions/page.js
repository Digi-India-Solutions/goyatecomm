import React from "react";

const page = () => {
  return (
    <>
      <div className="bg-gray-50 text-gray-800 min-h-screen px-6 py-10 md:px-16 lg:px-32">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold green mb-6">
            Terms & Conditions
          </h1>
          <p className="mb-6 text-lg">
            Welcome to <strong>Bitek Mart</strong>. These Terms & Conditions DBS
            your access to and use of our website&#34; services&#34; and
            products. By using our platform&#34; you agree to these Terms in
            full.
          </p>

          {/* Section 1 */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold green mb-2">
              1. Use of Our Website
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>You must be at least 18 years old to make a purchase.</li>
              <li>All information provided must be accurate and current.</li>
              <li>You agree not to misuse the site or its services.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold green mb-2">
              2. Account & Security
            </h2>
            <p className="mb-2">
              You are responsible for maintaining the confidentiality of your
              account information.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Ensure your login credentials are secure.</li>
              <li>Notify us immediately if you suspect unauthorized access.</li>
              <li>
                We reserve the right to suspend accounts that violate these
                Terms.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold green mb-2">
              3. Orders & Payment
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>All orders are subject to availability and confirmation.</li>
              <li>
                Prices are listed in INR and are subject to change without
                notice.
              </li>
              <li>
                We use secure third-party payment gateways. Bitek Mart does not
                store your card details.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold green mb-2">
              4. Delivery & Shipping
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Delivery times are estimates and not guaranteed.</li>
              <li>
                Delays due to weather&#34; strikes&#34; or unforeseen events may
                occur.
              </li>
              <li>
                You are responsible for ensuring someone is available to receive
                the order.
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold green mb-2">
              5. Returns & Refunds
            </h2>
            <p>
              Please refer to our{" "}
              <a href="/return-refund-policy" className="green underline">
                Return & Refund Policy
              </a>{" "}
              for details on how to initiate returns and request refunds.
            </p>
          </div>

          {/* Section 6 */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold green mb-2">
              6. Intellectual Property
            </h2>
            <p>
              All content on this site&#34; including images&#34; text&#34;
              logos&#34; and graphics&#34; is the property of Bitek Mart and
              protected by copyright laws. You may not reproduce&#34; copy&#34;
              or distribute any part without permission.
            </p>
          </div>

          {/* Section 7 */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold green mb-2">
              7. Prohibited Activities
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Hacking&#34; scraping&#34; or reverse engineering the website
              </li>
              <li>Using the site for illegal purposes</li>
              <li>Uploading malicious code or harmful content</li>
            </ul>
          </div>

          {/* Section 8 */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold green mb-2">
              8. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your access if you
              violate any of these Terms or engage in fraudulent or abusive
              activity.
            </p>
          </div>

          {/* Section 9 */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold green mb-2">
              9. Limitation of Liability
            </h2>
            <p>
              Bitek Mart is not liable for indirect&#34; incidental&#34; or
              consequential damages arising from your use of the website or
              purchase of products.
            </p>
          </div>

          {/* Section 10 */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold green mb-2">
              10. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. Any changes will be
              posted on this page with the revised date. Continued use of the
              website means you accept the changes.
            </p>
          </div>

          {/* Contact Info */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold green mb-2">
              11. Contact Us
            </h2>
            <p>
              For any questions regarding these Terms & Conditions&#34; please
              email us at{" "}
              <a
                href="mailto:support@bitekmart.com"
                className="green underline"
              >
                support@bitekmart.com
              </a>
              .
            </p>
          </div>

          <p className="text-sm text-gray-500">Last updated: May 4&#34; 2025</p>
        </div>
      </div>
    </>
  );
};

export default page;
