import { makeRequest } from "./makeRequest";

export function createComment({postId,message,parentId}){
    console.log("this is the post id from inside " , postId)
    return makeRequest(`posts/${postId}/comments`,{
        method:"POST",
        data:{message,parentId},
    })
}

export function updateComment({postId,message,commentId}){
    console.log("this is the post id from inside " , postId)
    return makeRequest(`posts/${postId}/comments/${commentId}`,{
        method:"PUT",
        data:{message},
    })
}