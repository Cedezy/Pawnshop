import React, { useState } from "react";
import { formatDate } from "../../utils/FormatDate";
import { getStatusClass } from "../../utils/UserStatus";
import { X, CreditCard } from 'lucide-react';

const CustomerModal = ({ isOpen, onClose, selectedUser, fetchTransactionHistory }) => {
    const [isIdOpen, setIsIdOpen] = useState(false);

    if (!isOpen || !selectedUser) return null;

    const {
        _id,
        status,
        sex,
        civilStatus,
        dateOfBirth,
        nationality,
        phone,
        zipCode,
        street,
        barangay,
        city,
        province,
        idType,
        idNumber,
        idExpiryDate,
        idPhotoUrl,
        userId
    } = selectedUser;

    const fullName = [userId?.firstname, userId?.middlename, userId?.lastname].filter(Boolean).join(" ");
    const address = [street, barangay, city, province].filter(Boolean).join(", ") || "N/A";
    const email = userId?.email || "N/A";

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-white rounded-sm shadow-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">

                <div className="bg-teal-600 px-6 py-4 flex justify-between items-center text-white">
                    <h2 className="text-lg font-medium">Customer Details</h2>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusClass(status)}`}>
                        {status}
                    </span>
                </div>

                <div className="px-8 py-6 overflow-y-auto">
                    <div className="mb-8">
                        <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">PERSONAL INFORMATION</h3>
                        <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">CUSTOMER ID</p>
                                <p className="text-gray-900 font-mono font-medium">CMR-{_id.slice(-6).toUpperCase()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">FULL NAME</p>
                                <p className="text-gray-900 font-medium">{fullName}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">SEX</p>
                                <p className="text-gray-900 font-medium">{sex || "Not Set"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">CIVIL STATUS</p>
                                <p className="text-gray-900 font-medium">{civilStatus || "Not Set"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">DATE OF BIRTH</p>
                                <p className="text-gray-900 font-medium">{formatDate(dateOfBirth)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">NATIONALITY</p>
                                <p className="text-gray-900 font-medium">{nationality || "Not Set"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">CONTACT INFORMATION</h3>
                        <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">CONTACT NUMBER</p>
                                <p className="text-gray-900 font-medium">{phone || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">EMAIL</p>
                                <p className="text-gray-900 font-medium">{email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">ZIP CODE</p>
                                <p className="text-gray-900 font-medium">{zipCode || "N/A"}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-500 text-sm mb-1">PERMANENT ADDRESS</p>
                                <p className="text-gray-900 font-medium">{address}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">IDENTIFICATION</h3>
                        <div className="grid grid-cols-4 gap-x-8 gap-y-6 items-center">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">ID TYPE</p>
                                <p className="text-gray-900 font-medium">{idType || "Not Set"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">ID NUMBER</p>
                                <p className="text-gray-900 font-medium">{idNumber || "Not Set"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">ID EXPIRY DATE</p>
                                <p className="text-gray-900 font-medium">{idExpiryDate ? formatDate(idExpiryDate) : "Not Set"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">ID PHOTO</p>
                                {idPhotoUrl ? (
                                    <button
                                        onClick={() => setIsIdOpen(true)}
                                        className="text-teal-600 text-sm underline cursor-pointer"
                                    >
                                        View ID
                                    </button>
                                ) : (
                                    <p className="text-gray-400 text-sm">No ID uploaded</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-4 border-t border-gray-300 flex justify-between sticky bottom-0 bg-white z-10">
                    <button
                        onClick={() => fetchTransactionHistory(selectedUser)}
                        className="px-5 py-2 bg-teal-600 text-gray-50 rounded-sm hover:bg-teal-700 font-medium text-sm ease-in-out duration-300 cursor-pointer"
                    >
                        Transaction History
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-sm cursor-pointer hover:bg-gray-100 ease-in-out duration-300 font-medium text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
            {isIdOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
                    <div className="bg-white rounded-sm shadow-md max-w-3xl w-full overflow-hidden animate-fade-in duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">
                                        Identification Document
                                    </h3>
                                </div>
                            </div>
                            
                            <button onClick={() => setIsIdOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-2 hover:bg-gray-100"
                                aria-label="Close modal">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Image Container */}
                        <div className="p-6 bg-gray-50">
                            <div className="relative bg-white rounded-lg shadow-inner border-2 border-gray-200 overflow-hidden">
                            
                                <img 
                                    src={idPhotoUrl} 
                                    alt="Identification Document" 
                                    className="w-full object-contain max-h-[60vh] transition-opacity duration-300"

                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-3 px-6 py-4 bg-white border-t border-gray-200">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Verified Document</span>
                            </div>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsIdOpen(false)}
                                    className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-sm cursor-pointer hover:bg-gray-100 ease-in-out duration-300 font-medium text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerModal;
