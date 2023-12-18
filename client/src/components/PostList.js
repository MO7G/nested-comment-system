import React, { useEffect, useState } from "react";
import { getPosts } from "../services/posts";
import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import Skeleton from 'react-loading-skeleton';
import './PostList.css';
import { IconContext } from "react-icons/lib";

export function PostList() {
  // custom hook for handling the useEffect and loading
  const { loading, error, value: inComingPosts } = useAsync(getPosts, []);
  const [posts, setPosts] = useState(Array(4).fill([{ id: "", title: "" }]));
  useEffect(() => {
    if(!loading && inComingPosts){
      setPosts(inComingPosts)
    }
  }, [loading, error, inComingPosts]); 

return (
  <div className="post-list-container">
    {posts.map((post) => (
      <div className="post-list-item" key={post.id}>
        <Link to={`/posts/${post.id}`}>
          <h1>
            { 
              post.title ||  <Skeleton width={"520px"} height={"150px"} count={1} /> 
              } 
          </h1>
          
        </Link>
      </div>
    ))}
  </div>
);
}
