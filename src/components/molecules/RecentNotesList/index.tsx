import { ShareAltOutlined } from '@ant-design/icons';
import HTMLRenderer from '@components/atoms/HTMLRenderer';
import { CompleteNote } from '@models/note.model';
import { ActiveRouteKey } from '@redux/features/activeEntitiesSlice';
import { setRecentNotes } from '@redux/features/noteSlice';
import { AppDispatch, RootState } from '@redux/store';
import apiService from '@utils/api/api-service';
import { List, Spin } from 'antd';
import { CheckCircleOutline } from 'antd-mobile-icons';
import { format } from 'date-fns';
import React from 'react'
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
    LeadingActions,
    SwipeableList,
    SwipeableListItem,
    SwipeAction,
    TrailingActions,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';

const leadingActions = () => (
    <LeadingActions>
        <SwipeAction onClick={() => console.info('swipe leading action triggered')}>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    backgroundColor: 'blue'
                }}
            >
                <ShareAltOutlined />
                Share
            </div>
        </SwipeAction>
    </LeadingActions>
);

const trailingActions = () => (
    <TrailingActions>
        <SwipeAction
            destructive={true}
            onClick={() => console.info('swipe action triggered')}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    backgroundColor: 'green'
                }}
            >
                <CheckCircleOutline />
                Clear
            </div>
        </SwipeAction>
    </TrailingActions>
);



// Date formatter function that takes in a timestamp in ISO string format and returns a string of the form "6:02PM, 18th June 2021" using the `format` function from the `date-fns` library
const timeFormatter = (timestamp: string) => {
    const formattedDate = `${format(new Date(timestamp), 'h:mma, do MMM yyyy')}`;
    // use the `format` function from date-fns to format hours and minutes as 6:02pm with AM/PM form instead of 24 hour format
    return formattedDate;
}

const RecentNotesList = () => {
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
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
    const uniqueRecentNotes = recentNotes.filter((note, index, self) =>
        index === self.findIndex((t) => (
            t.id === note.id
        ))
    ).sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    });

    return (
        isLoading ? <Spin /> : <div>
            {uniqueRecentNotes.length > 0 &&
                <div className="recentNotesContainer">
                    <h2>My Notes</h2>
                    <SwipeableList>

                        <List
                            itemLayout="horizontal"
                            dataSource={uniqueRecentNotes}
                            renderItem={(note: CompleteNote) => (
                                <>
                                    <List.Item>
                                        <SwipeableListItem
                                            leadingActions={leadingActions()}
                                            trailingActions={trailingActions()}
                                            onSwipeEnd={async (dragDirection) => {
                                                if (dragDirection === 'left') {
                                                    await apiService.deleteCachedNote(note.id!, email, token)
                                                    dispatch(setRecentNotes(recentNotes.filter((recentNote) => recentNote.id !== note.id)))
                                                }
                                                if (dragDirection === 'right') {
                                                    // copy the note's content to clipboard and call the navigator share api to share the copied content to someone
                                                    navigator.clipboard.writeText(note.content);
                                                    if (navigator?.share) {
                                                        navigator.share({
                                                            title: 'Share Note',
                                                            text: note.content,
                                                            url: window.location.href
                                                        })
                                                    }
                                                }
                                            }}
                                        >
                                            <List.Item.Meta
                                                title={<NavLink
                                                    to={`/${ActiveRouteKey.CONTACTS}/${note.contactId}`}
                                                >{`${note.contact ? note.contact?.name : ""} `}</NavLink>}
                                                description={
                                                    <div>
                                                        <HTMLRenderer htmlContent={note.content} />
                                                        <div style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'flex-end',
                                                            fontSize: '0.8rem',
                                                            color: 'white',
                                                            fontStyle: 'italic'
                                                        }}>
                                                            <span>{timeFormatter(note.timestamp)}</span>
                                                            <span>{note.location ? note.location : ''}</span>
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        </SwipeableListItem>
                                    </List.Item>
                                    <hr style={{
                                        border: 'none',
                                        borderTop: '1px solid #4a4a4a',
                                        margin: '10px 0'
                                    }} />
                                </>
                            )}
                        />
                    </SwipeableList>
                </div>
            }
            {!(recentNotes.length > 0) &&
                <p
                    style={{
                        color: 'white',
                        margin: '0 2rem',
                        fontSize: '0.9rem'
                    }}>
                    Add a note using the chatbar below - Just type "@" to select a contact and then store something fun about them. Or, you could use the voice recorder to search up a contact and store a note.
                </p>
            }
        </div>
    )
}

export default RecentNotesList