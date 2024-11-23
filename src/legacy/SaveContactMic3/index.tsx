// import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
// import toast from 'react-hot-toast';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@redux/store';
// // import { setNumTries } from '@redux/features/userSlice';
// import './savecontact.css'
// // import { convertIntoVCardForm, downloadVCard, sanitizeVCard } from '@utils/vCard';
// import { updateUserDoc } from 'src/legacy/utils/firestore';
// import { addAudioElement, uploadAudioForTranscription } from '@utils/transcribeAudio';
// // import { sanitizeApiResponseToContact } from '@utils/index';
// import { convertContactV2ToContact, convertIntoContactObj2 } from '@utils/convertIntoContact';
// import { Contact, ContactV2 } from '@models/contact.model';
// import { Button, Upload } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import { setContact } from '../../../legacy/contactSlice';
// import { setIsModalOpen } from '@redux/features/activeEntitiesSlice';
// import { pushEvent } from '@utils/analytics';
// // import dummyGeneratedContact from '@data/sampleContact';


// const AudioRecorder3 = () => {
//     const user = useSelector((state: RootState) => state.persisted.user.value)
//     const dispatch: AppDispatch = useDispatch();
//     const recorderControls = useAudioRecorder()
//     const completeVoiceToContactFlow = async (file: File) => {
//         try {
//             // TEMP COMMENTING FOR TESTING
//             const startTime = new Date().getTime();
//             const data: { text: string } = await uploadAudioForTranscription(file);
//             console.log('🟡 Received transcript data', data)
//             const contactObj: string = await convertIntoContactObj2(data.text);
//             const contactData: ContactV2 = JSON.parse(contactObj)
//             // console.log('🟡 Received contact data', contactData)
//             const transformedContactData: Contact = convertContactV2ToContact(contactData)
//             const endTime = new Date().getTime();
//             const duration = (endTime - startTime) / 1000; // duration in seconds
//             pushEvent('GetContactFromVoice', {
//                 recordingDuration: recorderControls.recordingTime,
//                 responseTime: duration
//             })
//             const updatedUser = {
//                 ...user,
//                 numTries: user.numTries + 1
//             }
//             // console.log('🟡 To Update user', updatedUser, 'I was called');
//             await updateUserDoc(updatedUser)
//             // console.log('🟡 Updated user, opening modal', updatedUser, 'I was called');
//             dispatch(setIsModalOpen(true))
//             dispatch(setContact(transformedContactData))
//             // const contactObj: string = await convertIntoVCardForm(data.text);
//             // const sanitizedContactObj = sanitizeVCard(contactObj)
//             // await downloadVCard(sanitizedContactObj)
//         } catch (error) {
//             console.log(error);
//         }
//     }


//     // Function to process file type of uploaded files
//     // const beforeUpload = (file: File) => {
//     //     const isAudio = file.type.startsWith('audio/');
//     //     if (!isAudio) {
//     //         toast.error('You can only upload audio files!');
//     //     }
//     //     return isAudio;
//     // };

//     const handleUpload = (file: File) => {
//         toast.promise(
//             completeVoiceToContactFlow(file),
//             {
//                 loading: 'Saving..., takes a long 55 seconds cuz my founder wanted a quick MVP',
//                 success: <b>Here's your contact</b>,
//                 error: <b>Could not save.</b>,
//             }
//         );
//         return false; // prevent auto-upload
//     };

//     return (
//         <>
//             <p style={{ fontSize: "0.8rem", margin: '1rem 1rem 1rem 1rem' }}>Press the mic, say something like - <em>Elon Musk is the Founder of Tesla Motors and SpaceX, based out of Mountain View, California. I met him on October 14th at the Cerebral Valley hackathon where we discussed how it's difficult to remember so many people in the valley. He's skill and interest categories are machine learning, electric mobility and space exploration. His contact details are at 6506649946 and email is at elon@musk.com. Hit save </em> </p>
//             <br />
//             <AudioRecorder
//                 onRecordingComplete={async (blob: any) => {
//                     const file = await addAudioElement(blob)
//                     toast.promise(
//                         completeVoiceToContactFlow(file),
//                         {
//                             loading: 'Saving...',
//                             success: <b>Here's your contact</b>,
//                             error: <b>Could not save.</b>,
//                         }
//                     );

//                 }
//                 }
//                 recorderControls={recorderControls}
//                 audioTrackConstraints={{
//                     noiseSuppression: true,
//                     echoCancellation: true,
//                 }}
//                 showVisualizer={true}
//                 downloadOnSavePress={false}
//                 downloadFileExtension="webm"
//             />
//             {user.email === process.env.REACT_APP_SUPER_USER_EMAIL &&
//                 (
//                     <>
//                         <br /><br />
//                         <Upload
//                             showUploadList={false}
//                             // beforeUpload={beforeUpload}
//                             customRequest={({ file }) => handleUpload(file as File)}
//                         >
//                             <Button icon={<UploadOutlined />}>Upload Audio</Button>
//                         </Upload>
//                     </>
//                 )
//             }
//         </>
//     )
// }

// export default AudioRecorder3
export { }