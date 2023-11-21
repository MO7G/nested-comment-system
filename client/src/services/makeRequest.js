import axios from "axios"
const api = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    withCredentials: true
})




    export function makeRequest(url, options,delay=0){
        const doMakeRequest=()=>{
            return api(url,options)
            .then(res=>res.data)
            .catch(error=>(
                Promise.reject(error?.response?.data?.message ?? "Error from axios request")
            ))};



        if(delay === 0){
        return  doMakeRequest();
        }else{
        return new Promise((resolve,reject)=>{
                setTimeout(() => {
                    doMakeRequest()
                    .then(resolve)
                    .catch(reject);
                }, delay);
            })
        }
    }