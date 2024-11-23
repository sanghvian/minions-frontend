import { AppDispatch } from '@redux/store';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { ActiveRouteKey, setActiveRouteKey } from '@redux/features/activeEntitiesSlice';
import { pushEvent } from '@utils/analytics';
import { initialPlaybookState, setActivePlaybook } from '@redux/features/playbookSlice';
import BaseLayout from '@components/templates/BaseLayout';
import LeftSider from '@components/templates/LeftSider';
import RightDrawer from '@components/templates/RightDrawer';
import MasterAIChatBar from '@components/molecules/MasterAIChatBar';
import { initialContactState } from '@redux/features/contactSlice';
import { Contact } from '@models/contact.model';
import DashboardTopActionBar from '@components/organisms/DashboardTopActionBar';
import PlaybookDashboard from '@components/organisms/PlaybookDashboard';

const PlaybookPage = () => {
    const dispatch: AppDispatch = useDispatch()
    useEffect(() => {
        pushEvent('UserPageView', { pageName: 'IndividualPlaybookPage' });
        dispatch(setActiveRouteKey(ActiveRouteKey.PLAYBOOKS))
        return () => {
            setActivePlaybook(initialPlaybookState.activePlaybook)
        }
    }, [dispatch]);

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
            center={<PlaybookDashboard />}
        />
    )
}

export default PlaybookPage;
