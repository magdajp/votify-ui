import React, { useEffect, useState } from 'react';
import { apiGet } from '../utils/api';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo-dark.png';

interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
}

const Navbar: React.FC = () => {
    const [user, setUser] = useState<UserDetails | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await apiGet<UserDetails>('/api/user/details');
                setUser(res);
            } catch (err) {

            }
        };

        fetchUserDetails();
    }, []);

    const handleLogout = () => {
        Cookies.remove('jwt_token');
        navigate('/login');
    };

    return (
        <div className="sticky top-0 z-50 bg-neutral-900 px-0 py-3 flex justify-between items-center border-b border-neutral-800 shadow-md">
            <div className="flex items-center gap-4">
                <img src={Logo} alt="Logo" className="h-18" />
                {user && (
                    <div className="text-sm text-gray-300">
                        <span className="font-semibold text-white">{user.firstName} {user.lastName}</span>{' '}
                        <span className="text-gray-400">&lt;{user.email}&gt;</span>
                    </div>
                )}
            </div>
            <button
                onClick={handleLogout}
                className="text-sm bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
                Logout
            </button>
        </div>
    );
};

export default Navbar;
