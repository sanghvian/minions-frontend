import { CheckCircleFilled } from '@ant-design/icons';
import { Contact } from '@models/contact.model';
import { setActiveQueryString, setIsBottomSheetOpen } from '@redux/features/activeEntitiesSlice';
import { AppDispatch, RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import { Button, Form, Input, Tabs, TabsProps } from 'antd';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import apiService from '@utils/api/api-service';
import './SearchAndEditGroup.css'
import { Group } from '@models/group.model';
import { setActiveContacts } from '@redux/features/contactSlice';
import { addGroupToList, initialGroupState, setGroup } from '@redux/features/groupSlice';
import toast from 'react-hot-toast';
import NewMembersSearchList from '@components/organisms/NewMembersSearchList';
import ManageGroupMembersList from '../ManageGroupMembersList';

const SearchAndEditGroup = () => {
    const { bottomSheetType } = useSelector((state: RootState) => state.activeEntities);
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch();
    const group = useSelector((state: RootState) => state.group.activeGroup);
    const contacts = useSelector((state: RootState) => state.contact.value.activeContacts);
    const currentGroupContacts = group?.contacts.length > 0 ? group?.contacts
        : contacts;

    // Check if we are adding a new group or editing an existing one
    const isEditingGroup = currentGroupContacts.length > 0;

    const [form] = Form.useForm();
    const [newGroup, setNewGroup] = useState<Group>(group);

    useEffect(() => {
        dispatch(setActiveQueryString(''))
        if (isEditingGroup) {
            // Preparing the stage for group edit-mode
            dispatch(setActiveContacts(currentGroupContacts))
        } else {
            // Preparing the stage for group add-mode
            setNewGroup(initialGroupState.activeGroup)

        }
    }, [currentGroupContacts, isEditingGroup, bottomSheetType, dispatch])


    const onFinish = async () => {
        const startTime = new Date().getTime();
        setIsLoading(true);
        try {
            // Flow to actually create a group using form values and the attached contactIds = newContactIds + updatedContactIds
            const contactIds = contacts.map((contact: Contact) => contact.id!);
            let finalGroup = {
                id: newGroup.id,
                name: newGroup.name,
                recordType: newGroup.recordType,
                description: newGroup.description,
                timestamp: new Date().toISOString(),
                contactIds
            };
            // First check whether, based on the current group's id, we are updating an existing group or creating a new one
            if (group.id) {
                const toastId = toast.loading('Updating group...');
                await apiService.updateGroup(group.id, finalGroup, email!, token);
                pushEvent('GroupUpdated', { groupId: group.id });
                toast.success('Group updated!', { id: toastId });
            } else {
                const toastId = toast.loading('Creating group...');
                finalGroup = await apiService.createGroup(finalGroup, email!, token);
                const endTime = new Date().getTime();
                pushEvent('NewGroupCreated', { responseTime: (endTime - startTime) / 1000 });
                toast.success('Group created!', { id: toastId });
            }
            dispatch(setActiveContacts([]));
            dispatch(setGroup({ ...finalGroup, contacts }));
            dispatch(addGroupToList(finalGroup));
            setIsLoading(false);
            form.resetFields();
            dispatch(setIsBottomSheetOpen(false));



        } catch (error) {
            // Handle error
            console.error(error);
        }
    };
    const handleChange = (changedFields: Partial<Group>, fieldEdited: "name" | "description") => {
        setNewGroup({ ...newGroup, ...changedFields });
        pushEvent('UpdateGroupFieldWhileAdding', { fieldEdited });
    }

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Add New Members',
            children: <NewMembersSearchList />,
        },
        {
            key: '2',
            label: 'Manage Current Members',
            children: <ManageGroupMembersList results={currentGroupContacts} />,
        }
    ];

    return (
        <>
            <Form form={form} onFinish={onFinish}>
                <Form.Item label="Given Name">
                    <Input onChange={(e) => handleChange(
                        { name: e.target.value as string }, "name")
                    }
                        defaultValue={newGroup.name}
                    />
                </Form.Item>
                <Form.Item label="Short Description">
                    <Input onChange={(e) => handleChange(
                        { description: e.target.value as string }, "description")}
                        defaultValue={newGroup.description}
                    />
                </Form.Item>
            </Form>
            <Tabs defaultActiveKey={isEditingGroup ? "2" : "1"} items={items} />
            <br /><br /><br /><br /><br /><br /><br /><br />
            <div className="bottomBar">
                {/* Simple div that is a gradient from clear to pure white and has height of 5rem to show the user that the list is scrollable */}
                <div style={{
                    width: '100%',
                    height: '6rem',
                    background: 'linear-gradient(180deg, transparent 0%, #fff 80%)',
                }} />
                <div className="bottomActionsWrapper">
                    <div className="bottomActionContainer" >
                        <Button
                            loading={isLoading}
                            icon={<CheckCircleFilled />} key="search" type="default" onClick={() => form.submit()}
                        >
                            Submit Group
                        </Button>&nbsp;&nbsp;
                        <br />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchAndEditGroup