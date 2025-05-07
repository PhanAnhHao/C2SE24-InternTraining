import React from 'react';

const ProfileInfo = ({ label, value }) => {
    return (
        <div className="flex justify-between items-center p-4">
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <div className="mt-1 w-full bg-gray-100 border border-gray-200 rounded-md p-2 text-gray-500">
                    {value || `Your ${label}`}
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;