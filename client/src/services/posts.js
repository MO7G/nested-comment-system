import { makeRequest } from "./makeRequest";
const delay = 1000;
export function getPosts(){
    return makeRequest("/posts" , {} , delay);
}

export function getPost(id){
    return makeRequest(`/posts/${id}`, {} , delay)
}