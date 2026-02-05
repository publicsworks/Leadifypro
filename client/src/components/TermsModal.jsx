import React from 'react';
import { X } from 'lucide-react';

const TermsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Terms and Conditions</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 space-y-2 text-gray-700">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">1. Acceptance of Terms</h3>
                        <p className="text-xs">
                            By using Leadifypro, you agree to these terms. Don't agree? Please don't use our service.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">2. Registration Fee</h3>
                        <p className="text-xs">
                            ₹1 one-time fee. <strong>Non-refundable</strong> even if your application is rejected.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">3. Profile Approval</h3>
                        <p className="text-xs">
                            Admin reviews all profiles. We may reject profiles that don't meet quality standards.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">4. Referral Program</h3>
                        <p className="text-xs">
                            Refer within 24h = ₹100. After 24h = ₹50. Rewards go to your wallet.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">5. User Conduct</h3>
                        <p className="text-xs">
                            Provide accurate info. Be professional. No fraud. Violations = account suspension.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">6. Intellectual Property</h3>
                        <p className="text-xs">
                            Your content stays yours. We can display it on our platform to connect you with clients.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">7. Privacy and Data</h3>
                        <p className="text-xs">
                            Your data is safe. We won't share it with others without your permission.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">8. Limitation of Liability</h3>
                        <p className="text-xs">
                            We connect professionals with clients. We're not responsible for service quality or disputes.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">9. Modifications</h3>
                        <p className="text-xs">
                            We can update these terms anytime. Continued use means you accept the changes.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">10. Contact</h3>
                        <p className="text-xs">
                            Questions? Email <a href="mailto:support@leadifypro.online" className="text-blue-600 hover:underline">support@leadifypro.online</a>
                        </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg mt-2">
                        <p className="text-xs text-gray-600">
                            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
