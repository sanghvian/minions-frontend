import { RootState } from "@redux/store";
import { useSelector } from "react-redux";
import { Typography, Tabs } from "antd";
import "./DocumentsDashboard.css";
import TabPane from "antd/es/tabs/TabPane";
import UploadVideo from "@components/molecules/UploadVideo";
import FirefliesAccountDashboard from "../FirefliesAccountDashboard";
import MeetingNotes from "../MeetingNotes";
import GoogleDriveImportsDashboard from "../GoogleDriveImportsDashboard";

const { Title } = Typography;

const DocumentsDashboard = () => {
  const { firefliesApiKey, token } = useSelector((state: RootState) => state.persisted.user.value);

  return (
    <div className="documents-dashboard-container">
      <Title level={2}>My Meetings</Title>
      <Tabs defaultActiveKey="1" style={{ margin: "24px" }}>
        <TabPane tab="My Documents" key="1">
          <MeetingNotes />
        </TabPane>
        <TabPane tab="My Uploads" key="2">
          <UploadVideo />
        </TabPane>
        {firefliesApiKey && (
          <TabPane tab="Imported from Fireflies" key="3">
            <FirefliesAccountDashboard />
          </TabPane>
        )}
        {token && (
          <TabPane tab="Imported from Google Drive" key="4">
            <GoogleDriveImportsDashboard />
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default DocumentsDashboard;
