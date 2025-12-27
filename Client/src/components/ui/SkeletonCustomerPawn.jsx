import React from "react";

const SkeletonCustomerPawn = ({ rows = 3 }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden animate-pulse">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-teal-500 text-white sticky top-0 z-10">
                    <tr className="whitespace-nowrap">
                        <th className="px-6 py-6 text-left">
                            <div className="h-4 bg-teal-400 rounded w-16"></div>
                        </th>
                        <th className="px-6 py-6 text-left">
                            <div className="h-4 bg-teal-400 rounded w-12"></div>
                        </th>
                        <th className="px-6 py-6 text-left">
                            <div className="h-4 bg-teal-400 rounded w-20"></div>
                        </th>
                        <th className="px-6 py-6 text-left">
                            <div className="h-4 bg-teal-400 rounded w-24"></div>
                        </th>
                        <th className="px-6 py-6 text-left">
                            <div className="h-4 bg-teal-400 rounded w-16"></div>
                        </th>
                        <th className="px-6 py-6 text-left">
                            <div className="h-4 bg-teal-400 rounded w-28"></div>
                        </th>
                        <th className="px-6 py-6 text-left">
                            <div className="h-4 bg-teal-400 rounded w-24"></div>
                        </th>
                        <th className="px-6 py-6 text-left">
                            <div className="h-4 bg-teal-400 rounded w-16"></div>
                        </th>
                        <th className="px-6 py-6 text-left">
                            <div className="h-4 bg-teal-400 rounded w-16"></div>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {Array.from({ length: rows }).map((_, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-300 rounded w-24"></div>
                            </td>
                            <td className="px-6 py-6">
                                <div className="h-4 bg-gray-300 rounded w-20"></div>
                            </td>
                            <td className="px-6 py-6">
                                <div className="h-4 bg-gray-300 rounded w-32"></div>
                            </td>
                            <td className="px-6 py-6">
                                <div className="h-4 bg-gray-300 rounded w-20"></div>
                            </td>
                            <td className="px-6 py-6">
                                <div className="h-4 bg-gray-300 rounded w-20"></div>
                            </td>
                            <td className="px-6 py-6">
                                <div className="h-4 bg-gray-300 rounded w-20"></div>
                            </td>
                            <td className="px-6 py-6">
                                <div className="h-4 bg-gray-300 rounded w-20"></div>
                            </td>
                            <td className="px-6 py-6">
                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </td>
                            <td className="px-6 py-6">
                                <div className="h-4 bg-gray-300 rounded w-20"></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Footer Skeleton */}
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50">
                <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
        </div>
    );
};

export default SkeletonCustomerPawn;