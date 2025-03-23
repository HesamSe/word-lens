import {useState} from 'react';
import '../app/globals.css'
import Loading from "@/components/loading";

type WordCount = {
    word: string;
    count: number;
};

export default function Home() {
    const [words, setWords] = useState<WordCount[]>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
            setLoading(true)
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
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="flex flex-col gap-2 items-center h-screen w-screen bg-white dark:bg-gray-900 p-4">
            <div className="flex-none flex flex-col items-center justify-center max-w-md min-h-36 min-w-96 text-center block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white">
                <h1 className="text-xl font-semibold mb-4">
                    Upload a PDF File
                </h1>
                <div>
                    {loading ? <Loading/> :
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleUpload}
                            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                    }
                </div>
            </div>
            {!!words && (
                <div className='flex-1 overflow-auto w-full'>
                    <table className=' w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                        <thead
                            className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
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
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 max-w-full overflow-hidden"
                                key={wc.word}
                            >
                                <th scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className='max-w-72 truncate'>
                                        {wc.word}
                                    </div>
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
    );
}
