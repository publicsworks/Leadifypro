import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, Shield } from 'lucide-react';

const Home = () => {
    return (
        <div className="animate-fade-in space-y-20">
            {/* Hero Section */}
            <section className="text-center py-20 px-4 bg-gradient-to-b from-blue-50 to-transparent rounded-3xl">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-900">
                    Get Real Clients for <span className="text-blue-600">Your Real Work</span>
                </h1>
                <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Leadifypro connects skilled professionals with verified clients.
                    Showcase your portfolio, get approved, and start growing your business today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/register?role=professional" className="btn-primary text-lg px-8 py-4 shadow-lg shadow-blue-200">
                        Join as Professional
                    </Link>
                    <Link to="/register?role=client" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                        Hire a Professional
                    </Link>
                </div>
            </section>

            {/* How It Works */}
            <section className="grid md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Users size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Create Profile</h3>
                    <p className="text-gray-600">Sign up and build your professional portfolio.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Shield size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Get Verified</h3>
                    <p className="text-gray-600">Admin reviews your work to ensure quality.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Get Clients</h3>
                    <p className="text-gray-600">Receive verified leads directly to your dashboard.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
