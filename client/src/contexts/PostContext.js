import React, { useContext, useEffect, useMemo, useState } from "react";
import { useAsync } from "../hooks/useAsync";
import { getPost } from "../services/posts";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const PostContext = React.createContext();


export function usePost() {
    return useContext(PostContext);
}

export function PostProvider({ children }) {
    const { postId } = useParams();
    const { loading, error, value: post } = useAsync(() => getPost(postId), [postId]);
    const [comments,setComment] = useState([])
    const [isThereAnyReplyActive, setIsThereAnyReplyActive] = useState(false); // New state variable
    const navigate = useNavigate();
    const commentsByParrentId = useMemo(() => {
        // making an empty group intially 
        const group = {}
        

        // checking if the post was retrieved or not yet from the server 
        if (comments == null) {
            // return empty array for now 
            return ["empy-post-comment"]
        }


        comments.forEach((comment, index) => {
            // checking if the parrentId exists in the group or not in case not then we will just assign an empty array in case it exists we will not change anything
            group[comment.parentId] ||= []
            group[comment.parentId].push(comment)
        })
        return group
    }, [comments])

    

    useEffect(()=>{
        if(post?.comments == null){
            return;
        }else{
            setComment(post.comments);
        }
    },[post?.comments])
    
    const getReplies = (parentId) => {
        return commentsByParrentId[parentId];
    }
    
    function createLocalComment(comment) {
        setComment(prevComments=>{
            return [comment,...prevComments]
        })
    }
    if (error) {
        navigate("/*");
        return null; 
    }

    if (loading) return <h1>Fetching comments</h1>

    return (
        <PostContext.Provider value={{ post: { postId, ...post }, getReplies, rootComments: commentsByParrentId[null],createLocalComment, isThereAnyReplyActive,setIsThereAnyReplyActive }}>
            {children}
        </PostContext.Provider>
    )
}