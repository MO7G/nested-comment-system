import { makeRequest } from "./makeRequest";

export function createComment({postId,message,parentId}){

    return makeRequest(`posts/${postId}/comments`,{
        method:"POST",
        data:{message,parentId},
    })
}

export function updateComment({postId,message,id,userId}){
    console.log("user From inside " , userId)
    return makeRequest(`posts/${postId}/comments/${id}`,{
        method:"PUT",
        data:{message,userId},
    })
}

export function deleteComment({postId,id}){
    console.log("this is the post id from inside hhhh" , id )
    return makeRequest(`posts/${postId}/comments/${id}`,{
        method:"DELETE",
    })
}