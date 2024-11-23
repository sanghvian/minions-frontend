import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { CompleteDocument } from '@models/document.model';
import { ActiveRouteKey } from '@redux/features/activeEntitiesSlice';
import { setActiveDocument } from '@redux/features/documentSlice';
import { RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import { Button, Input, Spin, Table, TableProps, Typography } from 'antd';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;


const MeetingNotes = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [allDocuments, setAllDocuments] = useState<CompleteDocument[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDocuments, setTotalDocuments] = useState(0);
    const pageSize = 10; // Number of documents per page
    const [editingKey, setEditingKey] = useState('');
    const [editedName, setEditedName] = useState<string>('');
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
    const navigate = useNavigate();

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

    // Fetch documents for the current page
    const fetchDocuments = async (page: number) => {
        setIsLoading(true);
        const { docs, count } = await apiService.getPaginatedDocumentsForUser(email, token, page, pageSize);
        setAllDocuments(docs);
        setIsLoading(false);
        // Update totalDocuments if your API returns the total count
        setTotalDocuments(count);
    };
    useEffect(() => {
        fetchDocuments(currentPage);
    }, [currentPage, email, token]);



    // Render pagination
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
                        // Logic to save edited name when the enter key is pressed
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
        { title: "Guide", dataIndex: "Template", key: "Template" },
        {
            title: "Created At",
            dataIndex: "date",
            key: "date",
            render: (text: any, record: any) => (
                <Text>{format(new Date(record.date), "h:mma, do MMM yyyy")}</Text>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record) => {
                return (
                    <>
                        {editingKey === record.key ? (
                            <Button icon={<SaveOutlined />} onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                saveEditedName(record.key)
                            }} />
                        ) : (
                            <>
                                <Button icon={<EditOutlined />} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEdit(record); }} >Edit Name</Button> &nbsp; &nbsp;
                                <Button
                                    icon={<DeleteOutlined />}
                                    onClick={(e: any) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDelete(record.key)
                                    }}>Delete</Button>
                            </>
                        )}
                    </>
                );
            }
        }
    ];


    return (
        isLoading ? (
            <div className="loading-spinner">
                <Spin />
            </div>
        ) : <Table
            pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalDocuments, // Update based on API response
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

export default MeetingNotes
