import { Contact } from '@models/contact.model'
import React from 'react'
import "./ContactListItem.css"
import { Dropdown } from 'antd'
import { AppDispatch, RootState } from '@redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { setContact } from '@redux/features/contactSlice'
import { router } from '@utils/routes'
import { MoreOutlined } from '@ant-design/icons'
import { ActiveRouteKey } from '@redux/features/activeEntitiesSlice'

const ContactListItem: React.FC<{ item: Contact }> = ({ item }) => {
    const dispatch: AppDispatch = useDispatch();
    const activeMenuPropItemsGetterFunc = useSelector((state: RootState) => state.activeEntities.activeMenuPropItemsGetterFunc)
    const activeMenuPropItems = activeMenuPropItemsGetterFunc(item)

    return (
        <div className="contactItemContainerWrapper" onClick={() => {
            dispatch(setContact(item))
            router.navigate(`/${ActiveRouteKey.CONTACTS}/${item.id}`)
        }}>
            <div className='contactItemContainer'  >
                <h4 className='contact-title'>{item?.name}</h4>
                <div>{item.occupation && item.organization_name ? `${item.occupation} @ ${item.organization_name}` : item.headline}</div>
                {/* <div className='interests-container'>
                    {item.interests.map(interest => (
                        <Tag color="blue" key={interest}>{interest}</Tag>
                    ))}
                </div> */}
            </div>
            <Dropdown menu={{ items: activeMenuPropItems }} trigger={['click']}>
                <MoreOutlined onClick={(e) => e.stopPropagation()} color='#fff' />
            </Dropdown>
        </div>
    )
}

export default ContactListItem
