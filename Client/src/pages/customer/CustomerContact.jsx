import React, { useState, useEffect } from "react";
import HeaderCustomer from "../../components/ui/HeaderCustomer";
import axios from "../../api/axios";

const CustomerContact = () => {
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const response = await axios.get("/contactUs");
                if (response.data) {
                    setContact(response.data);
                }
            } catch (error) {
                console.error("Failed to load contact info", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContactInfo();
    }, []);

    const Field = ({ label, value }) => (
        <div>
            <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
            <p className="text-gray-900 font-medium">
                {value || "—"}
            </p>
        </div>
    );

    return (
        <div className="h-screen flex flex-col">
            <HeaderCustomer />
            <div className="flex-1 overflow-y-auto md:px-6 pb-4 md:pt-4">
                <div className="bg-white mx-auto md:max-w-7xl p-6 flex flex-col gap-5">
                    <div className="bg-white rounded-sm shadow-sm overflow-y-auto">
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 text-gray-800">
                            <h2 className="text-lg font-medium tracking-tight">
                                Pawnshop Contact Information
                            </h2>
                            <p className="text-sm opacity-90">
                                Get in touch with us using the details below
                            </p>
                        </div>
                        <div className="px-8 py-6">
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    <div className="mb-10">
                                        <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">
                                            GENERAL INFORMATION
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <Field label="Shop Name" value={contact.shopName} />
                                            <Field label="Business Hours" value={contact.businessHours} />
                                        </div>
                                    </div>

                                    <div className="mb-10">
                                        <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">
                                            CONTACT DETAILS
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <Field label="Phone Number" value={contact.phone} />
                                            <Field label="Email Address" value={contact.email} />
                                            <Field label="Facebook Page" value={contact.facebook} />
                                            <Field label="Address" value={contact.address} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 text-sm text-gray-500">
                            This information is provided to help customers contact the pawnshop.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerContact;
