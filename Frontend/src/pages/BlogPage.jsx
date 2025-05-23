import React from "react";
import Introduce from "../component/BlogPage/Introduce/Introduce";
import BlogList from "../component/BlogPage/BlogList/BlogList";
import RelatedBlog from "../component/BlogPage/RelatedBlog/RelatedBlog";
import Articles from "../component/BlogPage/Articles/Articles";

const BlogPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow mt-20">
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
                </div>
            </main>
        </div>
    );
};

export default BlogPage;