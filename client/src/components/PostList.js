import React, { useEffect, useState } from "react";
import { getPosts } from "../services/posts";
import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";

import './PostList.css';
import { IconContext } from "react-icons/lib";

import { usePostListLoading } from "./common/postListLoading";
export function PostList() {
  // custom hook for handling the useEffect and loading
  const { loading, error, value: posts } = useAsync(getPosts, []);
  const loadingIndicator = usePostListLoading(loading, 5 )
  if (loadingIndicator) {
      return loadingIndicator;
  }


return (
  <div className="post-list-container">
    {posts?.map((post) => (
      <div className="post-list-item" key={post.id}>
        <Link to={`/posts/${post.id}`}>
          <h1>
            { 
              post.title
              } 
          </h1>
          
        </Link>
      </div>
    ))}
  </div>
);
}
