import { Contact } from "@models/contact.model";
import { addContactToActiveContactsList, removeContactFromActiveContactsList } from "@redux/features/contactSlice";
import { AppDispatch, RootState } from "@redux/store";
import { pushEvent } from "@utils/analytics";
import { Checkbox, List } from "antd";
import { Avatar } from "antd-mobile";
import { useDispatch, useSelector } from "react-redux";

const GroupMemberListItem: React.FC<{ item: Contact }> = ({ item }) => {
    const activeContacts = useSelector((state: RootState) => state.contact.value.activeContacts);

    // Current item contact is active, if it is in the activeContacts array. Can check by the id present on the contact item
    const isActiveContact = activeContacts.some((contact) => contact.id === item.id);

    const dispatch: AppDispatch = useDispatch();
    const handleAttach = () => {
        pushEvent('AddContactToGroup', (item as any))
        dispatch(addContactToActiveContactsList(item))
    }
    const handleDetach = () => {
        pushEvent('RemoveContactFromGroup', (item as any))
        dispatch(removeContactFromActiveContactsList(item))
    }
    return (
        <List.Item>
            <List.Item.Meta
                avatar={<Avatar src={item.imgUrl || "https://unsplash.it/500"} />}
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>
                            {item.name}
                        </span>
                        <Checkbox
                            checked={isActiveContact}
                            onChange={isActiveContact ? handleDetach : handleAttach}
                        />
                    </div>
                }
                description={item.headline}
            />
            <div className='source-container'>
                {/* <Button
                    type={isActiveContact ? 'default' : 'primary'}
                    // icon={isActiveContact ? <MinusCircleOutlined /> : <PlusCircleOutlined />}
                    onClick={isActiveContact ? handleDetach : handleAttach}
                >
                    {isActiveContact ? 'Remove member' : 'Add member'}
                </Button> */}
            </div>
        </List.Item>
    )
}
export default GroupMemberListItem