import { DeleteFilled, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { CompleteContact } from '@models/contact.model';
import { Action } from '@models/action.model';
import { setHandleModalClose, setIsModalOpen } from '@redux/features/activeEntitiesSlice';
import { setContact } from '@redux/features/contactSlice';
import { setAction } from '@redux/features/actionSlice';
import { AppDispatch, RootState } from '@redux/store';
import apiService from '@utils/api/api-service';
import { Button, List } from 'antd';
import { compareDesc, format, parseISO } from 'date-fns';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function stripContactLink(inputString: string) {
    // Regular expression to match the pattern "Contact Link - HTTPS URL"
    const regexPattern = /Contact Link - https?:\/\/[^\s]+;/g;

    // Replace the matched pattern with an empty string
    return inputString.replace(regexPattern, '').trim();
}

const ActionsList: React.FC<{
    actions: Action[],
    handleEditAction: () => void,
    handleDeleteAction: (a: Action) => any
}> = ({
    actions,
    handleEditAction,
    handleDeleteAction
}) => {
        const dispatch: AppDispatch = useDispatch();
        const contact: CompleteContact = useSelector((state: RootState) => state.contact.value.activeContact!);
        const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
        const sortedActions = [...actions].sort((a: Action, b: Action) =>
            compareDesc(parseISO(a.timestamp), parseISO(b.timestamp))
        ).reverse();


        useEffect(() => {
            dispatch(setHandleModalClose(async ({ currentAction }) => {
                await apiService.updateAction(currentAction.id!, currentAction, email!, token);
                const updatedContact = { ...contact, actions: contact.actions?.map(action => action.id === currentAction.id ? currentAction : action) }
                dispatch(setContact(updatedContact));
                dispatch(setIsModalOpen(false));
            }))
        }, [contact, dispatch, email, token])

        return (
            <List
                dataSource={sortedActions}
                renderItem={(action: Action) => (
                    <>
                        <h4>{format(new Date(action.timestamp), 'dd MMM yyyy') + " - " + action.event}</h4>
                        <List.Item
                            key={action.id} actions={[
                                <Button
                                    key="list-loadmore-delete"
                                    onClick={() => handleDeleteAction(action)}
                                    icon={<DeleteFilled />}
                                />,
                                <Button
                                    key="list-loadmore-edit"
                                    onClick={async () => {
                                        dispatch(setAction(action));
                                        handleEditAction();
                                    }}
                                    icon={<EditOutlined />}
                                />,
                                <Button
                                    key="list-loadmore-edit"
                                    href={action.actionLink}
                                    icon={<EyeOutlined />}
                                />
                            ]
                            }>
                            <List.Item.Meta
                                description={stripContactLink(action.action)}
                            />

                        </List.Item>
                    </>
                )}
            />
        )
    }

export default ActionsList
