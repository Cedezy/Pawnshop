import React from 'react';
import { X } from 'lucide-react';

const RateModal = ({ type, form, setForm, onSubmit, onCancel, editId, loading }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(e);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-sm shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
                {/* Header */}
                <div className="bg-blue-600 px-6 py-5 flex items-center justify-between">
                    <h2 className="text-xl font-medium text-white">
                        {editId ? `Edit ${type}` : `Add ${type}`}
                    </h2>
                    <button onClick={onCancel} className="text-white hover:bg-blue-700 rounded-full p-1">
                        <X size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {type === 'Monthly Rate' ? (
                            <>
                                <div className="relative w-full">
                                    <input
                                        type="number"
                                        required
                                        placeholder=" "
                                        className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 text-sm pt-4 pb-1 outline-none"
                                        value={form.rate}
                                        onChange={(e) => setForm({ ...form, rate: e.target.value })}
                                    />
                                    <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                        peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-blue-500 peer-focus:text-xs">
                                        Rate (%) <span className="text-red-500">*</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Effectivity Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full border rounded px-3 py-2"
                                        value={form.effectivityDate}
                                        onChange={(e) => setForm({ ...form, effectivityDate: e.target.value })}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Effectivity Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full border rounded px-3 py-2"
                                        value={form.effectivityDate}
                                        onChange={(e) => setForm({ ...form, effectivityDate: e.target.value })}
                                    />
                                </div>
                                {['firstSchedule', 'secondSchedule', 'thirdSchedule'].map((key, i) => (
                                    <div key={key}>
                                        <label className="block text-sm text-gray-500 mb-2">
                                            {`${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : 'rd'} Schedule (%)`}
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full border rounded px-3 py-2"
                                            value={form[key]}
                                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                        />
                                    </div>
                                ))}
                            </>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-sm hover:bg-gray-100 transition-all text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {loading ? 'Saving...' : editId ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RateModal;
