import React, { useEffect, useState } from "react";
import SidebarManager from "../../components/ui/SidebarManager";
import HeaderStaff from "../../components/ui/HeaderStaff";
import axios from "../../api/axios";
import { HelpCircle } from "lucide-react";
import { formatDate } from "../../utils/FormatDate";
import SkeletonRate from "../../components/ui/SkeletonRate";

const ManagerRate = () => {
    const [interestRates, setInterestRates] = useState([]);
    const [scheduleRates, setScheduleRates] = useState([]);
    const [rateLoading, setRateLoading] = useState(true);

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

    return (
        <div className="h-screen flex overflow-hidden">
            <SidebarManager />
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
                                                    <tr key={r._id}>
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
                                                    <tr key={s._id}>
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
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagerRate;
