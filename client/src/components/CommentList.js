import { Comment } from "./Comment";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useActionData } from "react-router-dom";

export function CommentList({ comments,activeReplyId, onReplyToggle  }) {
    return comments.map((singleComment, index) => (
      <div key={singleComment.id} className="comment-stack">
        <Comment {...singleComment} onReplyToggle={onReplyToggle} activeReplyId={activeReplyId} />
      </div>
    ));
  }