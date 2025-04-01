import React from "react";
import Sidebar from "../src/layout/AdminLayout/SideBar";
import Header from "../src/layout/AdminLayout/Header";
import { Outlet } from "react-router-dom";

const LayoutAdmin = () => {
    return (
        <div className="flex h-screen  ">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <Header />

                {/* Content */}
                <main className="flex-1 p-6 overflow-auto bg-gray-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default LayoutAdmin;
