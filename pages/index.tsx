import { useState } from 'react';
type WordCount = {
    word: string;
    count: number;
};

export default function Home() {
    const [words, setWords] = useState<WordCount[]>();
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError('Only .pdf files are allowed');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setWords(data.words);
                setError(null);
            } else {
                setError(data.error || 'Upload failed');
            }
        } catch {
            setError('Error uploading file');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
                <h1 className="text-xl font-semibold text-gray-700 mb-4">Upload a TXT File</h1>

                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleUpload}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />

                {words !== null && (
                    <div className="mt-4">
                        <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Word
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Count
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            {words?.map(wc => (
                                <tr
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                                    key={wc.word}
                                >
                                    <th scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {wc.word}
                                    </th>
                                    <td className="px-6 py-4">
                                        {wc.count}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        </div>
    );
}
