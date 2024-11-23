import { ActiveRouteKey, setActiveRouteKey, setActiveVideoUrl, setActiveTranscriptIds, setActiveVideoIds, setIsBottomSheetOpen, setIsModalOpen, setModalType, ActiveModalType } from '@redux/features/activeEntitiesSlice';
import { AppDispatch, RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import { Button, Space, Spin, Table, TableProps, Tag } from 'antd';
import { format } from "date-fns";
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import './VideosListPage.css'
import toast from 'react-hot-toast';
import { Video, VideoProcessingStatus, VideoSource } from '@models/video.model';
import { setActiveVideo, setVideosList } from '@redux/features/video';
import { DeleteOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';

const VideosListPage = () => {
  const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
  const videosList = useSelector((state: RootState) => state.video.videosList);
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading } = useQuery({
    queryKey: ["getAllUserVideos", email, token],
    queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return null;
      const videosReturned = await apiService.getAllUserUploadedVideos(queryKey[1], queryKey[2]!);
      const videos = [...videosReturned]
        ?.filter((v: Video) => v.videoSource === VideoSource.USER_UPLOAD)
        ?.sort((a: Video, b: Video) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          if (isNaN(dateA.getTime())) return 1;
          if (isNaN(dateB.getTime())) return -1;
          return dateB.getTime() - dateA.getTime();
        }) as Video[]
      dispatch(setVideosList(videos))
      return;
    },
  });

  const dispatch: AppDispatch = useDispatch();
  const handleDelete = async (video: Video) => {
    toast.promise(
      apiService.deleteVideo(video._id!, token),
      {
        loading: '🗑️ Deleting Video...',
        success: <b>Video deleted!</b>,
        error: <b>Could not delete.</b>,
      }
    )
    pushEvent('DeleteVideo', { video })
    const filteredVideos = (videosList as Video[]).filter((v: Video) => v._id !== video._id)
    dispatch(setVideosList(filteredVideos))
  }
  useEffect(() => {
    pushEvent('UserPageView', { pageName: 'VideosListPage' });
    dispatch(setActiveRouteKey(ActiveRouteKey.UPLOADS));
    if (videosList && videosList?.length > 0) {
      dispatch(setVideosList(videosList));
    }
  }, [dispatch]);

  // Filter playbooks based on search query
  const filteredVideos = searchQuery === ''
    ? videosList
    : (videosList as Video[]).filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Handle search input change
  const onSearch = (value: string) => {
    pushEvent('SimpleSearchInVideosList', { searchQuery: value })
    setSearchQuery(value);
  };

  const videoFilters = videosList.map((video: Video) => ({
    text: video.name,
    value: video.name,
  }));
  const activeVideoUrl = useSelector((state: RootState) => state.activeEntities.activeVideoUrl);

  const columns: TableProps<Video>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Video) => (
        //   <a onClick={() => dispatch(setActivePlaybookId(record._id!))}>
        // {text}
        //   </a>
        <div>
          {text}
          {activeVideoUrl === record.videoUrl && (<Tag color="blue">Active</Tag>)}
        </div>
      ),
      filters: videoFilters.filter(
        (obj, index) =>
          index ===
          videoFilters.findIndex(
            (other) => other.text === obj.text && other.value === obj.value
          )
      ),
      onFilter: (value: any, video: Video) => video.name.startsWith(value, 0),
      filterSearch: true,
    },
    // {
    //   title: "Source",
    //   dataIndex: "source",
    //   key: "source",
    //   filters: [
    //     {
    //       text: "Imported from Fireflies",
    //       value: "Imported from Fireflies",
    //     },
    //     {
    //       text: "Uploaded by User",
    //       value: "Uploaded by User",
    //     },
    //   ],
    //   onFilter: (value: any, video: any) => video.source.startsWith(value, 0),
    //   filterSearch: true,
    // },
    {
      title: "Uploaded on",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string, record: Video) => {
        // Check if 'createdAt' is a valid Date
        const date = new Date(createdAt);
        if (isNaN(date.getTime())) {
          // If not valid, return an empty string
          return <></>;
        } else {
          // If valid, format and return the formatted timestamp
          const formattedTimestamp = format(date, "h:mma, do MMM yyyy");
          return <>{formattedTimestamp}</>;
        }
      },
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (createdAt: string, record: Video) => <Tag color={
        record.status === VideoProcessingStatus.COMPLETED ? "green" : record.status === VideoProcessingStatus.FAILED ? "red" : "blue"
      }>{record.status}</Tag>
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button
              onClick={async () => {
                const videoFromUrl = await apiService.getVideoByUrl(
                  record.videoUrl,
                  token
                );
                dispatch(setActiveVideo(videoFromUrl));
                dispatch(setActiveVideoUrl(record.videoUrl));
              }}
              icon={<EyeOutlined />}
            >
            </Button>
            <Button icon={<DownloadOutlined />} href={record.videoUrl} />
            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
          </Space>
        );
      },
    },
  ];
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    dispatch(setActiveVideoIds(newSelectedRowKeys as string[]));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };


  const handleBulkProcess = async () => {
    // Example bulk processing logic
    dispatch(setActiveVideoIds(selectedRowKeys));
    dispatch(setIsBottomSheetOpen(false))
    dispatch(setIsModalOpen(true));
    dispatch(setModalType(ActiveModalType.SET_PLAYBOOK_2));
    setSelectedRowKeys([]);
    toast.loading('Processing selected documents...', { duration: 2000 });
  };

  const dataSourceWithKeys = filteredVideos.map(video => ({
    ...video,
    key: video._id,
    // source: video.videoUrl.includes("fireflies") ? "Imported from Fireflies" : "Uploaded by User"
  }))
  return (
    isLoading ? <Spin /> : <div className='videos-page'>

      <div className="videos-list">
        <Button
          onClick={handleBulkProcess}
          disabled={selectedRowKeys.length === 0}
          style={{ marginBottom: 16 }}
        >
          Process Video(s)
        </Button>
        {/* Just a simple component that shows which range of documents we're showing, of off the totalDocuments count, based on the currentPage we are on */}

        {/* {filteredVideos.map((item: Video, i: number) => (
                    <VideoItem item={item} key={i} handleDelete={handleDelete} />
                ))} */}
        <Table
          rowSelection={rowSelection}

          columns={columns} dataSource={dataSourceWithKeys} rowClassName="table-item" />
      </div>
    </div>
  )
}

export default VideosListPage
