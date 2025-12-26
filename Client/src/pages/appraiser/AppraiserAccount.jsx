import React, { useEffect, useState } from "react";
import SidebarAppraiser from "../../components/ui/SidebarAppraiser";
import HeaderStaff from "../../components/ui/HeaderStaff";
import axios from "../../api/axios";
import ChangePasswordModal from "../../components/modals/ChangePasswordModal";

const AppraiserAccount = () => {
    const [manager, setManager] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const fetchManager = async () => {
        const res = await axios.get("/user/me", {
            withCredentials: true,
        });
        setManager(res.data.user);
    };

  
    useEffect(() => {
        const fetchData = () => {
            fetchManager();
        }
        fetchData();
    }, []);


    if (!manager) return <div>Loading...</div>;

    return (
        <div className="h-screen flex overflow-hidden">
            <SidebarAppraiser />
            <div className="flex flex-col flex-1">
                <HeaderStaff />

                <div className="px-6 pb-4 gap-5 h-screen pt-4 overflow-hidden">
                    <div className="bg-white mx-auto overflow-hidden">

                        {/* Header */}
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 text-gray-800">
                            <h2 className="text-lg font-medium">My Account</h2>
                            <p className="text-sm opacity-90">
                                View your account information and update your password
                            </p>
                        </div>

                        {/* Body */}
                        <div className="px-8 py-6">

                            {/* Account Info */}
                            <div className="mb-10">
                                <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">
                                    ACCOUNT INFORMATION
                                </h3>

                                <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">USER ID</p>
                                        <p className="text-gray-900 font-mono font-medium">
                                            MGR-{manager._id.slice(-6).toUpperCase()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">FIRST NAME</p>
                                        <p className="text-gray-900 font-medium">{manager.firstname}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">MIDDLE NAME</p>
                                        <p className="text-gray-900 font-medium">
                                            {manager.middlename || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">LAST NAME</p>
                                        <p className="text-gray-900 font-medium">{manager.lastname}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">EMAIL ADDRESS</p>
                                        <p className="text-gray-900 font-medium">{manager.email}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">ACCOUNT STATUS</p>
                                        <p className="text-gray-900 font-medium">
                                            {manager.isActive ? "Active" : "Inactive"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Security Section */}
                            <div>
                                <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">
                                    SECURITY SETTINGS
                                </h3>

                                <p className="text-sm text-gray-500 mb-4 max-w-2xl">
                                    For your account’s security, it is recommended to update your password
                                    regularly. Do not share your password with anyone.
                                </p>

                                <button
                                    onClick={() => setOpenModal(true)}
                                    className="px-6 py-2 bg-teal-600 text-white rounded-sm hover:bg-teal-700 font-medium text-sm"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 text-sm text-gray-500">
                            This account has manager-level access to the system.
                        </div>
                    </div>
                </div>
            </div>

            <ChangePasswordModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
            />
        </div>
    );
};

export default AppraiserAccount;
