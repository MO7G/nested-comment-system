import { Comment } from "./Comment";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useActionData } from "react-router-dom";
 

export function CommentList({ loading , comments,activeReplyId, onReplyToggle,activeEditId,onEditToggle}) {

  return comments?.map((singleComment, index) => (
    <div key={singleComment.id} className="comment-stack">
      <Comment {...singleComment} onReplyToggle={onReplyToggle} activeReplyId={activeReplyId} onEditToggle={onEditToggle} activeEditId={activeEditId} />
    </div>
  ));
  
  }