import { useEffect, useState } from "react";
import { usePost } from "../contexts/PostContext"
import { CommentList } from "./CommentList";
import { IconsBtn } from "./IconsBtn"
import { FaEdit, FaHeart, FaReply, FaTractor, FaTrash } from "react-icons/fa"
import { CommentForm } from "./CommentForm";
import { useAsync, useAsyncFn } from "../hooks/useAsync";
import { FaLevelDownAlt } from "react-icons/fa";


import { createComment } from "../services/comments";
const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" })


export function Comment({ id, user, createdAt, message, onReplyToggle, activeReplyId }) {
    const [areChildrenHidden, setAreChildrenHidden] = useState(false);
    const [isReplyActive, setIsReplayActive] = useState(false);
    const { post, getReplies, createLocalComment, isThereAnyReplyActive, setIsThereAnyReplyActive } = usePost();
    const childComments = getReplies(id);
    const createCommentFn = useAsyncFn(createComment);

    const onCommentReply = (message) => {
        return createCommentFn
            .execute({ postId: post.postId, message, parentId: id })
            .then((comment) => {
                onReplyToggle(id);
                createLocalComment(comment);
            })
            .catch((error) => {
                console.log("Something went wrong in the createComentFn ya hajji", error);
            });
    };

    const dateFormatterHelper = (createdAt) => {
        return dateFormatter.format(Date.parse(createdAt));
    };

    const showInfo = () => {
        console.log("the key of this is " , id);
        console.log("the activeReplyId opened is  ", activeReplyId);

    };

    return (
        <>
          {/*  <button onClick={() => showInfo()}>see the state of isreplay</button>*/}
            {/*<button onClick={() => setIsThereAnyReplyActive((prev) => !prev)}>toggle me</button>*/}

            <div className="comment">
                <div className="header">
                    <div className="name">{user.name}</div>
                    <div className="date">{dateFormatterHelper(createdAt)}</div>
                </div>
                <div className="message">{message}</div>
                <div className="footer">
                    <IconsBtn Icon={FaHeart} aria-label="Like">
                        2
                    </IconsBtn>
                    <IconsBtn
                        isActive={activeReplyId === id}
                        Icon={FaReply}
                        onClick={() => {
                            onReplyToggle(id);
                        }}
                        aria-label={isReplyActive ? "Cancel Reply" : "Reply"}
                    />
                    <IconsBtn Icon={FaEdit} aria-label="Edit" />
                    <IconsBtn Icon={FaTrash} aria-label="Trash" color="danger" />
                    <FaLevelDownAlt   className={`show-nested-comment ${!areChildrenHidden ? "hide" : ""}`} aria-label="Show Nested Commentd" onClick={() => setAreChildrenHidden(false)} />

                </div>
            </div>
            {activeReplyId === id && (
                <div className="mt-1 ml-3">
                    <CommentForm autoFocusStatus={true} onSubmit={onCommentReply} loading={createCommentFn.loading} error={createCommentFn.error} />
                </div>
            )}
            {childComments?.length > 0 && (
                <>
                    <div className={`nested-comments-stack ${areChildrenHidden ? "hide" : ""}`}>
                        <button className="collapse-line" aria-label="Hide Replies" onClick={() => setAreChildrenHidden(true)} />
                        <div className="nested-comments">
                            <CommentList comments={childComments} activeReplyId={activeReplyId} onReplyToggle={onReplyToggle} />
                        </div>
                    </div>
                    
                    
                </>
            )}
        </>
    );
}