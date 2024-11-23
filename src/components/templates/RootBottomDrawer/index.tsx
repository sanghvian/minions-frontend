import { BottomDrawerType } from "@redux/features/activeEntitiesSlice";
import { RootState } from '@redux/store'
import { useSelector } from 'react-redux'
import BulkProcessBottomDrawer from "@components/organisms/BulkProcessFirefliesImportsBottomDrawer";
import BulkProcessGDriveImportsBottomDrawer from "@components/organisms/BulkProcessGDriveImportsBottomDrawer";
import BulkProcessUploadedVideosBottomDrawer from "@components/organisms/BulkProcessUploadedVideosBottomDrawer";
const RootBottomDrawer = () => {
  const { isBottomDrawerOpen, bottomDrawerType } = useSelector(
    (state: RootState) => state.activeEntities
  );

  const getBottomDrawer = () => {
    switch (bottomDrawerType) {
      case BottomDrawerType.BULK_PROCESS_MEETINGS:
        return <BulkProcessBottomDrawer />;
      case BottomDrawerType.BULK_PROCESS_GDRIVE_IMPORTS:
        return <BulkProcessGDriveImportsBottomDrawer />;
      case BottomDrawerType.BULK_PROCESS_UPLOADED_VIDEOS:
        return <BulkProcessUploadedVideosBottomDrawer />;
      default:
        return null;
    }
  };
  return <>{isBottomDrawerOpen && getBottomDrawer()}</>;
};

export default RootBottomDrawer;
