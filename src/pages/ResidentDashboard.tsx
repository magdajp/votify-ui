import React, { useEffect, useState } from 'react';
import { apiGet } from '../utils/api.ts';
import MDEditor from '@uiw/react-md-editor';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

type VoteType = 'IN_FAVOR' | 'AGAINST' | 'WITHHELD' | null;
type StatusType = 'UNDER_VOTING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

interface Resolution {
    id: string;
    title: string;
    content: string;
    deadline: string;
    status: StatusType;
    vote: VoteType;
}

const formatStatus = (status: string) => {
    return status.replace('_', ' ').toLowerCase().replace(/(^\w|\s\w)/g, s => s.toUpperCase());
};

const getBadgeClass = (status: string) => {
    switch (status) {
        case 'UNDER_VOTING':
            return 'bg-yellow-100 text-yellow-800';
        case 'ACCEPTED':
            return 'bg-green-100 text-green-800';
        case 'REJECTED':
            return 'bg-red-100 text-red-800';
        case 'CANCELLED':
            return 'bg-gray-300 text-gray-700';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getVoteLabel = (vote: VoteType) => {
    if (!vote) return 'Not voted';
    return vote.replace('_', ' ').toLowerCase().replace(/(^\w|\s\w)/g, s => s.toUpperCase());
};

const getVoteClass = (vote: VoteType) => {
    switch (vote) {
        case 'IN_FAVOR':
            return 'text-green-400';
        case 'AGAINST':
            return 'text-red-400';
        case 'WITHHELD':
            return 'text-yellow-400';
        default:
            return 'text-gray-400';
    }
};

const ResidentDashboard: React.FC = () => {
    const [resolutions, setResolutions] = useState<Resolution[]>([]);
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchResolutions = async () => {
            try {
                const data = await apiGet<Resolution[]>('/api/resident/resolution/all');

                const statusOrder: Record<StatusType, number> = {
                    UNDER_VOTING: 0,
                    ACCEPTED: 1,
                    REJECTED: 1,
                    CANCELLED: 2,
                };

                const sorted = [...data].sort((a, b) =>
                    statusOrder[a.status] - statusOrder[b.status]
                );

                setResolutions(sorted);
            } catch (err) {
                console.error('Failed to fetch resident resolutions');
            }
        };

        fetchResolutions();
    }, []);

    const toggleExpanded = (id: string) => {
        setExpanded(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Your Resolutions</h1>
            <div className="space-y-4">
                {resolutions.map(res => (
                    <div key={res.id} className="border rounded-lg bg-neutral-800 shadow-md text-left">
                        <div
                            className="flex justify-between items-center p-4 cursor-pointer hover:bg-neutral-700"
                            onClick={() => toggleExpanded(res.id)}
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span
                                        className={`text-xs font-semibold px-2 py-1 rounded-full ${getBadgeClass(res.status)}`}
                                    >
                                        {formatStatus(res.status)}
                                    </span>
                                    <h4 className="text-lg font-semibold">{res.title}</h4>
                                </div>
                                <p className="text-sm text-gray-400">
                                    Deadline: {new Date(res.deadline).toLocaleString()}
                                </p>
                            </div>
                            {expanded.has(res.id) ? (
                                <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                            )}
                        </div>

                        {expanded.has(res.id) && (
                            <div className="border-t px-4 pb-4 pt-2 space-y-4">
                                <div data-color-mode="dark">
                                    <MDEditor.Markdown source={res.content} />
                                </div>
                                <div>
                                    <span className="text-sm text-gray-300">
                                        Your Vote:{' '}
                                        <span className={`font-semibold ${getVoteClass(res.vote)}`}>
                                            {getVoteLabel(res.vote)}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResidentDashboard;
