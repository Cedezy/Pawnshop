import React, { useEffect, useState } from "react";
import HeaderCustomer from "../../components/ui/HeaderCustomer";
import axios from "../../api/axios";
import { formatCurrency } from "../../utils/FormatCurrency";
import { shortFormatDate } from "../../utils/FormatDate";
import ReceiptModal from "../../components/modals/ReceiptModal";
import { Inbox } from "lucide-react";

const CustomerPawn = () => {
    const [pawns, setPawns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPawn, setSelectedPawn] = useState(null);
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    const fetchMyPawns = async () => {
        try{
        const res = await axios.get("/pawn/my-pawns", { withCredentials: true });
            setPawns(res.data.pawns);
        } catch (error) {
            console.error("Failed to load pawns", error);
        } finally {
            setLoading(false);
        }
    };

    const openReceipt = async (receiptId) => {
        if (!receiptId) return;
        try {
            const res = await axios.get(`/receipt/${receiptId}`);
            setSelectedReceipt(res.data.receipt);
        } catch (err) {
            console.error("Failed to fetch receipt:", err);
        }
    };

    useEffect(() => {
        fetchMyPawns();
    }, []);

    return (
         <div className="h-screen flex flex-col">
            <HeaderCustomer />
            <div className="flex-1 overflow-y-auto md:px-6 pb-4 md:pt-4">
                <div className="bg-white mx-auto md:max-w-7xl p-6 flex flex-col">
                    <div className="bg-gray-50 border border-gray-200 rounded-sm mb-6">
                        <div className="px-6 py-4 text-gray-800">
                            <h2 className="text-lg font-medium tracking-tight">
                                My Pawns
                            </h2>
                            <p className="text-sm opacity-90">
                                Here you can track all your pawned items and their current status. 
                                Click "View Details" to see all transactions for each item.
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                        </div>
                    ) : pawns.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                            <Inbox className="w-12 h-12 mx-auto mb-4" />
                            <p className="mb-2">No pawns found.</p>
                            <p className="text-sm opacity-80">
                                You haven’t pawned any items yet. Once you do, they’ll appear here for easy tracking.
                            </p>
                        </div>

                    ) : (
                        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-teal-500 text-white sticky top-0 z-10">
                                    <tr className="whitespace-nowrap">
                                        <th className="px-6 py-6 text-left text-sm font-medium uppercase">
                                            Pawn ID
                                        </th>
                                        <th className="px-6 py-6 text-left text-sm font-medium uppercase">
                                            Date
                                        </th>
                                        <th className="px-6 py-6 text-left text-sm font-medium uppercase">
                                            Item Name
                                        </th>
                                        <th className="px-6 py-6 text-left text-sm font-medium uppercase">
                                            Loan Amount
                                        </th>
                                        <th className="px-6 py-6 text-left text-sm font-medium uppercase">
                                            Balance
                                        </th>
                                        <th className="px-6 py-6 text-left text-sm font-medium uppercase">
                                            Maturity Date
                                        </th>
                                        <th className="px-6 py-6 text-left text-sm font-medium uppercase">
                                            Expiry Date
                                        </th>
                                        <th className="px-6 py-6 text-left text-sm font-medium uppercase">
                                            Status
                                        </th>
                                        <th className="px-6 py-6 text-left text-sm font-medium uppercase">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {pawns.map((pawn) => (
                                        <tr key={pawn.pawnId}>
                                            <td className="px-6 py-4 text-sm text-gray-800 font-mono font-semibold whitespace-nowrap">
                                                PAWN-{pawn.pawnId.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-6 text-sm text-gray-800">
                                                {shortFormatDate(pawn.startDate)}
                                            </td>
                                            <td className="px-6 py-6 text-sm text-gray-800">
                                                {pawn.itemName}
                                            </td>
                                            <td className="px-6 py-6 text-sm text-gray-900 font-medium">
                                                {formatCurrency(pawn.amount)}
                                            </td>
                                            <td className="px-6 py-6 text-sm text-gray-900 font-medium">
                                                {formatCurrency(pawn.balance)}
                                            </td>
                                            <td className="px-6 py-6 text-sm text-gray-800">
                                                {shortFormatDate(pawn.maturityDate)}
                                            </td>
                                            <td className="px-6 py-6 text-sm text-gray-800">
                                                {shortFormatDate(pawn.expiryDate)}
                                            </td>
                                            <td className="px-6 py-6 text-sm text-gray-800 font-medium">
                                                {pawn.status}
                                            </td>
                                             <td className="px-6 py-6 text-sm text-gray-800">
                                                <button
                                                    onClick={() => setSelectedPawn(pawn)}
                                                    className="cursor-pointer underline"
                                                >
                                                View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {!loading && pawns.length > 0 && (
                                <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 text-sm text-gray-700">
                                    <p>
                                        You have <span className="font-semibold">{pawns.length}</span> pawned {pawns.length > 1 ? "items" : "item"}.
                                    </p>
                                    <p className="mt-1">
                                        Remember to check the maturity dates to avoid penalties. Click "View Details" to see transaction history and receipts for each item.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {selectedPawn && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
                    <div className="bg-white rounded-sm shadow-lg w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
                        <div className="bg-teal-600 px-6 py-4 text-white sticky top-0 z-20">
                            <h2 className="text-lg font-medium">Transaction History</h2>
                            <p className="text-sm opacity-90 mt-1">
                                Review the detailed transactions including interest, penalties, and total paid. 
                                Click "View" under Receipt to see the official document.
                            </p>
                        </div>
                        <div className="border-t border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Receipt No.
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Transaction
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Interest
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Penalty
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Receipt
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedPawn.actions.map((action, idx) => (
                                            <tr 
                                                key={idx} 
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-4 py-4 text-sm">
                                                    <span className="font-mono font-semibold text-gray-900">
                                                        {action.receiptNumber || "-"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-700">
                                                    {shortFormatDate(action.actionDate)}
                                                </td>
                                                <td className="px-4 py-4 text-sm font-medium">
                                                        {action.actionType}     
                                                </td>
                                                <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                                                    {formatCurrency(action.amount)}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-700">
                                                    {action.interestRate ? (
                                                        <span className="font-medium">{action.interestRate}%</span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                    <td className="px-4 py-3 text-sm text-red-600">
                                                    {action.penalty ? formatCurrency(action.penalty) : "-"}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openReceipt(action.receiptId);
                                                        }}
                                                        className="text-teal-600 hover:text-teal-700 font-medium transition-colors cursor-pointer"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="px-4 py-4 border-t border-gray-300 flex justify-end sticky bottom-0 bg-white z-10">
                            <button
                                onClick={() => setSelectedPawn(false)}
                                className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-sm cursor-pointer hover:bg-gray-100 ease-in-out duration-300 font-medium text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>  
            )}

            <ReceiptModal
                isOpen={!!selectedReceipt}
                receipt={selectedReceipt}
                onClose={() => setSelectedReceipt(null)}
            />
        </div>
    );
};

export default CustomerPawn;
