import { AppDispatch } from "@redux/store";
import { useDispatch } from "react-redux";
import { Contact } from "@models/contact.model";
import {
  ActiveRouteKey,
  setActiveRouteKey,
} from "@redux/features/activeEntitiesSlice";
import { useEffect } from "react";
import { initialContactState } from "@redux/features/contactSlice";
import { pushEvent } from "@utils/analytics";
import MasterAIChatBar from "@components/molecules/MasterAIChatBar";
import BaseLayout from "@components/templates/BaseLayout";
import DashboardTopActionBar from "@components/organisms/DashboardTopActionBar";
import LeftSider from "@components/templates/LeftSider";
import RightDrawer from "@components/templates/RightDrawer";
import NotionIntegrationDashboard from "@components/organisms/NotionIntegrationDashboard";

const NotionIntegrationPage = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    pushEvent("UserPageView", { pageName: "NotionIntegrationPage" });
    dispatch(setActiveRouteKey(ActiveRouteKey.NOTION_INTEGRATION));
  });

  return (
    <BaseLayout
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
      top={<DashboardTopActionBar />}
      center={<NotionIntegrationDashboard />}
    />
  );
};

export default NotionIntegrationPage;
