import SearchAndResults from '@components/molecules/SearchAndResults';
import { ActiveModalType, setActiveQueryString, setIsModalOpen, setModalType } from '@redux/features/activeEntitiesSlice';
import { AppDispatch, RootState } from '@redux/store';
import { Button, Modal } from 'antd';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

const OnlineSearchResultsModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isModalOpen, modalType } = useSelector((state: RootState) => state.activeEntities);
  const isVisible = isModalOpen && modalType === ActiveModalType.ONLINE_SEARCH_MODAL;

  const onCancel = () => {
    dispatch(setActiveQueryString(''));
    dispatch(setModalType(ActiveModalType.CONTACT_MODAL));
    dispatch(setIsModalOpen(false));
  }

  const handleSubmit = () => {
    dispatch(setModalType(ActiveModalType.CONTACT_MODAL));
  }

  return (
    <Modal
      title="Search Person"
      visible={isVisible}
      onCancel={onCancel}
      footer={[
        <>
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Done
          </Button>,

        </>
      ]}
    >
      <SearchAndResults />
    </Modal>
  );
};

export default OnlineSearchResultsModal;