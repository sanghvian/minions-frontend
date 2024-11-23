import { SendOutlined } from '@ant-design/icons';
import { pushEvent } from '@utils/analytics';
import { uploadAudioForTranscription } from '@utils/transcribeAudio';
import { Button, Form, Input } from 'antd';
import React, { useState } from 'react'
import './ChatBar.css'
import { RecordType } from '@models/index';
import AudioRecorder from '../AudioRecorder';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { setUsageCount } from '@redux/features/userSlice';

interface IChatBar {
    // actionEntityType: RecordType;
    action: string;
    handleUpload: (message: string) => void
}

const ChatBar: React.FC<IChatBar> = ({ handleUpload, action,
    // actionEntityType
}) => {
    // const recorderControls = useAudioRecorder()
    const [loading, setLoading] = useState<boolean>(false);
    const [noteMessage, setNoteMessage] = useState<string>("");
    const chatCycles = useSelector((state: RootState) => state.chat.value.chatCycles);
    const { usageCount } = useSelector((state: RootState) => state.persisted.user.value);
    const dispatch: AppDispatch = useDispatch();

    const handleAudioUpload = async (file: any) => {
        setLoading(true);
        const startTime = new Date().getTime();
        const data: { text: string } = await uploadAudioForTranscription(file)
        const query: string = data.text;
        await handleUpload(query);
        setLoading(false);
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000; // duration in seconds
        pushEvent(action + "ByVoice", {
            // recordingDuration: recorderControls.recordingTime,
            responseTime: duration
        })
        setNoteMessage("");
        // dispatch(setActiveQueryString(""));
    }

    // const returnPlaceholderBasedOnActionType = () => {
    //     switch (actionEntityType) {
    //         case RecordType.NOTE:
    //             return "Add Note";
    //         case RecordType.ACTION:
    //             return "Add Action";
    //         case RecordType.RELATIONSHIP:
    //             return "Add Relationship Context";
    //         case RecordType.CONTACT:
    //             return "Search";
    //         default:
    //             return "Add Note";
    //     }
    // }
    const [form] = Form.useForm();

    const handleFinish = async () => {
        pushEvent(action, { message: noteMessage })
        await handleUpload(noteMessage);
        setNoteMessage("");
    }

    return (
        <div className={`chatContainerWrapper`}>
            <div className={`chatContainer`}>
                <Form form={form} style={{ width: '100%' }} onFinish={handleFinish}>
                    <Form.Item >
                        <Input
                            style={
                                {
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    width: '100%',
                                    height: '100%',
                                    color: '#000',
                                }
                            }
                            // placeholder={returnPlaceholderBasedOnActionType()}
                            placeholder={"Search for any kind of startup advice"}
                            value={noteMessage}
                            onChange={(e) => {
                                setNoteMessage(e.target.value);
                            }}
                        />
                    </Form.Item>
                </Form>
                <Button
                    icon={<SendOutlined />}
                    type="primary"
                    style={{
                        backgroundColor: 'transparent',
                        height: '100%',
                        color: '#000',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    loading={loading}
                    onClick={async () => {
                        if (noteMessage.length === 0) {
                            return toast('Kindly enter something before submitting!')
                        }
                        dispatch(setUsageCount(usageCount! + 1))
                        pushEvent(action, { message: noteMessage })
                        await handleUpload(noteMessage);
                        setNoteMessage("");
                    }
                    }
                />
                {/* <AudioRecorder handleAudioFile={handleAudioUpload} /> */}
                {/* <AudioRecorder
                    onRecordingComplete={async (blob: any) => {
                        const file = await addAudioElement(blob)
                        const toastId = toast.loading('Searching...');
                        try {
                            await handleAudioUpload(file);
                            toast.success('Here is your contact', { id: toastId });
                        } catch (error: any) {
                            toast.error(`Could not search - ${error.message}`, { id: toastId });
                        }

                    }
                    }
                    audioTrackConstraints={{
                        noiseSuppression: true,
                        echoCancellation: true,
                    }}
                    onNotAllowedOrFound={async (blob: any) => {
                        toast('Recording not allowed or found on this device, please email founders@recontact.world for more details');
                    }}
                    showVisualizer={true}
                    downloadOnSavePress={false}
                    downloadFileExtension="webm"
                /> */}
            </div>
            {/* {chatCycles.length === 0 &&
                <div className='sampleSearches'>
                    <Button type="link" onClick={async () => {
                        dispatch(setUsageCount(usageCount! + 1))
                        await handleUpload("How to find my 1st customers?");

                    }}>How find my 1st customers? 📈</Button>
                    <Button type="link" onClick={async () => {
                        dispatch(setUsageCount(usageCount! + 1))
                        await handleUpload("How to pitch my startup");

                    }}>How to pitch my startup 💰</Button>
                    <Button type="link" onClick={async () => {
                        dispatch(setUsageCount(usageCount! + 1))
                        await handleUpload("How to get startup ideas?");

                    }}>How to get startup ideas? 💡</Button>
                    <Button type="link" onClick={async () => {
                        dispatch(setUsageCount(usageCount! + 1))
                        await handleUpload("How to define goals and KPIs");

                    }}>How to define goals and KPIs ?🎯</Button>
                </div>} */}
        </div>
    )
}

export default ChatBar
