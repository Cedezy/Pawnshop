import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    ChevronDown, 
    ChevronRight,
    Users,
    Coins,
    Info,
    Mail,
    HelpCircle,
    User,
    Sliders,
    LogOut,
    X
} from "lucide-react";
import { useToast } from "../../context/ToastContext"; 
import axios from "../../api/axios";

const SidebarManager = () => {
    const [openSystem, setOpenSystem] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); 
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
        <aside className="w-72 h-screen bg-white text-gray-800 shadow-sm flex flex-col">
            <div className="flex flex-col items-center pt-6 pb-4 border-b border-gray-200">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                    <Coins size={40} className="text-gray-900" />
                </div>
                <h1 className="text-xl font-bold mt-3 text-yellow-600">Manager Panel</h1>
                <p className="text-xs text-gray-500 mt-1">Pawnshop Management</p>
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="mt-2 flex items-center gap-2 text-sm cursor-pointer bg-gray-200 text-gray-900 py-2 px-6 rounded-md hover:bg-gray-300 transition-all duration-300"
                >
                    <LogOut size={16} />
                    Sign out
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                <SidebarItem 
                    icon={Users} 
                    label="Customers" 
                    to="/manager/customers"
                    isActive={location.pathname === "/manager/customers"}
                    onClick={navigate}
                />
                <SidebarItem 
                    icon={Coins} 
                    label="Pawn" 
                    to="/manager/pawn"
                    isActive={location.pathname === "/manager/pawn"}
                    onClick={navigate}
                />
                <SidebarItem 
                    icon={Info} 
                    label="About Us" 
                    to="/manager/about"
                    isActive={location.pathname === "/manager/about"}
                    onClick={navigate}
                />
                <SidebarItem 
                    icon={Mail} 
                    label="Contact Us" 
                    to="/manager/contact"
                    isActive={location.pathname === "/manager/contact"}
                    onClick={navigate}
                />
                <SidebarItem 
                    icon={HelpCircle} 
                    label="FAQs" 
                    to="/manager/faqs"
                    isActive={location.pathname === "/manager/faqs"}
                    onClick={navigate}
                />
                <SidebarItem 
                    icon={User} 
                    label="My Account" 
                    to="/manager/account"
                    isActive={location.pathname === "/manager/account"}
                    onClick={navigate}
                />

                <div className="pt-2">
                    <button 
                        onClick={() => setOpenSystem(!openSystem)}
                        className="flex items-center text-sm justify-between w-full px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
                    >
                        <div className="flex items-center gap-3">
                            <Sliders size={20} className="text-gray-500 group-hover:text-yellow-600 transition-colors" />
                            <span className="font-medium text-gray-700 group-hover:text-yellow-600">
                                System Settings
                            </span>
                        </div>
                        {openSystem 
                            ? <ChevronDown size={18} className="text-gray-500" /> 
                            : <ChevronRight size={18} className="text-gray-500" />
                        }
                    </button>

                    {openSystem && (
                        <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-200 pl-2">
                            <SidebarItem 
                                icon={Coins} 
                                label="Rates & Charges" 
                                to="/manager/rate"
                                isActive={location.pathname === "/manager/rate"}
                                onClick={navigate}
                                small
                            />
                            <SidebarItem 
                                icon={Info} 
                                label="Gallery" 
                                to="/manager/gallery"
                                isActive={location.pathname === "/manager/gallery"}
                                onClick={navigate}
                                small
                            />
                        </div>
                    )}
                </div>
            </nav>

            <div className="px-4 py-4 border-t border-gray-200">
                <p className="text-xs text-gray-400 text-center">© 2025 Pawnshop System</p>
            </div>

            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div  className="bg-white rounded-sm shadow-md w-full max-w-md p-6 animate-fade-in"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
                                    <LogOut className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Sign Out
                                    </h2>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Are you sure you want to sign out of your account? You'll need to log in again to access your data.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-sm shadow-sm cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 ease-in-out duration-300"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    setShowLogoutModal(false);
                                    handleSignOut();
                                }}
                                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-sm bg-red-600 cursor-pointer text-white hover:bg-red-700 active:bg-red-800 ease-in-out duration-300 shadow-sm"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default SidebarManager;

const SidebarItem = ({ icon: Icon, label, to, small, isActive, onClick }) => {
    return (
        <a
            href={to}
            onClick={(e) => { e.preventDefault(); onClick(to); }}
            className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all duration-200 group ${
                isActive ? "bg-yellow-500 text-gray-900 shadow-md" : "hover:bg-gray-100"
            } ${small ? "text-sm py-2" : ""}`}
        >
            <Icon size={small ? 18 : 20} className={`${isActive ? "text-gray-900" : "text-gray-500 group-hover:text-yellow-600"} transition-colors`} />
            <span className={`font-medium ${isActive ? "text-gray-900" : ""}`}>{label}</span>
        </a>
    );
};

