import React, { useEffect, useState } from "react";
import HeaderCustomer from "../../components/ui/HeaderCustomer";
import axios from "../../api/axios";
import EditProfileModal from "../../components/modals/EditProfileModal";
import ChangePasswordModal from "../../components/modals/ChangePasswordModal";
import { formatDate } from '../../utils/FormatDate';
import { useToast } from "../../context/ToastContext"; 
import SkeletonAccount from "../../components/ui/SkeletonAccount";
import NotAllowed from "../../components/ui/NotAllowed";

const CustomerAccount = () => {
    const [customer, setCustomer] = useState(null);
    const [formData, setFormData] = useState({
        phone: '',
        street: '',
        barangay: '',
        city: '',
        province: '',
        zipCode: ''
    });
    const [loading, setLoading] = useState(true);       // page load
    const [saving, setSaving] = useState(false);        // form submit
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [passwordModal, setPasswordModal] = useState(false);
    const { showToast } = useToast();

    const fetchCustomer = async () => {
        try {
            const response = await axios.get("/customer/my-profile", { 
                withCredentials: true 
            });
            setCustomer(response.data);

            setFormData({
                phone: response.data.phone || '',
                street: response.data.street || '',
                barangay: response.data.barangay || '',
                city: response.data.city || '',
                province: response.data.province || '',
                zipCode: response.data.zipCode || ''
            });
        } 
        catch(err){
            console.error(err);
        }
        finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomer();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try{
            const response = await axios.put("/customer/update", formData, { 
                withCredentials: true 
            });
            setCustomer(prev => ({ ...prev, ...formData }));
            setIsModalOpen(false);
            showToast("Success", response.data.message, "success");
        } 
        catch(err){
            console.error(err);
            showToast("Error",  err.response?.data?.message, "error");
        } 
        finally {
            setSaving(false);
        }
    };

    const fullName = customer
        ? `${customer.userId.firstname} ${customer.userId.middlename || ""} ${customer.userId.lastname}`.trim()
        : "";


    return (
        <div className="h-screen flex flex-col">
            <HeaderCustomer />
            <div className="flex-1 overflow-y-auto md:px-6 pb-4 md:pt-4">
                <div className="bg-white mx-auto md:max-w-7xl p-6 flex flex-col gap-5">
                    {loading ? (
                       <SkeletonAccount/>
                    ) : (
                        <>
                             <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center text-gray-800">
                                <div>
                                    <h2 className="text-lg font-medium">My Account</h2>
                                    <p className="text-sm opacity-90">
                                        View your account information and update your profile
                                    </p>
                                </div>
                                <div>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="px-6 py-2 bg-teal-600 text-white rounded-sm hover:bg-teal-700 font-medium text-sm cursor-pointer ease-in-out duration-300"
                                    >
                                        EDIT PROFILE
                                    </button>
                                </div>
                            </div>

                            <div className="p-2 md:p-6">
                                <div className="mb-10">
                                    <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">
                                        ACCOUNT INFORMATION
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">
                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">CUSTOMER ID</p>
                                            <p className="text-gray-900 font-mono font-medium">
                                                CUST-{customer._id.slice(-6).toUpperCase()}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">FULL NAME</p>
                                            <p className="text-gray-900 font-medium">{fullName}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">EMAIL ADDRESS</p>
                                            <p className="text-gray-900 font-medium">{customer.userId.email}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">PHONE</p>
                                            <p className="text-gray-900 font-medium">{customer.phone || '-'}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">DATE OF BIRTH</p>
                                            <p className="text-gray-900 font-medium">{formatDate(customer.dateOfBirth) || '-'}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">NATIONALITY</p>
                                            <p className="text-gray-900 font-medium">{customer.nationality || '-'}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">CIVIL STATUS</p>
                                            <p className="text-gray-900 font-medium">{customer.civilStatus || '-'}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">SEX</p>
                                            <p className="text-gray-900 font-medium">{customer.sex || '-'}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">STATUS</p>
                                            <p className="text-gray-900 font-medium">{customer.status || '-'}</p>
                                        </div>

                                        <div className="md:col-span-2">
                                            <p className="text-gray-500 text-sm mb-1">ADDRESS</p>
                                            <p className="text-gray-900 font-medium">
                                                {`${customer.street || '-'}, ${customer.barangay || '-'}, ${customer.city || '-'}, ${customer.province || '-'} ${customer.zipCode || ''}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">
                                        SECURITY SETTINGS
                                    </h3>

                                    <p className="text-sm text-gray-500 mb-4 max-w-2xl">
                                        For your account’s security, it is recommended to update your password regularly. Do not share your password with anyone.
                                    </p>

                                    <button
                                        onClick={() => setPasswordModal(true)}
                                        className="px-6 py-2 bg-teal-600 text-white rounded-sm hover:bg-teal-700 font-medium text-sm cursor-pointer ease-in-out duration-300"
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 text-sm text-gray-500">
                                This account has customer-level access to the system.
                            </div>
                        </>
                    )}
                </div>
            
            </div>

            <EditProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                formData={formData}
                customer={customer}   
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                loading={saving}
                error={error}
            />

            <ChangePasswordModal
                isOpen={passwordModal}
                onClose={() => setPasswordModal(false)}
            />
        </div>
    );
};

export default CustomerAccount;
