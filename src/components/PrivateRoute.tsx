import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    element: React.ReactNode;
    path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, path }) => {
    const token = localStorage.getItem('jwt_token');

    return (
        <Routes>
            <Route
                path={path}
                element={token ? element : <Navigate to="/login" />}
            />
        </Routes>
    );
};

export default PrivateRoute;
