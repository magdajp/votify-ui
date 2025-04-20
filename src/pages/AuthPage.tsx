import { useState } from "react";
import * as React from 'react';

export default function AuthPage() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [communityName, setCommunityName] = useState("");
    const [communityLocation, setCommunityLocation] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = isRegistering
            ? { email, password, communityName, communityLocation }
            : { email, password };

        console.log("Submitting:", payload);
        // Here you would send payload to the backend
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold text-center mb-6">
                    {isRegistering ? "Create an Account" : "Login"}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        {isRegistering ? "Register" : "Login"}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    {isRegistering ? "Already have an account?" : "Don't have an account?"}
                    <button
                        className="ml-1 text-blue-600 hover:underline"
                        onClick={() => setIsRegistering(!isRegistering)}
                    >
                        {isRegistering ? "Log in" : "Register"}
                    </button>
                </p>
            </div>
        </div>
    );
}
