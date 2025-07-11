import React from 'react';

const page = () => {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen px-6 py-10 md:px-16 lg:px-32">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl p-8 md:p-12">
        <h1 className="text-4xl font-bold green mb-6">Return & Refund Policy</h1>
        <p className="mb-6 text-lg">
          At <strong>Bitek Mart</strong>, customer satisfaction is our top priority. We want you to shop with confidence. This Return & Refund Policy outlines the terms under which you may return products and request refunds.
        </p>

        {/* Eligibility Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold green mb-2">1. Return Eligibility</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Returns are accepted within <strong>7 days</strong> from the delivery date.</li>
            <li>Products must be unused, unopened, and in their original packaging.</li>
            <li>Perishable items (like fresh fruits, vegetables, dairy, etc.) are <strong>non-returnable</strong> unless damaged or spoiled upon delivery.</li>
            <li>Proof of purchase (order number or invoice) is required.</li>
          </ul>
        </div>

        {/* Non-Returnable Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold green mb-2">2. Non-Returnable Items</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Opened or used products</li>
            <li>Items without original packaging or labels</li>
            <li>Clearance or discounted products (unless defective)</li>
            <li>Gift cards or promotional vouchers</li>
          </ul>
        </div>

        {/* Refunds Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold green mb-2">3. Refunds</h2>
          <p className="mb-2">
            Once your return is received and inspected, we will notify you of the status of your refund. If approved:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Refunds are processed within <strong>5–7 business days</strong>.</li>
            <li>The amount will be refunded to your original payment method or as store credit.</li>
            <li>Shipping charges are non-refundable unless the return is due to our error.</li>
          </ul>
        </div>

        {/* Exchanges Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold green mb-2">4. Replacements & Exchanges</h2>
          <p>
            If you received a damaged or defective item, we’re happy to send a replacement at no extra cost. Please contact us within <strong>48 hours of delivery</strong> with a photo of the product.
          </p>
        </div>

        {/* How to Return */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold green mb-2">5. How to Request a Return</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Email us at <a href="mailto:support@bitekmart.com" className="green underline">support@bitekmart.com</a> with your order number and reason for return.</li>
            <li>Our support team will verify your request and provide pickup or drop-off instructions.</li>
            <li>Ensure the item is securely packed to avoid damage during return transit.</li>
          </ul>
        </div>

        {/* Late Refunds */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold green mb-2">6. Late or Missing Refunds</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>If you haven’t received a refund after 7 days, first check your bank account again.</li>
            <li>Then contact your bank or credit card company—it may take some time before your refund is officially posted.</li>
            <li>If you’ve done all this and still have not received your refund, please contact us.</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold green mb-2">7. Need Help?</h2>
          <p>
            For any return, refund, or product-related inquiries, feel free to contact our support team at{' '}
            <a href="mailto:support@bitekmart.com" className="green underline">support@bitekmart.com</a>. We’re here to help you!
          </p>
        </div>

        <p className="text-sm text-gray-500">Last updated: May 4, 2025</p>
      </div>
    </div>
  );
};

export default page;
