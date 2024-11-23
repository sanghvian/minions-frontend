import React from 'react';
import { Card, Typography, Space, Button, Tag, Collapse, } from 'antd';
import { CompleteAction } from '@models/action.model';
import './ActionCard.css'
import { NavLink } from 'react-router-dom';
import { pushEvent } from '@utils/analytics';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { setAction } from '@redux/features/actionSlice';
import { ActiveModalType, ActiveRouteKey, setActiveQueryString, setIsModalOpen, setModalType, setShowSpotlightSearch } from '@redux/features/activeEntitiesSlice';
import { EditOutlined, DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined, } from '@ant-design/icons';
import { format } from 'date-fns';
import { setLikeStateForSearchResult } from '@redux/features/chatSlice';

const { Title } = Typography;
const { Panel } = Collapse;

interface ActionCardProps {
    action: CompleteAction & { isLiked?: boolean };
    chatCycleId?: string
}

const ActionCard: React.FC<ActionCardProps> = ({ action, chatCycleId }) => {
    const activeQueryString = useSelector((state: RootState) => state.activeEntities.activeQueryString);
    const dispatch: AppDispatch = useDispatch();

    const isLiked = action?.isLiked

    const handleLike = () => {
        dispatch(setLikeStateForSearchResult({
            searchResultId: action.id!,
            isLiked: true,
            chatCycleId: chatCycleId!
        }))
    }
    const handleDislike = () => {
        dispatch(setLikeStateForSearchResult({
            searchResultId: action.id!,
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
                    pushEvent('ViewActionFromAISearch',
                        { action, query: activeQueryString }
                    )
                    dispatch(setShowSpotlightSearch(false))
                    dispatch(setActiveQueryString(''))
                }
                }
                to={action.actionLink}>
                View
            </NavLink>
            }
            title={
                <Title level={4}>
                    {action.action}
                </Title>
            }
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                {action &&
                    <Button
                        key="list-loadmore-edit"
                        onClick={async () => {
                            dispatch(setAction(action));
                            dispatch(setIsModalOpen(true));
                            dispatch(setModalType(ActiveModalType.ACTION_MODAL))
                        }}
                        icon={<EditOutlined />
                        }
                    />
                }
                <NavLink to={`/${ActiveRouteKey.CONTACTS}/${action.contact!.id}`}>Action for {action.contact!.name}</NavLink>
                {format(new Date(action.timestamp), 'yyyy MMM dd')}
                <Tag color="blue">{action.recordType}</Tag>
                {action.contact !== undefined && <Collapse className='antCollapseHeader' ghost>
                    <Panel
                        header={`Action about ${action.contact!.name}, ${action.contact!.headline}`}
                        key="1"
                    >
                        <p>{action.contact!.biography}</p>
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

export default ActionCard;
