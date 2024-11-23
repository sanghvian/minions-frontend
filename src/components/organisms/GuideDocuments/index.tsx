import { ArrowRightOutlined, DeleteOutlined, EditOutlined, SaveOutlined, WhatsAppOutlined, PhoneOutlined, HighlightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { CompleteDocument } from '@models/document.model';
import { ActiveRouteKey } from '@redux/features/activeEntitiesSlice';
import { setActiveDocument } from '@redux/features/documentSlice';
import { setUsageCount } from '@redux/features/userSlice';
import { RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import { Button, Input, Modal, Spin, Table, TableProps, Typography, Progress } from 'antd';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const { Text } = Typography;

const GuideDocuments = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [allDocuments, setAllDocuments] = useState<CompleteDocument[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDocuments, setTotalDocuments] = useState(0);
    const pageSize = 10; // Number of documents per page
    const [editingKey, setEditingKey] = useState('');
    const [editedName, setEditedName] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [natureOfDelay, setNatureOfDelay] = useState<Record<string, string>>({});
    const { email, token, usageCount } = useSelector((state: RootState) => state.persisted.user.value);
    const navigate = useNavigate();
    const location = useLocation();
    const templateId = location.pathname.split("/")[2];

    const handleEdit = (record: any) => {
        setEditingKey(record.key);
        setEditedName(record.Name.props.children);
    };

    const saveEditedName = async (docId: string) => {
        if (editedName === null) return; // or handle the error case
        const activeDoc = allDocuments.find(doc => doc._id === docId);
        // Call API to update the contact name
        const toastId = toast.loading('Updating name...');
        const updatedContact = { name: editedName };
        try {
            await apiService.updateContact(activeDoc?.contactId!, updatedContact, email, token);
            // After successful API call, update the local state
            const updatedDocs = allDocuments.map(doc => {
                if (doc._id === docId) {
                    return { ...doc, contact: { ...doc.contact, name: editedName } };
                }
                return doc;
            });
            setAllDocuments(updatedDocs);
            toast.success('Name updated successfully', { id: toastId });
        } catch (error) {
            toast.error('Failed to update the name', { id: toastId });
        }
        setEditingKey('');
    }

    const handleModal = (content: string) => {
        setModalContent(content);
        setModalVisible(true);
    };

    const sendReminder = () => {
        toast.success('Reminder sent ✅');
        setModalVisible(false);
    };

    const fetchDocuments = async (page: number) => {
        setIsLoading(true);
        const { docs, count } = await apiService.getPaginatedDocumentsForUserForTemplate(email, templateId, token, page, pageSize);
        setAllDocuments(docs);
        setIsLoading(false);
        setTotalDocuments(count);
    };

    useEffect(() => {
        fetchDocuments(currentPage);
    }, [currentPage, email, token]);

    const handleTableChange = (pagination: { current?: number }) => {
        setCurrentPage(pagination?.current || 0);
    };

    const handleDelete = async (docId: string) => {
        toast.promise(
            apiService.deleteDocument({
                documentId: docId!,
                userId: email,
                accessToken: token
            }),
            {
                loading: '🗑️ Deleting Document...',
                success: <b>Document deleted!</b>,
                error: <b>Could not delete.</b>,
            }
        )
        pushEvent('DeleteDocument', { docId })
        const filteredDocs = (allDocuments as CompleteDocument[]).filter((v: CompleteDocument) => v._id !== docId)
        setAllDocuments(filteredDocs)
    }

    const columns: TableProps<any>["columns"] = [
        {
            title: "Name",
            dataIndex: "Name",
            key: "name",
            render: (text: any, record: any) => {
                return editingKey === record.key ? (
                    <Input value={editedName}
                        onClick={
                            (e: any) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        }
                        onKeyDown={(e: any) => {
                            if (e.key === 'Enter') {
                                saveEditedName(record.key)
                            }
                        }}
                        onChange={(e: any) => setEditedName(e.target.value)} />
                ) : (
                    <b>{text}</b>
                );
            },
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record) => {
                return (
                    <Button icon={<ArrowRightOutlined />} onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(setUsageCount(usageCount! + 1))
                        navigate(`/${ActiveRouteKey.DOCUMENTS}/${record.key}`)
                    }} >Learn More</Button>
                );
            }
        },
        {
            title: "Nature of Delay",
            dataIndex: "natureOfDelay",
            key: "natureOfDelay",
            render: (text: any, record: any) => {
                const value = natureOfDelay[record.key] || (Math.random() > 0.5 ? "unable" : "unwilling");
                return (
                    <p>{value}</p>
                );
            }
        },

        {
            title: "Call to Action",
            key: "callToAction",
            render: (_: any, record) => {
                return (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        <Button
                            type="primary"
                            icon={<WhatsAppOutlined />}
                            onClick={(e: any) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleModal(`Hey ${record.name}! Here's a gentle reminder to pay your loan of $20000 by due date 26th June 2024, after which charges will be levied! 📝`)
                            }}
                        />
                        <Button
                            type="primary"
                            icon={<PhoneOutlined />}
                            onClick={(e: any) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toast.success('Call reminder was sent to borrower ✅')
                            }}
                        />
                        <Button
                            danger
                            icon={<HighlightOutlined />}
                            onClick={(e: any) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toast.success('Notified legal department ✅')
                            }}
                        />
                        <Button
                            danger
                            icon={<ExclamationCircleOutlined />}
                            onClick={(e: any) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toast.success('Requested field agents to handle the case ✅')
                            }}
                        />
                    </div>
                );
            }
        }
    ];

    const unableCount = Object.values(natureOfDelay).filter(value => value === "unable").length;
    const unwillingCount = Object.values(natureOfDelay).filter(value => value === "unwilling").length;
    const totalCount = unableCount + unwillingCount;

    return (
        <>
            {/* <Progress percent={totalCount === 0 ? 0 : (unableCount / totalCount) * 100} success={{ percent: (unwillingCount / totalCount) * 100 }} /> */}
            {/* <h3>Completion %</h3>
            <Progress percent={(3 / 10) * 100} success={{ percent: (3 / 10) * 100 }} /> */}
            {
                isLoading ? (
                    <div className="loading-spinner">
                        <Spin />
                    </div>
                ) : (
                    <Table
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: totalDocuments,
                            onChange: (page) => setCurrentPage(page),
                        }}
                        onChange={handleTableChange}
                        columns={columns}
                        dataSource={allDocuments
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .filter((item) => item.contact)
                            .map((doc) => ({
                                key: doc._id,
                                Name: <b>{doc?.contact?.name}</b>,
                                natureOfDelay: natureOfDelay[(doc as any)._id] || (Math.random() > 0.5 ? "unable" : "unwilling"),
                                Template: doc?.templateId?.name,
                                date: doc.createdAt,
                            }))}
                        onRow={(record) => ({
                            onClick: () => {
                                const selectedDocument = allDocuments.find(
                                    (doc) => doc._id === record.key
                                );
                                if (selectedDocument) {
                                    dispatch(setActiveDocument(selectedDocument));
                                    navigate(`/${ActiveRouteKey.DOCUMENTS}/${selectedDocument._id}`);
                                }
                            },
                        })}
                        className="documents-table"
                    />
                )
            }
            <Modal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={sendReminder}
                title="Send Reminder"
            >
                <Input.TextArea value={modalContent} onChange={(e) => setModalContent(e.target.value)} />
            </Modal>
        </>
    );
};

export default GuideDocuments;
