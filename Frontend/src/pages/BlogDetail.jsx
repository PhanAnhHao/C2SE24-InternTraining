import React from "react";
import BlogContent from "../component/BlogDetail/BlogContent/BlogContent";
import AuthorInfo from "../component/BlogDetail/AuthorInfo/AuthorInfo";
import TagList from "../component/BlogDetail/TagList/TagList";
import RelatedBlog from "../component/BlogPage/RelatedBlog/RelatedBlog";

const blogs = [
    { id: 1, title: "Class adds $30 million to its balance sheet for a Zoom-friendly edtech solution", description: "Class, launched less than a year ago..." },
    { id: 2, title: "Class secures $50 million funding for innovative learning platform", description: "Class, launched less than a year ago..." },
    { id: 3, title: "Education technology trends in 2024", description: "Class, launched less than a year ago..." },
];

const BlogDetail = () => {
    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <BlogContent />
            <TagList />
            <AuthorInfo />
            <RelatedBlog />
        </div>
    );
};

export default BlogDetail;