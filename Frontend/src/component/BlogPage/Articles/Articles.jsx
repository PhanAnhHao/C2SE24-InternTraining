import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useBlog } from "../../../context/BlogContext";
import { useNavigate } from "react-router-dom";

// Images
import theme_log from "../../../assets/ava_lap.jpg";
import Aws from "../../../assets/aws.jpg";
import MachineLearning from "../../../assets/machineL.jpg";
import MERN from "../../../assets/MERN.jpg";
import ReactNative from "../../../assets/REactnative.jpg";
import DevOps from "../../../assets/Devops.jpg";
import EHaCS from "../../../assets/EHaCS.jpg";

const Articles = ({ hideTitle = false, excludeId = null }) => {
    const [showModal, setShowModal] = useState(false);
    const { featuredArticle, setFeaturedArticle } = useBlog();
    const navigate = useNavigate();
    const [displayedArticles, setDisplayedArticles] = useState([]);

    useEffect(() => {
        if (!featuredArticle && !excludeId) {
            // Chọn một bài viết ngẫu nhiên khi component được mount
            const randomIndex = Math.floor(Math.random() * articles.length);
            setFeaturedArticle(articles[randomIndex]);
        }

        // Select 4 random articles excluding the featured one and excludeId
        const getRandomArticles = () => {
            const availableArticles = articles.filter(article =>
                article.id !== featuredArticle?.id &&
                article.id !== excludeId
            );
            const shuffled = [...availableArticles].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, 4);
        };

        setDisplayedArticles(getRandomArticles());
    }, [featuredArticle, excludeId]);

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
        {
            id: 1,
            image: Aws,
            title: "AWS Certified Solutions Architect - Associate Level",
            category: "Cloud Computing",
            duration: "3 Month",
            author: "John Smith",
            description: "Learn to design and deploy scalable, highly available, and fault-tolerant systems on AWS. Master core AWS services and best practices for cloud architecture."
        },
        {
            id: 2,
            image: MachineLearning,
            title: "Machine Learning Fundamentals with Python",
            category: "AI/ML",
            duration: "4 Month",
            author: "Emma Watson",
            description: "Dive into machine learning algorithms, data preprocessing, and model training using Python. Build practical ML models for real-world applications."
        },
        {
            id: 3,
            image: MERN,
            title: "Full Stack Web Development with MERN Stack",
            category: "Web Development",
            duration: "6 Month",
            author: "David Chen",
            description: "Master MongoDB, Express.js, React, and Node.js to build modern web applications. Learn full-stack development from frontend to backend."
        },
        {
            id: 4,
            image: ReactNative,
            title: "Mobile App Development with React Native",
            category: "Mobile Dev",
            duration: "4 Month",
            author: "Sarah Johnson",
            description: "Create cross-platform mobile applications using React Native. Build native-like apps for iOS and Android with a single codebase."
        },
        {
            id: 5,
            image: DevOps,
            title: "DevOps Engineering and Automation",
            category: "DevOps",
            duration: "5 Month",
            author: "Michael Brown",
            description: "Learn CI/CD pipelines, containerization, and infrastructure as code. Master tools like Docker, Kubernetes, and Jenkins for modern DevOps practices."
        },
        {
            id: 6,
            image: EHaCS,
            title: "Cyber Security and Ethical Hacking",
            category: "Security",
            duration: "3 Month",
            author: "Lisa Anderson",
            description: "Explore penetration testing, network security, and ethical hacking techniques. Learn to identify and fix security vulnerabilities in systems."
        },
    ];

    const handleArticleClick = (article) => {
        navigate('/article-detail', { state: { article } });
        // Scroll to top when navigating to a new article
        window.scrollTo(0, 0);
    };

    return (
        <div className="p-6 max-w-[1400px] mx-auto">
            {/* Header */}
            {!hideTitle && (
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Marketing Articles</h2>
                    <button onClick={() => setShowModal(true)} className="text-teal-600 hover:underline">
                        See all
                    </button>
                </div>
            )}

            {/* Grid hiển thị 4 bài viết theo 1 hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {displayedArticles.map((article) => (
                    <div
                        key={article.id}
                        onClick={() => handleArticleClick(article)}
                        className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200 flex flex-col"
                    >
                        <div className="aspect-[16/10] overflow-hidden">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                            <h3 className="font-semibold text-lg mb-3 line-clamp-2 min-h-[56px]">
                                {article.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                                {article.description}
                            </p>
                            <div className="flex justify-between items-center text-sm mt-auto">
                                <span className="text-teal-600 font-medium">{article.category}</span>
                                <span className="text-gray-500">{article.duration}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal hiển thị trên toàn bộ trang */}
            {showModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex justify-center items-center">
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
                                    {/* Container cho hình ảnh với kích thước cố định */}
                                    <div className="flex-shrink-0 w-32 h-24 relative">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold line-clamp-1">{article.title}</h3>
                                        <p className="text-sm text-gray-500">{article.category} • {article.duration}</p>
                                        <p className="text-sm text-gray-600">{article.author}</p>
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
