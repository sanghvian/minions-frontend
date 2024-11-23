import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Modal, Progress } from 'antd'; // Import Progress from antd
import { ActiveModalType, BottomDrawerType, setActiveVideoIds, setBottomDrawerType, setIsBottomDrawerOpen, setIsModalOpen } from '@redux/features/activeEntitiesSlice';
import { RootState } from '@redux/store';
import apiService from '@utils/api/api-service';
import toast from 'react-hot-toast';
import SearchSetPlaybook from '@components/molecules/SearchSetPlaybook';
import { TranscriptResponse } from '@models/fireflies.model';
import { convertDialogueJsonToString } from '@components/organisms/FirefliesAccountDashboard';
import { toTitleCase } from '@utils/commonFuncs';
import { extractNameFromNote } from '@utils/contactFuncs';
import { format } from 'date-fns';
import { VideoLanguage, VideoProcessingStatus } from '@models/video.model';

const SearchSetPlaybookForVideosModal = () => {
    const { isModalOpen, modalType } = useSelector((state: RootState) => state.activeEntities);
    const isVisible = isModalOpen && modalType === ActiveModalType.SET_PLAYBOOK_2;
    const dispatch = useDispatch();
    const { email, token, name } = useSelector((state: RootState) => state.persisted.user.value);
    const activeVideoIds = useSelector((state: RootState) => state.activeEntities.activeVideoIds);
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
        dispatch(setBottomDrawerType(BottomDrawerType.BULK_PROCESS_UPLOADED_VIDEOS))
        dispatch(setIsModalOpen(false));
        return
    };

    return (
        <Modal
            title="Select Guide"
            visible={isVisible}
            onCancel={onCancel}
            maskClosable={false}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleBulkProcessTranscripts}>
                    Submit
                </Button>,
            ]}
        >
            {currentTranscriptionTitle ? <>
                <p>We are processing {currentTranscriptionTitle} call ({currentTranscriptionIndex}/{activeVideoIds.length} total) </p>
                <Progress percent={Math.round(progress)} />
            </> :
                <>
                    <div>
                        <label>Exclude names or emails: </label>
                        <Input placeholder="Enter names or emails to exclude, separated by commas" value={excludedInputs} onChange={(e) => setExcludedInputs(e.target.value)} />
                    </div>
                    <br />
                    <SearchSetPlaybook handleNextFunc={handleBulkProcessTranscripts} />
                </>
            }
        </Modal>
    );
};

export default SearchSetPlaybookForVideosModal;
