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
    Settings,
    User,
    UserCog,
    Sliders,
    LogOut 
} from "lucide-react";
import { useToast } from "../../context/ToastContext"; 
import axios from "../../api/axios";

const SidebarAdmin = () => {
    const [openAccount, setOpenAccount] = useState(false);
    const [openSystem, setOpenSystem] = useState(false);
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
        <aside className="w-72 h-screen text-gray-800 shadow-sm flex flex-col">
            <div className="flex flex-col items-center pt-6 pb-4 border-b border-gray-200">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                    <Coins size={40} className="text-gray-900" />
                </div>
                <h1 className="text-xl font-bold mt-3 text-yellow-600">Admin Panel</h1>
                <p className="text-xs text-gray-500 mt-1">Pawnshop Management</p>
                <button
                    onClick={handleSignOut} 
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
                    to="/admin/customers"
                    isActive={location.pathname === "/admin/customers"}
                    onClick={navigate}
                />
                <SidebarItem 
                    icon={Coins} 
                    label="Pawn" 
                    to="/admin/pawn"
                    isActive={location.pathname === "/admin/pawn"}
                    onClick={navigate}
                />
                <SidebarItem 
                    icon={Info} 
                    label="About Us" 
                    to="/admin/about"
                    isActive={location.pathname === "/admin/about"}
                    onClick={navigate}
                />
                <SidebarItem 
                    icon={Mail} 
                    label="Contact Us" 
                    to="/admin/contact"
                    isActive={location.pathname === "/admin/contact"}
                    onClick={navigate}
                />
                <SidebarItem 
                    icon={HelpCircle} 
                    label="FAQs" 
                    to="/admin/faqs"
                    isActive={location.pathname === "/admin/faqs"}
                    onClick={navigate}
                />

                {/* Account Settings */}
                <div className="pt-2">
                    <button 
                        onClick={() => setOpenAccount(!openAccount)}
                        className="flex items-center text-sm justify-between w-full px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
                    >
                        <div className="flex items-center gap-3">
                            <Settings size={20} className="text-gray-500 group-hover:text-yellow-600 transition-colors" />
                            <span className="font-medium text-gray-700 group-hover:text-yellow-600">Account Settings</span>
                        </div>
                        {openAccount ? <ChevronDown size={18} className="text-gray-500" /> : <ChevronRight size={18} className="text-gray-500" />}
                    </button>

                    {openAccount && (
                        <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-200 pl-2">
                            <SidebarItem 
                                icon={User} 
                                label="My Account" 
                                to="/admin/account"
                                isActive={location.pathname === "/admin/account"}
                                onClick={navigate}
                                small 
                            />
                            <SidebarItem 
                                icon={UserCog} 
                                label="Users Account" 
                                to="/admin/users"
                                isActive={location.pathname === "/admin/users"}
                                onClick={navigate}
                                small 
                            />
                        </div>
                    )}
                </div>

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
                                to="/admin/rate"
                                isActive={location.pathname === "/admin/rate"}
                                onClick={navigate}
                                small
                            />
                            <SidebarItem 
                                icon={Info} 
                                label="Gallery" 
                                to="/admin/gallery"
                                isActive={location.pathname === "/admin/gallery"}
                                onClick={navigate}
                                small
                            />
                        </div>
                    )}
                </div>

            </nav>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-gray-200">
                <p className="text-xs text-gray-7   00 text-center">© 2025 Pawnshop System</p>
            </div>
        </aside>
    );
};

export default SidebarAdmin;

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

