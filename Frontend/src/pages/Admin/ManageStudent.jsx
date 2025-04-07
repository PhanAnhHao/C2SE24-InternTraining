import { useState } from "react";
import { FaUserGraduate } from "react-icons/fa";

const ManageStudent = () => {
    const initialData = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Student ${i + 1}`,
        age: 18 + (i % 5),
        school: `School ${i % 3 + 1}`,
        mail: `student${i + 1}@example.com`,
        course: `Course ${i % 4 + 1}`
    }));

    const [students, setStudents] = useState(initialData);
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 10;
    const [editingStudent, setEditingStudent] = useState(null);
    const [form, setForm] = useState({ name: '', age: '', school: '', mail: '', course: '' });
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const totalPages = Math.ceil(students.length / studentsPerPage);
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleDelete = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete?");
        if (confirmed) {
            setStudents(students.filter(student => student.id !== id));
            showNotification("Student deleted successfully", "error");
        }
    };

    const validateForm = () => {
        const { name, age, school, mail, course } = form;
        if (!name || !age || !school || !mail || !course) {
            alert("Please fill in all information.");
            return false;
        }
        if (isNaN(age) || Number(age) <= 0) {
            alert("Please enter a valid age.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(mail)) {
            alert("Invalid email.");
            return false;
        }
        return true;
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setForm(student);
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        if (!validateForm()) return;

        setStudents(students.map(s => s.id === form.id ? { ...form, age: Number(form.age) } : s));
        setEditingStudent(null);
        setForm({ name: '', age: '', school: '', mail: '', course: '' });
        showNotification("Student updated successfully", "success");
    };

    const handleAdd = () => {
        if (!validateForm()) return;

        const newStudent = {
            ...form,
            id: students.length ? students[students.length - 1].id + 1 : 1,
            age: Number(form.age)
        };
        setStudents([...students, newStudent]);
        setForm({ name: '', age: '', school: '', mail: '', course: '' });
        showNotification("Add new student successfully", "success");
    };

    return (
        <div className="flex flex-col min-h-screen p-6 bg-gray-50">
            {notification.show && (
                <div className={`fixed top-4 right-4 p-4 rounded shadow-lg ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
                    } text-white transition-all duration-300`}>
                    {notification.message}
                </div>
            )}

            <h1 className="text-2xl font-bold text-gray-700 flex items-center mb-4">
                <FaUserGraduate className="text-[#4FD1C5] mr-2" /> Manage Students
            </h1>

            <div className="bg-white p-4 shadow rounded mb-6">
                <h2 className="font-semibold text-lg mb-2">{editingStudent ? "Edit Student" : "Add Student"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input className="p-2 border rounded" name="name" placeholder="Name" value={form.name} onChange={handleFormChange} />
                    <input className="p-2 border rounded" name="age" placeholder="Age" value={form.age} onChange={handleFormChange} />
                    <input className="p-2 border rounded" name="school" placeholder="School" value={form.school} onChange={handleFormChange} />
                    <input className="p-2 border rounded" name="mail" placeholder="Email" value={form.mail} onChange={handleFormChange} />
                    <input className="p-2 border rounded" name="course" placeholder="Course" value={form.course} onChange={handleFormChange} />
                </div>
                <div className="mt-4">
                    {editingStudent ? (
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
                            <th className="py-3 px-4 text-left">Age</th>
                            <th className="py-3 px-4 text-left">School</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Course</th>
                            <th className="py-3 px-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStudents.map((student, index) => (
                            <tr key={student.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                <td className="py-3 px-4">{student.id}</td>
                                <td className="py-3 px-4">{student.name}</td>
                                <td className="py-3 px-4">{student.age}</td>
                                <td className="py-3 px-4">{student.school}</td>
                                <td className="py-3 px-4">{student.mail}</td>
                                <td className="py-3 px-4">{student.course}</td>
                                <td className="py-3 px-4 space-x-2">
                                    <button onClick={() => handleEdit(student)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                                    <button onClick={() => handleDelete(student.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-6">
                <button
                    className={`px-4 py-2 mx-1 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-[#4FD1C5] text-white"}`}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <span className="px-4 py-2 bg-gray-200 rounded">Page {currentPage} of {totalPages}</span>
                <button
                    className={`px-4 py-2 mx-1 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-[#4FD1C5] text-white"}`}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ManageStudent;