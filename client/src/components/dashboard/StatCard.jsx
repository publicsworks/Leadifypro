import React from 'react';

const StatCard = ({ icon: Icon, title, value, subtext, color, action }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className={`p-3 rounded-xl ${color} w-fit mb-4`}>
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <div className="mt-1 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            {action}
        </div>
        <p className="mt-2 text-xs text-gray-400 font-medium">{subtext}</p>
    </div>
);

export default StatCard;
