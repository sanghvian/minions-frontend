import { AppDispatch } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { initialContactState } from '@redux/features/contactSlice';
import BaseLayout from '@components/templates/BaseLayout';
import DashboardTopActionBar from '@components/organisms/DashboardTopActionBar';
import LeftSider from '@components/templates/LeftSider';
import RightDrawer from '@components/templates/RightDrawer';
import MasterAIChatBar from '@components/molecules/MasterAIChatBar';
import { Contact } from '@models/contact.model';
import FirefliesAccountDashboard from '../FirefliesAccountDashboard';



const FirefliesIntegrationPage = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    pushEvent('UserPageView', { pageName: 'FirefliesIntegrationPage' });
  }, [dispatch]);

  return (
    // Entry to desktop UI
    <BaseLayout
      top={<DashboardTopActionBar />}
      center={<FirefliesAccountDashboard />}
      left={<LeftSider />}
      right={
        <RightDrawer
          children={
            <MasterAIChatBar
              presetContact={initialContactState.value as unknown as Contact}
            />
          }
        />
      }
    />
  );
}



export default FirefliesIntegrationPage
