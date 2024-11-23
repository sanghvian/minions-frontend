// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Contact, ContactOnlineSearchResult } from "@models/contact.model";


// export const initialContactState: { value: Contact } = {
//     value: {
//         names: [],
//         emailAddresses: [],
//         phoneNumbers: [],
//         occupations: [],
//         organizations: [],
//         locations: [],
//         events: [],
//         biographies: [],
//         interests: [],
//         onlineSearchResults: []
//     }
// }

// export const contactSlice = createSlice({
//     name: "contact",
//     initialState: initialContactState,
//     reducers: {
//         setContact(state: { value: Contact | null }, action: PayloadAction<Contact | null>) {
//             state.value = action.payload
//         },
//         addContactOnlineSearchResult(state: { value: Contact | null }, action: PayloadAction<ContactOnlineSearchResult>) {
//             if (state.value) {
//                 state.value.onlineSearchResults.push(action.payload)
//             }
//             state.value?.biographies[0].value.concat(action.payload.link + ", ")
//         },
//         removeContactOnlineSearchResult(state: { value: Contact | null }, action: PayloadAction<string>) {
//             if (state.value) {
//                 state.value.onlineSearchResults = state.value.onlineSearchResults.filter((result: ContactOnlineSearchResult) => result.link !== action.payload)
//                 state.value?.biographies[0].value.replace(action.payload + ", ", "")
//             }
//         }
//     },
// });

// export const {
//     setContact,
//     addContactOnlineSearchResult,
//     removeContactOnlineSearchResult
// } = contactSlice.actions;

// export default contactSlice.reducer;


export { }