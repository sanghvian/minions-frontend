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
import { Card, Row, Col, Typography } from 'antd';
import { CardProps } from 'antd/lib/card';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;
const { Title } = Typography;

const AgentsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const voiceAgents = useSelector((state: RootState) => state.persisted.voiceAgents.voiceAgents);
  const navigate = useNavigate();

  useEffect(() => {
    pushEvent('UserPageView', { pageName: 'AgentsPage' });
    dispatch(setActiveRouteKey(ActiveRouteKey.AGENTS));
    dispatch(setContact(initialContactState.value.activeContact));
    dispatch(setActiveQueryString(''));
  }, [dispatch]);

  const handleCardClick = (id: string) => {
    navigate(`/${ActiveRouteKey.AGENTS}/${id}`);
  };

  return (
    <BaseLayout
      top={<DashboardTopActionBar />}
      center={
        <div style={{ padding: "1.2rem 2rem" }}>
          <Title level={2}>My Agents</Title>
          <Row gutter={[16, 16]} justify="center">
            {voiceAgents.map((agent, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
                <Card
                  hoverable
                  onClick={() => handleCardClick(agent.id)}
                  style={{ borderRadius: '10px' }}
                  cover={<img alt="example" src={agent.imgUrl} />} // Placeholder image
                >
                  <Meta title={agent.name} description={agent.description} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
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

export default AgentsPage;
