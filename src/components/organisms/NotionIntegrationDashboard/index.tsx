import {
  ActiveModalType,
  setIsModalOpen,
  setModalType,
} from "@redux/features/activeEntitiesSlice";
import { setUser } from "@redux/features/userSlice";
import { AppDispatch, RootState } from "@redux/store";
import { pushEvent } from "@utils/analytics";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

const NotionIntegrationDashboard = () => {
  const user = useSelector((state: RootState) => state.persisted.user.value);
  const dispatch: AppDispatch = useDispatch();

  return (
    <div>
      <h2>Notion Integration</h2>
      <br />
      {user.notionApiKey && user.notionPageId ? (
        <>
          <p>Connected to Notion✅</p>
          <Button
            onClick={() => {
              dispatch(setIsModalOpen(true));
              dispatch(setModalType(ActiveModalType.SET_NOTION_CREDS));
              pushEvent("StartConnectNotion", { email: user.email });
            }}
          >
            Clear Notion Integration
          </Button>
        </>
      ) : (
        <Button
          onClick={() => {
            dispatch(setIsModalOpen(true));
            dispatch(setModalType(ActiveModalType.SET_NOTION_CREDS));
            pushEvent("StartConnectNotion", { email: user.email });
          }}
        >
          Connect to Notion
        </Button>
      )}
    </div>
  );
};

export default NotionIntegrationDashboard;
