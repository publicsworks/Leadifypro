import React from 'react';

const Refund = () => {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 my-10">
            <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
            <div className="prose prose-blue max-w-none text-gray-600 space-y-4">
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">1️⃣ Registration Fee Refunds</h2>
                    <p>Any registration or service fee paid on LeadifyPro is subject to this Refund Policy. A refund may be provided only if it meets the conditions mentioned below.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">2️⃣ Eligibility for Refund</h2>
                    <p>Refund requests will be considered in cases of duplicate payments, technical errors, or incorrect charges, provided the request is raised within a reasonable time period.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">3️⃣ Non-Eligibility for Refund</h2>
                    <p>Refunds will not be applicable once services have been activated, accessed, or partially used, unless required by applicable law.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">4️⃣ Refund Request Process</h2>
                    <p>To request a refund, users must contact our support team with valid payment details and a clear reason for the request. Each request will be reviewed on a case-by-case basis.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">5️⃣ Refund Processing Time</h2>
                    <p>If approved, refunds will be processed within a standard time frame and credited back to the original payment method used during the transaction.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact Us</h2>
                    <p>For any questions regarding refunds, please contact us at <a href="mailto:support@leadifypro.online" className="text-blue-600 hover:underline">support@leadifypro.online</a></p>
                </section>
            </div>
        </div>
    );
};

export default Refund;
