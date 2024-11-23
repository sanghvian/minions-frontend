import React from 'react';
import { Card, Collapse, Typography, Space, Button, Tag } from 'antd';
import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Contact } from '@models/contact.model';
import './ContactCard.css'
import { NavLink } from 'react-router-dom';
import { pushEvent } from '@utils/analytics';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { ActiveRouteKey, setActiveQueryString, setShowSpotlightSearch } from '@redux/features/activeEntitiesSlice';
import { setLikeStateForSearchResult } from '@redux/features/chatSlice';
import { convertBrokenStringToFormattedMultilineString } from '@utils/commonFuncs';

const { Panel } = Collapse;
const { Title } = Typography;

interface ContactCardProps {
    contact: Contact & { isLiked?: boolean };
    chatCycleId?: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, chatCycleId }) => {
    const activeQueryString = useSelector((state: RootState) => state.activeEntities.activeQueryString);
    const isLiked = contact?.isLiked

    const dispatch: AppDispatch = useDispatch();
    const handleLike = () => {
        dispatch(setLikeStateForSearchResult({
            searchResultId: contact.id!,
            isLiked: true,
            chatCycleId: chatCycleId!
        }))

    }
    const handleDislike = () => {
        dispatch(setLikeStateForSearchResult({
            searchResultId: contact.id!,
            isLiked: false,
            chatCycleId: chatCycleId!
        }))
    }

    const cardActions = [
        isLiked !== true ? <LikeOutlined onClick={handleLike} key="like" /> : <LikeFilled onClick={handleLike} key="like" />,
        isLiked !== false ? <DislikeOutlined onClick={handleDislike} key="dislike" /> : <DislikeFilled onClick={handleDislike} key="dislike" />
    ]

    return (
        // <Badge.Ribbon text={contact.location}>
        <Card
            actions={chatCycleId ? cardActions : []}
            extra={<NavLink
                onClick={() => {
                    pushEvent('ViewContactFromAISearch',
                        { contact, query: activeQueryString }
                    )
                    dispatch(setShowSpotlightSearch(false))
                    dispatch(setActiveQueryString(''))
                }}
                to={`/${ActiveRouteKey.CONTACTS}/${contact.id}`}>
                View
            </NavLink>}
            title={
                <Title level={4}>
                    {contact.name}
                </Title>
            }
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <div className="contactCardActionButtons">
                    {contact?.email && contact?.email?.length > 0 &&
                        <Button
                            icon={<MailOutlined />}
                            onClick={() =>
                                pushEvent('EmailContactFromAISearch',
                                    { contact, query: activeQueryString }
                                )}
                            type="primary" shape="circle"
                            href={`mailto:${contact.email}`}
                        />
                    }
                    {contact?.phone && contact?.phone?.length > 0 &&
                        <Button
                            onClick={() =>
                                pushEvent('PhoneContactFromAISearch',
                                    { contact, query: activeQueryString }
                                )}
                            icon={<PhoneOutlined />}
                            type="primary" shape="circle"
                            href={`tel:${contact.phone}`}
                        />
                    }

                </div>
                {contact.organization_name && contact.occupation && <p> <strong>{contact.organization_name}</strong> - {contact.occupation} </p>}
                <Tag color="blue">{contact.recordType}</Tag>
                {/* <span><b>Interests:</b> {contact.interests.join(", ")}</span> */}
                {/* </span> */}
                <Collapse className='antCollapseHeader' ghost>
                    <Panel header="Biography" key="1">
                        <p>{convertBrokenStringToFormattedMultilineString(contact.biography)}</p>
                    </Panel>
                </Collapse>
            </Space>
            {/* Add a View Link component in ant design that takes the contact id and navigates the router to "/contacts/:contactId */}
            {/* <NavLink
                to={`/${ActiveRouteKey.CONTACTS}/${contact.id}`}
                style={{ textDecoration: "underline", color: 'blue', marginBottom: '10px', marginRight: '10px' }}
            >
                View Contact
            </NavLink> */}
        </Card>
        // </Badge.Ribbon>
        // </Space>
    );
};

export default ContactCard;
