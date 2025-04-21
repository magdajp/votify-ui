import './App.css';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import React from 'react';
import Cookies from 'js-cookie';

import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import ResidentDashboard from './pages/ResidentDashboard';
import { apiGet } from './utils/api.ts';
import PrivateRoute from './components/PrivateRoute';
import { Role } from './Role.tsx';

const App: React.FC = () => {
    const token = Cookies.get('jwt_token');

    return (
        <div className="min-h-screen bg-neutral-900 text-white">
            <Router>
                <Routes>
                    <Route path="/" element={token ? <Navigate to="/redirect"/> : <AuthPage/>}/>
                    <Route path="/login" element={<AuthPage/>}/>
                    <Route path="/redirect" element={<RedirectAfterLogin/>}/>
                    <Route
                        path="/admin-dashboard"
                        element={
                            <PrivateRoute allowedRole={Role.ADMIN}>
                                <AdminDashboard/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/resident-dashboard"
                        element={
                            <PrivateRoute allowedRole={Role.RESIDENT}>
                                <ResidentDashboard/>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </div>
    );
};

const RedirectAfterLogin: React.FC = () => {
    const token = Cookies.get('jwt_token');

    const [role, setRole] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await apiGet<{ role: Role }>('/api/user/details');
                setRole(response.role);
            } catch (err) {
                console.error('Failed to fetch user details');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (!token) return <Navigate to="/login"/>;
    if (role === Role.ADMIN) return <Navigate to="/admin-dashboard"/>;
    return <Navigate to="/resident-dashboard"/>;
};

export default App;
