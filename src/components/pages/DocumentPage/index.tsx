import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import {
  setActiveRouteKey,
  ActiveRouteKey,
  setActiveQueryString,
} from "@redux/features/activeEntitiesSlice";
import { pushEvent } from "@utils/analytics";
import { initialContactState, setContact } from "@redux/features/contactSlice";
import BaseLayout from "@components/templates/BaseLayout";
import DashboardTopActionBar from "@components/organisms/DashboardTopActionBar";
import LeftSider from "@components/templates/LeftSider";
import RightDrawer from "@components/templates/RightDrawer";
import MasterAIChatBar from "@components/molecules/MasterAIChatBar";
import { Contact } from "@models/contact.model";
import ViewDocument from "@components/organisms/ViewDocument";

const DocumentPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    pushEvent("UserPageView", { pageName: "DocumentPage" });
    dispatch(setActiveRouteKey(ActiveRouteKey.MEETINGS));
    dispatch(setContact(initialContactState.value.activeContact));
    dispatch(setActiveQueryString(""));
  }, [dispatch]);

  return (
    <BaseLayout
      top={<DashboardTopActionBar />}
      center={<ViewDocument />}
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
};

export default DocumentPage;