import React from "react";
import theme_log from "../../../assets/ava_lap.jpg";

const AuthorInfo = () => {
    return (
        <div className="p-6 flex items-center space-x-4 border-t border-gray-300">
            <img src={theme_log} alt="Author" className="w-12 h-12 rounded-full" />
            <div>
                <h3 className="text-lg font-semibold">Lina</h3>
                <p className="text-gray-500 text-sm">Tech Writer</p>
            </div>
        </div>
    );
};

export default AuthorInfo;