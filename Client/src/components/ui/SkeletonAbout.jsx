import React from "react";

const SkeletonAbout = () => {
    return (
        <div className="bg-white rounded-sm shadow-sm overflow-y-auto animate-pulse">
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div className="flex-1">
                    <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-72"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded w-20"></div>
            </div>

            {/* Body */}
            <div className="px-8 py-6">
                {/* Mission & Vision Section */}
                <div className="mb-10">
                    <div className="h-5 bg-gray-300 rounded w-48 mb-4 pb-2"></div>
                    
                    <div className="grid grid-cols-2 gap-8">
                        {/* Mission Skeleton */}
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                            </div>
                        </div>

                        {/* Vision Skeleton */}
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Organizational Structure Section */}
                <div className="mb-10">
                    <div className="h-5 bg-gray-300 rounded w-64 mb-4 pb-2"></div>
                    
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50">
                <div className="h-4 bg-gray-200 rounded w-80"></div>
            </div>
        </div>
    );
};

export default SkeletonAbout;