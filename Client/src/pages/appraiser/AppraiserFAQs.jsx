import React, { useEffect, useState } from "react";
import SidebarAppraiser from "../../components/ui/SidebarAppraiser";
import HeaderStaff from "../../components/ui/HeaderStaff";
import axios from "../../api/axios";
import { HelpCircle } from "lucide-react";
import { formatDate } from "../../utils/FormatDate";

const AppraiserFAQs = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await axios.get("/faqs", {
                    withCredentials: true,
                });
                setFaqs(response.data.faqs || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    return (
        <div className="h-screen flex overflow-hidden">
            <SidebarAppraiser />
            <div className="flex flex-col flex-1">
                <HeaderStaff />

                <div className="px-6 pb-4 flex flex-col gap-5 h-screen pt-4 overflow-hidden">
                    <div className="flex justify-center items-center">
                        <span className="text-2xl tracking-tighter font-medium uppercase text-gray-700">
                            frequently asked questions
                        </span>
                    </div>

                    <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-y-auto">
                        {loading ? (
                            <p className="p-6">Loading...</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase">
                                            Question
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Answer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Posted on
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {faqs.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="text-center py-16">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                        <HelpCircle className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                        No FAQs available
                                                    </h3>
                                                    <p className="text-gray-500">
                                                        There are no frequently asked questions yet.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        faqs.map((faq) => (
                                            <tr key={faq._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-6 text-sm">
                                                    {faq.question}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    {faq.answer}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {formatDate(faq.createdAt)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppraiserFAQs;
