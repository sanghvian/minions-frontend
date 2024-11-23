import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '@redux/store';
import { Input, Button, Typography, Space, Spin, message } from 'antd';
import {
    updateVoiceAgentName,
    updateVoiceAgentDescription,
    updateVoiceAgentPrompt,
    addVoiceAgentAudioUrl,
    removeVoiceAgentAudioUrl,
} from '@redux/features/voiceAgentsSlice';
import { SyncOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { TextArea } = Input;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const IndividualAgentPageDashboard: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch: AppDispatch = useDispatch();
    const agentIndex = useSelector((state: RootState) =>
        state.persisted.voiceAgents.voiceAgents.findIndex((agent) => agent.id === id)
    );
    const agent = useSelector((state: RootState) =>
        state.persisted.voiceAgents.voiceAgents[agentIndex]
    );

    const [loading, setLoading] = useState(false);

    const handleRetrain = async () => {
        setLoading(true);
        await sleep(15000);
        setLoading(false);
        message.success('Agent retrained successfully!');
    };

    if (!agent) {
        return <Spin />;
    }

    const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
        console.error('Error loading audio:', e);
        message.error('Error loading audio file');
    };

    return (
        <div style={{ padding: '1.2rem 2rem' }}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Input
                    value={agent.name}
                    onChange={(e) => dispatch(updateVoiceAgentName({ index: agentIndex, name: e.target.value }))}
                    style={{ fontSize: '24px', fontWeight: 'bold', border: 'none', padding: 0 }}
                />
                <Input
                    value={agent.description}
                    onChange={(e) =>
                        dispatch(updateVoiceAgentDescription({ index: agentIndex, description: e.target.value }))
                    }
                    style={{ fontSize: '18px', border: 'none', padding: 0 }}
                />
                <Text>Prompt:</Text>
                <TextArea
                    rows={4}
                    value={agent.prompt}
                    onChange={(e) =>
                        dispatch(updateVoiceAgentPrompt({ index: agentIndex, prompt: e.target.value }))
                    }
                />
                <Text>Trained on following voice recordings:</Text>
                {agent.audioUrls.map((url, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '4rem'
                    }}>
                        <video
                            style={{
                                height: '4rem',
                                width: '400px'
                            }}
                            controls>
                            {url && <source src={url} />}
                            Your browser does not support the video tag.
                        </video>
                        <Button
                            danger
                            onClick={() => dispatch(removeVoiceAgentAudioUrl({ index: agentIndex, url }))}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
                <Button
                    type="dashed"
                    onClick={() => {
                        const newUrl = prompt('Enter new audio URL');
                        if (newUrl) {
                            dispatch(addVoiceAgentAudioUrl({ index: agentIndex, url: newUrl }));
                        }
                    }}
                >
                    Add more recording
                </Button>
                <Button
                    icon={<SyncOutlined />}
                    type="primary" onClick={handleRetrain} loading={loading}>
                    Retrain
                </Button>
            </Space>
        </div>
    );
};

export default IndividualAgentPageDashboard;
