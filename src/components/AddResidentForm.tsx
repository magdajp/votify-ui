import React, { useState } from 'react';
import { apiPost } from '../utils/api.ts';

interface AddResidentFormProps {
    communityId: string;
    onSuccess: () => void;
}

const AddResidentForm: React.FC<AddResidentFormProps> = ({ communityId, onSuccess }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            await apiPost(`/api/housing-community/${communityId}/resident`, {
                firstName,
                lastName,
                email,
                password,
            });

            setMessage('Resident added successfully.');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
        } catch (err) {
            console.error(err);
            setError('Failed to add resident.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                />
            </div>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded w-full"
                required
            />
            <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded w-full"
                required
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Add Resident
            </button>
            {message && <p className="text-green-600">{message}</p>}
            {error && <p className="text-red-600">{error}</p>}
        </form>
    );
};

export default AddResidentForm;
