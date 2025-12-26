const DashboardSkeleton = () => {
    return (
        <div className="mx-auto md:max-w-7xl p-6 flex flex-col gap-6 animate-pulse">
            
            {/* Welcome Card */}
            <div className="bg-white rounded-lg p-8 shadow-sm space-y-3">
                <div className="h-6 w-64 bg-gray-200 rounded"></div>
                <div className="h-4 w-96 bg-gray-200 rounded"></div>
                <div className="h-4 w-80 bg-gray-200 rounded"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                
                {/* Actions Skeleton */}
                <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                    <div className="h-5 w-40 bg-gray-200 rounded"></div>
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex gap-3">
                            <div className="w-3 h-3 bg-gray-200 rounded-full mt-2"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-48 bg-gray-200 rounded"></div>
                                <div className="h-3 w-64 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reminders Skeleton */}
                <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                    <div className="h-5 w-48 bg-gray-200 rounded"></div>
                    {[1, 2, 3, 4].map((_, i) => (
                        <div key={i} className="h-3 w-full bg-gray-200 rounded"></div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default DashboardSkeleton;
