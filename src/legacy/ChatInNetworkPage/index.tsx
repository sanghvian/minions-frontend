// import './ChatInNetworkPage.css'
// import { pushEvent } from '@utils/analytics';
// import ChatBar from '@components/molecules/ChatBar';
// import { RecordType } from '@models/index';
// import React, { useEffect, useRef, useState } from 'react'; // ensure to create this SCSS file with styles
// import { AppDispatch, RootState } from '@redux/store';
// import { useDispatch, useSelector } from 'react-redux';
// import { ActiveRouteKey, setActiveChatCycleId, setActiveRouteKey } from '@redux/features/activeEntitiesSlice';
// import AIChatResponse from '@components/atoms/AIChatResponse';
// import { ChatCycle, ChatRequest, startChatThreadWithRequest } from '@redux/features/chatSlice';
// import { v4 } from 'uuid';
// import AIChatContactsList from '@components/molecules/AIChatResultsList';
// import { Avatar } from 'antd';

// const ChatInNetworkPage: React.FC = () => {
//     const [requestQuery, setRequestQuery] = useState<string>("");
//     const { name, email } = useSelector((state: RootState) => state.persisted.user.value);
//     const dispatch: AppDispatch = useDispatch();
//     const chatCycles = useSelector((state: RootState) => state.chat.value.chatCycles);
//     const endOfMessagesRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         pushEvent('UserPageView', { pageName: 'ChatNetworkPage' })
//         dispatch(setActiveRouteKey(ActiveRouteKey.SEARCH2))
//     })

//     useEffect(() => {
//         if (endOfMessagesRef.current) {
//             endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
//         }
//     }, [chatCycles.length]);

//     const handleSearch = async (input: string) => {
//         setRequestQuery(input);
//         const chatCycleId = v4();
//         const chatRequest: ChatRequest = {
//             text: input,
//             timestamp: new Date().toISOString(),
//             sender: 'user'
//         }
//         pushEvent('RequestSearchByChat', { email, request: chatRequest.text });
//         dispatch(startChatThreadWithRequest({ chatRequest, chatCycleId }));
//         dispatch(setActiveChatCycleId(chatCycleId));
//     }
//     return (
//         <>
//             <div className='chatInNetContainer'>
//                 {chatCycles?.length > 0 && chatCycles.map((chatCycle: ChatCycle, index: number) => {
//                     return (
//                         <div className='messagesContainer' key={index}>
//                             <div style={{ display: 'flex' }}>
//                                 <Avatar
//                                     style={{
//                                         backgroundColor: '#f56a00',
//                                         verticalAlign: 'middle'
//                                     }}
//                                     size="large"
//                                 >
//                                     {name!.toUpperCase()[0] || 'U'}
//                                 </Avatar>
//                                 <p className='messageBubble fromMe'>
//                                     {chatCycle?.request?.text}
//                                 </p>
//                             </div>
//                             <AIChatResponse chatCycleId={chatCycle.id} requestQuery={requestQuery} />
//                             <AIChatContactsList chatCycleId={chatCycle.id} requestQuery={requestQuery} />
//                         </div>
//                     )
//                 })}
//                 <div ref={endOfMessagesRef} />
//                 <br /><br /><br /><br /><br /><br /><br />
//             </div>
//             {/* <FloatButton
//                 icon={<SearchOutlined />}
//                 type="default" style={{ right: 24, bottom: 180 }}
//                 onClick={() => navigate(`/${ActiveRouteKey.SEARCH}`)}
//             /> */}
//             <ChatBar
//                 handleUpload={handleSearch}
//                 action={"ChatContactInNetwork"}
//             // actionEntityType={RecordType.CONTACT}
//             />
//         </>
//     );
// };

// export default ChatInNetworkPage;


export default {}