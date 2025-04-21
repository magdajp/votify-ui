import React, { useState } from 'react';
import { apiPost } from '../utils/api.ts';
import MDEditor from '@uiw/react-md-editor';

interface AddResolutionFormProps {
    communityId: string;
    onSuccess: () => void;
}

const AddResolutionForm: React.FC<AddResolutionFormProps> = ({ communityId, onSuccess }) => {
    const [title, setTitle] = useState('');
    const loremIpsumContent: string = '## Lorem ipsum dolor sit amet\n' +
        '\n' +
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dapibus luctus est sed placerat. Phasellus vitae\n' +
        'feugiat nulla. Aenean nisl quam, hendrerit pulvinar enim in, sagittis eleifend magna. Curabitur in dolor eros. Duis ac\n' +
        'mauris sed massa pellentesque fermentum id ac quam:\n' +
        '- Pellentesque accumsan purus sed sollicitudin posuere. \n' +
        '- Suspendisse ac nibh ac metus bibendum consectetur et commodo ante. \n' +
        '- Etiam ac enim eget enim gravida efficitur non quis turpis. \n' +
        '- Sed eleifend mi eget velit bibendum, a bibendum augue auctor. \n' +
        '- Proin sed tempor tellus.\n' +
        '\n' +
        '### Ut nisi sem, pharetra ullamcorper commodo eget\n' +
        'Ut nisi sem, pharetra ullamcorper commodo eget, pulvinar egestas risus. Nullam eleifend, ipsum et pellentesque ornare,\n' +
        'velit purus volutpat nisi, non cursus orci nunc non sem. Vestibulum ante ipsum primis in faucibus orci luctus et\n' +
        'ultrices posuere cubilia curae; Curabitur venenatis auctor dignissim. Aliquam ut lacus erat. Sed eget metus quis lectus\n' +
        'congue scelerisque in vitae neque. Phasellus nec orci nec nisl facilisis semper quis consectetur diam. Vivamus imperdiet\n' +
        'dui sed justo condimentum, id sagittis leo tincidunt. Proin venenatis nibh et nulla vehicula ultricies. Nam blandit\n' +
        'libero id sem tempor ornare. Quisque ipsum ex, congue at tempus ac, convallis vel risus. Nulla facilisi.\n' +
        '\n' +
        '### Ut euismod blandit massa quis malesuada\n' +
        'Ut euismod blandit massa quis malesuada. Pellentesque condimentum at ex eu venenatis. Quisque maximus nibh quis tellus\n' +
        'sodales dictum. Vestibulum feugiat lacinia purus, at suscipit elit sollicitudin a. In arcu lacus, ultricies et\n' +
        'scelerisque et, fermentum non dolor. Pellentesque vel nunc nisi. Fusce porttitor nunc lectus, a molestie ante placerat\n' +
        'quis. Fusce pulvinar tincidunt metus et aliquam. Etiam a orci non urna molestie mattis. Donec sed posuere risus. Nullam\n' +
        'ac bibendum ipsum. Ut a volutpat velit.\n' +
        '\n' +
        '### Nullam rutrum mauris quis mattis placerat\n' +
        'Nullam rutrum mauris quis mattis placerat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere\n' +
        'cubilia curae; Fusce vestibulum luctus urna eu blandit. Quisque ornare iaculis lacus, id sodales orci volutpat vitae.\n' +
        'Vestibulum nunc sapien, eleifend id vulputate dapibus, rutrum at odio. Cras vulputate lacus eu ornare ultrices. Quisque\n' +
        'finibus non neque sit amet aliquet. Nam eu mi laoreet, finibus lectus vitae, aliquam dui. Morbi interdum risus sit amet\n' +
        'neque sollicitudin, at tincidunt ligula cursus. Mauris eu sem ac ex accumsan volutpat sed ac metus. Praesent finibus dui\n' +
        'lectus, ac pellentesque felis placerat ac. Aenean dignissim nunc ac risus lacinia, sed viverra ipsum varius. Proin enim\n' +
        'leo, luctus nec volutpat vel, varius vel nulla. Praesent nec justo ligula. Praesent tincidunt fermentum dolor, nec\n' +
        'accumsan tellus luctus non.\n' +
        '\n' +
        '### Aliquam erat volutpat\n' +
        'Aliquam erat volutpat. Morbi dapibus mi id justo commodo gravida. Quisque quam sapien, porttitor nec tempus sed,\n' +
        'consequat vitae enim. Proin volutpat pulvinar libero, eu faucibus ligula eleifend at. Praesent aliquet luctus libero, in\n' +
        'semper augue blandit eu. Sed pharetra molestie arcu, in accumsan justo malesuada a. In hac habitasse platea dictumst.\n' +
        'Suspendisse quis mi lacus. Pellentesque eget risus dapibus libero dictum molestie. Donec a tempor tellus. Curabitur\n' +
        'imperdiet, erat ornare faucibus varius, libero turpis vulputate justo, in luctus orci augue eu orci. Nulla vitae sapien\n' +
        'sed eros facilisis fringilla. Nullam eu ligula convallis, pharetra felis eu, ultricies urna. Etiam orci orci, laoreet\n' +
        'vitae quam ac, elementum dapibus enim. Suspendisse potenti. Ut pharetra neque dui, id feugiat tortor congue in.';
    const [content, setContent] = useState<string | undefined>(loremIpsumContent);
    const [deadline, setDeadline] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await apiPost(`/api/housing-community/${communityId}/resolution`, {
                title,
                content,
                deadline
            });

            setTitle('');
            setContent('');
            setDeadline('');
            onSuccess();
        } catch (err) {
            setError('Failed to add resolution. Please check your input.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold">Add New Resolution</h2>

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 h-12 border rounded-lg"
                required
            />

            <div className="w-full">
                <label className="block mb-1 font-medium">Content</label>
                <div data-color-mode="dark" className="min-h-[300px]">
                    <MDEditor
                        value={content}
                        onChange={setContent}
                        preview="live"
                        height={400}
                        textareaProps={{
                            placeholder: loremIpsumContent,
                        }}
                    />
                </div>
            </div>

            <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2 h-12 border rounded-lg"
                required
            />

            <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-600 transition"
            >
                Submit
            </button>

            {error && <div className="text-red-500 text-sm">{error}</div>}
        </form>
    );
};

export default AddResolutionForm;
