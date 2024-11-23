import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { setActiveRouteKey, ActiveRouteKey, setActiveQueryString } from '@redux/features/activeEntitiesSlice';
import { pushEvent } from '@utils/analytics';
import { initialContactState, setContact } from '@redux/features/contactSlice';
import BaseLayout from '@components/templates/BaseLayout';
import DashboardTopActionBar from '@components/organisms/DashboardTopActionBar';
import LeftSider from '@components/templates/LeftSider';
import RightDrawer from '@components/templates/RightDrawer';
import MasterAIChatBar from '@components/molecules/MasterAIChatBar';
import { Contact } from '@models/contact.model';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import IndividualAgentPageDashboard from '@components/organisms/IndividualAgentPageDashboard';


const IndividualAgentPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    pushEvent('UserPageView', { pageName: 'IndividualAgentPage' });
    dispatch(setActiveRouteKey(ActiveRouteKey.CALLS));
    dispatch(setContact(initialContactState.value.activeContact));
    dispatch(setActiveQueryString(''));
  }, [dispatch]);

  return (
    <BaseLayout
      top={<DashboardTopActionBar />}
      center={
        <IndividualAgentPageDashboard />
      }
      left={<LeftSider />}
      right={
        <RightDrawer>
          <MasterAIChatBar presetContact={initialContactState.value as unknown as Contact} />
        </RightDrawer>
      }
    />
  );
};

export default IndividualAgentPage;
