import { FC, useEffect, useState } from "react";
import { Button, Progress, Row } from "antd";
import {
  AudioOutlined,
  DeleteOutlined,
  EditOutlined,
  FireOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import { AppDispatch, RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import apiService from "@utils/api/api-service";
import {
  ActiveModalType,
  ActiveRouteKey,
  BottomSheetType,
  SearchType,
  setActiveRouteKey,
  setActiveVideoUrl,
  setAudioNoteContent,
  setBottomSheetType,
  setIsBottomSheetOpen,
  setIsModalOpen,
  setIsUploading,
  setModalType,
  setSearchType,
} from "@redux/features/activeEntitiesSlice";
import VideosListPage from "../VideoList";
import { setUserActionCount } from "@redux/features/userSlice";
import { pushEvent } from "@utils/analytics";
import { VideoLanguage } from "@models/video.model";

const UploadVideo: FC = () => {
  // const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { activeVideoUrl: videoUrl, activePlaybookId } = useSelector(
    (state: RootState) => state.activeEntities
  );
  const {
    email: userId,
    token,
    id,
    usageCount,
  } = useSelector((state: RootState) => state.persisted.user.value);
  const activeVideo = useSelector(
    (state: RootState) => state.video.activeVideo
  );
  const [progress, setProgress] = useState(0);
  const fileUploadDuration = useSelector(
    (state: RootState) => state.activeEntities.fileUploadDuration
  );

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      const estimatedTotalTime = fileUploadDuration / 2.63; // the number 2.63 was arrived upon by this calculation - given the same network - how long did it take to upload the file itself and how long did it take to extract the transcripts
      let elapsedTime = 0;
      interval = setInterval(() => {
        elapsedTime += 0.5;
        const calculatedProgress = (elapsedTime / estimatedTotalTime) * 100;
        setProgress(calculatedProgress);
        if (elapsedTime >= estimatedTotalTime) {
          clearInterval(interval);
          setIsLoading(false);
          setProgress(100);
          // toast.success("Processing complete");
        }
      }, 500); // Update progress every half-second
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const dispatch: AppDispatch = useDispatch();
  dispatch(setActiveRouteKey(ActiveRouteKey.MEETINGS));
  // const uploadProps = {
  //   name: "file",
  //   multiple: false,
  //   showUploadList: false,
  //   beforeUpload: async (file: File) => {
  //     // Generating a UUID and renaming the file before upload
  //     setIsLoading(true);
  //     const extension = file.name.split(".").pop() || "";
  //     const newName = `${uuidv4()}.${extension}`;
  //     const newFile = new File([file], newName, { type: file.type });

  //     toast.promise(
  //       new Promise(async (resolve, reject) => {
  //         pushEvent("ClickUploadVideoRecording", {
  //           // File size in MB
  //           fileSize: file.size / 1024 ** 2,
  //         });
  //         // const startTime = new Date().getTime();
  //         try {
  //           // Uploading the file to S3
  //           const data = await S3FileUpload.uploadFile(newFile, config);

  //           dispatch(setActiveVideoUrl(data.location));

  //           // dispatch(setContact(newContact))
  //           // // dispatch(setIsBottomSheetOpen(true))
  //           // dispatch(setBottomSheetType(BottomSheetType.CONTACT_ADD))
  //           // const endTime = new Date().getTime();
  //           // pushEvent('PhotoToContactCompleted', {
  //           //     // File size in MB
  //           //     fileSize: file.size / (1024 ** 2),
  //           //     responseTime: (endTime - startTime) / 1000
  //           // })
  //           // dispatch(setNumTries(numTries + 1));
  //           // setIsLoading(true);
  //           // Now 'text' contains the extracted text from the .txt file

  //           resolve("Success"); // you can modify this to return relevant data if needed
  //           const createdVideoTranscriptObject = await apiService.createVideo(
  //             {
  //               videoUrl: data.location,
  //               transcriptText: "",
  //               userId,
  //               createdAt: new Date().toISOString(),
  //               name: file.name,
  //             },
  //             token
  //           );
  //           dispatch(setActiveVideo(createdVideoTranscriptObject));
  //           dispatch(addVideoToList(createdVideoTranscriptObject));
  //         } catch (error) {
  //           message.error("File upload failed or text extraction failed");
  //           console.error(error);
  //           reject(error);
  //         } finally {
  //           setIsLoading(false);
  //         }
  //       }),
  //       {
  //         loading: "Uploading file....",
  //         success: <b>File uploaded!</b>,
  //         error: <b>Could not upload file</b>,
  //       }
  //     );
  //     return false; // Return false to not automatically upload after select
  //   },
  // };

  const transcribeAndProcess = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Extracting text from uploaded file....");
    setTimeout(async () => {
      const transcriptResponse = await apiService.transcribeVideo(
        videoUrl,
        activeVideo.language,
        token
      );
      setIsLoading(false);
      setProgress(0);
      const transcriptText = transcriptResponse.transcript;
      dispatch(setAudioNoteContent(transcriptText || ""));
      toast.success("Text extracted from uploaded file", { id: toastId });
      await apiService.updateVideo(activeVideo._id!, { transcriptText }, token);
      // // Updating the user feature usage
      const newUserCount = usageCount ? usageCount + 1 : 1;
      await apiService.updateUserActionsCount({
        email: userId!,
        userId: id!,
        usageCount: newUserCount,
        accessToken: token,
      });
      dispatch(setIsUploading(true));
      dispatch(setUserActionCount(newUserCount));
      pushEvent("FileTranscriptionCompleted", { email: userId });
      dispatch(setIsBottomSheetOpen(true));
      if (!activePlaybookId) {
        dispatch(setBottomSheetType(BottomSheetType.PLAYBOOK_SEARCH));
      } else {
        dispatch(setBottomSheetType(BottomSheetType.SEARCH_ADD));
        dispatch(setSearchType(SearchType.INTERNAL));
      }
    }, 5000); // Simulate network and processing delay
  };

  return (
    <div
      style={{
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <div style={{ display: "flex" }}>
        <div>
          <h4 style={{ textAlign: "left", margin: 0 }}>Manage file uploads</h4>
          <br />
          <Row gutter={16}>

            <>
              {/* <Upload {...uploadProps}> */}
              <Button
                disabled={isLoading}
                icon={<VideoCameraAddOutlined />}
                onClick={() => {
                  dispatch(setIsModalOpen(true));
                  dispatch(setModalType(ActiveModalType.UPLOAD_AUDIO_VIDEO_FILE))
                  pushEvent('ClickUploadFileRecording', { email: userId })
                }}
              >
                Upload Video/Audio
              </Button>
              {/* </Upload> */}
              &nbsp;
              <Button
                disabled={isLoading}
                icon={<EditOutlined />}
                onClick={() => {
                  dispatch(setIsBottomSheetOpen);
                  dispatch(
                    setBottomSheetType(BottomSheetType.PLAYBOOK_SEARCH)
                  );
                  dispatch(setIsBottomSheetOpen(true));
                  pushEvent('ClickAddMeetingTranscripts', { email: userId })
                }}
              >
                Add meeting transcripts
              </Button>
              &nbsp;
              <Button
                disabled={isLoading}
                icon={<AudioOutlined />}
                onClick={() => {
                  dispatch(setIsModalOpen(true));
                  dispatch(setModalType(ActiveModalType.RECORD_VOICE_NOTE));
                  pushEvent('ClickRecordVoiceNote', { email: userId })
                }}
              >
                Record Voice Note
              </Button>
            </>

            {videoUrl?.length > 0 && (
              <>
                {isLoading && (
                  <Progress percent={Math.round(progress)} status="active" />
                )}
                {/* <Button
                  style={{
                    border: "none",
                    outline: "none",
                  }}
                  type="primary"
                  disabled={videoUrl?.length === 0}
                  icon={<FireOutlined />}
                  onClick={() => {
                    transcribeAndProcess();
                  }}
                >
                  Transcribe and Process Video
                </Button> */}
                &nbsp;&nbsp;&nbsp;
                <Button
                  style={{
                    border: "none",
                    outline: "none",
                  }}
                  danger
                  disabled={videoUrl?.length === 0}
                  icon={<DeleteOutlined />}
                  onClick={() => dispatch(setActiveVideoUrl(""))}
                >
                  Clear Preview of Most Recently Uploaded File
                </Button>
              </>
            )}
          </Row>
        </div>

      </div>
      <br />
      {videoUrl?.length > 0 && (
        <video width="320" height="240" controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <VideosListPage />
    </div>
  );
};

export default UploadVideo;
