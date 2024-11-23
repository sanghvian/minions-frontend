import { setActiveVideoIds, setIsBottomDrawerOpen, setIsModalOpen } from "@redux/features/activeEntitiesSlice";
import { RootState } from "@redux/store";
import { Drawer, Progress, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import './BulkProcessGDriveImportsBottomDrawer.css'
import { useEffect, useState } from "react";
import apiService from "@utils/api/api-service";
import { toTitleCase } from "@utils/commonFuncs";
import { VideoLanguage, VideoProcessingStatus, VideoSource } from "@models/video.model";
import toast from 'react-hot-toast';
import { extractNameFromNote } from "@utils/contactFuncs";
import { DownOutlined, UpOutlined } from "@ant-design/icons";



const BulkProcessGDriveImportsBottomDrawer = () => {
  const isBottomDrawerOpen = useSelector((state: RootState) => state.activeEntities.isBottomDrawerOpen)
  const { email, token, name } = useSelector((state: RootState) => state.persisted.user.value);
  const activeVideos = useSelector((state: RootState) => state.activeEntities.activeVideos);
  const activeVideoIds = activeVideos.map(video => video.id);
  const activePlaybookId = useSelector((state: RootState) => state.activeEntities.activePlaybookId);

  const dispatch = useDispatch()
  const [toggleText, setToggleText] = useState<"Open" | "Close">("Open")
  const [currentTranscriptionTitle, setCurrentTranscriptionTitle] =
    useState("");
  const [currentTranscriptionIndex, setCurrentTranscriptionIndex] =
    useState(0);
  const [progress, setProgress] = useState(0);
  const [excludedInputs, setExcludedInputs] = useState("");
  const [processingState, setProcessingState] = useState<"loading" | "finished">("loading")
  const activeLanguage = useSelector(
    (state: RootState) => state.activeEntities.activeLanguage
  );


  const onBottomDrawerClose = () => {
    dispatch(setIsBottomDrawerOpen(false))
  }

  const onBottomDrawerToggle = () => {
    setToggleText((toggleText) => toggleText === "Open" ? "Close" : "Open");
  }

  useEffect(() => {
    handleBulkProcessTranscripts()
  }, [])

  const handleBulkProcessTranscripts = async () => {

    // const toastId = toast.loading(`Processing your calls by your guide...`);
    let processedCount = 0; // Counter for processed transcripts
    try {
      for (const videoId of activeVideoIds) {
        if (!videoId) continue;
        const videoIndex = activeVideoIds.indexOf(videoId);
        const activeVideo = activeVideos.find(video => video.id === videoId);
        setCurrentTranscriptionTitle(activeVideo?.name || `Call ${videoIndex + 1}`);
        setCurrentTranscriptionIndex(videoIndex + 1);
        let transcriptText = ""
        let transcriptSentences:any[] = []
        let videoUrl = ""
        if (activeVideo?.fileType == "document") {
         const response = await apiService.fetchContentFromGoogleDriveFile({
           fileId: videoId,
           refreshToken: token,
         }); 
        transcriptText = response.data
        videoUrl = activeVideo?.videoUrl
        }
        else {
          const transcriptResponse: {
            transcriptText: string;
            videoUrl: string;
            timestampedTranscript: {
              start: number;
              end: number;
              text: string;
              speaker: string;
            }[];
          } = await apiService.transcribeGDriveVideo({
            fileId: videoId,
            refreshToken: token,
            language: activeLanguage !== "" ? activeLanguage: VideoLanguage.ENGLISH,
          });
          transcriptText = transcriptResponse.transcriptText;
          transcriptSentences = transcriptResponse.timestampedTranscript
          videoUrl = transcriptResponse.videoUrl
        }

        // Use the function with your logic
        // const nameOutput = await extractNameFromNote(transcriptText + `Ensure that you exclude any names related to the following - ${excludedInputs}`)
        //const titleCasedName = toTitleCase(nameOutput);
        // const callName = `Video call with ${titleCasedName}`

        const createdContact = await apiService.createContact({
          // name: titleCasedName
          name: activeVideo?.name
        }, email, token);

        const createdVideo = await apiService.createVideo({
          userId: email,
          videoUrl: videoUrl,
          videoSource: VideoSource.GOOGLE_DRIVE,
          videoSourceId: videoId,
          transcriptText,
          language:activeLanguage ?? VideoLanguage.ENGLISH,
          status: VideoProcessingStatus.PROCESSING,
          name: activeVideo?.name,
          createdAt: activeVideo?.date
        }, token)
        try {
          if (activeVideo?.fileType == "document" || activeLanguage !== VideoLanguage.ENGLISH) {
            await apiService.structureTranscriptAndCreateDocument({
              transcript: transcriptText,
              templateId: activePlaybookId,
              userId: email,
              contactId: createdContact.id,
              videoId: createdVideo._id,
              accessToken: token,
              recontactUserName: name || "Interviewer"
            });
          }
          else{
            await apiService.structureTranscriptAndCreateDocumentWithTimestamp({
              transcript: transcriptText,
              transcriptSentences,
              templateId: activePlaybookId,
              userId: email,
              contactId: createdContact.id,
              videoId: createdVideo._id,
              accessToken: token,
              recontactUserName: name || "Interviewer",
            });
          }
          await apiService.updateVideo(createdVideo._id, {
            status: VideoProcessingStatus.COMPLETED
          }, token);
        } catch (error: any) {
          console.error(`Error processing transcript and creating document for videoId ${videoId}: ${error.message}`);
          await apiService.updateVideo(createdVideo._id, {
            status: VideoProcessingStatus.FAILED
          }, token);
          continue; // Skip to the next iteration
        }

        processedCount += 1;
        setProgress((processedCount / activeVideoIds.length) * 100); // Update progress
      }
      // toast.success('All transcripts processed', { id: toastId });
      setProgress(0)
    } catch (error: any) {
      toast.error(`Error processing transcripts : ${error.message}`);
    } finally {
      dispatch(setActiveVideoIds([]));
      dispatch(setIsBottomDrawerOpen(false));
      setProgress(0); // Reset progress when modal is closed
      // window.location.reload()
      // toast.dismiss(toastId); // Dismiss the toast
    }

  };

  return (
    <div className="drawer-parent-div">
      <Drawer
        placement="bottom"
        closable={false}
        onClose={onBottomDrawerClose}
        open={isBottomDrawerOpen}
        getContainer={false}
        mask={false}
        height={toggleText === "Open" ? 90 : 500}
        contentWrapperStyle={{ boxShadow: "none" }}
        bodyStyle={{ padding: "10px" }}
        className="drawer-main"
      >
        <div className="drawer-header">
          <div className="drawer-header-text">Bulk Process</div>
          <div className="drawer-header-close">
            <span onClick={onBottomDrawerToggle}>{
              toggleText === "Close" ? <DownOutlined /> : <UpOutlined />
            }</span>
          </div>
        </div>
        {toggleText === "Close" && (
          <div style={{
            padding: "1.6rem"
          }}>
            {currentTranscriptionTitle ? (
              <div>
                <p>
                  We are processing {currentTranscriptionTitle} call (
                  {currentTranscriptionIndex}/{activeVideoIds.length}{" "}
                  total){" "}
                </p>
                <Progress percent={Math.round(progress)} />
                <p>
                  Per call processing time is about 2mins. Pretty cool, right? 😎
                </p>
              </div>
            ) :
              <>
                {processingState === "loading" ?
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  ><Spin /> </div>
                  :
                  <div>
                    <p>Bulk processing completed</p>
                  </div>}
              </>
            }
          </div>
        )}
      </Drawer>
    </div>
  );
}

export default BulkProcessGDriveImportsBottomDrawer;