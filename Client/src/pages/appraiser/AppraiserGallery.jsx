import React from "react";
import SidebarAppraiser from "../../components/ui/SidebarAppraiser";
import HeaderStaff from "../../components/ui/HeaderStaff";

const AppraiserGallery = () => {

    return (
        <div className="flex h-screen overflow-hidden">
            <SidebarAppraiser />
            <div className="flex flex-col flex-1">
                <HeaderStaff />

            </div>
        </div>
    );
};

export default AppraiserGallery;