import { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { setIsModalOpen } from '@redux/features/activeEntitiesSlice';
import { ForwardFilled } from '@ant-design/icons';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import { Note } from '@models/note.model';
import { initialNoteState, setActiveNote } from '@redux/features/noteSlice';
import toast from 'react-hot-toast';
import { CompleteContact } from '@models/contact.model';
import { setContact } from '@redux/features/contactSlice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles

const EditNoteModal = () => {
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
    const [form] = Form.useForm();
    const note: Note = useSelector((state: RootState) => state.note.value.activeNote!)
    const contact: CompleteContact = useSelector((state: RootState) => state.contact.value.activeContact!)
    const dispatch: AppDispatch = useDispatch();
    const [currentNote, setCurrentNote] = useState<Note>(note!)
    const onFinish = async () => {
        const startTime = new Date().getTime();
        const toastId = toast.loading('Saving note...');
        try {
            await apiService.updateNote(currentNote.id!, currentNote, email!, token);
            const endTime = new Date().getTime();
            pushEvent('EditNoteCompleted', { responseTime: (endTime - startTime) / 1000 });
            toast.success('Note Updated!', { id: toastId })
            // Update the note in the store, in the notes array of the contact
            const updatedContact = { ...contact, notes: contact.notes?.map(note => note.id === currentNote.id ? currentNote : note) }
            dispatch(setContact(updatedContact));
        } catch (error) {
            // Handle error
            toast.error('Error updating note', { id: toastId });
            console.error(error);
        } finally {
            dispatch(setActiveNote(initialNoteState.value.activeNote!));
            dispatch(setIsModalOpen(false));
            form.resetFields();
        }
    };

    const handleChange = (changedFields: Partial<Note>, fieldEdited: "content" | "location") => {
        setCurrentNote({ ...currentNote, ...changedFields });
        pushEvent('UpdateNoteProperties', { fieldEdited });
    }

    const onCancel = () => {
        dispatch(setIsModalOpen(false));
    }

    return (
        <Modal
            title="Edit Note"
            visible={true}
            onCancel={onCancel}
            footer={
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<ForwardFilled />}
                    onClick={() => form.submit()}
                >
                    Submit
                </Button>
            }
        >
            <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                <Form form={form} onFinish={onFinish}>
                    <Form.Item label="Content">
                        {/* <Input onChange={(e) => handleChange(
                            { content: e.target.value as string }, "content")
                        }
                            defaultValue={currentNote.content}
                        /> */}
                        <ReactQuill value={currentNote.content} onChange={(value: string) => {
                            handleChange({ content: value }, "content")
                        }} />

                    </Form.Item>
                    <Form.Item label="Location">
                        <Input onChange={(e) => handleChange(
                            { location: e.target.value as string }, "location")
                        }
                            defaultValue={currentNote.location}
                        />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default EditNoteModal;
