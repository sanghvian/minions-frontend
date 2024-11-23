import { DraftEmailRequest } from "@models/email.model";
import { ActiveModalType, setIsModalOpen } from "@redux/features/activeEntitiesSlice";
import { RootState } from "@redux/store";
import apiService from "@utils/api/api-service";
import { Button, Input, Modal, Spin, message } from "antd"
import { useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import "./DraftSendEmailModal.css";

const DraftSendEmailModal = () => {
  const { isModalOpen, modalType } = useSelector(
    (state: RootState) => state.activeEntities
  );
  const [isLoading, setIsLoading] = useState(true);
  const [emailTitle, setEmailTitle] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const isVisible =
    isModalOpen && modalType === ActiveModalType.DRAFT_AND_SEND_EMAIL;
  const dispatch = useDispatch();
  const { email, token, id } = useSelector(
    (state: RootState) => state.persisted.user.value
  );
  const currentDoc = useSelector(
    (state: RootState) => state.document.activeDocument
  );
  const [emailId, setEmailId] = useState(currentDoc.contact.email);
  const documentNote =
    currentDoc?.contentResponses
      ?.map(
        (content) =>
          `${content.contentBlockId.description}: ${content.answerText}.`
      )
      .join(" ") ?? "";
  const draftEmailBody: DraftEmailRequest = {
    contact: {
      id: currentDoc.contact.id,
      name: currentDoc.contact.name,
      biography: currentDoc.contact.biography,
      email: currentDoc.contact.email,
    },
    note: documentNote,
    senderEmail: email,
  };
  useQuery({
    queryKey: ["getEmailDraft", draftEmailBody, token],
    queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return null;
      const email = await apiService.draftEmail(
        (queryKey[1] as DraftEmailRequest)!,
        (queryKey[2] as string)!
      );
      setEmailTitle(email.emailTitle);
      setEmailBody(email.emailBody);
      setIsLoading(false);
    },
  }); 
    
  const onCancel = () => {
    dispatch(setIsModalOpen(false));
  };
    const handleSendEmail = () => {
      if (!emailId || !emailTitle || !emailBody) {
        return;
      }
    const sendEmailBody = {
      contact: {
        id: currentDoc.contact.id,
        name: currentDoc.contact.name,
        biography: currentDoc.contact.biography,
        email: emailId,
      },
      subject: emailTitle,
      html: emailBody,
      senderEmail: email,
    };
        // console.log("sendEmailBody", sendEmailBody);
        apiService.sendDraftedEmail(sendEmailBody, token)
            .then(() => {
            message.success("Email sent successfully");
          onCancel();
        })
        .catch((err) => {
          alert("Error sending email: " + err.message);
        });
  };
  return (
    <Modal
      visible={isVisible}
      title="Draft and Send Email"
      onCancel={onCancel}
      maskClosable={false}
      footer={[
        <Button
          key="submit"
          type="primary"
          disabled={isLoading}
          onClick={handleSendEmail}
        >
          Send Email
        </Button>,
      ]}
    >
      {isLoading ? (
        <div className="loader-div">
          <Spin />
          <p>Creating Email Draft...</p>
        </div>
      ) : (
        <div>
          <Input
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            placeholder="Email ID"
            style={{ marginBottom: "10px" }}
          />
          <Input
            value={emailTitle}
            onChange={(e) => setEmailTitle(e.target.value)}
            placeholder="Subject"
            style={{ marginBottom: "10px" }}
          />
          <div
            contentEditable="true"
            // ref={editableRef}
            dangerouslySetInnerHTML={{ __html: emailBody }}
            onInput={(e: React.FormEvent<HTMLDivElement>) =>
              setEmailBody((e.currentTarget as HTMLDivElement).innerHTML)
            }
            style={{
              border: "1px solid #ccc",
              padding: "5px",
              minHeight: "100px",
              cursor: "text",
              marginBottom: "10px"
            }}
          ></div>
        </div>
      )}
    </Modal>
  );
}

export default DraftSendEmailModal