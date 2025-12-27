import React from "react";

const SkeletonFAQs = ({ rows = 5 }) => {
    return (
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-y-auto animate-pulse">
            <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr className="whitespace-nowrap">
                        <th className="px-6 py-6 text-left">
                            <div className="h-3 bg-gray-300 rounded w-20"></div>
                        </th>
                        <th className="px-6 py-3 text-left">
                            <div className="h-3 bg-gray-300 rounded w-16"></div>
                        </th>
                        <th className="px-6 py-3 text-left">
                            <div className="h-3 bg-gray-300 rounded w-24"></div>
                        </th>
                        <th className="px-6 py-3 text-left">
                            <div className="h-3 bg-gray-300 rounded w-24"></div>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {Array.from({ length: rows }).map((_, index) => (
                        <tr key={index}>
                            <td className="px-6 py-6">
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-300 rounded w-28"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-300 rounded w-28"></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SkeletonFAQs;