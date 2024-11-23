import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Modal } from 'antd';
import { ActiveModalType, setIsModalOpen } from '@redux/features/activeEntitiesSlice';
import { RootState } from '@redux/store';
import apiService from '@utils/api/api-service';
import { setUser } from '@redux/features/userSlice';
import toast from 'react-hot-toast';
import { pushEvent } from '@utils/analytics';
import { TextArea } from 'antd-mobile';
import { setTopicTags, updateContentResponseInTopic } from '@redux/features/topicSlice';
import { Tag } from '@models/tag.model';

const AddEditTagModal = () => {
    const { isModalOpen, modalType } = useSelector((state: RootState) => state.activeEntities);
    const isVisible = isModalOpen && (modalType === ActiveModalType.ADD_TAG || modalType === ActiveModalType.EDIT_TAG);
    const dispatch = useDispatch();
    const { email, token, id } = useSelector((state: RootState) => state.persisted.user.value);
    const { activeContentBlockId, activeData } = useSelector((state: RootState) => state.activeEntities);
    const topicTags = useSelector((state: RootState) => state.topic.activeTopic.tags) || [];
    const activeContentResponse = useSelector((state: RootState) => state.activeEntities.activeContentResponse);
    const [tagName, setTagname] = useState('');
    const [tagDesc, setTagDesc] = useState('');
    const [tagId, setTagId] = useState('');

    useEffect(() => {
        if (modalType === ActiveModalType.EDIT_TAG) {
            setTagname(activeData.name);
            setTagDesc(activeData.description);
            setTagId(activeData._id);
        }
    }, [activeData])

    const handleSubmit = async () => {
        if (modalType === ActiveModalType.ADD_TAG) {
            const toastId = toast.loading(`Creating a tag...`);
            const createdTag = await apiService.createTag({
                name: tagName,
                description: tagDesc,
                userId: email,
                contentBlockId: activeContentBlockId
            }, token)
            toast.success('Tag created successfully, refresh page to see changes', { id: toastId });
            pushEvent('TagCreated', { email });
            dispatch(setIsModalOpen(false));
            // So the goal here is that once a tag is created, we attach it to a content response as well, if that's where we started the tag creation process from.
            if (activeContentResponse && activeContentResponse._id) {
                const responseTag = await apiService.createResponseTag({ contentResponseId: activeContentResponse._id, tagId: createdTag._id, userId: email }, token);
                dispatch(updateContentResponseInTopic({
                    ...activeContentResponse,
                    responseTags: [...activeContentResponse.responseTags || [], { ...responseTag, tagId: createdTag }]
                }))
            }
        } else if (modalType === ActiveModalType.EDIT_TAG) {
            const toastId = toast.loading(`Updating a tag...`);
            const updatedTag = await apiService.updateTag(tagId, {
                name: tagName,
                description: tagDesc,
            }, token)
            toast.success('Tag updated successfully, refresh page to see changes', { id: toastId });
            pushEvent('TagUpdated', { email });
            dispatch(setIsModalOpen(false));
            dispatch(setTopicTags(topicTags.map((tag: Tag) => tag._id === tagId ? updatedTag : tag)));
        };
    };

    const onCancel = () => {
        dispatch(setIsModalOpen(false));
    };

    return (
        <Modal
            title="Add Tag"
            visible={isVisible}
            onCancel={onCancel}
            maskClosable={false}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Submit
                </Button>,
            ]}
        >
            <Input
                placeholder="Tag Name. eg: Authentication"
                value={tagName}
                onChange={(e) => setTagname(e.target.value)}
                onPressEnter={handleSubmit} // Allow submitting with the Enter key
            />
            <br /><br />
            <TextArea
                style={{
                    background: "#f5f5f5",
                    padding: "0.8rem",
                    border: "1px dashed #aaa",
                    width: "90%"
                }}
                rows={5}
                placeholder="Description of tag. eg: Relates to all features, bugs related to authentication "
                value={tagDesc}
                onChange={(value) => setTagDesc(value)}
            />
        </Modal>
    );
};

export default AddEditTagModal;
