import { Comment } from "./Comment"
export function CommentList({comments}){
    return comments.map(singleComment =>(
        <div key={singleComment.id} className="comment-stack">
            <Comment {...singleComment }/>
        </div>
    ))
}