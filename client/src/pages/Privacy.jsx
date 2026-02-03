import React from 'react';

const Privacy = () => {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 my-10">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose prose-blue max-w-none text-gray-600 space-y-4">
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
                    <p>We collect information that you provide directly to us, such as when you create an account, update your profile, or communicate with us.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">2. How We Use Information</h2>
                    <p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you about your account and our services.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Information Sharing</h2>
                    <p>We do not share your personal information with third parties except as described in this policy, such as with your consent or to comply with legal obligations.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Data Security</h2>
                    <p>We take reasonable measures to protect your personal information from loss, theft, misuse, and unauthorized access.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Your Choices</h2>
                    <p>You can access and update your account information at any time through your account settings. You may also contact us to request deletion of your information.</p>
                </section>
            </div>
        </div>
    );
};

export default Privacy;
