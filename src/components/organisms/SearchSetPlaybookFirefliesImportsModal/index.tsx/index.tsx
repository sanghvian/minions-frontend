import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Modal, Progress } from 'antd'; // Import Progress from antd
import { ActiveModalType, BottomDrawerType, setActiveData, setBottomDrawerType, setIsBottomDrawerOpen, setIsModalOpen } from '@redux/features/activeEntitiesSlice';
import { RootState } from '@redux/store';
import SearchSetPlaybook from '@components/molecules/SearchSetPlaybook';

const SearchSetPlaybookFirefliesImportsModal = () => {
    const { isModalOpen, modalType } = useSelector((state: RootState) => state.activeEntities);
    const isVisible = isModalOpen && modalType === ActiveModalType.SET_PLAYBOOK;
    const dispatch = useDispatch();
    const { email, token, firefliesApiKey, name } = useSelector((state: RootState) => state.persisted.user.value);
    const activeTranscriptIds = useSelector((state: RootState) => state.activeEntities.activeTranscriptIds);
    const activePlaybookId = useSelector((state: RootState) => state.activeEntities.activePlaybookId);
    const [progress, setProgress] = useState(0); // State to keep track of progress
    const [excludedInputs, setExcludedInputs] = useState('');
    const [currentTranscriptionTitle, setCurrentTranscriptionTitle] = useState('');
    const [currentTranscriptionIndex, setCurrentTranscriptionIndex] = useState(0);

    const onCancel = () => {
        dispatch(setIsModalOpen(false));
        setProgress(0); // Reset progress when modal is closed
    };

    const handleBulkProcessTranscripts = async () => {
        dispatch(setIsBottomDrawerOpen(true));
        dispatch(setBottomDrawerType(BottomDrawerType.BULK_PROCESS_MEETINGS))
        dispatch(setIsModalOpen(false));
        return
        // const toastId = toast.loading(`Processing your calls by your playbook...`);
        // let processedCount = 0; // Counter for processed transcripts
        // try {
        //     for (const tId of activeTranscriptIds) {
        //         try {
        //             const tIdIndex = activeTranscriptIds.indexOf(tId);
        //             const record = await apiService.fetchTranscript({
        //                 apiKey: firefliesApiKey!,
        //                 transcriptId: tId
        //             }) as TranscriptResponse;
        //             setCurrentTranscriptionTitle(record.title);
        //             setCurrentTranscriptionIndex(tIdIndex + 1);

        //             // Check if sentences are null and show toast message if so
        //             if (record.sentences === null) {
        //                 toast(`The transcript for ${record.title} is not available in Fireflies, kindly activate it there before processing it here`);
        //                 // Skipping over the current conversation and updating the progress
        //                 processedCount += 1;
        //                 setProgress((processedCount / activeTranscriptIds.length) * 100); // Update progress
        //                 continue; // Skip to the next transcript
        //             }

        //             const transcriptDialogue = convertDialogueJsonToString(record.sentences);
        //             const speakerNames = [...new Set(record.sentences.map(sentence => sentence.speaker_name.toLowerCase()))];

        //             // Separate excluded inputs into emails and names
        //             const inputsArray = excludedInputs?.split(',').map(input => input.trim().toLowerCase());
        //             const excludedEmailsArray = inputsArray.filter(input => input.includes('@'));
        //             const excludedNamesArray = inputsArray.filter(input => !input.includes('@'));

        //             // Filter speakerNames by excluding names
        //             const filteredSpeakerNames = speakerNames.filter(speakerName => !excludedNamesArray.includes(speakerName));

        //             const filteredAttendees = record?.meeting_attendees ? record.meeting_attendees.filter((attendee) => {
        //                 return !excludedEmailsArray.includes(attendee.email.toLowerCase());
        //             }) : [];

        //             const determineName = (email: string, displayName: string) => {
        //                 if (displayName && !excludedNamesArray.includes(displayName.toLowerCase())) return displayName;
        //                 const namePart = email?.split(/@|\./)[0];
        //                 // Find a matching speaker name that is not excluded
        //                 const matchingSpeakerName = filteredSpeakerNames.find(speakerName =>
        //                     speakerName.includes(namePart) && !excludedNamesArray.includes(speakerName)
        //                 );
        //                 // Ensure neither namePart nor matchingSpeakerName is excluded
        //                 if (matchingSpeakerName) {
        //                     return matchingSpeakerName;
        //                 } else if (!excludedNamesArray.includes(namePart)) {
        //                     return namePart;
        //                 }
        //                 // Fallback in case both are excluded or not found, might need adjustment based on desired behavior
        //                 return 'Unavailable Name'; // Adjust this based on how you want to handle names that are completely excluded
        //             };


        //             // Use the function with your logic
        //             const nameOutput = filteredAttendees.length > 0
        //                 ? determineName(filteredAttendees[0]?.email, filteredAttendees[0]?.displayName)
        //                 : speakerNames[0] || "";

        //             const titleCasedName = toTitleCase(nameOutput);

        //             const createdContact = await apiService.createContact({
        //                 name: titleCasedName,
        //                 email: filteredAttendees ? filteredAttendees[0]?.email : "",
        //             }, email, token);

        //             const createdVideo = await apiService.createVideo({
        //                 userId: email,
        //                 videoUrl: `https://app.fireflies.ai/view/${record.title?.split(" ").join('-')}::${record.id}`,
        //                 name: record.title,
        //                 transcriptText: transcriptDialogue,
        //                 createdAt: record.date,
        //                 status: VideoProcessingStatus.COMPLETED,
        //                 videoSource: VideoSource.FIREFLIES_IMPORT,
        //                 videoSourceId: record.id
        //             }, token);

        //             await apiService.structureTranscriptAndCreateDocument({
        //                 transcript: transcriptDialogue,
        //                 templateId: activePlaybookId,
        //                 userId: email,
        //                 contactId: createdContact.id,
        //                 videoId: createdVideo._id,
        //                 accessToken: token,
        //                 recontactUserName: name || "Interviewer"
        //             });
        //         } catch {
        //             toast.error(`Error processing transcript ${currentTranscriptionTitle}`);
        //             continue;
        //         }

        //         processedCount += 1;
        //         setProgress((processedCount / activeTranscriptIds.length) * 100); // Update progress
        //     }

        //     toast.success('All transcripts processed, refresh page to see changes!', { id: toastId });
        //     setCurrentTranscriptionTitle('');
        //     setCurrentTranscriptionIndex(0);
        // } catch (error: any) {
        //     toast.error(`Error processing transcripts : ${error.message}`);
        // } finally {
        //     dispatch(setIsModalOpen(false));
        //     setProgress(0); // Reset progress when modal is closed
        //     toast.dismiss(toastId); // Dismiss the toast
        // }
    };

    return (
        <Modal
            title="Select Guide"
            visible={isVisible}
            onCancel={onCancel}
            maskClosable={false}
            footer={
                currentTranscriptionTitle ? <p>Average processing time per call is 2mins. Pretty cool, right? 😎</p> : [<Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleBulkProcessTranscripts}>
                    Submit
                </Button>]

            }
        >
            {currentTranscriptionTitle ? <>
                <p>We are processing {currentTranscriptionTitle} call ({currentTranscriptionIndex}/{activeTranscriptIds.length} total) </p>
                <Progress percent={Math.round(progress)} />
            </> :
                <>
                    <div>
                        <label>Exclude names or emails: </label>
                        <Input placeholder="Enter names or emails to exclude, separated by commas" value={excludedInputs} onChange={(e) => {
                            setExcludedInputs(e.target.value)
                            dispatch(setActiveData(e.target.value))
                        }} />
                    </div>
                    <br />
                    <SearchSetPlaybook handleNextFunc={handleBulkProcessTranscripts} />
                </>
            }
        </Modal>
    );
};

export default SearchSetPlaybookFirefliesImportsModal;
