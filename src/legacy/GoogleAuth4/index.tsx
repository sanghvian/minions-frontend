// // ? This one was setup to create a login experience into the google account for the user using the @react-oauth/google package

// "use client"
// import React from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@redux/store';
// import { setUser } from '@redux/features/userSlice';
// import './GoogleAuth3.css'
// import { Button } from 'antd';
// import { GoogleOutlined } from '@ant-design/icons';
// import { useAuth } from '@contexts/AuthContext';
// import { getOrCreateUserDoc } from 'src/legacy/utils/firestore';
// import { User, UserStatus } from '@models/user.model';
// import { pushEvent } from '@utils/analytics';
// import { router } from '@utils/routes';


// // export declare function runTransaction<T>(firestore: Firestore, updateFunction: (transaction: Transaction) => Promise<T>, options?: TransactionOptions): Promise<T>;

// const GoogleAuth3: React.FC = () => {
//     const userToken = useSelector((state: RootState) => state.persisted.user.value.token);
//     const dispatch: AppDispatch = useDispatch();
//     const { loginWithPopup } = useAuth();

//     const handleClick = async () => {
//         const response = await loginWithPopup()
//         // console.log({ response }, 'user info from google')
//         const user = response.user
//         const updatedUser: User = {
//             name: user.displayName || "User",
//             email: user.email,
//             id: user.googleId,
//             photoURL: user.photoURL || 'https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png',
//             numTries: 0,
//             subscriptionExpiryDate: "",
//             status: UserStatus.UNSUBSCRIBED,
//             token: user.accessToken
//         }
//         const userDoc = await getOrCreateUserDoc(updatedUser)
//         const sanitizedUserDoc = {
//             name: userDoc.displayName.stringValue,
//             email: userDoc.email.stringValue,
//             photoURL: userDoc?.photoURL.stringValue || "",
//             numTries: userDoc?.numTries || 0,
//             // subscriptionExpiryDate: userDoc?.subscriptionExpiryDate.stringValue || "",
//             status: userDoc?.status.stringValue || "",
//             token: userDoc?.token.stringValue || ""
//         }
//         dispatch(setUser(sanitizedUserDoc as any))
//         pushEvent(userDoc.isUserAlreadyPresent ? 'UserSignedIn' : 'UserSignedUp', sanitizedUserDoc)
//         router.navigate('/contacts')
//     }

//     return (
//         <div className='auth-container'>
//             {!userToken &&
//                 (<div className='login-container'>
//                     <Button
//                         onClick={handleClick}
//                         icon={<GoogleOutlined />}>
//                         Log In
//                     </Button>
//                 </div>)
//             }
//         </div>
//     );

// }
// export default GoogleAuth3;

export { }