import './AISearchDashboard.css'
import { pushEvent } from '@utils/analytics';
import ChatBar from '@components/molecules/ChatBar';
import { RecordType } from '@models/index';
import React, { useEffect, useRef, useState } from 'react'; // ensure to create this SCSS file with styles
import { AppDispatch, RootState } from '@redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { ActiveModalType, ActiveRouteKey, setActiveChatCycleId, setActiveRouteKey, setIsModalOpen, setModalType } from '@redux/features/activeEntitiesSlice';
import AIChatResponse from '@components/atoms/AIChatResponse';
import { ChatCycle, ChatRequest, startChatThreadWithRequest } from '@redux/features/chatSlice';
import { v4 } from 'uuid';
import AIChatResultsList from '@components/molecules/AIChatResultsList';
import { Avatar, Typography } from 'antd';

const { Title } = Typography;


const AISearchDashboard: React.FC = () => {
    const [requestQuery, setRequestQuery] = useState<string>("");
    const { activeUserEmail, usageCount } = useSelector((state: RootState) => state.persisted.user.value);
    const dispatch: AppDispatch = useDispatch();
    const chatCycles = useSelector((state: RootState) => state.chat.value.chatCycles);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        pushEvent('UserPageView', { pageName: 'ChatNetworkPage' })
        dispatch(setActiveRouteKey(ActiveRouteKey.SEARCH))
    })


    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatCycles.length]);

    const handleSearch = async (input: string) => {
        setRequestQuery(input);
        const chatCycleId = v4();
        const chatRequest: ChatRequest = {
            text: input,
            timestamp: new Date().toISOString(),
            sender: 'user'
        }
        dispatch(startChatThreadWithRequest({ chatRequest, chatCycleId }));
        dispatch(setActiveChatCycleId(chatCycleId));
    }
    return (
        <>
            <div className='chatInNetContainer'>
                {chatCycles.length === 0 && <Title level={2}>What are you looking for?</Title>}
                <br />
                <ChatBar
                    handleUpload={handleSearch}
                    action={"AISearchChat"}
                // actionEntityType={RecordType.CONTACT}
                />
                {chatCycles?.length > 0 && chatCycles.map((chatCycle: ChatCycle, index: number) => {
                    return (
                        <div className='chatMessagesContainer' key={index}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                marginBottom: '1.4rem'
                            }}>
                                <Avatar
                                    style={{
                                        backgroundColor: '#f56a00',
                                        verticalAlign: 'middle',
                                        marginRight: '1rem'
                                    }}
                                    size="small"
                                >
                                    {activeUserEmail ? activeUserEmail.toUpperCase()[0] : 'U'}
                                </Avatar>
                                <p className='messageBubble fromMe'>
                                    {chatCycle?.request?.text}
                                </p>
                            </div>
                            <h2 style={{ textAlign: 'left' }} >Sources</h2>
                            <AIChatResultsList
                                chatCycleId={chatCycle.id}
                                requestQuery={requestQuery}
                            />
                            <h2 style={{ textAlign: 'left', marginTop: "1.4rem" }} >Answer</h2>
                            <AIChatResponse chatCycleId={chatCycle.id} requestQuery={requestQuery} />
                        </div>
                    )
                })

                }
                <div ref={endOfMessagesRef} />
            </div>
            {/* <FloatButton
                icon={<SearchOutlined />}
                type="default" style={{ right: 24, bottom: 180 }}
                onClick={() => navigate(`/${ActiveRouteKey.SEARCH}`)}
            /> */}
        </>
    );
};

export default AISearchDashboard;
