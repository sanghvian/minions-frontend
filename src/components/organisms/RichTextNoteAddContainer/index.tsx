import { ForwardOutlined } from '@ant-design/icons';
import { CompleteContact, Contact } from '@models/contact.model';
import { RecordType } from '@models/index';
import { Note } from '@models/note.model';
import { initialContactState } from '@redux/features/contactSlice';
import { setRecentNotes } from '@redux/features/noteSlice';
import { AppDispatch, RootState } from '@redux/store';
import apiService from '@utils/api/api-service';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import './RichTextNoteAddContainer.css';
import { useDispatch, useSelector } from 'react-redux';
import { BottomSheetType, SearchType, setActiveQueryString, setActiveUploadTranscript, setAudioNoteContent, setBottomSheetType, setHandleModalClose, setIsBottomSheetOpen, setIsModalOpen, setSearchType } from '@redux/features/activeEntitiesSlice';
import { pushEvent } from '@utils/analytics';

const RichTextNoteAddContainer: React.FC<{ setHandleSubmit?: any }> = ({ setHandleSubmit }) => {
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
    const dispatch: AppDispatch = useDispatch();
    const recentNotes = useSelector((state: RootState) => state.note.value.recentNotes);
    // const [selectedContact, setSelectedContact] = useState<CompleteContact>(initialContactState.value.activeContact)
    const selectedContact = initialContactState.value.activeContact;
    const [loading, setLoading] = useState<boolean>(false);
    // const [contacts, setContacts] = useState<Contact[]>([]);
    // const [isContactSearchMode, setIsContactSearchMode] = useState<boolean>(false);
    // const inputRef = React.useRef(null);
    const audioNoteContent = useSelector((state: RootState) => state.activeEntities.audioNoteContent);
    const [content, setContent] = useState(audioNoteContent);

    // Load contacts from your database or API
    // const loadContacts = async (searchText: string) => {
    //     setLoading(true);
    //     try {
    //         const contacts = await apiService.searchContact(searchText, email, token);
    //         setContacts(contacts);
    //     } catch (error: any) {
    //         toast.error(error.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // Function to handle input changes
    const onInputChange = (value: string) => {
        setContent(value);

        // Check if search mode should be activated
        // if (value.endsWith('@</p>')) {
        //     setIsContactSearchMode(true);
        // }

        // // If search mode is active, filter the contacts
        // if (isContactSearchMode && value.length > 0) {
        //     const searchQuery = value.slice(value.lastIndexOf('@') + 1);
        //     loadContacts(searchQuery);
        // }
    };

    // Render the contact as a tag when selected
    // const renderSelectedContact = () => {
    //     if (selectedContact.name) {
    //         return (
    //             <Tag color="blue" closable onClose={() => setSelectedContact(initialContactState.value.activeContact)}>
    //                 {selectedContact.name}
    //             </Tag>
    //         );
    //     }
    //     return null;
    // };

    // const onSelectContact = (option: Contact) => {
    //     const contact = contacts.find(c => c.id === option.id);
    //     // setSelectedContact(contact || null);
    //     setSelectedContact(contact || initialContactState.value.activeContact);
    //     setIsContactSearchMode(false);

    //     // Remove the search query and replace it with the contact name as a tag
    //     const newValue = content.slice(0, content.lastIndexOf('@'));
    //     setContent(newValue);


    //     // Focus back on the inputRef so a new query can be started
    //     if (inputRef.current) {
    //         (inputRef.current as any)?.focus();

    //         // Once the contact is selected, clear the value in the inputRef
    //         (inputRef.current as any).value = "";
    //     }
    // };

    const handleAddNote = async () => {
        if (!(selectedContact.name && content.trim())) {
            toast('Please select a contact you want to add this note to');
            dispatch(setActiveUploadTranscript(content))
            dispatch(setActiveQueryString(''));
            dispatch(setAudioNoteContent(content));
            setLoading(false);
            // If contact is already not selected, then we use the query content to open the existing search UI and results list, modal we already had, for selecting a contact, creating it and then adding the entire note. Else, we directly just add the note and the contact.
            // And then what we want to do, is to help the user find the contact get the contact in their own network, and select that, and that would be the selectedContact i.e. the active contact. And then we can just add the note to that contact.
            if (!selectedContact.name) {
                // dispatch(setIsModalOpen(true));
                // dispatch(setModalType(ActiveModalType.ONLINE_SEARCH_MODAL));
                dispatch(setIsBottomSheetOpen(true));
                dispatch(setBottomSheetType(BottomSheetType.SEARCH_ADD));
                dispatch(setSearchType(SearchType.INTERNAL));
                dispatch(setHandleModalClose(async ({ contact, activeQueryString }: any) => {
                    // So one way or another, basically, we always have an "active contact" set in the contactSlice before we call the handleUpload function to add the note to that contact.
                    pushEvent('AddRichTextNoteBeforeContact', { noteText: content, contact })
                    try {
                        await createNoteWithContact(contact, activeQueryString);
                    } catch (error) {
                        toast.error('Error doing it');
                    } finally {
                        dispatch(setActiveQueryString(''));
                    }
                }))
            }
        }
        else createNoteWithContact(selectedContact, content);
    }



    useEffect(() => {
        // Set the handleSubmit function only in the case when the component is being asked to set this value, which is basically happening when we consume this component inside of a Modal
        if (setHandleSubmit) {
            setHandleSubmit(handleAddNote)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setHandleSubmit])

    const createNoteWithContact = async (contact: CompleteContact, content: string) => {
        const toastId = toast.loading('Adding note...');
        try {
            const note: Note = {
                content,
                contactId: contact?.id!,
                location: contact?.location || "",
                timestamp: new Date().toISOString(),
                recordType: RecordType.NOTE
            }
            const createdNote = await apiService.createNote(note, true, email, token);
            dispatch(setRecentNotes([
                ...recentNotes, {
                    ...createdNote,
                    // We set the contact property as well on the note, in redux so we can display name of contact on each note in recentNotes list
                    contacts: [contact]
                }]));
            setContent('');
            dispatch(setIsModalOpen(false));
            // For the flow where we are on the contactPage and we want to add an note, we just take the activeContact that is passed to the MasterAIChatBar component as a presetContact and add notes to it.But this happens only for the contactPage and so we check if the presetContact has a name, then we add the action to it.
            toast.success(`Note added ${contact.name.length > 0 ? `for ${contact.name}` : ""}`, { id: toastId });
            pushEvent('AddRichTextNoteAfterContact', { noteText: content, contact })
        } catch (error) {
            // Handle error
            toast.error(`Error adding note for ${selectedContact.name}`, { id: toastId });
        }
    }

    return (
        <div>
            {/* {renderSelectedContact()} */}
            <div className="addRichTextNoteButtonWrapper">
                <Button
                    loading={loading}
                    disabled={!content}
                    icon={<ForwardOutlined />} key="search" type="primary"
                    onClick={handleAddNote}
                >
                    Submit transcript
                </Button>
                <br />
            </div>
            <ReactQuill
                value={content}
                onChange={onInputChange}
            />
            <br />
            {/* {isContactSearchMode ? loading ? <Spin /> :
                <div className='richTextNotePopupContainer'>
                    {
                        contacts.map(contact => (
                            <div
                                key={contact.id}
                                onClick={() => onSelectContact(contact)}
                                style={{ cursor: 'pointer' }}
                            >
                                {contact.name}
                            </div>
                        ))}
                </div> : <p></p>
            } */}

        </div>
    )
}

export default RichTextNoteAddContainer
