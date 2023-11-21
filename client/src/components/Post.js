import {usePost} from "../contexts/PostContext";
export function Post() {
    const { post } = usePost();
    console.log(post);
    return <h1>I am the post man </h1>
}