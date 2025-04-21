import React from 'react';
import ResidentResolutionList from '../components/ResidentResolutionList';

const ResidentDashboard: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Resident Dashboard</h1>
            <ResidentResolutionList />
        </div>
    );
};

export default ResidentDashboard;
