import React, { useState } from "react";
import { Button, Space, Spin, Table, TableProps, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { useQuery } from "react-query";
import apiService from "@utils/api/api-service";
import {
  ActiveModalType,
  setActiveTranscriptIds,
  setIsBottomSheetOpen,
  setIsModalOpen,
  setModalType,
} from "@redux/features/activeEntitiesSlice";
import { pushEvent } from "@utils/analytics";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { setUser } from "@redux/features/userSlice";

// Simplified date formatting function (make sure to adjust or import necessary utils)
function formatDate(dateNumber: any) {
  return format(new Date(dateNumber), "dd MMM yyyy");
}

type Dialogue = {
  text: string;
  speaker_name: string;
  speaker_id: string;
};

export const convertDialogueJsonToString = (dialogues: Dialogue[]): string => {
  return dialogues
    .map((dialogue) => {
      // Capitalize each word in the speaker's name for consistency
      const speakerName = dialogue.speaker_name
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");

      return `${speakerName}: ${dialogue.text}`;
    })
    .join("\n");
};

export interface PartialTranscriptResponse {
  title: string;
  date: string;
  status: string;
  id: string;
}

const FirefliesAccountDashboard = () => {
  const { email, token, firefliesApiKey, id } = useSelector(
    (state: RootState) => state.persisted.user.value
  );
  const [transcripts, setTranscripts] = useState<PartialTranscriptResponse[]>(
    []
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const pageSize = 50; // Define how many transcripts to fetch per page

  const fetchTranscripts = async (page: number) => {
    const skip = (page - 1) * pageSize;
    if (!firefliesApiKey) return [];
    return await apiService.fetchTranscripts({
      apiKey: firefliesApiKey,
      userId: email,
      options: { skip, limit: pageSize },
    });
  };

  // Use the `useQuery` to fetch data lazily
  const { isLoading } = useQuery({
    queryKey: ["transcripts", currentPage],
    queryFn: () => fetchTranscripts(currentPage),
    keepPreviousData: true,
    onSuccess: (newData) => {
      setTranscripts((prev) =>
        [...prev, ...newData]
          .map((r) => ({
            title: r.title,
            date: r.date,
            status: r.status,
            id: r.id,
            video_url: r?.video_url || "",
          }))
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          // Apply a filter to ensure that there is no duplicate transcripts by checking for unique "id" property on transcripts
          .filter(
            (tr, index, self) => self.findIndex((t) => t.id === tr.id) === index
          )
      );
      setIsLoadingNext(false);
    },
    onError: () => {
      setIsLoadingNext(false);
    },
    // enable fetching only when there is a valid firefliesApiKey and an actual change in currentPage
    enabled: firefliesApiKey !== undefined && firefliesApiKey.length > 0,
  });

  const dispatch: AppDispatch = useDispatch();

  const handleNextPage = async () => {
    setIsLoadingNext(true);
    setCurrentPage((prev) => prev + 1);
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
  };

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: TableProps<PartialTranscriptResponse>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => <span>{formatDate(date)}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "PROCESSED" ? "green" : "blue"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <a
            href={`https://app.fireflies.ai/view/${record.title
              ?.split(" ")
              .join("-")}::${record.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Transcript
          </a>

          {/* 👇 Commenting out this below button flow of step-by-step processing of individual fireflies call till we figure out a way to have a flow in the ReviewStructuredNoteModal to create a firefliestranscript object in mongo once the fireflies call is processed. For that have to maintain state of what mode the ReviewStructuredNoteModal is being opened in. Also, our "edit-transcript" flow in "step-by-step" processing isn't that good and people also aren't asking for it. */}
          {/* <Button
                        onClick={async () => {
                            const toastId = toast.loading('Processing Fireflies call...');
                            try {
                                const transcriptText = await apiService.fetchTranscript({
                                    apiKey: firefliesApiKey!,
                                    transcriptId: record.id
                                })
                                const transcriptDialogue = convertDialogueJsonToString(transcriptText.sentences);
                                dispatch(setIsBottomSheetOpen);
                                dispatch(setAudioNoteContent(transcriptDialogue || ""));
                                dispatch(
                                    setBottomSheetType(BottomSheetType.PLAYBOOK_SEARCH)
                                );
                                toast.success('Fireflies call processed', { id: toastId });
                                dispatch(setIsBottomSheetOpen(true));
                                pushEvent('ClickProcessFirefliesCall', { email })
                            } catch (error) {
                                toast.error('Error processing Fireflies call', { id: toastId })
                            }
                        }}
                    >
                        Process Meeting
                    </Button> */}
        </Space>
      ),
    },
  ];

  const handleBulkProcess = async () => {
    dispatch(setActiveTranscriptIds(selectedRowKeys));
    dispatch(setIsBottomSheetOpen(false));
    dispatch(setIsModalOpen(true));
    dispatch(setModalType(ActiveModalType.SET_PLAYBOOK));
    setSelectedRowKeys([]);
  };

  return (
    <>
      {firefliesApiKey && firefliesApiKey.length > 0 ? (
        isLoading ? (
          <Spin />
        ) : (
          <div
            style={{
              padding: "1.2rem",
            }}
          >
            <Button
              onClick={async () => {
                const toastId = toast.loading(
                  `Clearing Fireflies connection...`
                );
                const updatedUser = await apiService.updateUser(
                  email,
                  id!,
                  {
                    firefliesApiKey: "",
                  },
                  token
                );
                dispatch(setUser({ ...updatedUser, firefliesApiKey: "" }));
                toast.success("Fireflies connection cleared successfully", {
                  id: toastId,
                });
              }}
            >
              Clear Fireflies Connection
            </Button>
            <div
              style={{
                padding: "1.2rem",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <h2 style={{ textAlign: "left" }}>My Fireflies Videos</h2>
              {selectedRowKeys.length > 0 && (
                <Button onClick={handleBulkProcess}>Bulk Process</Button>
              )}
            </div>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={transcripts.map((tr) => ({ ...tr, key: tr.id }))}
              loading={isLoading}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                onChange: (page) => setCurrentPage(page),
              }}
              onChange={handleTableChange}
            />
            <div style={{ padding: "10px" }}>
              <Button
                type="primary"
                onClick={handleNextPage}
                loading={isLoadingNext}
                disabled={isLoadingNext}
              >
                Load More Transcripts
              </Button>
            </div>
          </div>
        )
      ) : (
        <Button
          onClick={() => {
            dispatch(setIsModalOpen(true));
            dispatch(setModalType(ActiveModalType.SET_FIREFLIES_API_KEY));
            pushEvent("StartConnectFirefliesAccount", { email });
          }}
          className="connect-sheet-button"
        >
          Connect Fireflies Account
        </Button>
      )}
    </>
  );
};

export default FirefliesAccountDashboard;
