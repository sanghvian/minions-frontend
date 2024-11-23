import { DeleteFilled, EditOutlined } from '@ant-design/icons';
import HTMLRenderer from '@components/atoms/HTMLRenderer';
import { CompleteContact } from '@models/contact.model';
import { Note } from '@models/note.model';
import { ActiveModalType, setIsModalOpen, setModalType } from '@redux/features/activeEntitiesSlice';
import { setContact } from '@redux/features/contactSlice';
import { setActiveNote, setRecentNotes } from '@redux/features/noteSlice';
import { AppDispatch, RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import { Button, List } from 'antd';
import { compareDesc, format, parseISO } from 'date-fns';
import React from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const NotesList: React.FC<{ notes: Note[] }> = ({ notes }) => {
    const dispatch: AppDispatch = useDispatch();
    const contact: CompleteContact = useSelector((state: RootState) => state.contact.value.activeContact!);
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
    const sortedNotes = [...notes].sort((a: Note, b: Note) =>
        compareDesc(parseISO(a.timestamp), parseISO(b.timestamp))
    );
    const recentNotes = useSelector((state: RootState) => state.note.value.recentNotes);

    const handleDelete = async (note: Note) => {
        const toastId = toast.loading('Deleting note...');
        const startTime = new Date().getTime();
        try {
            const endTime = new Date().getTime();
            pushEvent('DeleteNoteCompleted', { responseTime: (endTime - startTime) / 1000 });
            await apiService.deleteNote(note.id!, email, token);
            toast.success('Note Updated!', { id: toastId })
            // Update the notes array in the contact slice of the store, removing the deleted note
            const updatedNotes = contact.notes?.filter((n: Note) => n.id !== note.id);
            const updatedNoteIds = contact.noteIds?.filter((id: string) => id !== note.id);
            const updatedContact = { ...contact, notes: updatedNotes, noteIds: updatedNoteIds }
            const recentUpdatedNotes = recentNotes?.filter((n: Note) => n.id !== note.id);
            dispatch(setRecentNotes(recentUpdatedNotes));
            dispatch(setContact(updatedContact));
        } catch (error) {
            // Handle error
            toast.error('Error deleting note', { id: toastId });
            console.error(error);
        }
    }

    return (
        <List
            dataSource={sortedNotes}
            renderItem={(note: Note) => (
                <List.Item
                    actions={[
                        <Button
                            key="list-loadmore-delete"
                            onClick={() => handleDelete(note)}
                            icon={<DeleteFilled />}
                        />,
                        <Button
                            key="list-loadmore-edit"
                            onClick={async () => {
                                dispatch(setActiveNote(note));
                                dispatch(setIsModalOpen(true));
                                dispatch(setModalType(ActiveModalType.NOTE_MODAL))
                            }}
                            icon={<EditOutlined />}
                        />

                    ]
                    }
                    key={note.id}>
                    {/* <List.Item.Meta
                        title={note.content}
                        description={`Location: ${note.location} - Timestamp: ${format(new Date(note.timestamp), 'dd MMM yyyy')}`}
                    /> */}
                    <List.Item.Meta
                        title={`${format(new Date(note.timestamp), 'dd MMM yyyy')}, ${note.location ? note.location : ''}`}
                        description={<HTMLRenderer htmlContent={note.content} />}
                    />
                </List.Item>
            )}
        />
    )
}

export default NotesList
