import { ActiveModalType } from '@redux/features/activeEntitiesSlice'
import { RootState } from '@redux/store'
import { useSelector } from 'react-redux'
import EditContactModalV2 from '../../../legacy/EditContactModalV2'
import EditNoteModal from '../../organisms/EditNoteModal'
import OnlineSearchResultsModal from '../../organisms/SearchResultsModal'
import EditActionModal from '../../../legacy/EditActionModal'
import EditSuggestedActionsModal from '../../../legacy/EditSuggestedActionsModal'
import AddEditPlaybookModal from '@components/organisms/AddEditPlaybookModal'
import RichTextNoteModal from '@components/organisms/RichTextNoteModal'
import ReviewStructuredNoteModal from '@components/organisms/ReviewStructuredNoteModal'
import RecordVoiceNoteModal from '@components/organisms/RecordVoiceNoteModal'
import UploadFileModal from '@components/organisms/UploadFileModal'
import SetSpreadsheetModal from '@components/organisms/SetSpreadsheetModal'
import SetFirefliesApiKeyModal from '@components/organisms/SetFirefliesApiKeyModal'
import DraftSendEmailModal from '../../../legacy/DraftSendEmailModal'
import AddEditTagModal from '@components/organisms/AddEditTagModal'
import SetSearchPlaybookModal from '@components/organisms/SearchSetPlaybookFirefliesImportsModal/index.tsx'
import SetNotionCredsModal from '@components/organisms/SetNotionCredsModal'
import SearchSetPlaybookForVideosModal from '@components/organisms/SearchSetPlaybookForVideosModal/index.tsx'
import SearchSetPlaybookForGDriveImportsModal from '@components/organisms/SearchSetPlaybookForGDriveImportsModal/index.tsx'

const RootModal = () => {
  const { isModalOpen, modalType } = useSelector((state: RootState) => state.activeEntities)


  // Switch case to render the correct modal based on modal type
  const getModal = () => {
    switch (modalType) {
      case ActiveModalType.CONTACT_MODAL:
        return <EditContactModalV2 />;
      case ActiveModalType.NOTE_MODAL:
        return <EditNoteModal />;
      case ActiveModalType.ACTION_MODAL:
        return <EditActionModal />;
      case ActiveModalType.ONLINE_SEARCH_MODAL:
        return <OnlineSearchResultsModal />;
      case ActiveModalType.EDIT_SUGGESTED_ACTIONS:
        return <EditSuggestedActionsModal />;
      case ActiveModalType.PLAYBOOK_ADD:
        return <AddEditPlaybookModal />;
      case ActiveModalType.NOTE_ADD:
        return <RichTextNoteModal />;
      case ActiveModalType.NOTE_REVIEW:
        return <ReviewStructuredNoteModal />;
      case ActiveModalType.RECORD_VOICE_NOTE:
        return <RecordVoiceNoteModal />;
      case ActiveModalType.UPLOAD_AUDIO_VIDEO_FILE:
        return <UploadFileModal />;
      case ActiveModalType.SET_SPREADSHEET:
        return <SetSpreadsheetModal />;
      case ActiveModalType.SET_NOTION_CREDS:
        return <SetNotionCredsModal />;
      case ActiveModalType.SET_FIREFLIES_API_KEY:
        return <SetFirefliesApiKeyModal />;
      case ActiveModalType.DRAFT_AND_SEND_EMAIL:
        return <DraftSendEmailModal />;
      case ActiveModalType.SET_PLAYBOOK:
        return <SetSearchPlaybookModal />;
      case ActiveModalType.SET_PLAYBOOK_2:
        return <SearchSetPlaybookForVideosModal />;
      case ActiveModalType.SET_PLAYBOOK_3:
        return <SearchSetPlaybookForGDriveImportsModal />;
      case ActiveModalType.ADD_TAG:
        return <AddEditTagModal />;
      case ActiveModalType.EDIT_TAG:
        return <AddEditTagModal />;
      default:
        return null;
    }
  }
  return (
    <>
      {isModalOpen && getModal()}
    </>
  )
}

export default RootModal
