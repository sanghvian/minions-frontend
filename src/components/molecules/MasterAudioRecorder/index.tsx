import { CompleteContact, Contact } from '@models/contact.model';
import {
    BottomSheetType,
    SearchType,
    setActiveQueryString,
    setAudioNoteContent,
    setBottomSheetType,
    setHandleBottomSheetClose,
    setIsModalOpen, setIsBottomSheetOpen,
    setIsUploading,
    setSearchType,
} from "@redux/features/activeEntitiesSlice";
import { initialContactState, setContact } from '@redux/features/contactSlice';
import { AppDispatch, RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import { uploadAudioForTranscription } from '@utils/transcribeAudio';
import { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import AudioRecorder from '../AudioRecorder';
import apiService from '@utils/api/api-service';
import { RecordType } from '@models/index';
import { setRecentNotes } from '@redux/features/noteSlice';
import { setRecentActions } from '@redux/features/actionSlice';
import { extractNameFromNote } from '@utils/contactFuncs';
import { useLocation } from 'react-router-dom';

const MasterAudioRecorder = () => {
    // eslint-disable-next-line
    const [_, setLoading] = useState<boolean>(false);
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
    const recentNotes = useSelector((state: RootState) => state.note.value.recentNotes);
    const recentActions = useSelector((state: RootState) => state.action.value.recentActions);
    const { isUploading, activePlaybookId } = useSelector((state: RootState) => state.activeEntities);
    // Get current pathname in react app
    const location = useLocation();
    // Does location contain the word "contact" inside of it
    const isContactPage = location.pathname.includes('contact');

    const handleAIUpload = async (contact: Contact, query: string) => {
        if (!(contact.name && query.trim())) {
            return toast('Please select a contact and type something');
        }
        const toastId = toast.loading('Waving magic wand 🪄...');
        if (contact.name && query.trim()) {
            // Construct your note object here
            try {
                // Your API call to add the note
                const recentObject = await apiService.callFunction({
                    query: query.trim(),
                    contactId: contact?.id!,
                    userId: email,
                    token
                })
                toast.success('Done!', { id: toastId });
                switch (recentObject.recordType) {
                    case RecordType.NOTE:
                        dispatch(setRecentNotes([
                            ...recentNotes, {
                                ...recentObject,
                                // We set the contact property as well on the note, in redux so we can display name of contact on each note in recentNotes list
                                contacts: [contact]
                            }]));
                        break;
                    case RecordType.ACTION:
                        dispatch(setRecentActions([
                            ...recentActions, {
                                ...recentObject,
                                // We set the contact property as well on the note, in redux so we can display name of contact on each note in recentNotes list
                                contacts: [contact]
                            }]));
                        break;

                }
                toast.success(`Note added ${contact.name.length > 0 ? `for ${contact.name}` : ""}`, { id: toastId });
                pushEvent('AddNoteToContactFromChatbarVoice', { noteText: query, contact });
            } catch (error: any) {
                toast.error(error.message, { id: toastId });
            } finally {
                setLoading(false);
                dispatch(setActiveQueryString('')); // Clear the input after submitting
            }
        }
    }
    const dispatch: AppDispatch = useDispatch();
    const contact: CompleteContact = useSelector((state: RootState) => state.contact.value.activeContact);

    const handleAudioUpload = async (file: any) => {
        setLoading(true)
        const toastId = toast.loading('Transcribing...');
        const data: { text: string } = await uploadAudioForTranscription(file)
        toast.success('Transcribed!', { id: toastId });
        const query: string = data.text;
        const extractedName = await extractNameFromNote(query);
        dispatch(setActiveQueryString(extractedName));
        dispatch(setAudioNoteContent(query));
        setLoading(false);
        // If contact is already not selected, then we use the query content to open the existing search UI and results list, modal we already had, for selecting a contact, creating it and then adding the entire note. Else, we directly just add the note and the contact.
        // And then what we want to do, is to help the user find the contact get the contact in their own network, and select that, and that would be the selectedContact i.e. the active contact. And then we can just add the note to that contact.
        if (!contact.name) {
            dispatch(setIsBottomSheetOpen(true));
            dispatch(setIsModalOpen(false));
            dispatch(setBottomSheetType(BottomSheetType.PLAYBOOK_SEARCH));
            // if (isUploading && !activePlaybookId) {
            // } else {
            //     dispatch(setBottomSheetType(BottomSheetType.SEARCH_ADD));
            // }
            dispatch(setSearchType(SearchType.INTERNAL));
            dispatch(setHandleBottomSheetClose(async ({ contact, activeQueryString }: any) => {
                // So one way or another, basically, we always have an "active contact" set in the contactSlice before we call the handleUpload function to add the note to that contact.
                pushEvent('AddNoteToContactByVoice', { noteText: query, contact })
                try {
                    await handleAIUpload(contact, activeQueryString);
                } catch (error) {
                    toast.error('Error doing it');
                } finally {
                    dispatch(setActiveQueryString(''));
                    dispatch(setAudioNoteContent(''));
                    dispatch(setIsUploading(false))
                }
            }))
        }

    }

    return (
        <div onClick={() => {
            if (!isContactPage) {
                dispatch(setContact(initialContactState.value.activeContact)); // Clear the existing active contact cuz we are gonna select a new one
            }
        }}>
            <AudioRecorder handleAudioFile={handleAudioUpload} />
        </div>
    )
}

export default MasterAudioRecorder
