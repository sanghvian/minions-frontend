import React from 'react';
import { Avatar, Typography, Space, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { initialUserState, setUser } from '@redux/features/userSlice';
import './AccountDashboard.css'; // Ensure you have this CSS file for styles

const AccountDashboard: React.FC = () => {
    const user = useSelector((state: RootState) => state.persisted.user.value);
    const dispatch = useDispatch();
    return (
        <div className="dashboard">
            <div className="user-info">
                <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    src={user.photoURL}
                    className="avatar"
                />
                <Typography.Title level={3}>
                    {user.name || 'User'}
                </Typography.Title>

                <Space direction="vertical" className="details">
                    <Typography.Text>Email: {user.email}</Typography.Text>
                </Space>
            </div>

            <Button
                onClick={() => {
                    dispatch(setUser(initialUserState.value));
                    window.location.reload();
                }}
                className="logout-button"
            >
                Logout
            </Button>
            <div className="links">
                <a href="https://www.youtube.com/@getrecontact">Video Tutorials</a>
                <a href="https://recontact.world/privacy">Privacy Policy</a>
                <a href="https://recontact.world/tos">Terms of Service</a>
            </div>
            <p className="version">Recontact v9</p>
        </div>
    );
};

export default AccountDashboard;
