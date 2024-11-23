import { setActiveData, setIsBottomDrawerOpen } from "@redux/features/activeEntitiesSlice";
import { RootState } from "@redux/store";
import { Drawer, Progress, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "./BulkProcessBottomDrawer.css";
import { useEffect, useState } from "react";
import apiService from "@utils/api/api-service";
import { TranscriptResponse } from "@models/fireflies.model";
import { convertDialogueJsonToString } from "../FirefliesAccountDashboard";
import { toTitleCase } from "@utils/commonFuncs";
import { VideoProcessingStatus, VideoSource } from "@models/video.model";
import toast from 'react-hot-toast';
import { CloseOutlined, UpOutlined } from "@ant-design/icons";

const BulkProcessBottomDrawer = () => {
  const isBottomDrawerOpen = useSelector((state: RootState) => state.activeEntities.isBottomDrawerOpen)
  const { email, token, firefliesApiKey, name } = useSelector(
    (state: RootState) => state.persisted.user.value
  );
  const activeTranscriptIds = useSelector(
    (state: RootState) => state.activeEntities.activeTranscriptIds
  );
  const activePlaybookId = useSelector(
    (state: RootState) => state.activeEntities.activePlaybookId
  );
  const dispatch = useDispatch()
  const [toggleText, setToggleText] = useState<"Open" | "Close">("Open")
  const [currentTranscriptionTitle, setCurrentTranscriptionTitle] =
    useState("");
  const [currentTranscriptionIndex, setCurrentTranscriptionIndex] =
    useState(0);
  const [progress, setProgress] = useState(0);
  const excludedInputs: string = useSelector(
    (state: RootState) => state.activeEntities.activeData
  );
  const [processingState, setProcessingState] = useState<"loading" | "finished">("loading")


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
      for (const tId of activeTranscriptIds) {
        try {
          const tIdIndex = activeTranscriptIds.indexOf(tId);
          const record = (await apiService.fetchTranscript({
            apiKey: firefliesApiKey!,
            transcriptId: tId,
          })) as TranscriptResponse;
          setCurrentTranscriptionTitle(record.title);
          setCurrentTranscriptionIndex(tIdIndex + 1);

          if (record.sentences === null) {
            // Skipping over the current conversation and updating the progress
            processedCount += 1;
            setProgress((processedCount / activeTranscriptIds.length) * 100); // Update progress
            continue; // Skip to the next transcript
          }

          const transcriptDialogue = convertDialogueJsonToString(
            record.sentences
          );
          const speakerNames = [
            ...new Set(
              record.sentences.map((sentence) =>
                sentence.speaker_name.toLowerCase()
              )
            ),
          ];

          const transcriptSentences = record.sentences.map((rs) => ({
            start: rs.start_time,
            end: rs.end_time,
            text: rs.text,
            speaker: rs.speaker_name
          }))



          // Separate excluded inputs into emails and names
          const inputsArray = excludedInputs
            ?.split(",")
            .map((input) => input.trim().toLowerCase());
          const excludedEmailsArray = inputsArray.filter((input) =>
            input.includes("@")
          );
          const excludedNamesArray = inputsArray.filter(
            (input) => !input.includes("@")
          );

          // Filter speakerNames by excluding names
          const filteredSpeakerNames = speakerNames.filter(
            (speakerName) => !excludedNamesArray.includes(speakerName)
          );

          const filteredAttendees = record?.meeting_attendees
            ? record.meeting_attendees.filter((attendee) => {
              return !excludedEmailsArray.includes(
                attendee.email.toLowerCase()
              );
            })
            : [];

          const determineName = (email: string, displayName: string) => {
            if (
              displayName &&
              !excludedNamesArray.includes(displayName.toLowerCase())
            )
              return displayName;
            const namePart = email?.split(/@|\./)[0];
            // Find a matching speaker name that is not excluded
            const matchingSpeakerName = filteredSpeakerNames.find(
              (speakerName) =>
                speakerName.includes(namePart) &&
                !excludedNamesArray.includes(speakerName)
            );
            // Ensure neither namePart nor matchingSpeakerName is excluded
            if (matchingSpeakerName) {
              return matchingSpeakerName;
            } else if (!excludedNamesArray.includes(namePart)) {
              return namePart;
            }
            // Fallback in case both are excluded or not found, might need adjustment based on desired behavior
            return "Unavailable Name"; // Adjust this based on how you want to handle names that are completely excluded
          };

          // Use the function with your logic
          const nameOutput =
            filteredAttendees.length > 0
              ? determineName(
                filteredAttendees[0]?.email,
                filteredAttendees[0]?.displayName
              )
              : speakerNames[0] || "";

          const titleCasedName = toTitleCase(nameOutput);

          const createdContact = await apiService.createContact(
            {
              name: titleCasedName,
              email: filteredAttendees ? filteredAttendees[0]?.email : "",
            },
            email,
            token
          );

          const createdVideo = await apiService.createVideo(
            {
              userId: email,
              videoUrl: `https://app.fireflies.ai/view/${record.title
                ?.split(" ")
                .join("-")}::${record.id}`,
              name: record.title,
              transcriptText: transcriptDialogue,
              createdAt: record.date,
              status: VideoProcessingStatus.COMPLETED,
              videoSource: VideoSource.FIREFLIES_IMPORT,
              videoSourceId: record.id,
            },
            token
          );
          await apiService.structureTranscriptAndCreateDocumentWithTimestamp({
            transcriptSentences,
            transcript: transcriptDialogue,
            templateId: activePlaybookId,
            userId: email,
            contactId: createdContact.id,
            videoId: createdVideo._id,
            accessToken: token,
            recontactUserName: name || "Interviewer",
          });
          // await apiService.structureTranscriptAndCreateDocument({
          //   transcript: transcriptDialogue,
          //   templateId: activePlaybookId,
          //   userId: email,
          //   contactId: createdContact.id,
          //   videoId: createdVideo._id,
          //   accessToken: token,
          //   recontactUserName: name || "Interviewer",
          // });
        } catch {
          toast.error(
            `Error processing transcript ${currentTranscriptionTitle}`
          );
          continue;
        }

        processedCount += 1;
        setProgress((processedCount / activeTranscriptIds.length) * 100);
      }
      toast.success(`Successfully processed ${processedCount} out of ${activeTranscriptIds.length} calls`)
      setProcessingState("finished")
      setCurrentTranscriptionTitle("");
      setCurrentTranscriptionIndex(0);
      dispatch(setActiveData(""))
    } catch (error: any) {
      toast.error(`Error processing transcripts : ${error.message}`);
    } finally {
      setTimeout(() => { dispatch(setIsBottomDrawerOpen(false)) }, 3000)
      setProgress(0);
      // window.location.reload()
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
            <span onClick={onBottomDrawerToggle}>{toggleText==="Close" ? <CloseOutlined /> : <UpOutlined />}</span>
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
                  {currentTranscriptionIndex}/{activeTranscriptIds.length}{" "}
                  total){" "}
                </p>
                <Progress percent={Math.round(progress)} />
                <p>
                  Average processing time per call is 2mins. Pretty cool, right? 😎
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
                  ><Spin /></div>
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

export default BulkProcessBottomDrawer;