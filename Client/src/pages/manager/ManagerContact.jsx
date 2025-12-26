import React, { useEffect, useState } from "react";
import SidebarManager from "../../components/ui/SidebarManager";
import HeaderStaff from "../../components/ui/HeaderStaff";
import axios from "../../api/axios";

const ManagerContact = () => {
    const [contact, setContact] = useState({});
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

    const Field = ({ label, value, colSpan = 1 }) => (
        <div className={colSpan > 1 ? `col-span-${colSpan}` : ""}>
            <p className="text-gray-500 text-sm mb-1">{label}</p>
            <p className="text-gray-900 font-medium">
                {value || "—"}
            </p>
        </div>
    );

    return (
        <div className="h-screen flex overflow-hidden">
            <SidebarManager />
            <div className="flex flex-col flex-1">
                <HeaderStaff />

                <div className="px-6 pb-4 flex flex-col gap-5 h-screen pt-4 overflow-hidden">
                    <div className="flex justify-center items-center">
                        <span className="text-2xl tracking-tighter font-medium uppercase text-gray-700">
                            CONTACT US
                        </span>
                    </div>

                    <div className="bg-white rounded-sm shadow-sm overflow-y-auto">
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 text-gray-800">
                            <h2 className="text-lg font-medium">
                                Pawnshop Contact Information
                            </h2>
                            <p className="text-sm opacity-90">
                                Public contact details of the pawnshop
                            </p>
                        </div>

                        {/* Body */}
                        <div className="px-8 py-6">
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    <div className="mb-10">
                                        <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">
                                            SHOP DETAILS
                                        </h3>

                                        <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                                            <Field label="Shop Name" value={contact.shopName} />
                                            <Field label="Phone Number" value={contact.phone} />
                                            <Field label="Email Address" value={contact.email} />
                                            <Field
                                                label="Business Hours"
                                                value={contact.businessHours}
                                                colSpan={2}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-10">
                                        <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">
                                            LOCATION & ONLINE PRESENCE
                                        </h3>

                                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                            <Field
                                                label="Complete Address"
                                                value={contact.address}
                                            />
                                            <Field
                                                label="Facebook Page"
                                                value={contact.facebook}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 text-sm text-gray-500">
                            These details are visible on the system’s “Contact Us” section.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerContact;
