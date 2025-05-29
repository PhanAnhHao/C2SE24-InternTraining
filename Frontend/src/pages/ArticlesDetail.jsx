import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaClock, FaFolder } from "react-icons/fa";
import theme_log from "../assets/ava_lap.jpg";
import Articles from "../component/BlogPage/Articles/Articles";
import { BlogProvider } from "../context/BlogContext";

const articleDetails = {
    1: {
        content: `AWS (Amazon Web Services) is a comprehensive cloud computing platform that offers over 200 fully featured services. The Solutions Architect Associate certification is one of the most sought-after cloud certifications.

        Key Topics Covered:
        • Amazon EC2 and AWS architecture best practices
        • Virtual Private Cloud (VPC) design and implementation
        • Storage solutions with S3, EBS, and EFS
        • Database services including RDS, DynamoDB, and Aurora
        • High availability and fault tolerance strategies
        • Cost optimization and security best practices`,
        highlights: [
            "Hands-on labs with real AWS services",
            "Practice exams and scenario-based learning",
            "Architecture design workshops",
            "Real-world case studies from industry"
        ],
        skills: [
            "Cloud architecture design",
            "AWS service integration",
            "Security and compliance",
            "Cost optimization",
            "Performance tuning"
        ]
    },
    2: {
        content: `Machine Learning with Python has become an essential skill in the field of data science and artificial intelligence. This course provides a comprehensive introduction to machine learning concepts and their implementation.

        Core Concepts:
        • Data preprocessing and feature engineering
        • Supervised and unsupervised learning algorithms
        • Neural networks and deep learning basics
        • Model evaluation and validation techniques
        • Production deployment strategies`,
        highlights: [
            "Interactive Jupyter notebooks",
            "Real-world datasets analysis",
            "Algorithm implementation from scratch",
            "Industry-standard ML frameworks"
        ],
        skills: [
            "Data analysis with Python",
            "Machine learning algorithms",
            "Model optimization",
            "Feature engineering",
            "ML model deployment"
        ]
    },
    3: {
        content: `The MERN Stack (MongoDB, Express.js, React, Node.js) is a powerful combination for building modern web applications. This comprehensive course covers full-stack development from frontend to backend.

        Course Coverage:
        • Modern JavaScript and ES6+ features
        • React components and hooks
        • RESTful API design with Express.js
        • MongoDB database operations
        • Authentication and authorization`,
        highlights: [
            "Complete web application projects",
            "Real-time features with Socket.io",
            "State management with Redux",
            "Cloud deployment techniques"
        ],
        skills: [
            "Frontend development with React",
            "Backend development with Node.js",
            "Database management",
            "API design",
            "Full-stack integration"
        ]
    },
    4: {
        content: `React Native enables developers to build native mobile applications using JavaScript and React. This course teaches you how to create cross-platform mobile apps that work on both iOS and Android.

        Topics Covered:
        • React Native components and APIs
        • Native UI development
        • Navigation and state management
        • Device features integration
        • Performance optimization`,
        highlights: [
            "Cross-platform app development",
            "Native device features integration",
            "UI/UX best practices",
            "App store deployment"
        ],
        skills: [
            "Mobile app development",
            "Cross-platform coding",
            "Native APIs integration",
            "App performance optimization",
            "Mobile UI design"
        ]
    },
    5: {
        content: `DevOps practices are essential for modern software development. This course covers the tools and practices needed for implementing efficient CI/CD pipelines and automation.

        Key Areas:
        • Continuous Integration and Deployment
        • Container orchestration with Kubernetes
        • Infrastructure as Code
        • Monitoring and logging
        • Automation scripts and tools`,
        highlights: [
            "Hands-on experience with CI/CD tools",
            "Container orchestration practices",
            "Cloud infrastructure management",
            "Automated testing strategies"
        ],
        skills: [
            "CI/CD pipeline creation",
            "Container management",
            "Infrastructure automation",
            "Cloud deployment",
            "DevOps practices"
        ]
    },
    6: {
        content: `Cyber Security and Ethical Hacking is crucial in today's digital world. This course provides comprehensive coverage of security concepts and practical hacking techniques.

        Course Content:
        • Network security fundamentals
        • Penetration testing methodologies
        • Web application security
        • Wireless network security
        • Security tools and frameworks`,
        highlights: [
            "Practical hacking labs",
            "Security tool mastery",
            "Real-world attack scenarios",
            "Defense strategy development"
        ],
        skills: [
            "Penetration testing",
            "Security assessment",
            "Vulnerability analysis",
            "Security tool usage",
            "Defense strategies"
        ]
    }
};

const ArticlesDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const article = location.state?.article;
    const details = article ? articleDetails[article.id] : null;


    // Check authentication status and user role on component mount
    useEffect(() => {
        const businessId = localStorage.getItem('businessId');
        const role = localStorage.getItem('role');
        setIsLoggedIn(!!businessId);
        setUserRole(role);
    }, []);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);

    if (!article || !details) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">Article not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-10">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header Image */}
                <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Article Info */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {article.title}
                    </h1>
                    <div className="flex items-center gap-6 text-gray-600">
                        <div className="flex items-center gap-2">
                            <img
                                src={theme_log}
                                alt={article.author}
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="text-sm">{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaClock className="text-teal-500" />
                            <span className="text-sm">{article.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaFolder className="text-teal-500" />
                            <span className="text-sm">{article.category}</span>
                        </div>
                    </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                        {details.content}
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Highlights</h2>
                    <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                        {details.highlights.map((highlight, index) => (
                            <li key={index}>{highlight}</li>
                        ))}
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills You'll Gain</h2>
                    <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                        {details.skills.map((skill, index) => (
                            <li key={index}>{skill}</li>
                        ))}
                    </ul>                </div>

                {/* Call to Action - Only show if user is not logged in and is not Business/Student */}
                {(!isLoggedIn && userRole !== 'Business' && userRole !== 'Student') && (
                    <div className="mt-10 p-6 bg-gray-50 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            Ready to Get Started?
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Join our community of learners and start your journey in {article.category} today.
                        </p>
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
                        >
                            Enroll Now
                        </button>
                    </div>
                )}
            </div>{/* Related Articles Section */}
            <div className="max-w-7xl mx-auto mt-16 px-4">
                <div className="border-t pt-16">
                    <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
                    <BlogProvider>
                        <Articles hideTitle={true} excludeId={article.id} />
                    </BlogProvider>
                </div>
            </div>
        </div>
    );
};

export default ArticlesDetail;
