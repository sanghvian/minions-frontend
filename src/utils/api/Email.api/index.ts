import { DraftEmailRequest, SendEmailRequest } from "@models/email.model";
import { callApi } from "@utils/api/api-service";

export const draftEmail = async (
  emailData: DraftEmailRequest,
  accessToken: string
) => {
  return await callApi({
    method: "POST",
    url: "/email/draft-email",
    accessToken,
    requestBody: emailData,
    serializerFunc: (r:{data:any}) => r.data,
  });
};

export const sendEmail = async (emailData: SendEmailRequest, accessToken: string) => {
  return await callApi({
    method: "POST",
    url: "/email/send-email",
    accessToken,
    requestBody: emailData,
    serializerFunc: (r: { data: any }) => r.data,
  });
};
