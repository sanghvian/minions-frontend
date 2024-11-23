import { AppDispatch, RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import './AIResponse.css'
import { Contact } from '@models/contact.model';
import { ChatCycle, ChatResponse, updateChatCycleId, updateChatThreadWithResponse } from '@redux/features/chatSlice';
import { ActiveRouteKey, setActiveQueryString, setSearchAttemptId } from '@redux/features/activeEntitiesSlice';
import HTMLRenderer from '../HTMLRenderer';
import YCLoader from '../YCLoader';
import { setUsageCount } from '@redux/features/userSlice';
import { useNavigate } from "react-router-dom";




const convertChatCyclesToChatHistoryString = (chatCycles: ChatCycle[]): string => {
    if (chatCycles.length === 0) return '';
    const chatHistoryString = chatCycles.reduce((history: string, curr: ChatCycle) => {
        return `${history} + \n\n + Human: ${curr?.request?.text}\nAI: ${curr?.response?.text}`
    }, '')
    return chatHistoryString;
}

const AIChatResponse: React.FC<{ requestQuery: string, chatCycleId: string }> = ({ requestQuery, chatCycleId }) => {
    const { email, token, id, usageCount } = useSelector((state: RootState) => state.persisted.user.value)
    const chatCycles = useSelector((state: RootState) => state.chat.value.chatCycles);
    const chatHistory = convertChatCyclesToChatHistoryString(chatCycles);
    const dispatch: AppDispatch = useDispatch();
    const activeQueryString = useSelector((state: RootState) => state.activeEntities.activeQueryString);
    const activeChatCycleId = useSelector((state: RootState) => state.activeEntities.activeChatCycleId);
    const chatCycle = chatCycles.find((c: ChatCycle) => c.id === chatCycleId);
    const navigate = useNavigate();

    const { isLoading } = useQuery({
        queryKey: ["getRecommendedAnswerChat"],
        queryFn: async () => {
            if (!requestQuery) return null;
            const startTime = new Date().getTime();
            const reqBody = {
                query: requestQuery,
                userUUID: id!,
                chatHistory: chatHistory!,
                userId: email!,
                accessToken: token!,
            }
            const response = await apiService
                .chatInUserNetwork(reqBody)
            const endTime = new Date().getTime();
            dispatch(setActiveQueryString(requestQuery))
            pushEvent('AIChatBotResponded',
                {
                    email,
                    requestQuery,
                    responseTime: (endTime - startTime) / 1000,
                    numContacts: response?.answer
                })
            const chatResponse: ChatResponse = {
                text: response.answer,
                timestamp: new Date().toISOString(),
                sender: 'bot',
                data: {
                    sourceDocs: response.sourceDocs
                }
            }
            dispatch(updateChatThreadWithResponse({
                chatResponse,
                chatCycleId: activeChatCycleId
            }));
            dispatch(setSearchAttemptId(response.searchAttemptId))
            dispatch(updateChatCycleId({
                chatCycleId,
                newChatCycleId: response.searchAttemptId
            }))
            toast.success(`Bot has responded!`)
        },
        enabled: requestQuery.length > 0 && activeQueryString !== chatCycle?.request!.text
    });
    useEffect(() => { }, [activeQueryString])

    const response = chatCycle?.response;
    const sourceDocs = response?.data?.sourceDocs ? response?.data?.sourceDocs.slice(0, 5) as Contact[] : []

    // const handleLike = () => {
    //     dispatch(setResponseLikedState({
    //         isLiked: true,
    //         chatCycleId: chatCycleId!
    //     }))
    //     pushEvent('AIChatBotResponseLiked', {
    //         email,
    //         chatCycleId: chatCycleId!,
    //         requestQuery,
    //         response: chatCycle?.response?.text,
    //         sourceDocs
    //     })
    // }
    // const handleDislike = () => {
    //     dispatch(setResponseLikedState({
    //         isLiked: false,
    //         chatCycleId: chatCycleId!
    //     }))
    //     pushEvent('AIChatBotResponseDisliked', {
    //         chatCycleId: chatCycleId!,
    //         requestQuery,
    //         response: chatCycle?.response?.text,
    //         sourceDocs
    //     })
    // }


    return (
        isLoading ? (
            <p style={{
                marginTop: "2rem",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
            }}>
                Reading from sources to give you the best answer....
                <br /><br />
                <YCLoader />
            </p>
        ) : (
            <>
                {response?.text && response?.text?.length > 0 && (
                    <p className="messageBubble fromBot">
                        <HTMLRenderer htmlContent={response?.text.replace(/\*\*(.*?)\*\*/g, "<br/><br/><b>$1</b>")} />

                        {sourceDocs && sourceDocs?.length > 0 && (
                            <div className="recommendedContactsContainer">
                                {/* select only 1st 5 entries of sourceDocs */}
                                {sourceDocs.map((c: Contact) => (
                                    <div
                                        onClick={async () => {
                                            const toastId = toast.loading('Opening document...');
                                            const contactDocuments = await apiService.getDocumentsForUserContact(email, c.id!, token)
                                            const firstDoc = contactDocuments[0]
                                            toast.success('Document opened!', { id: toastId });
                                            dispatch(setUsageCount(usageCount! + 1))
                                            navigate(`/${ActiveRouteKey.DOCUMENTS}/${firstDoc._id}`)
                                        }
                                        }
                                        className="contactChip"
                                    >
                                        <span>{c.name}</span>
                                    </div>
                                ))}
                                <div className="gradient"></div>
                            </div>
                        )}
                        {/* {chatCycle?.response && chatCycle?.response.isLiked !== true ? (
                            <LikeOutlined onClick={handleLike} key="like" />
                        ) : (
                            <LikeFilled onClick={handleLike} key="like" />
                        )}{" "}
                        &nbsp; &nbsp;&nbsp;
                        {chatCycle?.response && chatCycle?.response.isLiked !== false ? (
                            <DislikeOutlined onClick={handleDislike} key="dislike" />
                        ) : (
                            <DislikeFilled onClick={handleDislike} key="dislike" />
                        )} */}
                    </p>
                )}
            </>
        )
    )
}

export default AIChatResponse
