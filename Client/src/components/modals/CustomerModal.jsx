import React, { useState } from "react";
import { formatDate } from "../../utils/FormatDate";
import { getStatusClass } from "../../utils/UserStatus";

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

                {isIdOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
                        <div className="bg-white p-4 rounded shadow-lg max-w-md w-full animate-fade-in">
                            <h3 className="font-medium mb-2 text-gray-700">Identification</h3>
                            <img src={idPhotoUrl} alt="ID Photo" className="w-full object-contain rounded" />
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setIsIdOpen(false)}
                                    className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-sm cursor-pointer hover:bg-gray-100 ease-in-out duration-300 font-medium text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerModal;
