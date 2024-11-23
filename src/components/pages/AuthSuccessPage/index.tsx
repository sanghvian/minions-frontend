import MasterAIChatBar from '@components/molecules/MasterAIChatBar';
import DashboardTopActionBar from '@components/organisms/DashboardTopActionBar';
import NavigationsTabs from '@components/organisms/NavigationTabs';
import BaseLayout from '@components/templates/BaseLayout';
import LeftSider from '@components/templates/LeftSider';
import RightDrawer from '@components/templates/RightDrawer';
import { Contact } from '@models/contact.model';
import { initialContactState } from '@redux/features/contactSlice';
import { setTokenInfo } from '@redux/features/userSlice';
import { AppDispatch } from '@redux/store';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

const AuthSuccessPage: React.FC = () => {
    const location = useLocation();
    const dispatch: AppDispatch = useDispatch();

    // Function to parse query params into an object
    const getQueryParams = () => {
        return location.search
            ? JSON.parse('{"' + decodeURI(location.search.substring(1).replace(/&/g, '","').replace(/=/g, '":"')) + '"}', function (key, value) { return key === "" ? value : decodeURIComponent(value) })
            : {};
    };

    const queryParams = getQueryParams();

    useEffect(() => {
        dispatch(setTokenInfo(queryParams))
    }, [queryParams])

    return (
        <BaseLayout
            left={<LeftSider />}
            right={<RightDrawer children={
                <MasterAIChatBar
                    presetContact={
                        initialContactState.value as unknown as Contact}
                />
            } />}
            top={<DashboardTopActionBar />}
            center={
                <div>
                    <h2> ✅ Authentication Successful</h2>
                    <pre>{JSON.stringify(queryParams, null, 2)}</pre>
                </div>
            }
        />

    );
};

export default AuthSuccessPage;
