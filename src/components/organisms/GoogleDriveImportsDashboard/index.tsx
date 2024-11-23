import React, { useState } from 'react'
import { Button, Space, Spin, Table, TableProps, Tabs, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { useQuery } from 'react-query';
import apiService from '@utils/api/api-service';
import { ActiveModalType, setActiveVideoIds, setActiveVideos, setIsBottomSheetOpen, setIsModalOpen, setModalType } from '@redux/features/activeEntitiesSlice';
import { format } from 'date-fns';
import TabPane from 'antd/es/tabs/TabPane';

// Simplified date formatting function (make sure to adjust or import necessary utils)
function formatDate(dateNumber: any) {
  const date = new Date(dateNumber);
  if (isNaN(date.getTime())) {
    return '';
  }
  return format(date, 'dd MMM yyyy');
}

type Dialogue = {
  text: string;
  speaker_name: string;
  speaker_id: string;
};

const enum GoogleDriveFileTypes {
  AUDIO = "audio",
  VIDEO = "video",
  DOCUMENT = "document",
}

const enum ProcessStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
}

interface TableFilters {
  fileType: GoogleDriveFileTypes | "";
  status: ProcessStatus;
}

export const convertDialogueJsonToString = (dialogues: Dialogue[]): string => {
  return dialogues
    .map(dialogue => {
      // Capitalize each word in the speaker's name for consistency
      const speakerName = dialogue.speaker_name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      return `${speakerName}: ${dialogue.text}`;
    })
    .join('\n');
}

export interface GDriveResponse {
  name: string;
  date: string;
  status: string;
  id: string;
  videoUrl: string;
  fileType: GoogleDriveFileTypes;
}

const GoogleDriveImportsDashboard = () => {
  const { email, token, id } = useSelector((state: RootState) => state.persisted.user.value);
  const [gdriveFiles, setGDriveFiles] = useState<GDriveResponse[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const pageSize = 50;  // Define how many gdriveFiles to fetch per page

  const fetchTranscripts = async (page: number) => {
    const skip = (page - 1) * pageSize;
    return await apiService.fetchCombinedGDriveFiles({
      refreshToken: token,
      userId: email,
      options: { skip, limit: pageSize }
    });
  };

  // Use the `useQuery` to fetch data lazily
  const { isLoading } = useQuery({
    queryKey: ['gdriveFiles', currentPage],
    queryFn: () => fetchTranscripts(currentPage),
    keepPreviousData: true,
    onSuccess: newData => {
      setGDriveFiles(prev =>
        [...prev, ...newData]
          .map((r) => ({
            name: r.name,
            date: r.createdAt,
            status: r.status,
            id: r.videoSourceId,
            videoUrl: r?.videoUrl || "",
            fileType: r.fileType ?? ""
          }))
          // filter out whichever files have invalid upload dates

          .filter((gDriveFile) => gDriveFile.date !== undefined && gDriveFile.date !== null && gDriveFile.date !== "" && !isNaN(new Date(gDriveFile?.date)?.getTime()))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          // Apply a filter to ensure that there is no duplicate gdriveFiles by checking for unique "id" property on gdriveFiles
          .filter((gDriveFile, index, self) => self.findIndex(t => t.id === gDriveFile.id) === index));

      setIsLoadingNext(false);
    },
    onError: () => {
      setIsLoadingNext(false);
    },
    enabled: (token !== undefined && token.length > 0)
  },
  );

  const dispatch: AppDispatch = useDispatch();

  const handleNextPage = async () => {
    setIsLoadingNext(true);
    setCurrentPage(prev => prev + 1);
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

  const columns: TableProps<GDriveResponse>["columns"] = [
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
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
        <Tag color={status === ProcessStatus.COMPLETED ? "green" : "blue"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "videoUrl",
      render: (fileObj) => (
        <Space size="middle">
          <a
            href={fileObj.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View File
          </a>
        </Space>
      ),
    },
  ];

  const handleBulkProcess = async () => {
    dispatch(setActiveVideoIds(selectedRowKeys));
    const activeVideos = gdriveFiles.filter(tr => selectedRowKeys.includes(tr.id));
    dispatch(setActiveVideos(activeVideos));
    dispatch(setIsBottomSheetOpen(false))
    dispatch(setIsModalOpen(true));
    dispatch(setModalType(ActiveModalType.SET_PLAYBOOK_3));
    setSelectedRowKeys([]);
  }

  const TableWithFileTypeFilter = ({
    filters,
  }: {
    filters: TableFilters;
  }) => {
    return (
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={gdriveFiles
          .map((tr) => ({ ...tr, key: tr.id }))
          .filter((tr) => tr.fileType === filters.fileType && tr.status === filters.status)}
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: (page) => setCurrentPage(page),
        }}
        onChange={handleTableChange}
      />
    );
  };

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <div
          style={{
            padding: "1.2rem",
          }}
        >
          <div
            style={{
              padding: "1.2rem",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <h2 style={{ textAlign: "left" }}>My Google Drive Files</h2>
            {selectedRowKeys.length > 0 && (
              <Button onClick={handleBulkProcess}>Bulk Process</Button>
            )}
          </div>
          <Tabs defaultActiveKey="1" style={{ margin: "0 24px" }}>
            <TabPane tab="Processed Files" key="1">
              <TableWithFileTypeFilter
                filters={{ fileType: "", status: ProcessStatus.COMPLETED }}
              />
            </TabPane>
            <TabPane tab="Documents" key="2">
              <TableWithFileTypeFilter
                filters={{ fileType: GoogleDriveFileTypes.DOCUMENT, status: ProcessStatus.PENDING }}
              />
            </TabPane>
            <TabPane tab="Videos" key="3">
              <TableWithFileTypeFilter
                filters={{ fileType: GoogleDriveFileTypes.VIDEO, status: ProcessStatus.PENDING }}
              />
            </TabPane>
            <TabPane tab="Audios" key="4">
              <TableWithFileTypeFilter
                filters={{ fileType: GoogleDriveFileTypes.AUDIO, status: ProcessStatus.PENDING }}
              />
            </TabPane>
          </Tabs>
          {/* <div style={{ padding: '10px' }}>
                        <Button
                            type="primary"
                            onClick={handleNextPage}
                            loading={isLoadingNext}
                            disabled={isLoadingNext}
                        >
                            Load More Files
                        </Button>
                    </div> */}
        </div>
      )}
    </>
  );
}

export default GoogleDriveImportsDashboard
