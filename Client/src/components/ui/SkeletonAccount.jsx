import React from "react";

const SkeletonAccount = () => {
    return (
        <div className="bg-white mx-auto overflow-hidden animate-pulse">
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <div className="h-6 bg-gray-300 rounded w-40 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-80"></div>
            </div>

            {/* Body */}
            <div className="px-8 py-6">
                {/* Account Information Section */}
                <div className="mb-10">
                    <div className="h-5 bg-gray-300 rounded w-56 mb-4 pb-2"></div>
                    
                    <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                        {/* USER ID */}
                        <div>
                            <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                            <div className="h-5 bg-gray-300 rounded w-24"></div>
                        </div>

                        {/* FIRST NAME */}
                        <div>
                            <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                            <div className="h-5 bg-gray-300 rounded w-32"></div>
                        </div>

                        {/* MIDDLE NAME */}
                        <div>
                            <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="h-5 bg-gray-300 rounded w-28"></div>
                        </div>

                        {/* LAST NAME */}
                        <div>
                            <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                            <div className="h-5 bg-gray-300 rounded w-32"></div>
                        </div>

                        {/* EMAIL ADDRESS */}
                        <div>
                            <div className="h-3 bg-gray-200 rounded w-28 mb-2"></div>
                            <div className="h-5 bg-gray-300 rounded w-48"></div>
                        </div>

                        {/* ACCOUNT STATUS */}
                        <div>
                            <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-5 bg-gray-300 rounded w-20"></div>
                        </div>
                    </div>
                </div>

                {/* Security Settings Section */}
                <div>
                    <div className="h-5 bg-gray-300 rounded w-48 mb-4 pb-2"></div>
                    
                    <div className="space-y-2 mb-4 max-w-2xl">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>

                    <div className="h-10 bg-gray-300 rounded w-40"></div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50">
                <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>
        </div>
    );
};

export default SkeletonAccount;