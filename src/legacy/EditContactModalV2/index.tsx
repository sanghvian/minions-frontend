import { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { CompleteContact, Contact } from '@models/contact.model';
import { ActiveModalType, setActiveQueryString, setIsModalOpen, setModalType } from '@redux/features/activeEntitiesSlice';
import { TextArea } from 'antd-mobile';
import { ForwardFilled, SearchOutlined } from '@ant-design/icons';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import { setContact } from '@redux/features/contactSlice';
import { addContactToList } from '@redux/features/contactsListSlice';
import toast from 'react-hot-toast';

const extractKeywordsFromContact = (contact: Contact): string[] => {
    // Extract necessary information if exists, else provide an empty string as a default
    const givenName = contact.name || "";
    const occupationValue = contact.occupation || "";
    const organizationName = contact.organization_name || "";
    // Combine the extracted information into a query string, separated by "%20"
    const keywordsArray = [givenName, occupationValue, organizationName]

    return keywordsArray;
};

const EditContactModalV2 = () => {
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
    const [form] = Form.useForm();
    const contact: CompleteContact = useSelector((state: RootState) => state.contact.value.activeContact!)
    const dispatch: AppDispatch = useDispatch();
    const [currentContact, setCurrentContact] = useState<CompleteContact>(contact!)
    const onFinish = async () => {
        const startTime = new Date().getTime();
        try {
            const toastId = toast.loading('Saving contact...');
            const finalContact = { ...currentContact }
            // Code to drop the "relationship" field on the Contact as the "Pinecone" record won't take an object as a field
            delete finalContact?.relationship;
            delete finalContact?.notes;
            delete finalContact?.actions;
            delete finalContact?.linkedinContact
            const updatedContact = await apiService.updateContact(finalContact.id!, finalContact, email!, token);
            const endTime = new Date().getTime();
            pushEvent('EditContactCompleted', { responseTime: (endTime - startTime) / 1000 });
            dispatch(setContact({ ...updatedContact, notes: contact.notes, noteIds: contact.noteIds, actions: contact.actions }))
            dispatch(addContactToList(updatedContact));
            dispatch(setIsModalOpen(false));
            toast.success('Contact saved!', { id: toastId });
            dispatch(setActiveQueryString(''))
            form.resetFields();
        } catch (error) {
            // Handle error
            console.error(error);
        }
    };

    const handleChange = (changedFields: Partial<Contact>, fieldEdited: "name" | "email" | "biography" | "phone" | "organization_name" | "occupation") => {
        setCurrentContact({ ...currentContact, ...changedFields });
        pushEvent('EditContact', { fieldEdited });
    }

    const onCancel = () => {
        dispatch(setIsModalOpen(false));
    }

    const handleSearchOnline = () => {
        const keywordsArray = extractKeywordsFromContact(currentContact);
        dispatch(setActiveQueryString(keywordsArray.join(" ")));
        dispatch(setModalType(ActiveModalType.ONLINE_SEARCH_MODAL));
    }

    return (
        <Modal
            title="Edit Contact"
            visible={true}
            onCancel={onCancel}
            footer={<>
                <Button
                    danger={true}
                    style={{
                        marginLeft: '1rem'
                    }}
                    icon={<SearchOutlined />}
                    type="primary"
                    onClick={handleSearchOnline}
                >
                    Search Online
                </Button>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<ForwardFilled />}
                    onClick={
                        () => form.submit()
                    }
                >
                    Submit
                </Button>

            </>}
        >
            <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                <Form form={form} onFinish={onFinish}>
                    <Form.Item label="Given Name">
                        <Input onChange={(e) => handleChange(
                            { name: e.target.value as string }, "name")
                        }
                            defaultValue={currentContact.name}
                        />
                    </Form.Item>
                    <Form.Item label="Occupation">
                        <Input onChange={(e) => handleChange(
                            { occupation: e.target.value as string }, "occupation")}
                            defaultValue={currentContact.occupation}
                        />
                    </Form.Item>
                    <Form.Item label="Company">
                        <Input onChange={(e) => handleChange(
                            { organization_name: e.target.value as string }, "organization_name")}
                            defaultValue={currentContact.organization_name}
                        />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input type="email" onChange={(e) =>
                            handleChange(
                                { email: e.target.value as string }, "email")
                        }
                            defaultValue={currentContact.email}
                        />
                    </Form.Item>
                    <Form.Item label="Phone Number">
                        <Input onChange={(e) =>
                            handleChange(
                                { phone: e.target.value }, "phone")
                        }
                            defaultValue={currentContact.phone}
                        />
                    </Form.Item>
                    <Form.Item label="Bio">
                        <TextArea rows={6} onChange={(value) =>
                            handleChange(
                                { biography: value as string }, "biography")
                        }
                            defaultValue={currentContact.biography}
                        />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default EditContactModalV2;
