import React, { useEffect, useState } from "react";
import HeaderCustomer from "../../components/ui/HeaderCustomer";
import axios from "../../api/axios";

const CustomerFAQs = () => {
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
        <div className="h-screen flex flex-col">
            <HeaderCustomer />
            <div className="flex-1 overflow-y-auto md:px-6 pb-4 md:pt-4">
                <div className="bg-white mx-auto md:max-w-7xl p-6 flex flex-col gap-5">

                    {/* Card */}
                    <div className="bg-white rounded-sm shadow-sm overflow-y-auto">

                        {/* Card Header */}
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 text-gray-800">
                            <h2 className="text-lg font-medium tracking-tight">
                                Customer Support & Information
                            </h2>
                            <p className="text-sm opacity-90">
                                Answers to common questions about our pawnshop services
                            </p>
                        </div>

                        {/* Body */}
                        <div className="px-8 py-6">
                            {loading ? (
                                <p>Loading...</p>
                            ) : faqs.length === 0 ? (
                                <p className="text-gray-500">No FAQs available.</p>
                            ) : (
                                <div className="space-y-6">
                                    {faqs.map((faq, index) => (
                                        <div
                                            key={index}
                                            className="border-b border-gray-200 pb-4"
                                        >
                                            <h4 className="text-gray-800 font-semibold mb-2">
                                                {faq.question}
                                            </h4>
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 text-sm text-gray-500">
                            For more inquiries, please visit our Contact page or reach out directly.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerFAQs;
