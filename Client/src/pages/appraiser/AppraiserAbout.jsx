import React, { useState, useEffect } from "react";
import SidebarAppraiser from "../../components/ui/SidebarAppraiser";
import HeaderStaff from "../../components/ui/HeaderStaff";
import axios from "../../api/axios";

const AppraiserAbout = () => {
    const [loading, setLoading] = useState(true);
    const [aboutData, setAboutData] = useState([]);

    useEffect(() => {
        const fetchAbout = async () => {
            try{
                const response = await axios.get("/aboutUs", {
                    withCredentials: true
                });
                setAboutData(response.data.about[0]);
                   
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

    const Section = ({ title, value }) => {
        return (
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                    {title}
                </h4>

                <p className="text-gray-900 font-medium leading-relaxed whitespace-pre-line">

                    {value || "No content available"}
                </p>
            </div>
        );
    };


    return (
        <div className="h-screen flex overflow-hidden">
            <SidebarAppraiser />
            <div className="flex flex-col flex-1">
                <HeaderStaff />

                <div className="px-6 pb-4 flex flex-col gap-5 pt-4 h-screen overflow-hidden">
                    <div className='flex justify-center items-center'>
                        <span className='text-2xl tracking-tighter font-medium uppercase text-gray-700'>
                            ABOUT US
                        </span>
                    </div>
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
                        </div>

                        {/* Body */}
                        <div className="px-8 py-6">
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    <div className="mb-10">
                                        <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">
                                            MISSION & VISION
                                        </h3>

                                        <div className="grid grid-cols-2 gap-8">
                                            <Section title="Mission" value={aboutData.mission} />
                                            <Section title="Vision" value={aboutData.vision} />
                                        </div>

                                    </div>

                                    <div className="mb-10">
                                        <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">
                                            ORGANIZATIONAL STRUCTURE
                                        </h3>

                                        <Section
                                            title="Structure Description"
                                            value={aboutData.organizationStructure}
                                        />


                                    </div>

                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 text-sm text-gray-500">
                            These details are visible on the system’s “About Us” page.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppraiserAbout;
