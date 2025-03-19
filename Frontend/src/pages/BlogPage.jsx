import React from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Introduce from "../component/BlogPage/Introduce/Introduce";
import BlogList from "../component/BlogPage/BlogList/BlogList";

const BlogPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow mt-20">
                <div className="py-5">
                    <Introduce />
                </div>
                <div className="py-10">
                    <BlogList />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BlogPage;