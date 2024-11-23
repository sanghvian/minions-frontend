import { LinkedinFilled, StarOutlined } from "@ant-design/icons";
import { HistoryType } from "@models/history.model";
import { CompleteLinkedinContact } from "@models/linkedinContact.model";
import { BottomSheetType, setActiveQueryString, setBottomSheetType, setHandleBottomSheetClose, setIsBottomSheetOpen } from "@redux/features/activeEntitiesSlice";
import { clearContactNotes } from "@redux/features/contactSlice";
import { setUserLinkedinContact } from "@redux/features/userSlice";
import { AppDispatch, RootState } from "@redux/store";
import apiService from "@utils/api/api-service";
import { Button, Card, Spin, Typography } from "antd";
import Link from "antd/es/typography/Link";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import HistoryTimeline from "../HistoryTimeline";

const UserLinkedinDetails: React.FC<{ linkedinContactId: string }> = ({ linkedinContactId }) => {
    const { token } = useSelector((state: RootState) => state.persisted.user.value);
    const user = useSelector((state: RootState) => state.persisted.user.value);

    const { data, isLoading } = useQuery({
        queryKey: ["getUserLinkedinContact", linkedinContactId, token],
        queryFn: async ({ queryKey }) => {
            if (!queryKey[1]) return null;
            return await apiService.getLinkedinContact(queryKey[1], queryKey[2]!)
        },
    })
    const userLinkedinContact = useSelector((state: RootState) => state.persisted.user.value?.linkedinContact!);
    const fetchedLiContact = data as CompleteLinkedinContact;
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if (fetchedLiContact) {
            dispatch(setUserLinkedinContact(fetchedLiContact));
        }
    }, [fetchedLiContact, dispatch]);


    // Sort histories by startDate
    const sortedWorkHistories = userLinkedinContact?.histories!
        .filter(history => history.historyType === HistoryType.WORK)
        .filter((h) => h?.startDate?.length)
        .sort(
            (a, b) => new Date(b.startDate!).getTime() - new Date(a.startDate!).getTime()
        )
    const remainingWorkHistories = userLinkedinContact?.histories!
        .filter(history => history.historyType === HistoryType.WORK)
        .filter((h) => !(h?.startDate?.length))

    const sortedEducationHistories = userLinkedinContact?.histories!
        .filter(history => history.historyType === HistoryType.EDUCATION)
        .filter((h) => h?.startDate?.length)
        .sort(
            (a, b) => new Date(b.startDate!).getTime() - new Date(a.startDate!).getTime()
        );
    const remainingEducationHistories = userLinkedinContact?.histories!
        .filter(history => history.historyType === HistoryType.EDUCATION)
        .filter((h) => !(h?.startDate?.length))

    return (
        linkedinContactId?.length > 0
            ? isLoading && userLinkedinContact !== undefined
                ? <Spin />
                : <div>
                    <Card
                        // title={userLinkedinContact.name}
                        bordered={false}
                        style={{ width: 300 }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            {userLinkedinContact?.headline || userLinkedinContact?.name}
                            <Link href={userLinkedinContact?.linkedinUrl}>
                                <Button icon={<LinkedinFilled />} />
                            </Link>
                        </div>
                    </Card>
                    <div>
                        <Typography.Title level={3}>Work Experience</Typography.Title>
                        <HistoryTimeline histories={sortedWorkHistories} />
                        <HistoryTimeline histories={remainingWorkHistories} />
                    </div>
                    <div>
                        <Typography.Title level={3}>Education</Typography.Title>
                        <div>
                            <HistoryTimeline histories={sortedEducationHistories} />
                            <HistoryTimeline histories={remainingEducationHistories} />
                        </div>
                    </div>
                </div>
            : <Button
                icon={<StarOutlined />}
                type="primary"
                onClick={() => {
                    dispatch(setActiveQueryString(`linkedin: ${user?.name}`))
                    dispatch(setIsBottomSheetOpen(true))
                    dispatch(clearContactNotes());
                    dispatch(setHandleBottomSheetClose(async (linkedinUrl: any) => {
                        try {
                            const toastId = toast.loading('Enhancing User, takes about a minute...')
                            try {
                                const linkedinContact = await apiService.enhanceUserLinkedin(linkedinUrl!, user.id!, user.email, token);
                                dispatch(setUserLinkedinContact(linkedinContact));
                                toast.success('User enhanced!', { id: toastId });
                            } catch (error) {
                                toast.error('Failed to enhance user, please refresh the screen and try again', { id: toastId })

                            }
                        } catch (error) {
                            toast.error('Failed to enhance user, please refresh the screen and try again')

                        } finally {
                            dispatch(setIsBottomSheetOpen(false));
                        }
                    }))
                    dispatch(setBottomSheetType(BottomSheetType.ENHANCE_LINKEDIN))
                }}
            >
                Enhance with LinkedIn
            </Button>
    );
};

export default UserLinkedinDetails;