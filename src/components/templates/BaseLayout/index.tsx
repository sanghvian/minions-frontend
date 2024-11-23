import { Layout } from 'antd';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/redux/store';
import { useEffect } from 'react';
import { pushEvent } from '@utils/analytics';
import { ActiveRouteKey, setActiveRouteKey } from '@redux/features/activeEntitiesSlice';
import './BaseLayout.css';
import Sider from 'antd/es/layout/Sider';
import Link from 'antd/es/typography/Link';


const { Header, Content } = Layout;

interface BaseLayoutProps {
    center: React.ReactNode;
    left: React.ReactNode;
    right: React.ReactNode;
    top: React.ReactNode;
    routeKey?: ActiveRouteKey
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ top, left, center, right, routeKey }) => {
    const dispatch: AppDispatch = useDispatch()
    useEffect(() => {
        if (routeKey) {
            pushEvent('UserPageView', { pageName: routeKey });
            dispatch(setActiveRouteKey(routeKey));
        }
    }, [dispatch, routeKey])
    return (
        <Layout className={'ant-layout-has-sider'} >
            <Sider style={{ overflow: "hidden", height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}>
                {left}
            </Sider>
            <Layout style={{ marginLeft: 200 }} className="site-layout">
                {/* <Header className="site-layout-background" style={{ padding: 0 }} >
                    {top}
                </Header> */}
                <Content className={'mapContainer'}>
                    {center}
                    {right}
                </Content>
            </Layout>
        </Layout>
    );
};

export default BaseLayout;
