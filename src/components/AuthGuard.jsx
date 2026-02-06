import React from 'react';
import { Navigate } from "react-router-dom";

const AuthGuard = ({
    children,
    requiredAuth = true,
    redirect = "/login"
}) => {
    const authData = JSON.parse(localStorage.getItem("authData"));
    const isAuthenticated = !!authData;

    if (!requiredAuth && isAuthenticated) {
        return <Navigate to='/' replace />
    }

    if (requiredAuth && !isAuthenticated) {
        return <Navigate to={redirect} replace />
    }

    return children
}

export default AuthGuard;
