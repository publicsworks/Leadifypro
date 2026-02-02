import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-100">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
                    Leadifypro
                </Link>

                <nav className="flex items-center gap-6">
                    {!user ? (
                        <>
                            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">How it Works</Link>
                            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">Login</Link>
                            <Link to="/register" className="btn-primary">
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">
                                {user.name} ({user.role})
                            </span>
                            <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors" title="Logout">
                                <LogOut size={20} />
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
