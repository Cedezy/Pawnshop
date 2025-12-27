import React, { useEffect, useState, useRef } from 'react';
import SidebarAdmin from '../../components/ui/SidebarAdmin';
import HeaderStaff from '../../components/ui/HeaderStaff';
import axios from '../../api/axios';
import { Printer, UserX } from 'lucide-react';
import { handlePrint } from '../../utils/PrintUtils';
import StaffModal from '../../components/modals/StaffModal';
import { useToast } from "../../context/ToastContext"; 
import SkeletonTable from '../../components/ui/SkeletonTable';

const AdminUser = () => {
    const [staff, setStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [admin, setAdmin] = useState(null);
    const [confirmAction, setConfirmAction] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const printRef = useRef();
    const { showToast } = useToast();

    const fetchAdmin = async () => {
        try{
            const response = await axios.get('user/me', { 
                withCredentials: true 
            });
            setAdmin(response.data.user);
        } 
        catch(err){
            console.error(err);
        }
    };

    const fetchStaff = async () => {
        try{
            const response = await axios.get('/user', {
                withCredentials: true
            });
            setStaff(response.data.staff);
        } 
        catch(err){
            console.error(err);
        }
        finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = () => {
            fetchAdmin();
            fetchStaff();
        }
        fetchData()
    },[]);


    const handleDeactivateReactivate = async () => {
        if(!selectedStaff) return;

        setActionLoading(true);
        const userId = selectedStaff.userId._id;
        try{
            let response;

            if(selectedStaff.userId.isActive) {
                response = await axios.put(`/user/${userId}/deactivate`);
            } 
            else{
                response = await axios.put(`/user/${userId}/reactivate`);
            }
            fetchStaff();
            setSelectedStaff(null);
            showToast("Success", response.data.message, "success");
        } 
        catch(err){
            console.error(err);
        }
        finally{
            setActionLoading(false);
        }
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    return (
        <div className="h-screen flex overflow-hidden">
            <SidebarAdmin />
            <div className="flex flex-col flex-1">
                <HeaderStaff />
                <div className="px-6 pb-4 flex flex-col gap-5 h-screen pt-4 overflow-hidden">
                    <div className="flex justify-center items-center">
                        <span className="text-2xl tracking-tighter font-medium uppercase text-gray-700">
                            List of Staff
                        </span>
                    </div>

                    <div ref={printRef} className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-auto mt-2">
                        <h1 className="print-title hidden">List of Staff</h1>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                                <tr className='whitespace-nowrap'>
                                    <th className="px-6 py-6 text-left text-xs font-medium text-gray-900 uppercase">
                                        Full Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                                        Email Address
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                                        User Type
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                                        Contact Number
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                                        Address
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                                        Last Login
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            {loading ? (
                                <SkeletonTable rows={8} columns={7}/>
                            ) : (
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {staff.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-16">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                        <UserX className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-700 mb-2">No staff yet!</h3>
                                                    <p className="text-gray-500">Staff members will appear here once added.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        staff.map(s => (
                                            <tr key={s._id} className={`cursor-pointer transition ${selectedStaff?._id === s._id ? 'bg-green-100' : 'hover:bg-gray-50'}`} onClick={() => setSelectedStaff(s)}>
                                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                    {s.userId.firstname} {s.userId.middlename} {s.userId.lastname}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-800">
                                                    {s.userId.email}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-800 capitalize font-medium">
                                                    {s.userId.role}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-800">
                                                    {s.phone}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-800">
                                                    {`${s.street || ""}, ${s.barangay || ""}, ${s.city || ""}, ${s.province || ""}, ${s.zipCode || ""}`}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-800">
                                                    {formatDateTime(s.userId.lastLogin)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs ${s.userId.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {s.userId.isActive ? 'Active' : 'Deactivated'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            )}
                        </table>

                        {admin && (
                            <div className="p-6 mt-10 print:block hidden">
                                <p className="text-sm text-gray-700">Prepared by: {admin.firstname} {admin.lastname}</p>
                                <p>Administrator</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between">
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setSelectedStaff(null); setOpenModal(true); }}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                            >
                                Add
                            </button>
                            <button
                                disabled={actionLoading}
                                onClick={async () => {
                                    await handleDeactivateReactivate();
                                    setConfirmAction(false);
                                }}
                                className={`px-4 py-2 text-sm rounded-sm flex items-center justify-center gap-2 text-white
                                    ${actionLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : selectedStaff.userId.isActive
                                            ? 'bg-red-500 hover:bg-red-600'
                                            : 'bg-green-500 hover:bg-green-600'
                                    }
                                `}
                            >
                                {actionLoading ? (
                                    <>
                                        <svg
                                            className="w-4 h-4 animate-spin"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            />
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    selectedStaff.userId.isActive ? 'Deactivate' : 'Reactivate'
                                )}
                            </button>
                        </div>

                        <button
                            onClick={() => handlePrint(printRef, { title: 'List of Staff', customDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) })}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                        >
                            <Printer className="w-4 h-4" />
                            Print
                        </button>
                    </div>
                </div>
            </div>

            {openModal && (
                <StaffModal
                    staff={selectedStaff}
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    onSaved={fetchStaff}
                />
            )}

            {confirmAction && selectedStaff && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded shadow-md w-lg animate-fade-in">
                        <div className='border-b border-gray-200 p-6'>
                             <div className="flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M12 3a9 9 0 110 18 9 9 0 010-18z" />
                                </svg>
                            </div>

                            <h2 className="text-center text-2xl font-semibold tracking-tighter text-red-600 mb-2">
                                {selectedStaff.userId.isActive ? 'Deactivate' : 'Reactivate'} {selectedStaff.userId.firstname} {selectedStaff.userId.lastname}
                            </h2>
                        </div>

                        <div className='p-6 bg-teal-50'>
                            <p className="text-center text-gray-700 mb-2">
                                You are about to {selectedStaff.userId.isActive ? 'deactivate' : 'reactivate'} this staff member.
                            </p>
                            <p className="text-center text-gray-500 text-sm mb-4">
                                {selectedStaff.userId.isActive 
                                    ? 'Deactivating a staff member will prevent them from logging in until reactivated.' 
                                    : 'Reactivating will restore their access to the system.'}
                            </p>
                            <div className="flex justify-center gap-2 pt-4">
                                <button
                                    onClick={() => {
                                        setConfirmAction(false)
                                        setSelectedStaff(null)
                                    }}
                                    className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-sm cursor-pointer hover:bg-gray-100 ease-in-out duration-300 font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        setConfirmAction(false);
                                        await handleDeactivateReactivate();
                                    }}
                                    className={`px-4 py-2 text-sm rounded-sm cursor-pointer text-white ${selectedStaff.userId.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                >
                                    {selectedStaff.userId.isActive ? 'Deactivate' : 'Reactivate'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUser;
