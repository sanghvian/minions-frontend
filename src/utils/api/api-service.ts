import { AxiosRequestConfig } from "axios";
import axios from 'axios'
import * as contactApis from './Contact.api'
import * as noteApis from './Note.api'
import * as actionApis from './Action.api'
import * as relationshipApis from './Relationship.api'
import * as userApis from './User.api'
import * as miscApis from './Misc.api'
import * as historyApis from './History.api'
import * as linkedinContactApis from './LinkedinContact.api'
import * as groupApis from './Group.api'
import * as searchAttemptApis from './SearchAttempt.api'

// All the MicCheck APIs
import * as templateApis from './Template.api'
import * as documentApis from './Document.api'
import * as contentBlockApis from './ContentBlock.api'
import * as contentResponseApis from './ContentResponse.api'
import * as optionApis from './Option.api'
import * as videoApis from './Video.api'
import * as tagApis from './Tag.api'
import * as responseTagApis from './ResponseTag.api'

// Integration APIs
import * as googleSheetApis from './GoogleSheet.api'
import * as googleDriveApis from './GoogleDrive.api'
import * as firefliesApis from './Fireflies.api'
import * as notionApis from "./Notion.api";
import * as emailApis from './Email.api'
import * as miroApis from './Miro.api'

export interface ApiRequestObj {
  method: string,
  url: string,
  requestBody?: { [key: string]: any },
  params?: { [key: string]: any },
  serializerFunc: any,
  accessToken?: string
}

export const callApi = async ({
  method,
  url,
  requestBody = {},
  params = {},
  serializerFunc,
  accessToken
}: any, logResInCons: boolean = false) => {
  if (logResInCons && process.env.NEXT_PUBLIC_NODE_ENV === "development") {
    // console.log('API was called for me', { method, url, requestBody })
  }
  // TODO: Apply authentication and use accessToken
  try {
    // Reference url for request config object - https://www.npmjs.com/package/axios#axiosrequestconfig-1
    const requestConfig: AxiosRequestConfig = {
      method,
      url,
      data: requestBody,
      // Set the x-auth-token header to process.env.REACT_APP_API_KEY
      headers: {
        "Content-Type": "application/json",
        "x-access-token": process.env.REACT_APP_API_KEY,
        // "x-access-token": accessToken
      },
      params,
      baseURL: process.env.REACT_APP_BACKEND_API_BASE_URL,
      timeout: 1200000,
      // baseURL: "https://api.recontact.world"
    };
    const responseData = await axios.request(requestConfig);
    const serializedRes = await serializerFunc(responseData);
    if (logResInCons && process.env.NEXT_PUBLIC_NODE_ENV === "development") {
      // console.log({ serializedRes, responseData })
    }
    return serializedRes
  }
  catch (error: any) {
    if (logResInCons && process.env.NEXT_PUBLIC_NODE_ENV === "development") {
      // console.log(error)
    }
    throw new Error(error.message);
  }
}


class ApiDataService {
  //! Misc APIs
  createAuthTokens = miscApis.createAuthTokens;
  callFunction = miscApis.callFunction;
  sendEmail = miscApis.sendEmail;
  sendEmailForVideo = miscApis.sendEmailForVideo;
  callViaVoiceAgent = miscApis.callViaVoiceAgent;

  //! Contact APIs
  createContact = contactApis.createContact;
  getContact = contactApis.getContact;
  searchContact = contactApis.searchContact;
  updateContact = contactApis.updateContact;
  deleteContact = contactApis.deleteContact;
  getAllUserContacts = contactApis.getAllUserContacts;
  getContactByLinkedinContactId = contactApis.getContactByLinkedinContactId;
  syncContactToCRM = contactApis.syncContactToCRM;

  // ! Note APIs - ALL APIs DEPRECATED
  createNote = noteApis.createNote;
  getNote = noteApis.getNote;
  updateNote = noteApis.updateNote;
  deleteNote = noteApis.deleteNote;
  getMultipleNotes = noteApis.getMultipleNotes;
  getRecentNotes = noteApis.getRecentNotes;
  deleteCachedNote = noteApis.deleteCachedNote;
  // syncNoteToCRM = noteApis.syncNoteToCRM;
  // syncStructuredNoteToCRM = noteApis.syncStructuredNoteToCRM;
  structureNote = noteApis.structureNote;
  syncSNoteToCRM = noteApis.syncSNoteToCRM;

  // ! Action APIs
  createAction = actionApis.createAction;
  getAction = actionApis.getAction;
  updateAction = actionApis.updateAction;
  deleteAction = actionApis.deleteAction;
  getAllUserActions = actionApis.getAllUserActions;
  getMultipleActions = actionApis.getMultipleActions;
  deleteActionsByFilter = actionApis.deleteActionsByFilter;
  createActionFromText = actionApis.createActionFromText;
  getUpcomingActions = actionApis.getUpcomingActions;

  // ! Relationship APIs
  createRelationship = relationshipApis.createRelationship;
  getRelationship = relationshipApis.getRelationship;
  updateRelationship = relationshipApis.updateRelationship;
  deleteRelationship = relationshipApis.deleteRelationship;
  getAllUserRelationships = relationshipApis.getAllUserRelationships;
  createRelationshipPlan = relationshipApis.createRelationshipPlan;
  storeRAP = relationshipApis.storeRAP;

  // ! LinkedinContact APIs
  createLinkedinContact = linkedinContactApis.createLinkedinContact;
  getLinkedinContact = linkedinContactApis.getLinkedinContact;
  updateLinkedinContact = linkedinContactApis.updateLinkedinContact;
  deleteLinkedinContact = linkedinContactApis.deleteLinkedinContact;
  getLinkedinContactByLinkedinUrl =
    linkedinContactApis.getLinkedinContactByLinkedinUrl;
  enhanceContactLinkedin = linkedinContactApis.enhanceContactLinkedin;
  enhanceUserLinkedin = linkedinContactApis.enhanceUserLinkedin;

  // ! History APIs
  createHistory = historyApis.createHistory;
  getHistory = historyApis.getHistory;
  updateHistory = historyApis.updateHistory;
  deleteHistory = historyApis.deleteHistory;

  // ! Group APIs
  createGroup = groupApis.createGroup;
  getGroup = groupApis.getGroup;
  updateGroup = groupApis.updateGroup;
  deleteGroup = groupApis.deleteGroup;
  getAllUserGroups = groupApis.getAllUserGroups;

  // ! User APIs
  // ? Basic CRUD
  createUser = userApis.createUser;
  getUser = userApis.getUser;
  getUserByEmail = userApis.getUserByEmail;
  updateUserByEmailOrCreate = userApis.updateUserByEmailOrCreate;
  updateUser = userApis.updateUser;
  deleteUser = userApis.deleteUser;
  updateUserActionsCount = userApis.updateUserActionsCount;

  // ! SearchAttempt APIs
  updateSearchAttempt = searchAttemptApis.updateSearchAttempt;
  searchInUserNetwork = searchAttemptApis.searchInUserNetwork;
  recommendInUserNetwork = searchAttemptApis.recommendInUserNetwork;
  chatInUserNetwork = searchAttemptApis.chatInUserNetwork;
  onlineSearch = searchAttemptApis.onlineSearch;
  imageSearch = searchAttemptApis.imageSearch;

  // ? More advanced APIs
  deleteUserByFilter = userApis.deleteUserByFilter;

  // ! Template APIs
  createTemplate = templateApis.createTemplate;
  getTemplate = templateApis.getTemplate;
  updateTemplate = templateApis.updateTemplate;
  deleteTemplate = templateApis.deleteTemplate;
  getAllUserTemplates = templateApis.getAllUserTemplates;
  getFullTemplate = templateApis.getFullTemplate;
  fillTemplate = templateApis.fillTemplate;

  // ! Document APIs
  createDocument = documentApis.createDocument;
  getDocument = documentApis.getDocument;
  updateDocument = documentApis.updateDocument;
  deleteDocument = documentApis.deleteDocument;
  getDocumentsForUser = documentApis.getDocumentsForUser;
  getPaginatedDocumentsForUser = documentApis.getPaginatedDocumentsForUser;
  getPaginatedDocumentsForUserForTemplate = documentApis.getPaginatedDocumentsForUserForTemplate;
  getDocumentsForUserContact = documentApis.getDocumentsForUserContact;
  structureTranscriptAndCreateDocument =
    documentApis.structureTranscriptAndCreateDocument;
  structureTranscriptAndCreateDocumentWithTimestamp =
    documentApis.structureTranscriptAndCreateDocumentWithTimestamp;
  generateDocumentSummary = documentApis.generateDocumentSummary;
  processStructuredNoteIntoDoc = documentApis.processStructuredNoteIntoDoc;

  // ! ContentBlock APIs
  createContentBlock = contentBlockApis.createContentBlock;
  getContentBlock = contentBlockApis.getContentBlock;
  updateContentBlock = contentBlockApis.updateContentBlock;
  deleteContentBlock = contentBlockApis.deleteContentBlock;
  getContentBlocksForUser = contentBlockApis.getContentBlocksForUser;
  getPaginatedContentBlocksForUser =
    contentBlockApis.getPaginatedContentBlocksForUser;
  getCompleteContentBlockWithResponses =
    contentBlockApis.getCompleteContentBlockWithResponses;
  analyzeContentBlockTheme = contentBlockApis.analyzeContentBlockTheme;
  getRandomContentBlockForUser = contentBlockApis.getRandomContentBlockForUser;

  // ! ContentResponse APIs
  createContentResponse = contentResponseApis.createContentResponse;
  getContentResponse = contentResponseApis.getContentResponse;
  updateContentResponse = contentResponseApis.updateContentResponse;
  deleteContentResponse = contentResponseApis.deleteContentResponse;

  // ! Tag APIs
  createTag = tagApis.createTag;
  getTag = tagApis.getTag;
  getTopicTags = tagApis.getTopicTags;
  getAllTags = tagApis.getAllTags;
  updateTag = tagApis.updateTag;
  deleteTag = tagApis.deleteTag;

  // ! ResponseTag APIs
  createResponseTag = responseTagApis.createResponseTag;
  getResponseTag = responseTagApis.getResponseTag;
  getResponseTags = responseTagApis.getResponseTags;
  suggestResponseTags = responseTagApis.suggestResponseTags;
  createSuggestedResponseTags = responseTagApis.createSuggestedResponseTags;
  updateResponseTag = responseTagApis.updateResponseTag;
  deleteResponseTag = responseTagApis.deleteResponseTag;

  // ! Option APIs
  createOption = optionApis.createOption;
  getOption = optionApis.getOption;
  updateOption = optionApis.updateOption;
  deleteOption = optionApis.deleteOption;

  // ! Video APIs
  createVideo = videoApis.createVideo;
  getVideo = videoApis.getVideo;
  transcribeVideo = videoApis.transcribeVideo;
  getVideoTranscriptWithTimestamp = videoApis.getVideoTranscriptWithTimestamp;
  updateVideo = videoApis.updateVideo;
  deleteVideo = videoApis.deleteVideo;
  getAllUserVideos = videoApis.getAllUserVideos;
  getAllUserUploadedVideos = videoApis.getAllUserUploadedVideos;
  getVideoByUrl = videoApis.getVideoByUrl;

  // ! GoogleSheet APIs
  createSpreadsheet = googleSheetApis.createSpreadsheet;
  searchSpreadsheets = googleSheetApis.searchSpreadsheets;
  createTab = googleSheetApis.createTab;
  addRows = googleSheetApis.addRows;

  // ! GoogleDrive APIs
  fetchCombinedGDriveFiles = googleDriveApis.fetchCombinedGDriveFiles;
  transcribeSelectedGDriveFiles = googleDriveApis.transcribeSelectedGDriveFiles;
  transcribeGDriveVideo = googleDriveApis.transcribeGDriveVideo;
  fetchContentFromGoogleDriveFile = googleDriveApis.fetchContentFromGoogleDriveFile;

  // ! Fireflies APIs
  fetchUserData = firefliesApis.fetchUserData;
  fetchTranscript = firefliesApis.fetchTranscript;
  fetchTranscripts = firefliesApis.fetchTranscripts;
  fetchFirefliesTimestampedTranscript =
    firefliesApis.fetchTimestampedTranscript;
  // saveTranscript = firefliesApis.saveTranscript;

  // ! Miro APIs
  getMiroAccessToken = miroApis.getMiroAccessToken;
  createBoardAndStickies = miroApis.createBoardAndStickies;

  // ! Email APIs
  draftEmail = emailApis.draftEmail;
  sendDraftedEmail = emailApis.sendEmail;

  // ! Notion APIs
  syncDocumentToNotion = notionApis.syncDocumentToNotion;
}
const apiService = new ApiDataService();

export default apiService;

