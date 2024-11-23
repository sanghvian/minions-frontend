import { EditOutlined, ExclamationCircleOutlined, HighlightOutlined, PhoneOutlined, PlayCircleOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { VideoSource } from "@models/video.model";
import { ActiveRouteKey } from "@redux/features/activeEntitiesSlice";
import { setActiveDocument } from "@redux/features/documentSlice";
import { AppDispatch, RootState } from "@redux/store";
import apiService from "@utils/api/api-service";
import { Button, Card, Input, Modal } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ResponseSources from "../ResponseSources";
import { setUserCurrentVideoTime } from "@redux/features/userSlice";



const DocumentCard: React.FC<{ setActiveKey: Dispatch<SetStateAction<string>> }> = ({ setActiveKey }) => {
    const dispatch: AppDispatch = useDispatch()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editableResponseId, setEditableResponseId] = useState('');
    const [editedAnswerText, setEditedAnswerText] = useState('');
    const [selectedResponse, setSelectedResponse] = useState<any>(null); // Track selected response for editing
    const { token } = useSelector((state: RootState) => state.persisted.user.value);

    const location = useLocation();
    // Get the property "topicId" from the query parameters of the route
    const activeTopicId = new URLSearchParams(location.search).get('topicId') || "";

    const navigate = useNavigate();
    const showModal = (responseId: string, answerText: string) => {
        setEditableResponseId(responseId);
        setEditedAnswerText(answerText);
        setIsModalVisible(true);
        setSelectedResponse({ responseId, answerText });
    };
    const activeDocument = useSelector((state: RootState) => state.document.activeDocument);
    const handleTimestampClick = ({ timestamp }: { docId: string, timestamp: number }) => {
        setActiveKey("3"); // active key for tabs
        dispatch(setUserCurrentVideoTime(timestamp));

    };
    const handleResponseChange = (e: any) => {
        setEditedAnswerText(e.target.value);
    };

    const handleOk = async () => {
        const toastId = toast.loading('Updating response...');
        try {
            await apiService.updateContentResponse(editableResponseId, { answerText: editedAnswerText }, token);
            toast.success('Response updated', { id: toastId });

            const updatedResponses = activeDocument.contentResponses?.map(response => {
                if (response._id === editableResponseId) {
                    return { ...response, answerText: editedAnswerText };
                }
                return response;
            });
            dispatch(setActiveDocument({ ...activeDocument, contentResponses: updatedResponses }));

            setIsModalVisible(false); // Close modal
            setEditableResponseId(''); // Clear current editing setup
        } catch (error) {
            toast.error('Failed to update response', { id: toastId });
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedResponse(null); // Clear selected response
    };
    return (
        <Card className="one-document-card">
            <div className="document-notexps-div">
                {activeDocument?.contentResponses?.map((response) => {
                    if (response?.answerText?.length === 0) return
                    return (
                        <div
                            className={`note-item ${response.contentBlockId._id === activeTopicId ? 'active' : ""}`}
                            key={response._id}
                            style={{
                                padding: "1rem"
                            }}
                        >
                            <div style={{ display: 'flex', gap: "1rem", justifyContent: "flex-start" }}>
                                <div className="note-item-heading"
                                    onClick={() => navigate(`/${ActiveRouteKey.TOPICS}/${response.contentBlockId._id}`)}
                                >
                                    {response?.contentBlockId?.blockTitle} &nbsp;
                                </div>
                                <Button icon={<EditOutlined />} onClick={() => {
                                    showModal(response._id!, response.answerText)
                                }} />
                            </div>
                            <div
                                style={{
                                    width: "100%",
                                    textAlign: "left",
                                }}
                            >
                                {response.answerText || <i>Click to add response</i>}
                                <ResponseSources
                                    response={response}
                                    handleTimestampClick={handleTimestampClick} />
                            </div>
                        </div>
                    );
                })}
                <h3>Follow up actions</h3>
                <div
                    style={{
                        display: 'flex',
                        gap: "1rem",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "1rem"
                    }}>

                    <Button
                        type="primary"
                        icon={<WhatsAppOutlined />}
                        onClick={() => toast.success('Reminder message sent to borrower ✅')}
                    >
                        Send Reminder Message on WhatsApp
                    </Button>
                    <Button
                        type="primary"
                        icon={<PhoneOutlined />}
                        onClick={() => toast.success('Call reminder was sent to borrower ✅')}
                    >
                        Send Call Reminder
                    </Button>
                    <Button
                        danger
                        icon={<HighlightOutlined />}
                        onClick={() => toast.success('Notified legal department ✅')}
                    >
                        Notify Legal Department
                    </Button>
                    <Button
                        danger
                        icon={<ExclamationCircleOutlined />}
                        onClick={() => toast.success('Requested field agents to handle the case ✅')}
                    >
                        Notify Field agents
                    </Button>
                </div>
            </div>
            {/* Modal for editing response */}
            <Modal
                title="Edit Response"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Update"
                cancelText="Cancel"
            >
                {selectedResponse && (
                    <Input.TextArea
                        value={editedAnswerText}
                        onChange={handleResponseChange}
                        autoSize={{ minRows: 3, maxRows: 6 }}
                    />
                )}
            </Modal>
        </Card>
    );
};

export default DocumentCard;