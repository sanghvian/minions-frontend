import { Contact } from '@models/contact.model';
import { AppDispatch, RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import { Spin, Tag } from 'antd';
import React, { useState } from 'react'
import { useQuery } from 'react-query';
import './AIChatResultsList.css'
import { useDispatch, useSelector } from 'react-redux';
import { CompleteNote } from '@models/note.model';
import { CompleteAction } from '@models/action.model';
import { CompleteRelationship } from '@models/relationship.model';
import { RecordType } from '@models/index';
import { ActiveRouteKey, setActiveQueryString } from '@redux/features/activeEntitiesSlice';
import { LinkedinContact } from '@models/linkedinContact.model';
import { CompleteHistory } from '@models/history.model';
import { ChatCycle, ChatResponse, updateChatThreadWithResponse } from '@redux/features/chatSlice';
import HTMLRenderer from '@components/atoms/HTMLRenderer';
import { CompleteContentResponse } from '@models/contentResponse.model';
import { CompleteDocument } from '@models/document.model';
import { setUsageCount } from '@redux/features/userSlice';
import { useNavigate } from "react-router-dom";

interface AIChatResultsListProps {
    requestQuery: string;
    chatCycleId: string;
}

export type PossibleSearchResponseType = (CompleteNote | CompleteAction | CompleteRelationship | Contact | LinkedinContact | CompleteHistory | CompleteContentResponse | CompleteDocument) & { score: number };

interface SearchResponseInterface {
    notes?: CompleteNote[];
    contacts?: Contact[];
    actions?: CompleteAction[];
    linkedinContacts?: LinkedinContact[];
    relationships?: CompleteRelationship[];
    orderedResultsByScore?: PossibleSearchResponseType[];
    contentResponses?: CompleteContentResponse[];
    searchAttemptId: string;

}

const ItemCard: React.FC<
    { title: string, description: string, tagName: string, handleClick: () => void }
> = ({ title, description, tagName, handleClick }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '0.5rem',
                borderBottom: '1px solid #f0f0f0',
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                cursor: 'pointer'
            }}
            className="itemCardContainer"
            onClick={handleClick}
        >
            <span>
                <strong>{title}</strong>
                {/* display item.biography upto 20 characters and after that, show ellipsis */}
                {/* <p>{}</p> */}
                <HTMLRenderer htmlContent={description?.length > 35 ? description.slice(0, 35) + '...' : description} />
            </span>
            <Tag style={{ alignSelf: 'flex-end' }} color={tagName === "Document" ? "volcano" : "blue"}>{tagName}</Tag>
        </div>
    )
}

const ContactItemCard = ({ contact }: { contact: Contact }) => {
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
    const [userContactDocuments, setUserContactDocuments] = useState<CompleteDocument[]>([]);
    const navigate = useNavigate();


    const { isLoading } = useQuery({
        queryKey: ["getCompleteContact", contact.id!, email, token],
        queryFn: async ({ queryKey }) => {
            if (!queryKey[1]) return null;
            const contactDocuments = await apiService.getDocumentsForUserContact(queryKey[2], queryKey[1]!, queryKey[3]!)
            setUserContactDocuments(contactDocuments);
        },
    })

    const firstDoc = userContactDocuments[0];

    return (
        isLoading ? <Spin /> : <ItemCard
            title={contact.name}
            description={contact.biography}
            tagName="Document"
            handleClick={() => {
                window.open(process.env.REACT_APP_DOMAIN + `/${ActiveRouteKey.DOCUMENTS}/${firstDoc._id}`, '_blank')
            }}
        />
    )
}

const ContentResponseItemCard: React.FC<{ contentResponse: Partial<CompleteContentResponse> }> = ({ contentResponse }) => {
    const dispatch: AppDispatch = useDispatch();
    const { usageCount } = useSelector((state: RootState) => state.persisted.user.value);
    const navigate = useNavigate();
    return (
        <ItemCard
            title={contentResponse?.contact?.name
                ? contentResponse?.contact!.name : "..."}
            description={contentResponse.answerText!}
            tagName="Nugget 🥠"
            handleClick={() => {
                dispatch(setUsageCount(usageCount! + 1))
                window.open(process.env.REACT_APP_DOMAIN + `/${ActiveRouteKey.DOCUMENTS}/${contentResponse.documentId}?topicId=${contentResponse?.contentBlockId!}`, '_blank')
            }}
        />
    )
}

export const renderItemOnChatResponseRecordType = ({ item, chatCycleId, index }: { item: PossibleSearchResponseType, chatCycleId: string, index: number }) => {
    switch (item.recordType) {
        case RecordType.CONTACT:
            return (
                // <List.Item key={index}>
                // <ContactCard chatCycleId={chatCycleId} contact={item as Contact} />

                // </List.Item>
                <ContactItemCard contact={item as Contact} />

            )
        // case RecordType.NOTE:
        //     return (
        //         // <List.Item key={index}>
        //         // <NoteCard chatCycleId={chatCycleId} note={item as CompleteNote} />
        //         <ItemCard
        //             title={(item as CompleteNote)?.contact?.name ? (item as CompleteNote).contact!.name! : "..."}
        //             description={(item as CompleteNote).content}
        //             tagName="Note"
        //             navigateLink={`/${ActiveRouteKey.CONTACTS}/${(item as CompleteNote).contact?.id}`}
        //         />
        //         // </List.Item>
        //     )
        // case RecordType.ACTION:
        //     return (
        //         // <List.Item key={index}>
        //         // <ActionCard chatCycleId={chatCycleId} action={item as CompleteAction} />
        //         <ItemCard
        //             title={(item as CompleteAction).contact?.name ? (item as CompleteAction).contact!.name! : "..."}
        //             description={(item as CompleteAction).action}
        //             tagName="Action"
        //             navigateLink={`/${ActiveRouteKey.CONTACTS}/${(item as CompleteAction).contact!.id}`}
        //         />
        //         // </List.Item>
        //     )
        // case RecordType.RELATIONSHIP:
        //     return (
        //         // <List.Item key={index}>
        //         // <RelationshipCard
        //         //     chatCycleId={chatCycleId}
        //         //     relationship={item as CompleteRelationship}
        //         //     />
        //         <ItemCard
        //             title={(item as CompleteRelationship).contact?.name ? (item as CompleteRelationship).contact!.name! : "..."}
        //             description={(item as CompleteRelationship).relationshipContext}
        //             tagName="Relationship"
        //             navigateLink={`/${ActiveRouteKey.CONTACTS}/${(item as CompleteRelationship).contact!.id}`}
        //         />
        //         // </List.Item>
        //     )
        // case RecordType.LINKEDIN_CONTACT:
        //     return (
        //         // <List.Item key={index}>
        //         // <LinkedinContactCard chatCycleId={chatCycleId} liContact={item as LinkedinContact} />
        //         <ItemCard
        //             title={(item as LinkedinContact)?.name ? (item as LinkedinContact).name! : "..."}
        //             description={(item as LinkedinContact).biography}
        //             tagName="Linkedin Contact"
        //             navigateLink={`/${ActiveRouteKey.CONTACTS}/${(item as LinkedinContact).contactId}`}
        //         />
        //         // </List.Item>
        //     )
        // case RecordType.HISTORY:
        //     return (
        //         // <List.Item key={index}>
        //         // <HistoryCard chatCycleId={chatCycleId} history={item as CompleteHistory} />
        //         <ItemCard
        //             title={(item as CompleteHistory)?.linkedinContact?.name ? (item as CompleteHistory)?.linkedinContact?.name! : "..."}
        //             description={(item as CompleteHistory).organization_name + (item as CompleteHistory).info.join('.')}
        //             tagName="History"
        //             navigateLink={`/${ActiveRouteKey.CONTACTS}/${(item as CompleteHistory).linkedinContact!.contactId}`}
        //         />
        //         // </List.Item>
        //     )
        case RecordType.CONTENT_RESPONSE:
            return (
                <ContentResponseItemCard contentResponse={item as CompleteContentResponse} />
            )
        case RecordType.DOCUMENT:
            return (
                <ItemCard
                    title={
                        (item as CompleteDocument)?.contact?.name
                            ? (item as CompleteDocument)?.contact?.name!
                            : (item as CompleteDocument)?.template?.name
                                ? (item as CompleteDocument)?.template?.name! : "..."
                    }
                    description={""}
                    tagName="Document"
                    handleClick={() => {
                        window.open(process.env.REACT_APP_DOMAIN + `/${ActiveRouteKey.DOCUMENTS}/${(item as CompleteDocument).id}`, '_blank')
                    }}


                />
            )
        default:
            pushEvent('UnresolvedAISearchResultType', { item })
        // return <p>Unresolved {item.recordType}</p>
    }
}

const AIChatResultsList: React.FC<AIChatResultsListProps> = ({ requestQuery, chatCycleId }) => {
    const user = useSelector((state: RootState) => state.persisted.user.value);
    const activeSearchResponseRecordTypes = useSelector((state: RootState) => state.activeEntities.activeSearchResponseRecordTypes);
    const searchAttemptId = useSelector((state: RootState) => state.activeEntities.searchAttemptId);
    const activeQueryString = useSelector((state: RootState) => state.activeEntities.activeQueryString);
    const activeChatCycleId = useSelector((state: RootState) => state.activeEntities.activeChatCycleId);
    const chatCycles = useSelector((state: RootState) => state.chat.value.chatCycles);
    // Get chatCycle by chatCycleId
    const chatCycle = chatCycles.find((chatCycle: ChatCycle) => chatCycle.id === chatCycleId);

    const dispatch: AppDispatch = useDispatch();
    const { isLoading } = useQuery({
        queryKey: ["getRecommendedContacts"],
        queryFn: async () => {
            if (!requestQuery) return null;
            const startTime = new Date().getTime();
            const res: SearchResponseInterface = await apiService.searchInUserNetwork(
                requestQuery,
                user.email,
                user.token,
            )
            const newUserCount = user?.usageCount ? user?.usageCount + 1 : 1
            // Updating the user feature usage
            // await apiService.updateUserActionsCount({
            //     email: user.email,
            //     userId: user.id!,
            //     usageCount: newUserCount,
            //     accessToken: user.token
            // })
            // dispatch(setUserActionCount(newUserCount))


            const endTime = new Date().getTime();
            pushEvent('AISearchResultsReturned', {
                requestQuery,
                responseTime: (endTime - startTime) / 1000,
            })
            dispatch(setActiveQueryString(requestQuery));

            const chatResponse: ChatResponse = {
                text: "",
                timestamp: new Date().toISOString(),
                sender: 'bot',
                data: {
                    searchResults: res.orderedResultsByScore
                }
            }
            dispatch(updateChatThreadWithResponse({
                chatResponse,
                chatCycleId: activeChatCycleId
            }));
        },
        enabled: requestQuery.length > 0 && activeQueryString !== chatCycle?.request!.text
    })

    const orderedResultsByScore = chatCycle?.response?.data?.searchResults as PossibleSearchResponseType[];
    const contacts = orderedResultsByScore?.filter((item: PossibleSearchResponseType) => item.recordType === RecordType.CONTACT) as Contact[];
    const filteredOrderedResultsByScore = activeSearchResponseRecordTypes?.length > 0
        ? orderedResultsByScore
            // TODO - Patchfix - move this to the backend so you save latency in data transfer
            // ?.filter((item: any) => item.score > 0.84)
            ?.filter((item: PossibleSearchResponseType) => activeSearchResponseRecordTypes.includes(item.recordType))
            ?.map((item: PossibleSearchResponseType) => {
                return ({
                    ...item,
                    name: (item as Contact)?.name || (item as Partial<CompleteContentResponse> | CompleteDocument)?.contact?.name || (item as CompleteDocument)?.template?.name
                })
            })
        : orderedResultsByScore?.map((item: PossibleSearchResponseType) => {
            return ({
                ...item,
                name: (item as Contact)?.name || (item as Partial<CompleteContentResponse> | CompleteDocument)?.contact?.name || (item as CompleteDocument)?.template?.name
            })
        });

    // Iterate over filteredOrderedResultsByScore and remove any repeats by looking at the "name" property
    const uniqueResults = (filteredOrderedResultsByScore as any)?.filter((item: any, index: number, self: any) =>
        index === self.findIndex((t: any) => (
            t.name === item.name
        ))
    )

    return (
        !isLoading ? <div className='chatRecommendedContactsContainer'>
            {orderedResultsByScore?.length > 0 &&
                <>
                    {/* <SetAISearchCategories /> */}
                    <div style={{
                        // background: '#fff',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        // display: 'flex',
                        // flexWrap: 'wrap',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                        gridGap: '0.5rem',
                    }}>

                        {/* <Collapse
                            style={{ background: 'white' }}
                            items={[{
                                key: '1',
                                label: 'Relevant Sources',
                                children: <List
                                    itemLayout="horizontal"
                                    dataSource={filteredOrderedResultsByScore}
                                    renderItem={(item: PossibleSearchResponseType, index) =>
                                        renderItemOnChatResponseRecordType({ item, chatCycleId, index })
                                    }

                                />

                            }]}
                        /> */}

                        {uniqueResults?.length > 0 &&
                            uniqueResults
                                .slice(0, 10)
                                .map((item: PossibleSearchResponseType, index: number) => renderItemOnChatResponseRecordType({ item, chatCycleId, index })
                                )}
                    </div>
                    {/* Add 2 thumbs up and down buttons using the icons in AntDesign */}
                    {/* {searchAttemptId?.length > 0 &&
                        <div className="thumbsUpAndDown">
                            <Button
                                onClick={async () => {
                                    const searchAttempt = {
                                        user,
                                        isLiked: chatCycle?.response?.isLiked,
                                        query: chatCycle?.request?.text!,
                                        searchResults: chatCycle?.response?.data?.searchResults || [],
                                        answer: chatCycle?.response?.text!
                                    }
                                    await apiService.updateSearchAttempt(chatCycle?.id!, searchAttempt)
                                    toast.success('Thanks for the feedback!')
                                    pushEvent('SubmitAIChatFeedback', { query: activeQueryString, orderedResultsByScore })
                                }}
                            >Submit Feedback</Button>&nbsp; &nbsp;
                            <Button
                                icon={<PlusCircleOutlined />}
                                onClick={() => {
                                    dispatch(setActiveContacts(contacts));
                                    dispatch(setActiveQueryString(''))
                                    dispatch(setIsBottomSheetOpen(true))
                                    dispatch(setBottomSheetType(BottomSheetType.GROUP_ADD))
                                    dispatch(setGroup(initialGroupState.activeGroup))
                                }}
                            >
                                Create List
                            </Button>
                        </div>} */}
                </>
            }
        </div> : <div>Loading...</div>
    )
}

export default AIChatResultsList
