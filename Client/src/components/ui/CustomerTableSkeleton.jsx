import React from 'react'

const CustomerTableSkeleton = ({ rows = 6 }) => {
    return (
        <tbody className="bg-white divide-y divide-gray-200 animate-pulse">
            {[...Array(rows)].map((_, i) => (
                <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-full" />
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
};

export default CustomerTableSkeleton;

