import React, { useState } from 'react';
import { apiPut } from '../utils/api.ts';
import toast from 'react-hot-toast';

interface AddResidentFormProps {
    communityId: string;
    onSuccess: () => void;
}

const AddResidentForm: React.FC<AddResidentFormProps> = ({ communityId, onSuccess }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await apiPut(`/api/housing-community/${communityId}/resident`, {
                firstName,
                lastName,
                email,
                password
            });

            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setSuccess('Resident added successfully!');
            onSuccess();
        } catch (err) {
            // @ts-ignore
            setError(`Failed to add resident: ${err.response.data.message}`);
            // @ts-ignore
            toast.error(`Failed to add resident: ${err.response.data.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-white">Add New Resident</h2>

            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
            />
            <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-600 transition"
            >
                Submit
            </button>

            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-500 text-sm">{success}</div>}
        </form>
    );
};

export default AddResidentForm;
