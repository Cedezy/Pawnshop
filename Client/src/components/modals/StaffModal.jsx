import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import axios from '../../api/axios';
import { useToast } from "../../context/ToastContext"; 

const StaffModal = ({ staff, isOpen, onClose, onSaved }) => {
    const [form, setForm] = useState({
        firstname: staff?.userId.firstname || '',
        middlename: staff?.userId.middlename || '',
        lastname: staff?.userId.lastname || '',
        email: staff?.userId.email || '',
        phone: staff?.phone || '',
        street: staff?.street || '',
        barangay: staff?.barangay || '',
        city: staff?.city || '',
        province: staff?.province || '',
        zipCode: staff?.zipCode || '',
        role: staff?.userId.role || 'manager',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleForm = async (e) => {
        e.preventDefault();
        
        if(!staff && form.password !== form.confirmPassword){
            showToast("Error", "Passwords do not match", "error");
            return;
        }
        if(!staff && (form.password.length < 8 ||  form.confirmPassword.length < 8)){
            return showToast("Error", "Passwords must be at least 8 characters long.", "error");
        }

        setLoading(true);

        try{
            let response;

            if(staff){
                response = await axios.put(`/user/${staff._id}`, form, { withCredentials: true });
            } 
            else{
                response = await axios.post('/user', form, { withCredentials: true });
            }

            showToast("Success", response.data.message, "success");
            onSaved();
            onClose();
        } 
        catch(err){
            showToast("Error", err.response?.data?.message, "error");
        } 
        finally{
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="bg-white rounded-sm shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
                
                {/* Header */}
                <div className="bg-teal-600 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg tracking-tight font-medium text-gray-50">
                            {staff ? 'Edit Staff' : 'ADD NEW USER'}
                        </h2>
                        <button onClick={onClose} className="text-white hover:bg-teal-700 rounded-full p-1 transition-colors duration-200 cursor-pointer">
                            <X size={24} />
                        </button>
                    </div>
                    {/* Header description */}
                    <p className="text-xs text-teal-100 mt-1">
                        {staff
                            ? 'Update staff personal details and account information.'
                            : 'Fill in the details to add a new staff member.'}
                    </p>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1">
                    <form onSubmit={handleForm} className="p-6 space-y-5">

                        {/* User Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-700">User Information</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Enter personal details of the staff. Fields marked with * are required.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {['firstname', 'middlename', 'lastname','email','phone','zipCode','city','province','barangay','street'].map((field) => (
                                    <div key={field} className={`relative w-full ${field === 'street' ? 'md:col-span-2' : ''}`}>
                                        <input
                                            placeholder=" "
                                            value={form[field]}
                                            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                                            className="peer w-full border-b-2 border-gray-300 focus:border-teal-500 text-sm pt-4 pb-1 outline-none"
                                        />
                                        <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-teal-500 peer-focus:text-xs">
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                            {field !== 'middlename' && <span className="text-red-400"> *</span>}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Account Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-700">Account Information</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Assign a role and set login credentials. Password is required for new staff.
                            </p>

                            {/* Role */}
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Role</label>
                                <select
                                    className="border border-gray-300 cursor-pointer rounded-md p-2 w-full"
                                    value={form.role}
                                    onChange={e => setForm({ ...form, role: e.target.value })}
                                >
                                    <option value="manager">Manager</option>
                                    <option value="appraiser">Appraiser</option>
                                </select>
                            </div>

                            {/* Password fields only for new staff */}
                            {!staff && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative w-full">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder=" "
                                            value={form.password}
                                            onChange={e => setForm({ ...form, password: e.target.value })}
                                            className="peer w-full border-b-2 border-gray-300 focus:border-teal-500 text-sm pt-4 pb-1 pr-10 outline-none"
                                        />
                                        <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-teal-500 peer-focus:text-xs">
                                            Password
                                        </label>
                                        <span
                                            className="absolute top-2 right-0 pr-2 cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </span>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Password must be at least 8 characters long.
                                        </p>
                                    </div>

                                    <div className="relative w-full">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder=" "
                                            value={form.confirmPassword}
                                            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                            className="peer w-full border-b-2 border-gray-300 focus:border-teal-500 text-sm pt-4 pb-1 pr-10 outline-none"
                                        />
                                        <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-teal-500 peer-focus:text-xs">
                                            Confirm Password
                                        </label>
                                        <span
                                            className="absolute top-2 right-0 pr-2 cursor-pointer"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-sm cursor-pointer hover:bg-gray-100 transition-all font-medium text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleForm}
                        disabled={loading}
                        className="px-6 py-2 bg-teal-600 text-white rounded-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm flex items-center gap-2 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StaffModal;
