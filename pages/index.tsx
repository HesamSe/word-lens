import { useState } from 'react';

export default function Home() {
    const [charCount, setCharCount] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'text/plain') {
            setError('Only .txt files are allowed');
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
                setCharCount(data.charCount);
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
                    accept=".txt"
                    onChange={handleUpload}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />

                {charCount !== null && (
                    <p className="mt-4 text-lg font-medium text-green-600">Character Count: {charCount}</p>
                )}

                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        </div>
    );
}
