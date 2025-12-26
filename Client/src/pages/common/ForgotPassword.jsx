import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from "../../context/ToastContext";

const ForgotPassword = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']); 
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [isResending, setIsResending] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();
   
    const email = localStorage.getItem("forgot_email");
    useEffect(() => {
        if (!email) {
            navigate('/');
        }
    }, [email, navigate]);

    useEffect(() => {
        const storedTime = localStorage.getItem("otp_resend_time");
        if(storedTime){
            const remaining = Math.floor((+storedTime - Date.now()) / 1000);
            if(remaining > 0){
                setTimeout(() => setResendCooldown(remaining), 0);
            } 
            else{
                localStorage.removeItem("otp_resend_time");
            }
        }
    }, []);

    useEffect(() => {
        if(resendCooldown <= 0) return;

        const timer = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    localStorage.removeItem("otp_resend_time");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [resendCooldown]);

    
    const handleOtpChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalOtp = otp.join('');

        if(finalOtp.length !== 6){
            showToast("Error", "Please enter the complete OTP", "error");
            return;
        }

        if(newPassword !== confirmPassword){
            showToast("Error", "Password do not match!", "error");
            return;
        }

        try{
            const response = await axios.post('/auth/reset-password', {
                email,
                resetOtp: finalOtp,
                newPassword,
            });
            showToast("Success", response.data.message, "success");
            localStorage.removeItem("forgot_email");
            navigate('/');
        } 
        catch(err){
            showToast("Error", err.response?.data?.message, "error");
        }
    };

    const handleResendOtp = async () => {
        try {
            setIsResending(true);
            const response = await axios.post('/auth/forgot-password', { 
                email 
            });
            showToast("Success", response.data.message, "success");
            setOtp(['', '', '', '', '', '']);
            const expireTime = Date.now() + 120 * 1000; 
            localStorage.setItem("otp_resend_time", expireTime);
            setResendCooldown(120);
        } 
        catch(err){
            showToast("Error", err.response?.data?.message, "error");
        } 
        finally{
            setIsResending(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md shadow-sm rounded-md bg-white">   
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold tracking-tight text-gray-700">Reset Password</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6 ">

                    <p className="text-sm text-gray-500 text-center">
                        Please enter the <span className="font-medium">6-digit verification code</span> sent to your email and choose a new password.
                    </p>

                    <div className="flex justify-between gap-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(e.target.value, index)}
                                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                className="w-full text-center text-lg border-b-2 border-gray-300 
                                            outline-none focus:border-yellow-600"
                            />
                        ))}
                    </div>

                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder=" "
                            className="peer w-full border-b-2 text-sm border-gray-300 pt-4 pb-1 outline-none focus:border-yellow-500"
                        />
                        <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-600 peer-focus:text-xs">
                            New Password
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-0 top-4 text-gray-500 cursor-pointer"
                        >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                         <p className="text-xs text-gray-400 mt-1">
                            Use a strong password with at least 8 characters.
                        </p>
                    </div>

                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder=" "
                            className="peer w-full border-b-2 text-sm border-gray-300 pt-4 pb-1 outline-none focus:border-yellow-500"
                        />
                        <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-600 peer-focus:text-xs">
                            Confirm Password
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-0 top-4 text-gray-500 cursor-pointer"
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <p className="text-sm text-gray-400 text-center">
                        Didn’t receive the code?{" "}
                        <button
                            type="button"
                            disabled={resendCooldown > 0 || isResending}
                            onClick={handleResendOtp}
                            className={`font-medium cursor-pointer ${
                                resendCooldown > 0 || isResending
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-teal-600 hover:underline"
                            }`}
                        >
                            {isResending
                                ? "Resending..."
                                : resendCooldown > 0
                                    ? `Resend OTP in ${resendCooldown}s`
                                    : "Resend OTP"}
                        </button>
                    </p>
                    <div className="">
                        <button
                            type="submit"
                            className="w-full px-6 py-3 font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded-sm text-md ease-in-out duration-300 cursor-pointer disabled:opacity-50"
                        >
                            Reset Password
                        </button>
                    </div>
                </form>
                
            </div>
        </div>
    );
};

export default ForgotPassword;
