import React, { useContext, useMemo } from "react";
import { useAsync } from "../hooks/useAsync";
import { getPost } from "../services/posts";
import { useParams } from "react-router-dom";

const PostContext = React.createContext();


export function usePost() {
    return useContext(PostContext);
}

export function PostProvider({ children }) {
    const { postId } = useParams();
    const { loading, error, value: post } = useAsync(() => getPost(postId), [postId]);

    const commentsByParrentId = useMemo(() => {
        // making an empty group intially 
        const group = {}

        // checking if the post was retrieved or not yet from the server 
        if (post?.comments == null) {
            // return empty array for now 
            return ["empy-post-comment"]
        }


        post.comments.forEach((comment, index) => {

            // checking if the parrentId exists in the group or not in case not then we will just assign an empty array in case it exists we will not change anything
            group[comment.parentId] ||= []
            group[comment.parentId].push(comment)

        })

        return group
    }, [post])
    
    const getReplies = (parentId) => {
        return commentsByParrentId[parentId];
    }


    if (loading) return <h1>Fetching comments</h1>
    if (error) return <h1 className="error-msg">something went wrong while fetching the comment</h1>
    return (
        <PostContext.Provider value={{ post: { postId, ...post }, getReplies, rootComments: commentsByParrentId[null] }}>
            {children}
        </PostContext.Provider>
    )
}