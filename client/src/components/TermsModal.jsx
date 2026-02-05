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
                        <h3 className="text-base font-semibold text-gray-900 mb-1">1️⃣ Acceptance of Terms</h3>
                        <p className="text-xs">
                            LeadifyPro ka use karne par aap in sabhi Terms & Conditions se sahmat hote hain. Agar aap in terms se agree nahi karte, to kripya platform ka use na karein.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">2️⃣ Service Description</h3>
                        <p className="text-xs">
                            LeadifyPro ek software-based platform hai jo professionals aur potential clients ke beech connection facilitate karta hai. Hum kisi bhi business outcome ya earning ki guarantee nahi dete.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">3️⃣ Registration Fee</h3>
                        <p className="text-xs">
                            Ek nominal one-time registration fee lagu ho sakti hai. Refunds, agar koi ho, to hamari Refund Policy ke anusar hi process kiye jaayenge.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">4️⃣ Account Registration & Accuracy</h3>
                        <p className="text-xs">
                            Users ko registration ke samay sahi, complete aur updated information dena zaroori hai. Galat ya misleading information dene par account suspend ya terminate kiya ja sakta hai.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">5️⃣ Profile Review & Approval</h3>
                        <p className="text-xs">
                            Sabhi profiles platform quality aur compliance ensure karne ke liye review ki jaati hain. LeadifyPro kisi bhi profile ko approve ya reject karne ka adhikar rakhta hai.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">6️⃣ User Conduct</h3>
                        <p className="text-xs">
                            Users ko platform ka use legal, ethical aur professional tareeke se karna hoga. Fraud, misuse ya kisi bhi tarah ki illegal activity strictly prohibited hai.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">7️⃣ Referral & Promotions</h3>
                        <p className="text-xs">
                            LeadifyPro time-to-time promotional ya referral benefits offer kar sakta hai. Ye benefits internal verification aur applicable terms ke subject honge.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">8️⃣ Intellectual Property</h3>
                        <p className="text-xs">
                            Platform par upload ki gayi user content ka ownership user ke paas rahega. User LeadifyPro ko platform operation aur promotion ke liye limited right deta hai.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">9️⃣ Privacy & Data Protection</h3>
                        <p className="text-xs">
                            User data ko Privacy Policy ke anusar securely handle kiya jaata hai. Bina user consent ke data third parties ke saath share nahi kiya jaata.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">🔟 Limitation of Liability</h3>
                        <p className="text-xs">
                            LeadifyPro professionals aur clients ke beech sirf ek connecting platform hai. Services, disputes ya outcomes ke liye LeadifyPro zimmedar nahi hoga.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">1️⃣1️⃣ Modifications to Terms</h3>
                        <p className="text-xs">
                            LeadifyPro bina prior notice ke in Terms & Conditions ko update ya modify kar sakta hai. Platform ka continued use updated terms ki acceptance maana jaayega.
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
