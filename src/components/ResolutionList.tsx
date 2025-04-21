import React, { useEffect, useState } from 'react';
import { apiGet } from '../utils/api';

type Resolution = {
    id: string;
    title: string;
    status: string;
    deadline: string;
};

const ResolutionList: React.FC = () => {
    const [resolutions, setResolutions] = useState<Resolution[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResolutions = async () => {
            try {
                const response = await apiGet<Resolution[]>('/api/resolutions/community');
                setResolutions(response);
            } catch (err) {
                setError('Failed to load resolutions.');
            } finally {
                setLoading(false);
            }
        };

        fetchResolutions();
    }, []);

    if (loading) return <div className="text-center mt-4">Loading resolutions...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="grid grid-cols-1 gap-4 mt-6">
            {resolutions.map((res) => (
                <div key={res.id} className="p-4 bg-white rounded-xl shadow-md border">
                    <h2 className="text-lg font-semibold">{res.title}</h2>
                    <p className="text-sm text-gray-500">Status: {res.status}</p>
                    <p className="text-sm text-gray-500">Deadline: {new Date(res.deadline).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
};

export default ResolutionList;
