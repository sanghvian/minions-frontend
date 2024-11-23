import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Modal } from 'antd';
import { ActiveModalType, setIsModalOpen } from '@redux/features/activeEntitiesSlice';
import { RootState } from '@redux/store';
import apiService from '@utils/api/api-service';
import { setUser } from '@redux/features/userSlice';
import toast from 'react-hot-toast';
import { pushEvent } from '@utils/analytics';

const SetSpreadsheetModal = () => {
    const { isModalOpen, modalType } = useSelector((state: RootState) => state.activeEntities);
    const isVisible = isModalOpen && modalType === ActiveModalType.SET_SPREADSHEET;
    const dispatch = useDispatch();
    const { email, token, id } = useSelector((state: RootState) => state.persisted.user.value);

    const [spreadsheetName, setSpreadsheetName] = useState('');

    const handleSubmit = async () => {
        const toastId = toast.loading(`Creating spreadsheet with name ${spreadsheetName} for you...`);
        const { spreadsheetId } = await apiService.createSpreadsheet({ title: spreadsheetName, accessToken: token });
        const updatedUser = await apiService.updateUser(email, id!, { spreadsheetId }, token);
        dispatch(setUser({ ...updatedUser, token }))
        toast.success('Spreadsheet connected successfully', { id: toastId });
        pushEvent('SpreadsheetConnected', { email, spreadsheetId });
        dispatch(setIsModalOpen(false));
    };

    const onCancel = () => {
        dispatch(setIsModalOpen(false));
    };

    return (
        <Modal
            title="Set Spreadsheet Name"
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
                placeholder="Enter Spreadsheet Name"
                value={spreadsheetName}
                onChange={(e) => setSpreadsheetName(e.target.value)}
                onPressEnter={handleSubmit} // Allow submitting with the Enter key
            />
        </Modal>
    );
};

export default SetSpreadsheetModal;
