import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppstoreAddOutlined, BookOutlined, BorderlessTableOutlined, PhoneOutlined, ProfileOutlined, RobotOutlined, SearchOutlined, ThunderboltFilled, UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import './NavigationTabs.css';
import { ActiveRouteKey } from '@redux/features/activeEntitiesSlice';

const NavigationTabs: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const navigate = useNavigate();
  const activeRouteKey = useSelector(
    (state: RootState) => state.activeEntities.appBarActiveKey
  );

  const returnTabsUIClassName = (routeKey: string) =>
    `tabUI ${activeRouteKey.includes(routeKey) ? "active" : ""}`;

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  return (
    <div>
      <div style={{ background: "#13345D" }}>
        <div
          className={returnTabsUIClassName(ActiveRouteKey.CALLS)}
          onClick={() => handleNavigation(`/${ActiveRouteKey.CALLS}`)}
        >
          <PhoneOutlined />
          {!collapsed && <span>Calls</span>}
        </div>
        <div
          className={returnTabsUIClassName(ActiveRouteKey.AGENTS)}
          onClick={() => handleNavigation(`/${ActiveRouteKey.AGENTS}`)}
        >
          <RobotOutlined />
          {!collapsed && <span>Agents</span>}
        </div>
        <div
          className={returnTabsUIClassName(ActiveRouteKey.TRACKING)}
          onClick={() => handleNavigation(`/${ActiveRouteKey.PLAYBOOKS}/6742410fd9d6a55409a6db48`)}
        >
          <SearchOutlined />
          {!collapsed && <span>Tracking</span>}
        </div>
        {/* <div
          className={returnTabsUIClassName(ActiveRouteKey.MEETINGS)}
          onClick={() => handleNavigation(`/${ActiveRouteKey.MEETINGS}`)}
        >
          <ProfileOutlined />
          {!collapsed && <span>Meetings</span>}
        </div>
        <div
          className={returnTabsUIClassName(ActiveRouteKey.SEARCH)}
          onClick={() => handleNavigation(`/${ActiveRouteKey.SEARCH}`)}
        >
          <ThunderboltFilled />
          {!collapsed && <span>AI Search</span>}
        </div>
        <div
          className={returnTabsUIClassName(ActiveRouteKey.TOPICS)}
          onClick={() => handleNavigation(`/${ActiveRouteKey.TOPICS}`)}
        >
          <BorderlessTableOutlined />
          {!collapsed && <span>Topics</span>}
        </div>
        <div
          className={returnTabsUIClassName(ActiveRouteKey.PLAYBOOKS)}
          onClick={() => handleNavigation(`/${ActiveRouteKey.PLAYBOOKS}`)}
        >
          <BookOutlined />
          {!collapsed && <span>Guides</span>}
        </div> */}
        <div
          className={returnTabsUIClassName(ActiveRouteKey.INTEGRATIONS)}
          onClick={() => handleNavigation(`/${ActiveRouteKey.INTEGRATIONS}`)}
        >
          <AppstoreAddOutlined />
          {!collapsed && <span>Integrations</span>}
        </div>
      </div>
    </div>
  );
};

export default NavigationTabs;
