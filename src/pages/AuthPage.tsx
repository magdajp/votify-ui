import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function AuthPage() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [communityName, setCommunityName] = useState('');
    const [communityLocation, setCommunityLocation] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`${backendUrl}/auth/login`, {
                email,
                password,
            });
            saveToken(response.data.token);
            //TODO: Redirect to dashboard or home page
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    const saveToken = (token: string) => {
        localStorage.setItem('jwt_token', token); //TODO: to remove
        Cookies.set('jwt_token', token, { expires: 7, secure: true, sameSite: 'Strict' });
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`${backendUrl}/auth/register`, {
                email,
                password,
                communityName,
                communityLocation,
                firstName,
                lastName
            });
            saveToken(response.data.token);
            //TODO: Redirect to dashboard or home page
        } catch (error) {
            setError('Registration failed. Please check your inputs.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold text-center mb-6">
                    {isRegistering ? 'Create an Account' : 'Login'}
                </h1>
                <form onSubmit={isRegistering ? handleRegister : handleLogin}
                      className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {isRegistering && (
                        <>
                            <input
                                type="text"
                                placeholder="First name"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last name"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Community Name"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                value={communityName}
                                onChange={(e) => setCommunityName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Community Location"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                value={communityLocation}
                                onChange={(e) => setCommunityLocation(e.target.value)}
                                required
                            />
                        </>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        {isRegistering ? 'Register' : 'Login'}
                    </button>
                </form>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <p className="mt-4 text-center text-sm">
                    {isRegistering ? 'Already have an account?' : 'Don\'t have an account?'}
                    <button
                        className="ml-1 text-blue-600 hover:underline"
                        onClick={() => setIsRegistering(!isRegistering)}
                    >
                        {isRegistering ? 'Log in' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    );
}
