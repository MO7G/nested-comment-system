import React, { useContext, useEffect, useMemo, useState } from "react";
import { useAsync } from "../hooks/useAsync";
import { getPost } from "../services/posts";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


const PostContext = React.createContext();
export function usePost() {
    return useContext(PostContext);
}

export function PostProvider({ children }) {
    const { postId } = useParams();
    const { loading, error, value: post } = useAsync(() => getPost(postId), [postId]);
    const [comments, setComments] = useState([])
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

    useEffect(() => {
        if (post?.comments == null) {
            return;
        } else {
            setComments(post.comments);
        }
    }, [post?.comments])

    const getReplies = (parentId) => {
        return commentsByParrentId[parentId];
    }

    function createLocalComment(comment) {
        setComments(prevComments => {
            return [comment, ...prevComments]
        })
    }

    function updateLocalComment(id,message) {
        setComments(prevComments => {
            return prevComments.map(comment=>{
                if(comment.id === id){
                    return {...comment,message}
                }else{
                    return comment;
                }
            })
        })
    }

    function deleteLocalComment(id){
        setComments(prevComments=>{
            return prevComments.filter(comment => comment.id !== id)
        })
    }
    if (error) {
        navigate("/*");
        return null;
    }


    return (
        <PostContext.Provider value={{ post: { postId, ...post }, deleteLocalComment , getReplies, updateLocalComment, rootComments: commentsByParrentId[null], createLocalComment, isThereAnyReplyActive, setIsThereAnyReplyActive }}>
            {children}
        </PostContext.Provider>
    )
}