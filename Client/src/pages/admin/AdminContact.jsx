import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../components/ui/SidebarAdmin";
import HeaderStaff from "../../components/ui/HeaderStaff";
import axios from "../../api/axios";
import { useToast } from "../../context/ToastContext"; 

const AdminContact = () => {
    const [form, setForm] = useState({
        shopName: "",
        address: "",
        phone: "",
        email: "",
        businessHours: "",
        facebook: ""
    });
    const [originalForm, setOriginalForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchContactInfo = async () => {
            try{
                const response = await axios.get("/contactUs");
                if(response.data){
                    setForm(response.data);
                    setOriginalForm(response.data);
                }
            } 
            catch(error){
                console.error("Failed to load contact info", error);
            } 
            finally {
                setLoading(false);
            }
        };
        fetchContactInfo();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try{
            const response = await axios.put("/contactUs", form);
            setOriginalForm(form);
            setIsEditing(false);
            showToast("Success", response.data.message, "success");
        }
        catch(error){
            console.log("Failed to save contact info", error);
        }
    };

    const handleCancel = () => {
        setForm(originalForm);
        setIsEditing(false);
    };

    const Field = ({ label, name, colSpan = 1 }) => (
        <div className={colSpan > 1 ? `col-span-${colSpan}` : ""}>
            <p className="text-gray-500 text-sm mb-1">{label}</p>
            {isEditing ? (
                <input
                    name={name}
                    value={form[name] || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            ) : (
                <p className="text-gray-900 font-medium">
                    {form[name] || "—"}
                </p>
            )}
        </div>
    );

    return (
         <div className="h-screen flex overflow-hidden"> 
            <SidebarAdmin/>  
            <div className="flex flex-col flex-1">
                <HeaderStaff/>
                <div className="px-6 pb-4 flex flex-col gap-5 h-screen pt-4 overflow-hidden">
                    <div className='flex justify-center items-center'>
                        <span className='text-2xl tracking-tighter font-medium uppercase text-gray-700'>
                            CONTACT US
                        </span>
                    </div>
                    <div className="bg-white rounded-sm shadow-sm overflow-y-auto">

                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center text-gray-800">
                            <div>
                                <h2 className="text-lg font-medium">
                                    Pawnshop Contact Information
                                </h2>
                                <p className="text-sm opacity-90">
                                    Manage the public contact details displayed to customers
                                </p>
                            </div>

                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-sm cursor-pointer hover:bg-gray-50 hover:border-gray-400"
                                >
                                    EDIT
                                </button>
                            )}
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
                                            <Field label="Shop Name" name="shopName" />
                                            <Field label="Phone Number" name="phone" />
                                            <Field label="Email Address" name="email" />
                                            <Field
                                                label="Business Hours"
                                                name="businessHours"
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
                                                name="address"
                                            
                                            />
                                            <Field
                                                label="Facebook Page"
                                                name="facebook"
                                                
                                            />
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="flex gap-3 pt-4 border-t border-gray-300">
                                            <button
                                                onClick={handleSave}
                                                className="px-6 py-2 bg-teal-600 cursor-pointer text-white rounded-sm hover:bg-teal-700 font-medium text-sm"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-sm cursor-pointer hover:bg-gray-100 ease-in-out duration-300 font-medium text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
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

export default AdminContact;
