import { setActiveVideoIds, setIsBottomDrawerOpen, setIsModalOpen } from "@redux/features/activeEntitiesSlice";
import { RootState } from "@redux/store";
import { Drawer, Progress, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import './BulkProcessUploadedVideosBottomDrawer.css'
import { useEffect, useState } from "react";
import apiService from "@utils/api/api-service";
import { toTitleCase } from "@utils/commonFuncs";
import { VideoLanguage, VideoProcessingStatus, VideoSource } from "@models/video.model";
import toast from 'react-hot-toast';
import { extractNameFromNote } from "@utils/contactFuncs";
import { DownOutlined, UpOutlined } from "@ant-design/icons";



const BulkProcessUploadedVideosBottomDrawer = () => {
  const isBottomDrawerOpen = useSelector((state: RootState) => state.activeEntities.isBottomDrawerOpen)
  const { email, token, name } = useSelector((state: RootState) => state.persisted.user.value);
  // const activeVideos = useSelector((state: RootState) => state.activeEntities.activeVideoIds);
  const activeVideoIds = useSelector(
    (state: RootState) => state.activeEntities.activeVideoIds
  );
  const activePlaybookId = useSelector((state: RootState) => state.activeEntities.activePlaybookId);

  const dispatch = useDispatch()
  const [toggleText, setToggleText] = useState<"Open" | "Close">("Open")
  const [currentTranscriptionTitle, setCurrentTranscriptionTitle] =
    useState("");
  const [currentTranscriptionIndex, setCurrentTranscriptionIndex] =
    useState(0);
  const [progress, setProgress] = useState(0);
  const [excludedInputs, setExcludedInputs] = useState("");
  const [processingState, setProcessingState] = useState<"processing" | "finished">("processing")
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
    let processedCount = 0; // Counter for processed transcripts
    try {
      for (const videoId of activeVideoIds) {
        const videoIndex = activeVideoIds.indexOf(videoId);
        const video = await apiService.getVideo(videoId, token);

        // TODO : WRITE CODE TO PROCESS VIDEO AND GET TRANSCRIPT!!
        const transcriptResponse: {
          timestampedTranscript: {
            start: number,
            end: number,
            text: string,
            speaker: string
          }[],
          url: string,
          transcriptText: string
        } = await apiService.getVideoTranscriptWithTimestamp(
          videoId,
          token,
          true
        );
        const transcriptText = transcriptResponse.transcriptText;
        const transcriptSentences = transcriptResponse.timestampedTranscript;

        // Use the function with your logic
        const nameOutput = await extractNameFromNote(transcriptText + `Ensure that you exclude any names related to the following - ${excludedInputs}`)

        const titleCasedName = toTitleCase(nameOutput);
        const callName = `Video call with ${titleCasedName}`
        setCurrentTranscriptionTitle(callName);
        setCurrentTranscriptionIndex(videoIndex + 1);
        const createdContact = await apiService.createContact({
          name: titleCasedName
        }, email, token);
        if (video.language !== VideoLanguage.ENGLISH) {
          await apiService.structureTranscriptAndCreateDocument({
            transcript: transcriptText,
            templateId: activePlaybookId,
            userId: email,
            contactId: createdContact.id,
            videoId: video._id,
            accessToken: token,
            recontactUserName: name || "Interviewer",
          });
        }
        else {
          await apiService.structureTranscriptAndCreateDocumentWithTimestamp({
            transcript: transcriptText,
            transcriptSentences,
            templateId: activePlaybookId,
            userId: email,
            contactId: createdContact.id,
            videoId: video._id,
            accessToken: token,
            recontactUserName: name || "Interviewer"
          });
        }
        // await apiService.structureTranscriptAndCreateDocument({
        //     transcript: transcriptText,
        //     templateId: activePlaybookId,
        //     userId: email,
        //     contactId: createdContact.id,
        //     videoId: video._id,
        //     accessToken: token,
        //     recontactUserName: name || "Interviewer"
        // });

        await apiService.updateVideo(videoId, {
          status: VideoProcessingStatus.COMPLETED
        }, token);

        processedCount += 1;
        setProgress((processedCount / activeVideoIds.length) * 100); // Update progress
      }
      toast.success('All transcripts processed');
      setProcessingState("finished")
    } catch (error: any) {
      toast.error(`Error processing transcripts : ${error.message}`);
    } finally {
      dispatch(setActiveVideoIds([]));
      setProgress(0); // Reset progress when modal is closed
      setTimeout(() => {
        dispatch(setIsBottomDrawerOpen(false));
      }, 5000);
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
            {processingState === "processing" ? (
            // {currentTranscriptionTitle ? (
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
                  <div>
                    <p>Bulk processing completed</p>
                  </div>
              </>
            }
          </div>
        )}
      </Drawer>
    </div>
  );
}

export default BulkProcessUploadedVideosBottomDrawer;