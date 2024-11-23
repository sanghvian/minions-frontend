import { BookOutlined, HomeOutlined, TeamOutlined, ThunderboltFilled } from '@ant-design/icons';
import { ActiveRouteKey, setActiveQueryString, setActiveRouteKey } from '@redux/features/activeEntitiesSlice';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { useNavigate } from 'react-router-dom';
import './TabsBar.css'
import { CheckCircleOutline } from 'antd-mobile-icons';

const TabsBar = () => {
    const { appBarActiveKey } = useSelector((state: RootState) => state.activeEntities)
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const tabs = [
        {
            key: ActiveRouteKey.SEARCH2,
            title: 'AI Search',
            icon: <ThunderboltFilled />,
        },
        // {
        //     key: ActiveRouteKey.SEARCH2,
        //     title: 'AI Chat (Beta)',
        //     icon: <MessageOutlined />,
        // },
        {
            key: ActiveRouteKey.CONTACTS,
            title: 'Contacts',
            icon: <TeamOutlined />
        },
        {
            key: ActiveRouteKey.HOME,
            title: 'Home',
            icon: <HomeOutlined />
        },
        {
            key: ActiveRouteKey.ACTIONS,
            title: 'Calendar',
            icon: <CheckCircleOutline />
        },
        // {
        //     key: ActiveRouteKey.GROUPS,
        //     title: 'Groups',
        //     icon: <ProfileOutlined />,
        // },
        {
            key: ActiveRouteKey.PLAYBOOKS,
            title: 'Playbooks',
            icon: <BookOutlined />,
        },
    ]
    const handleTabClick = (key: string) => {
        dispatch(setActiveQueryString(''));
        navigate(`/${key}`)
        dispatch(setActiveRouteKey(key as ActiveRouteKey))
    }
    return (
        <div
            className='tabs-bar'
            style={{ position: 'fixed', bottom: 0, width: '100%' }}
        >
            {tabs.map((item, i: number) => (
                <Button
                    key={i}
                    onClick={() => handleTabClick(item.key)}
                    className={
                        `tab-item ${appBarActiveKey === item.key ? 'active' : ''}`}
                    icon={item.icon}
                >
                    <p className='tab-title'>{item.title}</p>
                </Button>
            ))}
        </div>
    )
}

export default TabsBar
