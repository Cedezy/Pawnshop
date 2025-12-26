import { CheckCircle } from "lucide-react";

const PawnSuccessModal = ({
    isOpen,
    onClose,
    onViewReceipt,
    title,
    message,
    showViewReceipt = true
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-sm shadow-xl overflow-hidden animate-fade-in">
                <div className="bg-teal-50 px-6 pt-8 pb-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" strokeWidth={2.5} />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-700">
                        {title}
                    </h2>

                    <p className="text-gray-600 mt-2 text-sm">
                        {message}
                    </p>
                </div>

                <div className="px-6 py-6 space-y-3">
                    {showViewReceipt && (
                        <button
                            onClick={onViewReceipt}
                            className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-sm"
                        >
                            View Receipt
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PawnSuccessModal;
