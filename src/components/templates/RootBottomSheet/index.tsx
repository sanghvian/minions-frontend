import SearchAndResults from '@components/molecules/SearchAndResults'
import { ActiveRouteKey, BottomSheetType, setActiveRouteKey, setIsBottomSheetOpen } from '@redux/features/activeEntitiesSlice'
import { AppDispatch, RootState } from '@redux/store'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import './RootBottomSheet.css'
import AddContactContainer from '../../../legacy/AddContactContainer'
import { useNavigate } from 'react-router-dom'
import SearchAndEditGroup from '../../../legacy/SearchAndEditGroup'
import EnhanceLinkedinSearch from '../../../legacy/EnhanceLinkedinSearch'
import { Typography } from 'antd'
import RichTextNoteAddContainer from '../../organisms/RichTextNoteAddContainer'
import QRScanner2 from '../../../legacy/QRScanner2'
import AddPlaybookContainer from '../../organisms/AddPlaybookContainer'
import SearchSetPlaybook from '@components/molecules/SearchSetPlaybook'
import SearchAndResults2 from '@components/molecules/SearchAndResults2'

export default function RootBottomSheet() {
    const { isBottomSheetOpen, bottomSheetType } = useSelector((state: RootState) => state.activeEntities)
    const sheetRef = useRef<any>(null)
    const dispatch: AppDispatch = useDispatch()
    const navigate = useNavigate();

    const toggleAddMode = () => {
        dispatch(setIsBottomSheetOpen(!isBottomSheetOpen))
        if (!isBottomSheetOpen) {
            dispatch(setActiveRouteKey(ActiveRouteKey.CONTACTS))
            navigate(`/${ActiveRouteKey.CONTACTS}`)
        }
    }

    const renderBottomSheetByType = () => {
        switch (bottomSheetType) {
            case BottomSheetType.SEARCH_ADD:
                return (
                    <div className='bottom-sheet-container'>
                        <SearchAndResults2 />
                    </div>
                )
            case BottomSheetType.CONTACT_ADD:
                return (
                    <div className='bottom-sheet-container'>
                        <AddContactContainer />
                    </div>
                )
            case BottomSheetType.GROUP_ADD:
            case BottomSheetType.GROUP_EDIT:
                return (
                    <div className='bottom-sheet-wrapper'>
                        <SearchAndEditGroup />
                    </div>
                )
            case BottomSheetType.ENHANCE_LINKEDIN:
                return (
                    <div className='bottom-sheet-wrapper'>
                        <EnhanceLinkedinSearch />
                    </div>
                )
            case BottomSheetType.NOTE_ADD:
                return (
                    <div className='bottom-sheet-wrapper'>
                        <RichTextNoteAddContainer />
                    </div>
                )
            case BottomSheetType.QR_SCAN:
                return (
                    <div className='bottom-sheet-wrapper'>
                        <QRScanner2 />
                    </div>
                )
            case BottomSheetType.PLAYBOOK_ADD:
                return (
                    <div className='bottom-sheet-wrapper-2'>
                        <AddPlaybookContainer />
                    </div>
                )
            case BottomSheetType.PLAYBOOK_SEARCH:
                return (
                    <div className='bottom-sheet-wrapper-2'>
                        <SearchSetPlaybook />
                    </div>
                )
            default:
                return <></>
        }
    }

    const returnBottomSheetTitle = () => {
        switch (bottomSheetType) {
            case BottomSheetType.SEARCH_ADD:
                return 'Search and Add Contact'
            case BottomSheetType.CONTACT_ADD:
                return 'Add Contact'
            case BottomSheetType.GROUP_ADD:
                return 'Add Group'
            case BottomSheetType.GROUP_EDIT:
                return 'Edit Group'
            case BottomSheetType.ENHANCE_LINKEDIN:
                return "Enhance Contact's background with linkedin"
            case BottomSheetType.NOTE_ADD:
                return "Add Transcript"
            case BottomSheetType.PLAYBOOK_ADD:
                return "Create Playbook"
            default:
                return ''
        }
    }

    return (
        <>
            <BottomSheet
                open={isBottomSheetOpen}
                ref={sheetRef}
                expandOnContentDrag={true}
                onDismiss={() => {
                    toggleAddMode()
                }}
                maxHeight={window.innerHeight} // (this variable is defined in the library itself)
                defaultSnap={({ maxHeight }) => maxHeight}
                snapPoints={({ maxHeight }) => {
                    return [
                        maxHeight * 0.95,
                        maxHeight / 2.3,
                        maxHeight * 0.6,
                    ]
                }}
            >
                <div style={{ padding: '0 2rem', margin: 0 }}>
                    <Typography.Title level={5}>{returnBottomSheetTitle()}</Typography.Title>
                </div>
                {renderBottomSheetByType()}
            </BottomSheet>
        </>
    )
}
