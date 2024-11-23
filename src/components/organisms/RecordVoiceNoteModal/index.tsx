import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import {
  ActiveModalType,
  setActiveQueryString,
  setIsModalOpen,
} from "@redux/features/activeEntitiesSlice";
import { Button, Modal } from "antd";
import "./RecordVoiceNoteModal.css";
import MasterAudioRecorder from "@components/molecules/MasterAudioRecorder";

const RecordVoiceNoteModal = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isModalOpen, modalType } = useSelector(
    (state: RootState) => state.activeEntities
  );
  const isVisible =
    isModalOpen && modalType === ActiveModalType.RECORD_VOICE_NOTE;
  
  const onCancel = () => {
    dispatch(setActiveQueryString(""));
    dispatch(setIsModalOpen(false));
  };

  const handleSubmit = async () => {
    
  };
  return (
    <Modal
      title="Record Voice Note"
      visible={isVisible}
      onCancel={onCancel}
      footer={[
        <>
          {/* <Button key="submit" type="primary" onClick={handleSubmit}>
            Submit
          </Button>
          , */}
        </>,
      ]}
    >
          Click on the microphone to start recording. Click again to stop recording.
          <br />
          <br />
          <MasterAudioRecorder />
    </Modal>
  );
};

export default RecordVoiceNoteModal;
