import React from 'react';
import { Card, Typography, Space, Tag, Collapse, Button } from 'antd';
import { CompleteNote } from '@models/note.model';
import './NoteCard.css'
import { NavLink } from 'react-router-dom';
import { pushEvent } from '@utils/analytics';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { format } from 'date-fns';
import { setActiveNote } from '@redux/features/noteSlice';
import { ActiveModalType, ActiveRouteKey, setActiveQueryString, setIsModalOpen, setModalType, setShowSpotlightSearch } from '@redux/features/activeEntitiesSlice';
import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined, EditOutlined } from '@ant-design/icons';
import { setLikeStateForSearchResult } from '@redux/features/chatSlice';
import HTMLRenderer from '../HTMLRenderer';

const { Title } = Typography;
const { Panel } = Collapse;


interface NoteCardProps {
    note: CompleteNote & { isLiked?: boolean };
    chatCycleId?: string;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, chatCycleId }) => {
    const activeQueryString = useSelector((state: RootState) => state.activeEntities.activeQueryString);
    const isLiked = note?.isLiked

    const dispatch: AppDispatch = useDispatch();
    const handleLike = () => {
        dispatch(setLikeStateForSearchResult({
            searchResultId: note.id!,
            isLiked: true,
            chatCycleId: chatCycleId!
        }))
    }
    const handleDislike = () => {
        dispatch(setLikeStateForSearchResult({
            searchResultId: note.id!,
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
            extra={
                note.contact !== undefined && <NavLink
                    onClick={() => {
                        pushEvent('ViewNoteFromAISearch',
                            { note, query: activeQueryString }
                        )
                        dispatch(setShowSpotlightSearch(false))
                        dispatch(setActiveQueryString(''))
                    }}
                    to={`/${ActiveRouteKey.CONTACTS}/${note.contactId}`}>
                    View
                </NavLink>
            }
            title={
                note.contact
                    ? <Title level={4}>
                        {note.contact.name} {", " + note.contact.headline}
                    </Title>
                    : <p>Note</p>
            }
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                    key="list-loadmore-edit"
                    onClick={async () => {
                        dispatch(setActiveNote(note));
                        dispatch(setIsModalOpen(true));
                        dispatch(setModalType(ActiveModalType.NOTE_MODAL))
                    }}
                    icon={<EditOutlined />}
                />
                {format(new Date(note.timestamp), 'yyyy MMM dd')}
            </Space>
            <Tag color="blue">{note.recordType}</Tag>
            {note.contact !== undefined && note.contact !== null && <Collapse className='antCollapseHeader' ghost>
                <Panel
                    header={`Expand`}
                    key="1"
                >
                    <HTMLRenderer htmlContent={note.content} />
                </Panel>
            </Collapse>}
        </Card>
    );
};

export default NoteCard;
