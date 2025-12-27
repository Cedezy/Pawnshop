import React from "react";
import SidebarManager from "../../components/ui/SidebarManager";
import HeaderStaff from "../../components/ui/HeaderStaff";

const ManagerGallery = () => {

    return (
        <div className="flex h-screen overflow-hidden">
            <SidebarManager />
            <div className="flex flex-col flex-1">
                <HeaderStaff />

            </div>
        </div>
    );
};

export default ManagerGallery;