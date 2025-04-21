import React, { useEffect, useState } from 'react';
import { apiGet, apiPut } from '../utils/api.ts';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import MDEditor from '@uiw/react-md-editor';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend);

type Resolution = {
    id: string;
    title: string;
    content: string;
    deadline: string;
    quorum: number;
    status: 'UNDER_VOTING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
    voting: {
        inFavor: number;
        against: number;
        numberOfResidents: number;
        withheldInPercent: number;
        inFavorInPercent: number;
        againstInPercent: number;
        withheld: number;
    };
};

interface ResolutionListProps {
    communityId: string;
}

const AdminResolutionList: React.FC<ResolutionListProps> = ({ communityId }) => {
    const [resolutions, setResolutions] = useState<Resolution[]>([]);
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [confirmingResolutionId, setConfirmingResolutionId] = useState<string | null>(null);

    const getBadgeClass = (status: string) => {
        switch (status) {
            case 'UNDER_VOTING':
                return 'bg-blue-300 text-blue-800';
            case 'ACCEPTED':
                return 'bg-green-300 text-green-800';
            case 'REJECTED':
                return 'bg-red-300 text-red-800';
            case 'CANCELLED':
                return 'bg-gray-300 text-gray-800';
            default:
                return 'bg-gray-300 text-gray-800';
        }
    };

    const formatStatus = (status: string) =>
        status.replace('_', ' ').toLowerCase().replace(/(^\w|\s\w)/g, s => s.toUpperCase());

    const fetchResolutions = async () => {
        try {
            const data = await apiGet<Resolution[]>(`/api/housing-community/resolution/all`);
            setResolutions(data);
        } catch (err) {
            console.error('Failed to fetch resolutions');
        }
    };

    useEffect(() => {
        fetchResolutions();
    }, [communityId]);

    const onConfirmCancel = async () => {
        if (!confirmingResolutionId) return;
        try {
            await apiPut(`/api/housing-community/resolution/${confirmingResolutionId}`);
            await fetchResolutions();
            toast.success('Resolution has been cancelled');
        } catch (err) {
            toast.error('Cancelling resolution has failed');
        } finally {
            setConfirmingResolutionId(null);
        }
    };

    const toggleExpanded = (id: string) => {
        setExpanded(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    const sortByDeadlineDesc = (items: Resolution[]) =>
        [...items].sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());

    const underVoting = sortByDeadlineDesc(resolutions.filter(r => r.status === 'UNDER_VOTING'));
    const ended = sortByDeadlineDesc(resolutions.filter(r => r.status === 'ACCEPTED' || r.status === 'REJECTED'));
    const cancelled = sortByDeadlineDesc(resolutions.filter(r => r.status === 'CANCELLED'));

    const renderResolutionGroup = (title: string, group: Resolution[]) => (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-left">{title}</h3>
            <div className="space-y-3">
                {group.map(resolution => (
                    <div key={resolution.id} className="border rounded-lg shadow-md bg-blue text-left">
                        <div className="flex justify-between items-center p-4 hover:bg-gray-600">
                            <div className="flex justify-between w-full items-center">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getBadgeClass(resolution.status)}`}>
                                            {formatStatus(resolution.status)}
                                        </span>
                                        <h4 className="text-lg font-semibold">{resolution.title}</h4>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Deadline: {new Date(resolution.deadline).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    {resolution.status === 'UNDER_VOTING' && (
                                        <XMarkIcon
                                            className="h-5 w-5 text-red-400 hover:text-red-500 cursor-pointer"
                                            onClick={() => setConfirmingResolutionId(resolution.id)}
                                            title="Cancel Resolution"
                                        />
                                    )}
                                    <div onClick={() => toggleExpanded(resolution.id)} className="cursor-pointer">
                                        {expanded.has(resolution.id) ? (
                                            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {expanded.has(resolution.id) && (
                            <div className="border-t p-4 space-y-4">
                                <div data-color-mode="dark">
                                    <MDEditor.Markdown source={resolution.content} />
                                </div>

                                <div className="text-sm text-gray-400">
                                    <p><strong>Quorum:</strong> {resolution.quorum}</p>
                                    <p><strong>Voting Stats:</strong></p>
                                    <ul className="ml-4 list-disc">
                                        <li>In favor: {resolution.voting.inFavor} ({resolution.voting.inFavorInPercent}%)</li>
                                        <li>Against: {resolution.voting.against} ({resolution.voting.againstInPercent}%)</li>
                                        <li>Withheld: {resolution.voting.withheld} ({resolution.voting.withheldInPercent}%)</li>
                                    </ul>
                                </div>

                                <div className="max-w-xs mx-auto">
                                    <Pie
                                        data={{
                                            labels: ['In Favor', 'Against', 'Withheld'],
                                            datasets: [{
                                                label: 'Votes',
                                                data: [
                                                    resolution.voting.inFavor,
                                                    resolution.voting.against,
                                                    resolution.voting.withheld
                                                ],
                                                backgroundColor: ['#4ade80', '#f87171', '#8e8888'],
                                                borderWidth: 1
                                            }]
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold mb-4 text-left">Resolutions</h2>
            {renderResolutionGroup('Under Voting', underVoting)}
            {renderResolutionGroup('Ended', ended)}
            {renderResolutionGroup('Cancelled', cancelled)}

            {confirmingResolutionId && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-neutral-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4 text-white">Cancel this resolution?</h3>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setConfirmingResolutionId(null)}
                                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
                            >
                                No
                            </button>
                            <button
                                onClick={onConfirmCancel}
                                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminResolutionList;
