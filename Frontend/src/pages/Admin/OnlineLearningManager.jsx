import React from 'react';
import Sidebar from '../../layout/AdminLayout/SideBar.jsx';
import Header from "../../layout/AdminLayout/Header.jsx";

const OnlineLearningManager = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />

                <div className="py-4 pt-2 bg-gray-100 h-full">
                    {/*nd */}

                </div>
            </div>
        </div>
    );
};

export default OnlineLearningManager;