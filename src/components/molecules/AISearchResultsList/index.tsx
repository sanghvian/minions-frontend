import ContactCard from '@components/atoms/ContactCard';
import { Contact } from '@models/contact.model';
import { AppDispatch, RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import { Button, List, Spin } from 'antd';
import React from 'react'
import { useQuery } from 'react-query';
import './AISearchResultsList.css'
import { useDispatch, useSelector } from 'react-redux';
import { PlusCircleOutlined } from '@ant-design/icons';
import { CompleteNote } from '@models/note.model';
import { CompleteAction } from '@models/action.model';
import { CompleteRelationship } from '@models/relationship.model';
import { RecordType } from '@models/index';
import NoteCard from '@components/atoms/NoteCard';
import ActionCard from '../../../legacy/ActionCard';
import RelationshipCard from '../../../legacy/RelationshipCard';
import { setActiveContacts } from '@redux/features/contactSlice';
import { BottomSheetType, setActiveQueryString, setBottomSheetType, setIsBottomSheetOpen } from '@redux/features/activeEntitiesSlice';
import { initialGroupState, setGroup } from '@redux/features/groupSlice';
import { LinkedinContact } from '@models/linkedinContact.model';
import LinkedinContactCard from '../../../legacy/LinkedinContactCard';
import HistoryCard from '../../../legacy/HistoryCard';
import { CompleteHistory } from '@models/history.model';
import SetAISearchCategories from '../SetAISearchCategories';
import { CompleteContentResponse } from '@models/contentResponse.model';
import { CompleteDocument } from '@models/document.model';
import YCLoader from '@components/atoms/YCLoader';

interface AISearchResultsListProps {
    requestQuery: string;
}

export type PossibleSearchResponseType = (CompleteNote | CompleteAction | CompleteRelationship | Contact | LinkedinContact | CompleteHistory | CompleteContentResponse | CompleteDocument) & { score: number };

export type SearchResultType = (PossibleSearchResponseType & { isLiked?: boolean })

interface SearchResponseInterface {
    notes?: CompleteNote[];
    contacts?: Contact[];
    actions?: CompleteAction[];
    linkedinContacts?: LinkedinContact[];
    relationships?: CompleteRelationship[];
    orderedResultsByScore?: PossibleSearchResponseType[];
    searchAttemptId: string;

}

export const renderItemOnSearchResponseRecordType = (item: PossibleSearchResponseType, index: number) => {
    switch (item.recordType) {
        case RecordType.CONTACT:
            return (
                <List.Item key={index}>
                    <ContactCard contact={item as Contact} />
                </List.Item>
            )
        case RecordType.NOTE:
            return (
                <List.Item key={index}>
                    <NoteCard note={item as CompleteNote} />
                </List.Item>
            )
        case RecordType.ACTION:
            return (
                <List.Item key={index}>
                    <ActionCard action={item as CompleteAction} />
                </List.Item>
            )
        case RecordType.RELATIONSHIP:
            return (
                <List.Item key={index}>
                    <RelationshipCard relationship={item as CompleteRelationship} />
                </List.Item>
            )
        case RecordType.LINKEDIN_CONTACT:
            return (
                <List.Item key={index}>
                    <LinkedinContactCard liContact={item as LinkedinContact} />
                </List.Item>
            )
        case RecordType.HISTORY:
            return (
                <List.Item key={index}>
                    <HistoryCard history={item as CompleteHistory} />
                </List.Item>
            )
        default:
            pushEvent('UnresolvedAISearchResultType', { item })
        // return <p>Unresolved {item.recordType}</p>
    }
}

const AISearchResultsList: React.FC<AISearchResultsListProps> = ({ requestQuery }) => {
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
    const activeSearchResponseRecordTypes = useSelector((state: RootState) => state.activeEntities.activeSearchResponseRecordTypes);
    const searchAttemptId = useSelector((state: RootState) => state.activeEntities.searchAttemptId);
    const activeQueryString = useSelector((state: RootState) => state.activeEntities.activeQueryString);
    const { data, isLoading } = useQuery({
        queryKey: ["getRecommendedContacts", requestQuery, email, token],
        queryFn: async ({ queryKey }) => {
            if (!queryKey[1]) return null;
            try {
                const startTime = new Date().getTime();
                const res: SearchResponseInterface = await apiService.searchInUserNetwork(
                    queryKey[1],
                    queryKey[2]!,
                    queryKey[3]!,
                )
                const endTime = new Date().getTime();
                pushEvent('AISearchContactsReturned', {
                    requestQuery,
                    responseTime: (endTime - startTime) / 1000,
                })
                dispatch(setActiveQueryString(requestQuery));
                return res;
            } catch (error: any) {
                throw new Error(error)
            }
        },
        enabled: requestQuery.length > 0 && activeQueryString === requestQuery
    })
    const orderedResultsByScore = data?.orderedResultsByScore as PossibleSearchResponseType[];
    const contacts = data?.contacts as Contact[];
    // The activeSearchResponseRecordTypes contains an array of recordtypes by which we filter the orderedResultsByScore to return filteredOrderedResultsByScore. If the value of activeSearchResponseRecordTypes is empty, we return the orderedResultsByScore as is.
    const filteredOrderedResultsByScore = activeSearchResponseRecordTypes?.length > 0 ? orderedResultsByScore
        ?.filter((item: PossibleSearchResponseType) => activeSearchResponseRecordTypes.includes(item.recordType)) : orderedResultsByScore
    // ?.filter((item: PossibleSearchResponseType) => item.score > 0.76);

    const dispatch: AppDispatch = useDispatch();

    return (
        isLoading
            ? <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <YCLoader />
            </div>
            : <div>
                {filteredOrderedResultsByScore?.length > 0 ?
                    <>
                        <div style={{
                            background: '#fff',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                        }}>
                            <List
                                itemLayout="horizontal"
                                dataSource={filteredOrderedResultsByScore}
                                renderItem={(item: PossibleSearchResponseType, index) => renderItemOnSearchResponseRecordType(item, index)
                                }
                            />
                        </div>
                        {/* Add 2 thumbs up and down buttons using the icons in AntDesign */}
                        {searchAttemptId?.length > 0 &&
                            <div className="searchThumbsUpAndDown">
                                {/* <LikeOutlined
                                onClick={async () => {
                                    await apiService.updateSearchAttempt(searchAttemptId, true)
                                    toast.success('Thanks for the feedback!')
                                    pushEvent('LikedAISearch', { query: activeQueryString, orderedResultsByScore })
                                }}
                                style={{ fontSize: '1.5rem' }}
                            />
                            &nbsp; &nbsp;
                            <DislikeOutlined
                                onClick={async () => {
                                    await apiService.updateSearchAttempt(searchAttemptId, false)
                                    toast.success("Oops, Sorry we weren't able to find the right contact. We'll take this feedback to improve next time!")
                                    pushEvent('DislikedAISearch', { query: activeQueryString, orderedResultsByScore })

                                }}
                                style={{ fontSize: '1.5rem' }}
                            /> */}
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
                            </div>}
                        <SetAISearchCategories />
                    </>
                    :
                    <></>
                }
            </div>
    )
}

export default AISearchResultsList
