import React, { useState } from 'react';
import logo from '../../assets/logo.png'
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from '../../api/axios';
import {
    Menu, 
    X,
    LogOut
} from 'lucide-react';
import { useToast } from "../../context/ToastContext"; 

const HeaderCustomer = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSignOut = async () => {
        try {
            await axios.post('/auth/logout', {}, { withCredentials: true });
            showToast("Success", "Logged out successfully!", "success");
            navigate('/'); // redirect to login page
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to logout";
            showToast("Error", msg);
        }
    };

    return (
        <div className="shadow-sm">
            <div className="bg-linear-to-r from-teal-500 via-teal-600 to-teal-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between md:justify-center py-4">
                        <div className="flex items-center gap-4">
                            <img 
                                src={logo} 
                                alt="F.A. Pawnshop Logo" 
                                className="h-16 w-16 md:h-24 md:w-24 object-contain rounded-full shadow-lg ring-4 ring-white/30" 
                            />
                            <div className="flex flex-col">
                                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white tracking-tight uppercase">
                                    F.A. Pawnshop Management System
                                </h1>
                               
                                <p className="hidden sm:block text-md text-yellow-50 font-medium">
                                    Warlito Pulmones 7016, Pagadian City, Zamboanga del Sur
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6 text-white" />
                            ) : (
                                <Menu className="h-6 w-6 text-white" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <nav className="hidden md:block bg-white border-b border-gray-200">
                <div className="flex justify-between">
                    <div className="flex-1 flex items-center justify-center gap-1">
                        <NavLink
                            to="/customer/my-pawn"
                            className={({ isActive }) =>
                                `px-6 py-4 text-sm font-semibold transition-all duration-200 border-b-2
                                ${isActive
                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-500'
                                    : 'text-gray-700 border-transparent hover:text-yellow-600 hover:bg-yellow-50 hover:border-yellow-500'
                                }`
                            }
                        >
                            MY PAWN
                        </NavLink>

                        <NavLink to="/customer/about-us" className={({ isActive }) =>
                            `px-6 py-4 text-sm font-semibold transition-all duration-200 border-b-2
                            ${isActive
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-500'
                                : 'text-gray-700 border-transparent hover:text-yellow-600 hover:bg-yellow-50 hover:border-yellow-500'
                            }`
                        }>
                            ABOUT US
                        </NavLink>

                        <NavLink to="/customer/contact-us" className={({ isActive }) =>
                            `px-6 py-4 text-sm font-semibold transition-all duration-200 border-b-2
                            ${isActive
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-500'
                                : 'text-gray-700 border-transparent hover:text-yellow-600 hover:bg-yellow-50 hover:border-yellow-500'
                            }`
                        }>
                            CONTACT US
                        </NavLink>

                        <NavLink to="/customer/faqs" className={({ isActive }) =>
                            `px-6 py-4 text-sm font-semibold transition-all duration-200 border-b-2
                            ${isActive
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-500'
                                : 'text-gray-700 border-transparent hover:text-yellow-600 hover:bg-yellow-50 hover:border-yellow-500'
                            }`
                        }>
                            FAQs
                        </NavLink>

                        <NavLink to="/customer/account" className={({ isActive }) =>
                            `px-6 py-4 text-sm font-semibold transition-all duration-200 border-b-2
                            ${isActive
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-500'
                                : 'text-gray-700 border-transparent hover:text-yellow-600 hover:bg-yellow-50 hover:border-yellow-500'
                            }`
                        }>
                            MY ACCOUNT
                        </NavLink>
                    </div>
                    <div className='flex justify-center items-center'>
                        <button onClick={handleSignOut} className="text-sm font-semibold flex justify-center items-center gap-1 mr-6 px-4 py-2 cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-sm ease-in-out duration-300">
                            <LogOut className='w-4 h-4'/>
                            LOGOUT
                        </button>
                    </div>

                </div>
            </nav>

            {mobileMenuOpen && (
                <nav className="md:hidden bg-white border-b border-gray-200 shadow-lg">
                    <div className="px-4 py-2 space-y-1">

                        <NavLink
                            to="/customer/my-pawn"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                ${isActive
                                    ? 'bg-yellow-50 text-yellow-700'
                                    : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'
                                }`
                            }
                        >
                            My Pawn
                        </NavLink>

                        <NavLink
                            to="/customer/about-us"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                ${isActive
                                    ? 'bg-yellow-50 text-yellow-700'
                                    : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'
                                }`
                            }
                        >
                            About Us
                        </NavLink>

                        <NavLink
                            to="/customer/contact-us"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                ${isActive
                                    ? 'bg-yellow-50 text-yellow-700'
                                    : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'
                                }`
                            }
                        >
                            Contact Us
                        </NavLink>

                        <NavLink
                            to="/customer/faqs"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                ${isActive
                                    ? 'bg-yellow-50 text-yellow-700'
                                    : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'
                                }`
                            }
                        >
                            FAQs
                        </NavLink>

                        <NavLink
                            to="/customer/account"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                ${isActive
                                    ? 'bg-yellow-50 text-yellow-700'
                                    : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'
                                }`
                            }
                        >
                            My Account
                        </NavLink>

                    </div>
                </nav>
            )}

        </div>
    );
};

export default HeaderCustomer;