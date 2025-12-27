import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../components/ui/SidebarAdmin";
import HeaderStaff from "../../components/ui/HeaderStaff";
import axios from "../../api/axios";
import { HelpCircle } from "lucide-react";
import RateModal from "../../components/modals/RateModal";
import { formatDate } from "../../utils/FormatDate";
import SkeletonRate from "../../components/ui/SkeletonRate";
import { useToast } from "../../context/ToastContext";

const AdminRate = () => {
    const [interestRates, setInterestRates] = useState([]);
    const [scheduleRates, setScheduleRates] = useState([]);
    const [selectedRate, setSelectedRate] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState("");
    const [form, setForm] = useState({});
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rateLoading, setRateLoading] = useState(true);
    const { showToast } = useToast();

    const fetchRates = async () => {
        let response;
        try{
            response = await axios.get("/rate/interest", { 
                withCredentials: true 
            });
            setInterestRates(response.data.rates || []);
            response = await axios.get("/rate/current", {
                withCredentials: true
            });
            setScheduleRates(response.data.rates || []);
        } 
        catch(err){
            console.error(err);
        }
        finally{
            setRateLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = () => {
            fetchRates()
        }
        fetchData()
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        try{
            let response;

            if(formType === "Monthly Rate"){
                if(editId){
                    response = await axios.put(`/rate/interest/${editId}`, form, { 
                        withCredentials: true 
                    });
                } 
                else{
                    response = await axios.post("/rate/interest", form, { 
                        withCredentials: true 
                    });
                }
            }

            if(formType === "Schedule Rate"){
                if(editId){
                    response = await axios.put(`/rate/schedule-rate/${editId}`, form, { 
                        withCredentials: true 
                    });
                } 
                else{
                    response = await axios.post("/rate/schedule-rate", form, {
                        withCredentials: true 
                    });
                }
            }
            showToast("Success", response.data.message, "success");
            setShowModal(false);
            setEditId(null);
            setForm({});
            setSelectedRate(null);
            setSelectedSchedule(null);
            fetchRates();
        } 
        catch(err){
            console.error(err);
            alert("Failed to save rate.");
        }
        setLoading(false);
    };

    const handleAddMonthly = () => {
        setFormType("Monthly Rate");
        setForm({ rate: "", effectivityDate: "" });
        setEditId(null);
        setShowModal(true);
    };

    const handleEditMonthly = () => {
        if (!selectedRate) return;
        setFormType("Monthly Rate");
        setForm(selectedRate);
        setEditId(selectedRate._id);
        setShowModal(true);
    };

    // Schedule
    const handleAddSchedule = () => {
        setFormType("Schedule Rate");
        setForm({
            effectivityDate: "",
            firstSchedule: "",
            secondSchedule: "",
            thirdSchedule: ""
        });
        setEditId(null);
        setShowModal(true);
    };

    const handleEditSchedule = () => {
        if (!selectedSchedule) return;
        setFormType("Schedule Rate");
        setForm(selectedSchedule);
        setEditId(selectedSchedule._id);
        setShowModal(true);
    };

    return (
        <div className="h-screen flex overflow-hidden">
            <SidebarAdmin />
            <div className="flex flex-col flex-1">
                <HeaderStaff />

                <div className="px-6 pt-4 pb-6 flex flex-col gap-6 h-screen overflow-hidden">
                    <div className="text-center">
                        <h1 className="text-2xl font-medium tracking-tight text-gray-700 uppercase">
                            Interest Rate Settings
                        </h1>
                    </div>

                    {rateLoading ? (
                        <SkeletonRate/>
                    ) : (
                        <div className="grid grid-cols-2 gap-10">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700 mb-2">Monthly Rate</h2>
                                <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-y-auto">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gray-100 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-6 text-left text-xs font-medium text-gray-900 uppercase">
                                                    Rate (%)
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                                                    Effectivity Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {interestRates.length === 0 ? (
                                                <tr>
                                                    <td colSpan="2" className="text-center py-16">
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                                <HelpCircle className="w-8 h-8 text-gray-400" />                             
                                                            </div>
                                                            <p className="text-gray-500">No Monthly Rates yet.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                interestRates.map(r => (
                                                    <tr key={r._id}
                                                        onClick={() => setSelectedRate(r)}
                                                        className={`cursor-pointer ${
                                                            selectedRate?._id === r._id
                                                                ? "bg-green-100"
                                                                : "hover:bg-gray-100 ease-in-out duration-300"
                                                        }`}>
                                                        <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-800">
                                                            {r.rate}%
                                                        </td>
                                                        <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-800">
                                                            {formatDate(r.effectivityDate)}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                    <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 text-sm text-gray-700">
                                        <p>
                                            Monthly rates are applied to all active pawn loans.
                                        </p>
                                        <p className="mt-1">
                                            Changes affect new transactions only.
                                        </p>
                                    </div>

                                </div>

                                <div className="flex gap-2 mt-3">
                                    <button onClick={handleAddMonthly} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm cursor-pointer hover:bg-gray-50 hover:border-gray-400 ease-in-out duration-300">
                                        Add
                                    </button>
                                    <button
                                        onClick={handleEditMonthly}
                                        disabled={!selectedRate}
                                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 cursor-pointer ease-in-out duration-300">
                                        Edit
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                                    Payment Schedule Rate
                                </h2>
                                    <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-y-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-100 sticky top-0 z-10">
                                                <tr>
                                                <th className="px-6 py-6 text-left text-xs font-medium text-gray-900 uppercase">
                                                    Effectivity
                                                </th>
                                                <th className="px-6 py-6 text-left text-xs font-medium text-gray-900 uppercase">
                                                    1st (%)
                                                </th>
                                                <th className="px-6 py-6 text-left text-xs font-medium text-gray-900 uppercase">
                                                    2nd (%)
                                                </th>
                                                <th className="px-6 py-6 text-left text-xs font-medium text-gray-900 uppercase">
                                                    3rd (%)
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {scheduleRates.length === 0 ? (
                                                <td colSpan="4" className="text-center py-16">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                            <HelpCircle className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                        <p className="text-gray-500">No Schedule Rates yet.</p>
                                                    </div>
                                                </td>
                                            ) : (
                                                scheduleRates.map(s => (
                                                    <tr key={s._id}
                                                        onClick={() => setSelectedSchedule(s)}
                                                        className={`cursor-pointer ${
                                                            selectedSchedule?._id === s._id
                                                                ? "bg-green-100"
                                                                : "hover:bg-gray-100 ease-in-out duration-300"
                                                        }`}>
                                                        <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-800">
                                                            {formatDate(s.effectivityDate)}
                                                        </td>
                                                        <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-800">
                                                            {s.firstSchedule}%
                                                        </td>
                                                        <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-800">
                                                            {s.secondSchedule}%
                                                        </td>
                                                        <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-800">
                                                            {s.thirdSchedule}%
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                    <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 text-sm text-gray-700">
                                        <p>
                                            Schedule rates depend on the selected payment period.
                                        </p>
                                        <p className="mt-1">
                                            Only one schedule rate can be active at a time.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-3">
                                    <button onClick={handleAddSchedule} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm cursor-pointer hover:bg-gray-50 hover:border-gray-400 ease-in-out duration-300">
                                        Add
                                    </button>
                                    <button
                                        onClick={handleEditSchedule}
                                        disabled={!selectedSchedule}
                                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 cursor-pointer ease-in-out duration-300">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {showModal && (
                    <RateModal
                        type={formType}
                        form={form}
                        setForm={setForm}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setShowModal(false);
                            setEditId(null);
                            setSelectedRate(null);
                            setSelectedSchedule(null);
                        }}
                        editId={editId}
                        loading={loading}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminRate;
