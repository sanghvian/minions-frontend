import { UserOutlined } from '@ant-design/icons';
import { User, UserStatus } from '@models/user.model';
import { ActiveRouteKey, setActiveRouteKey } from '@redux/features/activeEntitiesSlice';
import { AppDispatch, RootState } from '@redux/store';
import { checkUserEligibility } from '@utils/user';
import { Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './UserProfileButtonNav.css';

const UserProfileButtonNav = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const user: User = useSelector((state: RootState) => state.persisted.user.value)

    const userEligibility = checkUserEligibility(user)
    return (
        <div
            onClick={() => {
                navigate(`/account`)
                dispatch(setActiveRouteKey(ActiveRouteKey.ACCOUNT))
            }}
            className='userProfileButton'>
            {
                userEligibility === UserStatus.SUBSCRIBED ?
                    user.photoURL
                        ? <Avatar src={<img src={user.photoURL} alt="avatar" />} />
                        : <Avatar icon={<UserOutlined />} alt="avatar" />
                    : <p></p>
            }
        </div>
    )
}

export default UserProfileButtonNav
