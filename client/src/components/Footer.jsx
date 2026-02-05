import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-white text-xl font-bold mb-4">Leadifypro</h3>
                        <p className="text-sm">
                            Connecting skilled professionals with clients who need their expertise. Build your career or find the perfect expert.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="/register?role=professional" className="hover:text-white transition-colors">Become a Professional</Link>
                            </li>
                            <li>
                                <Link to="/register?role=client" className="hover:text-white transition-colors">Find Professionals</Link>
                            </li>
                            <li>
                                <Link to="/login" className="hover:text-white transition-colors">Login</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <Mail size={16} />
                                <a href="mailto:support@leadifypro.online" className="hover:text-white transition-colors">
                                    support@leadifypro.online
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Leadifypro. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
