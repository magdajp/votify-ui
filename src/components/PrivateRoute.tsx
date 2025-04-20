import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { apiGet } from '../utils/api.ts';
import { Role } from '../Role.tsx';

interface PrivateRouteProps {
    children: JSX.Element;
    allowedRole?: Role;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRole }) => {
    const token = Cookies.get('jwt_token');
    const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        const checkAccess = async () => {
            if (!token) {
                setIsAuthorized(false);
                return;
            }

            try {
                const user = await apiGet<{ role: Role }>('/api/user/details');
                if (!allowedRole || user.role === allowedRole) {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch {
                setIsAuthorized(false);
            }
        };

        checkAccess();
    }, [allowedRole]);

    if (isAuthorized === null) return <div className="text-center mt-10">Checking permissions...</div>;

    return isAuthorized ? children : <Navigate to="/redirect" replace />;
};

export default PrivateRoute;
