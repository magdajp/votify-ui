import React, { useEffect, useState } from 'react';
import { apiGet, apiPut } from '../utils/api.ts';
import MDEditor from '@uiw/react-md-editor';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

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

const formatStatus = (status: string) => status.replace('_', ' ').toLowerCase().replace(/(^\w|\s\w)/g, s => s.toUpperCase());
const getBadgeClass = (status: string) => ({
    UNDER_VOTING: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-300 text-gray-700',
}[status] ?? 'bg-gray-100 text-gray-800');
const getVoteLabel = (vote: VoteType) => vote ? vote.replace('_', ' ').toLowerCase().replace(/(^\w|\s\w)/g, s => s.toUpperCase()) : 'Not voted';
const getVoteClass = (vote: VoteType) => ({
    IN_FAVOR: 'text-green-400',
    AGAINST: 'text-red-400',
    WITHHELD: 'text-yellow-400',
}[vote!] ?? 'text-gray-400');

const ResidentResolutionList: React.FC = () => {
    const [resolutions, setResolutions] = useState<Resolution[]>([]);
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    const fetchResolutions = async () => {
        try {
            const data = await apiGet<Resolution[]>('/api/resident/resolution/all');
            const statusOrder: Record<StatusType, number> = {
                UNDER_VOTING: 0,
                ACCEPTED: 1,
                REJECTED: 1,
                CANCELLED: 2,
            };
            const sorted = [...data].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
            setResolutions(sorted);
        } catch (err) {
            // @ts-ignore
            toast.error(`Failed to fetch resident resolutions: ${err.response.data.message}`);
        }
    };

    useEffect(() => {
        fetchResolutions();
    }, []);

    const toggleExpanded = (id: string) => {
        setExpanded(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleVote = async (resolutionId: string, resolutionTitle: string, vote: 'IN_FAVOR' | 'AGAINST') => {
        try {
            await apiPut(`/api/housing-community/resolution/${resolutionId}/vote`, { vote: vote });
            toast.success(`Successfully voted for [${resolutionTitle}]`)
            await fetchResolutions();
        } catch (err) {
            // @ts-ignore
            toast.error(`Failed to vote: ${err.response.data.message}`);
        }
    };

    return (
        <div className="space-y-4">
            {resolutions.map(res => (
                <div key={res.id} className="border rounded-lg bg-neutral-800 shadow-md text-left">
                    <div
                        className="flex justify-between items-center p-4 cursor-pointer hover:bg-neutral-700"
                        onClick={() => toggleExpanded(res.id)}
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getBadgeClass(res.status)}`}>
                                    {formatStatus(res.status)}
                                </span>
                                <h4 className="text-lg font-semibold">{res.title}</h4>
                            </div>
                            <p className="text-sm text-gray-400">
                                Deadline: {new Date(res.deadline).toLocaleString()}
                            </p>
                        </div>
                        {expanded.has(res.id) ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-400"/>
                        ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-400"/>
                        )}
                    </div>

                    {expanded.has(res.id) && (
                        <div className="border-t px-4 pb-4 pt-2 space-y-4">
                            <div data-color-mode="dark">
                                <MDEditor.Markdown source={res.content}/>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-300">
                                    Your Vote:{' '}
                                    <span className={`font-semibold ${getVoteClass(res.vote)}`}>
                                        {getVoteLabel(res.vote)}
                                    </span>
                                </span>

                                {res.status === 'UNDER_VOTING' && res.vote === null && (
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => handleVote(res.id, res.title, 'IN_FAVOR')}
                                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm"
                                        >
                                            Vote In Favor
                                        </button>
                                        <button
                                            onClick={() => handleVote(res.id, res.title, 'AGAINST')}
                                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm"
                                        >
                                            Vote Against
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ResidentResolutionList;
