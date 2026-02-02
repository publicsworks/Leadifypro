import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TermsModal from '../components/TermsModal';

const Register = () => {
    const [searchParams] = useSearchParams();
    const roleParam = searchParams.get('role');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: roleParam || 'professional',
        category: 'General',
        referredBy: ''
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [customCategory, setCustomCategory] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        if (roleParam) setFormData(prev => ({ ...prev, role: roleParam }));
        const refParam = searchParams.get('ref');
        if (refParam) setFormData(prev => ({ ...prev, referredBy: refParam }));
    }, [roleParam, searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agreedToTerms) {
            setError('Please accept the Terms and Conditions to continue');
            return;
        }

        const payload = { ...formData };
        if (payload.role === 'professional' && payload.category === 'Other') {
            if (!customCategory.trim()) {
                setError('Please specify your profession');
                return;
            }
            payload.category = customCategory;
        }

        try {
            const data = await register(payload);
            if (data.role === 'admin') navigate('/admin');
            else if (data.role === 'professional') navigate('/dashboard/professional');
            else navigate('/dashboard/client');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

            <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                <button
                    type="button"
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${formData.role === 'professional' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setFormData({ ...formData, role: 'professional' })}
                >
                    Professional
                </button>
                <button
                    type="button"
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${formData.role === 'client' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setFormData({ ...formData, role: 'client' })}
                >
                    Client
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>

                {formData.role === 'professional' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Profession Category</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="General">General</option>
                                <option value="Developer">Developer</option>
                                <option value="Designer">Designer</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Writing">Writing</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {formData.category === 'Other' && (
                            <div className="animate-fade-in">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Specify Profession</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-blue-300 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-blue-400"
                                    placeholder="e.g. Photographer, Plumber, Accountant..."
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code (Optional)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.referredBy}
                                onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                                placeholder="Enter code if you have one"
                            />
                        </div>
                    </>
                )}

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-start gap-2 mt-4">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the{' '}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowTermsModal(true);
                            }}
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Terms and Conditions
                        </button>
                        {' '}and{' '}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowTermsModal(true);
                            }}
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Privacy Policy
                        </button>
                    </label>
                </div>

                <button
                    type="submit"
                    className={`w-full py-3 mt-4 rounded-lg font-medium transition-colors ${agreedToTerms
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    disabled={!agreedToTerms}
                >
                    Register
                </button>
            </form>

            {/* Terms Modal */}
            <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
        </div>
    );
};

export default Register;
