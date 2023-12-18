// src/components/PrivateRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NotFound from './NotFound';
const PrivateRoutes = ({ isAuthenticated , component:ToBeRendered }) => {
    
    if(!isAuthenticated){
       return <Navigate to="/"/>
    }

    return <ToBeRendered/>
};

export default PrivateRoutes;
