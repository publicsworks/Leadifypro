import React from 'react';

const Terms = () => {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 my-10">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <div className="prose prose-blue max-w-none text-gray-600 space-y-4">
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
                    <p>By accessing and using Leadifypro, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">2. User Responsibilities</h2>
                    <p>Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Fees and Payments</h2>
                    <p>Professional registration fees are non-refundable as stated during the registration process. Payments for leads or services are subject to the specific terms displayed at the time of purchase.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Privacy Policy</h2>
                    <p>Your use of Leadifypro is also governed by our Privacy Policy, which describes how we collect and use your personal information.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Contact</h2>
                    <p>For any questions regarding these terms, please contact us at support@leadifypro.online.</p>
                </section>
            </div>
        </div>
    );
};

export default Terms;
