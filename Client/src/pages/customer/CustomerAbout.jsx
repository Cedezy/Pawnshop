import React, { useEffect, useState } from "react";
import HeaderCustomer from "../../components/ui/HeaderCustomer";
import axios from "../../api/axios";

const CustomerAbout = () => {
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const response = await axios.get("/aboutUs", { withCredentials: true });
                if (response.data?.about?.length) {
                    setAboutData(response.data.about[0]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAbout();
    }, []);

    const Section = ({ title, value }) => (
        <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
            <p className="text-gray-900 font-medium leading-relaxed whitespace-pre-line">
                {value || "No content available"}
            </p>
        </div>
    );

    return (
        <div className="h-screen flex flex-col">
            <HeaderCustomer />
            <div className="flex-1 overflow-y-auto md:px-6 pb-4 md:pt-4">
                <div className="mx-auto md:max-w-7xl p-6 flex flex-col gap-5">
                    <div className="bg-white rounded-sm shadow-sm overflow-y-auto">
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 text-gray-800">
                            <div>
                                <h2 className="text-lg font-medium tracking-tight">
                                    About the Pawnshop
                                </h2>
                                <p className="text-sm opacity-90">
                                    Learn our mission, vision, and organizational details
                                </p>
                            </div>
                        </div>

                        <div className="px-8 py-6">
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    <div className="mb-10">
                                        <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">
                                            MISSION & VISION
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 text-sm text-gray-500">
                            These details are visible on the system’s “About Us” page.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerAbout;
