import React from 'react';
import { Zap, CheckCircle } from 'lucide-react';

const PaymentSection = ({ onPayment }) => {
    return (
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-blue-50 border border-blue-50 text-center max-w-2xl mx-auto">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-extrabold mb-4 text-gray-900">Unlock Your Success</h2>
            <ul className="text-left max-w-sm mx-auto space-y-4 mb-10 text-gray-600">
                <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle size={22} className="text-blue-500 flex-shrink-0" /> Upload Premium Portfolio</li>
                <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle size={22} className="text-blue-500 flex-shrink-0" /> Verified "Expert" Badge</li>
                <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle size={22} className="text-blue-500 flex-shrink-0" /> Access High-Quality Leads</li>
            </ul>
            <div className="bg-gray-50 p-5 rounded-2xl mb-8 text-xs text-gray-500 border border-gray-100">
                <label className="flex items-start gap-3 cursor-pointer text-left">
                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked readOnly />
                    <span>I agree that the ₹250 registration fee is <strong>non-refundable</strong>, as it covers the manual verification of my profile quality.</span>
                </label>
            </div>
            <button onClick={onPayment} className="w-full bg-blue-600 text-white py-5 rounded-2xl text-xl font-bold shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all transform hover:-translate-y-1">
                Pay ₹250 & Get Started
            </button>
        </div>
    );
};

export default PaymentSection;
