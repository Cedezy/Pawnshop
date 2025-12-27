import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/ui/SidebarAdmin';
import HeaderStaff from '../../components/ui/HeaderStaff';
import axios from '../../api/axios';
import ChangePasswordModal from '../../components/modals/ChangePasswordModal';
import NotAllowed from '../../components/ui/NotAllowed';
import SkeletonAccount from '../../components/ui/SkeletonAccount';

const AdminAccount = () => {
    const [admin, setAdmin] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const fetchAdmin = async () => {
        try{
            const response = await axios.get('/user/me', { 
                withCredentials: true 
            });
            setAdmin(response.data.user);
        }
        catch(err){
            console.log(err);
        }
        finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = () => {
            fetchAdmin();
        };
        fetchData();
    }, []);

    if(!loading && (!admin || admin.role !== "admin")){
        return <NotAllowed />;
    }

    return (
        <div className="h-screen flex overflow-hidden"> 
            <SidebarAdmin/>  
            <div className="flex flex-col flex-1">
                <HeaderStaff/>
                <div className="px-6 pb-4 gap-5 h-screen pt-4 overflow-hidden">
                    {loading ? (
                        <SkeletonAccount/>
                    ) : (
                        <div className="bg-white mx-auto overflow-hidden">
                            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center text-gray-800">
                                <div>
                                    <h2 className="text-lg font-medium">My Account</h2>
                                    <p className="text-sm opacity-90">
                                        Manage your administrator profile and security settings
                                    </p>
                                </div>
                            </div>

                            <div className="px-8 py-6">
                                <div className="mb-10">
                                    <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">
                                        ACCOUNT INFORMATION
                                    </h3>

                                    <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">USER ID</p>
                                            <p className="text-gray-900 font-mono font-medium">
                                                ADM-{admin._id.slice(-6).toUpperCase()}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">FIRST NAME</p>
                                            <p className="text-gray-900 font-medium">{admin.firstname}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">MIDDLE NAME</p>
                                            <p className="text-gray-900 font-medium">{admin.middlename || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">LAST NAME</p>
                                            <p className="text-gray-900 font-medium">{admin.lastname}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">EMAIL ADDRESS</p>
                                            <p className="text-gray-900 font-medium">{admin.email}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">ACCOUNT STATUS</p>
                                            <p className="text-gray-900 font-medium">
                                                {admin.isActive ? 'Active' : 'Inactive'}
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
                                        regularly. Your password must be kept confidential and should not be
                                        shared with anyone.
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
                                This account has full administrative access to the system.
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ChangePasswordModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
            />
        </div>
    );
};

export default AdminAccount;
