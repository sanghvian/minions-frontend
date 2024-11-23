import { Contact } from "@models/contact.model";
import { CompleteContentResponse } from "@models/contentResponse.model";
import { RecordType } from "@models/index";
import { VideoLanguage } from "@models/video.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuProps } from "antd";

export enum ActiveModalType {
    CONTACT_MODAL = "CONTACT_MODAL",
    ONLINE_SEARCH_MODAL = "ONLINE_SEARCH_MODAL",
    NOTE_MODAL = "NOTE_MODAL",
    ACTION_MODAL = "ACTION_MODAL",
    EDIT_SUGGESTED_ACTIONS = "EDIT_SUGGESTED_ACTIONS",
    PLAYBOOK_ADD = "PLAYBOOK_ADD",
    NOTE_ADD = "NOTE_ADD",
    NOTE_REVIEW = "NOTE_REVIEW",
    RECORD_VOICE_NOTE = "RECORD_VOICE_NOTE",
    UPLOAD_AUDIO_VIDEO_FILE = "UPLOAD_AUDIO_VIDEO_FILE",
    SET_SPREADSHEET = "SET_SPREADSHEET",
    SET_FIREFLIES_API_KEY = "SET_FIREFLIES_API_KEY",
    ADD_TAG = "ADD_TAG",
    EDIT_TAG = "EDIT_TAG",
    DRAFT_AND_SEND_EMAIL = "DRAFT_AND_SEND_EMAIL",
    SET_PLAYBOOK = "SET_PLAYBOOK",
    SET_PLAYBOOK_2 = "SET_PLAYBOOK_2",
    SET_PLAYBOOK_3 = "SET_PLAYBOOK_3",
    SET_NOTION_CREDS = "SET_NOTION_CREDS",
}

export enum BottomSheetType {
    BIZ_CARD_ADD = "BIZ_CARD_ADD",
    SEARCH_ADD = "SEARCH_ADD",
    CONTACT_ADD = "CONTACT_ADD",
    QR_SCAN = "QR_SCAN",
    GROUP_EDIT = "GROUP_EDIT",
    GROUP_ADD = "GROUP_ADD",
    PLAYBOOK_ADD = "PLAYBOOK_ADD",
    ENHANCE_LINKEDIN = "ENHANCE_LINKEDIN",
    NOTE_ADD = "NOTE_ADD",
    PLAYBOOK_SEARCH = "PLAYBOOK_SEARCH",
}

export enum BottomDrawerType {
    BULK_PROCESS_MEETINGS = "BULK_PROCESS_MEETINGS",
    BULK_PROCESS_GDRIVE_IMPORTS = "BULK_PROCESS_GDRIVE_IMPORTS",
    BULK_PROCESS_UPLOADED_VIDEOS = "BULK_PROCESS_UPLOADED_VIDEOS",
}

export enum ActiveRouteKey {
    SEARCH = "search",
    SEARCH2 = "chat",
    ACTIONS = "actions",
    CONTACTS = "contacts",
    GROUPS = "groups",
    ACCOUNT = "account",
    HOME = "home",
    PLAYBOOKS = "guides",
    UPLOADS = "uploads",
    AUTH_SUCCESS = "auth-success",
    TOPICS = "topics",
    BOARDS = "boards",
    DOCUMENTS = "documents",
    INTEGRATIONS = "integrations",
    FIREFLIES_INTEGRATION = "integrations/fireflies-integration",
    GSHEET_INTEGRATION = "integrations/gsheet-integration",
    GDRIVE_INTEGRATION = "integrations/gdrive-integration",
    NOTION_INTEGRATION = "integrations/notion-integration",
    MIRO_INTEGRATION = "integrations/miro-integration",
    MEETINGS = "meetings",


    // For AI voice agents
    CALLS = "calls",
    AGENTS = "agents",
    TRACKING = "tracking",
}

export enum SearchType {
    INTERNAL = "INTERNAL",
    EXTERNAL = "EXTERNAL"
}

interface ActiveEntitiesState {
    isModalOpen: boolean;
    modalType: ActiveModalType | null;
    isBottomDrawerOpen: boolean;
    bottomDrawerType: BottomDrawerType;
    activeQueryString: string;
    geolocation: string;
    isBottomSheetOpen: boolean;
    bottomSheetType?: BottomSheetType;
    appBarActiveKey: ActiveRouteKey;
    searchType: SearchType;
    activePlaybookId: string;
    activeSearchResponseRecordTypes: RecordType[];
    showSpotlightSearch: boolean;
    handleBottomSheetClose?: (value: any) => any | null;
    handleModalClose?: (value: any) => any | null;
    activeMenuPropItemsGetterFunc: (c: Contact) => MenuProps["items"];
    isSentryInitialized: boolean;
    searchAttemptId: string;
    activeChatCycleId: string;
    audioNoteContent: string;
    activeVideoUrl: string;
    rightDrawerOpen: boolean;
    activeData: any;
    isUploading: boolean;
    fileUploadDuration: number;
    activeContentBlockId?: string;
    activeContentResponse: CompleteContentResponse;
    activeTranscriptIds: string[];
    activeVideoIds: string[];
    activeUploadTranscript: string;
    activeVideos: {
        name: string,
        date: string,
        videoUrl: string,
        id: string,
        fileType?: string
    }[],
    activeLanguage: VideoLanguage | ""
    // currentVideoTime: number
}

const initialState: ActiveEntitiesState = {
    isModalOpen: false,
    isBottomSheetOpen: false,
    modalType: null,
    isBottomDrawerOpen: false,
    bottomDrawerType: BottomDrawerType.BULK_PROCESS_MEETINGS,
    activeQueryString: "",
    geolocation: "",
    appBarActiveKey: ActiveRouteKey.HOME,
    searchType: SearchType.EXTERNAL,
    handleBottomSheetClose: () => { },
    handleModalClose: () => { },
    activeSearchResponseRecordTypes: [],
    activeMenuPropItemsGetterFunc: () => [],
    isSentryInitialized: false,
    searchAttemptId: "",
    activeChatCycleId: "",
    showSpotlightSearch: false,
    audioNoteContent: "",
    activePlaybookId: "",
    activeVideoUrl: "",
    rightDrawerOpen: false,
    activeData: {},
    isUploading: false,
    fileUploadDuration: 0,
    activeContentBlockId: "",
    activeTranscriptIds: [],
    activeVideoIds: [],
    activeUploadTranscript: "",
    activeVideos: [],
    activeContentResponse: {
        _id: "",
        documentId: "",
        contentBlockId: "",
        userId: "",
        answerText: "",
        contactId: "",
        recordType: RecordType.CONTENT_RESPONSE,
    },
    activeLanguage: "",
    // currentVideoTime: 0
};

export const activeEntitiesSlice = createSlice({
    name: "activeEntities",
    initialState,
    reducers: {
        setIsModalOpen(state: ActiveEntitiesState, action: PayloadAction<boolean>) {
            state.isModalOpen = action.payload
        },
        setIsBottomSheetOpen(state: ActiveEntitiesState, action: PayloadAction<boolean>) {
            state.isBottomSheetOpen = action.payload
        },
        setActiveQueryString(state: ActiveEntitiesState, action: PayloadAction<string>) {
            state.activeQueryString = action.payload
        },
        setModalType(state: ActiveEntitiesState, action: PayloadAction<ActiveModalType>) {
            state.modalType = action.payload
        },
        setIsBottomDrawerOpen(state: ActiveEntitiesState, action: PayloadAction<boolean>) {
            state.isBottomDrawerOpen = action.payload
        },
        setBottomDrawerType(state: ActiveEntitiesState, action: PayloadAction<BottomDrawerType>) {
            state.bottomDrawerType = action.payload
        },
        setBottomSheetType(state: ActiveEntitiesState, action: PayloadAction<BottomSheetType>) {
            state.bottomSheetType = action.payload
        },
        setGeoLocation(state: ActiveEntitiesState, action: PayloadAction<string>) {
            state.geolocation = action.payload
        },
        setActiveRouteKey(state: ActiveEntitiesState, action: PayloadAction<ActiveRouteKey>) {
            state.appBarActiveKey = action.payload
        },
        setSearchType(state: ActiveEntitiesState, action: PayloadAction<SearchType>) {
            state.searchType = action.payload
        },
        setHandleBottomSheetClose(state: ActiveEntitiesState, action: PayloadAction<(value: any) => any>) {
            state.handleBottomSheetClose = action.payload
        },
        setHandleModalClose(state: ActiveEntitiesState, action: PayloadAction<(value: any) => any>) {
            state.handleModalClose = action.payload
        },
        setActiveSearchResponseRecordTypes(state: ActiveEntitiesState, action: PayloadAction<RecordType[]>) {
            state.activeSearchResponseRecordTypes = action.payload
        },
        setActiveMenuPropItemsGetterFunc(state: ActiveEntitiesState, action: PayloadAction<(c: Contact) => MenuProps["items"]>) {
            state.activeMenuPropItemsGetterFunc = action.payload
        },
        setIsSentryInitialized(state: ActiveEntitiesState, action: PayloadAction<boolean>) {
            state.isSentryInitialized = action.payload
        },
        setSearchAttemptId(state: ActiveEntitiesState, action: PayloadAction<string>) {
            state.searchAttemptId = action.payload
        },
        setActiveChatCycleId(state: ActiveEntitiesState, action: PayloadAction<string>) {
            state.activeChatCycleId = action.payload
        },
        setShowSpotlightSearch(state: ActiveEntitiesState, action: PayloadAction<boolean>) {
            state.showSpotlightSearch = action.payload
        },
        setAudioNoteContent(state: ActiveEntitiesState, action: PayloadAction<string>) {
            state.audioNoteContent = action.payload
        },
        setActivePlaybookId(state: ActiveEntitiesState, action: PayloadAction<string>) {
            state.activePlaybookId = action.payload
        },
        setActiveVideoUrl(state: ActiveEntitiesState, action: PayloadAction<string>) {
            state.activeVideoUrl = action.payload
        },
        setRightDrawerOpen(state: ActiveEntitiesState, action: PayloadAction<boolean>) {
            state.rightDrawerOpen = action.payload
        },
        setActiveData(state: ActiveEntitiesState, action: PayloadAction<any>) {
            state.activeData = action.payload
        },
        setIsUploading(state: ActiveEntitiesState, action: PayloadAction<boolean>) {
            state.isUploading = action.payload
        },
        setFileUploadDuration(state: ActiveEntitiesState, action: PayloadAction<number>) {
            state.fileUploadDuration = action.payload
        },
        setActiveContentBlockId(state: ActiveEntitiesState, action: PayloadAction<string>) {
            state.activeContentBlockId = action.payload
        },
        setActiveTranscriptIds(state: ActiveEntitiesState, action
            : PayloadAction<string[]>) {
            state.activeTranscriptIds = action.payload
        },
        setActiveVideoIds(state: ActiveEntitiesState, action: PayloadAction<string[]>) {
            state.activeVideoIds = action.payload
        },
        setActiveUploadTranscript(state: ActiveEntitiesState, action: PayloadAction<string>) {
            state.activeUploadTranscript = action.payload
        },
        setActiveVideos(state: ActiveEntitiesState, action: PayloadAction<any>) {
            state.activeVideos = action.payload
        },
        setActiveContentResponse(state: ActiveEntitiesState, action: PayloadAction<any>) {
            state.activeContentResponse = action.payload
        },
        // setCurrentVideoTime(state: ActiveEntitiesState, action: PayloadAction<number>) {
        //     state.currentVideoTime = action.payload
        // }
        setActiveLanguage(state: ActiveEntitiesState, action: PayloadAction<VideoLanguage>) {
            state.activeLanguage = action.payload
        }
    },
});

export const {
    setIsModalOpen,
    setIsBottomSheetOpen,
    setIsBottomDrawerOpen,
    setBottomDrawerType,
    setActiveQueryString,
    setModalType,
    setBottomSheetType,
    setGeoLocation,
    setActiveRouteKey,
    setSearchType,
    setHandleBottomSheetClose,
    setHandleModalClose,
    setActiveSearchResponseRecordTypes,
    setActiveMenuPropItemsGetterFunc,
    setIsSentryInitialized,
    setSearchAttemptId,
    setActiveChatCycleId,
    setShowSpotlightSearch,
    setAudioNoteContent,
    setActivePlaybookId,
    setActiveVideoUrl,
    setRightDrawerOpen,
    setActiveData,
    setIsUploading,
    setFileUploadDuration,
    setActiveContentBlockId,
    setActiveTranscriptIds,
    setActiveUploadTranscript,
    setActiveVideoIds,
    setActiveVideos,
    setActiveContentResponse,
    setActiveLanguage,
    // setCurrentVideoTime
} = activeEntitiesSlice.actions;

export default activeEntitiesSlice.reducer;