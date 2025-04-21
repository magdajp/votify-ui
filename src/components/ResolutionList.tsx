import React, { useEffect, useState } from 'react';
import { apiGet } from '../utils/api.ts';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import MDEditor from '@uiw/react-md-editor';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

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

const ResolutionList: React.FC<ResolutionListProps> = ({ communityId }) => {
    const [resolutions, setResolutions] = useState<Resolution[]>([]);
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    const getBadgeClass = (status: string) => {
        switch (status) {
            case 'UNDER_VOTING':
                return 'bg-yellow-100 text-yellow-800';
            case 'ACCEPTED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            case 'CANCELLED':
                return 'bg-gray-200 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatStatus = (status: string) => {
        return status.replace('_', ' ').toLowerCase().replace(/(^\w|\s\w)/g, s => s.toUpperCase());
    };

    useEffect(() => {
        const fetchResolutions = async () => {
            try {
                const data = await apiGet<Resolution[]>(`/api/housing-community/resolution/all`);
                setResolutions(data);
            } catch (err) {
                console.error('Failed to fetch resolutions');
            }
        };

        fetchResolutions();
    }, [communityId]);

    const toggleExpanded = (id: string) => {
        setExpanded(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    const groupByStatus = resolutions.reduce((acc, res) => {
        acc[res.status] = acc[res.status] || [];
        acc[res.status].push(res);
        return acc;
    }, {} as Record<string, Resolution[]>);

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold mb-4 text-left">Resolutions</h2>
            {Object.entries(groupByStatus).map(([status, group]) => (
                <div key={status} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-left">{formatStatus(status)}</h3>
                    <div className="space-y-3">
                        {group.map(resolution => (
                            <div key={resolution.id} className="border rounded-lg shadow-md bg-blue text-left">
                                <div
                                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-600"
                                    onClick={() => toggleExpanded(resolution.id)}
                                >
                                    <div>
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
                                    {expanded.has(resolution.id) ? (
                                        <ChevronUpIcon className="h-5 w-5 text-gray-600" />
                                    ) : (
                                        <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                                    )}
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
                                                        backgroundColor: [
                                                            '#4ade80',
                                                            '#f87171',
                                                            '#8e8888'
                                                        ],
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
            ))}
        </div>
    );
};

export default ResolutionList;
