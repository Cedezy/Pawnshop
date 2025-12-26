// utils/status.js
export const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
        case "active":
            return "bg-green-100 text-green-800";
        case "inactive":
            return "bg-gray-100 text-gray-600";
        case "blacklisted":
            return "bg-red-100 text-red-800";
        default:
        return "bg-gray-100 text-gray-600";
    }
};
