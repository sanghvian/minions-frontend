export interface DraftEmailRequest {
    contact: {
        id?: string;
        name: string;
        biography: string;
        email?: string;
    };
    note: string;
    senderEmail: string;
}

export interface SendEmailRequest {
    contact: {
        id?: string;
        name: string;
        biography: string;
        email?: string;
    };
    subject: string;
    html: string;
    senderEmail: string;
}