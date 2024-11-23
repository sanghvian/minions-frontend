import TopActionMenu from '@components/templates/TopActionBar'
import { Avatar, Button, Menu } from 'antd'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/redux/store'
import { initialUserState, setUser } from '@redux/features/userSlice'
import './DashboardContainerTopActionBar.css'
import { StarOutlined } from '@ant-design/icons'
import { ActiveRouteKey, setActiveRouteKey, setRightDrawerOpen } from '@redux/features/activeEntitiesSlice'
import { useNavigate } from 'react-router-dom'

const DashboardTopActionBar = () => {
    const dispatch: AppDispatch = useDispatch()
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.persisted.user.value);
    return (
        !currentUser
            ? <div>Loading...</div>
            : (<TopActionMenu
                style={{ backgroundColor: '#13345D' }}
                mode="horizontal" theme='dark'>
                <div className={'topActionBar'}>
                    <div className={'referenceLinks'}>
                    </div>
                    <div>
                        {/* <Button
                            type="primary"
                            onClick={() => {
                                dispatch(setRightDrawerOpen(true))
                            }}
                            icon={<StarOutlined />}
                        >
                            AI Chat
                        </Button> */}
                        <Menu.SubMenu
                            title={
                                currentUser?.photoURL
                                    ? <Avatar src={currentUser?.photoURL} size="large" />
                                    :
                                    <Avatar
                                        style={{
                                            backgroundColor: '#f56a00',
                                            verticalAlign: 'middle'
                                        }}
                                        size="large"
                                    >
                                        {currentUser!.name!.toUpperCase()[0] || 'U'}
                                    </Avatar>
                            }>
                            <Menu.Item key="username" >
                                {currentUser?.email || 'User'}
                            </Menu.Item>
                            <Menu.Item>
                                <Button onClick={() => {
                                    navigate(`/account`)
                                    dispatch(setActiveRouteKey(ActiveRouteKey.ACCOUNT))
                                }}>
                                    View Account
                                </Button>
                            </Menu.Item>
                            <Menu.Item>
                                <Button onClick={() => {
                                    dispatch(setUser(initialUserState.value))
                                    window.location.reload()
                                }}>
                                    Logout
                                </Button>
                            </Menu.Item>
                        </Menu.SubMenu>
                    </div>
                </div>
            </TopActionMenu>)
    )
}

export default DashboardTopActionBar
