import React from 'react';
import { Card, Collapse, Typography, Space, Tag, Spin } from 'antd';
import './LinkedinContactCard.css'
import { NavLink } from 'react-router-dom';
import { pushEvent } from '@utils/analytics';
import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { ActiveRouteKey, setActiveQueryString, setShowSpotlightSearch } from '@redux/features/activeEntitiesSlice';
import { LinkedinContact } from '@models/linkedinContact.model';
import { setLikeStateForSearchResult } from '@redux/features/chatSlice';
import { useQuery } from 'react-query';
import apiService from '@utils/api/api-service';
import { Contact } from '@models/contact.model';
import { convertBrokenStringToFormattedMultilineString } from '@utils/commonFuncs';

const { Panel } = Collapse;
const { Title } = Typography;

interface LinkedinContactCardProps {
    liContact: LinkedinContact & { isLiked?: boolean };
    chatCycleId?: string
}

const LinkedinContactCard: React.FC<LinkedinContactCardProps> = ({ liContact, chatCycleId }) => {
    const activeQueryString = useSelector((state: RootState) => state.activeEntities.activeQueryString);
    const isLiked = liContact?.isLiked
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value)

    const { data, isLoading } = useQuery({
        queryKey: ['getContactFromLinkedinContactId', liContact.id],
        queryFn: async () => {
            return await apiService.getContactByLinkedinContactId(liContact.id!, email, token)
        },
        enabled: !!liContact.id
    })
    const contact = data as Contact

    const dispatch: AppDispatch = useDispatch();
    const handleLike = () => {
        dispatch(setLikeStateForSearchResult({
            searchResultId: liContact.id!,
            isLiked: true,
            chatCycleId: chatCycleId!
        }))
    }
    const handleDislike = () => {
        dispatch(setLikeStateForSearchResult({
            searchResultId: liContact.id!,
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
                isLoading ? <Spin /> : <NavLink
                    onClick={() => {
                        pushEvent('ViewContactFromAISearch',
                            { liContact, query: activeQueryString }
                        )
                        dispatch(setShowSpotlightSearch(false))
                        dispatch(setActiveQueryString(''))

                    }}

                    to={`/${ActiveRouteKey.CONTACTS}/${contact!.id}`}>
                    View
                </NavLink>
            }
            title={
                <Title level={4}>
                    {liContact.name}
                </Title>
            }
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                {liContact.organization_name && liContact.occupation && <p> <strong>{liContact.organization_name}</strong> - {liContact.occupation} </p>}
                <Tag color="blue">{liContact.recordType}</Tag>
                <Collapse className='antCollapseHeader' ghost>
                    <Panel header="Biography" key="1">
                        <p>{convertBrokenStringToFormattedMultilineString(liContact.biography)}</p>
                    </Panel>
                </Collapse>
            </Space>
        </Card>
    );
};

export default LinkedinContactCard;
