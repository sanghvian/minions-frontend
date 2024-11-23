import { LinkedinFilled, StarOutlined } from "@ant-design/icons";
import { HistoryType } from "@models/history.model";
import { CompleteLinkedinContact } from "@models/linkedinContact.model";
import { BottomSheetType, setActiveQueryString, setBottomSheetType, setHandleBottomSheetClose, setIsBottomSheetOpen } from "@redux/features/activeEntitiesSlice";
import { clearContactNotes, setLinkedinContactForContact } from "@redux/features/contactSlice";
import { AppDispatch, RootState } from "@redux/store";
import apiService from "@utils/api/api-service";
import { Button, Card, Spin, Typography } from "antd";
import Link from "antd/es/typography/Link";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import HistoryTimeline from "../HistoryTimeline";

const LinkedinContactDetails: React.FC<{ linkedinContactId: string }> = ({ linkedinContactId }) => {
    const { token, email } = useSelector((state: RootState) => state.persisted.user.value);
    const contact = useSelector((state: RootState) => state.contact.value.activeContact);

    const { data, isLoading } = useQuery({
        queryKey: ["getLinkedinContact", linkedinContactId, token],
        queryFn: async ({ queryKey }) => {
            if (!queryKey[1]) return null;
            return await apiService.getLinkedinContact(queryKey[1], queryKey[2]!)
        },
    })
    const linkedinContact = useSelector((state: RootState) => state.contact.value.activeContact?.linkedinContact!);
    const fetchedLiContact = data as CompleteLinkedinContact;
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if (fetchedLiContact) {
            dispatch(setLinkedinContactForContact(fetchedLiContact));
        }
    }, [fetchedLiContact, dispatch]);


    // Sort histories by startDate
    const sortedWorkHistories = linkedinContact?.histories!
        .filter(history => history.historyType === HistoryType.WORK)
        .filter((h) => h?.startDate?.length)
        .sort(
            (a, b) => new Date(b.startDate!).getTime() - new Date(a.startDate!).getTime()
        )
    const remainingWorkHistories = linkedinContact?.histories!
        .filter(history => history.historyType === HistoryType.WORK)
        .filter((h) => !(h?.startDate?.length))

    const sortedEducationHistories = linkedinContact?.histories!
        .filter(history => history.historyType === HistoryType.EDUCATION)
        .filter((h) => h?.startDate?.length)
        .sort(
            (a, b) => new Date(b.startDate!).getTime() - new Date(a.startDate!).getTime()
        );
    const remainingEducationHistories = linkedinContact?.histories!
        .filter(history => history.historyType === HistoryType.EDUCATION)
        .filter((h) => !(h?.startDate?.length))

    return (
        linkedinContactId?.length > 0 && linkedinContact?.histories && linkedinContact?.histories.length > 0
            ? isLoading && linkedinContact !== undefined ? <Spin /> : <div>
                <Card
                    // title={linkedinContact.name}
                    bordered={false}
                    style={{ width: 300 }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        {linkedinContact?.headline || linkedinContact?.name}
                        <Link href={linkedinContact?.linkedinUrl}>
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
                    dispatch(setActiveQueryString(`linkedin: ${contact?.name}`))
                    dispatch(setIsBottomSheetOpen(true))
                    dispatch(clearContactNotes());
                    dispatch(setHandleBottomSheetClose(async (linkedinUrl: any) => {
                        const toastId = toast.loading('Enhancing contact, takes about a minute...')
                        try {

                            const linkedinContact = await apiService.enhanceContactLinkedin(linkedinUrl!, contact.id!, email, token);
                            dispatch(setLinkedinContactForContact(linkedinContact));
                            toast.success('Enhanced contact!', { id: toastId })
                            dispatch(setIsBottomSheetOpen(false));

                        } catch (error) {
                            toast.error('Failed to enhance contact, please refresh the screen and try again', { id: toastId })
                        }
                    }))
                    dispatch(setBottomSheetType(BottomSheetType.ENHANCE_LINKEDIN))
                }}
            >
                Enhance with LinkedIn
            </Button>
    );
};

export default LinkedinContactDetails;