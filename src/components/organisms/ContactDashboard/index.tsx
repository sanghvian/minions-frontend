
import { AppDispatch, RootState } from '@redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { Tabs, Card, Typography, Spin, Button } from 'antd';
import { CompleteContact, Contact } from '@models/contact.model';
import apiService from '@utils/api/api-service';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { ActiveModalType, ActiveRouteKey, setActiveQueryString, setIsModalOpen, setModalType } from '@redux/features/activeEntitiesSlice';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { setContact } from '@redux/features/contactSlice';
import LinkedinContactDetails from "../../../legacy/LinkedinContactDetails"
import NotesList from '@components/molecules/NotesList';
import { pushEvent } from '@utils/analytics';
import { setFixedContacts } from '@redux/features/contactsListSlice';
import RelationshipContainer from '@components/organisms/RelationshipContainer';
import { convertBrokenStringToFormattedMultilineString } from '@utils/commonFuncs';
import { AddCircleOutline } from 'antd-mobile-icons';
import { CompleteDocument } from '@models/document.model';
import ContactDocuments from '@components/molecules/ContactDocuments';

const { TabPane } = Tabs;
const { Text } = Typography;

function formatLocation(input: string): string {
  // Replace backslashes with nothing and newlines with semicolons
  let cleanedInput = input?.replace(/\\/g, '')?.replace(/\n/g, ';');

  // Split the cleaned string by semicolons, filter out empty elements, and trim each part
  let parts = cleanedInput?.split(';').filter(part => part.trim() !== '').map(part => part.trim());

  // Remove duplicates
  let uniqueParts = Array.from(new Set(parts));

  // Join the unique array elements with ', ' and return the result
  return uniqueParts.join(', ');
}



function removeWhitespacesAndNewlines(str: string) {
  // Replace all whitespace characters (including spaces, tabs, and newlines) with an empty string
  return str?.replace(/\s+/g, '');
}


const ContactDashboard = () => {
  const [userContactDocuments, setUserContactDocuments] = useState<CompleteDocument[]>([]);
  const location = useLocation();
  // const [activeKey, setActiveKey] = useState<string>("1");
  const contacts = useSelector((state: RootState) => state.persisted.contactsList.value);
  const contactId = location.pathname.split("/")[2];
  const { email, token } = useSelector((state: RootState) => state.persisted.user.value)


  // const handleChange = (key: string) => {
  //   setActiveKey(key);
  // }
  const { isLoading } = useQuery({
    queryKey: ["getCompleteContact", contactId, email, token],
    queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return null;
      const response = await apiService.getContact(queryKey[1], queryKey[2]!, queryKey[3]!)
      dispatch(setContact(response as CompleteContact));
      const contactDocuments = await apiService.getDocumentsForUserContact(queryKey[2], queryKey[1]!, queryKey[3]!)
      setUserContactDocuments(contactDocuments);
    },
  })
  const contact = useSelector((state: RootState) => state.contact.value.activeContact);
  const dispatch: AppDispatch = useDispatch();
  const handleNoteAddClick = () => {
    // Users use search functionality in multiple pages and when user switches pages, ideally, they don't want to carry over the old search string, so this makes sense
    dispatch(setActiveQueryString(''))
    // dispatch(setContact(initialContactState.value.activeContact!))
    dispatch(setIsModalOpen(true))
    dispatch(setModalType(ActiveModalType.NOTE_ADD))
  }


  const NOTES_PANE = "1";
  const DOCUMENTS_PANE = "2";
  const ACTIONS_PANE = "3";
  const BACKGROUND_PANE = "4";

  const navigate = useNavigate();
  return isLoading ? (
    <Spin />
  ) : (
    <>
      <div className="contactContainer">
        <Card
          title={contact?.name}
          style={{ width: "100%" }}
          extra={
            <>
              <Button
                icon={<DeleteOutlined />}
                onClick={() => {
                  toast.promise(
                    apiService.deleteContact(contact.id!, email, token),
                    {
                      loading: "🗑️ Deleting...",
                      success: <b>Contact deleted!</b>,
                      error: <b>Could not delete.</b>,
                    }
                  );
                  pushEvent("DeleteContact", { contact });
                  const filteredContacts = contacts.filter(
                    (c: Contact) => c.id !== contact.id
                  );
                  dispatch(setFixedContacts(filteredContacts));
                  navigate(`/${ActiveRouteKey.CONTACTS}`);
                }}
              />
              &nbsp; &nbsp;
              {/* <Button
                icon={<EditOutlined />}
                onClick={() => {
                  dispatch(setIsModalOpen(true));
                  dispatch(setModalType(ActiveModalType.CONTACT_MODAL));
                }}
              /> */}
              &nbsp; &nbsp;
              <Button
                icon={<AddCircleOutline />}
                onClick={handleNoteAddClick}
              />
            </>
          }
        >
          <ContactDocuments documents={userContactDocuments} />
          {/* {contact?.imgUrl && contact?.imgUrl.length > 0 &&
                            <Card.Meta
                                avatar={<Avatar src={contact?.imgUrl} />}
                                title={contact?.name}
                                description={contact?.occupation}
                            />
                        } */}
          {/* <br />
          {contact?.email && contact?.email?.length > 0 && (
            <Button
              icon={<MailOutlined />}
              onClick={() =>
                pushEvent("EmailContactFromContactPage", { contact })
              }
              type="primary"
              shape="circle"
              href={`mailto:${contact.email}`}
            />
          )}
          {contact?.phone && contact?.phone?.length > 0 && (
            <a href={`tel:${contact.phone}`}>
              <Button
                onClick={() =>
                  pushEvent("PhoneContactFromContactPage", { contact })
                }
                icon={<PhoneOutlined />}
                type="primary"
                shape="circle"
                href={`tel:${contact.phone}`}
              />
              &nbsp; &nbsp;
              <span>{removeWhitespacesAndNewlines(contact.phone)}</span>
            </a>
          )}
          <br /> */}
          {/* <Text>{formatLocation(contact?.location)}</Text>
          <br /> */}
          {/* {contact?.occupation?.length > 0 && (
            <>
              <Text>
                <b>Occupation:</b> {contact?.occupation}
              </Text>
              <br />
            </>
          )}
          {contact?.organization_name?.length > 0 && (
            <>
              <Text>
                <b>Organization:</b> {contact?.organization_name}
              </Text>
              <br />
            </>
          )}
          {contact?.biography?.length > 0 && (
            <>
              <Text>
                <b>Biography:</b>{" "}
                {convertBrokenStringToFormattedMultilineString(
                  contact?.biography
                )}
              </Text>
              <br />
            </>
          )} */}
          {/* <Tabs
            onChange={handleChange}
            activeKey={activeKey}
            defaultActiveKey="1"
          > */}
          {/* <TabPane tab="Notes" key={NOTES_PANE}>
              {contact?.notes && contact?.notes!.length > 0 && (
                <NotesList notes={contact?.notes!} />
              )}
            </TabPane> */}
          {/* <TabPane tab="Documents" key={DOCUMENTS_PANE}> */}
          {/* </TabPane> */}
          {/* <TabPane tab="Actions" key={ACTIONS_PANE}>
              <RelationshipContainer contact={contact!} />
            </TabPane> */}
          {/* <TabPane tab="Background" key={BACKGROUND_PANE}>
              {
                <LinkedinContactDetails
                  linkedinContactId={contact?.linkedinContactId || ""}
                />
              }
            </TabPane> */}
          {/* </Tabs> */}
        </Card>
        <br />
        <br />
        <br />
      </div>
    </>
  );
}

export default ContactDashboard;