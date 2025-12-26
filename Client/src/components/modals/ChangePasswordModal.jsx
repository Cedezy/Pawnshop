import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import axios from '../../api/axios';
import { useToast } from "../../context/ToastContext"; 

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

       if (!currentPassword || !newPassword || !confirmPassword) {
            return showToast("Error", "All fields are required.", "error");
        }

        // 2️⃣ Password length check
        if (newPassword.length < 8) {
            return showToast("Error", "Password must be at least 8 characters.", "error");
        }

        // 3️⃣ Match check (LAST)
        if (newPassword !== confirmPassword) {
            return showToast("Error", "Passwords do not match.", "error");
        }

        try{
            setLoading(true);
            const response = await axios.put('/user/me/password',{ currentPassword, newPassword },{
                withCredentials: true 
            });
            showToast("Success", response.data.message, "success");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            onClose();
        } 
        catch(err){
            showToast("Error", err.response?.data?.message, "error");
        } 
        finally{
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-sm shadow-lg w-full max-w-md animate-fade-in flex flex-col">

                {/* Header */}
                <div className="bg-teal-600 px-6 py-4 flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-medium text-white">
                            Change Password
                        </h2>
                        <p className="text-sm text-teal-100 mt-1">
                            Update your account password to keep your account secure.
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    <p className="text-sm text-gray-500">
                        For security purposes, please enter your current password before setting a new one.
                    </p>

                    {/* Current Password */}
                    <div className="relative">
                        <input
                            type={showCurrent ? 'text' : 'password'}
                            placeholder=" "
                           
                            className="peer w-full border-b-2 border-gray-300 pt-4 pb-1 outline-none focus:border-teal-500"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-teal-500 peer-focus:text-xs">
                            Current Password
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-0 top-4 text-gray-500"
                        >
                            {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* New Password */}
                    <div className="relative">
                        <input
                            type={showNew ? 'text' : 'password'}
                            placeholder=" "
                           
                            className="peer w-full border-b-2 border-gray-300 pt-4 pb-1 outline-none focus:border-teal-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-teal-500 peer-focus:text-xs">
                            New Password
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-0 top-4 text-gray-500"
                        >
                            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <p className="text-xs text-gray-400 mt-1">
                            Password should be at least 8 characters long.
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            placeholder=" "
                           
                            className="peer w-full border-b-2 border-gray-300 pt-4 pb-1 outline-none focus:border-teal-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-teal-500 peer-focus:text-xs">
                            Confirm Password
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-0 top-4 text-gray-500"
                        >
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-sm cursor-pointer hover:bg-gray-100 ease-in-out duration-300 font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-teal-600 cursor-pointer ease-in-out duration-300 text-sm text-white rounded-sm hover:bg-teal-700 disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
