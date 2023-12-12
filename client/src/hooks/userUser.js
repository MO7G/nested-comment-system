// a fucntion used to get the value of the userId from the cookies since we are faking a user here !!
export function useUser() {
    return { id: document.cookie.match(/userId=(?<id>[^;]+);?$/).groups.id }
}