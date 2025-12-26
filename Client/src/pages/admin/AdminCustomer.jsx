import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/ui/SidebarAdmin';
import HeaderStaff from '../../components/ui/HeaderStaff';
import axios from '../../api/axios';
import { Search, UserX, Printer } from 'lucide-react';
import { useRef } from 'react';
import { handlePrint } from '../../utils/PrintUtils';
import CreateCustomer from '../../components/modals/CreateCustomer';
import CustomerModal from '../../components/modals/CustomerModal';
import TransactionHistoryModal from '../../components/modals/TransactionHistoryModal';
import { shortFormatDate } from '../../utils/FormatDate';
import CustomerTableSkeleton from '../../components/ui/CustomerTableSkeleton';

const AdminCustomer = () => {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const [startRange, setStartRange] = useState('');
    const [endRange, setEndRange] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [customersLoading, setCustomersLoading] = useState(true);
    const [admin, setAdmin] = useState(null);
    const printRef = useRef();

    const fetchAdminData = async () => {
        try{
            const response = await axios.get('user/me', {
                withCredentials: true
            });
            setAdmin(response.data.user)
        }
        catch(err){
            console.log(err);
        }
    }

    const fetchCustomers = async () => {
        try{
            const response = await axios.get(`/customer`, { 
                withCredentials: true 
            });
            setCustomers(response.data.customers);
            setFilteredCustomers(response.data.customers); 
        } 
        catch(err){
            console.error(err);
        }
        finally{
            setCustomersLoading(false);
        }
    };

     useEffect(() => {
        const fetchData = () => {
            fetchAdminData();
            fetchCustomers();
        }
        fetchData()
    },[]);   

    const handleTransactionHistory = async (user) => {
        try{
            const response = await axios.get(`/customer/${user._id}/transactions`, { 
                withCredentials: true 
            });
            setTransactionHistory(response.data.transactionHistory || []);
            setShowModal(false); 
            setShowHistoryModal(true); 
        } 
        catch (err) {
            console.error(err);
        }
    };

    const handleSearch = () => {
        const lowerSearch = search.toLowerCase().trim();

        let results = [...customers];

        if(filterType === "createdAt"){
            results = customers.filter((c) => {
                const created = new Date(c.createdAt);
                const start = startRange ? new Date(startRange) : null;
                const end = endRange ? new Date(endRange) : null;

                if (start && created < start) return false;
                if (end) {
                    end.setHours(23, 59, 59, 999); // include entire day
                    if (created > end) return false;
                }
                return true;
            });
            setFilteredCustomers(results);
            return;
        }

        results = customers.filter((c) => {
            const custId = `cust${c._id.slice(-6)}`;
            const fullName = `${c.userId?.firstname || ""} ${c.userId?.lastname || ""}`.toLowerCase();
            const email = c.userId?.email?.toLowerCase() || "";
            const addressString = `${c.street || ""} ${c.barangay || ""} ${c.city || ""} ${c.province || ""}`.toLowerCase();

            if(filterType === "name"){
                return fullName.includes(lowerSearch) || email.includes(lowerSearch) || custId.includes(lowerSearch);
            } 
            else if(filterType === "address"){
                return addressString.includes(lowerSearch);
            } 
            else{
                return (
                    fullName.includes(lowerSearch) ||
                    email.includes(lowerSearch) ||
                    addressString.includes(lowerSearch) ||
                    custId.includes(lowerSearch)
                );
            }
        });

        if(lowerSearch === ""){
            results = [...customers];
        }
        setFilteredCustomers(results);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch("");
            setFilteredCustomers(customers);
        }, 0);

        return () => clearTimeout(timer);
    }, [filterType, customers]);


    return (
        <div className="h-screen flex overflow-hidden"> 
            <SidebarAdmin/>  
            <div className="flex flex-col flex-1">
                <HeaderStaff/>
                <div className="px-6 pb-4 flex flex-col gap-5 h-screen pt-4 overflow-hidden">
                    <div className='flex justify-center items-center'>
                        <span className='text-2xl tracking-tighter font-medium uppercase text-gray-700'>
                            List of Customers
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
                                className="px-3 py-2 border-2 border-gray-400 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none cursor-pointer"
                            >
                                <option value="all">All</option>
                                <option value="name">Name</option>
                                <option value="address">Address</option>
                                <option value="createdAt">Date</option>
                            </select>
                        </div>

                        <div className="relative flex items-center gap-2">
                            {filterType === "createdAt" ? (
                                <>
                                    <div className="relative">
                                        <span className="absolute -top-2 left-2 bg-white px-2 text-xs text-gray-600">
                                            From
                                        </span>
                                        <input
                                            type="date"
                                            value={startRange}
                                            onChange={(e) => setStartRange(e.target.value)}
                                            className="px-3 py-2 border-2 border-gray-400 rounded-md focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>

                                    <div className="relative">
                                        <span className="absolute -top-2 left-2 bg-white px-2 text-xs text-gray-600">
                                            To
                                        </span>
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
                                        placeholder={
                                            filterType === "name"
                                                ? "Search by name"
                                                : filterType === "address"
                                                ? "Search by address (street, barangay, city)"
                                                : "Search"
                                        }
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                        className="px-8 py-2 border-2 border-gray-400 rounded-md w-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleSearch}
                                className="px-5 py-2 bg-yellow-500 text-white rounded-sm cursor-pointer hover:bg-yellow-600 flex items-center gap-1"
                            >
                                <Search className="w-4 h-4" />
                                Search
                            </button>
                        </div>
                    </div>

                    <div ref={printRef} className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-y-auto">
                        <h1 className="print-title hidden">List of Customers</h1>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-6 text-left text-xs font-medium text-gray-900 uppercase whitespace-nowrap">
                                        Customer ID
                                    </th>
                                    <th className="px-6 py-6 text-left text-xs font-medium text-gray-900 uppercase">
                                        Customer Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                                        Email Address
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase whitespace-nowrap">
                                        Contact number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                                        Address
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                                        Created At
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {customersLoading ? (
                                    <CustomerTableSkeleton rows={8} />
                                ) : customers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-16">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                    <UserX className="w-8 h-8 text-gray-400" />                             
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-700 mb-2">No customers yet!</h3>
                                                <p className="text-gray-500">Customers will appear here once they submit a request.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-16">
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
                                    filteredCustomers.map(customer => (
                                        <tr key={customer._id}
                                            onDoubleClick={() => {                         
                                                setSelectedUser(customer);
                                                setShowModal(true);
                                            }}
                                            className={`cursor-pointer transition ${selectedUser?._id === customer._id ? 'bg-green-100' : 'hover:bg-gray-50 ease-in-out duration-300'
                                        }`}>
                                            <td className="px-4 py-4 text-sm text-gray-800 font-mono font-semibold">
                                                CMR-{customer._id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-800">
                                                {customer.userId?.firstname} {customer.userId?.lastname}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {customer.userId?.email}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {customer.phone}    
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {customer.street}, {customer.barangay}, {customer.city} {customer.province}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                                {shortFormatDate(customer.createdAt)}    
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div className="p-6 mt-10 print:block hidden">
                            {admin && (
                                <div>
                                    <p className="text-sm text-gray-700">Prepared by: {admin.firstname} {admin.lastname}</p>
                                    <p>Administrator</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between">       
                        <button onClick={() => setShowCreateModal(true)} className='px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm cursor-pointer hover:bg-gray-50 hover:border-gray-400'>
                            Add
                        </button>
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

            <CustomerModal
                isOpen={showModal}
                selectedUser={selectedUser}
                onClose={() => {
                    setShowModal(false);
                    setSelectedUser(null);
                }}
                fetchTransactionHistory={handleTransactionHistory} 
            />

            <TransactionHistoryModal
                isOpen={showHistoryModal}
                onClose={() => {
                    setShowHistoryModal(false)
                    setShowModal(true);
                }}
                transactionHistory={transactionHistory}
            />

            {showCreateModal && (
                <CreateCustomer
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={(newCustomer) => {
                        setCustomers(prev => [newCustomer, ...prev]); 
                        setFilteredCustomers(prev => [newCustomer, ...prev]);
                    }}
                />
            )}
        </div>
    );
};

export default AdminCustomer;
