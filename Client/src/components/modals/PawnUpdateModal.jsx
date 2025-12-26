import React, { useState } from "react";
import { X } from "lucide-react";
import { formatDate, shortFormatDate } from "../../utils/FormatDate";
import { formatCurrency } from "../../utils/FormatCurrency";
import { useToast } from "../../context/ToastContext";

const PawnUpdateModal = ({ pawn, onClose, onConfirm, mode = "redeem" }) => {
    const [amountPaid, setAmountPaid] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const balance = pawn?.balance || 0;
    const loanAmount = pawn?.loanAmount || 0;
    const totalPenalty = pawn?.totalPenalty || 0;

    // If mode is payment, use schedule rate, else use pawn.interestRate
    const currentInterestRate =
        mode === "payment"
            ? pawn.nextScheduleRate || 0
            : pawn.interestRate || 0;

    // Calculate interest based on the appropriate rate
    const currentInterest =
        mode === "payment"
            ? pawn.balance * (currentInterestRate / 100)
            : loanAmount * (currentInterestRate / 100);

    // Total amount calculation
    const totalAmount =
        mode === "renew"
            ? currentInterest
            : mode === "payment"
            ? pawn.balance + currentInterest + totalPenalty
        : balance + currentInterest + totalPenalty;



    if (!pawn) return null;

    const paid = amountPaid ? Number(amountPaid.replace(/,/g, "")) : totalAmount;
    const change = Math.max(0, paid - totalAmount);

    const handleNumberChange = (e) => {
        const value = e.target.value.replace(/,/g, "");
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setAmountPaid(value ? Number(value).toLocaleString("en-US") : "");
        }
    };

    const handleConfirm = async () => {
        const paidAmount = amountPaid ? Number(amountPaid.replace(/,/g, "")) : 0;

        if ((mode === "redeem" || mode === "renew") && paidAmount < totalAmount) {
            showToast(
                "Error",
                `Insufficient payment. Minimum due: ${formatCurrency(totalAmount)}`,
                "error"
            );
            return;
        }

        if (mode === "payment" && paidAmount <= 0) {
            showToast("Error", `Enter a valid amount!`, "error");
            return;
        }

        setLoading(true);
        try {
            await onConfirm({
                pawnId: pawn._id,
                amountPaid: paidAmount || totalAmount,
                paymentMethod,
                mode,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const headerText =
        mode === "renew" ? "Renew Pawn" :
        mode === "redeem" ? "Redeem Pawn" :
        "Record Payment";

    const actionText =
        mode === "renew" ? "Renew" :
        mode === "redeem" ? "Redeem" :
        "Pay";


    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-6xl rounded-sm shadow-lg animate-fade-in overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-teal-600 px-6 py-5 flex items-center justify-between">
                    <h2 className="text-xl font-medium text-gray-50">{headerText}</h2>
                    <button onClick={onClose} className="text-white hover:bg-teal-700 rounded-full p-1 transition-colors duration-200 cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                {/* Instruction */}
                <div className="bg-gray-50 px-6 py-2 border-b border-gray-200 text-sm text-gray-700">
                    {mode === "payment"
                        ? "Enter the amount the customer wants to pay. Partial payments are allowed."
                        : "Please review the pawn details carefully. Only the 'Amount Paid' field is editable. Ensure that the payment covers the total amount due."}
                </div>


                {/* Body */}
                <div className="overflow-y-auto flex-1 p-6 grid grid-cols-3 gap-10">
                    {/* Left & Middle */}
                     <div className="col-span-2">
                        {/* Pawn Details Grid */}
                        <div className="flex-1 grid grid-cols-3 gap-x-6 gap-y-4 mb-6">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">PAWN ID</p>
                                <p className="text-gray-900 font-medium">{`PAWN-${pawn._id.slice(-6).toUpperCase()}`}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">ITEM NAME</p>
                                <p className="text-gray-900 font-medium">{pawn.itemName}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">CUSTOMER</p>
                                <p className="text-gray-900 font-medium">
                                    {`${pawn.customerId?.userId?.firstname || ""} ${pawn.customerId?.userId?.lastname || ""}`}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">APPRAISAL VALUE</p>
                                <p className="text-gray-900 font-medium">{formatCurrency(pawn.appraisalValue)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">LOAN AMOUNT</p>
                                <p className="text-gray-900 font-medium">{formatCurrency(loanAmount)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">START DATE</p>
                                <p className="text-gray-900 font-medium">{shortFormatDate(pawn.startDate)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">MATURITY DATE</p>
                                <p className="text-gray-900 font-medium">{shortFormatDate(pawn.maturityDate)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">EXPIRY DATE</p>
                                <p className="text-gray-900 font-medium">{shortFormatDate(pawn.expiryDate)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">STATUS</p>
                                <p className="text-gray-900 font-medium">{pawn.status}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">INTEREST TYPE</p>
                                <p className="text-gray-900 font-medium">{pawn.interestType}</p>
                            </div>

                            {/* Renewals */}
                            {pawn.renewals?.length > 0 && (
                                <div className="col-span-3 border-t border-gray-300 pt-2">
                                    <p className="text-gray-500 text-sm mb-1">RENEWALS</p>
                                    <ul className="text-xs text-gray-600 mt-1 space-y-1">
                                        {pawn.renewals.map((r, idx) => (
                                            <li key={idx}>
                                                {`Old: ${formatDate(r.oldMaturity)}, New: ${formatDate(r.newMaturity)}, Additional Interest: ${formatCurrency(r.additionalInterest)}`}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3 mb-6">
                            {(mode === "redeem" || mode === "payment") && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Balance</span>
                                    <span className="font-medium text-gray-800">{formatCurrency(balance)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">
                                    Interest ({currentInterestRate}%)
                                </span>
                                <span className="font-medium text-gray-800">
                                    {formatCurrency(currentInterest)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Total Penalty</span>
                                <span className="font-medium text-gray-800">{formatCurrency(totalPenalty)}</span>
                            </div>
                            <div className="flex justify-between items-center border-t-2 border-gray-300 pt-3">
                                <span className="font-semibold text-gray-800">Total to Pay</span>
                                <span className="font-semibold text-teal-900 text-lg">{formatCurrency(totalAmount)}</span>
                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                                Note: The suggested amount includes balance, interest, and penalties. Enter a higher amount if you want change.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="border-b border-gray-200 py-2">
                            <h2 className="text-sm font-semibold text-gray-700">
                                Payment Details
                            </h2>
                            <p className="text-xs text-gray-500">
                                Enter the amount paid by the customer. Make sure it covers the total amount due.
                            </p>
                        </div>

                        <div className="relative w-full">
                            <input
                                type="text"
                                value={amountPaid}
                                onChange={handleNumberChange}
                                placeholder=" "
                                className="peer w-full border-b-2 border-gray-300 focus:border-teal-500 text-gray-700 font-bold text-xl pt-4 pb-1 outline-none"
                            />
                            <label className="absolute left-0 -top-1 text-xs text-gray-500 transition-all duration-200
                                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400
                                peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-teal-500 peer-focus:text-xs">
                                Amount Paid (₱) <span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1">Suggested: {formatCurrency(totalAmount)}</p>
                        </div>

                        <div className="relative w-full">
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="peer w-full border-b-2 border-gray-300 focus:border-teal-500 text-sm pt-4 pb-1 outline-none bg-white"
                            >
                                <option>Cash</option>
                                <option>GCash</option>
                                <option>Bank Transfer</option>
                            </select>
                            <label className="absolute left-0 -top-1 text-xs text-gray-500">
                                Payment Method <span className="text-red-500">*</span>
                            </label>
                        </div>

                        {paid > totalAmount && (
                            <div className="flex justify-between items-center bg-green-50 border-2 border-green-200 rounded-md p-2 mt-2">
                                <span className="font-medium text-green-800">Change:</span>
                                <span className="font-semibold text-green-700">{formatCurrency(change)}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                    <div className="text-xs text-gray-600 mr-auto flex items-center">
                        * Make sure the payment method selected is correct before confirming.
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-sm cursor-pointer hover:bg-gray-100 ease-in-out duration-300 font-medium text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="px-6 py-2 bg-teal-600 text-white rounded-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed ease-in-out duration-300 font-medium text-sm flex items-center gap-2 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            actionText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default PawnUpdateModal;
