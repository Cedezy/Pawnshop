import React from "react";

const SkeletonTransaction = ({ pawnItems = 2, actionsPerPawn = 3 }) => {
    return (
        <div className="overflow-y-auto flex-1">
            <div className="space-y-8 animate-pulse">
                {Array.from({ length: pawnItems }).map((_, pawnIndex) => (
                    <div key={pawnIndex} className="border-b border-gray-200 pb-6 last:border-b-0">
                        {/* Pawn Item Header */}
                        <div className="mb-4 pb-2 border-b border-gray-200 flex justify-between items-center">
                            <div className="h-5 bg-gray-300 rounded w-48"></div>
                            <div className="h-5 bg-gray-300 rounded w-20"></div>
                        </div>

                        {/* Transaction Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                <thead className="bg-gray-100 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-6 text-left">
                                            <div className="h-3 bg-gray-300 rounded w-20"></div>
                                        </th>
                                        <th className="px-4 py-6 text-left">
                                            <div className="h-3 bg-gray-300 rounded w-24"></div>
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            <div className="h-3 bg-gray-300 rounded w-24"></div>
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            <div className="h-3 bg-gray-300 rounded w-16"></div>
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            <div className="h-3 bg-gray-300 rounded w-16"></div>
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            <div className="h-3 bg-gray-300 rounded w-32"></div>
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            <div className="h-3 bg-gray-300 rounded w-24"></div>
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            <div className="h-3 bg-gray-300 rounded w-16"></div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Array.from({ length: actionsPerPawn }).map((_, actionIndex) => (
                                        <tr key={actionIndex}>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="h-4 bg-gray-300 rounded w-24"></div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="h-4 bg-gray-300 rounded w-20"></div>
                                            </td>
                                            <td className="px-4 py-6 whitespace-nowrap">
                                                <div className="h-4 bg-gray-300 rounded w-20"></div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="h-4 bg-gray-300 rounded w-12"></div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="h-4 bg-gray-300 rounded w-20"></div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="h-4 bg-gray-300 rounded w-24"></div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="h-4 bg-gray-300 rounded w-12"></div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkeletonTransaction;