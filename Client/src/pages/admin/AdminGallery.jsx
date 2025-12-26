import React from "react";
import SidebarAdmin from "../../components/ui/SidebarAdmin";
import HeaderStaff from "../../components/ui/HeaderStaff";

const AdminDashboard = () => {

    return (
        <div className="flex h-screen overflow-hidden">
            <SidebarAdmin />
            <div className="flex flex-col flex-1">
                <HeaderStaff />

            </div>
        </div>
    );
};

export default AdminDashboard;