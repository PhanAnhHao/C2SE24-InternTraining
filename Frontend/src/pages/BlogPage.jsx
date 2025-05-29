import React from "react";
import Introduce from "../component/BlogPage/Introduce/Introduce";
import BlogList from "../component/BlogPage/BlogList/BlogList";
import RelatedBlog from "../component/BlogPage/RelatedBlog/RelatedBlog";
import Articles from "../component/BlogPage/Articles/Articles";
import { BlogProvider } from "../context/BlogContext";
import theme_blog from "../assets/theme_blog.jpg";

const BlogPage = () => {
    return (
        <BlogProvider>
            <div className="min-h-screen flex flex-col bg-cover bg-center bg-fixed relative overflow-hidden"
                style={{
                    backgroundImage: `linear(rgba(255,255,0,0),rgba(255,255,0,0),0.5),url(${theme_blog})`,
                    backgroundColor: '#f3f4f6'
                }}
            >
                {/* Overlay layer with blur effect */}
                <div className="absolute inset-0 backdrop-blur-[20px] bg-black/80 -z-10"></div>
                <main className="flex-grow mt-20 relative">
                    <div className="py-5">
                        <Introduce />
                    </div>
                    <div className="py-10">
                        <BlogList />
                    </div>
                    <div className="py-10">
                        <RelatedBlog />
                    </div>
                    <div className="py-10">
                        <Articles />
                    </div>            </main>
            </div>
        </BlogProvider>
    );
};

export default BlogPage;