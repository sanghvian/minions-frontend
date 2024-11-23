import React from 'react';
import { List } from 'antd';
import { Contact } from '@models/contact.model';
import ContactListItem from '@components/atoms/ContactListItem';
import './ContactList.css'

type ContactListProps = {
    contacts: Contact[];
};

const ContactList: React.FC<ContactListProps> = ({ contacts }) => {
    const sortedContacts = [...contacts]?.sort((a: Contact, b: Contact) => a.name.localeCompare(b.name)) as Contact[];
    // Function that takes the first letter of the name of the contact and then groups all contacts with that letter in 1 array. It returns an object of the form { [key: string value of the alphabet/letter]: Contact[] }
    const groupedContacts = sortedContacts?.reduce((acc: { [key: string]: Contact[] }, contact: Contact) => {
        const firstLetter = contact.name?.charAt(0).toUpperCase();
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push(contact);
        return acc;
    }, {})


    return (
        Object.keys(groupedContacts).length > 0 ? (
            <div className="contacts-list">
                {Object.keys(groupedContacts).map((alphabet) => (
                    <div key={alphabet}>
                        <h2 className='contactAlphabet' >{alphabet}</h2>
                        <List
                            itemLayout="horizontal"
                            dataSource={groupedContacts[alphabet]}
                            renderItem={(item) => <ContactListItem item={item} />}
                        />
                    </div>
                ))}
            </div>
        ) : (
            <p>No contacts yet.</p>
        )
    );
};

export default ContactList;