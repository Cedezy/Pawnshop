import React from 'react';
import { X } from 'lucide-react';

const RateModal = ({ type, form, setForm, onSubmit, onCancel, editId, loading }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(e);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-sm shadow-lg w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">

                {/* Header */}
                <div className="bg-teal-600 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-medium text-white">
                            {editId ? `Edit ${type}` : `Add ${type}`}
                        </h2>
                        <button onClick={onCancel} className="text-white hover:bg-teal-700 rounded-full p-1">
                            <X size={24} />
                        </button>
                    </div>
                    <p className="text-sm text-teal-100 mt-1">
                        {type === 'Monthly Rate'
                            ? 'Configure the monthly interest applied to pawned items.'
                            : 'Set interest percentages based on payment schedules.'}
                    </p>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">

                        {/* Info box (matches CustomerPawn UI) */}
                        <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                            <h3 className="text-sm font-medium text-gray-800">
                                {type === 'Monthly Rate'
                                    ? 'Monthly Interest Rate'
                                    : 'Scheduled Interest Rates'}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                {type === 'Monthly Rate'
                                    ? 'This percentage is applied monthly to all new pawn transactions. Enter the value as a percentage (e.g., 3 for 3%).'
                                    : 'Each schedule represents an interest percentage applied to a specific payment period.'}
                            </p>
                        </div>

                        {type === 'Monthly Rate' ? (
                            <>
                                {/* Monthly Rate */}
                                <div className="relative w-full">
                                    <input
                                        type="number"
                                        required
                                        placeholder=" "
                                        className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none"
                                        value={form.rate}
                                        onChange={(e) =>
                                            setForm({ ...form, rate: e.target.value })
                                        }
                                    />
                                    <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                        peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs">
                                        Rate (%) <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Enter percentage value (e.g., 3 for 3%)
                                    </p>
                                </div>

                                {/* Effectivity Date */}
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">
                                        Effectivity Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        value={form.effectivityDate}
                                        onChange={(e) =>
                                            setForm({ ...form, effectivityDate: e.target.value })
                                        }
                                    />
                                    <p className="text-sm text-gray-600 mt-1">
                                        This rate will apply to transactions created on or after this date.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Effectivity Date */}
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">
                                        Effectivity Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        value={form.effectivityDate}
                                        onChange={(e) =>
                                            setForm({ ...form, effectivityDate: e.target.value })
                                        }
                                    />
                                    <p className="text-sm text-gray-600 mt-1">
                                        These rates will be applied starting from this date.
                                    </p>
                                </div>

                                {/* Schedule Rates */}
                                {['firstSchedule', 'secondSchedule', 'thirdSchedule'].map((key, i) => (
                                    <div key={key} className="relative w-full">
                                        <input
                                            type="number"
                                            required
                                            placeholder=" "
                                            className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none"
                                            value={form[key]}
                                            onChange={(e) =>
                                                setForm({ ...form, [key]: e.target.value })
                                            }
                                        />
                                        <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs">
                                            {`${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : 'rd'} Schedule (%)`}
                                            <span className="text-red-500"> *</span>
                                        </label>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Enter percentage value (e.g., 3 for 3%)
                                        </p>
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
                        className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-sm hover:bg-gray-100 text-sm transition duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-teal-600 text-white rounded-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition duration-300"
                    >
                        {loading ? 'Saving...' : editId ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RateModal;
