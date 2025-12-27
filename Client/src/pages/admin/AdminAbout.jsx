import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../components/ui/SidebarAdmin";
import HeaderStaff from "../../components/ui/HeaderStaff";
import axios from "../../api/axios";
import { useToast } from "../../context/ToastContext"; 
import SkeletonAbout from "../../components/ui/SkeletonAbout";

const AdminAbout = () => {
    const [originalData, setOriginalData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [aboutData, setAboutData] = useState({
        mission: "",
        vision: "",
        organizationStructure: ""
    });
    const { showToast } = useToast();

    useEffect(() => {
        const fetchAbout = async () => {
            try{
                const response = await axios.get("/aboutUs", {
                    withCredentials: true
                });
                if(response.data?.about?.length){
                    setAboutData(response.data.about[0]);
                    setOriginalData(response.data.about[0]);
                }
            } 
            catch(err){
                console.error(err);
            } 
            finally {
                setLoading(false);
            }
        };
        fetchAbout();
    }, []);

    const handleChange = (e) => {
        setAboutData({ ...aboutData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try{
            setSaving(true);
            const response = await axios.put("/aboutUs", aboutData, {
                withCredentials: true
            });
            setOriginalData(aboutData);
            setIsEditing(false);
            showToast("Success", response.data.message, "success");
        } 
        catch(err){
            console.error(err);
        } 
        finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setAboutData(originalData);
        setIsEditing(false);
    };

    const Section = ({ title, name, rows = 5 }) => (
        <div>
            <p className="text-gray-500 text-sm mb-1">{title}</p>
            {isEditing ? (
                <textarea
                    name={name}
                    rows={rows}
                    value={aboutData[name] || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            ) : (
                <p className="text-gray-900 font-medium leading-relaxed whitespace-pre-line">
                    {aboutData[name] || "—"}
                </p>
            )}
        </div>
    );

    return (
        <div className="h-screen flex overflow-hidden">
            <SidebarAdmin />
            <div className="flex flex-col flex-1">
                <HeaderStaff />

                <div className="px-6 pb-4 flex flex-col gap-5 pt-4 h-screen overflow-hidden">
                    <div className='flex justify-center items-center'>
                        <span className='text-2xl tracking-tighter font-medium uppercase text-gray-700'>
                            ABOUT US
                        </span>
                    </div>
                    {loading ? (
                        <SkeletonAbout/>
                    ) : (
                         <div className="bg-white rounded-sm shadow-sm  overflow-y-auto">
                            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center text-gray-800">
                                <div>
                                    <h2 className="text-lg font-medium tracking-tight">
                                        About the Pawnshop
                                    </h2>
                                    <p className="text-sm opacity-90">
                                        Manage mission, vision, and organizational details
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
                            <div className="px-8 py-6">
                                <>
                                    <div className="mb-10">
                                        <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">
                                            MISSION & VISION
                                        </h3>

                                        <div className="grid grid-cols-2 gap-8">
                                            <Section title="Mission" name="mission" />
                                            <Section title="Vision" name="vision" />
                                        </div>
                                    </div>

                                    <div className="mb-10">
                                        <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">
                                            ORGANIZATIONAL STRUCTURE
                                        </h3>

                                        <Section
                                            title="Structure Description"
                                            name="organizationStructure"
                                            rows={8}
                                        />
                                    </div>

                                    {isEditing && (
                                        <div className="flex gap-3 pt-4 border-t border-gray-300">
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="px-6 py-2 cursor-pointer bg-teal-600 text-white rounded-sm hover:bg-teal-700 font-medium text-sm disabled:opacity-50"
                                            >
                                                {saving ? "Saving..." : "Save Changes"}
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
                            </div>

                            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 text-sm text-gray-500">
                                These details are visible on the system’s “About Us” page.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAbout;
