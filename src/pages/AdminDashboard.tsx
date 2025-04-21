import React, { useEffect, useState } from 'react';
import AddResolutionForm from '../components/AddResolutionForm.tsx';
import ResolutionList from '../components/ResolutionList.tsx';
import { apiGet } from '../utils/api.ts';

type DetailsResponse = {
    email: string;
    role: string;
    communityId: string;
    communityName: string;
};

const AdminDashboard: React.FC = () => {
    const [communityId, setCommunityId] = useState('');
    const [communityName, setCommunityName] = useState('');
    const [activeTab, setActiveTab] = useState<'add' | 'list'>('list');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await apiGet<DetailsResponse>('/api/user/details');
                setCommunityId(response.communityId);
                setCommunityName(response.communityName);
            } catch (err) {
                console.error('Failed to fetch community details');
            }
        };
        fetchDetails();
    }, []);

    return (
        <div className="min-h-screen p-6">
            <h1 className="text-2xl font-bold mb-6">Community: {communityName}</h1>

            <div className="mb-6 flex gap-4">
                <button
                    className={`px-4 py-2 rounded ${
                        activeTab === 'list' ? 'bg-gray-600 text-white' : 'bg-gray-800'
                    }`}
                    onClick={() => setActiveTab('list')}
                >
                    Resolutions
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        activeTab === 'add' ? 'bg-gray-600 text-white' : 'bg-gray-800'
                    }`}
                    onClick={() => setActiveTab('add')}
                >
                    Add Resolution
                </button>
            </div>

            {activeTab === 'add' && (
                <AddResolutionForm
                    communityId={communityId}
                    onSuccess={() => setActiveTab('list')}
                />
            )}

            {activeTab === 'list' && <ResolutionList communityId={communityId} />}
        </div>
    );
};

export default AdminDashboard;
