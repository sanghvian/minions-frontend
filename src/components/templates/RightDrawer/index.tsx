
import { setRightDrawerOpen } from '@redux/features/activeEntitiesSlice';
import { Drawer, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/redux/store';

interface RightDrawerProps {
    children: React.ReactNode
}

const { Title } = Typography

const RightDrawer: React.FC<RightDrawerProps> = ({ children }) => {
    //   const activeCourse = useSelector((state:RootState)=> state.activeEntities.course);
    //   const { name } = activeCourse?.data ?? {};
    const drawerOpen = useSelector((state: RootState) => state.activeEntities.rightDrawerOpen)
    const dispatch: AppDispatch = useDispatch()
    return (
        <Drawer
            placement="right"
            closable
            onClose={() => dispatch(setRightDrawerOpen(false))}
            visible={drawerOpen}
            getContainer={false}
            style={{ position: 'absolute' }}
            maskClosable={false}
            mask={false}
            title={<Title level={5}>AI Chat</Title>}
        >
            {children}
        </Drawer>
    );
};

export default RightDrawer;
