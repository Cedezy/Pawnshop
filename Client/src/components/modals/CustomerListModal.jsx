import React, { useState } from "react";
import { X, Search, User, Mail, Phone } from "lucide-react";

const CustomerListModal = ({ isOpen, onClose, customers, onSelect }) => {
    const [searchQuery, setSearchQuery] = useState("");

    if (!isOpen) return null;

    const filteredCustomers = customers.filter((c) => {
        const fullName = `${c.userId?.firstname || ""} ${c.userId?.lastname || ""}`.toLowerCase();
        const email = (c.userId?.email || "").toLowerCase();
        const phone = (c.userId?.phone || "").toLowerCase();
        const query = searchQuery.toLowerCase();
        
        return fullName.includes(query) || email.includes(query) || phone.includes(query);
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-sm shadow-lg w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-fade-in">
                <div className="bg-teal-600 px-6 py-5 flex items-center justify-between">
                    <h2 className="text-xl font-medium text-gray-50">Select Customer</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-teal-700 rounded-full p-1 transition-colors duration-200 cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none text-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {filteredCustomers.length === 0 ? (
                        <div className="text-center py-12">
                            <User size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm">No customers found</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredCustomers.map((c) => (
                                <div
                                    key={c._id}
                                    onClick={() => {
                                        onSelect(c);
                                        onClose();
                                    }}
                                    className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-all duration-200 group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                                                    <User size={16} className="text-teal-600" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900 text-sm">
                                                    {c.userId?.firstname} {c.userId?.lastname}
                                                </h3>
                                            </div>
                                            
                                            <div className="space-y-1 ml-10">
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Mail size={14} className="text-gray-400" />
                                                    <span>{c.userId?.email || "No email"}</span>
                                                </div>
                                                {c.phone && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                        <Phone size={14} className="text-gray-400" />
                                                        <span>{c.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="text-xs font-medium text-teal-600">Select →</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} found
                    </p>
                    <button
                        onClick={onClose}
                        className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-sm cursor-pointer hover:bg-gray-100 ease-in-out duration-300 font-medium text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerListModal;