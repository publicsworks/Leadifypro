import React from 'react';
import { Zap, Briefcase } from 'lucide-react';

const LeadsSection = () => {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 overflow-hidden relative">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold uppercase">
                    <Zap size={14} className="fill-yellow-300 text-yellow-300" />
                    Live Opportunities
                </div>
                <h2 className="text-3xl font-bold mb-3">Find New Client Leads</h2>
                <p className="text-blue-100 mb-6 max-w-lg">
                    Clients are looking for experts like you. Browse available projects and start growing your business today.
                </p>
                <button className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg">
                    <Briefcase size={20} />
                    Explore Marketplace
                </button>
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 opacity-20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        </div>
    );
};

export default LeadsSection;
