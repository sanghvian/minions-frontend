import { Button, Checkbox, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { CompleteContentBlock } from '@models/contentBlock.model';
import { CompleteTemplate, Template } from '@models/template.model';
import { addPlaybookToList, setActivePlaybook } from '@redux/features/playbookSlice';
import { RootState } from '@redux/store';
import apiService from '@utils/api/api-service';
import { setIsBottomSheetOpen, setIsModalOpen } from '@redux/features/activeEntitiesSlice';
import toast from 'react-hot-toast';
import { useEffect, useRef, useState } from 'react';
import PlaybookContentBlock from '@components/molecules/PlaybookContentBlock';
import { pushEvent } from '@utils/analytics';

export const toCamelCase = (str: string) => {
    // Split the string into words using a regular expression
    // The regex matches spaces and punctuation as word separators
    const words = str.match(/[a-z]+/gi);

    // Return an empty string if no words are found
    if (!words) return "";

    // Make the first word lowercase
    const firstWord = words[0].toLowerCase();

    // Capitalize the first letter of each remaining word and make the rest of the letters lowercase
    const capitalizedWords = words
        .slice(1)
        .map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase());

    // Combine the first word with the capitalized words
    return [firstWord, ...capitalizedWords].join('');
}

interface PlaybookFormValues {
    name: string;
    description: string;
    contentBlocks: {
        blockTitle: string;
        description: string;
        responseType: 'text' | 'number' | 'single-select' | 'multi-select';
        options?: { optionText: string }[]; // Array of optionTexts if the block is single or multi-select
    }[];
}
const AddPlaybookContainer: React.FC<{ setHandleSubmit?: any }> = ({ setHandleSubmit }) => {
    const [form] = Form.useForm();
    const { email: userId, token } = useSelector((state: RootState) => state.persisted.user.value);
    const dispatch = useDispatch();
    const activePlaybook = useSelector((state: RootState) => state.playbook.activePlaybook);
    const formRef = useRef(null); // Add this line
    const spreadsheetId = useSelector((state: RootState) => state.persisted.user.value.spreadsheetId);
    // Track the number of content blocks to trigger useEffect for scrolling
    const [contentBlocksCount, setContentBlocksCount] = useState(0);
    const [doCreateTab, setDoCreateTab] = useState(false);

    const handleCreateTabCheckboxChange = (e: any) => {
        setDoCreateTab(e.target.checked);
    };

    // Scroll to the bottom of the modal when the number of contentBlocks changes
    useEffect(() => {
        setTimeout(() => {
            const modalBody = document.querySelector('#add_playbook_form');
            if (modalBody) {
                modalBody.scrollTop = modalBody.scrollHeight;
            }
        }, 0); // A timeout of 0 ensures this runs after React's DOM updates
    }, [contentBlocksCount]);


    useEffect(() => {
        const initialValues = {
            name: activePlaybook.name,
            description: activePlaybook.description,
            contentBlocks: activePlaybook.contentBlocks?.map(block => ({
                ...block,
                options: block.optionIds?.map(option => ({
                    optionText: option.optionText
                }))
            }))
        };

        form.setFieldsValue(initialValues);

        if (setHandleSubmit) {
            setHandleSubmit(() => form.submit);
        }
    }, [form, activePlaybook, setHandleSubmit]);



    const onFinish = async (values: PlaybookFormValues) => {
        const formattedContentBlocks = values.contentBlocks.map((block: {
            blockTitle: string,
            description: string,
            options?: { optionText: string }[],
            responseType: 'text' | 'number' | 'single-select' | 'multi-select'
        }, i: number) => {
            const contentBlock: CompleteContentBlock = {
                templateId: '',
                blockTitle: block.blockTitle,
                description: block.description,
                // Block key basically just takes the block title string, and camelcases all the words in it. For eg: "Block Title" becomes "blockTitle". "Name of the company" becomes "nameOfTheCompany"
                blockKey: toCamelCase(block.blockTitle),
                // We pass in an array of Option objects with the content block itself and let the backend actually create the option and link it to the contentBlock as that is a much smoother flow as opposed to us creating the contentBlock first and then creating the options and linking them to the contentBlock
                options: block.options && block.options.length > 0 ? block.options.map((op, i) => {
                    return {
                        _id: '',
                        contentBlockId: '',
                        optionText: op.optionText,
                        order: i
                    }
                }) : [],
                order: i,
                userId,
                responseType: block.responseType,
            };
            return contentBlock
        });

        const blockTitles = formattedContentBlocks.map(block => block.blockTitle);

        try {
            const toastId = toast.loading('Processing Playbook...');

            const template: Template = {
                ...values,
                userId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            if (!(activePlaybook._id)) {
                const createdTemplate = await apiService.createTemplate(template, token);
                // Once we have a createdTemplate, we can use the _id to create the contentBlocks
                // const contentBlocks = await Promise.all(formattedContentBlocks.map(async (block) => {
                //     const createdBlock = await apiService.createContentBlock({ ...block, templateId: createdTemplate._id }, token);
                //     return createdBlock;
                // }));
                if (doCreateTab) {
                    const toastId = toast.loading('Creating tab in google sheet...');
                    try {
                        const newTab = await apiService.createTab(
                            {
                                title: template.name,
                                accessToken: token,
                                spreadsheetId: spreadsheetId!
                            });

                        await apiService.addRows(
                            {
                                accessToken: token,
                                spreadsheetId: spreadsheetId!,
                                sheetTitle: newTab.replies[0].addSheet.properties.title,
                                values: blockTitles
                            });
                        toast.success('Tab created in google sheet!', { id: toastId });
                    } catch (error: any) {
                        toast.error(`Failed to create tab in google sheet due to ${error.message}. Please try again or reach out to ankit@recontact.world`);
                    }
                }

                const contentBlocks = await Promise.all(formattedContentBlocks.map(async (block) => {
                    const createdBlock = await apiService.createContentBlock({ ...block, templateId: createdTemplate._id }, token);

                    return createdBlock;
                }));
                const completeTemplate: CompleteTemplate = {
                    ...createdTemplate,
                    contentBlocks
                };
                dispatch(addPlaybookToList(completeTemplate));
                toast.success('Playbook created!', { id: toastId });
            } else {
                const updatedTemplate = await apiService.updateTemplate(activePlaybook._id, template, token);
                dispatch(setActivePlaybook(updatedTemplate));
                toast.success('Playbook updated!', { id: toastId });
            }

            // Reset form fields after submission
            form.resetFields();
            pushEvent('PlaybookCreated', { email: userId })
        } catch (error: any) {
            toast.error(`Failed to create playbook due to ${error.message}. Please try again`);
        } finally {
            dispatch(setIsBottomSheetOpen(false));
            dispatch(setIsModalOpen(false));

        }
    };

    return (
        <Form
            form={form}
            name="add_playbook_form"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                gap: '12px',
                maxHeight: '500px',
                overflowY: 'scroll',
            }} // Set the ref here
        >
            <Form.Item
                name="name"
                label="Playbook Name"
                rules={[{ required: true, message: 'Please input the name of the Playbook!' }]}
            >
                <Input
                    placeholder="eg: Customer Discovery Call"
                // defaultValue={activePlaybook.name}
                />
            </Form.Item>
            <Form.Item
                name="description"
                label="Playbook Description"
                rules={[{ required: true, message: 'Please input the description of the Playbook!' }]}
            >
                <Input.TextArea
                    // defaultValue={activePlaybook.description}
                    placeholder="eg: Conversation with a customer to understand what their pain points are and understand how we can provide our solution"
                />
            </Form.Item>
            <Form.List name="contentBlocks">
                {(fields, { add, remove }) => {
                    return (
                        <>
                            <h4 style={{ margin: 0 }}>Fields to capture</h4>
                            {fields.map((field, index) => (
                                // <Space key={field.key} style={{ display: 'flex', marginBottom: 10 }} a ̑lign="baseline">
                                <PlaybookContentBlock
                                    field={field}
                                    form={form}
                                    index={index}
                                    remove={remove}
                                />
                                // </Space>
                            ))}
                            <br />
                            <Form.Item>
                                <Button type="dashed" onClick={() => {
                                    add()
                                    setContentBlocksCount(fields.length + 1);
                                }} block icon={<PlusOutlined />}>
                                    Add a Question
                                </Button>
                            </Form.Item>
                        </>
                    )
                }
                }
            </Form.List>
            {spreadsheetId && spreadsheetId?.length > 0 && <Checkbox onChange={handleCreateTabCheckboxChange}>Create new tab in google sheet</Checkbox>}
            <div ref={formRef}></div>
        </Form>
    );
};

export default AddPlaybookContainer;
