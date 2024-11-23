import { useState } from 'react';
import { Modal, Form, Input, Button, DatePicker, message, Checkbox, CheckboxProps, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveData, setActivePlaybookId, setActiveVideoUrl, setIsModalOpen } from '@redux/features/activeEntitiesSlice';
import { ForwardFilled } from '@ant-design/icons';
import { RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import toast from 'react-hot-toast';
import { initialContactState, setContact } from '@redux/features/contactSlice';
import { useQuery } from 'react-query';
import { initialPlaybookState, setActivePlaybook } from '@redux/features/playbookSlice';
import { CompleteTemplate } from '@models/template.model';
import { VideoProcessingStatus } from '@models/video.model';
import { RecordType } from '@models/index';


const { TextArea } = Input;

const ReviewStructuredNoteModal = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { activeData: { structuredNote }, activePlaybookId } = useSelector((state: RootState) => state.activeEntities);
    const { email, token, name } = useSelector((state: RootState) => state.persisted.user.value);
    const [formValues, setFormValues] = useState(structuredNote);
    const [doSyncToSalesforce, setDoSyncToSalesforce] = useState(false);
    const [doSyncToHubspot, setDoSyncToHubspot] = useState(false);
    const [doSyncToSheet, setDoSyncToSheet] = useState(false);
    const [doSendEmail, setDoSendEmail] = useState(false);
    const spreadsheetId = useSelector((state: RootState) => state.persisted.user.value.spreadsheetId);
    // const [doCacheNote, setDoCacheNote] = useState(false);
    const contact = useSelector((state: RootState) => state.contact.value.activeContact);
    const activeVideo = useSelector((state: RootState) => state.video.activeVideo);
    const activeUploadTranscript = useSelector((state: RootState) => state.activeEntities.activeUploadTranscript)


    const onFinish = async (values: any) => {
        setLoading(true);
        const toastId = toast.loading('Syncing to everywhere you want...');
        try {
            // Here, make the API call to submit the updated values
            const createdDocument = await apiService.createDocument({
                documentTranscript: activeUploadTranscript,
                templateId: activePlaybookId,
                userId: email,
                contactId: contact.id,
                recordType:RecordType.DOCUMENT,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                videoId: activeVideo?._id || "",
            }, token)
            const editedFormValues = Object.entries(formValues).reduce((acc: any, [key, value]) => {
                // If the user has made an edit, then have it reflected here as an edited value from the formValues object, else, just use the fallback value from the "values" object 
                acc[capitalCaseToCamelCase(key)] = (value as any).action || values[key];
                return acc;
            }, {});

            await apiService.processStructuredNoteIntoDoc({
                structuredNote: editedFormValues,
                contactId: contact.id!,
                templateId: activePlaybookId,
                userId: email,
                filters: {
                    doSyncToSheet,
                    // doCacheNote
                },
                documentId: createdDocument._id,
                accessToken: token
            })
            console.log("activeVideo", activeVideo);
            await apiService.updateVideo(activeVideo._id!, { status: VideoProcessingStatus.COMPLETED }, token)

            // Syncing things to Google Sheet
            if (doSyncToSheet) {
                const template = await apiService.getTemplate(activePlaybookId, token);
                await apiService.addRows(
                    {
                        accessToken: token,
                        spreadsheetId: spreadsheetId!,
                        sheetTitle: template.name,
                        // iterate over "values" variable since it is an object and collect all the "value" of this object into an array
                        values: Object.values(values)
                    });
            }
            toast.success('Saved and synced, refresh the page to see changes!', { id: toastId })

            // // toast.success('Synced to CRM!', { id: toastId })
            // if (doSendEmail) {
            //     const toastId2 = toast.loading('Sending email...');
            //     await apiService.sendEmail({
            //         contact: contact,
            //         noteString: activeNote.content,
            //         token,
            //         senderIntro: `${name} is occupied as ${occupation} at ${organization_name}. ${biography} \n \n`

            //     });
            //     toast.success('Email sent!', { id: toastId2 })
            // }
            dispatch(setContact(initialContactState.value.activeContact))
            
        } catch (error: any) {
            // message.error('Error updating action');
            // toast.error(`We're very sorry AI was unable to process this note due to this error ${error.message} - take a screenshot of this and send to founders@recontact.world`, { id: toastId })
            // console.error(error);
        } finally {
            setLoading(false);
            dispatch(setActiveData({}));
            dispatch(setIsModalOpen(false));
            dispatch(setActivePlaybookId(""));
            dispatch(setActiveVideoUrl(""))
        }
    };

    const onCancel = () => {
        dispatch(setIsModalOpen(false));
    };

    // const handleChange = (changedFields: any, fieldEdited: string) => {
    //     setFormValues({ ...formValues, ...changedFields });
    //     pushEvent('UpdateStructureNoteProps', { fieldEdited });
    // }


    const handleChange = (valueOrEvent: any, key: string) => {
        // Determine if the argument is an event or a direct value
        const isEvent = valueOrEvent && valueOrEvent.target && typeof valueOrEvent.target === 'object';
        const value = isEvent ? valueOrEvent.target.value : valueOrEvent;

        const newFormValues = { ...formValues, [key]: value };
        setFormValues(newFormValues);
        pushEvent('UpdateStructureNoteProps', { key, newValue: value });
    };

    // function that converts camelCased strings into Capital case words separated by spaces. eg: "camelCase" becomes "Camel Case"
    function camelCaseToCapitalCase(input: string) {
        return input.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); });
    }

    // function that converts camelCased strings into Capital case words separated by spaces. eg: "camel case" becomes "camelCase"
    function capitalCaseToCamelCase(input: string) {
        return input.replace(/\W+(.)/g, function (match, chr) {
            return chr.toUpperCase();
        });
    }

    const renderFormItem = (key: string, value: string) => {
        // Example of identifying a date field. Customize as needed.
        const isDateField = key.toLowerCase().includes('date');
        if (isDateField) {
            return (
                <Form.Item label={key} name={key} key={key}>
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
            );
        } else {
            return (
                <Form.Item
                    // label={camelCaseToCapitalCase(key)}
                    name={key}
                    key={key}
                >
                    {/* <Input onChange={(e) => handleChange(
                        { action: e.target.value as string }, key)
                    }
                        defaultValue={value}
                    /> */}
                    <h4>{camelCaseToCapitalCase(key)}</h4>
                    <TextArea
                        rows={4}
                        placeholder={`Please enter value corresponding to ${camelCaseToCapitalCase(
                            key
                        )} here...`}
                        onChange={(e) =>
                            handleChange({ action: e.target.value as string }, key)
                        }
                        defaultValue={value}
                    />
                </Form.Item>
            );
        }
    };

    const handleSalesforceCheckboxChange: CheckboxProps['onChange'] = (e) => {
        setDoSyncToSalesforce(e.target.checked);
    };

    const handleHubspotCheckboxChange: CheckboxProps['onChange'] = (e) => {
        setDoSyncToHubspot(e.target.checked);
    }
    const handleSheetCheckboxChange: CheckboxProps['onChange'] = (e) => {
        setDoSyncToSheet(e.target.checked);
    }
    const handleSendEmailCheckboxChange: CheckboxProps['onChange'] = (e) => {
        setDoSendEmail(e.target.checked);
    }

    // const handleCacheNoteCheckboxChange: CheckboxProps['onChange'] = (e) => {
    //     setDoCacheNote(e.target.checked);
    // }

    const { isLoading } = useQuery({
        queryKey: ["getCompletePlaybook", activePlaybookId, email, token],
        queryFn: async ({ queryKey }) => {
            if (!queryKey[1]) return null;
            const response = await apiService.getFullTemplate(queryKey[1], queryKey[2]!, queryKey[3]!)
            // console.log(response);
            dispatch(setActivePlaybook(response as CompleteTemplate));
        },
    })
    const playbook = useSelector((state: RootState) => state.playbook.activePlaybook);

    return (
        <Modal
            title="Review AI Notes"
            visible={true}
            onCancel={onCancel}
            footer={
                <Button
                    type="primary"
                    loading={loading}
                    icon={<ForwardFilled />}
                    onClick={() => form.submit()}
                >
                    Submit
                </Button>
            }
        >
            {isLoading ? <Spin /> :
                <>
                    <h2>As per {playbook.name}</h2>
                    <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                        <Form form={form} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onFinish={onFinish} initialValues={formValues}>
                            {Object.entries(formValues).map(([key, value]) => renderFormItem(key, value as unknown as string))}
                        </Form>
                        {/* <Checkbox onChange={handleSalesforceCheckboxChange}>Sync To Salesforce</Checkbox>&nbsp; */}
                        {/* <Checkbox onChange={handleHubspotCheckboxChange}>Sync To Hubspot</Checkbox>&nbsp; */}
                        <Checkbox onChange={handleSheetCheckboxChange}>Sync To Sheet</Checkbox>&nbsp;
                        {/* <Checkbox onChange={handleSendEmailCheckboxChange}>Send Email</Checkbox>&nbsp; */}
                    </div>
                </>
            }
        </Modal>
    );
};

export default ReviewStructuredNoteModal;
