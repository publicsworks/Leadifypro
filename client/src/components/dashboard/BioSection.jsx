import React from 'react';
import { Award } from 'lucide-react';

const BioSection = ({ bio, setBio, isLocked, onSave }) => {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Award size={24} />
                </div>
                <h3 className="font-bold text-2xl text-gray-900">Professional Bio</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4">
                Introduce yourself to potential clients. Highlight your expertise and unique value proposition.
            </p>
            <textarea
                className={`w-full px-6 py-5 border border-gray-200 rounded-3xl focus:ring-4 focus:ring-blue-50 h-44 resize-none transition-all duration-300 ${isLocked ? 'bg-gray-50 cursor-not-allowed text-gray-500' : 'bg-white hover:border-blue-300'}`}
                placeholder="Hi, I'm a professional expert with a passion for..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={isLocked}
            />
            <div className="mt-4 flex justify-end">
                {!isLocked && (
                    <button
                        onClick={onSave}
                        className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 transform hover:-translate-y-1"
                    >
                        Save Profile Bio
                    </button>
                )}
            </div>
        </div>
    );
};

export default BioSection;
