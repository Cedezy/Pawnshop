import React, { useState } from "react";
import ReceiptModal from "./ReceiptModal";
import axios from "../../api/axios";
import { formatCurrency } from "../../utils/FormatCurrency";
import { shortFormatDate } from "../../utils/FormatDate";
import SkeletonTransaction from "../ui/SkeletonTransaction";
import { Inbox } from "lucide-react";

const TransactionHistoryModal = ({ isOpen, onClose, transactionHistory }) => {
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    if (!isOpen) return null;

    const isLoading = transactionHistory === null;

    const openReceipt = async (receiptId) => {
        if(!receiptId) return;
        try{
            const response = await axios.get(`/receipt/${receiptId}`, {
                withCredentials: true
            });
            setSelectedReceipt(response.data.receipt);
        } 
        catch(err){
            console.error("Failed to fetch receipt:", err);
        }

    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-white rounded-sm shadow-lg w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
                <div className="bg-teal-600 px-6 py-4 text-white sticky top-0 z-20">
                    <h2 className="text-lg font-medium">Transaction History</h2>
                    <p className="text-sm">
                        Click "View" under the Receipt column to see the official document for each transaction.
                    </p>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {isLoading ? (
                        <SkeletonTransaction/>
                    ) : transactionHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-gray-500">
                            <Inbox className="w-12 h-12 text-gray-400" />
                            <span className="text-lg font-semibold">No transactions found</span>
                            <span className="text-sm text-gray-400">
                                Transactions will appear here once they are recorded.
                            </span>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {transactionHistory.map((pawn) => (
                                <div key={pawn.pawnId} className="border-b border-gray-200 pb-6 last:border-b-0">
                                    <div className="mb-4 pb-2 border-b border-gray-200 flex justify-between items-center">
                                        <h3 className="text-gray-900 font-semibold text-base">
                                            {pawn.itemName}
                                        </h3>
                                        <span className="font-medium text-sm">
                                            {pawn.status}
                                        </span>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                            <thead className="bg-gray-100 sticky top-0 z-10">
                                                <tr>
                                                    <th className="px-4 py-6 text-left text-xs font-semibold text-gray-600 uppercase">
                                                        Receipt no.
                                                    </th>
                                                    <th className="px-4 py-6 text-left text-xs font-semibold text-gray-600 uppercase">
                                                        Action Date
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                        Action Type
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                        Amount
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                        Interest
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                        New Maturity Date
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                        Processed by
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                        Receipt
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {pawn.actions.map((action, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50 text-sm text-gray-900">
                                                        <td className="px-4 py-3 whitespace-nowrap font-mono font-semibold">
                                                            {action.receiptNumber || "-"}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            {shortFormatDate(action.actionDate)}
                                                        </td>
                                                        <td className="px-4 py-6 whitespace-nowrap font-medium">{action.actionType}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            {formatCurrency(action.amount)}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            {action.interestRate ? `${action.interestRate}%` : "-"}
                                                        </td>

                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            {action.actionType === "Renewal" && action.newMaturityDate
                                                            ? shortFormatDate(action.newMaturityDate)
                                                            : "-"}
                                                        </td>

                                                        <td className="px-4 py-3 whitespace-nowrap">{action.staff || "-"}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <button  onClick={() => openReceipt(action.receiptId)}
                                                                className="text-teal-600 hover:text-teal-800 underline font-medium text-sm cursor-pointer">
                                                            View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-4 py-4 border-t border-gray-300 flex justify-end sticky bottom-0 bg-white z-10">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-sm cursor-pointer hover:bg-gray-100 ease-in-out duration-300 font-medium text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>

            <ReceiptModal
                isOpen={!!selectedReceipt}
                receipt={selectedReceipt} 
                onClose={() => setSelectedReceipt(null)}
            />
          
        </div>
    );
};

export default TransactionHistoryModal;
