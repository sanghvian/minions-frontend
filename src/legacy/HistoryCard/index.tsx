import React from 'react';
import { Card, Collapse, Typography, Space, Tag } from 'antd';
import './HistoryCard.css'
import { NavLink } from 'react-router-dom';
import { pushEvent } from '@utils/analytics';
import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { ActiveRouteKey, setActiveQueryString, setShowSpotlightSearch } from '@redux/features/activeEntitiesSlice';
import { CompleteHistory } from '@models/history.model';
import { setLikeStateForSearchResult } from '@redux/features/chatSlice';
import { useQuery } from 'react-query';
import apiService from '@utils/api/api-service';

const { Panel } = Collapse;
const { Title } = Typography;

interface HistoryCardProps {
    history: CompleteHistory & { isLiked?: boolean };
    chatCycleId?: string
}

const HistoryCard: React.FC<HistoryCardProps> = ({ history, chatCycleId }) => {
    const activeQueryString = useSelector((state: RootState) => state.activeEntities.activeQueryString);
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value)

    const { data: contactData } = useQuery({
        queryKey: ["getContactFromLinkedinContactId", history.linkedinContactId, email, token],
        queryFn: async ({ queryKey }) => {
            if (!queryKey[1]) return null;
            const response = await apiService.getContactByLinkedinContactId(queryKey[1] as string, queryKey[2] as string, queryKey[3] as string)
            return response
        },
    });

    const isLiked = history?.isLiked

    const dispatch: AppDispatch = useDispatch();
    const handleLike = () => {
        dispatch(setLikeStateForSearchResult({
            searchResultId: history.id!,
            isLiked: true,
            chatCycleId: chatCycleId!
        }))
    }
    const handleDislike = () => {
        dispatch(setLikeStateForSearchResult({
            searchResultId: history.id!,
            isLiked: false,
            chatCycleId: chatCycleId!
        }))
    }

    const cardActions = [
        isLiked !== true ? <LikeOutlined onClick={handleLike} key="like" /> : <LikeFilled onClick={handleLike} key="like" />,
        isLiked !== false ? <DislikeOutlined onClick={handleDislike} key="dislike" /> : <DislikeFilled onClick={handleDislike} key="dislike" />
    ]


    return (
        <Card
            actions={chatCycleId ? cardActions : []}
            extra={<NavLink
                onClick={() => {
                    pushEvent('ViewHistoryFromAISearch',
                        { history, query: activeQueryString }
                    )
                    dispatch(setShowSpotlightSearch(false))
                    dispatch(setActiveQueryString(''))
                }
                }
                // TODO : Patchfix - for now, just redirecting to linkedin since we don't have a way of going to the exact contactId in the user's recontact linked to this linkedin ID.
                to={`/${ActiveRouteKey.CONTACTS}/${contactData?.id}`}>
                View
            </NavLink>}
            title={
                <Title level={4}>
                    {history.linkedinContact && <p> <strong>{history.linkedinContact.name}</strong></p>}
                </Title>
            }
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <span>{history.occupation} @ {history.organization_name}</span>
                <Tag color="blue">{history.recordType}</Tag>

                {history.linkedinContact?.biography && history.linkedinContact?.biography.length > 0 &&
                    <Collapse className='antCollapseHeader' ghost>
                        <Panel header="Biography" key="1">
                            <p>{history.linkedinContact?.biography}</p>
                        </Panel>
                    </Collapse>}
            </Space>
        </Card>
    );
};

export default HistoryCard;
