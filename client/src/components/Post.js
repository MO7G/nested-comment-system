import { usePost } from "../contexts/PostContext";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { useAsyncFn } from "../hooks/useAsync";
import { createComment } from "../services/comments";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import {usePostLoading} from "./common/postLoading"


export function Post() {
    const { post, rootComments, createLocalComment } = usePost();
    const { loading, error, execute: createCommentFn } = useAsyncFn(createComment)
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [activeEditId,setAtiveEditId] = useState(null)
    const navigate = useNavigate();
    const loadingIndicator = usePostLoading( post.body === undefined ? true : false, [1, 5]);


    if (loadingIndicator) {
    return loadingIndicator;
    }
    const handleReplyToggle = (commentId) => {
        setActiveReplyId((prev) => (prev === commentId ? null : commentId));
    };

    const handleEditToggle = (commentId) => {
        setAtiveEditId((prev) => (prev === commentId ? null : commentId));
    };


    const onCommentCreate = (message) => {
        return createCommentFn({ postId: post.postId, message })
            .then(comment => {
                createLocalComment(comment)
            })
            .catch((error) => {
                console.log("Something went wrong in the createComentFn ya hajji", error)
            })

    }


    return (
        <>
            <div className="post-content">
                <h1>{post.title }</h1>
                <article>{post.body }</article>
            </div>
            <section className="comment-section">
                <h1 className="comments-title">Comments</h1>
                <CommentForm loading={loading} error={error} onSubmit={onCommentCreate} />
                    <div className="mt-4">
                    <CommentList loading={loading} comments={rootComments} onReplyToggle={handleReplyToggle} activeReplyId={activeReplyId} activeEditId={activeEditId} onEditToggle={handleEditToggle} />
                    </div>
            </section>
        </>
    );

}