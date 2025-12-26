import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import SidebarManager from "../../components/ui/SidebarManager";
import HeaderStaff from "../../components/ui/HeaderStaff";
import CreatePawnModal from "../../components/modals/CreatePawnModal";
import CustomerListModal from "../../components/modals/CustomerListModal";
import PawnDetailModal from "../../components/modals/PawnDetailModal";
import PawnUpdateModal from "../../components/modals/PawnUpdateModal";
import PawnSuccessModal from "../../components/modals/PawnSuccessModal";
import ReceiptModal from "../../components/modals/ReceiptModal";
import { shortFormatDate } from "../../utils/FormatDate";
import { formatCurrency } from "../../utils/FormatCurrency";
import { useRef } from 'react';
import { handlePrint } from '../../utils/PrintUtils';
import { UserX, Printer, Search } from "lucide-react";

const ManagerPawn = () => {
    const [customers, setCustomers] = useState([]);
    const [pawns, setPawns] = useState([]);
    const [manager, SetManager] = useState(null);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("All"); 
    const [filteredPawns, setFilteredPawns] = useState([]);
    const [startRange, setStartRange] = useState("");
    const [endRange, setEndRange] = useState("");
    const [selectedPawn, setSelectedPawn] = useState(null);
    const [detailPawn, setDetailPawn] = useState(null);
    const [isCreatePawnOpen, setIsCreatePawnOpen] = useState(false);
    const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [receipt, setReceipt] = useState(null);
    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [showRenewModal, setShowRenewModal] = useState(false);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [successConfig, setSuccessConfig] = useState({
        open: false,
        title: "",
        message: ""
    });
    const printRef = useRef();

    useEffect(() => {
        const fetchManagerData = async () => {
            try{
                const response = await axios.get('user/me', {
                    withCredentials: true
                });
                SetManager(response.data.user)
            }
            catch(err){
                console.log(err);
            }
        }
        fetchManagerData();
    }, []);

    const fetchCustomers = async () => {
        try{
            const response = await axios.get("/customer", { 
                withCredentials: true 
            });
            setCustomers(response.data.customers || []);
        } 
        catch(err){
            console.error("Error fetching customers:", err);
        }
    };

    const fetchPawns = async () => {
        try{
            const response = await axios.get("/pawn", { 
                withCredentials: true 
            });
            setPawns(response.data.pawns || []);
            setFilteredPawns(response.data.pawns || []);
        } 
        catch(err){
            console.error("Error fetching pawns:", err);
        }
    };

    useEffect(() => {
        const fetchData = () => {
            fetchCustomers(); 
            fetchPawns();
        };
        fetchData();
    }, []);

    const onSubmit = async (data) => {
        try{
            const response = await axios.post("/pawn", data, { 
                withCredentials: true 
            });
            setIsCreatePawnOpen(false); 
            openSuccessWithReceipt(
                response.data.receipt,
                "Pawn Created Successfully!",
                "The pawn transaction has been recorded in the system."
            );   
            fetchPawns();       
        } 
        catch(err){
            console.log("Failed to create pawn.", err);
        }
    };

    const handleRedeem = () => {
        if (!selectedPawn) return;
        setShowRedeemModal(true);
    };

    const handleConfirmRedeem = async () => {
        try{
            const response = await axios.post(`/pawn/${selectedPawn._id}/redeem`, {
                withCredentials: true
            });
            openSuccessWithReceipt(
                response.data.receipt,
                "Pawn Redeemed Successfully",
                "The pawn has been redeemed."
            );
            fetchPawns();
            setSelectedPawn(null);
            setShowRedeemModal(false);
            setSelectedPawn(null);
        } 
        catch (error) {
            console.error(error);
        }
    };

    const handleRenew = async () => {
        if(!selectedPawn) return;
        setShowRenewModal(true);
    };

    const handleConfirmRenew = async () => {
        try{
            const response = await axios.post(`/pawn/${selectedPawn._id}/renew`, {
                withCredentials: true
            });
            openSuccessWithReceipt(
                response.data.receipt,
                "Pawn Renewed Successfully",
                "The pawn has been renewed."
            );
            fetchPawns();
            setSelectedPawn(null);
            setShowRenewModal(false);
            setSelectedPawn(null);
        } 
        catch (error) {
            console.error(error);
        }
    };

    const handlePayment = async () => {
        if (!selectedPawn) return;

        const input = prompt("Enter payment amount:");
        if (!input) return;

        const amount = parseFloat(input);
        if (isNaN(amount) || amount <= 0) {
            alert("Invalid amount");
            return;
        }

        if (selectedPawn.interestBalance <= 0) {
            alert("No interest due to pay at the moment. Try Renew or Redeem instead.");
            return;
        }


        try {
            const res = await axios.post(`/pawn/${selectedPawn._id}/payment`, {
                amount
            }, { withCredentials: true });
            fetchPawns();
            setSelectedPawn(null);
            openSuccessWithReceipt(
                res.data.receipt,
                "Payment Recorded Successfully!",
                "The interest payment has been saved."
            );
        } catch (err) {
            console.error(err);
            alert("Failed to add payment.");
        }
    };

    const openSuccessWithReceipt = (receipt, title, message) => {
        setReceipt(receipt);
        setSuccessConfig({
            open: true,
            title,
            message
        });
    };

    const handleSearch = () => {
        let results = [...pawns];
        const lowerSearch = search.trim().toLowerCase();

        if (filterType === "status") {
            results = pawns.filter((p) => {
                const statusMatch = p.status?.toLowerCase().includes(lowerSearch);

                if (!statusMatch) return false;
                if (startRange || endRange) {
                    const dateField = p.startDate?.slice(0, 10); 

                    if (!dateField) return false;

                    if (startRange && endRange) return dateField >= startRange && dateField <= endRange;
                    if (startRange && !endRange) return dateField >= startRange;
                    if (!startRange && endRange) return dateField <= endRange;
                }

                return true;
            });

            setFilteredPawns(results);
            return;
        }

        if (["startDate", "maturityDate", "expiryDate"].includes(filterType)) {
            results = pawns.filter((p) => {
                let dateField = "";
                if (filterType === "startDate") dateField = p.startDate?.slice(0, 10);
                if (filterType === "maturityDate") dateField = p.maturityDate?.slice(0, 10);
                if (filterType === "expiryDate") dateField = p.expiryDate?.slice(0, 10);

                if (!dateField) return false;

                if (startRange && endRange) return dateField >= startRange && dateField <= endRange;
                if (startRange && !endRange) return dateField >= startRange;
                if (!startRange && endRange) return dateField <= endRange;

                return true;
            });

            setFilteredPawns(results);
            return;
        }
        results = pawns.filter((p) => {
            const firstname = p.customerId?.userId?.firstname?.toLowerCase() || "";
            const lastname = p.customerId?.userId?.lastname?.toLowerCase() || "";
            const fullname = `${firstname} ${lastname}`;

            const startDate = p.startDate?.slice(0, 10) || "";
            const maturityDate = p.maturityDate?.slice(0, 10) || "";
            const expiryDate = p.expiryDate?.slice(0, 10) || "";

            if (filterType === "name") {
                return firstname.includes(lowerSearch) || lastname.includes(lowerSearch) || fullname.includes(lowerSearch);
            }

            if (filterType === "all") {
                return (
                    firstname.includes(lowerSearch) ||
                    lastname.includes(lowerSearch) ||
                    fullname.includes(lowerSearch) ||
                    startDate.includes(lowerSearch) ||
                    maturityDate.includes(lowerSearch) ||
                    expiryDate.includes(lowerSearch) ||
                    p.status?.toLowerCase().includes(lowerSearch)
                );
            }

            return true;
        });

        if (lowerSearch === "") {
            setFilteredPawns(pawns);
            return;
        }

        setFilteredPawns(results);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch("");
            setStartRange("");
            setEndRange("");
            setFilteredPawns(pawns);
        }, 0);

        return () => clearTimeout(timer);
    }, [filterType, pawns]);

    return (
        <div className="flex h-screen overflow-hidden">
           
            <SidebarManager/>  
            <div className="flex flex-col flex-1">
                <HeaderStaff/>
                <div className="px-6 pb-4 flex flex-col gap-5 h-screen pt-4 overflow-hidden">
                    <div className='flex justify-center items-center'>
                        <span className='text-2xl tracking-tighter font-medium uppercase text-gray-700'>
                            List of Pawns
                        </span>
                    </div>

                    <div className="flex flex-col justify-center md:flex-row gap-2 items-center">
                        <div className="relative flex items-center gap-2">
                            <span className="absolute -top-2 left-2 bg-white px-2 text-xs text-gray-600">
                                Search by
                            </span>

                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-3 py-2 border-2 border-gray-400 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none cursor-pointer"
                            >
                                <option value="all">All</option>
                                <option value="name">Customer Name</option>
                                <option value="startDate">Start Date</option>
                                <option value="maturityDate">Maturity Date</option>
                                <option value="expiryDate">Expiry Date</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                        <div className="relative flex items-center gap-2">
                            {["startDate", "maturityDate", "expiryDate", "status"].includes(filterType) ? (
                                <>
                                    {filterType === "status" && (
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-600 ml-1 absolute -top-2 px-2 bg-white">Status</span>
                                            <select
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="px-3 py-2 border-2 border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">All</option>
                                                <option value="active">Active</option>
                                                <option value="renewed">Renewed</option>
                                                <option value="redeemed">Redeemed</option>
                                                <option value="expired">Expired</option>
                                            </select>
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-600 ml-1 absolute -top-2 px-2 bg-white">From</span>
                                        <input
                                            type="date"
                                            value={startRange}
                                            onChange={(e) => setStartRange(e.target.value)}
                                            className="px-3 py-2 border-2 border-gray-400 rounded-md focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-600 ml-1 absolute -top-2 px-2 bg-white">To</span>
                                        <input
                                            type="date"
                                            value={endRange}
                                            onChange={(e) => setEndRange(e.target.value)}
                                            className="px-3 py-2 border-2 border-gray-400 rounded-md focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="w-4 h-4 text-gray-400" />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder={filterType === "name" ? "Search by name" : "Search"}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                        className="px-8 py-2 border-2 border-gray-400 rounded-md w-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleSearch}
                                className="px-5 py-2 bg-yellow-500 text-white rounded-sm cursor-pointer 
                                        hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 flex items-center gap-1"
                            >
                                Search
                            </button>
                        </div>

                    </div>

                    <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-y-auto">
                        <h1 className="print-title hidden">List of Pawns</h1>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                                <tr className="whitespace-nowrap">
                                    <th className="px-4 py-6 text-left text-xs font-medium text-gray-900 uppercase whitespace-nowrap">
                                        PAWN ID
                                    </th>
                                    <th className="px-4 py-6 text-left text-xs font-medium text-gray-900 uppercase whitespace-nowrap">
                                        Customer Name
                                    </th>
                                    <th className="px-6 py-6 text-left text-xs font-medium text-gray-900 uppercase">
                                        Item name
                                    </th>
                                    <th className="px-6 py-6 text-left text-xs font-medium text-gray-900 uppercase">
                                        Loan Amount
                                    </th>
                                    <th className="px-6 py-6 text-left text-xs font-medium text-gray-900 uppercase whitespace-nowrap">
                                        Start Date
                                    </th>
                                    <th className="px-6 py-6 text-left text-xs font-medium text-gray-900e uppercase whitespace-nowrap">
                                        Maturity Date
                                    </th>
                                    <th className="px-6 py-6 text-left text-xs font-medium text-gray-900 uppercase whitespace-nowrap">
                                        Expiry Date
                                    </th>
                                    <th className="px-6 py-6 text-left text-xs font-medium text-gray-900 uppercase">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {pawns.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-16">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                    <UserX className="w-8 h-8 text-gray-400" />                             
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-700 mb-2">No pawns yet!</h3>
                                                <p className="text-gray-500">Pawns will appear here once they submit a request.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredPawns.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-16">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                    <UserX className="w-8 h-8 text-gray-400" />                             
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-700 mb-2">No records found!</h3>
                                                <p className="text-gray-500">Try adjusting your search keywords.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPawns.map((p) => (
                                        <tr
                                            key={p._id}
                                            className={`transition ease-in-out duration-300 ${
                                                selectedPawn?._id === p._id ? "bg-yellow-100" : ""
                                            } ${p.status === "Redeemed" ? "cursor-pointer hover:bg-gray-50" : "cursor-pointer hover:bg-gray-50"}`}
                                            onClick={() => {
                                                if (p.status !== "Redeemed") {
                                                setSelectedPawn(p);
                                                }
                                            }}
                                            onDoubleClick={() => setDetailPawn(p)}
                                        >
                                            <td className="px-4 py-4 text-sm text-gray-800 font-mono font-semibold whitespace-nowrap">
                                                PAWN-{p._id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                {p.customerId?.userId?.firstname} {p.customerId?.userId?.lastname}
                                            </td>

                                            <td className="px-6 py-6 text-sm text-gray-800">
                                                {p.itemName}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                                {formatCurrency(p.loanAmount)}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                {shortFormatDate(p.startDate)}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                {shortFormatDate(p.maturityDate)}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                {shortFormatDate(p.expiryDate)}
                                            </td>

                                            <td
                                                className={`px-6 py-4 text-sm font-semibold ${
                                                    p.status === "Active"
                                                        ? "text-green-600"
                                                        : p.status === "Expired"
                                                        ? "text-red-600"
                                                        : "text-gray-700"
                                                }`}
                                            >
                                                {p.status}
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <div className="p-6 mt-10 print:block hidden">
                            {manager && (
                                <div>
                                    <p className="text-sm text-gray-700">Prepared by: {manager.firstname} {manager.lastname}</p>
                                    <p>Manager</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div className='flex gap-2'>
                            <button 
                                onClick={() => setIsCreatePawnOpen(true)}
                                className='px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm cursor-pointer hover:bg-gray-50 hover:border-gray-400'
                            >
                                Add
                            </button>

                            <div className='flex gap-2'>

                                <button
                                    onClick={handleRedeem}
                                    className='px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 hover:border-gray-400'
                                    disabled={!selectedPawn || selectedPawn.status === "Redeemed"}
                                    style={{ cursor: !selectedPawn || selectedPawn.status === "Redeemed" ? "not-allowed" : "pointer", opacity: !selectedPawn || selectedPawn.status === "Redeemed" ? 0.5 : 1 }}
                                >
                                    Redeem
                                </button>

                                <button     
                                    onClick={handleRenew}
                                    className='px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 hover:border-gray-400'
                                    disabled={!selectedPawn || selectedPawn.status === "Redeemed"}
                                    style={{ cursor: !selectedPawn || selectedPawn.status === "Redeemed" ? "not-allowed" : "pointer", opacity: !selectedPawn || selectedPawn.status === "Redeemed" ? 0.5 : 1 }}
                                >
                                    Renew
                                </button>

                                <button 
                                    onClick={handlePayment}
                                    className='px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 hover:border-gray-400'
                                    disabled={!selectedPawn || selectedPawn.status === "Redeemed"}
                                    style={{ cursor: !selectedPawn || selectedPawn.status === "Redeemed" ? "not-allowed" : "pointer", opacity: !selectedPawn || selectedPawn.status === "Redeemed" ? 0.5 : 1 }}
                                >
                                    Payment
                                </button>
                            </div>

                        </div>

                        <button onClick={() => handlePrint(printRef, {
                            title: 'List of Customers',
                            customDate: new Date().toLocaleDateString('en-US', { 
                                year: 'numeric', month: 'long', day: 'numeric' 
                            })
                        })}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm cursor-pointer hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md">
                            <Printer className="w-4 h-4 group-disabled:opacity-50" />
                            Print
                        </button> 
                    </div>
                </div>
            </div>

            {detailPawn && (
                <PawnDetailModal 
                    pawn={detailPawn} 
                    onClose={() => { 
                        setDetailPawn(null)
                        setSelectedPawn(null)
                    }} 
                />
            )}

            <CreatePawnModal
                isOpen={isCreatePawnOpen}
                onClose={() => setIsCreatePawnOpen(false)}
                onSubmit={onSubmit}
                customers={customers}
                selectedCustomer={selectedCustomer}
                onOpenCustomerList={() => {
                    setIsCreatePawnOpen(false);
                    setIsCustomerListOpen(true);
                }}
            />

            <CustomerListModal
                isOpen={isCustomerListOpen}
                customers={customers}
                onClose={() => {
                    setIsCustomerListOpen(false);
                    setIsCreatePawnOpen(true);
                }}
                onSelect={(customer) => {
                    setSelectedCustomer(customer);
                    setIsCustomerListOpen(false);
                    setIsCreatePawnOpen(true);
                }}
            />
           
            {showRedeemModal && (
                <PawnUpdateModal
                    pawn={selectedPawn}
                    mode="redeem"         
                    onClose={() => {
                        setShowRedeemModal(false)
                        setSelectedPawn(null)
                    }}
                    onConfirm={handleConfirmRedeem}
                />
            )}

            {showRenewModal && (
                <PawnUpdateModal
                    pawn={selectedPawn}
                    mode="renew"          
                    onClose={() => {
                        setShowRenewModal(false)
                        setSelectedPawn(null)
                    }}
                    onConfirm={handleConfirmRenew}
                />
            )}


            <PawnSuccessModal
                isOpen={successConfig.open}
                title={successConfig.title}
                message={successConfig.message}
                onClose={() =>
                    setSuccessConfig({ open: false, title: "", message: "" })
                }
                onViewReceipt={() => {
                    setSuccessConfig({ open: false, title: "", message: "" });
                    setIsReceiptOpen(true);
                }}
            />

            <ReceiptModal
                isOpen={isReceiptOpen}
                onClose={() => setIsReceiptOpen(false)}
                receipt={receipt}
            />
        </div>
    );
};

export default ManagerPawn;
