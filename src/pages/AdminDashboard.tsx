import React, { useEffect, useState } from 'react';
import { apiGet } from '../utils/api';
import ResolutionList from '../components/ResolutionList';
import AddResolutionForm from '../components/AddResolutionForm';

type DetailsResponse = {
    email: string;
    role: string;
    communityId: string;
    communityName: string;
};

const AdminDashboard: React.FC = () => {
    const [communityId, setCommunityId] = useState('');
    const [communityName, setCommunityName] = useState('');
    const [reloadTrigger, setReloadTrigger] = useState(false);

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

    const handleRefreshResolutions = () => {
        setReloadTrigger(prev => !prev);
    };

    if (!communityId) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <h2 className="text-lg">Community: {communityName}</h2>

            <AddResolutionForm communityId={communityId} onSuccess={handleRefreshResolutions} />

            {/*<ResolutionList communityId={communityId} reloadTrigger={reloadTrigger} />*/}
        </div>
    );
};

export default AdminDashboard;
