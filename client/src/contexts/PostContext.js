import React, { useContext } from "react";
import { useAsync } from "../hooks/useAsync";
import { getPost } from "../services/posts";
import { useParams } from "react-router-dom";

const PostContext = React.createContext();


export function usePost(){
    return useContext(PostContext);
}

export function PostProvider({children}){
    const {postId} = useParams();
    const {loading , error , value:post} = useAsync(()=>getPost(postId),[postId]);

    if(loading) return <h1>Fetching comments</h1>
    if(error) return <h1 className="error-msg">something went wrong while fetching the comment</h1>
    return(
        <PostContext.Provider value={{post:{postId,...post}}}>
        {children}
        </PostContext.Provider>
    )
}