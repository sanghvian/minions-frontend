import { SendOutlined } from '@ant-design/icons';
import ActionsList from '@components/molecules/ActionsList';
import AudioRecorder from '@components/molecules/AudioRecorder';
import { Action } from '@models/action.model';
import { CompleteContact } from '@models/contact.model';
import { RecordType } from '@models/index';
import { setActiveActions, setSuggestedActions } from '@redux/features/actionSlice';
import { ActiveModalType, setActiveQueryString, setIsModalOpen, setModalType } from '@redux/features/activeEntitiesSlice';
import { setContact } from '@redux/features/contactSlice';
import { AppDispatch } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import { uploadAudioForTranscription } from '@utils/transcribeAudio';
import { Button, Card, Form, Input } from 'antd';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import './RelationshipInputContainer.css'
import { Relationship } from '@models/relationship.model';

const RelationshipContainer: React.FC<{ contact: CompleteContact }> = ({ contact }) => {
    const [noteMessage, setNoteMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { email, token, calendarId } = useSelector((state: any) => state.persisted.user.value);
    const [form] = Form.useForm();
    const dispatch: AppDispatch = useDispatch();

    const handleSuggestActions = async () => {
        const startTime = new Date().getTime();
        pushEvent('StartCreateRitual', { suggestedActions: contact?.actions })
        setLoading(true);
        const toastId = toast.loading("Suggesting cool ways to keep in touch, takes about half a minute");
        const suggestedActions = await apiService.createRelationshipPlan(contact?.relationshipId!, email, token);
        // FLOW SEPARATING OUT FOR SUGGESTIVE RAP
        // const suggestedActions = suggestedActionsDummy;
        const aiSuggestedActions = suggestedActions.actions.map((action: { event: string, date: string, action: string }) => {
            const actionObj = {
                // Can do away with empty id as this action will get created on the aPI and on the createAction api anyways we have a fresh uuidv4() id generated and this won't be used
                id: v4(),
                event: action.event,
                recordType: RecordType.ACTION,
                // date is a string in YYYY-MM-DD format
                timestamp: action.date,
                action: action.action,
                actionLink: "",
                relationshipId: contact.relationshipId!
            };
            return actionObj;
        });
        const endTime = new Date().getTime();
        pushEvent('RitualActionsSuggestedByAI', { suggestedActions: suggestedActions.actions, responseTime: (endTime - startTime) / 1000 })
        // We set both, actions and suggestedActions with these values because we want to store and eventually pass the suggestedActions to the backend, but we also want to use these suggestions as a starting point that will get edited over time.
        dispatch(setActiveActions(aiSuggestedActions))
        dispatch(setSuggestedActions(aiSuggestedActions))
        dispatch(setIsModalOpen(true));
        dispatch(setModalType(ActiveModalType.EDIT_SUGGESTED_ACTIONS))
        setLoading(false);
        toast.success("Suggested a couple actions", { id: toastId });

    }


    const handleDeleteAction = async (action: Action) => {
        const toastId = toast.loading('Deleting action...');
        const startTime = new Date().getTime();
        try {
            const endTime = new Date().getTime();
            pushEvent('DeleteActionCompleted', { responseTime: (endTime - startTime) / 1000 });
            await apiService.deleteAction(action.id!, email, {
                eventId: action.gcalEventId!,
                refreshToken: token,
                calendarId
            }, token);
            toast.success('Action Updated!', { id: toastId })
            // Update the actions array in the contact slice of the store, removing the deleted action
            const updatedActions = contact.actions?.filter((n: Action) => n.id !== action.id);
            const updatedContact = { ...contact, actions: updatedActions }
            dispatch(setContact(updatedContact));
        } catch (error) {
            // Handle error
            toast.error('Error deleting action', { id: toastId });
            console.error(error);
        }
    }
    const handleUpload = async (message: string) => {
        dispatch(setActiveQueryString(message));
        const toastId = toast.loading('Saving relation...');
        const rship: Relationship = {
            userId: email,
            contactId: contact?.id!,
            relationshipContext: message,
            recordType: RecordType.RELATIONSHIP
        }
        let relation;
        if (contact?.relationship?.id) {
            const relationshipId = contact?.relationship?.id;
            rship["id"] = contact?.relationship?.id;
            relation = await apiService.updateRelationship(relationshipId, rship, email, token);
        } else {
            relation = await apiService.createRelationship(rship, email, token);
        }
        toast.success('Relation saved!', { id: toastId })
        pushEvent("RitualCreated", { message: noteMessage })
        dispatch(setContact({ ...contact, relationship: relation, relationshipId: relation.id }));
    }

    const handleFinish = async () => {
        await handleUpload(noteMessage);
        setNoteMessage("");
    }



    const handleAudioUpload = async (file: any) => {
        setLoading(true);
        const startTime = new Date().getTime();
        const data: { text: string } = await uploadAudioForTranscription(file)
        const query: string = data.text;
        await handleUpload(query);
        setLoading(false);
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000; // duration in seconds
        pushEvent("CreateRshipByVoice", {
            // recordingDuration: recorderControls.recordingTime,
            responseTime: duration
        })
        setNoteMessage("");
        // dispatch(setActiveQueryString(""));
    }

    return (
        <>
            {contact?.relationship?.relationshipContext
                &&
                <Card>{contact?.relationship?.relationshipContext}</Card>
            }
            <>
                <div className={`relationshipInputContainer`}>
                    <Form form={form} style={{ width: '100%' }} onFinish={handleFinish}>
                        <Form.Item >
                            <Input
                                placeholder={'Create a ritual, for eg: "connect every monday"'}
                                value={noteMessage}
                                onChange={(e) => {
                                    setNoteMessage(e.target.value);
                                }}
                            />
                        </Form.Item>
                    </Form>
                    <Button
                        icon={<SendOutlined />}
                        type="primary"
                        style={{ height: '100%' }}
                        loading={loading}
                        onClick={async () => {
                            if (noteMessage.length === 0) {
                                return toast('Kindly enter something before submitting!')
                            }
                            await handleUpload(noteMessage);
                            setNoteMessage("");
                        }
                        }
                    />
                    <AudioRecorder handleAudioFile={handleAudioUpload} />
                </div>
                <h4>Todos to stay in touch</h4>
                <p>Add a simple note on what you want this relationship to be like.</p>
            </>
            {contact?.relationshipId! && <Button
                type="primary"
                loading={loading}
                onClick={() => {
                    handleSuggestActions()
                }}
            >Suggest Actions</Button>}
            {contact.actions?.length! > 0 &&
                <ActionsList
                    handleEditAction={() => {
                        dispatch(setIsModalOpen(true));
                        dispatch(setModalType(ActiveModalType.ACTION_MODAL))
                    }}
                    handleDeleteAction={handleDeleteAction}
                    actions={contact.actions!}
                />
            }
        </>
    )
}

export default RelationshipContainer
