import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../components/ui/SidebarAdmin";
import HeaderStaff from "../../components/ui/HeaderStaff";
import axios from "../../api/axios";
import { HelpCircle } from "lucide-react";
import RateModal from "../../components/modals/RateModal";
import { formatDate } from "../../utils/FormatDate";

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

    /* ================= FETCH ================= */
    const fetchRates = async () => {
        try {
            const res = await axios.get("/rate/interest", { withCredentials: true });
            setInterestRates(res.data.rates || []);

            const currentRes = await axios.get("/rate/current", { withCredentials: true });
            if (currentRes.data.currentSchedule) {
                setScheduleRates([currentRes.data.currentSchedule]);
            } else {
                setScheduleRates([]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRates();
    }, []);

    /* ================= SUBMIT ================= */
    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (formType === "Monthly Rate") {
                if (editId) {
                    await axios.put(`/rate/interest/${editId}`, form, { withCredentials: true });
                } else {
                    await axios.post("/rate/interest", form, { withCredentials: true });
                }
            }

            if (formType === "Schedule Rate") {
                if (editId) {
                    await axios.put(`/rate/schedule-rate/${editId}`, form, { withCredentials: true });
                } else {
                    await axios.post("/rate/schedule-rate", form, { withCredentials: true });
                }
            }

            setShowModal(false);
            setEditId(null);
            setForm({});
            setSelectedRate(null);
            setSelectedSchedule(null);
            fetchRates();
        } catch (err) {
            console.error(err);
            alert("Failed to save rate.");
        }
        setLoading(false);
    };

    /* ================= HANDLERS ================= */

    // Monthly
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

                    <div className="grid grid-cols-2 gap-10">
                        {/* ================= MONTHLY RATE ================= */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Monthly Rate</h2>
                            <p className="text-sm text-gray-500 mb-3">
                                Monthly interest rates applied to loans.
                            </p>

                            <div className="bg-white border rounded-sm shadow-sm overflow-y-auto">
                                <table className="min-w-full divide-y">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-4 text-xs text-left uppercase text-gray-500">
                                                Rate (%)
                                            </th>
                                            <th className="px-6 py-4 text-xs text-left uppercase text-gray-500">
                                                Effectivity Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {interestRates.length === 0 ? (
                                            <tr>
                                                <td colSpan="2" className="py-16 text-center">
                                                    <HelpCircle className="mx-auto mb-3 text-gray-400" />
                                                    <p className="text-gray-500">No Monthly Rates yet</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            interestRates.map(r => (
                                                <tr
                                                    key={r._id}
                                                    onClick={() => setSelectedRate(r)}
                                                    className={`cursor-pointer ${
                                                        selectedRate?._id === r._id
                                                            ? "bg-green-100"
                                                            : "hover:bg-gray-100"
                                                    }`}
                                                >
                                                    <td className="px-6 py-4">{r.rate}%</td>
                                                    <td className="px-6 py-4">
                                                        {formatDate(r.effectivityDate)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex gap-2 mt-3">
                                <button onClick={handleAddMonthly} className="btn-outline">
                                    ADD
                                </button>
                                <button
                                    onClick={handleEditMonthly}
                                    disabled={!selectedRate}
                                    className="btn-outline disabled:opacity-50"
                                >
                                    EDIT
                                </button>
                            </div>
                        </div>

                        {/* ================= SCHEDULE RATE ================= */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">
                                Payment Schedule Rate
                            </h2>
                            <p className="text-sm text-gray-500 mb-3">
                                Rates based on payment schedule.
                            </p>

                            <div className="bg-white border rounded-sm shadow-sm overflow-y-auto">
                                <table className="min-w-full divide-y">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-4 text-xs uppercase text-left">Effectivity</th>
                                            <th className="px-6 py-4 text-xs uppercase text-left">1st (%)</th>
                                            <th className="px-6 py-4 text-xs uppercase text-left">2nd (%)</th>
                                            <th className="px-6 py-4 text-xs uppercase text-left">3rd (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {scheduleRates.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="py-16 text-center">
                                                    <HelpCircle className="mx-auto mb-3 text-gray-400" />
                                                    <p className="text-gray-500">No Schedule Rates yet</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            scheduleRates.map(s => (
                                                <tr
                                                    key={s._id}
                                                    onClick={() => setSelectedSchedule(s)}
                                                    className={`cursor-pointer ${
                                                        selectedSchedule?._id === s._id
                                                            ? "bg-green-100"
                                                            : "hover:bg-gray-100"
                                                    }`}
                                                >
                                                    <td className="px-6 py-4">
                                                        {formatDate(s.effectivityDate)}
                                                    </td>
                                                    <td className="px-6 py-4">{s.firstSchedule}%</td>
                                                    <td className="px-6 py-4">{s.secondSchedule}%</td>
                                                    <td className="px-6 py-4">{s.thirdSchedule}%</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex gap-2 mt-3">
                                <button onClick={handleAddSchedule} className="btn-outline">
                                    ADD
                                </button>
                                <button
                                    onClick={handleEditSchedule}
                                    disabled={!selectedSchedule}
                                    className="btn-outline disabled:opacity-50"
                                >
                                    EDIT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= MODAL ================= */}
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
