import { useState } from "react";
import { usePost } from "../contexts/PostContext"
import { CommentList } from "./CommentList";
import { IconsBtn } from "./IconsBtn"
import {FaEdit, FaHeart, FaReply, FaTractor, FaTrash} from "react-icons/fa"
const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" })

export function Comment(singleComment) {
    const [areChildrenHidden,setAreChildrenHidden] =useState(false);
    const {getReplies} = usePost();
    const childComments = getReplies(singleComment.id)
    const dateFormatterHelper = (createdAt)=>{
        return dateFormatter.format(Date.parse(createdAt))
    }

    return (
        <>
            <div className="comment">
                <div className="header">
                    <div className="name">{singleComment.user.name}</div>
                    <div className="date">{dateFormatterHelper(singleComment.createdAt)}</div>
                </div>
                <div className="message">{singleComment.message}</div>
                <div className="footer">
                    <IconsBtn Icon={FaHeart} aria-label="Like">2</IconsBtn>
                    <IconsBtn Icon={FaReply} aria-label="Reply"/>
                    <IconsBtn Icon={FaEdit} aria-label="Edit"/>
                    <IconsBtn Icon={FaTrash} aria-label="Trash" color="danger"/>
                </div>
            </div>
            {childComments?.length > 0 &&(
                <>
                <div className={`nested-comments-stack ${areChildrenHidden ? "hide" : ""}`}>
                    <button  className="collapse-line" aria-label="Hide Replies" onClick={()=> setAreChildrenHidden(true)}/>
                    <CommentList comments={childComments}/>
                </div>
                <button className={`btn mt-1 ${!areChildrenHidden ? "hide":""}`} onClick={()=> setAreChildrenHidden(false)}>Show replies</button>
                </>
            )}
        </>
    )
}