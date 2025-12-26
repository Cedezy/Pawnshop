import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Upload, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import axios from '../../api/axios'
import { getDaysArray } from "../../utils/DateUtils";
import { formatDate } from "../../utils/FormatDate";
import { useToast } from "../../context/ToastContext";

const CreateCustomer = ({ isOpen, onClose, onSuccess }) => {
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [idPhotoPreview, setIdPhotoPreview] = useState("");
    const [idPhotoFile, setIdPhotoFile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const { showToast } = useToast();
    const password = watch("password");
    const dobYear = watch("dobYear");
    const dobMonth = watch("dobMonth");

    const days = getDaysArray(dobYear, dobMonth);

    useEffect(() => {
        if(!isOpen){
            setCurrentStep(1);
            setIdPhotoPreview("");
            setError("");
        }
    }, [isOpen]);

    const handlePhotoChange = (e, setPreview, setFile) => {
        const file = e.target.files?.[0];
        if (!file) {
            setPreview("");
            setFile(null);
            return;
        }
        setFile(file); 
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const onSubmit = async (data) => {
        if(data.password !== data.confirmPassword){
            showToast("Error", "Passwords do not match", "error");
            return;
        }

        const fullDOB = `${data.dobYear}-${String(data.dobMonth).padStart(2, "0")}-${String(data.dobDay).padStart(2, "0")}`;

        try{
            setLoading(true);
            setError("");

            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (
                    key !== "photo" &&
                    key !== "idPhoto" &&
                    key !== "confirmPassword" &&
                    key !== "dobYear" &&
                    key !== "dobMonth" &&
                    key !== "dobDay"
                ) {
                    formData.append(key, value);
                }
            });

            // Append full DOB to correct backend field
            formData.append("dateOfBirth", fullDOB);
            if (idPhotoFile) formData.append("idPhoto", idPhotoFile);

            const response = await axios.post("/customer", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
            showToast("Success", response.data.message, "success");
            setLoading(false);
            onSuccess(response.data.customer);
            reset();
            setIdPhotoPreview("");
            onClose();
        } 
        catch(err){
            setLoading(false);
            showToast("Error", err.response?.data?.error, "error");
        }
    };

    const ID_TYPES = [
        "Passport",
        "Driver's License",
        "SSS ID",
        "PhilHealth ID",
        "TIN ID",
        "PRC ID",
        "Other"
    ];

    const validateStep = () => {
        const step1Fields = ['firstName', 'lastName', 'dobYear', 'dobMonth', 'dobDay', 'sex', 'phone', 'civilStatus', 'nationality', 'street', 'barangay', 'city', 'province', 'zipCode'];
        const step2Fields = ['email', 'password', 'confirmPassword', 'idType', 'idNumber', 'idExpiryDate'];
        const step3Fields = [];

        const values = watch();
        
        if (currentStep === 1) {
            return step1Fields.every(field => values[field]);
        }
        if (currentStep === 2) {
            return step2Fields.every(field => values[field]) && values.password === values.confirmPassword;
        }
        if (currentStep === 3) {
            return step3Fields.every(field => values[field]);
        }
        return true;
    };

    if (!isOpen) return null;

    const steps = [
        { num: 1, name: "Personal Info" },
        { num: 2, name: "Account & ID Verification" },
        { num: 3, name: "Confirmation" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 duration-200">
            <div className="bg-white rounded-sm shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
                <div className="bg-teal-600 px-6 py-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-medium text-gray-50">Create New Customer</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full p-1 ease-in-out duration-300 cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="px-10 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {steps.map((step, idx) => (
                            <React.Fragment key={step.num}>
                                <div className="flex flex-col items-center flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                                        currentStep > step.num 
                                        ? "bg-green-500 text-white" 
                                        : currentStep === step.num 
                                            ? "bg-yellow-500 text-white ring-4 ring-yellow-100" 
                                            : "bg-gray-200 text-gray-500"
                                        }`}>
                                            {currentStep > step.num ? <Check size={20} /> : step.num}
                                        </div>
                                        <span className={`text-xs mt-2 font-medium ${
                                            currentStep === step.num ? "text-yellow-600" : "text-gray-500"
                                        }`}>
                                            {step.name}
                                        </span>
                                    </div>
                                    {idx < steps.length - 1 && (
                                        <div className={`h-1 flex-1 mx-2 mb-6 rounded transition-all ${
                                        currentStep > step.num ? "bg-yellow-500" : "bg-gray-200"
                                    }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 mb-4">
                        {error && (
                            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded flex items-start gap-3">
                                <AlertCircle size={20} className="mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-5 duration-300">
                                <div className="mb-6">
                                    <h3 className="text-md font-semibold text-gray-700 uppercase tracking-tight">
                                        Customer Information
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Please fill out the customer’s personal and contact details accurately.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            {...register("firstName", { required: "First name is required" })}
                                            placeholder=" "
                                            className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none"
                                        />
                                        <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                                        peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                                    </div>

                                    <div className="relative w-full">
                                        <input
                                        type="text"
                                        {...register("middleName")}
                                        placeholder=" "
                                        className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none"
                                        />
                                        <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                                        peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs">
                                        Middle Name
                                        </label>
                                    </div>

                                    <div className="relative w-full">
                                        <input
                                        type="text"
                                        {...register("lastName", { required: "Last name is required" })}
                                        placeholder=" "
                                        className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none"
                                        />
                                        <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                                        peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs">
                                        Last Name <span className="text-red-500">*</span>
                                        </label>
                                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                                    </div>

                                    <div className="relative w-full">
                                        <input
                                        type="tel"
                                        {...register("phone", { required: "Phone is required" })}
                                        placeholder=" "
                                        className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none"
                                        />
                                        <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                                        peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs">
                                        Phone number<span className="text-red-500"> *</span>
                                        </label>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Use an active mobile number 
                                        </p>

                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                    </div>

                                    <div className="relative w-full">
                                        <select
                                        {...register("civilStatus", { required: "Civil Status is required" })}
                                        className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none bg-transparent"
                                        >
                                            <option value="">Select Civil Status</option>
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Widowed">Widowed</option>
                                            <option value="Separated">Separated</option>
                                        </select>
                                    
                                        {errors.civilStatus && <p className="text-red-500 text-xs mt-1">{errors.civilStatus.message}</p>}
                                    </div>         

                                    <div className="relative w-full">
                                        <input
                                        type="text"
                                        {...register("nationality", { required: "Nationality is required" })}
                                        placeholder=" "
                                        className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none"
                                        />
                                        <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                                        peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs">
                                        Nationality <span className="text-red-500">*</span>
                                        </label>
                                        {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality.message}</p>}
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm text-gray-600 mb-2">
                                            Date of Birth <span className="text-red-500">*</span>
                                        </label>

                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="w-full">
                                                <select
                                                    {...register("dobYear", { required: "Year is required" })}
                                                    className="w-full border-b-2 border-gray-300 bg-transparent focus:border-yellow-500 text-sm py-1 outline-none"
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>Select Year</option>
                                                    {Array.from({ length: 100 }, (_, i) => {
                                                        const year = new Date().getFullYear() - i;
                                                        return <option key={year} value={year}>{year}</option>;
                                                    })}
                                                </select>
                                                {errors.dobYear && <p className="text-red-500 text-xs mt-1">{errors.dobYear.message}</p>}
                                            </div>

                                            <div className="w-full">
                                                <select
                                                    {...register("dobMonth", { required: "Month is required" })}
                                                    className="w-full border-b-2 border-gray-300 bg-transparent focus:border-yellow-500 text-sm py-1 outline-none"
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>Select Month</option>
                                                    {[
                                                        "January","February","March","April","May","June",
                                                        "July","August","September","October","November","December"
                                                    ].map((month, i) => (
                                                        <option key={month} value={i + 1}>{month}</option>
                                                    ))}
                                                </select>
                                                {errors.dobMonth && <p className="text-red-500 text-xs mt-1">{errors.dobMonth.message}</p>}
                                            </div>

                                            <div className="w-full">
                                                <select
                                                    {...register("dobDay", { required: "Day is required" })}
                                                    className="w-full border-b-2 border-gray-300 bg-transparent focus:border-yellow-500 text-sm py-1 outline-none"
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>Select Day</option>
                                                    {days.map((day) => (
                                                        <option key={day} value={day}>{day}</option>
                                                    ))}
                                                </select>
                                                {errors.dobDay && <p className="text-red-500 text-xs mt-1">{errors.dobDay.message}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div  className="relative w-full">
                                        <select
                                        {...register("sex", { required: "Sex is required" })}
                                        className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none bg-transparent"
                                        >
                                        <option value="">Select Sex</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                        </select>
                                        
                                        {errors.sex && <p className="text-red-500 text-xs mt-1">{errors.sex.message}</p>}
                                    </div>
                                </div>
                                <div className="col-span-full mt-6">
                                    <h3 className="text-md font-semibold text-gray-700 uppercase tracking-tight">
                                        Address Details
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Enter the complete and current residential address.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            {...register("province", { required: "Province is required" })}
                                            placeholder=" "
                                            className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none"
                                        />
                                        <label className="
                                            absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs
                                        ">
                                            Province <span className="text-red-500">*</span>
                                        </label>
                                        {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province.message}</p>}
                                    </div>

                                    {/* Zip Code */}
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            {...register("zipCode", {
                                                required: "Zip code is required",
                                                pattern: {
                                                    value: /^\d{4}$/,
                                                    message: "Invalid zip code (4 digits)"
                                                }
                                            })}
                                            placeholder=" "
                                            className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none"
                                        />
                                        <label className="
                                            absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs
                                        ">
                                            Zip Code <span className="text-red-500">*</span>
                                        </label>
                                        {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>}
                                    </div>

                                    {/* City/Municipality */}
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            {...register("city", { required: "City is required" })}
                                            placeholder=" "
                                            className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none"
                                        />
                                        <label className="
                                            absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs
                                        ">
                                            City/Municipality <span className="text-red-500">*</span>
                                        </label>
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                                    </div>

                                    {/* Barangay */}
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            {...register("barangay", { required: "Barangay is required" })}
                                            placeholder=" "
                                            className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none"
                                        />
                                        <label className="
                                            absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs
                                        ">
                                            Barangay <span className="text-red-500">*</span>
                                        </label>
                                        {errors.barangay && <p className="text-red-500 text-xs mt-1">{errors.barangay.message}</p>}
                                    </div>

                                    {/* Street Address */}
                                    <div className="relative w-full col-span-2">
                                        <input
                                            type="text"
                                            {...register("street", { required: "Street is required" })}
                                            placeholder=" "
                                            className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none"
                                        />
                                        <label className="
                                            absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs
                                        ">
                                            Street Address <span className="text-red-500">*</span>
                                        </label>
                                        {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                                    </div>

                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-5 duration-300">
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-gray-700 tracking-tight">
                                        Account & Verification
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Set login credentials and upload a valid government-issued ID.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative w-full">
                                        <input
                                            type="email"
                                            {...register("email", { 
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                            placeholder=" "
                                            className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none"
                                        />
                                        <label className="
                                            absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                    </div>

                                    <div className="relative w-full">
                                        <select
                                            {...register("status", { required: "Status is required" })}
                                            defaultValue=""
                                            className="peer w-full border-b-2 border-gray-300 bg-transparent focus:border-yellow-500 text-sm pt-4 pb-1 outline-none"
                                        >
                                           
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>

                                        <label className="
                                            absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs
                                        ">
                                            Account Status <span className="text-red-500">*</span>
                                        </label>

                                        {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
                                    </div>

                                    <div className="relative w-full">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            {...register("password", {
                                                required: "Password is required",
                                                minLength: { value: 8, message: "Must be at least 8 characters" }
                                            })}
                                            placeholder=" "
                                            className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 pr-10 outline-none"
                                        />
                                        <label className="
                                            absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs
                                        ">
                                            Password <span className="text-red-500">*</span>
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 bottom-5 cursor-pointer -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Password must be at least 8 characters long.
                                        </p>


                                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="relative w-full">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            {...register("confirmPassword", {
                                                required: "Please confirm password",
                                                validate: (value) => value === password || "Passwords do not match"
                                            })}
                                            placeholder=" "
                                            className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 pr-10 outline-none"
                                        />
                                        <label className="
                                            absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs
                                        ">
                                            Confirm Password <span className="text-red-500">*</span>
                                        </label>

                                        {/* Toggle */}
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-2 bottom-5 cursor-pointer -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>

                                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                                    </div>

                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                                    {/* ID Type */}
                                    <div className="relative w-full">
                                        <select
                                            {...register("idType", { required: "ID type is required" })}
                                            className="peer w-full border-b-2 border-gray-300 bg-transparent focus:border-yellow-500 text-sm pt-4 pb-1 outline-none"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select ID Type</option>
                                            {ID_TYPES.map((id, idx) => (
                                                <option key={idx} value={id}>{id}</option>
                                            ))}
                                        </select>
                                        {errors.idType && <p className="text-red-500 text-xs mt-1">{errors.idType.message}</p>}
                                    </div>

                                    {/* ID Number */}
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            {...register("idNumber", { required: "ID number is required" })}
                                            placeholder=" "
                                            className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none"
                                        />
                                        <label className="
                                            absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs
                                        ">
                                            ID Number <span className="text-red-500">*</span>
                                        </label>
                                        {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber.message}</p>}
                                    </div>

                                    {/* ID Expiry Date */}
                                    <div className="relative w-full">
                                        <input
                                            type="date"
                                            {...register("idExpiryDate", { required: "Expiry date is required" })}
                                            placeholder=" "
                                            className="peer w-full border-b-2 border-gray-300 focus:border-yellow-500 text-sm pt-4 pb-1 outline-none"
                                        />
                                        <label className="
                                            absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                            peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-yellow-500 peer-focus:text-xs
                                        ">
                                            ID Expiry Date <span className="text-red-500">*</span>
                                        </label>
                                        {errors.idExpiryDate && <p className="text-red-500 text-xs mt-1">{errors.idExpiryDate.message}</p>}
                                    </div>
                                </div>
                                <div className="relative w-full">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        ID Photo
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-400 transition-all">
                                        <input
                                            type="file"
                                            id="idPhoto"
                                            accept="image/*"
                                            onChange={(e) => handlePhotoChange(e, setIdPhotoPreview, setIdPhotoFile)}
                                            className="hidden"
                                        />
                                        <label htmlFor="idPhoto" className="cursor-pointer flex flex-col items-center">
                                            {idPhotoPreview ? (
                                                <img
                                                    src={idPhotoPreview}
                                                    alt="ID Preview"
                                                    className="max-h-48 object-contain rounded-lg border-4 border-yellow-100"
                                                />
                                            ) : (
                                                <>
                                                    <Upload size={40} className="text-gray-400 mb-2" />
                                                    <span className="text-sm text-gray-600 font-medium">
                                                        Upload a clear photo of a valid ID
                                                        </span>
                                                        <span className="text-xs text-gray-400 mt-1">
                                                        Government-issued ID only (PNG, JPG, JPEG)
                                                        </span>

                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-right-5 duration-300">
                                <div className="text-center">
                                    <h2 className="text-2xl font-semibold text-gray-700 tracking-tighter">Review Customer Information</h2>
                                    <p className="text-sm text-gray-500 mt-1">Please verify all details before finalizing the record.</p>

                                </div>

                                <div className="space-y-6 p-4">
                                    <div className="overflow-hidden">
                                        <div className="py-2 mb-4 border-b border-gray-300">
                                            <h3 className="font-semibold text-teal-800 flex items-center gap-2">
                                                Personal Information
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Full Name</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {watch("firstName")} {watch("middleName")} {watch("lastName")}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Email Address</p>
                                                <p className="text-sm font-medium text-gray-900">{watch("email")}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                                                <p className="text-sm font-medium text-gray-900">{watch("phone")}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {watch("dobYear") && watch("dobMonth") && watch("dobDay")
                                                        ? formatDate(`${watch("dobYear")}-${watch("dobMonth")}-${watch("dobDay")}`)
                                                        : ''
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Sex</p>
                                                <p className="text-sm font-medium text-gray-900">{watch("sex")}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Civil Status</p>
                                                <p className="text-sm font-medium text-gray-900">{watch("civilStatus")}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Nationality</p>
                                                <p className="text-sm font-medium text-gray-900">{watch("nationality")}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Account Status</p>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                    watch("status") === "Active" 
                                                        ? "bg-green-100 text-green-700" 
                                                        : "bg-gray-100 text-gray-700"
                                                }`}>
                                                    {watch("status")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-hidden">
                                        <div className="py-2 mb-4 border-b border-gray-300">
                                            <h3 className="font-semibold text-teal-800 flex items-center gap-2">
                                                Address Information
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Street Address</p>
                                                <p className="text-sm font-medium text-gray-900">{watch("street")}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Barangay</p>
                                                <p className="text-sm font-medium text-gray-900">{watch("barangay")}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">City/Municipality</p>
                                                <p className="text-sm font-medium text-gray-900">{watch("city")}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Province</p>
                                                <p className="text-sm font-medium text-gray-900">{watch("province")}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Zip Code</p>
                                                <p className="text-sm font-medium text-gray-900">{watch("zipCode")}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-hidden">
                                        <div className="py-2 mb-4 border-b border-gray-300">
                                            <h3 className="font-semibold text-teal-800 flex items-center gap-2">
                                                ID Verification
                                            </h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">ID Type</p>
                                                    <p className="text-sm font-medium text-gray-900">{watch("idType")}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">ID Number</p>
                                                    <p className="text-sm font-medium text-gray-900">{watch("idNumber")}</p>
                                                </div>
                                               <div>
                                                    <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatDate(watch("idExpiryDate"))}
                                                    </p>
                                                </div>

                                            </div>
                                            {idPhotoPreview && (
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-2">ID Photo</p>
                                                    <div className="border border-gray-200 rounded-lg p-2 inline-block">
                                                        <img 
                                                            src={idPhotoPreview} 
                                                            alt="ID Preview" 
                                                            className="max-h-40 object-contain rounded"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                <div className="px-4 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <p className="text-gray-500 text-sm mt-1">Step {currentStep} of 3</p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
                            className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-sm cursor-pointer hover:bg-gray-100 ease-in-out duration-300 font-medium text-sm"
                        >
                            {currentStep === 1 ? "Cancel" : "Back"}
                        </button>
                        
                        <div className="flex gap-3">
                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentStep(currentStep + 1)
                                        setError("");
                                    }}
                                    disabled={!validateStep()}
                                    className="px-6 py-2 bg-teal-600 text-white rounded-sm hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed ease-in-out duration-300 font-medium shadow-sm text-sm cursor-pointer"
                                >
                                    Next Step
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={loading || !validateStep()}
                                    className="px-6 py-2.5 cursor-pointer text-sm bg-teal-600 text-white rounded-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed ease-in-out duration-300 font-medium shadow-sm flex justify-center items-center"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            Create
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CreateCustomer;