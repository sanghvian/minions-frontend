// import { useState } from 'react';
// import { Modal, Form, Input, Button, List } from 'antd';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@redux/store';
// import { convertIntoVCardForm, downloadVCard, sanitizeVCard } from '@utils/vCard';
// import { Contact, ContactOnlineSearchResult } from '@models/contact.model';
// import { ActiveModalType, setActiveQueryString, setIsModalOpen, setModalType } from '@redux/features/activeEntitiesSlice';
// import { TextArea } from 'antd-mobile';
// import { SearchOutlined } from '@ant-design/icons';
// import { initialState, setContact } from 'src/legacy/contactSlice';
// import OnlineSearchResultItem from '@components/atoms/OnlineSearchResultItem';
// import axios from 'axios';
// import { convertContactToString } from '@utils/contactFuncs';
// import { pushEvent } from '@utils/analytics';
// import { convertContactToContactV2 } from '@utils/convertIntoContact';
// import { format } from 'date-fns'
// import apiService from '@utils/api/api-service';


// const extractKeywordsFromContact = (contact: Contact): string[] => {
//     // Extract necessary information if exists, else provide an empty string as a default
//     const givenName = contact.names[0]?.givenName || "";
//     const familyName = contact.names[0]?.familyName || "";
//     const occupationValue = contact.occupations[0]?.value || "";
//     const organizationName = contact.organizations[0]?.name || "";
//     // TODO: Meeting org title as it usually has the same value as the occupationValue
//     // const organizationTitle = contact.organizations[0]?.title || "";

//     // Combine the extracted information into a query string, separated by "%20"
//     const keywordsArray = [givenName, familyName, occupationValue, organizationName]

//     return keywordsArray;
// };

// const EditContactModal = () => {
//     const currentUserLocation = useSelector((state: RootState) => state.activeEntities.geolocation);
//     const [form] = Form.useForm();
//     const contact: Contact = useSelector((state: RootState) => state.contact.value.activeContact!)
//     const { isModalOpen, modalType } = useSelector((state: RootState) => state.activeEntities)
//     const isVisible = isModalOpen && modalType === ActiveModalType.CONTACT_MODAL;
//     const dispatch: AppDispatch = useDispatch();
//     const [currentContact, setCurrentContact] = useState<Contact>(contact!);
//     const { email: userId, token } = useSelector((state: RootState) => state.persisted.user.value);
//     const onFinish = async () => {
//         const startTime = new Date().getTime();
//         const completeContact = { ...currentContact, onlineSearchResults: currentContactResults }
//         pushEvent('SubmitCompleteContact', convertContactToContactV2(completeContact))
//         // try {
//         //     const promise1 = convertIntoVCardForm(JSON.stringify(completeContact));
//         //     const promise2 = apiService.createContact(
//         //         {
//         //             ...currentContact,
//         //             // contactText: convertContactToString(completeContact),
//         //             location: currentUserLocation,
//         //             timestamp: format(new Date(), "dd-MMMM-yyyy"),
//         //             // userId
//         //         }, userId, token);

//         //     const [vCard] = await Promise.all([promise1, promise2]);
//         //     const sanitizedVCard = sanitizeVCard(vCard as string);
//         //     await downloadVCard(sanitizedVCard);
//         //     const endTime = new Date().getTime();
//         //     pushEvent('VoiceToContactCompleted', { responseTime: (endTime - startTime) / 1000 })
//         //     dispatch(setContact(initialState.value!));
//         //     form.resetFields();

//         // } catch (error) {
//         //     // Handle error
//         //     console.error(error);
//         // }
//     };

//     const handleChange = (changedFields: Partial<Contact>, fieldEdited: "first_name" | "last_name" | "email" | "phone" | "bio") => {
//         setCurrentContact({ ...currentContact, ...changedFields });
//         pushEvent('CorrectContactFromVoice', { fieldEdited });
//     }


//     const onCancel = () => {
//         dispatch(setIsModalOpen(false));
//     }

//     const handleSearchOnline = () => {
//         const keywordsArray = extractKeywordsFromContact(currentContact);
//         dispatch(setActiveQueryString(keywordsArray.join(" ")));
//         dispatch(setModalType(ActiveModalType.ONLINE_SEARCH_MODAL));
//     }

//     const currentContactResults: ContactOnlineSearchResult[] = useSelector((state: RootState) => state.contact.value.activeContact?.onlineSearchResults!)

//     return (
//         <Modal
//             title="Edit Contact"
//             visible={isVisible}
//             onCancel={onCancel}
//             footer={<>
//                 <Button
//                     type="primary"
//                     htmlType="submit"
//                     onClick={
//                         () => {
//                             dispatch(setIsModalOpen(false));
//                             form.submit();
//                         }
//                     }
//                 >
//                     Submit
//                 </Button>
//                 <Button
//                     danger={true}
//                     style={{
//                         marginLeft: '1rem'
//                     }}
//                     icon={<SearchOutlined />}
//                     type="primary"
//                     onClick={handleSearchOnline}
//                 >
//                     Search Online
//                 </Button>
//             </>}
//         >
//             <div style={{ maxHeight: '500px', overflow: 'auto' }}>
//                 <Form form={form} onFinish={onFinish}>
//                     <Form.Item name={['names', '0', 'givenName']} initialValue={currentContact.names[0].givenName} label="Given Name">
//                         <Input onChange={(e) => handleChange(
//                             { names: [{ ...currentContact.names[0], givenName: e.target.value as string }] }, "first_name")
//                         } />
//                     </Form.Item>
//                     <Form.Item initialValue={currentContact.names[0].familyName} name={['names', '0', 'familyName']} label="Family Name">
//                         <Input onChange={(e) => handleChange(
//                             { names: [{ ...currentContact.names[0], familyName: e.target.value as string }] }, "last_name")} />
//                     </Form.Item>
//                     <Form.Item name={['emailAddresses', '0', 'value']} initialValue={currentContact.emailAddresses[0].value} label="Email">
//                         <Input type="email" onChange={(e) =>
//                             handleChange(
//                                 { emailAddresses: [{ value: e.target.value as string }] }, "email")
//                         } />
//                     </Form.Item>
//                     <Form.Item name={['phoneNumbers', '0', 'value']} initialValue={currentContact.phoneNumbers[0].value} label="Phone Number">
//                         <Input onChange={(e) =>
//                             handleChange(
//                                 { phoneNumbers: [{ value: e.target.value as string }] }, "phone")
//                         } />
//                     </Form.Item>
//                     <Form.Item name={['biographies', '0', 'value']} initialValue={currentContact.biographies[0].value} label="Bio">
//                         <TextArea rows={6} onChange={(value) =>
//                             handleChange(
//                                 { biographies: [{ value: value as string }] }, "bio")
//                         } />
//                     </Form.Item>
//                     {currentContactResults?.length > 0 &&
//                         <>
//                             <h3>Social Links</h3>
//                             <List
//                                 itemLayout="vertical"
//                                 size="default"
//                                 dataSource={currentContactResults}
//                                 renderItem={(item: ContactOnlineSearchResult) => (
//                                     <OnlineSearchResultItem {...item} />
//                                 )}
//                             />
//                         </>
//                     }
//                 </Form>
//             </div>
//         </Modal>
//     );
// };

// export default EditContactModal;
export { }