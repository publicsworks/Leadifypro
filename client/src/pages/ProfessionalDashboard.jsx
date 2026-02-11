import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Clock, Wallet, TrendingUp, Award } from 'lucide-react';

// Components
import StatCard from '../components/dashboard/StatCard';
import LeadsSection from '../components/dashboard/LeadsSection';
import ReferralSection from '../components/dashboard/ReferralSection';
import PaymentSection from '../components/dashboard/PaymentSection';
import BioSection from '../components/dashboard/BioSection';
import PortfolioUpload from '../components/dashboard/PortfolioUpload';
import PortfolioGrid from '../components/dashboard/PortfolioGrid';

const ProfessionalDashboard = () => {
    const { user, updateProfile } = useAuth();
    const [timeLeft, setTimeLeft] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [status, setStatus] = useState('pending_payment');
    const [portfolio, setPortfolio] = useState([]);

    // Profile Bio (Self Introduction)
    const [bio, setBio] = useState('');
    const [referralCode, setReferralCode] = useState('');

    // Status lock check
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

    // Verify Payment and Refresh Profile
    const verifyPayment = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.post('/payment/verify-payment', {}, config);
            // Refresh profile to update UI
            fetchProfileData();
        } catch (error) {
            console.error("Payment verification failed", error);
        }
    };

    useEffect(() => {
        fetchProfileData();

        // Check if returning from Cashfree payment
        const queryParams = new URLSearchParams(location.search);
        const orderId = queryParams.get('order_id');
        if (orderId) {
            verifyPayment();
            // Clean URL
            window.history.replaceState({}, document.title, location.pathname);
        }
    }, [location]);

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
        if (!window.confirm("I agree that ₹1 is non-refundable even if my work is rejected.")) return;

        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            console.log("Step 1: Creating order...");
            // 1. Create Order Session on Backend
            const { data: orderData } = await api.post('/payment/create-order', {}, config);
            console.log("Order created:", orderData);

            if (!orderData.payment_session_id) {
                throw new Error("Failed to initialize payment session");
            }

            console.log("Step 2: Loading Cashfree SDK...");
            // 2. Check if Cashfree SDK is available
            if (!window.Cashfree) {
                throw new Error("Cashfree SDK not loaded. Please refresh the page.");
            }

            // Initialize Cashfree SDK (Correct v3 method)
            const cashfree = await window.Cashfree.load({
                mode: "production"
            });
            console.log("Cashfree SDK loaded successfully");

            const checkoutOptions = {
                paymentSessionId: orderData.payment_session_id,
                redirectTarget: "_self", // Redirects in the same tab
            };

            console.log("Step 3: Opening checkout...");
            // 3. Trigger Checkout
            cashfree.checkout(checkoutOptions).then(async (result) => {
                if (result.error) {
                    // This is for error during SDK load or configuration
                    console.error("SDK Error:", result.error);
                    alert("Payment failed to initialize. Please try again.");
                }

                if (result.redirect) {
                    // This is for redirect flow, if applicable
                    console.log("Redirecting...");
                }

                // Note: The modal closure or success is handled by checking the order status
                // We'll call our verification endpoint
                try {
                    const { data: verifyData } = await api.post('/payment/verify-payment', {
                        order_id: orderData.order_id
                    }, config);

                    if (verifyData.status) {
                        setIsPaid(true);
                        setStatus(verifyData.status);
                        updateProfile({ isPaid: true, status: verifyData.status });
                        alert("Payment Successful! Your profile is now Under Review.");
                        fetchProfileData();
                    }
                } catch (err) {
                    console.log("Verification check (might be cancelled):", err.response?.data?.message);
                }
            }).catch((error) => {
                console.error("Checkout error:", error);
                alert("Failed to open payment page: " + error.message);
            });

        } catch (error) {
            console.error("Payment Error:", error);
            alert(error.response?.data?.message || error.message || "Payment initialization failed");
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

    const handleSubmitApplication = async () => {
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
    };

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

            {/* Approved - Leads Section */}
            {status === 'approved' && <LeadsSection />}

            {/* Referral Management */}
            <ReferralSection referralCode={referralCode} />

            {/* Payment Section */}
            {!isPaid && <PaymentSection onPayment={handlePayment} />}

            {/* Portfolio Sections (Only if Paid) */}
            {isPaid && (
                <div className="space-y-10">
                    <BioSection
                        bio={bio}
                        setBio={setBio}
                        isLocked={isLocked}
                        onSave={handleBioUpdate}
                    />

                    {!isLocked && (
                        <PortfolioUpload onUploadSuccess={fetchProfileData} />
                    )}

                    <PortfolioGrid portfolio={portfolio} />
                </div>
            )}

            {/* Final Submit Button */}
            {isPaid && !isLocked && (
                <div className="flex justify-center pt-12 pb-16">
                    <button
                        onClick={handleSubmitApplication}
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
