// src/routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PostList } from '../components/PostList';
import PrivateRoutes from '../components/PrivateRoutes';
import NotFound from '../components/NotFound';
import { PostProvider } from '../contexts/PostContext';
import { Post } from '../components/Post';
const MainRoutes = ({ isAuthenticated }) => {
    return (
        <Routes>
            <Route path="/" element={<h1>I am the main hello</h1>} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/:postId" element={<PostProvider><Post/></PostProvider>} />
            <Route path="/about" element={<h1>I am the about</h1>} />


            {/* All other routes are private  */}
            <Route path="/dashboard" element={<PrivateRoutes isAuthenticated={isAuthenticated} component={() =><h1>I am the dashboard</h1>} />} />





              {/* 404 Route - This will never match if `/*` is matched first */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default MainRoutes;
