import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Check, X, Clock } from 'lucide-react';

const AdminDashboard = () => {
    const [pendingProfiles, setPendingProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await api.get('/admin/pending', config);
            setPendingProfiles(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.post('/admin/action', { id, action }, config);
            fetchPending(); // Refresh list
        } catch (error) {
            alert("Action failed");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Clock className="text-orange-500" size={20} />
                        Pending Approvals
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm">
                            <tr>
                                <th className="p-4">Professional</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Date Joined</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pendingProfiles.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-500">No pending approvals</td></tr>
                            ) : (
                                pendingProfiles.map(profile => (
                                    <tr key={profile._id}>
                                        <td className="p-4">
                                            <div className="font-medium">{profile.user?.name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{profile.user?.email}</div>
                                        </td>
                                        <td className="p-4 text-sm">{profile.category}</td>
                                        <td className="p-4 text-sm">{new Date(profile.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 flex gap-2">
                                            <button
                                                onClick={() => handleAction(profile._id, 'approve')}
                                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors" title="Approve">
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleAction(profile._id, 'reject')}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" title="Reject">
                                                <X size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
