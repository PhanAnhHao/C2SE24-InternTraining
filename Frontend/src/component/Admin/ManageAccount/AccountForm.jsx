// 📁 components/AccountForm.js
import React from "react";

const AccountForm = ({ form, handleFormChange, handleAdd, handleUpdate, editingAccount, setForm }) => {
    return (
        <div className="bg-white p-4 shadow rounded mb-6">
            <h2 className="font-semibold text-lg mb-2">{editingAccount ? "Edit Account" : "Add Account"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input className="p-2 border rounded" name="username" placeholder="Username" value={form.username} onChange={handleFormChange} />
                <input className="p-2 border rounded" name="email" placeholder="Email" value={form.email} onChange={handleFormChange} />
                <input className="p-2 border rounded" name="password" type="password" placeholder="Password" value={form.password} onChange={handleFormChange} />

                <select
                    className="p-2 border rounded"
                    name="roleName"
                    value={form.roleName}
                    onChange={handleFormChange}
                >
                    <option value="">Select Role</option>
                    <option value="Student">Student</option>
                    <option value="Business">Business</option>
                </select>

                <input
                    className="p-2 border rounded"
                    name="roleDescription"
                    placeholder="Role Description"
                    value={form.roleDescription}
                    onChange={handleFormChange}
                />
            </div>

            <div className="mt-4">
                {editingAccount ? (
                    <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update</button>
                ) : (
                    <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add</button>
                )}
            </div>
        </div>
    );
};

export default AccountForm;