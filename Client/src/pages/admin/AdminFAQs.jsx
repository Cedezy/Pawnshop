import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/ui/SidebarAdmin';
import HeaderStaff from '../../components/ui/HeaderStaff';
import axios from '../../api/axios';
import { HelpCircle } from 'lucide-react';
import { formatDate } from '../../utils/FormatDate';
import FAQsModal from '../../components/modals/FAQsModal';
import { useToast } from "../../context/ToastContext"; 
import SkeletonFAQs from '../../components/ui/SkeletonFAQs';

const AdminFAQs = () => {
    const [faqs, setFaqs] = useState([]);
    const [form, setForm] = useState({ question: '', answer: '' });
    const [editId, setEditId] = useState(null);
    const [selectedFaqs, setSelectedFaqs] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchFaqs = async () => {
        try{
            const response = await axios.get('/faqs', { 
                withCredentials: true 
            });
            setFaqs(response.data.faqs);
        } 
        catch(err){
            console.error(err);
        }
        finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = () => {
            fetchFaqs();
        };
        fetchData(); 
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.question || !form.answer) return;

        try{
            let response;

            if(editId) {
                response = await axios.put(`/faqs/${editId}`, form, { 
                    withCredentials: true 
                });
            } 
            else{
                response = await axios.post('/faqs', form, { withCredentials: true });
            } 
            showToast("Success", response.data.message, "success");
            setForm({ question: '', answer: '' });
            setEditId(null);
            setShowModal(false);
            setSelectedFaqs(null);
            fetchFaqs();
        } 
        catch(err){ 
            console.error(err); 
        }
    };

    const handleEdit = (faq) => {
        setForm({ question: faq.question, answer: faq.answer });
        setEditId(faq._id);
        setShowModal(true);
    };

    return (
        <div className="h-screen flex overflow-hidden">
            <SidebarAdmin />
            <div className="flex flex-col flex-1">
                <HeaderStaff />
                <div className="px-6 pb-4 flex flex-col gap-5 h-screen pt-4 overflow-hidden">
                    <div className='flex justify-center items-center'>
                        <span className='text-2xl tracking-tighter font-medium uppercase text-gray-700'>
                            frequently asked questions
                        </span>
                    </div>
                    {loading ? (
                        <SkeletonFAQs/>
                    ) : (
                        <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr className='whitespace-nowrap'>
                                        <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Answer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated at</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {faqs.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-16">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                        <HelpCircle className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs yet</h3>
                                                    <p className="text-gray-500">Create some common questions to help your users.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        faqs.map((faq) => (
                                            <tr key={faq._id}
                                                onClick={() => setSelectedFaqs(faq)}
                                                className={`cursor-pointer transition ${selectedFaqs?._id === faq._id ? 'bg-green-100' : 'hover:bg-gray-100 duration-300'}`}>
                                                <td className="px-6 py-6 text-sm">{faq.question}</td>
                                                <td className="px-6 py-4 text-sm">{faq.answer}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(faq.createdAt)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(faq.updatedAt)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className='flex gap-2'>
                        <button onClick={() => setShowModal(true)}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm cursor-pointer hover:bg-gray-50 ease-in-out duration-300">
                            ADD
                        </button>
                        <button 
                            onClick={() => handleEdit(selectedFaqs)}
                            disabled={!selectedFaqs}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm cursor-pointer hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed duration-300 ease-in-out">
                            EDIT
                        </button>
                        
                    </div>
                </div>

                {showModal && 
                    <FAQsModal
                        form={form}
                        setForm={setForm}
                        onSubmit={handleSubmit}
                        onCancel={() => { 
                            setShowModal(false); 
                            setSelectedFaqs(null); 
                            setForm({
                                question: '', answer: ''
                            })
                        }}
                        editId={editId}
                    />
                }
            </div>
        </div>
    );
};

export default AdminFAQs;
