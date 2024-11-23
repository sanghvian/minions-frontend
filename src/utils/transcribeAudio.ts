import axios from 'axios';
import toast from 'react-hot-toast';
import { uploadFile } from 'react-s3';

const config = {
    bucketName: process.env.REACT_APP_AWS_BUCKET_NAME,
    region: process.env.REACT_APP_AWS_REGION_NAME,
    accessKeyId: process.env.REACT_APP_AWS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET,
}

export const uploadFileToS3 = async (file: File) => {
    try {
        const res = await uploadFile(file, config)
        return res.location;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const addAudioElement = async (blob: any) => {
    //? Code to actually save and display the audio player for the recording
    // const url = URL.createObjectURL(blob);
    // const audio = document.createElement("audio");
    // audio.src = url;
    // audio.controls = true;
    // document.body.appendChild(audio);

    // Convert blob to file
    const file = new File([blob], "audio_record.mp3", { type: blob.type });
    // Upload the file for transcription
    return file
};

export const uploadAudioForTranscription = async (file: File) => {
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
    const url = 'https://api.openai.com/v1/audio/transcriptions';

    // Set request headers
    const headers = {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'multipart/form-data'
    };
    // const fileURL = await uploadFileToS3(file);
    // if (!fileURL) {
    //     toast.error("Error uploading file to S3");
    //     return;
    // }
    // Create FormData instance and append necessary fields
    const formData = new FormData();
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');
    formData.append('file', file); // Make sure filePath is pointing to the actual file object
    // const reqBody = {
    //     model: 'whisper-1',
    //     language: 'en',
    //     file: fileURL
    // }

    try {
        // Make the API call
        const response = await axios.post(url, formData, { headers });
        return response.data;
    } catch (error: any) {
        toast.error(error.message);
    }
};
