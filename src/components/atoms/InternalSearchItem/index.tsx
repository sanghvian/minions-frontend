import { Contact } from "@models/contact.model";
import { initialContactState, setContact } from "@redux/features/contactSlice";
import { AppDispatch, RootState } from "@redux/store";
import { pushEvent } from "@utils/analytics";
import { Avatar, Checkbox, List } from "antd";
import { useDispatch, useSelector } from "react-redux";

const InternalSearchItem: React.FC<{ item: Contact }> = ({ item }) => {
    const activeContact = useSelector((state: RootState) => state.contact.value.activeContact);
    const isActiveContact = item.id === activeContact.id;

    const dispatch: AppDispatch = useDispatch();
    const handleAttach = () => {
        pushEvent('AttachContactFromInternalSearchToNote', (item as any))
        dispatch(setContact(item))
    }
    const handleDetach = () => {
        pushEvent('DetachContactFromInternalSearchToNote', (item as any))
        dispatch(setContact(initialContactState.value.activeContact))
    }
    return (
        <List.Item>
            <List.Item.Meta
                // avatar={<Avatar src={item.imgUrl} />}
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#000' }}>
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
                {/* <Checkbox
                    checked={isActiveContact}
                    onChange={isActiveContact ? handleDetach : handleAttach}
                >
                    Checkbox
                </Checkbox> */}
                {/* type={isActiveContact ? 'default' : 'primary'}
                    // icon={isActiveContact ? <MinusCircleOutlined /> : <PlusCircleOutlined />}
                    onClick={}
                >
                    {isActiveContact ? 'Remove contact' : 'Select contact'}
                </> */}
            </div>
        </List.Item>
    )
}

export default InternalSearchItem