import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Clock, Wallet, Upload, CheckCircle, AlertCircle, Share2, Link as LinkIcon } from 'lucide-react';

const ProfessionalDashboard = () => {
    const { user, updateProfile } = useAuth();
    const [timeLeft, setTimeLeft] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [status, setStatus] = useState('pending_payment');
    const [portfolio, setPortfolio] = useState([]);

    // New State for Portfolio Description
    const [description, setDescription] = useState('');
    // New State for Profile Bio (Self Introduction)
    const [bio, setBio] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const isLocked = ['under_review', 'approved', 'rejected'].includes(status);

    useEffect(() => {
        if (user) {
            setupDashboard(user);
        }
    }, [user]);

    const setupDashboard = (userData) => {
        if (userData.status) setStatus(userData.status);
        if (userData.isPaid) setIsPaid(userData.isPaid);
        fetchProfileData();
    };

    useEffect(() => {
        const calculateTime = () => {
            let createdAt = user?.createdAt;
            if (!createdAt) {
                const stored = JSON.parse(localStorage.getItem('userInfo'));
                createdAt = stored?.createdAt;
            }
            if (!createdAt) {
                setTimeLeft("23:59:59");
                return;
            }

            const now = new Date();
            const joinedAt = new Date(createdAt);
            const expiryTime = new Date(joinedAt.getTime() + 24 * 60 * 60 * 1000);
            const diff = expiryTime - now;

            if (diff <= 0) {
                setTimeLeft("Offer Expired");
            } else {
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);

        return () => clearInterval(interval);
    }, [user]);

    const fetchProfileData = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo?.token;
            if (!token) return;

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await api.get('/auth/profile', config);

            if (data.profile) {
                setPortfolio(data.profile.portfolio || []);
                setStatus(data.profile.status);
                setIsPaid(data.profile.isPaid);
                setBio(data.profile.description || '');
                setReferralCode(data.profile.referralCode || '');
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const handlePayment = async () => {
        if (!window.confirm("I agree that ₹250 is non-refundable even if my work is rejected.")) return;

        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await api.post('/payment/registration-fee', {}, config);
            setIsPaid(true);
            setStatus(data.status);
            updateProfile({ isPaid: true, status: data.status });
            alert("Payment Successful! Your profile is now Under Review.");
            fetchProfileData();
        } catch (error) {
            alert(error.response?.data?.message || "Payment failed");
        }
    };

    const handleBioUpdate = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.put('/professional/update-description', { description: bio }, config);
            alert("Self Introduction Updated Successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update introduction.");
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>

            {/* Status Banner - Show for pending_payment, under_review (after submit), approved, rejected. Hide for pending_submission. */}
            {status !== 'pending_submission' && (
                <div className={`p-6 rounded-xl border ${status === 'approved' ? 'bg-green-50 border-green-200 text-green-700' : (status === 'under_review' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700')}`}>
                    <div className="flex items-center gap-3">
                        {status === 'approved' ? <CheckCircle /> : (status === 'under_review' ? <Clock /> : <AlertCircle />)}
                        <div>
                            <h3 className="font-bold text-lg capitalize">{status?.replace('_', ' ') || 'Pending'}</h3>
                            <p>
                                {status === 'pending_payment' && 'Complete payment to activate your profile.'}
                                {status === 'under_review' && 'Your profile is currently under review.'}
                                {status === 'approved' && 'You are verified! Access leads now.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Referral Timer & Wallet */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4 text-purple-600">
                        <Clock className="w-6 h-6" />
                        <h3 className="font-bold text-lg">Referral Boost</h3>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <span className="text-3xl font-mono font-bold text-purple-700">{timeLeft || 'Loading...'}</span>
                        <p className="text-xs text-purple-600 mt-2 font-medium">
                            {timeLeft === "Offer Expired" ? "Standard Rewards Active" : "Double Rewards (Ending Soon!)"}
                        </p>
                    </div>

                    <div className="mt-4 flex flex-col items-center gap-3">
                        <p className="text-sm text-gray-500">Refer others within 24h of joining to get ₹100 instead of ₹50!</p>
                        {referralCode && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(referralCode);
                                        alert("Referral Code Copied: " + referralCode);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs font-bold"
                                >
                                    Copy Code: {referralCode}
                                </button>
                                <button
                                    onClick={() => {
                                        const refLink = `${window.location.origin}/register?role=professional&ref=${referralCode}`;
                                        navigator.clipboard.writeText(refLink);
                                        alert("Referral Link Copied: " + refLink);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs font-bold"
                                >
                                    <LinkIcon size={14} />
                                    Copy Link
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4 text-green-600">
                        <Wallet className="w-6 h-6" />
                        <h3 className="font-bold text-lg">Wallet Balance</h3>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                        <span className="text-4xl font-bold text-green-700">₹{user?.walletBalance || 0}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 text-center">Use for extra leads or featured listing.</p>
                </div>
            </div>

            {/* Payment Section */}
            {
                !isPaid && (
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-4">Unlock Your Professional Profile</h2>
                        <ul className="text-left max-w-md mx-auto space-y-3 mb-8 text-gray-600">
                            <li className="flex gap-2"><CheckCircle size={20} className="text-blue-500" /> Upload Portfolio & Videos</li>
                            <li className="flex gap-2"><CheckCircle size={20} className="text-blue-500" /> Get Verified by Admin</li>
                            <li className="flex gap-2"><CheckCircle size={20} className="text-blue-500" /> Access Client Leads</li>
                        </ul>
                        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm text-gray-500">
                            <label className="flex items-start gap-2 cursor-pointer">
                                <input type="checkbox" className="mt-1" defaultChecked readOnly />
                                <span>I agree that the <strong>₹250 registration fee</strong> is non-refundable, even if my application is rejected based on quality standards.</span>
                            </label>
                        </div>
                        <button onClick={handlePayment} className="btn-primary w-full py-4 text-lg shadow-xl shadow-blue-200">
                            Pay ₹250 & Register
                        </button>
                    </div>
                )
            }

            {/* Portfolio Upload (Only if Paid) */}
            {
                isPaid && (
                    <div className="space-y-8">
                        {/* Self Introduction Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                                <h3 className="font-bold text-lg">Self Introduction</h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                                Tell clients about your experience, skills, and what makes you unique. This will appear on your public profile.
                            </p>
                            <textarea
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none ${isLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                placeholder="Hi, I'm a professional photographer with 5 years of experience..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                disabled={isLocked}
                            />
                            <div className="mt-4 flex justify-end">
                                {!isLocked && (
                                    <button
                                        onClick={handleBioUpdate}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        Save Introduction
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Upload Section - Hide if Locked */}
                        {!isLocked && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <Upload className="w-6 h-6 text-blue-600" />
                                    <h3 className="font-bold text-lg">Upload Portfolio</h3>
                                </div>

                                {/* Description Input */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <input
                                        type="text"
                                        placeholder="Enter a description for your work..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                {/* Upload Box */}
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors relative group">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            const formData = new FormData();
                                            formData.append('file', file);
                                            // Append description
                                            formData.append('description', description);

                                            try {
                                                alert("Uploading... Please wait.");
                                                const token = JSON.parse(localStorage.getItem('userInfo')).token;
                                                const config = {
                                                    headers: {
                                                        'Authorization': `Bearer ${token}`,
                                                        'Content-Type': 'multipart/form-data'
                                                    }
                                                };
                                                await api.post('/professional/upload', formData, config);
                                                await fetchProfileData(); // Refresh list immediately
                                                setDescription(''); // Clear description
                                                alert("Upload Successful!");
                                            } catch (error) {
                                                console.error(error);
                                                alert("Upload failed. Please try again.");
                                            }
                                        }}
                                    />
                                    <div className="space-y-2 pointer-events-none">
                                        <Upload className="w-10 h-10 text-gray-400 mx-auto" />
                                        <p className="text-gray-600 font-medium">Click to upload images or videos</p>
                                        <span className="text-xs text-gray-400 block">Supports JPG, PNG, MP4 (Max 50MB)</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Portfolio Grid */}
                        {portfolio.length > 0 && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                    <CheckCircle size={20} className="text-green-500" />
                                    Your Verified Portfolio ({portfolio.length})
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {portfolio.map((item, index) => (
                                        <div key={index} className="flex flex-col gap-2">
                                            <div className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                                                {item.type === 'video' ? (
                                                    <video src={item.url} className="w-full h-full object-cover" />
                                                ) : (
                                                    <img src={item.url} alt="Portfolio" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-gray-50 transition-colors">
                                                        View Full
                                                    </a>
                                                </div>
                                            </div>
                                            {/* Display Description */}
                                            <p className="text-sm text-gray-700 font-medium truncate">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )
            }

            {/* Final Submit Button */}
            {/* Final Submit Button - Hide if Locked */}
            {
                isPaid && !isLocked && (
                    <div className="flex justify-center pb-8">
                        <button
                            onClick={async () => {
                                if (portfolio.length === 0) {
                                    alert("Please upload at least one work sample before submitting.");
                                    return;
                                }
                                // Call submit API
                                try {
                                    const token = JSON.parse(localStorage.getItem('userInfo')).token;
                                    const config = { headers: { Authorization: `Bearer ${token}` } };
                                    const { data } = await api.post('/professional/submit-application', {}, config);

                                    alert("Application Submitted Successfully! Our team is reviewing your profile.");
                                    setStatus(data.status); // Update status to 'under_review'
                                    window.scrollTo(0, 0); // Scroll to top to see banner
                                } catch (error) {
                                    console.error(error);
                                    alert("Submission failed. Please try again.");
                                }
                            }}
                            className="btn-primary px-12 py-4 text-lg shadow-xl shadow-blue-200 transition-transform transform hover:scale-105"
                        >
                            Submit Application & Finish
                        </button>
                    </div>
                )
            }
        </div >
    );
};

export default ProfessionalDashboard;
