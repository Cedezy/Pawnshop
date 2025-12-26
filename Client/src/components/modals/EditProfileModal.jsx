import React from "react";
import { X } from "lucide-react";
import { formatDate } from '../../utils/FormatDate';

const EditProfileModal = ({
    isOpen,
    onClose,
    formData,
    customer,
    handleChange,
    handleSubmit,
    loading,
    error
}) => {
    if (!isOpen) return null;

    const disabledClass =
        "bg-gray-100 text-gray-500 cursor-not-allowed border-b-2 border-gray-200";

    const inputClass =
        "peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="bg-white rounded-sm shadow-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">

                {/* Header */}
                <div className="bg-yellow-500 px-6 py-5 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-medium text-white">Edit Profile</h2>
                        <p className="text-sm text-yellow-50">
                            Some information cannot be edited for security reasons.
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-yellow-600 p-1 rounded-full">
                        <X size={22} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-6 space-y-8">

                    {/* READ ONLY */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 mb-4">
                            PERSONAL INFORMATION (Read Only)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: "Full Name", value: `${customer.userId.firstname} ${customer.userId.middlename || ""} ${customer.userId.lastname}` },
                                { label: "Email", value: customer.userId.email },
                                { label: "Date of Birth", value: formatDate(customer.dateOfBirth) },
                                { label: "Sex", value: customer.sex },
                                { label: "Nationality", value: customer.nationality },
                                { label: "Civil Status", value: customer.civilStatus },
                                { label: "ID Type", value: customer.idType },
                                { label: "ID Number", value: customer.idNumber },
                                { label: "Account Status", value: customer.status },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <label className="text-xs text-gray-500">{label}</label>
                                    <input
                                        value={value || "-"}
                                        disabled
                                        className={`w-full ${disabledClass} text-sm pt-2 pb-1`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* EDITABLE */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 mb-4">
                            CONTACT & ADDRESS (Editable)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {["phone", "street", "barangay", "city", "province", "zipCode"].map((field) => (
                                <div key={field} className="relative">
                                    <input
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        placeholder=" "
                                        className={inputClass}
                                    />
                                    <label className="absolute left-0 -top-1 text-xs text-gray-500
                                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                                        peer-focus:top-0 peer-focus:text-xs peer-focus:text-yellow-500">
                                        {field.replace(/([A-Z])/g, " $1").toUpperCase()}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 border border-gray-300 rounded-sm text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-yellow-500 text-white rounded-sm disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
