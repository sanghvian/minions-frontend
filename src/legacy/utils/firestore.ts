// import { User } from "src/models/user.model";
// import {
//     doc,
//     getDoc,
//     // runTransaction,
//     setDoc
// } from 'firebase/firestore';
// import { firestore } from './firebase';
// // import { sleep } from ".";

// export const getOrCreateUserDoc = async (user: User) => {
//     const userRef = doc(firestore, 'users', user.email);

//     const userDoc = await getDoc(userRef);
//     const isUserAlreadyPresent = userDoc.exists();
//     if (!userDoc.exists()) {
//         await setDoc(userRef, {
//             email: user.email,
//             displayName: user.name,
//             photoURL: user.photoURL || 'https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png',
//             token: user.token,
//             status: user.status
//         });
//     }

//     // Now the document should exist, either it was already there or it was just created
//     const retrievedDoc = await getDoc(userRef)
//     const retrievedData = { ...(retrievedDoc as any)._document.data.value.mapValue.fields, isUserAlreadyPresent };
//     return retrievedData
// }
// export const updateUserDoc = async (user: User) => {
//     try {
//         const userRef = await doc(firestore, 'users', user.email)
//         await setDoc(userRef, {
//             email: user.email,
//             displayName: user?.name || "User",
//             photoURL: user.photoURL || 'https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png',
//             token: user.token,
//             status: user.status,
//             numTries: user.numTries
//         });
//     } catch (error) {
//         // console.log(error);
//     }
// }

export { }