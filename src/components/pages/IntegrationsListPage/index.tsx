import { ActiveRouteKey, setActiveRouteKey } from '@redux/features/activeEntitiesSlice';
import { AppDispatch } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import { Space, Table, TableProps } from 'antd';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import './PlaybooksDashboard.css'
import { initialContactState } from '@redux/features/contactSlice';
import BaseLayout from '@components/templates/BaseLayout';
import DashboardTopActionBar from '@components/organisms/DashboardTopActionBar';
import LeftSider from '@components/templates/LeftSider';
import RightDrawer from '@components/templates/RightDrawer';
import MasterAIChatBar from '@components/molecules/MasterAIChatBar';
import { Contact } from '@models/contact.model';
import { useNavigate } from "react-router-dom";


interface IntegrationItem {
  name: string;
  logo: string;
  description: string;
  integrationLink: string;
  pageRoute: string;
}

const IntegrationsPage = () => {
  const navigate = useNavigate()
  const dispatch: AppDispatch = useDispatch();

  const integrationsList: IntegrationItem[] = [
    // {
    //   name: 'Google Drive Integration',
    //   logo: 'https://s3.amazonaws.com/recontact.world/gdrive.png',
    //   description: 'Integrate with Google Drive to import data.',
    //   integrationLink: 'https://google.com',
    //   pageRoute: ActiveRouteKey.GDRIVE_INTEGRATION
    // },
    // {
    //   name: 'Google Sheets Integration',
    //   logo: 'https://s3.amazonaws.com/recontact.world/google-sheets-integration-logo.png',
    //   description: 'Integrate with Google Sheets to export data.',
    //   integrationLink: 'https://google.com',
    //   pageRoute: ActiveRouteKey.GSHEET_INTEGRATION
    // },
    // {
    //   name: 'Fireflies AI Integration',
    //   logo: 'https://s3.amazonaws.com/recontact.world/fireflies-integration-logo.png',
    //   description: 'Integrate with Fireflies AI to automate meeting notes.',
    //   integrationLink: 'https://fireflies.ai',
    //   pageRoute: ActiveRouteKey.FIREFLIES_INTEGRATION
    // },
    // {
    //   name: 'Notion Integration',
    //   logo: 'https://s3.amazonaws.com/recontact.world/notion-integration-logo.png',
    //   description: 'Integrate with Notion to import and export your documents.',
    //   integrationLink: 'https://notion.so',
    //   pageRoute: ActiveRouteKey.NOTION_INTEGRATION
    // },
    {
      name: 'Credgenics',
      logo: 'https://recontact-temp-recording-bucket.s3.amazonaws.com/photos/credgenics.png',
      description: 'Integrate with Credgenics to export loan intent data.',
      integrationLink: 'https://google.com',
      pageRoute: "https://credgenics.com"
    },
    {
      name: 'Creditmate',
      logo: 'https://recontact-temp-recording-bucket.s3.amazonaws.com/photos/creditmate.png',
      description: 'Integrate with Creditmate to export loan intent data.',
      integrationLink: 'https://google.com',
      pageRoute: "https://www.creditmate.in"
    },
    {
      name: 'Finnone',
      logo: 'https://recontact-temp-recording-bucket.s3.amazonaws.com/photos/finnone.png',
      description: 'Integrate with Finnone to export loan intent data.',
      integrationLink: 'https://google.com',
      pageRoute: "https://www.nucleussoftware.com/lending-home/"
    },
    {
      name: 'Sas Collect',
      logo: 'https://recontact-temp-recording-bucket.s3.amazonaws.com/photos/sascollect.png',
      description: 'Integrate with Sascollect to export loan intent data.',
      integrationLink: 'https://google.com',
      pageRoute: "https://www.sas.com/en_gb/software/optimise-debt-collections-with-sas.html"
    },
    // {
    //   name: 'Miro Integration',
    //   logo: 'https://s3.amazonaws.com/recontact.world/miro-integration-logo.png',
    //   description: 'Integrate with Miro to export out insights into Miro board.',
    //   integrationLink: 'https://miro.com',
    //   pageRoute: ActiveRouteKey.MIRO_INTEGRATION
    // }
  ]

  const columns: TableProps<IntegrationItem>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      onCell: (record, _) => {
        return {
          onClick: () => {
            navigate(`/${record.pageRoute}`);
          },
        };
      },
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'flex-start', alignItems: 'center' }}>
          <img src={record.logo} height={30} />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      onCell: (record, _) => {
        return {
          onClick: () => {
            navigate(`/${record.pageRoute}`);
          },
        };
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <a href={`${record.pageRoute}`}>
            Coming Soon
          </a>
        </Space>
      ),
    },
  ];


  useEffect(() => {
    pushEvent('UserPageView', { pageName: 'IntegrationsPage' });
    dispatch(setActiveRouteKey(ActiveRouteKey.INTEGRATIONS));
  }, [dispatch]);


  return (
    // Entry to desktop UI
    <BaseLayout
      top={<DashboardTopActionBar />}
      center={
        <div style={{ padding: "1.2rem" }}>
          <h2 style={{ textAlign: "left" }}>My Integrations</h2>
          <Table
            columns={columns}
            dataSource={integrationsList}
          />
        </div>
      }
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

export default IntegrationsPage