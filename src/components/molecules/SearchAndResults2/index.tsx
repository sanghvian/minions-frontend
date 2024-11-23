import { ForwardOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import useDebounce from '@hooks/useDebounce';
import { RecordType } from '@models/index';
import { ContactOnlineSearchResult, Contact, CompleteContact } from '@models/contact.model';
import { ActiveModalType, BottomSheetType, SearchType, setActiveData, setActiveQueryString, setActiveUploadTranscript, setAudioNoteContent, setBottomSheetType, setIsBottomSheetOpen, setIsModalOpen, setModalType } from '@redux/features/activeEntitiesSlice';
import { initialContactState, setContact } from '@redux/features/contactSlice';
import { AppDispatch, RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import { performGoogleSearch } from '@utils/performGoogleSearch';
import { Button, Input, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import apiService from '@utils/api/api-service';
import InternalSearchItemsList from '../InternalSearchItemsList';
import './SearchAndResults2.css'
import toast from 'react-hot-toast';
import { addContactToList } from '@redux/features/contactsListSlice';


function safeJsonStringify(inputJsonString: string): string {
  return inputJsonString
    .replace(/[\u007F-\uFFFF]/g, chr => '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).substr(-4))
    .replace(/[\b]/g, '\\b')
    .replace(/\f/g, '\\f')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\\/g, '\\\\')
    .replace(/\"/g, '\\"');
}

const SearchAndResults2 = () => {
  const [results, setResults] = useState<ContactOnlineSearchResult[] | Contact[]>([]);
  const {
    activeQueryString,
    // searchType: sType,
    activeUploadTranscript,
    // handleBottomSheetClose
  } = useSelector((state: RootState) => state.activeEntities);
  const { email, ownerId, token, name } = useSelector((state: RootState) => state.persisted.user.value);
  const contact = useSelector((state: RootState) => state.contact.value.activeContact);
  const [query, setQuery] = useState<string>(activeQueryString);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef(null);
  // const [searchType, setCurrentSearchType] = useState<SearchType>(sType); // Default to internal search type
  const dispatch: AppDispatch = useDispatch();
  const { audioNoteContent, isUploading, geolocation } = useSelector((state: RootState) => state.activeEntities);
  const activePlaybookId = useSelector((state: RootState) => state.activeEntities.activePlaybookId);




  useEffect(() => {
    // if query is already set, fire handleSearch, right when the component is loading up
    if (inputRef.current) {
      (inputRef.current as any)?.focus();
    }
    if (query) {
      setQuery(query);
      handleSearch();
    }
    // eslint-disable-next-line
  }, [
    activeQueryString,
    // searchType
  ])

  useDebounce(() => {
    handleSearch();
    if (inputRef.current) {
      (inputRef.current as any).focus();
    }
    // eslint-disable-next-line
  }, 1000, [query])

  const handleNext = async (currentContact: CompleteContact) => {
    dispatch(setAudioNoteContent(audioNoteContent));
    let toastId = toast.loading('Saving contact...');
    const { notes, actions, ...newContact } = currentContact;
    let recentlyCreatedContact = newContact;

    if (ownerId) newContact.crmOwnerId = ownerId;
    pushEvent('SubmitCompleteContact', newContact)
    try {
      if (newContact.id) {
        toast.loading('This contact already exists, proceeding with processing...', { id: toastId });
        recentlyCreatedContact = newContact;
      } else {
        toast.loading('Creating and saving new contact', { id: toastId })
        const createdContact = await apiService.createContact(newContact, email, token);
        recentlyCreatedContact = createdContact;
      }
      dispatch(setContact(recentlyCreatedContact));
      pushEvent('AddContactCompleted')
      toast.success('Contact saved!', { id: toastId });
      dispatch(addContactToList(recentlyCreatedContact));
      try {
        const combinedNoteContent = notes?.map(note => note.content).join('\n \n') || "";
        const recentlyCreatedContactContactString = "Here's the contact I spoke with  - " + recentlyCreatedContact.name;
        const combinedNote = {
          content: audioNoteContent + activeUploadTranscript + combinedNoteContent || "",
          timestamp: new Date().toISOString(),
          location: geolocation,
          recordType: RecordType.NOTE,
          contactId: recentlyCreatedContact.id!,
          salesforceCrmContactId: recentlyCreatedContact?.salesforceCrmId || "",
          hubspotCrmContactId: recentlyCreatedContact?.hubspotCrmId || "",
          crmOwnerId: ownerId
        }
        toastId = toast.loading('AI is processing your note...');
        const response = await apiService.fillTemplate({
          text: `${safeJsonStringify(recentlyCreatedContactContactString)}. Here is what we spoke about - ${safeJsonStringify(combinedNote.content || "")}`,
          templateId: activePlaybookId!,
          userId: email,
          recontactUserName: name!,
          accessToken: token
        });
        toast.success('AI processed your note!', { id: toastId })
        dispatch(setActiveData({
          structuredNote: response,
          activeNote: combinedNote
        }));
        dispatch(setIsModalOpen(true))
        dispatch(setModalType(ActiveModalType.NOTE_REVIEW))
        // dispatch(setActiveUploadTranscript(""))
      } catch (error: any) {
        toast.error(`We're very sorry AI was unable to process this note due to this error ${error.message} - take a screenshot of this and send to founders@recontact.world`, { id: toastId })
      }
    } catch (error) {
      // Handle error
      console.error(error);
    } finally {
      dispatch(setAudioNoteContent(""))
      dispatch(setActiveQueryString(""))
      dispatch(setIsBottomSheetOpen(false));
    }
  }

  const handleSearch = async () => {
    if (!query) {
      setResults([]);
      setIsLoading(false);
      return;
    };
    // const startTime = new Date().getTime();
    setIsLoading(true);
    // if (searchType === SearchType.INTERNAL) {
    pushEvent('SearchPersonInNetwork', { query })
    const response = await apiService.searchContact(query, email, token);
    setResults(response as Contact[]);
    // } else {
    //   pushEvent('SearchPersonOnline', { query })
    //   const response = await performGoogleSearch(query, email);
    //   setResults(response as ContactOnlineSearchResult[]);
    // }
    setIsLoading(false);
    // const endTime = new Date().getTime();
    // pushEvent('UserSearchPersonCompleted', { query, responseTime: (endTime - startTime) / 1000, searchType })
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Input
          ref={inputRef}
          placeholder="Search for a person you already spoke with"
          value={query}
          defaultValue={activeQueryString}
          onChange={(e) => setQuery(e.target.value)}
          suffix={
            <SearchOutlined
              onClick={() => handleSearch()}
              style={{ cursor: "pointer" }}
            />
          }
        />
      </div>
      &nbsp;&nbsp;
      {isLoading ? (
        <Spin />
      ) : (
        <div style={{ marginBottom: "10rem" }}>
          {results?.length > 0 ? (
            isLoading ? (
              <Spin />
            ) : (
              <InternalSearchItemsList results={results as Contact[]} />
            )
          ) : (
            <p> </p>
          )}
        </div>
      )}
      <div className="bottomBar">
        <div
          style={{
            width: "100%",
            height: "10rem",
            background: "linear-gradient(180deg, transparent 0%, #fff 80%)",
          }}
        />
        <div className="bottomActionsWrapper">
          <div className="bottomActionContainer">
            <Button
              style={{ alignSelf: "flex-end" }}
              loading={isLoading}
              icon={<UserAddOutlined />}
              key="search"
              type="primary"
              onClick={() => handleNext({
                name: query,
                biography: "",
                namespace: email,
                location: "",
                noteIds: [],
                notes: [],
                recordType: RecordType.CONTACT,
                timestamp: new Date().toISOString(),
                email: "",
                phone: "",
                interests: [],
                occupation: "",
                organization_name: "",
                relationshipId: ""

              })}
            >
              Create New Contact
            </Button>
            &nbsp;
            <Button
              loading={isLoading}
              // disabled={
              //   searchType === SearchType.INTERNAL
              //     ? false
              //     : !contact.notes?.length
              // }
              icon={<ForwardOutlined />}
              key="search"
              type="primary"
              onClick={() => handleNext(contact)}
            >
              Select Current Contact
            </Button>
            <br />
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchAndResults2
