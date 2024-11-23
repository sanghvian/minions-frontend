import NotesList from '@components/molecules/NotesList';
import { CompleteContact, Contact } from '@models/contact.model';
import { ActiveModalType, setActiveData, setActiveQueryString, setAudioNoteContent, setIsBottomSheetOpen, setIsModalOpen, setModalType } from '@redux/features/activeEntitiesSlice';
import { addContactNote, initialContactState, setContact } from '@redux/features/contactSlice';
import { addContactToList } from '@redux/features/contactsListSlice';
import { AppDispatch, RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import { Button, Form, Input } from 'antd';
import { TextArea } from 'antd-mobile';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import './AddContactContainer.css'
import { addRecentNoteToList } from '@redux/features/noteSlice';
import { uploadAudioForTranscription } from '@utils/transcribeAudio';
import { Note } from '@models/note.model';
import { v4 } from 'uuid';
import { RecordType } from '@models/index';
import AudioRecorder from '@components/molecules/AudioRecorder';
import AddContactReviewCategories from '@components/molecules/AddContactReviewCategories';
import { Option } from '@models/option.model';
import { Template } from '@models/template.model';
import { extractNameFromNote } from '@utils/contactFuncs';

// where clientPreferences corresponds to "contentBlocks" and clientChoices corresponds to object returned by GPT that contains the key-value pairs of the selected options
// TODO - Type safety
// function extractOptionIdsFromChoices(clientPreferences: any, clientChoices: any) {
//     // Initialize an array to hold the result
//     const results: {
//         contentBlockId: string;
//         selectedOptionIds: string[];
//     }[] = [];

//     // Iterate through each contentBlock in clientPreferences
//     clientPreferences.contentBlocks.forEach((block: any) => {
//         const { _id: contentBlockId, blockKey, options } = block;
//         const choice = clientChoices[blockKey];

//         // Initialize the result object for this block
//         let resultObj: {
//             contentBlockId: string;
//             selectedOptionIds: string[];
//         } = { contentBlockId, selectedOptionIds: [] };

//         if (Array.isArray(choice)) {
//             // Multi-select scenario
//             // Filter options that match the client's choices and map their IDs
//             resultObj.selectedOptionIds = options
//                 .filter((option: any) => choice.includes(option.optionText))
//                 .map((option: any) => option._id);
//         } else {
//             // Single-select scenario
//             // Find the option that matches the client's choice and map its ID
//             const matchingOption: Partial<Option> = options.find((option: any) => option.optionText === choice);
//             if (matchingOption) {
//                 resultObj.selectedOptionIds.push(matchingOption._id!);
//             }
//         }

//         // Add the result object to the results array
//         results.push(resultObj);
//     });
//     return results;
// }
type Answer = {
  [key: string]: string;
};

type Result = {
  blockKey: string;
  contentBlockId: string;
  answerText: string;
};

interface TempContentBlock {
  _id: string;
  templateId: string;
  description: string;
  blockTitle: string;
  blockKey: string;
  order: number;
  responseType: 'text' | 'number' | 'single-select' | 'multi-select';
  optionIds?: Option[];
}

interface TempTemplate extends Template {
  contentBlocks?: TempContentBlock[];
}


function matchAnswersToTemplate(template: TempTemplate, answers: Answer): Result[] {
  const result: Result[] = [];

  // Loop through each key in the answers object
  for (const answerKey of Object.keys(answers)) {
    // Find the corresponding content block in the template
    const contentBlock = template.contentBlocks?.find(block => block.blockKey === answerKey);

    if (contentBlock) {
      // Prepare the result object
      const resultObject: Result = {
        blockKey: answerKey,
        contentBlockId: contentBlock._id,
        answerText: answers[answerKey]
      };

      // If it's a single-select response, match the answer text with the optionText
      if (contentBlock.responseType === 'single-select' && contentBlock.optionIds) {
        const option = contentBlock.optionIds.find(option => option._id === answers[answerKey]);
        if (option) {
          resultObject.answerText = option.optionText;
        }
      }

      result.push(resultObject);
    }
  }
  return result;
}



const AddContactContainer = () => {
  const contact = useSelector((state: RootState) => state.contact.value.activeContact);
  const [currentContact, setCurrentContact] = useState<CompleteContact>(contact!);
  const { email, token, ownerId, name, occupation, organization_name, biography } = useSelector((state: RootState) => state.persisted.user.value);
  const activePlaybookId = useSelector((state: RootState) => state.activeEntities.activePlaybookId);
  const handleChange = (changedFields: Partial<Contact>, fieldEdited: "name" | "email" | "biography" | "phone" | "organization_name" | "occupation" | "location") => {
    setCurrentContact({ ...currentContact, ...changedFields });
    pushEvent('UpdateContactProperties', { fieldEdited });
  }
  const { audioNoteContent, geolocation } = useSelector((state: RootState) => state.activeEntities);
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();
  const [reviewInfoFilter, setReviewInfoFilter] = useState<"info" | "notes">("info");

  const handleAudioFile = async (audioFile: any) => {
    const toastId = toast.loading('Transcribing...');
    const data: { text: string } = await uploadAudioForTranscription(audioFile)
    toast.success('Transcribed!', { id: toastId });
    const note: Note = {
      id: v4(),
      content: data.text,
      timestamp: new Date().toISOString(),
      location: geolocation,
      recordType: RecordType.NOTE,
      contactId: ""
    }
    dispatch(addContactNote(note))
    const justNotes = currentContact?.notes ? currentContact.notes! : []
    setCurrentContact({ ...currentContact, notes: [...justNotes, note] });
    pushEvent('AddPersonAudioNoteRightBeforeSubmitting', (note as Note))
  }

  useEffect(() => {
    if (audioNoteContent) {
      const updateContact = async () => {
        let updatedName = contact.name
        // if (!contact.name) {
        //   updatedName = await extractNameFromNote(
        //     audioNoteContent
        //   );
        // }
        return updatedName
      }
      updateContact()
        .then((name) => {
          const updatedCurrentContact = {
            ...currentContact,
            name: name,
            notes: [
              ...(currentContact?.notes ? currentContact.notes! : []),
              {
                content: audioNoteContent,
                timestamp: new Date().toISOString(),
                id: v4(),
                location: geolocation,
                recordType: RecordType.NOTE,
                contactId: "",
              },
            ],
          };
          // console.log("updatedCurrentContact", updatedCurrentContact);
          setCurrentContact(updatedCurrentContact);
        })
        .catch(err => { })
    }
  }, [audioNoteContent, setCurrentContact, geolocation, contact.name])

  const onFinish = async () => {
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

      notes?.forEach(async note => {
        const createdNote = await apiService.createNote({
          ...note,
          contactId: recentlyCreatedContact.id!,
          crmOwnerId: ownerId
        }, true, email, token);
        dispatch(addRecentNoteToList(createdNote));
      });



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
      form.resetFields();
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

      // const response = await apiService.syncStructuredNoteToCRM({
      //     content: combinedNoteContent || "",
      //     timestamp: new Date().toISOString(),
      //     location: geolocation,
      //     recordType: RecordType.NOTE,
      //     contactId: recentlyCreatedContact.id!,
      //     salesforceCrmContactId: syncedContact.salesforceCrmId,
      //     hubspotCrmContactId: syncedContact.hubspotCrmId,
      //     crmOwnerId: ownerId
      // }, true, activePlaybookId, email, token);
      // const structuredNote = response.structuredNote;
      // const contentResponses = matchAnswersToTemplate(activePlaybook, structuredNote);

      // contentResponses?.forEach(async (cr) => {
      //     const createdNote = await apiService.createContentResponse({
      //         contentBlockId: cr.contentBlockId,
      //         answerText: cr.answerText,
      //         userId: email
      //     }, token);
      //     dispatch(addRecentNoteToList(createdNote));
      // });

      // toast.success('Synced to CRM!', { id: toastId })
      // const toastId2 = toast.loading('Sending email...');
      // await apiService.sendEmail({
      //     contact: recentlyCreatedContact,
      //     noteString: combinedNoteContent,
      //     token,
      //     senderIntro: `${name} is occupied as ${occupation} at ${organization_name}. ${biography} \n \n`

      // });
      // toast.success('Email sent!', { id: toastId2 })
    }
  };

  return (
    <div style={{ height: "100%", marginBottom: "10rem", overflow: "auto" }}>
      <h2>Saving new contact....</h2>
      <Form form={form} onFinish={onFinish}>
        <Form.Item label="Name">
          <Input
            onChange={(e) =>
              handleChange({ name: e.target.value as string }, "name")
            }
            value={currentContact.name}
          />
        </Form.Item>
        {/* <Form.Item label="Bio (Optional)">
          <TextArea
            rows={5}
            onChange={(value) =>
              handleChange({ biography: value as string }, "biography")
            }
            defaultValue={currentContact.biography}
          />
        </Form.Item>
        <div
          style={{
            justifyContent: "stretch",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridGap: "1rem",
          }}
        >
          <Form.Item label="Phone Number (Optional)">
            <Input
              type="tel"
              onChange={(e) =>
                handleChange({ phone: e.target.value }, "phone")
              }
              defaultValue={currentContact.phone}
            />
            {reviewInfoFilter === "notes" && (
              <NotesList notes={currentContact?.notes || []} />
            )}
          </Form.Item>
          <Form.Item label="Occupation (Optional)">
            <Input
              onChange={(e) =>
                handleChange(
                  { occupation: e.target.value as string },
                  "occupation"
                )
              }
              defaultValue={currentContact.occupation}
            />
          </Form.Item>
        </div>
        <div
          style={{
            justifyContent: "stretch",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridGap: "1rem",
          }}
        >
          <Form.Item label="Company (Optional)">
            <Input
              onChange={(e) =>
                handleChange(
                  { organization_name: e.target.value as string },
                  "organization_name"
                )
              }
              defaultValue={currentContact.organization_name}
            />
          </Form.Item>
          <Form.Item label="Email (Optional)">
            <Input
              type="email"
              onChange={(e) =>
                handleChange({ email: e.target.value as string }, "email")
              }
              defaultValue={currentContact.email}
            />
          </Form.Item>
        </div>
        <div
          style={{
            justifyContent: "stretch",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridGap: "1rem",
          }}
        >
          <Form.Item label="Location (Optional)">
            <Input
              type="location"
              onChange={(e) =>
                handleChange(
                  { location: e.target.value as string },
                  "location"
                )
              }
              defaultValue={currentContact.location}
            />
          </Form.Item>
          <div></div>
        </div> */}
      </Form>
      <div className="bottomAddBar">
        <div
          style={{
            width: "100%",
            height: "10rem",
            background: "linear-gradient(180deg, transparent 0%, #fff 60%)",
          }}
        />
        <div className="buttonWrapper">
          {/* <div
            style={{
              width: "100%",
              padding: "1rem 0",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <AddContactReviewCategories
              activeFilter={reviewInfoFilter}
              setActiveFilter={setReviewInfoFilter}
            />
            <AudioRecorder handleAudioFile={handleAudioFile} />
          </div> */}
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              form.submit();
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddContactContainer
