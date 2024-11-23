// import googlePeopleApiString from '@prompts/googlePeopleApiStructure';
// import axios from 'axios';
// import dummyGeneratedContact, { dummyGeneratedContactV2 } from '@data/sampleContact';
// import { Contact, ContactV2 } from '@models/contact.model';

// export const convertIntoContactObj = async (infoString: string) => {
//     const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
//     const url = 'https://api.openai.com/v1/chat/completions';

//     // Set request headers
//     const headers = {
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//         'Content-Type': 'application/json'
//     };

//     const content = `I am passing you the following contact and conversation information about a person that I want to record in my Google Contacts book using the EXACT JSON format/schema that the Google People API specifies for contact storing. For your context, here is EXACT the guidelines of the data object to be passed to the Google People API - """""""${googlePeopleApiString}"""""" Here is the audio transcript containing the information about the contact I want to store ${infoString}. I want you to convert this contact details text string into the EXACT object form  for storing contacts, that the Google People API's people.createContact API describes. I want you to particularly capture these 7 things - 1. contact information (such as email address and phone number), 2. occupation and organization (where this contact works/studies and in what role), 3. what is the location of this person 4. name of the event or context in which we met. 5. What we discussed and talked about and what this person is now working on 6. Any labels/tags that I specify regarding interests or traits of this person that I want to save as Google Contact Labels 7. Important dates such as when I met them and when their birthday is. All other extra data must just be captured as text and stored under the "Biography" of the person in Google People API. A sample JSON object response looks like this - ${JSON.stringify(dummyGeneratedContact)} Return just ONLY this transformed JSON object and nothing else`

//     const body = {
//         "model": "gpt-3.5-turbo-16k",
//         "messages": [{ "role": "user", "content": content }]
//     }

//     try {
//         // Make the API call
//         const response = await axios.post(url, body, { headers });
//         // console.log('Success in generating Google Contact:', response);
//         return response.data.choices[0].message.content;
//     } catch (error) {
//         // console.log('Error:', error);
//     }
// }


// export const convertIntoContactObj2 = async (infoString: string) => {
//     const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
//     const url = 'https://api.openai.com/v1/chat/completions';

//     // Set request headers
//     const headers = {
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//         'Content-Type': 'application/json'
//     };

//     const content = `I am passing you the following contact and conversation information about a person that I want to record in my Contacts book using the EXACT JSON format/schema that this Contacts TypeScript interface has - """""""{
//         firstName: string;
//         lastName: string;
//         emailAddress: string;
//         phoneNumber: string;
//         occupation: string;
//         organization: string;
//         location: string;
//         meetingDate: string of "YYYY-MM-DD" form,
//         event: string;
//         biography: string;
//         interests: string[];
//         onlineSearchResults: ContactOnlineSearchResult[];
//     }"""""" Here is the audio transcript containing the information about the contact I want to store ${infoString}. I want you to convert these contact details text string into the EXACT "ContactV2" object form for. I want you to particularly capture these 7 things - 1. contact information (such as email address and phone number), 2. occupation and organization (where this contact works/studies and in what role), 3. what is the location of this person 4. name of the event or context in which we met. 5. What we discussed and talked about and what this person is now working on 6. Any labels/tags that I specify regarding interests or traits of this person that I want to save as Google Contact Labels 7. Important dates such as when I met them and when their birthday is. All other extra data must just be captured as text and stored under the "Biography" of the person in Google People API. A sample JSON object response looks like this - ${JSON.stringify(dummyGeneratedContactV2)} Return just ONLY this transformed JSON object and nothing else`

//     const body = {
//         "model": "gpt-3.5-turbo",
//         "messages": [{ "role": "user", "content": content }]
//     }

//     try {
//         // Make the API call
//         const response = await axios.post(url, body, { headers });
//         // console.log('Success in generating Google Contact:', response);
//         return response.data.choices[0].message.content;
//     } catch (error) {
//         // console.log('Error:', error);
//     }
// }

// export const convertContactV2ToContact = (contactV2: ContactV2): Contact => {
//     return {
//         names: [{ givenName: contactV2?.firstName, familyName: contactV2?.lastName }],
//         emailAddresses: [{ value: contactV2?.emailAddress }],
//         phoneNumbers: [{ value: contactV2?.phoneNumber }],
//         occupations: [{ value: contactV2?.occupation }],
//         organizations: [{
//             name: contactV2?.organization,
//             title: contactV2?.occupation // Assuming occupation as title, modify as needed
//         }],
//         locations: [{ value: contactV2?.location }],
//         events: [{ // An example, modify the event details as needed
//             type: 'meeting',
//             formattedType: 'Meeting',
//             date: { year: 2023, month: 10, day: 12 },
//             description: contactV2?.event
//         }],
//         biographies: [{ value: contactV2?.biography }],
//         interests:
//             contactV2?.interests?.length > 0
//                 ? contactV2?.interests?.map((int: string) => ({ value: int }))
//                 : [],
//         onlineSearchResults: contactV2?.onlineSearchResults
//     };
// };

// export const convertContactToContactV2 = (contact: Contact): ContactV2 => {
//     return {
//         // TODO: Look at this object chaining once
//         firstName: contact?.names[0]?.givenName || "",
//         lastName: contact?.names[0]?.familyName || "",
//         emailAddress: contact?.emailAddresses[0]?.value || "",
//         phoneNumber: contact?.phoneNumbers[0]?.value || "",
//         occupation: contact?.occupations[0]?.value || "",
//         organization: contact?.organizations[0]?.name || "",
//         location: contact?.locations[0]?.value || "",
//         event: contact?.events[0]?.formattedType || "",
//         meetingDate: contact?.events[0]
//             ? `${contact?.events[0].date.year}-${contact?.events[0].date.month}-${contact?.events[0].date.day}`
//             : "",
//         biography: contact?.biographies[0]?.value || "",
//         interests: contact?.interests.map(interest => interest.value),
//         onlineSearchResults: contact?.onlineSearchResults || [],
//     };
// }


export { }