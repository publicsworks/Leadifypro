import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Star } from 'lucide-react';

// Mock Data for UI before API integration
const MOCK_PROS = [
    { id: 1, name: "Rahul Sharma", category: "Developer", location: "Bangalore", rating: 4.8, intro: "Full Stack Developer with 5 years exp." },
    { id: 2, name: "Priya Singh", category: "Designer", location: "Mumbai", rating: 4.9, intro: "UI/UX Specialist for mobile apps." },
    { id: 3, name: "Amit Verma", category: "Marketing", location: "Delhi", rating: 4.5, intro: "Digital Marketing expert." },
];

const ClientDashboard = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');

    // In real app, fetch from API
    const pros = MOCK_PROS.filter(p =>
        (category === 'All' || p.category === category) &&
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Find Professionals</h1>

            {/* Search Bar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or location..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white min-w-[200px]"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="Marketing">Marketing</option>
                </select>
            </div>

            {/* Results Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pros.map(pro => (
                    <div key={pro.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{pro.name}</h3>
                                <div className="text-sm text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded mt-1">{pro.category}</div>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">
                                <Star size={16} fill="currentColor" />
                                <span className="font-bold text-sm">{pro.rating}</span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pro.intro}</p>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                            <MapPin size={16} />
                            {pro.location}
                        </div>
                        <button className="w-full btn-primary py-2 text-sm bg-slate-800 hover:bg-slate-900">
                            View Profile
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientDashboard;
