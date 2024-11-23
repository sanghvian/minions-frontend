import { useState, useEffect, useCallback } from 'react';
import './ContactsListDashboard.css';
import { Spin, AutoComplete, FloatButton } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@redux/store';
import {
    setActiveRouteKey,
    ActiveRouteKey,
    setActiveQueryString,
    setIsBottomSheetOpen,
    setBottomSheetType,
    BottomSheetType,
    setSearchType,
    SearchType,
    setActiveMenuPropItemsGetterFunc
} from '@redux/features/activeEntitiesSlice';
import { useQuery } from 'react-query';
import apiService from '@utils/api/api-service';
import ContactList from '@components/molecules/ContactList';
import { Contact } from '@models/contact.model';
import { setFixedContacts } from '@redux/features/contactsListSlice';
import { initialContactState, setContact } from '@redux/features/contactSlice';
import { DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { pushEvent } from '@utils/analytics';
import toast from 'react-hot-toast';
import ContactPageViewCategories from '@components/molecules/ContactPageViewCategories';
import { RecordType } from '@models/index';
import GroupsListPage from '../../pages/GroupsListPage';

const ContactsListDashboard = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const contacts = useSelector((state: RootState) => state.persisted.contactsList.value);
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
    const dispatch: AppDispatch = useDispatch();
    const [pageFilter, setPageFilter] = useState<RecordType>(RecordType.CONTACT);

    const { isLoading } = useQuery({
        queryKey: ["getAllUserContacts", email, token],
        queryFn: async ({ queryKey }) => {
            if (!queryKey[1]) return null;
            if (contacts?.length > 0) return contacts;
            const userContactsList = await apiService.getAllUserContacts(queryKey[1], queryKey[2]!);
            dispatch(setFixedContacts(userContactsList));
        },
    });
    const handleDelete = useCallback(async (c: Contact) => {
        toast.promise(
            apiService.deleteContact(c.id!, email, token),
            {
                loading: '🗑️ Deleting...',
                success: <b>Contact deleted!</b>,
                error: <b>Could not delete.</b>,
            }
        )
        pushEvent('DeleteContact', { contact: c })
        const filteredContacts = contacts.filter((contact: Contact) => contact.id !== c.id)
        dispatch(setFixedContacts(filteredContacts))
        dispatch(setActiveMenuPropItemsGetterFunc(() => []))
    }, [contacts, dispatch, email, token])




    useEffect(() => {
        pushEvent('UserPageView', { pageName: 'ContactsListDashboard' });
        dispatch(setActiveRouteKey(ActiveRouteKey.CONTACTS));
        dispatch(setActiveMenuPropItemsGetterFunc((c: Contact) => [
            {
                label: <p onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleDelete(c)
                }}>Delete</p>,
                key: '0',
                icon: <DeleteOutlined />
            }
        ]))
    }, [handleDelete, dispatch]);

    // Filter contacts based on search query
    const filteredContacts = searchQuery === ''
        ? contacts
        : contacts.filter((contact: Contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()));

    // Handle search input change
    const onSearch = (value: string) => {
        pushEvent('SimpleSearchInContactsList', { searchQuery: value })
        setSearchQuery(value);
    };

    const handleAddClick = () => {
        // Users use search functionality in multiple pages and when user switches pages, ideally, they don't want to carry over the old search string, so this makes sense
        dispatch(setActiveQueryString(''))
        dispatch(setSearchType(SearchType.EXTERNAL))
        dispatch(setIsBottomSheetOpen(true))
        dispatch(setContact(initialContactState.value.activeContact!))
        dispatch(setBottomSheetType(BottomSheetType.SEARCH_ADD))
    }

    return (
        isLoading ? <Spin /> :
            <>
                {pageFilter === RecordType.CONTACT ?
                    (<div className='contacts-page'>
                        <div className="sticky-header">
                            <AutoComplete
                                style={{
                                    width: '95%',
                                    marginBottom: '16px',

                                }}
                                onSearch={onSearch}
                                placeholder="Search contacts"
                                size="large"
                            />
                        </div>
                        <div className="scrollable-content">
                            <h2>My Contacts</h2>
                            <ContactList contacts={filteredContacts} />
                        </div>
                        <FloatButton
                            type="primary"
                            style={{ bottom: 100 }}
                            icon={<UserAddOutlined />}
                            onClick={handleAddClick}
                        />
                    </div>)
                    : <GroupsListPage />}
                <ContactPageViewCategories
                    activeFilter={pageFilter}
                    setActiveFilter={setPageFilter}
                />
            </>
    )
}

export default ContactsListDashboard
