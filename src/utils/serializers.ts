// import { Contact } from '@models/contact.model';

// export function sanitizeApiResponseToContact(apiResponse: any): Contact {
//     // Initializing sanitizedContact with fields from Contact interface
//     const sanitizedContact: Partial<Contact> = {
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
//     };

//     console.log('API Response:', apiResponse);

//     // Mapping of field names to their validation functions
//     const fieldValidators: Record<string, (field: any) => boolean> = {
//         names: (name: any) => typeof name.givenName === 'string' && typeof name.familyName === 'string',
//         emailAddresses: (email: any) => typeof email.value === 'string',
//         phoneNumbers: (phone: any) => typeof phone.value === 'string',
//         occupations: (occupation: any) => typeof occupation.value === 'string',
//         organizations: (organization: any) => typeof organization.name === 'string' && typeof organization.title === 'string',
//         locations: (location: any) => typeof location.value === 'string',
//         events: (event: any) => typeof event.type === 'string' && typeof event.formattedType === 'string' &&
//             typeof event.description === 'string' && event.date &&
//             typeof event.date.year === 'number' && typeof event.date.month === 'number' &&
//             typeof event.date.day === 'number',
//         biographies: (biography: any) => typeof biography.value === 'string',
//         interests: (interest: any) => typeof interest.value === 'string',
//     };

//     // Iterating over each field in the sanitizedContact and populating it if valid
//     for (const field of Object.keys(sanitizedContact)) {
//         const key = field as keyof Contact; // Casting field to a key of Contact
//         if (Array.isArray(apiResponse[key])) {
//             sanitizedContact[key] = apiResponse[key]?.filter(fieldValidators[key]);
//         }
//     }

//     // Casting the sanitizedContact to Contact as it adheres to the Contact interface
//     return sanitizedContact as Contact;
// }

export { }