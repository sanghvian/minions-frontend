import { ArrowRightOutlined } from '@ant-design/icons';
import { ActiveRouteKey } from '@redux/features/activeEntitiesSlice';
import { setRecentNotes } from '@redux/features/noteSlice';
import { AppDispatch, RootState } from '@redux/store';
import apiService from '@utils/api/api-service';
import { Avatar, Button, List } from 'antd';
import React from 'react'
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RecentConversationsList = () => {
    const { email, token, name } = useSelector((state: RootState) => state.persisted.user.value);

    const recentNotes = useSelector((state: RootState) => state.note.value.recentNotes);
    const [hasFetchedCachedNotes, setHasFetchedCachedNotes] = React.useState(false);
    const dispatch: AppDispatch = useDispatch();
    const { isLoading } = useQuery({
        queryKey: ["getMostRecentUserNotes", email, token],
        queryFn: async ({ queryKey }) => {
            if (!queryKey[1]) return [];
            const cachedNotesList = await apiService.getRecentNotes(queryKey[1], queryKey[2]!);
            dispatch(setRecentNotes([...recentNotes, ...cachedNotesList]));
            setHasFetchedCachedNotes(true);
        },
        enabled: !hasFetchedCachedNotes
    },
    );

    // Some notes inside recentNotes might be repeated so let's just get unique notes by comparing on note id
    const uniqueRecentNotes = recentNotes?.filter((note, index, self) =>
        index === self.findIndex((t) => (
            t.id === note.id
        ))
    ).sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    });

    const uniqueRecentNotesWithContact = uniqueRecentNotes
        .map((note) => {
            return {
                ...note,
                contactName: note.contact!.name
            }
        })
    const uniqueRecentNotesWithUniqueContactName = uniqueRecentNotesWithContact?.filter((note, index, self) =>
        index === self.findIndex((t) => (
            t.contactName === note.contactName
        ))
    ).slice(0, 4);
    const navigate = useNavigate();

    return (
        isLoading ? <></> : <div style={{
            width: '100%',
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            paddingRight:"3rem"
        }}>
            {/* <h3
                style={{ textAlign: "left" }}
            >Recent Conversations</h3> */}
            {/* Ant design list */}
            <List
                style={{ width: '100%' }}
                itemLayout="horizontal"
                dataSource={uniqueRecentNotesWithUniqueContactName}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                            title={<p style={{ textAlign: "left", fontWeight: 'normal' }}>{item.contactName}</p>}
                            // description={item.content.length > 40 ? item.content.substring(0, 40) + "..." : item.content}
                            description={""}
                        />
                        <Button
                            onClick={() => {
                                navigate(`/${ActiveRouteKey.CONTACTS}/${item.contact!.id}`)
                            }}
                            icon={<ArrowRightOutlined />
                            } ></Button>
                    </List.Item>
                )}
            />

        </div>
    )
}

export default RecentConversationsList
