import { useState } from 'react';
import { Modal, Form, Input, Button, DatePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { setIsModalOpen } from '@redux/features/activeEntitiesSlice';
import { ForwardFilled } from '@ant-design/icons';
import { pushEvent } from '@utils/analytics';
import { Action } from '@models/action.model';
import { initialActionState, setAction } from '@redux/features/actionSlice';
import toast from 'react-hot-toast';
import { format, formatISO, parseISO } from 'date-fns';
import dayjs from 'dayjs';

const EditActionModal = () => {
    const [form] = Form.useForm();
    const action: Action = useSelector((state: RootState) => state.action.value.activeAction)
    const dispatch: AppDispatch = useDispatch();
    const [currentAction, setCurrentAction] = useState<Action>(action!)
    const handleModalClose = useSelector((state: RootState) => state.activeEntities.handleModalClose);
    const onFinish = async () => {
        const startTime = new Date().getTime();
        const toastId = toast.loading('Saving action...');
        try {
            const endTime = new Date().getTime();
            pushEvent('EditActionCompleted', { responseTime: (endTime - startTime) / 1000 });
            toast.success('Action Updated!', { id: toastId })
            // Update the action in the store, in the actions array of the contact
            handleModalClose!({ currentAction });
        } catch (error) {
            // Handle error
            toast.error('Error updating action', { id: toastId });
            console.error(error);
        } finally {
            dispatch(setAction(initialActionState.value.activeAction!));
            form.resetFields();
        }
    };

    const handleChange = (changedFields: Partial<Action>, fieldEdited: "event" | "action" | "timestamp") => {
        setCurrentAction({ ...currentAction, ...changedFields });
        pushEvent('UpdateActionProperties', { fieldEdited });
    }

    const onCancel = () => {
        dispatch(setIsModalOpen(false));
    }

    const formatTimestamp = (timestamp: string) => {
        if (timestamp) {
            return dayjs(timestamp)
        }
    }

    return (
        <Modal
            title="Edit Action"
            visible={true}
            onCancel={onCancel}
            footer={
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<ForwardFilled />}
                    onClick={() => form.submit()}
                >
                    Submit
                </Button>
            }
        >
            <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                <Form form={form} onFinish={onFinish}>
                    <Form.Item label="Event">
                        <Input onChange={(e) => handleChange(
                            { event: e.target.value as string }, "event")
                        }
                            defaultValue={currentAction.event}
                        />
                    </Form.Item>
                    <Form.Item label="Action">
                        <Input onChange={(e) => handleChange(
                            { action: e.target.value as string }, "action")
                        }
                            defaultValue={currentAction.action}
                        />
                    </Form.Item>
                    <Form.Item label="Date" name="date">
                        <p>{format(new Date(currentAction.timestamp), 'dd MMM yyyy')}</p>
                        <DatePicker
                            format="YYYY-MM-DD"
                            onChange={(_: any, dateString: string) => handleChange(
                                { timestamp: formatISO(parseISO(dateString)) }, "timestamp")
                            }
                            // Function that uses dayjs and reads in ISO strings in the form that ant-design datepicker displays

                            value={formatTimestamp(currentAction.timestamp) || null}
                        />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default EditActionModal;
