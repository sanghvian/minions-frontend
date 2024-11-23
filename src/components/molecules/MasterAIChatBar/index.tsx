import React, { useEffect, useState } from 'react'
import { setRecentNotes } from '@redux/features/noteSlice';
import useEffectOnce from '@hooks/useEffectOnce';
import { RecordType } from '@models/index';
import { setRecentActions } from '@redux/features/actionSlice';
import { CompleteContact, Contact } from '@models/contact.model';
import apiService from '@utils/api/api-service';
import './MasterAIChatbar.css'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { addContactNote, initialContactState, setContact, setContactActions } from '@redux/features/contactSlice';
import { Button, Input, Spin, Tag } from 'antd';
import { BottomSheetType, SearchType, setActiveQueryString, setAudioNoteContent, setBottomSheetType, setHandleBottomSheetClose, setIsBottomSheetOpen, setSearchType } from '@redux/features/activeEntitiesSlice';
import { pushEvent } from '@utils/analytics';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { Note } from '@models/note.model';
import MasterAudioRecorder from '../MasterAudioRecorder';
import { dayShorthands, monthShorthands } from './constants';
import { nextMonday, nextTuesday, addDays, format, nextWednesday, nextThursday, nextFriday, nextSaturday, nextSunday } from 'date-fns';
import { setUserCalendarId, setUserToken } from '@redux/features/userSlice';
import useDebounce from '@hooks/useDebounce';

interface MasterAIChatBarProps {
    presetContact: CompleteContact;
}

const MasterAIChatBar: React.FC<MasterAIChatBarProps> = ({ presetContact }) => {
    const [isContactSearchMode, setIsContactSearchMode] = useState<boolean>(false);
    const [isDateSearchMode, setIsDateSearchMode] = useState<boolean>(false);
    const [contacts, setContacts] = useState<Contact[]>([]);


    // Will not run into issues as the only difference between Contact and CompleteContact is the "linkedinContact" property, which is anyways "undefined" for initialContactState.value.activeContact
    const [selectedContact, setSelectedContact] = useState<Contact>
        (presetContact); // This is the contact that we will be adding the note to. This is the active contact.

    const activeQueryString = useSelector((state: RootState) => state.activeEntities.activeQueryString);
    const { email, token, calendarId, id } = useSelector((state: RootState) => state.persisted.user.value);
    const [loading, setLoading] = useState<boolean>(false);
    const inputRef = React.useRef(null);
    const recentNotes = useSelector((state: RootState) => state.note.value.recentNotes);
    const recentActions = useSelector((state: RootState) => state.action.value.recentActions);
    const dispatch: AppDispatch = useDispatch();
    const [chatInput, setChatInput] = useState<string>(activeQueryString);
    const [inputMode, setInputMode] = useState<RecordType.ACTION | RecordType.NOTE>(RecordType.NOTE);
    const [suggestions, setSuggestions] = useState<Date[]>([]);
    // const [currentAction, setCurrentAction] = useState<Action | null>(null);
    const [activeTimestamp, setActiveTimestamp] = useState<string>("");
    // const [detectionWord, setDetectionWord] = useState<string>("");// the word on which we detect a date indication and enter into add-action mode


    const addUniqueSuggestionToList = (suggestion: Date) => {
        const isSuggestionExisting = suggestions.some(s => s.getDate() === suggestion.getDate())
        if (!isSuggestionExisting) {
            setSuggestions([...suggestions, suggestion]);
        }
    }

    useEffect(() => {
        // const dateRegex = /\b(0?[1-9]|[12][0-9]|3[01])(st|nd|rd|th)?\b/g;
        // const isItADate = dateRegex.test(chatInput.toLowerCase());
        // if (isItADate) setDetectionWord(chatInput.toLowerCase().match(dateRegex)![0]);
        // const isItTmrw = chatInput.toLowerCase().includes('tmrw')
        // if (isItTmrw) setDetectionWord('tmrw')
        // const isItTmrw2 = chatInput.toLowerCase().includes('tom')
        // if (isItTmrw2) setDetectionWord('tom')
        // const isItToday = chatInput.toLowerCase().includes('tod')
        // if (isItToday) setDetectionWord('tod')
        // const isItToday2 = chatInput.toLowerCase().includes('tdy');
        // if (isItToday2) setDetectionWord('tdy')
        // const detectedDaysInChatInput = dayShorthands.filter(day => chatInput.toLowerCase().includes(day))
        // const isItADay = detectedDaysInChatInput.length > 0;
        // // To pick up on the last detected day
        // if (isItADay) setDetectionWord(detectedDaysInChatInput[detectedDaysInChatInput.length - 1])
        // const detectedMonthsInChatInput = monthShorthands.filter(month => chatInput.toLowerCase().includes(month))
        // const isItAMonth = detectedMonthsInChatInput.length > 0;
        // if (isItAMonth) setDetectionWord(detectedMonthsInChatInput[detectedMonthsInChatInput.length - 1]);
        // const isItAnythingTime = isItADate || isItTmrw || isItToday || isItADay || isItAMonth;

        // if (isItAnythingTime
        //     && !activeTimestamp
        // ) {

        //     // If the current cursor in the chatInput string is 4 places ahead of the last character of the detection word, and the user has not selected even one of the date suggestions we give, then revert the InputMode to NOTE
        //     // if (chatInput.length - chatInput.lastIndexOf(detectionWord) >= 8) {
        //     //     setInputMode(RecordType.NOTE); setIsDateSearchMode(false);
        //     //     setSuggestions([]);
        //     //     setDetectionWord("");
        //     // } else {
        //     setIsDateSearchMode(true);
        //     setInputMode(RecordType.ACTION);
        //     if (isItTmrw) {
        //         const newDate = addDays(new Date(), 1);
        //         handleDateSelection(newDate)
        //         // Remove the word tmrw or tom from the chatInput
        //         setChatInput(chatInput.replace(/tmrw|tom/gi, ''));
        //         // Check if the chatInput contains a day shorthand, then we identify the day shorthand and use functions to set the date
        //     } else if (isItToday) {
        //         const newDate = new Date();
        //         handleDateSelection(newDate)
        //         // Remove the word tmrw or tom from the chatInput
        //         setChatInput(chatInput.replace(/tmrw|tom/gi, ''));
        //         // Check if the chatInput contains a day shorthand, then we identify the day shorthand and use functions to set the date
        //     } else if (isItADay) {
        //         // Get the day shorthand which is included in the chatInput
        //         const dayShorthand = detectionWord;
        //         // Based on the day shorthand now, we set the date suggestions. if the day shorthand is 'mon' , we use the 'nextMonday' function from 'date-fns' to set the date to next monday. Similarly for other days
        //         switch (dayShorthand) {
        //             case 'mon':
        //                 setSuggestions([nextMonday(new Date())]);
        //                 break;
        //             case 'tue':
        //                 setSuggestions([nextTuesday(new Date())]);
        //                 break;
        //             case 'wed':
        //                 setSuggestions([nextWednesday(new Date())])
        //                 break;
        //             case 'thu':
        //                 setSuggestions([nextThursday(new Date())]);
        //                 break;
        //             case 'fri':
        //                 setSuggestions([nextFriday(new Date())]);
        //                 break;
        //             case 'sat':
        //                 setSuggestions([nextSaturday(new Date())]);
        //                 break;
        //             case 'sun':
        //                 setSuggestions([nextSunday(new Date())]);
        //                 break;
        //         }
        //         // } else if (dayFullNames.includes(chatInput.toLowerCase())) {
        //         //     setInputMode(RecordType.ACTION);
        //         //     setSuggestions([nextTuesday(new Date())]);
        //     }
        //     else if (isItAMonth) {
        //         // Get the month shorthand which is included in the chatInput
        //         const monthShorthand = detectionWord;
        //         const currentYear = new Date().getFullYear();
        //         const currentMonth = new Date().getMonth();
        //         const isMonthDone = currentMonth > monthShorthands.indexOf(monthShorthand);

        //         switch (monthShorthand) {
        //             case 'jan':
        //                 // Sets the date to the 1st of the the very next january, based on current year. If it is already january, then it sets the date to 1st of the next year's january, so that the date is always in the future - using the currentYear and currentMonth variables
        //                 setSuggestions([new Date(currentYear + 1, 0, 1)]);
        //                 break;
        //             case 'feb':
        //                 // Sets the date to the 1st of the the very next january, based on current year. If it is already february, then it sets the date to 1st of the next year's january, but if it's not february yet, then it sets the date to the february of the current year using the isMonthDone variable
        //                 setSuggestions([new Date(currentYear + (isMonthDone ? 1 : 0), 1, 1)]);
        //                 break;
        //             case 'mar':
        //                 setSuggestions([new Date(currentYear + (isMonthDone ? 1 : 0), 2, 1)]);

        //                 break;
        //             case 'apr':
        //                 setSuggestions([new Date(currentYear + (isMonthDone ? 1 : 0), 3, 1)]);
        //                 break;
        //             case 'may':
        //                 setSuggestions([new Date(currentYear + (isMonthDone ? 1 : 0), 4, 1)]);
        //                 break;
        //             case 'jun':
        //                 setSuggestions([new Date(currentYear + (isMonthDone ? 1 : 0), 5, 1)]);
        //                 break;
        //             case 'jul':
        //                 setSuggestions([new Date(currentYear + (isMonthDone ? 1 : 0), 6, 1)]);
        //                 break;
        //             case 'aug':
        //                 setSuggestions([new Date(currentYear + (isMonthDone ? 1 : 0), 7, 1)]);
        //                 break;
        //             case 'sept':
        //                 setSuggestions([new Date(currentYear + (isMonthDone ? 1 : 0), 8, 1)]);
        //                 break;
        //             case 'oct':
        //                 setSuggestions([new Date(currentYear + (isMonthDone ? 1 : 0), 9, 1)]);
        //                 break;
        //             case 'nov':
        //                 setSuggestions([new Date(currentYear + (isMonthDone ? 1 : 0), 10, 1)]);
        //                 break;
        //             case 'dec':
        //                 setSuggestions([new Date(currentYear + (isMonthDone ? 1 : 0), 11, 1)]);
        //                 break;
        //             default:
        //                 setSuggestions([]);
        //                 break;
        //         }
        //         // } else if (dayFullNames.includes(chatInput.toLowerCase())) {
        //         //     setInputMode(RecordType.ACTION);
        //         //     setSuggestions([nextTuesday(new Date())]);
        //     }
        //     else if (isItADate) {
        //         const regexMatches = chatInput.match(dateRegex);
        //         if (regexMatches?.length === 0) {
        //             return;
        //         }
        //         let dateMatch = regexMatches![0];
        //         const dayOfMonth = parseInt(dateMatch);
        //         const date = new Date();
        //         date.setDate(dayOfMonth);
        //         if (date < new Date()) {
        //             date.setMonth(date.getMonth() + 1);
        //         }
        //         setSuggestions([date]);
        //     }
        //     // }

        // }
        // else {
        //     setInputMode(RecordType.NOTE);
        //     setSuggestions([]);
        // }
        const dateRegex = /\b(0?[1-9]|[12][0-9]|3[01])(st|nd|rd|th)?\b/g;
        const dateMonthRegex = new RegExp(
            `\\b(0?[1-9]|[12][0-9]|3[01])(st|nd|rd|th)? (${monthShorthands.join('|')})\\b`, 'gi'
        );
        const dateMonthMatch = chatInput.toLowerCase().match(dateMonthRegex);
        const isItADate = dateRegex.test(chatInput.toLowerCase());
        const isItTmrw = chatInput.toLowerCase().includes('tmrw') || chatInput.toLowerCase().includes('tom')
        const isItToday = chatInput.toLowerCase().includes('tod') || chatInput.toLowerCase().includes('tdy');
        const isItADay = dayShorthands.filter(day => chatInput.toLowerCase().includes(day)).length > 0;
        const isItAMonth = monthShorthands.filter(month => chatInput.toLowerCase().includes(month)).length > 0;
        const isItAnythingTime = isItADate || isItTmrw || isItToday || isItADay || isItAMonth;
        if (isItAnythingTime && !activeTimestamp) {
            setIsDateSearchMode(true);
            setInputMode(RecordType.ACTION);
            if (isItTmrw) {
                const newDate = addDays(new Date(), 1);
                // handleDateSelection(newDate)
                if (!suggestions.some(s => s.getDate() === newDate.getDate())) {
                    setSuggestions([...suggestions, newDate]);
                }

            } if (isItToday) {
                const newDate = new Date();
                // handleDateSelection(newDate)
                if (!suggestions.some(s => s.getDate() === newDate.getDate())) {
                    setSuggestions([...suggestions, newDate]);
                }
            } if (isItADay) {
                // Get the day shorthand which is included in the chatInput
                const dayShorthand = dayShorthands.filter(day => chatInput.toLowerCase().includes(day)).join('|');
                // Based on the day shorthand now, we set the date suggestions. if the day shorthand is 'mon' , we use the 'nextMonday' function from 'date-fns' to set the date to next monday. Similarly for other days 
                switch (dayShorthand) {
                    case 'mon':
                        addUniqueSuggestionToList(nextMonday(new Date()));
                        break;
                    case 'tue':
                        addUniqueSuggestionToList(nextTuesday(new Date()));
                        break;
                    case 'wed':
                        addUniqueSuggestionToList(nextWednesday(new Date()))
                        break;
                    case 'thu':
                        addUniqueSuggestionToList(nextThursday(new Date()));
                        break;
                    case 'fri':
                        addUniqueSuggestionToList(nextFriday(new Date()));
                        break;
                    case 'sat':
                        addUniqueSuggestionToList(nextSaturday(new Date()));
                        break;
                    case 'sun':
                        addUniqueSuggestionToList(nextSunday(new Date()));
                        break;
                }
                // } if (dayFullNames.includes(chatInput.toLowerCase())) {
                //     setInputMode(RecordType.ACTION);
                //     setSuggestions([...suggestions, nextTuesday(new Date())]);
            }
            if (isItAMonth) {
                // Get the month shorthand which is included in the chatInput
                const monthShorthandArray = monthShorthands.filter(month => chatInput.toLowerCase().includes(month))
                const monthShorthand = monthShorthandArray[monthShorthandArray.length - 1]
                const currentYear = new Date().getFullYear();
                const currentMonth = new Date().getMonth();
                const isMonthDone = currentMonth > monthShorthands.indexOf(monthShorthand);

                switch (monthShorthand) {
                    case 'jan':
                        // Sets the date to the 1st of the the very next january, based on current year. If it is already january, then it sets the date to 1st of the next year's january, so that the date is always in the future - using the currentYear and currentMonth variables
                        addUniqueSuggestionToList(new Date(currentYear + 1, 0, 1));
                        break;
                    case 'feb':
                        // Sets the date to the 1st of the the very next january, based on current year. If it is already february, then it sets the date to 1st of the next year's january, but if it's not february yet, then it sets the date to the february of the current year using the isMonthDone variable
                        addUniqueSuggestionToList(new Date(currentYear + (isMonthDone ? 1 : 0), 1, 1));
                        break;
                    case 'mar':
                        addUniqueSuggestionToList(new Date(currentYear + (isMonthDone ? 1 : 0), 2, 1));

                        break;
                    case 'apr':
                        addUniqueSuggestionToList(new Date(currentYear + (isMonthDone ? 1 : 0), 3, 1));
                        break;
                    case 'may':
                        addUniqueSuggestionToList(new Date(currentYear + (isMonthDone ? 1 : 0), 4, 1));
                        break;
                    case 'jun':
                        addUniqueSuggestionToList(new Date(currentYear + (isMonthDone ? 1 : 0), 5, 1));
                        break;
                    case 'jul':
                        addUniqueSuggestionToList(new Date(currentYear + (isMonthDone ? 1 : 0), 6, 1));
                        break;
                    case 'aug':
                        addUniqueSuggestionToList(new Date(currentYear + (isMonthDone ? 1 : 0), 7, 1));
                        break;
                    case 'sept':
                        addUniqueSuggestionToList(new Date(currentYear + (isMonthDone ? 1 : 0), 8, 1));
                        break;
                    case 'oct':
                        addUniqueSuggestionToList(new Date(currentYear + (isMonthDone ? 1 : 0), 9, 1));
                        break;
                    case 'nov':
                        addUniqueSuggestionToList(new Date(currentYear + (isMonthDone ? 1 : 0), 10, 1));
                        break;
                    case 'dec':
                        addUniqueSuggestionToList(new Date(currentYear + (isMonthDone ? 1 : 0), 11, 1));
                        break;
                    default:
                        break;
                }
                // } if (dayFullNames.includes(chatInput.toLowerCase())) {
                //     setInputMode(RecordType.ACTION);
                //     setSuggestions([...suggestions, nextTuesday(new Date())]);
            }
            if (isItADate) {
                const regexMatches = chatInput.match(dateRegex);
                if (regexMatches?.length === 0) {
                    return;
                }
                let dateMatch = regexMatches![0];
                const dayOfMonth = parseInt(dateMatch);
                const date = new Date();
                date.setDate(dayOfMonth);
                if (date < new Date()) {
                    date.setMonth(date.getMonth() + 1);
                }
                addUniqueSuggestionToList(date);
            }
            if (dateMonthMatch) {
                const [matchedDate, , , matchedMonth] = dateMonthMatch[0].split(' ');
                const day = parseInt(matchedDate);
                const monthIndex = monthShorthands.indexOf(matchedMonth?.toLowerCase());

                if (!isNaN(day) && monthIndex !== -1) {
                    const year = new Date().getFullYear();
                    const date = new Date(year, monthIndex, day);

                    if (date < new Date()) {
                        date.setFullYear(date.getFullYear() + 1);
                    }

                    addUniqueSuggestionToList(date);
                    // Additional logic to handle the matched date-month combination
                }
            }
        } else {
            if (!activeTimestamp) {
                setInputMode(RecordType.NOTE);
            }
            setSuggestions([]);
        }
    }, [chatInput, activeTimestamp, setIsDateSearchMode, setInputMode]);

    const handleDateSelection = (date: Date) => {
        // Create/update the currentAction
        const dateTimestamp = new Date(date).toISOString();
        setActiveTimestamp(dateTimestamp);
        setInputMode(RecordType.ACTION);
        setIsDateSearchMode(false);
        // Reset the suggestions and input
        setSuggestions([]);
    };


    useEffectOnce(() => {
        return () => {
            setSelectedContact(initialContactState.value.activeContact); // Clear the selected contact after submitting
            dispatch(setContact(initialContactState.value.activeContact)); // Clear the selected contact after submitting
        }
    })

    // Load contacts from your database or API
    const loadContacts = async (searchText: string) => {
        setLoading(true);
        try {
            const contacts = await apiService.searchContact(searchText, email, token);
            setContacts(contacts);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Render the contact as a tag when selected
    const renderSelectedContact = () => {
        if (selectedContact.name) {
            return (
                <Tag color="blue" closable onClose={() => setSelectedContact(initialContactState.value.activeContact)}>
                    {selectedContact.name}
                </Tag>
            );
        }
        return null;
    };

    // Render the activeTimestamp as a tag when selected
    const renderSelectedDate = () => {
        if (activeTimestamp.length > 0) {
            return (
                <Tag color="cyan" closable onClose={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveTimestamp("")
                    setInputMode(RecordType.NOTE);
                    setSuggestions([]);
                }}>
                    {format(new Date(activeTimestamp), 'PPP')}
                </Tag>
            );
        }
    };

    useDebounce(() => {
        // If search mode is active, filter the contacts
        if (isContactSearchMode && chatInput.length > 0) {
            const searchQuery = chatInput.slice(chatInput.lastIndexOf('@') + 1);
            loadContacts(searchQuery);
        }
    }, 10, [chatInput])

    // Function to handle input changes
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setChatInput(value);

        // Check if search mode should be activated
        if (value.endsWith('@')) {
            setIsContactSearchMode(true);
        }
    };

    const onSelectContact = (option: Contact) => {
        const contact = contacts.find(c => c.id === option.id);
        // setSelectedContact(contact || null);
        setSelectedContact(contact || initialContactState.value.activeContact);
        setIsContactSearchMode(false);

        // Remove the search query and replace it with the contact name as a tag
        const newValue = chatInput.slice(0, chatInput.lastIndexOf('@'));
        setChatInput(newValue + `@${contact?.name}`);


        // Focus back on the inputRef so a new query can be started
        if (inputRef.current) {
            (inputRef.current as any)?.focus();

            // Once the contact is selected, clear the value in the inputRef
            (inputRef.current as any).value = "";
        }
    };

    const handleUpload = async (contact: Contact, query: string) => {
        if (!(contact.name && query.trim())) {
            toast('Please select a contact you want to add this note to');
            dispatch(setActiveQueryString(''));
            setChatInput('');
            dispatch(setAudioNoteContent(query));
            setLoading(false);
            // If contact is already not selected, then we use the query content to open the existing search UI and results list, modal we already had, for selecting a contact, creating it and then adding the entire note. Else, we directly just add the note and the contact.
            // And then what we want to do, is to help the user find the contact get the contact in their own network, and select that, and that would be the selectedContact i.e. the active contact. And then we can just add the note to that contact.
            if (!contact.name) {
                dispatch(setIsBottomSheetOpen(true));
                dispatch(setBottomSheetType(BottomSheetType.SEARCH_ADD));
                dispatch(setSearchType(SearchType.INTERNAL));
                dispatch(setHandleBottomSheetClose(async ({ contact, activeQueryString }: any) => {
                    // So one way or another, basically, we always have an "active contact" set in the contactSlice before we call the handleUpload function to add the note to that contact.
                    try {
                        await createNoteOrActionWithContact(contact, activeQueryString);
                        toast.success('Done!');
                    } catch (error) {
                        toast.error('Error doing it');
                    } finally {
                        dispatch(setActiveQueryString(''));
                        setActiveTimestamp("");
                    }
                }))
            }
        }
        else createNoteOrActionWithContact(contact, query);
    }

    const createNoteOrActionWithContact = async (contact: Contact, query: string) => {
        const toastId = toast.loading(inputMode === RecordType.NOTE ? 'Adding note...' : 'Adding action...');
        if (contact.name && query.trim()) {
            // Construct your note object here
            try {
                // Your API call to add the note
                if (inputMode === RecordType.NOTE) {
                    const note: Note = {
                        content: query,
                        contactId: contact?.id!,
                        location: contact?.location || "",
                        timestamp: new Date().toISOString(),
                        recordType: RecordType.NOTE
                    }
                    const createdNote = await apiService.createNote(note, true, email, token);
                    dispatch(setRecentNotes([
                        ...recentNotes, {
                            ...createdNote,
                            // We set the contact property as well on the note, in redux so we can display name of contact on each note in recentNotes list
                            contacts: [contact]
                        }]));

                    // For the flow where we are on the contactPage and we want to add an note, we just take the activeContact that is passed to the MasterAIChatBar component as a presetContact and add notes to it.But this happens only for the contactPage and so we check if the presetContact has a name, then we add the action to it.
                    if (presetContact?.name && presetContact.name.length > 0) {
                        dispatch(addContactNote(createdNote))
                    }
                    toast.success(`Note added ${contact.name.length > 0 ? `for ${contact.name}` : ""}`, { id: toastId });
                }
                if (inputMode === RecordType.ACTION) {
                    let relationshipId = contact.relationshipId;
                    if (!relationshipId) {
                        const rship = {
                            userId: email,
                            contactId: contact.id,
                            // TODO: Create a "edit relationship modal" with pre suggested options as tags that helps you set the context of a relationship when you're just creating actions wrt to a person through master command bar. This helps set the contact's relationshipId super fast.
                            relationshipContext: "Help me stay connected to this person"
                        }
                        const createdRShip = await apiService.createRelationship(rship, email, token);
                        relationshipId = createdRShip.id;
                    }
                    const createdAction = await apiService.createActionFromText(
                        {
                            query,
                            relationshipId: relationshipId!,
                            timestamp: activeTimestamp,
                            userId: email,
                            accessToken: token,
                            userUUID: id!,
                            existingCalendarId: calendarId || ""
                        }
                    )
                    dispatch(setRecentActions([
                        ...recentActions, {
                            ...createdAction,
                            // We set the contact property as well on the note, in redux so we can display name of contact on each note in recentNotes list
                            contactName: contact.name,
                            contactId: contact.id,
                            contact
                        }]));
                    dispatch(setUserCalendarId(createdAction.calendarId));
                    // For the flow where we are on the contactPage and we want to add an action, we just take the activeContact that is passed to the MasterAIChatBar component as a presetContact and add actions to it. But this happens only for the contactPage and so we check if the presetContact has a name, then we add the action to it.
                    if (presetContact?.name && presetContact.name.length > 0) {
                        dispatch(setContactActions([
                            ...presetContact.actions!,
                            createdAction
                        ]))
                    }

                    // If the refreshToken for google calendar has expired, then we generate a new one on the fly and return it to the frontend and set is on the user. 
                    dispatch(setUserToken(createdAction.refreshToken))
                    dispatch(setUserCalendarId(createdAction.calendarId))
                    toast.success(`Action added for ${contact.name}`, { id: toastId });
                }
                // setSelectedContact(initialContactState.value.activeContact); // Clear the selected contact after submitting
                // dispatch(setContact(initialContactState.value.activeContact)); // Clear the selected contact after submitting
                pushEvent('AddNoteToContactFromChatbar', { noteText: query, contact });
                setActiveTimestamp("");
                setSuggestions([]);
            } catch (error: any) {
                toast.error(error.message, { id: toastId });
            } finally {
                setIsContactSearchMode(false);
                setIsDateSearchMode(false);
                setLoading(false);
                setActiveTimestamp("");
                dispatch(setActiveQueryString('')); // Clear the input after submitting
                setChatInput(''); // Clear the input after submitting
            }
        }
    }

    return (
        <div className='myChatContainerWrapper'>
            <div className="mySelectedData">
                {renderSelectedContact()}
                {renderSelectedDate()}
            </div>
            <div className='myChatContainer'>
                {/* Render search results if in search mode */}
                {isContactSearchMode ? loading ? <Spin /> :
                    <div className='mySearchPopupContainer'>
                        {
                            contacts.map(contact => (
                                <div
                                    key={contact.id}
                                    onClick={() => onSelectContact(contact)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {contact.name}
                                    {contact.headline !== undefined && contact.headline.length > 0 && <span
                                        style={{ color: 'gray' }}
                                    >({contact.headline})</span>}
                                </div>
                            ))}
                    </div> : <p></p>
                }
                {isDateSearchMode && suggestions.length > 0 && (
                    <div className='mySearchPopupContainer'>
                        {suggestions.map((suggestion, index) => (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                                key={index}
                                onClick={() =>
                                    handleDateSelection(suggestion)}
                            >
                                {format(suggestion, 'PPP')}
                                <Button
                                    icon={<CloseOutlined />}
                                    style={{
                                        backgroundColor: 'red',
                                    }}
                                    onClick={(e: any) => {
                                        e.preventDefault();
                                        e.stopPropagation()
                                        setInputMode(RecordType.NOTE);
                                        setIsDateSearchMode(false);
                                        setSuggestions([]);
                                        setActiveTimestamp("");
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <Input
                    value={chatInput}
                    ref={inputRef}
                    onChange={onInputChange}
                    onPressEnter={() => handleUpload(selectedContact, chatInput)}
                    placeholder="Type '@' to search for contacts or type a note"
                />
                <Button
                    icon={<SendOutlined />}
                    type="primary"
                    loading={loading}
                    onClick={async () => {
                        pushEvent('AddNoteToContact', { noteText: chatInput, contact: selectedContact })
                        await handleUpload(selectedContact, chatInput);
                        dispatch(setActiveQueryString(""));
                        // Focus back on the inputRef so a new query can be started
                        if (inputRef.current) {
                            (inputRef.current as any)?.focus();
                        }
                    }
                    }
                />
                <MasterAudioRecorder />
            </div>
        </div>
    )
}

export default MasterAIChatBar
