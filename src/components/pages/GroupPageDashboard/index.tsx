import { CompleteGroup } from '@models/group.model';
import { initialGroupState, setGroup } from '@redux/features/groupSlice';
import { AppDispatch, RootState } from '@redux/store';
import apiService from '@utils/api/api-service';
import { FloatButton, Spin } from 'antd';
import { useEffect } from 'react'
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import ContactList from '@components/molecules/ContactList';
import { ActiveRouteKey, BottomSheetType, setActiveMenuPropItemsGetterFunc, setActiveQueryString, setActiveRouteKey, setBottomSheetType, setIsBottomSheetOpen } from '@redux/features/activeEntitiesSlice';
import { Contact } from '@models/contact.model';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { pushEvent } from '@utils/analytics';
import './GroupPageDashboard.css'

const GroupPageDashboard = () => {
    const location = useLocation();
    const groupId = location.pathname.split("/")[2];
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value)
    const dispatch: AppDispatch = useDispatch();
    const { isLoading } = useQuery({
        queryKey: ["getCompleteGroup", groupId, email, token],
        queryFn: async ({ queryKey }) => {
            if (!queryKey[1]) return null;
            const response = await apiService.getGroup(queryKey[1], queryKey[2]!, queryKey[3]!)
            dispatch(setGroup(response as CompleteGroup));
        },
    })
    const group = useSelector((state: RootState) => state.group.activeGroup);
    const navigate = useNavigate();

    useEffect(() => {
        pushEvent('UserPageView', { pageName: 'IndividualGroupPageDashboard' });
        dispatch(setActiveRouteKey(ActiveRouteKey.GROUPS))
        return () => {
            setGroup(initialGroupState.activeGroup)
        }
    }, [dispatch]);

    const handleEditClick = () => {
        dispatch(setActiveQueryString(''))
        dispatch(setIsBottomSheetOpen(true))
        dispatch(setBottomSheetType(BottomSheetType.GROUP_EDIT))
    }

    const handleDelete = async (c: Contact) => {
        // Take the current group object and inside it, its array of contactIds, and filter out the current contact's contactId from the list
        const updatedGroup = {
            id: group.id,
            name: group.name,
            recordType: group.recordType,
            description: group.description,
            timestamp: new Date().toISOString(),
            contactIds: group.contactIds.filter(contactId => contactId !== c.id)
        }
        const updatedContacts = group.contacts.filter(contact => contact.id !== c.id)
        toast.promise(
            apiService.updateGroup(group.id, updatedGroup, email, token),
            {
                loading: '🗑️ Removing user from group...',
                success: <b>User removed!</b>,
                error: <b>Could not remove.</b>,
            }
        )
        const updatedCompleteGroup = { ...updatedGroup, contacts: updatedContacts }
        pushEvent('RemovedUserFromGroup', { contact: c })
        dispatch(setGroup(updatedCompleteGroup))
    }

    const handleView = (c: Contact) => {
        pushEvent('ViewContactFromGroup', { contact: c })
        navigate(`/${ActiveRouteKey.CONTACTS}/${c.id}`);
    }

    useEffect(() => {
        dispatch(setActiveMenuPropItemsGetterFunc((c: Contact) => [
            {
                label: <p onClick={() => handleDelete(c)}>Remove from group</p>,
                key: '0',
                icon: <DeleteOutlined />
            },
            {
                label: <p onClick={() => handleView(c)}>View</p>,
                key: '0',
                icon: <EyeOutlined />
            }
        ]))
    })

    return (
        isLoading
            ? <Spin />
            : <div className='groupPageDashboard'>
                <h1>{group.name}</h1>
                <h4>{group.description}</h4>
                <ContactList contacts={group.contacts} />
                <FloatButton
                    type="primary"
                    style={{ bottom: 100 }}
                    icon={<EditOutlined />}
                    onClick={handleEditClick}
                />
            </div>
    )
}

export default GroupPageDashboard;
