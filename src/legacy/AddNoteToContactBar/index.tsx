import { SendOutlined } from '@ant-design/icons';
import AudioRecorder from '@components/molecules/AudioRecorder';
import { CompleteContact } from '@models/contact.model'
import { RecordType } from '@models/index';
import { Note } from '@models/note.model';
import { RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import { uploadAudioForTranscription } from '@utils/transcribeAudio';
import { Button, Input, Space } from 'antd';
import React, { useState } from 'react'
// import { useAudioRecorder } from 'react-audio-voice-recorder';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';

const AddNoteToContactBar: React.FC<{ contact: CompleteContact }> = ({ contact }) => {
    // const recorderControls = useAudioRecorder()
    const [loading, setLoading] = useState<boolean>(false);
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value)
    const [noteMessage, setNoteMessage] = useState<string>("");
    const { mutate: mutateCreateNote } = useMutation(
        async (
            variables: { note: Note, email: string, token: string },
        ) =>
            await apiService.createNote(variables.note, true, variables.email, variables.token), {}
    )

    const handleAudioUpload = async (file: any) => {
        const startTime = new Date().getTime();
        setLoading(true);
        const data: { text: string } = await uploadAudioForTranscription(file)
        const query: string = data.text;
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000; // duration in seconds
        pushEvent('EditContactByVoice', {
            // recordingDuration: recorderControls.recordingTime,
            responseTime: duration
        })
        setLoading(false);
        await addNoteToContact(query);
    }

    const addNoteToContact = async (message: string) => {
        const note: Note = {
            content: message,
            contactId: contact?.id!,
            location: contact?.location || "",
            timestamp: new Date().toISOString(),
            recordType: RecordType.NOTE
        }
        mutateCreateNote({ note, email, token });
        pushEvent('AddNoteToContact', {
            noteMessage: message
        })
        setNoteMessage("");
    }
    return (
        <div>
            <Space.Compact style={{ width: '100%' }}>
                <Input
                    placeholder="Add Note"
                    value={noteMessage}
                    onChange={(e) => {
                        setNoteMessage(e.target.value);
                    }}
                />
                <Button
                    icon={<SendOutlined />}
                    type="primary"
                    loading={loading}
                    onClick={async () => {
                        await addNoteToContact(noteMessage);
                        setNoteMessage("");
                    }
                    }
                />
            </Space.Compact>
            {/* <AudioRecorder
                onRecordingComplete={async (blob: any) => {
                    const file = await addAudioElement(blob)
                    toast.promise(
                        handleAudioUpload(file),
                        {
                            loading: 'Searching...',
                            success: <b>Here's your contact</b>,
                            error: <b>Could not save.</b>,
                        }
                    );

                }
                }
                audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true,
                }}
                showVisualizer={true}
                downloadOnSavePress={false}
                downloadFileExtension="webm"
            /> */}
            <AudioRecorder handleAudioFile={handleAudioUpload} />

        </div>
    )
}

export default AddNoteToContactBar
