import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import axios from '../../api/axios';
import { Eye, EyeOff, FileBracesCorner } from 'lucide-react';
import { useToast } from "../../context/ToastContext"; 
import logo from '../../assets/logo.png';

const LoginStaff = () => {
    const [loginEmail, setLoginEmail] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [isForgotLoading, setIsForgotLoading] = useState(false);
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!loginEmail){
            showToast("Error", "All fields are required", "error");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailPattern.test(loginEmail.trim())){
            showToast("Error", "Please enter a valid email address", "error");
            return;
        }
        if(!password.trim()){
            showToast("Error", "Password is required", "error");
            return;
        }

        setIsLoginLoading(true);

        try{
            const response = await axios.post('/auth/login', { email: loginEmail, password }, { 
                withCredentials: true 
            });
            const { user } = response.data;

            showToast("Success", response.data.message, "success");

            setTimeout(() => {
                if(user.role === 'admin'){
                    navigate('/admin/dashboard');
                } 
                else if(user.role === 'appraiser'){
                    navigate('/appraiser/dashboard');
                } 
                else if(user.role === 'manager'){
                    navigate('/manager/dashboard');
                } 
                else{
                    navigate('/customer/dashboard');
                }
            }, 1000);

        } 
        catch(err){
            showToast("Error",  err.response?.data?.message, "error");
            setLoginEmail('');
            setPassword('');
            setIsLoginLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailPattern.test(forgotEmail.trim())) {
            showToast("Error",  "Please enter a valid email address", "error");
            return;
        }

        setIsForgotLoading(true);
        try{
            const response = await axios.post('/auth/forgot-password', { 
                email: forgotEmail 
            });
            showToast("Success", response.data.message, "success");
            localStorage.setItem("forgot_step", "otp");
            localStorage.setItem("forgot_email", forgotEmail);
            navigate('/forgot-password');
        } 
        catch(err){
            showToast("Error",  err.response?.data?.message, "error");
        } 
        finally {
            setIsForgotLoading(FileBracesCorner);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="flex max-w-5xl w-full bg-white md:rounded-lg md:shadow-lg overflow-hidden">
                
                <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-yellow-400 via-yellow-500 to-yellow-600 relative overflow-hidden">
                    <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                    <div className="absolute top-20 right-32 w-4 h-4 bg-white/20 rounded-full"></div>
                    <div className="absolute bottom-32 left-20 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute bottom-20 left-10 w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full"></div>

                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <line x1="0" y1="100" x2="400" y2="300" stroke="white" strokeWidth="1"/>
                            <line x1="100" y1="0" x2="300" y2="500" stroke="white" strokeWidth="1"/>
                            <line x1="200" y1="100" x2="400" y2="400" stroke="white" strokeWidth="1"/>
                        </svg>
                    </div>

                    <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
                        <div className="mb-8">
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <div className="w-4 h-4 bg-white rounded-full"></div>
                                </div>
                                <span className="text-md font-bold uppercase tracking-wider">F.A. Pawnshop</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-lg font-medium">Welcome back!</p>
                            <h1 className="text-5xl font-bold leading-tight tracking-tight">LOGIN<br/>TO YOUR ACCOUNT</h1>
                            <div className="w-12 h-1 bg-white"></div>
                            <p className="text-sm text-yellow-100 max-w-sm leading-relaxed">
                                Securely access your F.A. Pawnshop staff dashboard.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 px-2 md:p-12">
                    <div className="max-w-md mx-auto">
                        <div className="mb-8 text-center">
                            <img className='object-contain h-24 mx-auto' src={logo} alt="F.A. Pawnshop Logo" />
                            <h2 className="text-3xl font-semibold tracking-tighter text-gray-700 mt-4">User Login</h2>
                            <p className="text-gray-500 text-sm mt-1">Enter your credentials to continue</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        placeholder=" "
                                        className="peer w-full border-b-2 text-sm border-gray-300 pt-4 pb-1 outline-none focus:border-yellow-500"
                                    />

                                    <label
                                        className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                        peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-600 peer-focus:text-xs"
                                    >
                                        Email Address
                                    </label>
                                </div>

                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder=" "
                                      
                                        className="peer w-full border-b-2 text-sm border-gray-300 pt-4 pb-1 pr-8 outline-none focus:border-yellow-500"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <label
                                        className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                        peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-600 peer-focus:text-xs"
                                    >
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 top-4 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={keepSignedIn}
                                        onChange={(e) => setKeepSignedIn(e.target.checked)}
                                        className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                                    />
                                    <span className="text-gray-600">Keep me signed in</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setForgotEmail('');
                                        setShowForgotModal(true);
                                    }}
                                    className="text-yellow-500 hover:text-yellow-600 hover:underline cursor-pointer"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoginLoading}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-full ease-in-out duration-300 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoginLoading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-sm shadow-lg w-full max-w-md animate-fade-in flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold tracking-tight text-gray-700">Forgot Password?</h2>
                        </div>
                        <form onSubmit={handleForgotPassword} className="p-6 space-y-6">
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Enter the email address associated with your account.
                                We’ll send you a <span className="font-medium">one-time verification code </span>
                                to reset your password.
                            </p>

                            <div className="relative">
                                <input
                                    type="email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    placeholder=" "
                                    className="peer w-full border-b-2 text-sm border-gray-300 pt-4 pb-1 outline-none focus:border-yellow-500"
                                />

                                <label
                                    className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                    peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                    peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-600 peer-focus:text-xs"
                                >
                                    Email Address
                                </label>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isForgotLoading}
                                    className="w-full px-6 py-3 font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded-sm text-md ease-in-out duration-300 cursor-pointer disabled:opacity-50"
                                >
                                    {isForgotLoading ? 'Sending...' : 'Send OTP'}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400">
                                For security reasons, we won’t disclose whether an email exists in our system.
                            </p>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginStaff;
