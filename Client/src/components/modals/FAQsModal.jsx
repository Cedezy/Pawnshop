import React, { useState } from 'react';
import { X } from 'lucide-react';

const FAQsModal = ({ form, setForm, onSubmit, onCancel, editId }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(e);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-sm shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
                
                {/* Header */}
                <div className="bg-teal-600 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-medium text-gray-50">
                            {editId ? 'Edit FAQ Item' : 'Create New FAQ'}
                        </h2>
                        <button
                            onClick={onCancel}
                            className="text-white hover:bg-green-700 rounded-full p-1 transition-colors duration-200 cursor-pointer"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Header description */}
                    <p className="text-xs text-teal-100 mt-1">
                        {editId
                            ? 'Update the frequently asked question and its answer.'
                            : 'Add a new frequently asked question to help customers.'}
                    </p>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">

                        {/* Question Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700">
                                FAQ Question
                            </h3>
                            <p className="text-xs text-gray-500 mb-3">
                                Enter a clear and concise question that customers often ask.
                            </p>

                            <div className="relative w-full">
                                <input
                                    type="text"
                                    required
                                    placeholder=" "
                                    className="peer w-full border-b-2 border-gray-300 focus:border-teal-500 text-sm pt-4 pb-1 outline-none"
                                    value={form.question}
                                    onChange={(e) =>
                                        setForm({ ...form, question: e.target.value })
                                    }
                                />
                                <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                    peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                    peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-teal-500 peer-focus:text-xs">
                                    Question <span className="text-red-500">*</span>
                                </label>
                            </div>
                        </div>

                        {/* Answer Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700">
                                FAQ Answer
                            </h3>
                            <p className="text-xs text-gray-500 mb-3">
                                Provide a helpful and easy-to-understand answer for customers.
                            </p>

                            <textarea
                                required
                                rows={5}
                                placeholder="Enter the detailed answer here..."
                                className="w-full border-2 border-gray-300 rounded-md p-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 resize-none"
                                value={form.answer}
                                onChange={(e) =>
                                    setForm({ ...form, answer: e.target.value })
                                }
                            />

                            <div className="flex justify-end mt-1 text-xs text-gray-400">
                                {form.answer.length} characters
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-sm cursor-pointer hover:bg-gray-100 ease-in-out duration-300 font-medium text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-teal-600 text-white rounded-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm flex items-center gap-2 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {editId ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            editId ? 'Update FAQ' : 'Create FAQ'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FAQsModal;
