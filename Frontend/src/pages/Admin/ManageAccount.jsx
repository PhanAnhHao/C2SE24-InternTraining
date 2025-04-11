import { useEffect, useState } from "react";
import axios from "axios";
import { FaUsersCog } from "react-icons/fa";
import { useSnackbar } from "notistack";
import AccountForm from "../../component/Admin/ManageAccount/AccountForm.jsx";
import AccountTable from "../../component/Admin/ManageAccount/AccountTable";

const ManageAccount = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("All");
    const [accounts, setAccounts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const accountsPerPage = 10;
    const [editingAccount, setEditingAccount] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        username: '',
        password: '',
        email: '',
        roleName: '',
        roleDescription: ''
    });

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/accounts/all-accounts");
            // console.log("Fetched accounts:", res.data);
            setAccounts(res.data);
        } catch (err) {
            enqueueSnackbar("Failed to fetch accounts", { variant: "error" });
            const errorMessage = err.response?.data?.message || "Failed to add account. Please try again.";
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    const filteredAccounts = accounts.filter(acc => {
        const roleName = acc.role?.name?.toLowerCase();
        const matchesRole = filterRole === "All" || roleName === filterRole.toLowerCase();
        const matchesSearch = acc.username?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesRole && matchesSearch;
    });

    const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
    const currentAccounts = filteredAccounts.slice((currentPage - 1) * accountsPerPage, currentPage * accountsPerPage);

    const validateForm = () => {
        const { username, password, email, roleName, roleDescription } = form;
        if (!username || !password || !email || !roleName || !roleDescription) {
            enqueueSnackbar("Please fill in all information.", { variant: "warning" });
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            enqueueSnackbar("Invalid email.", { variant: "warning" });
            return false;
        }
        return true;
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = (account) => {
        setEditingAccount(account);
        setForm({
            id: account._id,
            username: account.username,
            password: account.password,
            email: account.email,
            roleName: account.role.name,
            roleDescription: account.role.description
        });
        setShowForm(true);
    };


    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            setAccounts(accounts.filter(acc => acc._id !== id));
            enqueueSnackbar("Account deleted successfully", { variant: "success" });
        }
    };

    const handleUpdate = () => {
        if (!validateForm()) return;

        const updated = accounts.map(acc => acc._id === form.id ? {
            ...acc,
            username: form.username,
            password: form.password,
            email: form.email,
            role: {
                ...acc.role,
                name: form.roleName,
                description: form.roleDescription
            }
        } : acc);

        setAccounts(updated);
        setEditingAccount(null);
        setForm({ username: '', password: '', email: '', roleName: '', roleDescription: '' });
        enqueueSnackbar("Account updated successfully", { variant: "success" });
        setShowForm(false);
    };

    const handleAdd = async () => {
        if (!validateForm()) return;

        try {
            const roleIdMap = {
                student: "660edabc12eac0f2fc123402",
                business: "660edabc12eac0f2fc123403"
            };

            const roleId = roleIdMap[form.roleName.toLowerCase()];

            if (!roleId) {
                enqueueSnackbar("Invalid role selected.", { variant: "error" });
                return;
            }

            const newAccountData = {
                username: form.username,
                email: form.email,
                password: form.password,
                roleId: roleId  // Be nhận object
            };

            const res = await axios.post("http://localhost:5000/api/accounts/add-account", newAccountData);
            console.log("Response from server:", res.data);

            const addedAccount = {
                ...res.data,
                role: {
                    name: form.roleName,
                    description: form.roleDescription
                }
            };

            setAccounts(prev => [...prev, addedAccount]);
            enqueueSnackbar("New account added successfully", { variant: "success" });

            setForm({ username: '', password: '', email: '', roleName: '', roleDescription: '' });
            setShowForm(false);

        } catch (err) {
            console.error("Add account error:", err);
            const errorMessage = err.response?.data?.message || "Failed to add account. Please try again.";
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };


    return (
        <div className="flex flex-col min-h-screen  bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-700 flex items-center mb-4">
                <FaUsersCog className="text-[#4FD1C5] mr-2" /> Manage Accounts
            </h1>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => {
                        setEditingAccount(null);
                        setForm({
                            username: '',
                            password: '',
                            email: '',
                            roleName: '',
                            roleDescription: ''
                        });
                        setShowForm(true);
                    }}
                    className="px-4 py-2 bg-[#4FD1C5] text-white rounded hover:bg-teal-500 transition"
                >
                    + Add New Account
                </button>
            </div>

            {showForm && (
                <AccountForm
                    form={form}
                    handleFormChange={handleFormChange}
                    handleAdd={() => {
                        handleAdd();
                    }}
                    handleUpdate={() => {
                        handleUpdate();
                    }}
                    editingAccount={editingAccount}
                    setForm={setForm}
                />
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-start gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]"
                />
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]"
                >
                    <option value="All">All Roles</option>
                    <option value="student">Student</option>
                    <option value="business">Business</option>
                </select>
            </div>


            <AccountTable
                accounts={currentAccounts}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />

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

export default ManageAccount;