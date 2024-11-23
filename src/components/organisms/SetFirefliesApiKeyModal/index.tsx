import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Modal } from 'antd';
import { ActiveModalType, setIsModalOpen } from '@redux/features/activeEntitiesSlice';
import { RootState } from '@redux/store';
import apiService from '@utils/api/api-service';
import { setUser } from '@redux/features/userSlice';
import toast from 'react-hot-toast';
import { pushEvent } from '@utils/analytics';

const SetFirefliesApiKeyModal = () => {
    const { isModalOpen, modalType } = useSelector((state: RootState) => state.activeEntities);
    const isVisible = isModalOpen && modalType === ActiveModalType.SET_FIREFLIES_API_KEY;
    const dispatch = useDispatch();
    const { email, token, id } = useSelector((state: RootState) => state.persisted.user.value);

    const [fApiKey, setFApiKey] = useState('');

    const handleSubmit = async () => {
        const toastId = toast.loading(`Connecting to your fireflies account...`);
        const updatedUser = await apiService.updateUser(email, id!, {
            firefliesApiKey: fApiKey
        }, token);
        dispatch(setUser({ ...updatedUser, token }))
        toast.success('Fireflies Account connected successfully', { id: toastId });
        pushEvent('FirefliesAccountConnected', { email });
        dispatch(setIsModalOpen(false));
    };

    const onCancel = () => {
        dispatch(setIsModalOpen(false));
    };

    return (
        <Modal
            title="Set Fireflies API Key"
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
                placeholder="Enter Fireflies API Key"
                value={fApiKey}
                onChange={(e) => setFApiKey(e.target.value)}
                onPressEnter={handleSubmit} // Allow submitting with the Enter key
            />
        </Modal>
    );
};

export default SetFirefliesApiKeyModal;
