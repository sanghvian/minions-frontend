import { ContactOnlineSearchResult } from '@models/contact.model'
import { AppDispatch, RootState } from '@redux/store'
import { Avatar, Checkbox, List, Tag } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './OnlineSearchResultItem.css'
import { pushEvent } from '@utils/analytics'
import { RecordType } from '@models/index'
import { Note } from '@models/note.model'
import { addContactNote, removeContactNote } from '@redux/features/contactSlice'
import { v4 } from 'uuid'

const OnlineSearchResultItem: React.FC<ContactOnlineSearchResult> = (item) => {
  const dispatch: AppDispatch = useDispatch();
  const currentContact = useSelector((state: RootState) => state.contact.value.activeContact)
  const currentContactNotes: Note[] = currentContact?.notes || []
  const isLinkAttached = currentContactNotes?.some((note: Note) => note.noteSource === item.link);
  const { geolocation } = useSelector((state: RootState) => state.activeEntities)
  const audioNoteContent = useSelector((state: RootState) => state.activeEntities.audioNoteContent);

  const handleAttach = async () => {
    const note: Note = {
      id: v4(),
      content: addContactNote.length > 0 ? audioNoteContent : item.title + item.snippet,
      timestamp: new Date().toISOString(),
      location: geolocation,
      recordType: RecordType.NOTE,
      noteSource: item.link,
      noteFavicon: item.favicon,
      contactId: ""
    }
    pushEvent('AddPersonOnlineNote', (note as Note))
    dispatch(addContactNote(note))
  }

  const handleDetach = () => {
    pushEvent('RemovePersonOnlineNote', (item as ContactOnlineSearchResult))
    const currentNote = currentContactNotes.find((note: Note) => note.noteSource === item.link)
    dispatch(removeContactNote(currentNote!)) // Assuming your action takes a link as a parameter
  }

  return (
    <List.Item
      key={item.position}
      className="title-span"
      onClick={isLinkAttached ? handleDetach : handleAttach}
    >
      <List.Item.Meta
        // avatar={<Avatar src={item.favicon} />}
        title={
          <div className="list-item-title-block">
            <span>{item.title}</span>
            <div className="title-block-buttons">
              <a href={item.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                View Profile
              </a>
              <Checkbox
                checked={isLinkAttached}
                onChange={isLinkAttached ? handleDetach : handleAttach}
              />
            </div>
          </div>
        }
        description={item.snippet}
      />
      <div className="source-container">
        <Tag color="blue">{item.source}</Tag>
      </div>
    </List.Item>
  );
}

export default OnlineSearchResultItem
