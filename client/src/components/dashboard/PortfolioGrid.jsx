import React from 'react';
import { Briefcase } from 'lucide-react';

const PortfolioGrid = ({ portfolio }) => {
    if (!portfolio || portfolio.length === 0) return null;

    return (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                    <h3 className="font-extrabold text-2xl text-gray-900 flex items-center gap-3">
                        <Briefcase size={26} className="text-blue-600" />
                        Portfolio
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">Your verified work samples</p>
                </div>
                <div className="bg-blue-600 text-white px-5 py-2 rounded-2xl text-sm font-black tracking-widest shadow-lg shadow-blue-100">
                    {portfolio.length} ASSETS
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolio.map((item, index) => (
                    <div key={index} className="group flex flex-col gap-4 bg-white p-5 rounded-[2rem] border border-gray-100 hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500">
                        <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-100 border border-gray-50 shadow-inner">
                            {item.type === 'video' ? (
                                <video src={item.url} className="w-full h-full object-cover" />
                            ) : (
                                <img src={item.url} alt="Work" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            )}
                            <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="bg-white text-blue-700 px-8 py-3 rounded-2xl text-sm font-black shadow-xl hover:bg-blue-50 transition-all transform hover:-translate-y-1">
                                    PREVIEW
                                </a>
                            </div>
                        </div>
                        <div className="px-1 py-1">
                            <p className="text-gray-900 font-extrabold text-lg leading-tight line-clamp-2">{item.description || 'Professional Project'}</p>
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-lg font-black uppercase tracking-widest">{item.type}</span>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                                    <div className="w-2 h-2 rounded-full bg-blue-100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PortfolioGrid;
