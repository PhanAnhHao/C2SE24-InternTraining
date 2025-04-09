import { useState } from "react";
import { FaBriefcase } from "react-icons/fa";

const ManageBusiness = () => {
    const initialData = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Company ${i + 1}`,
        industry: `Industry ${i % 5 + 1}`,
        address: `Address ${i % 3 + 1}`,
        email: `contact${i + 1}@business.com`,
        size: `${10 + i % 90} employees`
    }));

    const [businesses, setBusinesses] = useState(initialData);
    const [currentPage, setCurrentPage] = useState(1);
    const businessesPerPage = 10;
    const [editingBusiness, setEditingBusiness] = useState(null);
    const [form, setForm] = useState({ name: '', industry: '', address: '', email: '', size: '' });
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const totalPages = Math.ceil(businesses.length / businessesPerPage);
    const indexOfLast = currentPage * businessesPerPage;
    const indexOfFirst = indexOfLast - businessesPerPage;
    const currentBusinesses = businesses.slice(indexOfFirst, indexOfLast);

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleDelete = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this business?");
        if (confirmed) {
            setBusinesses(businesses.filter(b => b.id !== id));
            showNotification("Business deleted successfully", "error");
        }
    };

    const validateForm = () => {
        const { name, industry, address, email, size } = form;
        if (!name || !industry || !address || !email || !size) {
            alert("Please fill in all information.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Invalid email address.");
            return false;
        }
        return true;
    };

    const handleEdit = (business) => {
        setEditingBusiness(business);
        setForm(business);
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        if (!validateForm()) return;

        setBusinesses(businesses.map(b => b.id === form.id ? form : b));
        setEditingBusiness(null);
        setForm({ name: '', industry: '', address: '', email: '', size: '' });
        showNotification("Business updated successfully", "success");
    };

    const handleAdd = () => {
        if (!validateForm()) return;

        const newBusiness = {
            ...form,
            id: businesses.length ? businesses[businesses.length - 1].id + 1 : 1
        };
        setBusinesses([...businesses, newBusiness]);
        setForm({ name: '', industry: '', address: '', email: '', size: '' });
        showNotification("Business added successfully", "success");
    };

    return (
        <div className="flex flex-col min-h-screen p-6 bg-gray-50">
            {notification.show && (
                <div className={`fixed top-4 right-4 p-4 rounded shadow-lg ${notification.type === "success" ? "bg-green-500" : "bg-red-500"} text-white transition-all duration-300`}>
                    {notification.message}
                </div>
            )}

            <h1 className="text-2xl font-bold text-gray-700 flex items-center mb-4">
                <FaBriefcase className="text-[#4FD1C5] mr-2" /> Manage Businesses
            </h1>

            <div className="bg-white p-4 shadow rounded mb-6">
                <h2 className="font-semibold text-lg mb-2">{editingBusiness ? "Edit Business" : "Add Business"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input className="p-2 border rounded" name="name" placeholder="Business Name" value={form.name} onChange={handleFormChange} />
                    <input className="p-2 border rounded" name="industry" placeholder="Industry" value={form.industry} onChange={handleFormChange} />
                    <input className="p-2 border rounded" name="address" placeholder="Address" value={form.address} onChange={handleFormChange} />
                    <input className="p-2 border rounded" name="email" placeholder="Email" value={form.email} onChange={handleFormChange} />
                    <input className="p-2 border rounded" name="size" placeholder="Company Size" value={form.size} onChange={handleFormChange} />
                </div>
                <div className="mt-4">
                    {editingBusiness ? (
                        <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update</button>
                    ) : (
                        <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add</button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-[#4FD1C5] text-white">
                    <tr>
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Industry</th>
                        <th className="py-3 px-4 text-left">Address</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">Size</th>
                        <th className="py-3 px-4 text-left">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentBusinesses.map((business, index) => (
                        <tr key={business.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            <td className="py-3 px-4">{business.id}</td>
                            <td className="py-3 px-4">{business.name}</td>
                            <td className="py-3 px-4">{business.industry}</td>
                            <td className="py-3 px-4">{business.address}</td>
                            <td className="py-3 px-4">{business.email}</td>
                            <td className="py-3 px-4">{business.size}</td>
                            <td className="py-3 px-4 space-x-2">
                                <button onClick={() => handleEdit(business)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                                <button onClick={() => handleDelete(business.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-6">
                <button
                    className={`px-4 py-2 mx-1 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-[#4FD1C5] text-white"}`}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <span className="px-4 py-2 bg-gray-200 rounded">Page {currentPage} of {totalPages}</span>
                <button
                    className={`px-4 py-2 mx-1 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-[#4FD1C5] text-white"}`}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ManageBusiness;
