import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Clock, Wallet, Upload, CheckCircle, AlertCircle, Share2, Link as LinkIcon, Briefcase, TrendingUp, Award, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

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

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, <span className="text-blue-600 font-semibold">{user?.name}</span></p>
                </div>
                {status === 'approved' && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100 text-sm font-bold shadow-sm">
                        <Award size={18} />
                        Verified Professional
                    </div>
                )}
            </div>

            {/* Main Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                <StatCard
                    icon={Wallet}
                    title="Wallet Balance"
                    value={`₹${user?.walletBalance || 0}`}
                    subtext="Available for leads or ads"
                    color="bg-green-100 text-green-600"
                    action={
                        <button className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors">
                            Withdraw
                        </button>
                    }
                />

                <StatCard
                    icon={Clock}
                    title="Referral Bonus"
                    value={timeLeft?.includes(':') ? timeLeft : '---'}
                    subtext={timeLeft === "Offer Expired" ? "Standard rewards active" : "Double rewards ending soon!"}
                    color="bg-purple-100 text-purple-600"
                />

                <StatCard
                    icon={TrendingUp}
                    title="Current Status"
                    value={status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                    subtext="Keep your profile updated"
                    color={status === 'approved' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}
                />
            </div>

            {/* Approved - Leads Section (NEW) */}
            {status === 'approved' && (
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
            )}

            {/* Referral Management */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Share2 className="text-indigo-600 w-6 h-6" />
                        <h3 className="font-bold text-xl">Refer & Earn</h3>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                    <div className="flex-1 text-center md:text-left">
                        <p className="text-indigo-900 font-semibold mb-1">Invite your friends to Leadifypro</p>
                        <p className="text-indigo-600/70 text-sm">You both get rewards when they join and get verified.</p>
                    </div>
                    {referralCode && (
                        <div className="flex flex-wrap justify-center gap-3">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(referralCode);
                                    alert("Referral Code Copied: " + referralCode);
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm shadow-sm"
                            >
                                {referralCode}
                                <span className="text-xs text-blue-600 ml-2">COPY</span>
                            </button>
                            <button
                                onClick={() => {
                                    const refLink = `${window.location.origin}/register?role=professional&ref=${referralCode}`;
                                    navigator.clipboard.writeText(refLink);
                                    alert("Referral Link Copied!");
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-sm shadow-lg shadow-blue-100"
                            >
                                <LinkIcon size={18} />
                                Share Link
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Section */}
            {!isPaid && (
                <div className="bg-white p-10 rounded-3xl shadow-xl shadow-blue-50 border border-blue-50 text-center max-w-2xl mx-auto">
                    <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Zap className="w-10 h-10 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold mb-4 text-gray-900">Unlock Your Success</h2>
                    <ul className="text-left max-w-sm mx-auto space-y-4 mb-10 text-gray-600">
                        <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle size={22} className="text-blue-500 flex-shrink-0" /> Upload Premium Portfolio</li>
                        <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle size={22} className="text-blue-500 flex-shrink-0" /> Verified "Expert" Badge</li>
                        <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle size={22} className="text-blue-500 flex-shrink-0" /> Access High-Quality Leads</li>
                    </ul>
                    <div className="bg-gray-50 p-5 rounded-2xl mb-8 text-xs text-gray-500 border border-gray-100">
                        <label className="flex items-start gap-3 cursor-pointer text-left">
                            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked readOnly />
                            <span>I agree that the ₹250 registration fee is <strong>non-refundable</strong>, as it covers the manual verification of my profile quality.</span>
                        </label>
                    </div>
                    <button onClick={handlePayment} className="w-full bg-blue-600 text-white py-5 rounded-2xl text-xl font-bold shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all transform hover:-translate-y-1">
                        Pay ₹250 & Get Started
                    </button>
                </div>
            )}

            {/* Portfolio Sections (Only if Paid) */}
            {isPaid && (
                <div className="space-y-10">
                    {/* Self Introduction Section */}
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
                                    onClick={handleBioUpdate}
                                    className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 transform hover:-translate-y-1"
                                >
                                    Save Profile Bio
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Upload Section - Hide if Locked */}
                    {!isLocked && (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                    <Upload size={24} />
                                </div>
                                <h3 className="font-bold text-2xl text-gray-900">Upload Showcase</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Project Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Landscape Photography Collection"
                                        className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center">
                                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
                                        <AlertCircle className="text-blue-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-blue-700 leading-relaxed font-medium">
                                            Please upload JPG, PNG, or MP4 files only. High-resolution assets significantly increase your chances of being approved.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-2 border-dashed border-gray-200 rounded-[2.5rem] p-16 text-center bg-gray-50/50 hover:bg-blue-50/30 hover:border-blue-300 transition-all relative group cursor-pointer overflow-hidden">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        const formData = new FormData();
                                        formData.append('file', file);
                                        formData.append('description', description);

                                        try {
                                            alert("Uploading... This may take a moment.");
                                            const token = JSON.parse(localStorage.getItem('userInfo')).token;
                                            const config = {
                                                headers: {
                                                    'Authorization': `Bearer ${token}`,
                                                    'Content-Type': 'multipart/form-data'
                                                }
                                            };
                                            await api.post('/professional/upload', formData, config);
                                            await fetchProfileData();
                                            setDescription('');
                                            alert("Upload Successful!");
                                        } catch (error) {
                                            console.error(error);
                                            alert("Upload failed. Verify file size is under 50MB.");
                                        }
                                    }}
                                />
                                <div className="space-y-5 pointer-events-none transition-all group-hover:scale-105">
                                    <div className="bg-white w-20 h-20 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto group-hover:shadow-lg transition-all group-hover:rotate-12">
                                        <Upload className="w-10 h-10 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-extrabold text-xl">Select Your Masterpiece</p>
                                        <p className="text-sm text-gray-500 font-medium mt-1">Drag and drop, or browse your files</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Portfolio Grid */}
                    {portfolio.length > 0 && (
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
                    )}
                </div>
            )}

            {/* Final Submit Button */}
            {isPaid && !isLocked && (
                <div className="flex justify-center pt-12 pb-16">
                    <button
                        onClick={async () => {
                            if (portfolio.length === 0) {
                                alert("Please upload at least one work sample before submitting.");
                                return;
                            }
                            try {
                                const token = JSON.parse(localStorage.getItem('userInfo')).token;
                                const config = { headers: { Authorization: `Bearer ${token}` } };
                                const { data } = await api.post('/professional/submit-application', {}, config);

                                alert("Application Submitted! Reviewing your profile.");
                                setStatus(data.status);
                                window.scrollTo(0, 0);
                            } catch (error) {
                                console.error(error);
                                alert("Submission failed.");
                            }
                        }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-20 py-6 rounded-[2rem] text-2xl font-black shadow-2xl shadow-blue-200 hover:shadow-indigo-300/50 transition-all transform hover:-translate-y-2 active:scale-95 uppercase tracking-widest"
                    >
                        Submit & Go Professional
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfessionalDashboard;
