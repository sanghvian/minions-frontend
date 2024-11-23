import { BookOutlined, CheckCircleOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { ActiveRouteKey, BottomSheetType, setActivePlaybookId, setActiveQueryString, setActiveRouteKey, setBottomSheetType, setIsBottomSheetOpen } from '@redux/features/activeEntitiesSlice';
import { AppDispatch, RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import { AutoComplete, Button, Checkbox, Dropdown, FloatButton, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import './PlaybooksListPage.css'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { initialContactState, setActiveContacts } from '@redux/features/contactSlice';
import { initialPlaybookState, setActivePlaybook, setPlaybooksList } from '@redux/features/playbookSlice';
import { Template } from '@models/template.model';
import { useDimensions } from '@hooks/useDimensions';
import BaseLayout from '@components/templates/BaseLayout';
import DashboardTopActionBar from '@components/organisms/DashboardTopActionBar';
import LeftSider from '@components/templates/LeftSider';
import NavigationsTabs from '@components/organisms/NavigationTabs';
import RightDrawer from '@components/templates/RightDrawer';
import MasterAIChatBar from '@components/molecules/MasterAIChatBar';
import { Contact } from '@models/contact.model';
import { PlaybookItem } from '@components/atoms/PlaybookItem';

const PlaybooksListPage = () => {
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
    const playbooksList = useSelector((state: RootState) => state.playbook.playbooksList);
    const [searchQuery, setSearchQuery] = useState('');
    const { isLoading } = useQuery({
        queryKey: ["getAllUserPlaybooks", email, token],
        queryFn: async ({ queryKey }) => {
            if (!queryKey[1]) return null;
            const playbooksReturned = await apiService.getAllUserTemplates(queryKey[1], queryKey[2]!);
            const playbooks = [...playbooksReturned]?.sort((a: Template, b: Template) => a.name.localeCompare(b.name)) as Template[]
            dispatch(setPlaybooksList(playbooks))
            return;
        },
    }); const dispatch: AppDispatch = useDispatch();
    const handleDelete = async (pb: Template) => {
        toast.promise(
            apiService.deleteTemplate(pb._id!, token),
            {
                loading: '🗑️ Deleting Playbook...',
                success: <b>Playbook deleted!</b>,
                error: <b>Could not delete.</b>,
            }
        )
        pushEvent('DeletePlaybook', { playbook: pb })
        const filteredPlaybooks = (playbooksList as Template[]).filter((pbook: Template) => pbook._id !== pb._id)
        dispatch(setPlaybooksList(filteredPlaybooks))
    }
    useEffect(() => {
        pushEvent('UserPageView', { pageName: 'PlaybooksListPage' });
        dispatch(setActiveRouteKey(ActiveRouteKey.PLAYBOOKS));
        if (playbooksList && playbooksList?.length > 0) {
            dispatch(setPlaybooksList(playbooksList));
        }
    }, [dispatch]);

    // Filter playbooks based on search query
    const filteredPlaybooks = searchQuery === ''
        ? playbooksList
        : (playbooksList as Template[]).filter(pb => pb.name.toLowerCase().includes(searchQuery.toLowerCase()));

    // Handle search input change
    const onSearch = (value: string) => {
        pushEvent('SimpleSearchInPlaybooksList', { searchQuery: value })
        setSearchQuery(value);
    };

    const handleAddClick = () => {
        dispatch(setActiveQueryString(''))
        dispatch(setIsBottomSheetOpen(true))
        dispatch(setActiveContacts([]))
        dispatch(setBottomSheetType(BottomSheetType.PLAYBOOK_ADD))
        dispatch(setActivePlaybook(initialPlaybookState.activePlaybook))
    }

    const { isMobile } = useDimensions()

    return (
        isMobile ?
            // Entry to Mobile UI
            isLoading ? <Spin /> : <div className='playbooks-page'>
                <h2>Playbook</h2>
                <AutoComplete
                    style={{ width: '95%', marginBottom: 16 }}
                    onSearch={onSearch}
                    placeholder="Search playbooks"
                    size="large"
                />
                <div className="playbooks-list">
                    {filteredPlaybooks.map((item: Template, i: number) => (
                        <PlaybookItem item={item} key={i} handleDelete={handleDelete} />
                    ))}
                </div>
                <FloatButton
                    type="primary"
                    style={{ bottom: 100 }}
                    icon={<BookOutlined />}
                    onClick={handleAddClick}
                />
            </div> :
            // Entry to desktop UI
            <BaseLayout
                top={<DashboardTopActionBar />}
                center={isLoading ? <Spin /> :
                    <>
                        <AutoComplete
                            style={{ width: '95%', marginBottom: 16 }}
                            onSearch={onSearch}
                            placeholder="Search playbooks"
                            size="large"
                        />
                        <div className="playbooks-list">
                            {filteredPlaybooks.map((item: Template, i: number) => (
                                <PlaybookItem item={item} key={i} handleDelete={handleDelete} />
                            ))}
                        </div>
                        <Button
                            type="primary"
                            style={{ bottom: 100 }}
                            icon={<BookOutlined />}
                            onClick={handleAddClick}
                        />
                    </>}
                left={<LeftSider />}
                right={<RightDrawer children={

                    <MasterAIChatBar presetContact={initialContactState.value as unknown as Contact} />
                }
                />}
            />


    )
}

export default PlaybooksListPage
