import { DeleteOutlined, MoreOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Group } from '@models/group.model';
import { ActiveRouteKey, BottomSheetType, setActiveQueryString, setActiveRouteKey, setBottomSheetType, setIsBottomSheetOpen } from '@redux/features/activeEntitiesSlice';

import { AppDispatch, RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import { AutoComplete, Dropdown, FloatButton, Spin } from 'antd';
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import './GroupsListPage.css'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { initialGroupState, setGroup, setGroups } from '@redux/features/groupSlice';
import { setActiveContacts } from '@redux/features/contactSlice';

const GroupsListPage = () => {
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
    const sortedGroups = useSelector((state: RootState) => state.group.groupsList);
    const [searchQuery, setSearchQuery] = useState('');
    const { isLoading } = useQuery({
        queryKey: ["getAllUserGroups", email, token],
        queryFn: async ({ queryKey }) => {
            if (!queryKey[1]) return null;
            const groupsReturned = await apiService.getAllUserGroups(queryKey[1], queryKey[2]!);
            const sortedGroups = [...groupsReturned]?.sort((a: Group, b: Group) => a.name.localeCompare(b.name)) as Group[]
            dispatch(setGroups(sortedGroups))
            return;
        },
    });

    const dispatch: AppDispatch = useDispatch();
    const handleDelete = async (g: Group) => {
        toast.promise(
            apiService.deleteGroup(g.id!, email, token),
            {
                loading: '🗑️ Deleting group...',
                success: <b>Group deleted!</b>,
                error: <b>Could not delete.</b>,
            }
        )
        pushEvent('DeleteGroup', { group: g })
        const filteredGroups = (sortedGroups as Group[]).filter((group: Group) => group.id !== g.id)
        dispatch(setGroups(filteredGroups))
    }
    useEffect(() => {
        pushEvent('UserPageView', { pageName: 'GroupsListPage' });
        dispatch(setActiveRouteKey(ActiveRouteKey.GROUPS));
        if (sortedGroups && sortedGroups?.length > 0) {
            dispatch(setGroups(sortedGroups));
        }
    }, [sortedGroups, dispatch]);

    // Filter groups based on search query
    const filteredGroups = searchQuery === ''
        ? sortedGroups
        : (sortedGroups as Group[]).filter(group => group.name.toLowerCase().includes(searchQuery.toLowerCase()));

    // Handle search input change
    const onSearch = (value: string) => {
        pushEvent('SimpleSearchInGroupsList', { searchQuery: value })
        setSearchQuery(value);
    };

    const handleAddClick = () => {
        dispatch(setActiveQueryString(''))
        dispatch(setIsBottomSheetOpen(true))
        dispatch(setActiveContacts([]))
        dispatch(setBottomSheetType(BottomSheetType.GROUP_ADD))
        dispatch(setGroup(initialGroupState.activeGroup))
    }

    return (
        isLoading ? <Spin /> : <div className='groups-page'>
            <h2>My Groups</h2>
            <AutoComplete
                style={{ width: '95%', marginBottom: 16 }}
                onSearch={onSearch}
                placeholder="Search groups"
                size="large"
            />
            <div className="groups-list">
                {filteredGroups.map((item: Group, i: number) => (
                    <GroupItem item={item} key={i} handleDelete={handleDelete} />
                ))}
            </div>
            <FloatButton
                type="primary"
                style={{ bottom: 100 }}
                icon={<UsergroupAddOutlined />}
                onClick={handleAddClick}
            />
        </div>
    )
}

const GroupItem = ({ item, key, handleDelete }: { item: any, key: number, handleDelete: (item: any) => void }) => {
    const [isVisible, setIsVisible] = useState(false);

    const navigate = useNavigate();
    return (
        <div key={key} className="groupItemContainerWrapper" onClick={() => {
            navigate(`/${ActiveRouteKey.GROUPS}/${item.id}`)
        }}>
            <div className='groupItemContainer'  >
                <h4 className='group-title'>{item?.name}</h4>
                <div>{item.description}</div>
                {/* <div className='interests-container'>
                    {item.interests.map(interest => (
                        <Tag color="blue" key={interest}>{interest}</Tag>
                    ))}
                </div> */}
            </div>
            <Dropdown menu={{
                items: [
                    {
                        label: <p onClick={(e: any) => {
                            e.stopPropagation()
                            e.preventDefault()
                            handleDelete(item)
                            setIsVisible(false)
                        }}>Delete</p>,
                        key: '0',
                        icon: <DeleteOutlined />
                    }
                ]
            }}
                open={isVisible}
                trigger={['click']}>
                <MoreOutlined onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setIsVisible(!isVisible)
                }} color='#fff' />
            </Dropdown>
        </div>
    )
}

export default GroupsListPage
