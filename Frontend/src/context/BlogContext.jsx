import React, { createContext, useContext, useState } from 'react';

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
    const [featuredArticle, setFeaturedArticle] = useState(null);

    return (
        <BlogContext.Provider value={{ featuredArticle, setFeaturedArticle }}>
            {children}
        </BlogContext.Provider>
    );
};

export const useBlog = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlog must be used within a BlogProvider');
    }
    return context;
};
