import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Upload } from "lucide-react";
import { handleNumberChange } from "../../utils/AmountUtils";
import { handlePhotoChange } from "../../utils/PhotoUtils";
import { useToast } from "../../context/ToastContext";
const today = new Date().toISOString().split("T")[0];

const CreatePawnModal = ({
    isOpen,
    onClose,
    onSubmit,
    selectedCustomer,
    onOpenCustomerList,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            startDate: today,
        },
    });

    const [appraisalValue, setAppraisalValue] = useState("");
    const [loanAmount, setLoanAmount] = useState("");
    const [itemPhotoPreview, setItemPhotoPreview] = useState("");
    const [loading, setLoading] = useState(false);

    const { showToast } = useToast();

    const handleForm = async (data) => {
        if(!selectedCustomer){
            showToast("Error", "Please select a customer!", "error");
            return;
        }

        const loan = Number(loanAmount.replace(/,/g, ""));
        const appraisal = Number(appraisalValue.replace(/,/g, ""));

        if(loan > appraisal){
            showToast("Error", "Loan amount should not exceed appraisal value!", "error");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("customerId", selectedCustomer._id);
        formData.append("itemName", data.itemName);
        formData.append("appraisalValue", appraisalValue.replace(/,/g, ""));
        formData.append("loanAmount", loanAmount.replace(/,/g, ""));
        formData.append("startDate", data.startDate);

        if(data.itemPhoto?.[0]){
            formData.append("itemPhoto", data.itemPhoto[0]);
        }

        try{
            await onSubmit(formData);
            reset({
                startDate: today,
            });
            setAppraisalValue("");
            setLoanAmount("");
            setItemPhotoPreview("");
        } 
        catch(err){
            showToast("Error", err.response?.data?.message, "error");
        } 
        finally{
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-sm shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
                <div className="bg-teal-600 px-6 py-5 flex items-center justify-between">
                    <h2 className="text-xl font-medium text-gray-50">
                        Create New Pawn
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-teal-700 rounded-full p-1 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit(handleForm)} className="p-6 space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700">
                                Pawn Information
                            </h3>
                            <p className="text-xs text-gray-500">
                                Enter the basic details of the pawned item.
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Customer <span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={onOpenCustomerList}
                                className="w-full text-left border-2 border-gray-300 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 hover:border-teal-400 transition-all text-sm"
                            >
                                {selectedCustomer
                                    ? `${selectedCustomer.userId?.firstname} ${selectedCustomer.userId?.lastname}`
                                    : "Click to select customer"}
                            </button>
                        </div>
                        <div className="relative w-full">
                            <input
                                type="text"
                                {...register("itemName", {
                                    required: "Item name is required",
                                })}
                                placeholder=" "
                                className="peer w-full border-b-2 border-gray-300 focus:border-teal-500 text-sm pt-4 pb-1 outline-none"
                            />
                            <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all
                                peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                                peer-focus:top-0 peer-focus:text-xs peer-focus:text-teal-500">
                                Item Name <span className="text-red-500">*</span>
                            </label>
                            {errors.itemName && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.itemName.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700">
                                Valuation & Loan Amount
                            </h3>
                            <p className="text-xs text-gray-500">
                                Set the appraisal value and loan amount.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder=" "
                                    className="peer w-full border-b-2 border-gray-300 focus:border-teal-500 text-sm pt-4 pb-1 outline-none"
                                    {...register("appraisalValue", {
                                        required: "Appraisal value is required",
                                        validate: (val) =>
                                            val.replace(/,/g, "") > 0 ||
                                            "Appraisal must be greater than 0",
                                        onChange: (e) =>
                                            handleNumberChange(e, setAppraisalValue),
                                    })}
                                    value={appraisalValue}
                                />
                                <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all
                                    peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                                    peer-focus:top-0 peer-focus:text-xs peer-focus:text-teal-500">
                                    Appraisal Value (₱) <span className="text-red-500">*</span>
                                </label>
                                {errors.appraisalValue && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.appraisalValue.message}
                                    </p>
                                )}
                            </div>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder=" "
                                    className="peer w-full border-b-2 border-gray-300 focus:border-teal-500 text-sm pt-4 pb-1 outline-none"
                                    {...register("loanAmount", {
                                        required: "Loan amount is required",
                                        validate: (val) =>
                                            val.replace(/,/g, "") > 0 ||
                                            "Loan must be greater than 0",
                                        onChange: (e) =>
                                            handleNumberChange(e, setLoanAmount),
                                    })}
                                    value={loanAmount}
                                />
                                <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all
                                    peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                                    peer-focus:top-0 peer-focus:text-xs peer-focus:text-teal-500">
                                    Loan Amount (₱) <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-400 mt-1">
                                    Loan amount should not exceed appraisal value.
                                </p>
                                {errors.loanAmount && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.loanAmount.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                 <div>
                                    <h3 className="text-sm font-semibold text-gray-700">
                                        Pawn Period
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Select the start date of the pawn transaction.
                                    </p>
                                </div>

                                <div className="relative w-full">
                                    <input
                                        type="date"
                                        min={today}
                                        {...register("startDate", {
                                            required: "Start date is required",
                                        })}
                                        className="peer w-full border-b-2 border-gray-300 focus:border-teal-500 text-sm pt-4 pb-1 outline-none"
                                    />
                                    <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all">
                                        Start Date <span className="text-red-500">*</span>
                                    </label>
                                    {errors.startDate && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.startDate.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Item Photo
                                </label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Upload a clear photo of the pawned item for record purposes.
                                </p>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-all">
                                    <input
                                        type="file"
                                        id="itemPhoto"
                                        accept="image/*"
                                        className="hidden"
                                        {...register("itemPhoto", {
                                            onChange: (e) =>
                                                handlePhotoChange(e, setItemPhotoPreview),
                                        })}
                                    />
                                    <label
                                        htmlFor="itemPhoto"
                                        className="cursor-pointer flex flex-col items-center"
                                    >
                                        {itemPhotoPreview ? (
                                            <img
                                                src={itemPhotoPreview}
                                                alt="Preview"
                                                className="max-h-48 object-contain rounded-lg border-4 border-teal-100"
                                            />
                                        ) : (
                                            <>
                                                <Upload size={40} className="text-gray-400 mb-2" />
                                                <span className="text-sm text-gray-600">
                                                    Click to upload item photo
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    PNG, JPG, JPEG
                                                </span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-sm cursor-pointer hover:bg-gray-100 ease-in-out duration-300 font-medium text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit(handleForm)}
                        disabled={loading}
                        className="px-6 py-2 text-sm cursor-pointer ease-in-out duration-300 bg-teal-600 text-white rounded-sm hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Pawn"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePawnModal;
