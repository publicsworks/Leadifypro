import React from 'react';
import { Share2, Link as LinkIcon } from 'lucide-react';

const ReferralSection = ({ referralCode }) => {

    const copyToClipboard = (text, message) => {
        navigator.clipboard.writeText(text);
        alert(message);
    };

    const handleCopyCode = () => {
        copyToClipboard(referralCode, `Referral Code Copied: ${referralCode}`);
    };

    const handleShareLink = () => {
        const refLink = `${window.location.origin}/register?role=professional&ref=${referralCode}`;
        copyToClipboard(refLink, "Referral Link Copied!");
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Share2 className="text-indigo-600 w-6 h-6" />
                    <h3 className="font-bold text-xl">Refer & Earn</h3>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                <div className="flex-1 text-center md:text-left">
                    <p className="text-indigo-900 font-semibold mb-1">Invite your friends to Leadifypro</p>
                    <p className="text-indigo-600/70 text-sm">You both get rewards when they join and get verified.</p>
                </div>
                {referralCode && (
                    <div className="flex flex-wrap justify-center gap-3">
                        <button
                            onClick={handleCopyCode}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm shadow-sm"
                        >
                            {referralCode}
                            <span className="text-xs text-blue-600 ml-2">COPY</span>
                        </button>
                        <button
                            onClick={handleShareLink}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-sm shadow-lg shadow-blue-100"
                        >
                            <LinkIcon size={18} />
                            Share Link
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReferralSection;
