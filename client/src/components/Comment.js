import { useEffect, useState } from "react";
import { usePost } from "../contexts/PostContext";
import { CommentList } from "./CommentList";
import { IconsBtn } from "./IconsBtn";
import { FaEdit, FaHeart, FaReply, FaTractor, FaTrash } from "react-icons/fa";
import { CommentForm } from "./CommentForm";
import { useAsync, useAsyncFn } from "../hooks/useAsync";
import { FaLevelDownAlt } from "react-icons/fa";
import { createComment, deleteComment, updateComment } from "../services/comments";
const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
});

export function Comment({
    id,
    user,
    createdAt,
    message,
    onReplyToggle,
    activeReplyId,
    activeEditId,
    onEditToggle,
    onLoading,
}) {
    const [areChildrenHidden, setAreChildrenHidden] = useState(false);
    const [isReplyActive, setIsReplayActive] = useState(false);
    const { post, getReplies, createLocalComment , updateLocalComment , deleteLocalComment } = usePost();
    const childComments = getReplies(id);
    const createCommentFn = useAsyncFn(createComment);
    const updateCommentFn = useAsyncFn(updateComment);
    const deleteCommentFn = useAsyncFn(deleteComment)
    const onCommentReply = (message) => {
        return createCommentFn
            .execute({ postId: post.postId, message, parentId: id })
            .then((comment) => {
                onReplyToggle(id);
                createLocalComment(comment);
                console.log("fuck")
            })
            .catch((error) => {
                console.log(
                    "Something went wrong in the createComentFn ya hajji",error);
            });
    };

    const onCommentUpdate = (message) => {
        console.log(user)
        return updateCommentFn
            .execute({ postId: post.postId, message, id, userId: user.id })
            .then((comment) => {
                onEditToggle(id);
                updateLocalComment(id, comment.message);
            })
            .catch((error) => {
                console.log(
                    "Something went wrong in the createComentFn ya hajji",
                    error
                );
            });
    };

    const onCommentDelete = ()=>{
    
        return deleteCommentFn
            .execute({ postId: post.postId, id })
            .then((comment)=> deleteLocalComment(comment.id))
            .catch((error) => {
                console.log(
                    "Something went wrong in the createComentFn ya hajji",
                    error
                );
            });
    }
    const dateFormatterHelper = (createdAt) => {
        return dateFormatter.format(Date.parse(createdAt));
    };

    const onCommentEditToggle = () => {
        // Close the reply section if it's open
        if (activeReplyId !== null) {
            onReplyToggle(null);
        }
        // Toggle the edit section
        onEditToggle(id);
    };

    const onCommentReplyToggle = () => {
        // Close any edit section if it's open
        if(activeEditId !== null){
            onEditToggle(null);
        }

        onReplyToggle(id);
    };

    return (
        <>
            <div className="comment">
                <div className="header">
                    <div className="name">{user.name}</div>
                    <div className="date">{dateFormatterHelper(createdAt)}</div>
                </div>
                {activeEditId === id ? (
                    <CommentForm
                        autoFocusStatus
                        intialValue={message}
                        onSubmit={onCommentUpdate}
                        loading={updateCommentFn.loading}
                        error={updateCommentFn.error}
                    />
                ) : (
                    <div className="message">{message}</div>
                )}
                <div className="footer">
                    <IconsBtn Icon={FaHeart} aria-label="Like">
                        2
                    </IconsBtn>
                    <IconsBtn
                        isActive={activeReplyId === id}
                        Icon={FaReply}
                        onClick={() => {
                            onCommentReplyToggle(id);
                        }}
                        aria-label={isReplyActive ? "Cancel Reply" : "Reply"}
                    />
                    <IconsBtn
                        Icon={FaEdit}
                        isActive={activeEditId === id}
                        onClick={() => {
                            onCommentEditToggle(id);
                        }}
                        aria-label="Edit"
                    />
                    <IconsBtn Icon={FaTrash} disabled={deleteCommentFn.loading} onClick={onCommentDelete} aria-label="Trash" color="danger" />
                    <FaLevelDownAlt
                        className={`show-nested-comment ${!areChildrenHidden ? "hide" : ""
                            }`}
                        aria-label="Show Nested Commentd"
                        onClick={() => setAreChildrenHidden(false)}
                    />
                </div>
            </div>
            {activeReplyId === id && (
                <div className="mt-1 ml-3">
                    <CommentForm
                        autoFocusStatus={true}
                        onSubmit={onCommentReply}
                        loading={createCommentFn.loading}
                        error={createCommentFn.error}
                        activeEditId={activeEditId}
                        onEditToggle={onEditToggle}
                    />
                </div>
            )}
            {childComments?.length > 0 && (
                <>
                    <div
                        className={`nested-comments-stack ${areChildrenHidden ? "hide" : ""
                            }`}
                    >
                        <button
                            className="collapse-line"
                            aria-label="Hide Replies"
                            onClick={() => setAreChildrenHidden(true)}
                        />
                        <div className="nested-comments">
                            <CommentList
                                comments={childComments}
                                activeReplyId={activeReplyId}
                                onReplyToggle={onReplyToggle}
                                activeEditId={activeEditId}
                                onEditToggle={onEditToggle}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
