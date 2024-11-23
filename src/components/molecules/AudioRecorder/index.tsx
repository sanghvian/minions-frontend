import React, { useState } from 'react';
import { Alert, Button, message } from 'antd';
import MicRecorder from 'mic-recorder-to-mp3';
import { addAudioElement } from '@utils/transcribeAudio';
import { AudioOutlined } from '@ant-design/icons';
import './AudioRecorder.css';
import { pushEvent } from '@utils/analytics';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';

// Define the recorder outside the component to maintain its state across renders
const recorder = new MicRecorder({
    bitRate: 128
});

interface AudioRecorderProps {
    // Interface for a function handleAudioFile which takes in an audio file and asynchronously does processing on it
    handleAudioFile: (file: File) => Promise<void>;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ handleAudioFile }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [recordingStartsIn, setRecordingStartsIn] = useState(1);
    const email = useSelector((state: RootState) => state.persisted.user.value.email)
    // eslint-disable-next-line
    const [_, setIsRecordingCountdown] = useState(false);

    const startRecording = () => {
        recorder.start().then(() => {
            setIsRecording(true);
            startRecordingCountdown();
            setAudioSrc(null); // Reset previous recording
        }).catch((error: any) => {
            console.error(error);
            message.error('Error starting the recorder');
        });
    };

    const stopRecording = () => {
        recorder.stop().getMp3()
            .then(async ([buffer, blob]: any) => {
                const audioUrl = URL.createObjectURL(new Blob(buffer, { type: blob.type }));
                const file = await addAudioElement(blob)
                await handleAudioFile(file);
                setAudioSrc(audioUrl);
                setIsRecording(false);
                setIsRecordingCountdown(false);
                setRecordingStartsIn(1);
                pushEvent('AudioRecorded', { email });
            }).catch((error: any) => {
                console.error(error);
                message.error('Error stopping the recorder');
            });
    };

    const startRecordingCountdown = () => {
        setIsRecordingCountdown(true);
        const interval = setInterval(() => {
            setRecordingStartsIn((prev) => prev - 1);
        }, 1000);
        setTimeout(() => {
            clearInterval(interval);
        }, 5000);
    };


    return (
        <div className='recordingAlertContainer' >
            {isRecording && <Alert message={`${recordingStartsIn > 0 ? "Wait for a sec" : "Recording..."} 🔴`} type="info" />}
            <Button
                onClick={isRecording ? stopRecording : startRecording}
                icon={<AudioOutlined />}
                style={{
                    backgroundColor: isRecording ? 'red' : '#f0f0f0',
                    color: '#000',
                    border: 'none',
                    outline: 'none',
                }}
            >
            </Button>
            {audioSrc && (
                <div>
                    <audio controls src={audioSrc}></audio>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
