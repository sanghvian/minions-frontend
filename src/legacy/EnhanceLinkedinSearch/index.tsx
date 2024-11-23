import { ForwardOutlined, SearchOutlined } from '@ant-design/icons';
import OnlineSearchItemsList from '@components/molecules/OnlineSearchItemsList';
import useDebounce from '@hooks/useDebounce';
import { ContactOnlineSearchResult } from '@models/contact.model';
import { Note } from '@models/note.model';
import { AppDispatch, RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import { performGoogleSearch } from '@utils/performGoogleSearch';
import { Button, Input, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react'
import './EnhanceLinkedinSearch.css'
import { useDispatch, useSelector } from 'react-redux';
import { setActiveQueryString } from '@redux/features/activeEntitiesSlice';

const EnhanceLinkedinSearch = () => {
    const [results, setResults] = useState<ContactOnlineSearchResult[]>([]);
    const { activeQueryString } = useSelector((state: RootState) => state.activeEntities);
    const { email } = useSelector((state: RootState) => state.persisted.user.value);
    const contact = useSelector((state: RootState) => state.contact.value.activeContact);
    const [query, setQuery] = useState<string>(activeQueryString);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const inputRef = useRef(null);
    const handleBottomSheetClose = useSelector((state: RootState) => state.activeEntities.handleBottomSheetClose);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        // if query is already set, fire handleSearch, right when the component is loading up
        if (query) {
            setQuery(query);
            handleSearch();
        }
        // eslint-disable-next-line
    }, [activeQueryString])

    useDebounce(() => {
        handleSearch();
        if (inputRef.current) {
            (inputRef.current as any).focus();
        }
        // eslint-disable-next-line
    }, 1000, [query])

    const handleNext = async () => {

        const latestNote: Note = contact.notes![contact.notes!.length - 1];
        const linkedinUrl = latestNote.noteSource
        // TODO PATCHFIX - Here, when enhancing linkedin of both, user and contact, we do it through setting the linkedinUrl in the first note on the current contact object in redux. It is not the best way to do it, but it works for now. 
        handleBottomSheetClose!(linkedinUrl);
        dispatch(setActiveQueryString(''))
    }

    const handleSearch = async () => {
        if (!query) {
            setResults([]);
            setIsLoading(false);
            return;
        };
        const startTime = new Date().getTime();
        setIsLoading(true);
        // pushEvent('SearchPersonOnline', { query })
        const response = await performGoogleSearch(query, email);
        setResults(response as ContactOnlineSearchResult[]);
        setIsLoading(false);
        const endTime = new Date().getTime();
        pushEvent('LinkedinContactEnhanced', { query, responseTime: (endTime - startTime) / 1000 })
    };

    return (
        <>
            <Input
                ref={inputRef}
                placeholder="Search for new contact"
                value={query}
                defaultValue={activeQueryString}
                onChange={(e) => setQuery(e.target.value)}
                suffix={
                    <SearchOutlined
                        onClick={() => handleSearch()}
                        style={{ cursor: 'pointer' }}
                    />
                }
            />
            {isLoading ? <Spin /> :
                <div style={{ marginBottom: '10rem' }}> {results?.length === 0 &&
                    <p>Search keywords of the person you want to look up</p>}
                    {results?.length > 0
                        ? <OnlineSearchItemsList
                            results={results as ContactOnlineSearchResult[]}
                        />
                        : <p> </p>
                    }
                </div>}
            <div className="bottomBar">
                {/* Simple div that is a gradient from clear to pure white and has height of 5rem to show the user that the list is scrollable */}
                <div style={{
                    width: '100%',
                    height: '10rem',
                    background: 'linear-gradient(180deg, transparent 0%, #fff 80%)',
                }} />
                <div className="enhanceButtonWrapper">
                    <Button
                        loading={isLoading}
                        disabled={!contact.notes?.length}
                        icon={<ForwardOutlined />} key="search" type="primary" onClick={handleNext}
                    >
                        Enhance
                    </Button>
                    <br />
                </div>
            </div>
        </>
    )
}

export default EnhanceLinkedinSearch
