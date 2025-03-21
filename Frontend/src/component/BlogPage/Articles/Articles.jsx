import React, { useState, useEffect } from "react";
import theme_log from "../../../assets/ava_lap.jpg";
import { FiX } from "react-icons/fi";

const Articles = () => {
    const [showModal, setShowModal] = useState(false);

    // Ngăn cuộn nền khi mở modal
    useEffect(() => {
        if (showModal) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [showModal]);

    const articles = [
        { id: 1, image: theme_log, title: "AWS Certified solutions Architect", category: "Design", duration: "3 Month", author: "Lina", oldPrice: "$100", newPrice: "$80" },
        { id: 2, image: theme_log, title: "AWS Certified solutions Architect", category: "Design", duration: "3 Month", author: "Lina", oldPrice: "$100", newPrice: "$80" },
        { id: 3, image: theme_log, title: "AWS Certified solutions Architect", category: "Design", duration: "3 Month", author: "Lina", oldPrice: "$100", newPrice: "$80" },
        { id: 4, image: theme_log, title: "AWS Certified solutions Architect", category: "Design", duration: "3 Month", author: "Lina", oldPrice: "$100", newPrice: "$80" },
        { id: 5, image: theme_log, title: "AWS Certified solutions Architect", category: "Design", duration: "3 Month", author: "Lina", oldPrice: "$100", newPrice: "$80" },
        { id: 6, image: theme_log, title: "AWS Certified solutions Architect", category: "Design", duration: "3 Month", author: "Lina", oldPrice: "$100", newPrice: "$80" },
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Marketing Articles</h2>
                <button onClick={() => setShowModal(true)} className="text-teal-600 hover:underline">
                    See all
                </button>
            </div>

            {/* Grid hiển thị 4 bài viết */}
            <div className="grid grid-cols-4 gap-6">
                {articles.slice(0, 4).map((article) => (
                    <div key={article.id} className="bg-white p-4 rounded-lg shadow-lg">
                        <img src={article.image} alt="Article" className="rounded-lg w-full h-auto object-cover" />
                        <div className="flex justify-between text-gray-400 text-sm mt-2">
                            <span>{article.category}</span>
                            <span>{article.duration}</span>
                        </div>
                        <h3 className="font-bold mt-2">{article.title}</h3>
                        <div className="flex items-center space-x-2 mt-2">
                            <img src={theme_log} alt="Avatar" className="w-6 h-6 rounded-full" />
                            <span>{article.author}</span>
                        </div>
                        <div className="flex justify-between items-center mt-4 text-sm">
                            <span className="line-through text-gray-400">{article.oldPrice}</span>
                            <span className="text-teal-600 font-bold">{article.newPrice}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal hiển thị trên toàn bộ trang */}
            {showModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-3/5 max-h-[80vh] overflow-y-auto relative">
                        {/* Tiêu đề & nút đóng */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">All Articles</h2>
                            <button onClick={() => setShowModal(false)}>
                                <FiX className="text-xl text-gray-600 hover:text-black" />
                            </button>
                        </div>

                        {/* Danh sách hiển thị theo dạng list */}
                        <ul className="space-y-4">
                            {articles.map((article) => (
                                <li key={article.id} className="border-b pb-4 flex space-x-4">
                                    <img src={article.image} alt="Article" className="w-20 h-20 rounded-lg object-cover" />
                                    <div>
                                        <h3 className="font-bold">{article.title}</h3>
                                        <p className="text-sm text-gray-500">{article.category} • {article.duration}</p>
                                        <p className="text-teal-600 font-bold">{article.newPrice}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Articles;
