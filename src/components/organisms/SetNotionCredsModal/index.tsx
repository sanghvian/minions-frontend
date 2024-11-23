import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Modal } from "antd";
import {
  ActiveModalType,
  setIsModalOpen,
} from "@redux/features/activeEntitiesSlice";
import { RootState } from "@redux/store";
import apiService from "@utils/api/api-service";
import { setUser } from "@redux/features/userSlice";
import toast from "react-hot-toast";
import { pushEvent } from "@utils/analytics";

const SetNotionCredsModal = () => {
  const { isModalOpen, modalType } = useSelector(
    (state: RootState) => state.activeEntities
  );
  const isVisible =
    isModalOpen && modalType === ActiveModalType.SET_NOTION_CREDS;
  const dispatch = useDispatch();
  const { email, token, id } = useSelector(
    (state: RootState) => state.persisted.user.value
  );

  const [notionApiKey, setNotionApiKey] = useState("");
  const [notionPageId, setNotionPageId] = useState("");


  const handleSubmit = async () => {
    if (!notionApiKey || !notionPageId) {
      toast.error("Please fill all the fields");
      return;
    }
    const toastId = toast.loading(
      'Integrating with your Notion....'
    );
    const updatedUser = await apiService.updateUser(
      email,
      id!,
      {
        notionApiKey,
        notionPageId,
      },
      token
    );
    dispatch(setUser({ ...updatedUser, token }));
    toast.success("Connected to Notion successfully", { id: toastId });
    pushEvent("NotionConnected", { email, notionPageId });
    dispatch(setIsModalOpen(false));
  };

  const onCancel = () => {
    dispatch(setIsModalOpen(false));
  };

  return (
    <Modal
      title="Integrate with Notion"
      visible={isVisible}
      onCancel={onCancel}
      maskClosable={false}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
    >
      <b>Notion API Key:</b>
      <Input
        placeholder="Eg: secret_14i5qqaPDkBSnF44yfIsHtFPVp8wgRjhmzWLmbcK0Z2"
        value={notionApiKey}
        onChange={(e) => setNotionApiKey(e.target.value)}
        />
      <br />
      <br />
      <b>Notion Page ID:</b>
      <Input
        placeholder="For url URL - https://www.notion.so/asanghvi/Integrating-Miro-<<PAGE_ID>> it is  <<PAGE_ID>>"
        value={notionPageId}
        onChange={(e) => setNotionPageId(e.target.value)}
      />
    </Modal>
  );
};

export default SetNotionCredsModal;
