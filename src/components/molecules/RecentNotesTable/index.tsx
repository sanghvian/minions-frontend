import HTMLRenderer from '@components/atoms/HTMLRenderer';
import { CompleteNote, Note } from '@models/note.model';
import { ActiveRouteKey } from '@redux/features/activeEntitiesSlice';
import { setRecentNotes } from '@redux/features/noteSlice';
import { AppDispatch, RootState } from '@redux/store';
import apiService from '@utils/api/api-service';
import { Button, Space, Spin, Table, TableProps } from 'antd';
import { format, isValid } from 'date-fns';
import React from 'react'
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

// Date formatter function that takes in a timestamp in ISO string format and returns a string of the form "6:02PM, 18th June 2021" using the `format` function from the `date-fns` library
const timeFormatter = (timestamp: string) => {
    const date = new Date(timestamp);

    // Check if the date is valid
    if (!isValid(date)) {
        return '';
    }

    const formattedDate = format(date, 'h:mma, do MMM yyyy');
    return formattedDate;
};

const RecentNotesTable = () => {
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

    const handleDelete = async (note: Note) => {
        await apiService.deleteCachedNote(note.id!, email, token)
        dispatch(setRecentNotes(recentNotes.filter((recentNote) => recentNote.id !== note.id)))
    }

    const columns: TableProps<CompleteNote>['columns'] = [
        {
            title: 'Contact',
            dataIndex: 'contactName',
            key: 'contactName',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Time',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (ts) => <p>{timeFormatter(ts)}</p>,
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            render: (content) => <HTMLRenderer htmlContent={content.length > 750 ? content.substring(0, 750) + "..." : content} />,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleDelete(record as CompleteNote
                    )} >Clear</Button>
                    <a href={`/${ActiveRouteKey.CONTACTS}/${record.contact!.id}`} >View</a>
                </Space>
            ),
        },
    ];


    // Some notes inside recentNotes might be repeated so let's just get unique notes by comparing on note id
    const uniqueRecentNotes = recentNotes?.filter((note, index, self) =>
        index === self.findIndex((t) => (
            t.id === note.id
        ))
    ).sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    });

    const uniqueRecentNotesWithContact = uniqueRecentNotes.map((note) => {
        return {
            ...note,
            contactName: note.contact!.name
        }
    })

    return (
        isLoading ? <Spin /> : <div>
            {uniqueRecentNotesWithContact.length > 0 &&
                <div className="recentNotesContainer">
                    <h2>My Notes</h2>
                    <Table dataSource={uniqueRecentNotesWithContact} columns={columns} />
                </div>
            }
            {!(recentNotes.length > 0) &&
                <p
                    style={{
                        margin: '0 2rem',
                        fontSize: '0.9rem'
                    }}>
                    Add a note using the chatbar below - Just type "@" to select a contact and then store something fun about them. Or, you could use the voice recorder to search up a contact and store a note.
                </p>
            }
        </div>
    )
}

export default RecentNotesTable
