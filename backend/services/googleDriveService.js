import { google } from 'googleapis';
import { Readable } from 'stream';

const drive = google.drive('v3');

const getAuthClient = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: './services/diklatstp-service-account-file.json', // Pastikan file ini ada dan benar
        scopes: ['https://www.googleapis.com/auth/drive.file']
    });

    return await auth.getClient();
};

export const uploadToGoogleDrive = async (pdfBytes, fileName) => {
    try {
        const authClient = await getAuthClient();
        google.options({ auth: authClient });

        const fileMetadata = {
            name: fileName,
            parents: ['1ajm9GVBbEjoG4A5eLR-K_67aoG4KHi4y'] // ID folder Google Drive
        };

        if (!Buffer.isBuffer(pdfBytes)) {
            throw new Error('pdfBytes harus berupa buffer.');
        }

        const bufferStream = new Readable();
        bufferStream._read = () => {};
        bufferStream.push(pdfBytes);
        bufferStream.push(null);

        const media = {
            mimeType: 'application/pdf',
            body: bufferStream
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        });

        console.log('Upload successful, file ID:', response.data.id);
        return response.data.id;

    } catch (error) {
        console.error('Error uploading to Google Drive:', error);

        if (error.response && error.response.data) {
            console.error('Error details:', error.response.data);
        }
        
        throw error;
    }
};

export const deleteFileFromGoogleDrive = async (fileId) => {
    try {
        const authClient = await getAuthClient();
        google.options({ auth: authClient });

        await drive.files.delete({
            fileId: fileId
        });
    } catch (error) {
        console.error(`Error deleting file from Google Drive: ${error.message}`);
        throw error;
    }
};
