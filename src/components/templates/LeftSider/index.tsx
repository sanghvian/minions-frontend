import Sider from "antd/lib/layout/Sider";
import React, { useState } from "react";
import NavigationsTabs from "@components/organisms/NavigationTabs";
import "./LeftSider.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { toTitleCase } from "@utils/commonFuncs";
import { Avatar, Button, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  ActiveRouteKey,
  setActiveRouteKey,
} from "@redux/features/activeEntitiesSlice";
import { initialUserState, setUser } from "@redux/features/userSlice";

const LeftSider = () => {
  //* Currently disabling the collapsible property of left sider since I think it will be useful
  //* to always have it "on". Plus, I haven't figured out the UI to handle it yet
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(
    (state: RootState) => state.persisted.user.value
  );
  const { email } = currentUser;
  // Assuming that the email is of the structure "name@company_name.extension", extract the "company_name" from the email
  const companyName =
    toTitleCase(email?.split("@")[1]?.split(".")[0]?.toUpperCase()) === "Gmail"
      ? "Recontact"
      : toTitleCase(email?.split("@")[1]?.split(".")[0]?.toUpperCase());
  return (
    <Sider
      theme="dark"
      width={250}
      className="sider"
      // collapsible
      // collapsed={collapsed}
      // onCollapse={onCollapse}
    >
      <div
        style={{
          position: "sticky",
          top: "30px",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            className={"heading"}
            onClick={() => navigate(`/`)}
          >
            {!collapsed && <p>&nbsp; &nbsp; {companyName}</p>}
          </div>
        </div>
        <div className="tabsContainer">
          <NavigationsTabs collapsed={collapsed} />
        </div>
      </div>
      <div className="poweredByRecontactContainer">
        <Menu style={{ background: "#13345D" }}>
          <Menu.SubMenu
            title={
              currentUser?.photoURL ? (
                <div style={{ display: "flex" }}>
                  <Avatar src={currentUser?.photoURL} size="large" />
                  <span>{currentUser.name?.split(" ")[0]}</span>
                </div>
              ) : (
                <div style={{ display: "flex" }}>
                  <Avatar
                    style={{
                      backgroundColor: "#f56a00",
                      verticalAlign: "middle",
                    }}
                    size="large"
                  >
                    {currentUser!.name!.toUpperCase()[0] || "U"}
                  </Avatar>
                  <span>{currentUser.name?.split(" ")[0]}</span>
                </div>
              )
            }
          >
            <Menu.Item key="username">{currentUser?.email || "User"}</Menu.Item>
            <Menu.Item>
              <Button
                onClick={() => {
                  navigate(`/account`);
                  dispatch(setActiveRouteKey(ActiveRouteKey.ACCOUNT));
                }}
              >
                View Account
              </Button>
            </Menu.Item>
            <Menu.Item>
              <Button
                onClick={() => {
                  dispatch(setUser({ email: '', token: '' }));
                  window.location.reload();
                }}
              >
                Logout
              </Button>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
        <br />
        <div
          style={{ width: "100%", justifyContent: "center", display: "flex" }}
        >
          <img
            src="https://s3.amazonaws.com/recontact.world/powered-by-recontact.png"
            alt="Powered by recontact"
            className="logo"
            width={150}
          />
        </div>
      </div>
    </Sider>
  );
};

export default LeftSider;
