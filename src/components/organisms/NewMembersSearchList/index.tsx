import { SearchOutlined } from "@ant-design/icons";
import useDebounce from "@hooks/useDebounce";
import { Contact } from "@models/contact.model";
import { RootState } from "@redux/store";
import { pushEvent } from "@utils/analytics";
import apiService from "@utils/api/api-service";
import { Input, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ManageGroupMembersList from "../../../legacy/ManageGroupMembersList";

const NewMembersSearchList: React.FC = () => {
    const [results, setResults] = useState<Contact[]>([]);
    const { activeQueryString, bottomSheetType } = useSelector((state: RootState) => state.activeEntities);
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
    const [query, setQuery] = useState<string>(activeQueryString);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const inputRef = useRef(null);

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


    const handleSearch = async () => {
        if (!query) {
            setResults([]);
            setIsLoading(false);
            return;
        };
        const startTime = new Date().getTime();
        setIsLoading(true);
        pushEvent('SearchPersonInNetworkForGroup', { query })
        const response = await apiService.searchContact(query, email, token);
        setResults(response as Contact[]);
        setIsLoading(false);
        const endTime = new Date().getTime();
        pushEvent('UserSearchPersonCompleted', { query, responseTime: (endTime - startTime) / 1000, bottomSheetType })
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
            {results?.length === 0 && <p>Search up people you want to add to this group</p>}
            {isLoading && <Spin />}
            {results?.length > 0
                ? <ManageGroupMembersList results={results} />
                : <p></p>
            }
        </>

    )
}
export default NewMembersSearchList;