import { ForwardOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import useDebounce from '@hooks/useDebounce';
import { RecordType } from '@models/index';
import { ContactOnlineSearchResult, Contact } from '@models/contact.model';
import { ActiveModalType, BottomSheetType, SearchType, setActiveData, setActiveQueryString, setAudioNoteContent, setBottomSheetType, setIsBottomSheetOpen, setIsModalOpen, setModalType, setSearchType } from '@redux/features/activeEntitiesSlice';
import { initialContactState, setContact } from '@redux/features/contactSlice';
import { AppDispatch, RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import { extractNameFromNote } from '@utils/contactFuncs';
import { performGoogleSearch } from '@utils/performGoogleSearch';
import { Button, Input, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import apiService from '@utils/api/api-service';
import OnlineSearchItemsList from '../OnlineSearchItemsList';
import InternalSearchItemsList from '../InternalSearchItemsList';
import './SearchAndResults.css'
import OnlineSearchCategories from '../OnlineSearchCategories';
import toast from 'react-hot-toast';
import { addContactToList } from '@redux/features/contactsListSlice';
import YCLoader from '@components/atoms/YCLoader';

const SearchAndResults = () => {
  const [results, setResults] = useState<ContactOnlineSearchResult[] | Contact[]>([]);
  const { activeQueryString, searchType: sType, handleBottomSheetClose } = useSelector((state: RootState) => state.activeEntities);
  const { email, ownerId, token } = useSelector((state: RootState) => state.persisted.user.value);
  const contact = useSelector((state: RootState) => state.contact.value.activeContact);
  const [query, setQuery] = useState<string>(activeQueryString);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef(null);
  const [searchType, setCurrentSearchType] = useState<SearchType>(sType); // Default to internal search type
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
  }, [activeQueryString, searchType])

  useDebounce(() => {
    handleSearch();
    if (inputRef.current) {
      (inputRef.current as any).focus();
    }
    // eslint-disable-next-line
  }, 1000, [query])

  const handleNext = async () => {
    if (searchType === SearchType.INTERNAL ? true : contact.notes) {
      setIsLoading(true);
      if (searchType === SearchType.INTERNAL && !isUploading) {
        // Because in the flow of the internal search type, before clicking next, we will have already selected a finite contact that exists and have that set as the activeContact in the contactSlice in Redux. So we can just kill the flow here after passing an update function.
        dispatch(setContact(contact))
        // dispatch(setIsBottomSheetOpen(false))
        dispatch(setSearchType(SearchType.EXTERNAL));
        handleBottomSheetClose!({ contact, activeQueryString: audioNoteContent });
        pushEvent('SetContactAndQueryForAddingNote', { contact, activeQueryString })
      } else {
        // In the SearchType EXTERNAL, i.e. the flow where we attach links, the person will always have a note that we construct from the attached link.
        let newContact: any = {}
        let latestNote: any = {}
        if (searchType === SearchType.INTERNAL) {
          if (!contact?.notes) {
            latestNote = {
              id: "",
              content: "",
              timestamp: new Date().toISOString(),
              location: "",
              recordType: RecordType.NOTE,
              noteSource: "",
              noteFavicon: "",
              contactId: ""
            }
          }
          else {
            latestNote = contact?.notes![contact?.notes.length];
          }

          const extractedName = await extractNameFromNote(latestNote.content);
          const name = extractedName?.length > 0 ? extractedName : activeQueryString;
          newContact = {
            name,
            biography: latestNote.content,
            namespace: email,
            location: latestNote.location,
            noteIds: [latestNote.id!],
            notes: [latestNote],
            recordType: RecordType.CONTACT,
            timestamp: latestNote.timestamp,
            // Empty fieldsc
            email: "",
            phone: "",
            interests: [],
            occupation: "",
            organization_name: "",
            relationshipId: ""

          }
        } else {
          newContact = {
            ...contact,
            timestamp: new Date().toISOString(),
          }
        }
        dispatch(setContact(newContact))
        dispatch(setActiveQueryString(''))
      }
      dispatch(setAudioNoteContent(audioNoteContent))
      dispatch(setBottomSheetType(BottomSheetType.CONTACT_ADD))
      pushEvent('UserSearchPersonOnlineNext', { query })
      setIsLoading(false);
    }
  }

  // const handleSearchTypeSwitch = () => {
  //   const newSearchType = searchType === SearchType.EXTERNAL ? SearchType.INTERNAL : SearchType.EXTERNAL;
  //   pushEvent('SwitchSearchType', { newSearchType })
  //   setCurrentSearchType(newSearchType);
  // }

  const handleSkipAndCreateNewContact = async (currentContact = contact) => {
    dispatch(setAudioNoteContent(audioNoteContent));
    // dispatch(setBottomSheetType(BottomSheetType.CONTACT_ADD));
    let toastId = toast.loading('Saving contact...');
    const startTime = new Date().getTime();
    const { notes, actions, ...newContact } = currentContact;
    let recentlyCreatedContact = newContact;
    // const latestNote = notes![notes!.length! - 1

    notes?.forEach(note => {
      const noteSource = note?.noteSource;
      const isNoteSourceLinkedin = noteSource?.includes('linkedin');
      if (isNoteSourceLinkedin) newContact.linkedinUrl = noteSource;
      const isNoteSourceTwitter = noteSource?.includes('twitter') || noteSource?.includes('x.com');
      if (isNoteSourceTwitter) newContact.twitterUrl = noteSource;
      const isNoteSourceInstagram = noteSource?.includes('instagram');
      if (isNoteSourceInstagram) newContact.instagramUrl = noteSource;
    });

    if (ownerId) newContact.crmOwnerId = ownerId;
    pushEvent('SubmitCompleteContact', newContact)
    try {
      // Map over all the notes and call the apiService.createNote method over them to create notes in the database


      if (newContact.id) {
        toast.loading('This contact already exists, updating it...', { id: toastId });
        const updatedContact = await apiService.updateContact(
          newContact.id,
          newContact,
          email, token
        );
        recentlyCreatedContact = updatedContact;
      } else {
        toast.loading('Creating and saving new contact', { id: toastId })
        const createdContact = await apiService.createContact(newContact, email, token);
        recentlyCreatedContact = createdContact;
      }
      dispatch(setContact(recentlyCreatedContact));
      // const notesWithContactId = notes?.map(note => ({ ...note, contactId: recentlyCreatedContact.id! }));
      // Iterate over all the `notes` using forEach and have a promise to create each note properly and wait till all notes are created

      // notes?.forEach(async note => {
      //   const createdNote = await apiService.createNote({
      //     ...note,
      //     contactId: recentlyCreatedContact.id!,
      //     crmOwnerId: ownerId
      //   }, true, email, token);
      //   dispatch(addRecentNoteToList(createdNote));
      // });

      // // TODO: Patchfix to update salesforce contact's description with content of latest note
      // await apiService.updateSalesforceContactById(createdContact.id!, audioNoteContent || note.content, token)


      // await notesWithContactId?.map(note => apiService.createNote(note, email, token));
      const endTime = new Date().getTime();
      pushEvent('AddContactCompleted', { responseTime: (endTime - startTime) / 1000 })
      dispatch(setAudioNoteContent(""))
      dispatch(setActiveQueryString(""))
    } catch (error) {
      // Handle error
      console.error(error);
    } finally {
      dispatch(setIsBottomSheetOpen(false));
      dispatch(addContactToList(recentlyCreatedContact));
      try {
        if (ownerId) {
          recentlyCreatedContact = await apiService.syncContactToCRM(recentlyCreatedContact, email, token);
        }
        toast.success('Contact Stored!', { id: toastId })

        // notes?.forEach(async note => {
        //     await apiService.syncNoteToCRM({
        //         ...note,
        //         contactId: recentlyCreatedContact.id!,
        //         salesforceCrmContactId: syncedContact.salesforceCrmId,
        //         hubspotCrmContactId: syncedContact.hubspotCrmId
        //     }, token);
        // })

        const combinedNoteContent = notes?.map(note => note.content).join('\n \n') || "";
        const recentlyCreatedContactContactString = "Here's the contact I spoke with" + JSON.stringify(recentlyCreatedContact);
        const combinedNote = {
          content: combinedNoteContent || "",
          timestamp: new Date().toISOString(),
          location: geolocation,
          recordType: RecordType.NOTE,
          contactId: recentlyCreatedContact.id!,
          salesforceCrmContactId: recentlyCreatedContact?.salesforceCrmId || "",
          hubspotCrmContactId: recentlyCreatedContact?.hubspotCrmId || "",
          crmOwnerId: ownerId
        }
        toastId = toast.loading('AI is processing your note...');
        const response = await apiService.structureNote({
          note: {
            ...combinedNote,
            content: recentlyCreatedContactContactString + combinedNoteContent || "",
          },
          templateId: activePlaybookId,
          userId: email,
          accessToken: token
        });
        toast.success('AI processed your note!', { id: toastId })
        dispatch(setActiveData({
          structuredNote: response,
          activeNote: combinedNote
        }));
        dispatch(setIsModalOpen(true))
        dispatch(setModalType(ActiveModalType.NOTE_REVIEW))
        // To reset all the pre-filled fields in the UI
        dispatch(setContact(initialContactState.value.activeContact));
      } catch (error: any) {
        toast.error(`We're very sorry AI was unable to process this note due to this error ${error.message} - take a screenshot of this and send to founders@recontact.world`, { id: toastId })
      }
    }
  }

  const handleSearch = async () => {
    if (!query) {
      setResults([]);
      setIsLoading(false);
      return;
    };
    const startTime = new Date().getTime();
    setIsLoading(true);
    if (searchType === SearchType.INTERNAL) {
      pushEvent('SearchPersonInNetwork', { query })
      const response = await apiService.searchContact(query, email, token);
      setResults(response as Contact[]);
    } else {
      pushEvent('SearchPersonOnline', { query })
      const response = await performGoogleSearch(query, email);
      setResults(response as ContactOnlineSearchResult[]);
    }
    setIsLoading(false);
    const endTime = new Date().getTime();
    pushEvent('UserSearchPersonCompleted', { query, responseTime: (endTime - startTime) / 1000, searchType })
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
        <br />
        {/* <div style={{ alignSelf: "flex-end" }}>
          
          &nbsp;
          <Button
            style={{ alignSelf: "flex-end" }}
            loading={isLoading}
            icon={<ForwardOutlined />}
            key="search"
            type="default"
            onClick={() => handleSearchTypeSwitch()}
          >
            Switch to{" "}
            {searchType === SearchType.EXTERNAL ? "My Network" : "Online"}{" "}
            Search
          </Button>
        </div> */}
      </div>
      &nbsp;&nbsp;
      {isLoading ? (
        <YCLoader />
      ) : (
        <div style={{ marginBottom: "10rem" }}>
          {/* {" "}
          {results?.length === 0 && (
            <p>Search for a person you already spoke with</p>
          )} */}
          {results?.length > 0 ? (
            isLoading ? (
              <YCLoader />
            ) : searchType === SearchType.EXTERNAL ? (
              <OnlineSearchItemsList
                results={results as ContactOnlineSearchResult[]}
              />
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
          {query.length > 0 && (
            <OnlineSearchCategories query={query} setQuery={setQuery} />
          )}
          {/* <div className="buttonContainer">
            <ScanCardV2 />
          </div>
          <div className="buttonContainer">
            <Button
              disabled={isLoading}
              icon={<QrcodeOutlined />}
              onClick={() => {
                dispatch(setIsBottomSheetOpen(true));
                dispatch(setBottomSheetType(BottomSheetType.QR_SCAN));
              }}
            >
              Scan QR
            </Button>
          </div> */}
          <div className="bottomActionContainer">
            <Button
              style={{ alignSelf: "flex-end" }}
              loading={isLoading}
              icon={<UserAddOutlined />}
              key="search"
              type="primary"
              onClick={() => handleSkipAndCreateNewContact()}
            >
              Create New Contact
            </Button>
            &nbsp;
            <Button
              loading={isLoading}
              disabled={
                searchType === SearchType.INTERNAL
                  ? false
                  : !contact.notes?.length
              }
              icon={<ForwardOutlined />}
              key="search"
              type="primary"
              onClick={handleNext}
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

export default SearchAndResults
