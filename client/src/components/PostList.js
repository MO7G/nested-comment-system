import React, { useEffect, useState } from "react";
import { getPosts } from "../services/posts";
import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
export function PostList() {
    // custom hook for handling the useEffect and loading
    const { loading, error, value: posts } = useAsync(getPosts, []);
    if(loading) return <h1>We are Loading </h1>
    if(error) return <h1 className="error-msg">This is error </h1>
    console.log(loading);
    console.log(error);
    console.log(posts);
    return posts.map(post => {
        return (
            <h1 key={post.id}>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h1>
        )
    })
}