import React from 'react';
import { Card, Typography, Space, Tag, Collapse, } from 'antd';
import { CompleteRelationship } from '@models/relationship.model';
import './RelationshipCard.css'
import { NavLink } from 'react-router-dom';
import { pushEvent } from '@utils/analytics';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { ActiveRouteKey, setActiveQueryString, setShowSpotlightSearch } from '@redux/features/activeEntitiesSlice';
import { setLikeStateForSearchResult } from '@redux/features/chatSlice';
import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Panel } = Collapse;

interface RelationshipCardProps {
    relationship: CompleteRelationship & { isLiked?: boolean };
    chatCycleId?: string
}

const RelationshipCard: React.FC<RelationshipCardProps> = ({ relationship, chatCycleId }) => {
    const activeQueryString = useSelector((state: RootState) => state.activeEntities.activeQueryString);
    const isLiked = relationship?.isLiked

    const dispatch: AppDispatch = useDispatch();
    const handleLike = () => {
        dispatch(setLikeStateForSearchResult({
            searchResultId: relationship.id!,
            isLiked: true,
            chatCycleId: chatCycleId!
        }))
    }
    const handleDislike = () => {
        dispatch(setLikeStateForSearchResult({
            searchResultId: relationship.id!,
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
            extra={
                relationship.contact !== undefined && <NavLink
                    onClick={() => {
                        pushEvent('ViewRelationshipFromAISearch',
                            { relationship, query: activeQueryString }
                        )
                        dispatch(setShowSpotlightSearch(false))
                        dispatch(setActiveQueryString(''))
                    }
                    }
                    to={`/${ActiveRouteKey.CONTACTS}/${relationship.contact!.id}`}>
                    View
                </NavLink>}
            title={
                <Title level={4}>
                    {relationship.relationshipContext}
                </Title>
            }
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Tag color="blue">{relationship.recordType}</Tag>
                {relationship.contact !== undefined && <Collapse className='antCollapseHeader' ghost>
                    <Panel
                        header={`Related to ${relationship.contact!.name}, ${relationship.contact!.headline}`}
                        key="1"
                    >
                        <p>{relationship.contact!.biography}</p>
                    </Panel>
                </Collapse>}
            </Space>
            {/* Add a View Link component in ant design that takes the contact id and navigates the router to "/contacts/:contactId */}
            {/* <NavLink
                to={`/${ActiveRouteKey.CONTACTS}/${contact.id}`}
                style={{ textDecoration: "underline", color: 'blue', marginBottom: '10px', marginRight: '10px' }}
            >
                View Contact
            </NavLink> */}
        </Card>
    );
};

export default RelationshipCard;
