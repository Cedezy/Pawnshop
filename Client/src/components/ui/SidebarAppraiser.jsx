import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    Users,
    Coins,
    Info,
    Mail,
    HelpCircle,
    User,
    Sliders,
    LogOut 
} from "lucide-react";
import { useToast } from "../../context/ToastContext"; 
import axios from "../../api/axios";

const SidebarAppraiser = () => {
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
                <h1 className="text-xl font-bold mt-3 text-yellow-600">Appraiser Panel</h1>
                <p className="text-xs text-gray-500 mt-1">Pawnshop Management</p>
                <button
                    onClick={handleSignOut} 
                    className="mt-2 flex items-center gap-2 text-sm cursor-pointer bg-gray-100 text-gray-900 py-2 px-6 rounded-md hover:bg-gray-200 transition-all duration-300"
                >
                    <LogOut size={16} />
                    Sign out
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                <SidebarItem 
                    icon={Users} 
                    label="Customers" 
                    to="/appraiser/customers"
                    isActive={location.pathname === "/appraiser/customers"}
                    onClick={navigate}
                />
                <SidebarItem 
                    icon={Coins} 
                    label="Pawn" 
                    to="/appraiser/pawn"
                    isActive={location.pathname === "/appraiser/pawn"}
                    onClick={navigate}
                />
                <SidebarItem 
                    icon={Info} 
                    label="About Us" 
                    to="/appraiser/about"
                    isActive={location.pathname === "/appraiser/about"}
                    onClick={navigate}
                />
                <SidebarItem 
                    icon={Mail} 
                    label="Contact Us" 
                    to="/appraiser/contact"
                    isActive={location.pathname === "/appraiser/contact"}
                    onClick={navigate}
                />
                <SidebarItem 
                    icon={HelpCircle} 
                    label="FAQs" 
                    to="/appraiser/faqs"
                    isActive={location.pathname === "/appraiser/faqs"}
                    onClick={navigate}
                />
                <SidebarItem 
                    icon={User} 
                    label="My Account" 
                    to="/appraiser/account"
                    isActive={location.pathname === "/appraiser/account"}
                    onClick={navigate}
                />

                <SidebarItem 
                    icon={Sliders} 
                    label="System Settings" 
                    to="/appraiser/rate"
                    isActive={location.pathname === "/appraiser/system-settings"}
                    onClick={navigate}
                />
            </nav>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-gray-200">
                <p className="text-xs text-gray-400 text-center">© 2025 Pawnshop System</p>
            </div>
        </aside>
    );
};

export default SidebarAppraiser;

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

