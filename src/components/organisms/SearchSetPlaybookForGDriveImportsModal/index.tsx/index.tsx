import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Modal, Progress, Select } from 'antd'; // Import Progress from antd
import { ActiveModalType, BottomDrawerType, setActiveLanguage, setBottomDrawerType, setIsBottomDrawerOpen, setIsModalOpen } from '@redux/features/activeEntitiesSlice';
import { RootState } from '@redux/store';
import SearchSetPlaybook from '@components/molecules/SearchSetPlaybook';
import { VideoLanguage } from '@models/video.model';
import toast from 'react-hot-toast';

const SearchSetPlaybookForGDriveImportsModal = () => {
    const { isModalOpen, modalType } = useSelector((state: RootState) => state.activeEntities);
    const isVisible = isModalOpen && modalType === ActiveModalType.SET_PLAYBOOK_3;
    const dispatch = useDispatch();
    const { email, token, name } = useSelector((state: RootState) => state.persisted.user.value);
    const activeVideos = useSelector((state: RootState) => state.activeEntities.activeVideos);
    const activeVideoIds = activeVideos.map(video => video.id);
    const activePlaybookId = useSelector((state: RootState) => state.activeEntities.activePlaybookId);
    const [progress, setProgress] = useState(0); // State to keep track of progress
    const [excludedInputs, setExcludedInputs] = useState('');
    const [currentTranscriptionTitle, setCurrentTranscriptionTitle] = useState('');
    const [currentTranscriptionIndex, setCurrentTranscriptionIndex] = useState(0);
    const [isGuideSelected, setIsGuideSelected] = useState(false);

    const onCancel = () => {
        dispatch(setIsModalOpen(false));
        setProgress(0); // Reset progress when modal is closed
    };

    const handleBulkProcessTranscripts = async () => {
        dispatch(setIsBottomDrawerOpen(true));
        dispatch(setBottomDrawerType(BottomDrawerType.BULK_PROCESS_GDRIVE_IMPORTS))
        dispatch(setIsModalOpen(false));
        return
        // const toastId = toast.loading(`Processing your calls by your guide...`);
        // let processedCount = 0; // Counter for processed transcripts
        // try {
        //     for (const videoId of activeVideoIds) {
        //         if (!videoId) continue;
        //         const videoIndex = activeVideoIds.indexOf(videoId);
        //         const activeVideo = activeVideos.find(video => video.id === videoId);
        //         const transcriptResponse: {
        //             transcript: string,
        //             videoUrl: string
        //         } = await apiService.transcribeGDriveVideo({
        //             fileId: videoId,
        //             refreshToken: token
        //         });
        //         const transcriptText = transcriptResponse.transcript;

        //         // Use the function with your logic
        //         const nameOutput = await extractNameFromNote(transcriptText + `Ensure that you exclude any names related to the following - ${excludedInputs}`)

        //         const titleCasedName = toTitleCase(nameOutput);
        //         const callName = `Video call with ${titleCasedName}`
        //         setCurrentTranscriptionTitle(activeVideo?.name || callName);
        //         setCurrentTranscriptionIndex(videoIndex + 1);
        //         const createdContact = await apiService.createContact({
        //             // name: titleCasedName
        //             name: activeVideo?.name
        //         }, email, token);

        //         const createdVideo = await apiService.createVideo({
        //             userId: email,
        //             videoUrl: transcriptResponse.videoUrl,
        //             videoSource: VideoSource.GOOGLE_DRIVE,
        //             videoSourceId: videoId,
        //             transcriptText,
        //             status: VideoProcessingStatus.PROCESSING,
        //             name: activeVideo?.name,
        //             createdAt: activeVideo?.date
        //         }, token)

        //         await apiService.structureTranscriptAndCreateDocument({
        //             transcript: transcriptText,
        //             templateId: activePlaybookId,
        //             userId: email,
        //             contactId: createdContact.id,
        //             videoId: createdVideo._id,
        //             accessToken: token,
        //             recontactUserName: name || "Interviewer"
        //         });

        //         await apiService.updateVideo(createdVideo._id, {
        //             status: VideoProcessingStatus.COMPLETED
        //         }, token);

        //         processedCount += 1;
        //         setProgress((processedCount / activeVideoIds.length) * 100); // Update progress
        //     }
        //     toast.success('All transcripts processed', { id: toastId });
        //     setProgress(0)
        // } catch (error: any) {
        //     toast.error(`Error processing transcripts : ${error.message}`);
        // } finally {
        //     dispatch(setActiveVideoIds([]));
        //     dispatch(setIsModalOpen(false));
        //     setProgress(0); // Reset progress when modal is closed
        //     toast.dismiss(toastId); // Dismiss the toast
        // }


    };

    return (
      <Modal
        title={`Select ${isGuideSelected ? "Language" : "Guide"}`}
        visible={isVisible}
        onCancel={onCancel}
        maskClosable={false}
        footer={null}
      >
        {!isGuideSelected ? (
          <div>
            <label>Exclude names or emails: </label>
            <Input
              placeholder="Enter names or emails to exclude, separated by commas"
              value={excludedInputs}
              onChange={(e) => setExcludedInputs(e.target.value)}
            />
            <br />
            <SearchSetPlaybook handleNextFunc={handleBulkProcessTranscripts} />
            <div>
              <Button onClick={onCancel} style={{ marginRight: "10px" }}>
                Cancel
              </Button>
              <Button
                // key="submit"
                type="primary"
                onClick={() => {
                  if(activePlaybookId)
                    setIsGuideSelected(true)
                  else
                    toast.error('Please select a guide')
                }}
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ padding: "10px 0px" }}>
              <Select
                placeholder="Select language"
                onChange={(value) => {
                  dispatch(setActiveLanguage(value));
                }}
                style={{ width: "50%", marginRight: "1rem" }}
                options={[
                  {
                    value: VideoLanguage.ENGLISH,
                    label: "English",
                  },
                  {
                    value: VideoLanguage.HINDI,
                    label: "Hindi",
                  },
                ]}
              />
              <p>
                All the selected Languages will be processed the selected
                language
              </p>
              <Button onClick={onCancel} style={{ marginRight: "10px" }}>
                Cancel
              </Button>
              <Button type="primary" onClick={handleBulkProcessTranscripts}>
                Finish
              </Button>
            </div>
          </div>
        )}
      </Modal>
    );
};

export default SearchSetPlaybookForGDriveImportsModal;
