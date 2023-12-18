import { usePost } from "../contexts/PostContext";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { useAsyncFn } from "../hooks/useAsync";
import { createComment } from "../services/comments";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Post() {
    const { post, rootComments, createLocalComment } = usePost();
    const { loading, error, execute: createCommentFn } = useAsyncFn(createComment)
    const [isReplyActive, setIsReplyActive] = useState(false);
    const [isThereAnyReplyActive, setIsThereAnyReplyActive] = useState(false);
    const [activeReplyId, setActiveReplyId] = useState(null);
    const navigate = useNavigate();
    const handleReplyToggle = (commentId) => {
        setActiveReplyId((prev) => (prev === commentId ? null : commentId));
    };

    if(error){
        console.log("yah")
        navigate('/posts')
    }




    const onCommentCreate = (message) => {
        return createCommentFn({ postId: post.postId, message })
            .then(comment => {
                console.log("this is for testing right now this is the comment after create comment ", comment)
                createLocalComment(comment)
            })
            .catch((error) => {
                console.log("Something went wrong in the createComentFn ya hajji", error)
            })

    }

    return (
        <>
            <div className="post-content">
                <h1>{post.title}</h1>
                <article>{post.body}</article>
            </div>
            <section className="comment-section">
            <h1 className="comments-title">Comments</h1>

                <CommentForm loading={loading} error={error} onSubmit={onCommentCreate} />
                {rootComments != null && rootComments.length > 0 && (
                    <div className="fuckyou" >
                        <CommentList comments={rootComments} onReplyToggle={handleReplyToggle} activeReplyId={activeReplyId}
                        />
                    </div>
                )}
            </section>
        </>
    )
}