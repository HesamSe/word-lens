import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';

// Configure multer for file handling
const upload = multer({ storage: multer.memoryStorage() });

// Custom middleware to handle file upload
export const config = {
    api: {
        bodyParser: false, // Disable Next.js default bodyParser
    },
};

// Middleware handler to process the file
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const fileBuffer: Buffer = await new Promise((resolve, reject) => {
            upload.single('file')(req as any, {} as any, (err: any) => {
                if (err) reject(err);
                else resolve((req as any).file.buffer);
            });
        });

        // Convert the file buffer to a string and count characters
        const fileContent = fileBuffer.toString('utf-8');
        const charCount = fileContent.length;

        res.status(200).json({ charCount });
    } catch (error) {
        console.error('File processing error:', error);
        res.status(500).json({ error: 'Failed to process file' });
    }
}
