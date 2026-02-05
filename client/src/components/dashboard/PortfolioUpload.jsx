import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import api from '../../api';

const PortfolioUpload = ({ onUploadSuccess }) => {
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);

        setIsUploading(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            await api.post('/professional/upload', formData, config);
            setDescription('');
            alert("Upload Successful!");
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            console.error(error);
            alert("Upload failed. Verify file size is under 50MB.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
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

            <div className={`border-2 border-dashed border-gray-200 rounded-[2.5rem] p-16 text-center bg-gray-50/50 hover:bg-blue-50/30 hover:border-blue-300 transition-all relative group cursor-pointer overflow-hidden ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                />
                <div className="space-y-5 pointer-events-none transition-all group-hover:scale-105">
                    <div className="bg-white w-20 h-20 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto group-hover:shadow-lg transition-all group-hover:rotate-12">
                        <Upload className={`w-10 h-10 text-blue-500 ${isUploading ? 'animate-bounce' : ''}`} />
                    </div>
                    <div>
                        <p className="text-gray-900 font-extrabold text-xl">{isUploading ? 'Uploading...' : 'Select Your Masterpiece'}</p>
                        <p className="text-sm text-gray-500 font-medium mt-1">Drag and drop, or browse your files</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioUpload;
