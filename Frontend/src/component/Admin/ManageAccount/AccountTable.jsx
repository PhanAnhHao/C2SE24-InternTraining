import React from "react";

const AccountTable = ({ accounts, handleEdit, handleDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-[#4FD1C5] text-white">
                    <tr>
                        <th className="py-3 px-4 text-left">Username</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">Role</th>
                        <th className="py-3 px-4 text-left">Description</th>
                        <th className="py-3 px-4 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((acc, index) => (
                        <tr key={acc._id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            <td className="py-3 px-4">{acc.username}</td>
                            <td className="py-3 px-4">{acc.email}</td>
                            <td className="py-3 px-4">{acc.role.name}</td>
                            <td className="py-3 px-4">{acc.role.description}</td>
                            <td className="py-3 px-4 space-x-2">
                                <button onClick={() => handleEdit(acc)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                                <button onClick={() => handleDelete(acc._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AccountTable;