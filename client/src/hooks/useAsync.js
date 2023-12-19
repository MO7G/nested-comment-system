import { useCallback, useEffect, useState } from "react";
import { isRouteErrorResponse } from "react-router-dom";

// This going to be called automatically
export function useAsync(func,dependencies=[]){
 const {execute, ...state} = useAsyncInternal(func,dependencies,true);
 useEffect(()=>{
   
    execute();
 },[execute])

 return state;
}

// This is going to be called when we call it 
export function useAsyncFn(func,dependencies=[]){
    return useAsyncInternal(func,dependencies,false);
}


// this is going to be called by the useAsync or useAsyncFn
function useAsyncInternal(func,dependencies,intialLoading=false){
    const [loading,setLoading] = useState(intialLoading);
    const [error,setError] = useState();
    const [value,setValue] = useState();

    const execute = useCallback((...params)=>{
        setLoading(true);
        return func(...params)
        .then(data=>{
            setValue(data);
            setError(undefined);
            return data;
        })
        .catch(error=>{
            console.error("This is error from the useAsyncInternal ya hajji")
            setError(error);
            setValue(undefined);
            // Return a resolved promise with a default value to prevent the entire chain from being rejected
            return Promise.reject(error)
        })
        .finally(()=>{
            setLoading(false);
        })
    },dependencies)


    return {loading,error,value,execute};
}