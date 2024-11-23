import {
    ActiveModalType,
    setActiveQueryString,
    setIsModalOpen
} from '@redux/features/activeEntitiesSlice'
import { AppDispatch, RootState } from '@redux/store'
import { Button, Modal } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RichTextNoteAddContainer from '../RichTextNoteAddContainer'

const RichTextNoteModal = () => {

    const { isModalOpen, modalType } = useSelector((state: RootState) => state.activeEntities)
    const isVisible = isModalOpen && modalType === ActiveModalType.NOTE_ADD;
    const dispatch: AppDispatch = useDispatch();

    const [handleSubmit, setHandleSubmit] = React.useState<any>(() => { });

    const onCancel = () => {
        dispatch(setActiveQueryString(''));
        // dispatch(setModalType(ActiveModalType.CONTACT_MODAL));
        dispatch(setIsModalOpen(false));
    }

    return (
        <Modal
            title="Add Rich Text Note"
            visible={isVisible}
            onCancel={onCancel}
            footer={[
                <>
                    <Button key="submit" type="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                    <RichTextNoteAddContainer setHandleSubmit={setHandleSubmit} />
                </>
            ]}
        >

        </Modal>
    )
}

export default RichTextNoteModal
