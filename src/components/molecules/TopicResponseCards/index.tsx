import { CloseOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlayCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ResponseSources from '@components/atoms/ResponseSources';
import { ResponseContentBlock } from '@models/contentBlock.model';
import { CompleteContentResponse } from '@models/contentResponse.model';
import { Tag as TagType } from '@models/tag.model';
import { ActiveModalType, ActiveRouteKey, setActiveContentBlockId, setActiveContentResponse, setIsModalOpen, setModalType } from '@redux/features/activeEntitiesSlice';
import { setActiveTopic, setTopicTags, updateContentResponseInTopic } from '@redux/features/topicSlice';
import { setUserCurrentVideoTime } from '@redux/features/userSlice';
import { AppDispatch, RootState } from '@redux/store';
import apiService from '@utils/api/api-service';
import { Button, Card, Input, Modal, Popover, Space, Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const TopicResponseCards: React.FC<{ selectedTag: TagType | null, onTagSelect: (tag: any) => void }> = ({ selectedTag, onTagSelect }) => {
    const { token, email, miroAccessToken } = useSelector((state: RootState) => state.persisted.user.value)
    const topic = useSelector((state: RootState) => state.topic.activeTopic);
    const tags = useSelector((state: RootState) => state.topic.activeTopic.tags) || [];
    const [filteredTags, setFilteredTags] = useState<TagType[]>(tags);
    const [searchText, setSearchText] = useState('');
    const [editableResponseId, setEditableResponseId] = useState('');
    const navigate = useNavigate();
    const [editedAnswerText, setEditedAnswerText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const dispatch: AppDispatch = useDispatch();


    useEffect(() => {
        // Fetch and set tags for the topic when the component mounts or the topic changes
        const fetchAndSetTags = async () => {
            try {
                const topicTags = await apiService.getTopicTags(email, topic._id!, token);
                dispatch(setTopicTags(topicTags));
                setFilteredTags(topicTags);
            } catch (error) {
                console.error('Failed to fetch tags:', error);
            }
        };

        fetchAndSetTags();
    }, [token]);

    const handleSearch = (e: any) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        const filtered = tags.filter((tag) => tag.name.toLowerCase().includes(value));
        setFilteredTags(filtered);
    };

    const handleEditResponse = (responseId: string, answerText: string) => {
        setEditableResponseId(responseId!);
        setEditedAnswerText(answerText);
    };

    const handleResponseChange = (e: any) => {
        setEditedAnswerText(e.target.value);
    };

    const submitResponseEdit = async () => {
        const toastId = toast.loading('Updating response...');
        try {
            const updatedContentResponse = await apiService.updateContentResponse(editableResponseId, { answerText: editedAnswerText }, token);
            toast.success('Response updated, refresh page to see effects', { id: toastId });
            setIsModalVisible(false);
            dispatch(updateContentResponseInTopic(updatedContentResponse));
            setEditableResponseId('');
        } catch (error) {
            toast.error('Failed to update response', { id: toastId });
        }
    };
    const showModal = (responseId: string, answerText: string) => {
        setEditableResponseId(responseId);
        setEditedAnswerText(answerText);
        setIsModalVisible(true);
    };



    const handleTagAddition = async (responseId: string, tagId: string) => {
        const toastId = toast.loading('Adding tag...');
        try {
            await apiService.createResponseTag({ contentResponseId: responseId, tagId, userId: email }, token);
            toast.success('Tag added successfully, refresh page to see changes', { id: toastId });
            // Re-fetch responses or update state to show the new tag (not shown in this snippet)
        } catch (error) {
            toast.error('Failed to add tag', { id: toastId });
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const clearSelectedTag = () => {
        onTagSelect(null);
    }

    const handleDeleteContentResponse = async (responseId: string) => {
        await apiService.deleteContentResponse(responseId, topic._id as string, email, token);
    }
    const handleAddTag = async (response: CompleteContentResponse) => {
        dispatch(setIsModalOpen(true));
        dispatch(setActiveContentBlockId(topic._id!))
        dispatch(setActiveContentResponse(response));
        dispatch(setModalType(ActiveModalType.ADD_TAG));
        setSearchText('');
    };

    const handleTimestampClick = ({ docId, timestamp }: { docId: string, timestamp: number }) => {
        dispatch(setUserCurrentVideoTime(timestamp));
        window.open(`${process.env.REACT_APP_DOMAIN}/${ActiveRouteKey.DOCUMENTS}/${docId}/source`, '_blank');
    }


    return (
      <>
        {miroAccessToken && (
          // <Button
          //     style={{
          //         margin: "1rem 0"
          //     }}
          //     onClick={async () => {
          //         const toastId = toast.loading('Creating board and stickies...');
          //         try {
          //             await apiService.createBoardAndStickies({ contentBlock: topic, contentResponses: topic.contentResponses!, miroAccessToken });
          //             toast.success('Board and stickies created successfully', { id: toastId });
          //         } catch (error) {
          //             toast.error('Failed to create board and stickies', { id: toastId });
          //         }
          //     }}
          // >
          //     Sync to Miro (Beta)
          // </Button>
          <></>
        )}
        {selectedTag && (
          <p>
            Filtered with tag -{" "}
            <Tag
              closable
              onClose={(e) => {
                e.preventDefault();
                clearSelectedTag();
              }}
              color="blue"
            >
              {selectedTag.name}
            </Tag>
          </p>
        )}
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter="16px">
            {topic.contentResponses
              ?.filter((response) => {
                // If no tag is selected, show all responses
                if (!selectedTag) return true;
                // Check if the response has the selected tag
                return response.responseTags?.some(
                  (tag) => tag.tagId._id === selectedTag._id
                );
              })
              ?.filter((response) => response.answerText.length > 0)
              ?.map((response) => {
                if (
                //   response.answerText.length > 0 &&
                  response?.contact?.name &&
                  response?.contact?.name?.length > 0
                ) {
                  return (
                    <div key={response._id} style={{ marginBottom: "16px" }}>
                      {" "}
                      {/* Additional wrapper for gutter control */}
                      <Card
                        actions={[
                          <DeleteOutlined
                            onClick={async () => {
                              const toastId =
                                toast.loading("Deleting quote...");
                              const deleteResponse =
                                await apiService.deleteContentResponse(
                                  response._id!,
                                  topic._id!,
                                  email,
                                  token
                                );
                            //   dispatch(setActiveTopic(deleteResponse));
                              toast.success(
                                "Quote deleted successfully, refresh page to see changes",
                                { id: toastId }
                              );
                            }}
                            key="delete"
                          />,
                          <EyeOutlined
                            onClick={() =>
                              navigate(
                                `/${ActiveRouteKey.DOCUMENTS}/${response.documentId}`
                              )
                            }
                            key="view"
                          />,
                          <EditOutlined
                            onClick={() =>
                              showModal(response._id!, response.answerText)
                            }
                            key="edit"
                          />,
                        ]}
                        title={response.contact?.name}
                        bordered={false}
                      >
                        {/* <Input style={{
                                            background: "#f5f5f5",
                                            padding: "0.8rem",
                                            border: "1px dashed #aaa",
                                            width: "90%"
                                        }}
                                            value={editedAnswerText ? editedAnswerText : "${response.answerText}"}
                                            onChange={handleResponseChange}
                                            onPressEnter={() => submitResponseEdit(response._id!)}
                                            onBlur={() => submitResponseEdit(response._id!)}
                                        /> */}
                        {/* {editableResponseId === response._id ? (
                          <TextArea
                            style={{
                              background: "#f5f5f5",
                              padding: "0.8rem",
                              border: "1px dashed #aaa",
                              width: "90%",
                            }}
                            value={editedAnswerText}
                            onChange={handleResponseChange}
                            onPressEnter={() => submitResponseEdit()}
                            onBlur={() => submitResponseEdit()}
                          />
                        ) : (
                          <div
                            onClick={() =>
                              handleEditResponse(
                                response._id!,
                                response.answerText
                              )
                            }
                          >
                            {response.answerText || (
                              <i>Click to add response</i>
                            )}
                          </div>
                        )} */}
                        <div
                          onClick={() =>
                            showModal(response._id!, response.answerText)
                          }
                        >
                          {response.answerText || <i>Click to add response</i>}
                        </div>
                        <Tooltip title={response.contact?.headline}>
                          <p>{response.contact?.headline}</p>
                        </Tooltip>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            width: "100%",
                            gap: "0.3rem",
                          }}
                        >
                          {response?.responseTags?.map((rTag, index) => (
                            <div
                              key={index}
                              style={{
                                display: "inline-block",
                                marginRight: "8px",
                              }}
                            >
                              <Tag
                                closable
                                onClose={async (e) => {
                                  e.preventDefault();
                                  const toastId =
                                    toast.loading("Deleting tag...");
                                  await apiService.deleteResponseTag(
                                    rTag._id!,
                                    token
                                  );
                                  dispatch(
                                    updateContentResponseInTopic({
                                      ...response,
                                      responseTags:
                                        response.responseTags?.filter(
                                          (tag) => tag._id !== rTag._id
                                        ),
                                    })
                                  );
                                  toast.success(
                                    "Tag deleted successfully, refresh page to see changes",
                                    { id: toastId }
                                  );
                                }}
                                color="volcano"
                              >
                                {rTag.tagId.name}
                              </Tag>
                            </div>
                          ))}
                          <Popover
                            content={
                              <Space direction="vertical">
                                <Input
                                  placeholder="Search tags"
                                  value={searchText}
                                  onChange={handleSearch}
                                />
                                <Space direction="vertical">
                                  {filteredTags.map((tag) => (
                                    <Tag
                                      key={tag._id}
                                      onClick={() =>
                                        handleTagAddition(
                                          response._id!,
                                          tag._id!
                                        )
                                      }
                                    >
                                      {tag.name}
                                    </Tag>
                                  ))}
                                  <Button
                                    type="primary"
                                    onClick={() => handleAddTag(response)}
                                  >
                                    Create and Add Tag
                                  </Button>
                                </Space>
                              </Space>
                            }
                            title="Add or Create a Tag"
                            trigger="click"
                          >
                            <Tag style={{ borderStyle: "dashed" }}>
                              <PlusOutlined /> Add Tag
                            </Tag>
                            <br />
                            <br />
                          </Popover>
                          <ResponseSources
                            numberOfSources={1}
                            response={response}
                            handleTimestampClick={handleTimestampClick}
                          />
                        </div>
                      </Card>
                    </div>
                  );
                }
              })}
          </Masonry>
        </ResponsiveMasonry>
        <Modal
          title="Edit Response"
          visible={isModalVisible}
          onOk={submitResponseEdit}
          onCancel={handleCancel}
          okText="Update"
          cancelText="Cancel"
        >
          <TextArea
            value={editedAnswerText}
            onChange={handleResponseChange}
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Modal>
      </>
    );
};

export default TopicResponseCards;