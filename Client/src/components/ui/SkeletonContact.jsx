import React from "react";

const SkeletonContact = () => {
    return (
        <div className="bg-white rounded-sm shadow-sm overflow-y-auto animate-pulse">
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div className="flex-1">
                    <div className="h-6 bg-gray-300 rounded w-64 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-96"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded w-20"></div>
            </div>

            {/* Body */}
            <div className="px-8 py-6">
                {/* Shop Details Section */}
                <div className="mb-10">
                    <div className="h-5 bg-gray-300 rounded w-40 mb-4 pb-2"></div>
                    
                    <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                        {/* Shop Name */}
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="h-5 bg-gray-300 rounded w-full"></div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
                            <div className="h-5 bg-gray-300 rounded w-full"></div>
                        </div>

                        {/* Email Address */}
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
                            <div className="h-5 bg-gray-300 rounded w-full"></div>
                        </div>

                        {/* Business Hours - Spans 2 columns */}
                        <div className="col-span-2">
                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-5 bg-gray-300 rounded w-full"></div>
                        </div>
                    </div>
                </div>

                {/* Location & Online Presence Section */}
                <div className="mb-10">
                    <div className="h-5 bg-gray-300 rounded w-64 mb-4 pb-2"></div>
                    
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        {/* Complete Address */}
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-36 mb-2"></div>
                            <div className="h-5 bg-gray-300 rounded w-full"></div>
                        </div>

                        {/* Facebook Page */}
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-5 bg-gray-300 rounded w-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50">
                <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>
        </div>
    );
};

export default SkeletonContact;