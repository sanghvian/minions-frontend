import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import apiService from "@utils/api/api-service";
import { Button, Spin, Tabs } from "antd";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import "./ViewDocument.css";
import { setActiveDocument } from "@redux/features/documentSlice";
import toast from "react-hot-toast";
import type { TabsProps } from "antd";
import ViewVideo from "../ViewVideo";
import DocumentChat from "../DocumentChat"
import DocumentCard from "@components/atoms/DocumentCard";
import { ArrowRightOutlined, FileSyncOutlined } from "@ant-design/icons";
import { ActiveRouteKey } from "@redux/features/activeEntitiesSlice";
import SummaryDocument from "../SummaryDocument";

const ViewDocument = () => {
  const activeDocument = useSelector((state: RootState) => state.document.activeDocument);
  const location = useLocation();
  const isSomeoneQueryingDocForSourceCitation = location.pathname.includes("source");
  const dispatch: AppDispatch = useDispatch();
  const documentId = location.pathname.split("/")[2];
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeKey, setActiveKey] = useState<string>(isSomeoneQueryingDocForSourceCitation ? "3" : "1")



  const syncToNotion = async () => {
    const toastId = toast.loading(`Syncing to your Notion...`);
    await apiService.syncDocumentToNotion({
      notionApiKey: user.notionApiKey ?? "",
      notionPageId: user.notionPageId ?? "",
      pageTitle:
        activeDocument?.templateId?.name +
        " with " +
        activeDocument?.contact?.name,
      documentContent:
        activeDocument?.contentResponses?.map((response) => {
          return {
            title: response.contentBlockId.blockTitle ?? "",
            content: response.answerText ?? "",
          };
        }) ?? [],
      dateString: format(
        new Date(activeDocument?.createdAt),
        "h:mma, do MMM yyyy"
      ),
      recontactDocumentUrl: `${process.env.REACT_APP_DOMAIN}/documents/${activeDocument?._id}`,
    });
    toast.success("Synced to Notion successfully", {
      id: toastId,
    });
  }


  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Document",
      children: <DocumentCard setActiveKey={setActiveKey} />,
    },
    // {
    //   key: "2",
    //   label: "Summary",
    //   children: <SummaryDocument />,
    // },
    {
      key: "2",
      label: "Chat with Transcript",
      children: <DocumentChat videoId={activeDocument.videoId ?? ""} />,
    },
    {
      key: "3",
      label: "Transcript",
      children: <ViewVideo videoId={activeDocument.videoId ?? ""} />,
    },
  ];

  const { email, token } = useSelector(
    (state: RootState) => state.persisted.user.value
  );
  const user = useSelector(
    (state: RootState) => state.persisted.user.value
  );

  useQuery({
    queryKey: ["getDocument", documentId, email, token],
    queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return null;
      const doc = await apiService.getDocument(
        queryKey[1]!,
        queryKey[2]!,
        queryKey[3]!
      );
      dispatch(setActiveDocument(doc));
      setIsLoading(false);
    },
  });
  return (
    <div>
      {isLoading ? (
        <Spin />
      ) : (
        <div>
          <h1>
            {activeDocument?.templateId?.name} with{" "}
            {activeDocument?.contact?.name}
          </h1>
          <div className="document-date">
            {activeDocument?.createdAt
              ? format(
                new Date(activeDocument?.createdAt),
                "h:mma, do MMM yyyy"
              )
              : ""}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              padding: "1rem",
            }}
          >
            {user.notionApiKey && user.notionPageId && (
              <Button
                icon={<FileSyncOutlined />}
                type="primary"
                onClick={syncToNotion}
              >
                Sync to Notion
              </Button>
            )}
            &nbsp;&nbsp;
            <Button
              icon={<ArrowRightOutlined />}
              onClick={() => {
                navigate(`/${ActiveRouteKey.CONTACTS}/${activeDocument?.contactId}`);
              }}
            >
              More about {activeDocument?.contact?.name}
            </Button>
          </div>
          <div style={{ marginLeft: "2rem", marginRight: "2rem" }}>
            <Tabs
              onChange={(key) => setActiveKey(key)}
              activeKey={activeKey} items={items}
            />
          </div>
        </div>
      )}


    </div>
  );
}

export default ViewDocument;
