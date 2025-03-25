import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import pdfParse from "pdf-parse";

// Configure multer for file handling
const upload = multer({ storage: multer.memoryStorage() });

// Custom middleware to handle file upload
export const config = {
    api: {
        bodyParser: false, // Disable Next.js default bodyParser
    },
};

interface NextApiRequestWithFile extends NextApiRequest {
    file?: Express.Multer.File;
}

// Middleware handler to process the file
export default async function handler(req: NextApiRequestWithFile, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const fileBuffer: Buffer = await new Promise((resolve, reject) => {
            // @ts-expect-error todo
            upload.single('file')(req as Record<string, unknown>, {}, (err: Error) => {
                if (err) reject(err);
                else if(req.file) resolve(req.file.buffer);
                else reject();
            });
        });
        const data = await pdfParse(fileBuffer);
        const words = data.text.split(/\s+/);
        const wordCount = new Map<string, number>();

        // Count occurrences
        for (const word of words) {
            const w = word.replace(/[^a-zA-Z]/g, "");
            if(w.charAt(0) && w.charAt(0) === w.charAt(0).toLowerCase())
                wordCount.set(w, (wordCount.get(w) || 0) + 1);
        }

        res.status(200).json({ words: Array.from(wordCount.entries()).map(wc => ({
                word: wc[0],
                count: wc[1]
            })).sort((a, b) => b.count - a.count) });
    } catch (error) {
        console.error('File processing error:', error);
        res.status(500).json({ error: 'Failed to process file' });
    }
}
