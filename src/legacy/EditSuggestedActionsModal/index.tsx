import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import ActionsList from '@components/molecules/ActionsList';
import { ActiveModalType, setActiveQueryString, setHandleModalClose, setIsModalOpen, setModalType } from '@redux/features/activeEntitiesSlice';
import { removeActiveActionFromList, setActiveActions } from '@redux/features/actionSlice';
import { Button, Modal } from 'antd';
import './EditSuggestedActionsModal.css';
import apiService from '@utils/api/api-service';
import toast from 'react-hot-toast';
import { setContactActions } from '@redux/features/contactSlice';
import { Action } from '@models/action.model';
import { setUserCalendarId } from '@redux/features/userSlice';
import { pushEvent } from '@utils/analytics';

const EditSuggestedActionsModal = () => {
    const { activeActions, suggestedActions } = useSelector((state: RootState) => state.action.value);
    const user = useSelector((state: RootState) => state.persisted.user.value);
    const dispatch: AppDispatch = useDispatch();
    const [isEditingAction, setIsEditingAction] = useState<boolean>(false);
    const { isModalOpen, modalType } = useSelector((state: RootState) => state.activeEntities);
    const isVisible = isModalOpen && modalType === ActiveModalType.EDIT_SUGGESTED_ACTIONS;
    const contact = useSelector((state: RootState) => state.contact.value.activeContact!);

    const handleModeSwitch = () => {
        if (isEditingAction) {
            setIsEditingAction(false);
        }
        else {
            setIsEditingAction(true);
            dispatch(setHandleModalClose(async ({ currentAction }) => {
                // Find the currentAction in the activeActions by id and then update it
                let updatedAction = activeActions.find((action: any) => action.id === currentAction.id)!;
                if (updatedAction) {
                    updatedAction = {
                        ...updatedAction,
                        ...currentAction
                    }
                }
                // Once we have the updatedAction, replace it in the actionsList
                const updatedActionsList = activeActions.map((action: any) => action.id === currentAction.id ? updatedAction : action);
                dispatch(setActiveActions(updatedActionsList));
                dispatch(setModalType(ActiveModalType.EDIT_SUGGESTED_ACTIONS));
            }))
        }
    }

    const onCancel = () => {
        dispatch(setActiveQueryString(''));
        // dispatch(setModalType(ActiveModalType.CONTACT_MODAL));
        dispatch(setIsModalOpen(false));
    }

    const handleSubmit = async () => {
        const rshipId = contact.relationshipId!;
        const rapObject = {
            user,
            contact,
            relationshipId: rshipId,
            finalActions: activeActions,
            suggestedActions,
            existingCalendarId: user.calendarId
        }
        const toastId = toast.loading('Saving actions...');
        try {
            const res = await apiService.storeRAP(rshipId, user.email, rapObject, user.token)
            toast.success('Actions saved!', { id: toastId });
            dispatch(setContactActions(res.finalActions));
            // If the refreshToken for google calendar has expired, then we generate a new one on the fly and return it to the frontend and set is on the user.
            // dispatch(setUserToken(res.refreshToken))
            if (res.calendarId) {
                dispatch(setUserCalendarId(res.calendarId))
            }
            pushEvent('SaveRitualActions', { actions: res.finalActions })
        } catch (error) {
            toast.error('Error saving actions!', { id: toastId });
        } finally {
            dispatch(setIsModalOpen(false));
        }
    }



    return (
        <Modal
            title="Edit Suggestions"
            visible={isVisible}
            onCancel={onCancel}
            footer={[
                <>
                    <Button key="submit" type="primary" onClick={handleSubmit}>
                        Submit
                    </Button>,

                </>
            ]}
        >
            <div className='actionsListContainer' >
                <ActionsList
                    handleEditAction={() => {
                        dispatch(setIsModalOpen(true));
                        dispatch(setModalType(ActiveModalType.ACTION_MODAL))
                        handleModeSwitch();
                    }}
                    actions={activeActions}
                    handleDeleteAction={(a: Action) => {
                        dispatch(removeActiveActionFromList(a));
                    }}
                />
                <div className="actionsListGradient" />
            </div>

        </Modal>
    );
};

export default EditSuggestedActionsModal;
