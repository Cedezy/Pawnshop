import React from "react";

const SkeletonRate = ({ monthlyRows = 3, scheduleRows = 1 }) => {
    return (
        <div className="grid grid-cols-2 gap-10">
            {/* Monthly Rate Skeleton */}
            <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
                <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-6 text-left">
                                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                                </th>
                                <th className="px-6 py-3 text-left">
                                    <div className="h-3 bg-gray-300 rounded w-28"></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Array.from({ length: monthlyRows }).map((_, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="h-4 bg-gray-300 rounded w-12"></div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="px-6 py-4 border-t border-gray-300 bg-gray-50">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>

                <div className="flex gap-2 mt-3">
                    <div className="h-10 bg-gray-300 rounded w-16"></div>
                    <div className="h-10 bg-gray-300 rounded w-16"></div>
                </div>
            </div>

            {/* Payment Schedule Rate Skeleton */}
            <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-6 text-left">
                                    <div className="h-3 bg-gray-300 rounded w-20"></div>
                                </th>
                                <th className="px-6 py-6 text-left">
                                    <div className="h-3 bg-gray-300 rounded w-12"></div>
                                </th>
                                <th className="px-6 py-6 text-left">
                                    <div className="h-3 bg-gray-300 rounded w-12"></div>
                                </th>
                                <th className="px-6 py-6 text-left">
                                    <div className="h-3 bg-gray-300 rounded w-12"></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {Array.from({ length: scheduleRows }).map((_, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="h-4 bg-gray-300 rounded w-12"></div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="h-4 bg-gray-300 rounded w-12"></div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="h-4 bg-gray-300 rounded w-12"></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="px-6 py-4 border-t border-gray-300 bg-gray-50">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>

                <div className="flex gap-2 mt-3">
                    <div className="h-10 bg-gray-300 rounded w-16"></div>
                    <div className="h-10 bg-gray-300 rounded w-16"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonRate;