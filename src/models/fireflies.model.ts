export interface TranscriptResponse {
    // Define your interfaces based on the GraphQL schema provided
    // This is a simplified example; you should include all fields you need
    id: string;
    title: string;
    date: string;
    host_email: string;
    organizer_email: string;
    user: {
        user_id: string;
        email: string;
        name: string;
    };
    transcript_url: string;
    participants: string[];
    meeting_attendees: {
        displayName: string;
        email: string;
        phoneNumber: string;
        name: string;
        location: string;
    }[];
    duration: number;
    calendar_id: string;
    summary: {
        action_items: string[];
        keywords: string[];
        outline: string[];
        overview: string;
        shorthand_bullet: string;
    };
    sentences: {
        text: string;
        speaker_name: string;
        speaker_id: string;
        start_time: number;
        end_time: number
    }[];


    // Additional property added by us to ensure we separate out which fireflies transcript is processed and existing in our mongodb and which isn't
    status: "PENDING" | "PROCESSED"
}