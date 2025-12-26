import React from "react";
import { shortFormatDate } from "../../utils/FormatDate";
import { formatCurrency } from "../../utils/FormatCurrency";
import { getStatusClass } from "../../utils/UserStatus";

const PawnDetailModal = ({ pawn, onClose }) => {
    if (!pawn) return null;

    const { customerId, itemName, itemPhotoUrl, appraisalValue, loanAmount, startDate, maturityDate, expiryDate, status, payments, renewals } = pawn;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-sm shadow-lg flex flex-col animate-fade-in">

                {/* Header */}
                <div className="bg-teal-600 px-6 py-4 flex justify-between items-center text-white">
                    <h2 className="text-lg font-medium">Pawn Details</h2>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusClass(status)}`}>
                        {status}
                    </span>
                </div>

                <div className="px-8 py-6 overflow-y-auto flex-1 space-y-6">
                    <div>
                        <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">CUSTOMER INFORMATION</h3>
                        <div className="grid grid-cols-4 gap-x-8 gap-y-4">
                             <div>
                                <p className="text-gray-500 text-sm mb-1">CUSTOMER ID</p>
                                <p className="text-gray-900 font-mono font-medium">
                                    CMR-{customerId?.userId?._id.slice(-6).toUpperCase()}                
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">FULL NAME</p>
                                <p className="text-gray-900 font-medium">
                                    {customerId?.userId?.firstname} {customerId?.userId?.middlename} {customerId?.userId?.lastname}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">CONTACT NUMBER</p>
                                <p className="text-gray-900 font-medium">{customerId?.phone}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-500 text-sm mb-1">ADDRESS</p>
                                <p className="text-gray-900 font-medium">
                                    {customerId?.street}, {customerId?.barangay}, {customerId?.city}, {customerId?.province}, {customerId?.zipCode}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">
                            PAWN INFORMATION
                        </h3>
                        <div className="flex gap-20">
                            {itemPhotoUrl && (
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">ITEM PHOTO</p>
                                    <img
                                        src={itemPhotoUrl}
                                        alt={itemName}
                                        className="w-32 h-32 object-cover rounded"
                                    />
                                </div>
                            )}

                            <div className="flex-1 grid grid-cols-3 gap-x-6 gap-y-4">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">ITEM NAME</p>
                                    <p className="text-gray-900 font-medium">{itemName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">APPRAISAL VALUE</p>
                                    <p className="text-gray-900 font-medium">{formatCurrency(appraisalValue)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">LOAN AMOUNT</p>
                                    <p className="text-gray-900 font-medium">{formatCurrency(loanAmount)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">START DATE</p>
                                    <p className="text-gray-900 font-medium">{shortFormatDate(startDate)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">MATURITY DATE</p>
                                    <p className="text-gray-900 font-medium">{shortFormatDate(maturityDate)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">EXPIRY DATE</p>
                                    <p className="text-gray-900 font-medium">{shortFormatDate(expiryDate)}</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Payments */}
                    <div>
                        <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">PAYMENTS</h3>
                        {payments.length > 0 ? (
                            payments.map((pay, idx) => (
                                <p key={idx}>₱{pay.amount.toLocaleString()} - {shortFormatDate(pay.date)}</p>
                            ))
                        ) : (
                            <p className="text-gray-500">No payments yet.</p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-gray-600 font-semibold mb-4 pb-2 border-b border-gray-300">RENEWALS</h3>
                        {renewals.length > 0 ? (
                            renewals.map((r, idx) => (
                                <p key={idx}>
                                    {shortFormatDate(r.oldMaturity)} → {shortFormatDate(r.newMaturity)} 
                                    {r.receiptId?.amount && ` (Interest Paid: ₱${r.receiptId.amount.toLocaleString()})`}
                                </p>
                            ))
                        ) : (
                            <p className="text-gray-500">No renewals yet.</p>
                        )}
                    </div>


                </div>

                <div className="px-4 py-4 border-t border-gray-300 flex justify-end gap-3 sticky bottom-0 bg-white z-10">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-sm cursor-pointer hover:bg-gray-100 ease-in-out duration-300 font-medium text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PawnDetailModal;
