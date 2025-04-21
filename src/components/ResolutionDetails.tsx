import React from 'react';
import { Pie } from 'react-chartjs-2';
import MDEditor from '@uiw/react-md-editor';

type VotingStats = {
    inFavor: number;
    against: number;
    withheld: number;
    inFavorInPercent: number;
    againstInPercent: number;
    withheldInPercent: number;
};

interface Props {
    content: string;
    quorum: number;
    voting: VotingStats;
}

const ResolutionDetails: React.FC<Props> = ({ content, quorum, voting }) => {
    const data = {
        labels: ['In Favor', 'Against', 'Withheld'],
        datasets: [
            {
                data: [voting.inFavor, voting.against, voting.withheld],
                backgroundColor: ['#4ade80', '#f87171', '#facc15'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="mt-4 space-y-4">
            <div>
                <strong>Content:</strong>
                <div data-color-mode="dark" className="mt-1">
                    <MDEditor.Markdown source={content} />
                </div>
            </div>

            <div>
                <strong>Quorum:</strong> {quorum}
            </div>

            <div>
                <strong>Voting Statistics:</strong>
                <div className="max-w-xs mx-auto mt-2">
                    <Pie data={data} />
                </div>
                <div className="text-sm text-gray-600 mt-2">
                    <ul className="space-y-1">
                        <li>In Favor: {voting.inFavor} ({voting.inFavorInPercent}%)</li>
                        <li>Against: {voting.against} ({voting.againstInPercent}%)</li>
                        <li>Withheld: {voting.withheld} ({voting.withheldInPercent}%)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ResolutionDetails;
