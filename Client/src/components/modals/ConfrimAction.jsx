const ConfirmActionModal = ({ isOpen, type, onConfirm, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-sm p-6 w-96">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    Confirm {type === "redeem" ? "Redemption" : "Renewal"}
                </h2>

                <p className="text-gray-600 mb-6">
                    Are you sure you want to {type} this pawn?
                </p>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-sm"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-sm"
                    >
                        Yes, Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmActionModal;