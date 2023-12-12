import { usePost } from "../contexts/PostContext";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { useAsyncFn } from "../hooks/useAsync";
import { createComment } from "../services/comments";

export function Post() {
    const { post , rootComments } = usePost();
    const {loading , error , execute:createCommentFn} = useAsyncFn(createComment)
    
    console.log("This is the post hahah " , post)
    const onCommentCreate = (message) => {
        return createCommentFn({postId:post.postId , message})
        .then(comment=>{
            console.log("this is for testing right now this is the comment after create comment " ,comment)
        })
        .catch((error)=>{
            console.log("Something went wrong in the createComentFn ya hajji" , error)
        })
        
    }

    return (
        <>
            <h1>{post.title}</h1>
            <article>{post.body}</article>
            <h3 className="comments-title">Comments</h3>
            <section>
                <CommentForm loading={loading} error={error} onSubmit={onCommentCreate}/>
                {rootComments  != null && rootComments.length > 0 &&(
                    <div>
                        <CommentList comments={rootComments}/>
                    </div>
                )}
            </section>
        </>
    )
}