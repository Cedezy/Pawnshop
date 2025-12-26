import React from "react";
import { formatCurrency } from "../../utils/FormatCurrency";
import { shortFormatDate } from "../../utils/FormatDate";

const ReceiptModal = ({ isOpen, onClose, receipt }) => {
    if (!isOpen || !receipt) return null;

    const { actionType } = receipt;
    const customer = receipt.customerId?.userId;
    const pawn = receipt.pawnId;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
           <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-sm shadow-2xl flex flex-col animate-fade-in">
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="flex justify-between items-start">
                        <div className="text-left">
                            <div className="text-xl font-bold mb-2">ORIGINAL</div>
                        </div>
                        
                        <div className="text-center flex-1 flex flex-col px-4">
                            <h2 className="text-3xl font-bold">F. A. PAWNSHOP</h2>
                            <span className="text-sm leading-4">Warlito Pulmones 7016, Pagadian City, Zamboanga del Sur</span>
                            <span className="text-sm">
                                FERDINAND P. PULMONES - PROP. NON VAT TIN: 156231-345-0000
                            </span>
                            <span className="text-xs">
                                Monday - Sunday * 8:00 AM - 5:00 PM
                            </span>
                        </div>

                        <div className="text-right">
                            <div className="border-2 border-black px-3 py-1 inline-block">
                                <div className="text-sm">Serial No.</div>
                                <div className="text-xl font-bold">{receipt.receiptNumber || "-"}</div>
                            </div>
                        </div>                        
                    </div>

                    <div className="flex justify-end mb-4 text-sm">
                        <div className="text-right">
                            <span className="font-semibold">Maturity Date:</span> {shortFormatDate(receipt.newMaturity || pawn?.maturityDate)}
                        </div>
                    </div>

                    <div className="flex justify-between text-sm text-right">
                        <div className="flex justify-center items-center gap-4">
                            <h2 className="font-semibold">Date Loan Granted:</h2> 
                            <span className="text-lg border-b border-black px-2">
                                {shortFormatDate(pawn?.startDate)}
                            </span>
                        </div>
                        <div className="flex justify-center items-center gap-4">
                            <h2 className="font-semibold">Expiry Date of Redemption Period:</h2> 
                            <span className="text-lg border-b border-black">
                                {shortFormatDate(pawn?.expiryDate)}
                            </span>
                        </div>
                    </div>

                    
                    <div className="py-3 mb-4 text-sm">
                        {actionType === "Pawn" && (
                            <div className="mb-1 leading-6">
                                <p className="font-medium">
                                    Mr./Mrs./Miss. <span className="underline font-bold">{customer?.firstname} {customer?.lastname}</span> a resident of  <span className="underline font-bold">{receipt.customerId ? 
                                    `${receipt.customerId.street}, ${receipt.customerId.barangay}, ${receipt.customerId.city}, ${receipt.customerId.province}` 
                                    : "________________"}</span>  for a loan of PESOS <span className="underline font-bold">{formatCurrency(receipt.amount)}</span> with an interest of <span className="underline">{pawn?.interestRate}</span> percent (<span className="underline">{pawn?.interestRate}</span> %) for (<span className="underline">1</span> days/month), has pledged to this Pawnee, as security for the loan article(s) described below appraised at PESOS <span className="underline font-bold">{formatCurrency(pawn?.appraisalValue)}</span> subject to the terms and conditions stated on the reverse side hereof. Penalty interest, if any: ___________
                                </p>
                            </div>
                        )}

                        {actionType === "Renewal" && (
                            <div className="mb-1">
                                <p className="font-medium">
                                    Mr./Mrs./Miss. <span className="underline font-bold">{customer?.firstname} {customer?.lastname}</span> a resident of  <span className="underline font-bold">{receipt.customerId ? 
                                    `${receipt.customerId.street}, ${receipt.customerId.barangay}, ${receipt.customerId.city}, ${receipt.customerId.province}` 
                                    : "________________"}</span>  for a loan of PESOS <span className="underline font-bold">{formatCurrency(receipt.amount)}</span> with an interest of <span className="underline">{pawn?.interestRate}</span> percent (<span className="underline">{pawn?.interestRate}</span> %) for (<span className="underline">1</span> days/month), has pledged to this Pawnee, as security for the loan article(s) described below appraised at PESOS <span className="underline font-bold">{formatCurrency(pawn?.appraisalValue)}</span> subject to the terms and conditions stated on the reverse side hereof. Penalty interest, if any: ___________
                                </p>
                            </div>
                        )}

                        {actionType === "Redemption" && (
                            <div className="mb-1">
                                <p className="font-medium">
                                    Mr./Mrs./Miss. <span className="underline font-bold">{customer?.firstname} {customer?.lastname}</span> a resident of  <span className="underline font-bold">{receipt.customerId ? 
                                    `${receipt.customerId.street}, ${receipt.customerId.barangay}, ${receipt.customerId.city}, ${receipt.customerId.province}` 
                                    : "________________"}</span>  for a loan of PESOS <span className="underline font-bold">{formatCurrency(receipt.amount)}</span> with an interest of <span className="underline">{pawn?.interestRate}</span> percent (<span className="underline">{pawn?.interestRate}</span> %) for (<span className="underline">1</span> days/month), has pledged to this Pawnee, as security for the loan article(s) described below appraised at PESOS <span className="underline font-bold">{formatCurrency(pawn?.appraisalValue)}</span> subject to the terms and conditions stated on the reverse side hereof. Penalty interest, if any: ___________
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <div className="tracking-tight text-center uppercase mb-1">
                                Description of the Pawn
                            </div>
                            <div className="border-2 border-black p-3 min-h-[120px] bg-white">
                                <div className="font-semibold">{pawn?.itemName || "Item description"}</div>
                                <div className="text-xs mt-2 text-gray-600">
                                    {pawn?.description || ""}
                                </div>
                            </div>
                            
                          
                            <div className="mt-4 space-y-1">
                                <div className="text-sm">
                                    <div className="font-semibold">ID Presented: <span className="border-b border-black">{receipt.customerId?.idType}</span></div>
                                </div>
                                
                                <div className="text-sm">
                                    <div className="font-semibold">Contact No. <span className="border-b border-black">{receipt.customerId?.phone}</span></div>
                                </div>
                            </div>
                        
                        </div>

                        <div>
                            {actionType === "Pawn" && (
                                <div className="border-2 border-black">
                                    <table className="w-full text-sm">
                                        <tbody>
                                            <tr className="border-b border-black">
                                                <td className="p-2 font-semibold">Principal</td>
                                                <td className="p-2 text-right font-bold">{formatCurrency(receipt.amount)}</td>
                                            </tr>
                                            <tr className="border-b border-black">
                                                <td className="p-2 font-semibold">Interest in absolute amount</td>
                                                <td className="p-2 text-right">{formatCurrency(pawn?.interestAmount || 0)}</td>
                                            </tr>
                                            <tr className="border-b border-black">
                                                <td className="p-2 font-semibold">Service Charge in amount</td>
                                                <td className="p-2 text-right">₱ 0</td>
                                            </tr>
                                            <tr className="border-b border-black bg-amber-100">
                                                <td className="p-2 font-bold">Net Proceeds</td>
                                                <td className="p-2 text-right font-bold">{formatCurrency(receipt.amount)}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2" className="p-2 text-xs">
                                                    <div className="font-semibold">Effective Interest Rate in Percent</div>
                                                    <div className="mt-1">
                                                        <label className="mr-3">
                                                            <input type="checkbox" className="mr-1" />
                                                            Per annum
                                                        </label>
                                                        <label className="mr-3">
                                                            <input type="checkbox" checked readOnly className="mr-1" />
                                                            Per Month
                                                        </label>
                                                        <label>
                                                            <input type="checkbox" className="mr-1" />
                                                            (Others)
                                                        </label>
                                                    </div>
                                                    <div className="mt-1 text-xs italic">
                                                        * Formula (Principal x Rate x Time)
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Other Transaction Types */}
                            {actionType === "Renewal" && (
                                <div className="border-2 border-black p-4">
                                    <div className="font-bold text-center mb-3">RENEWAL</div>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>Item:</strong> {pawn?.itemName}</p>
                                        <p><strong>Old Maturity Date:</strong> {shortFormatDate(receipt.oldMaturity)}</p>
                                        <p><strong>New Maturity Date:</strong> {shortFormatDate(receipt.newMaturity)}</p>
                                    </div>
                                </div>
                            )}

                            {actionType === "Payment" && (
                                <div className="border-2 border-black p-4">
                                    <div className="font-bold text-center mb-3">PAYMENT</div>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>Item:</strong> {pawn?.itemName}</p>
                                        <p><strong>Payment Amount:</strong> {formatCurrency(receipt.amount)}</p>
                                        {receipt.interestPaid > 0 && (
                                            <p><strong>Interest Paid:</strong> {formatCurrency(receipt.interestPaid)}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {actionType === "Redemption" && (
                                <div className="border-2 border-black p-4">
                                    <div className="font-bold text-center mb-3 text-green-700">REDEMPTION</div>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>Item:</strong> {pawn?.itemName}</p>
                                        <p><strong>Total Paid:</strong> {formatCurrency(receipt.amount)}</p>
                                        <p className="text-green-600 font-bold mt-3 text-center">
                                            ✓ ITEM SUCCESSFULLY REDEEMED
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-4">
                        <div className="text-center mt-12">
                            <div className="border-t-2 border-black w-80 mx-auto"></div>
                            <span className="text-xs mt-1 whitespace-nowrap">
                                (Signature or Thumbmark of Pawner)
                            </span>
                        </div>
                        <div className="text-center mt-12">
                            <div className="border-t-2 border-black w-80 mx-auto"></div>
                            <span className="text-xs mt-1 whitespace-nowrap">
                                (Signature of Pawnshop's Authorized Representative)
                            </span>
                        </div>
                    </div>

                    <div className="pt-2 text-center">
                        <div className="font-bold text-xs mb-1">
                            PAWNER IS ADVISED TO READ AND UNDERSTAND THE TERMS AND CONDITIONS ON THE REVERSE SIDE HEREOF
                        </div>
                        <div className="text-xs italic">
                            "THIS DOCUMENT IS NOT VALID FOR CLAIMING INPUT TAXES"
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white border-t border-gray-300 px-6 py-4 flex justify-end gap-2">
                    <button
                        onClick={() => window.print()}
                        className="px-6 py-2 bg-gray-700 text-white rounded-sm hover:bg-gray-800 font-medium text-sm cursor-pointer ease-in-out duration-300"  
                    >
                        Print Receipt
                    </button>

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

export default ReceiptModal;