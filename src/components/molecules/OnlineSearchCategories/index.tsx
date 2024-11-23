import CheckableTag from 'antd/es/tag/CheckableTag';
import './OnlineSearchCategories.css'
import { pushEvent } from '@utils/analytics';
import { Dispatch, SetStateAction, useState } from 'react';

function extractAfterColon(str: string) {
    const index = str.indexOf(':');
    if (index === -1) {
        return str; // Return the original string if ':' is not found
    }
    return str.substring(index + 1, str.length).trim(); // Extract and trim the substring before ':'
}


const OnlineSearchCategories: React.FC<{
    query: string,
    setQuery: Dispatch<SetStateAction<string>>
}> = ({ setQuery, query }) => {
    const [activeFilter, setActiveFilter] = useState<string>("");

    const onlineSearchResponseFilters = [
        {
            type: "",
            description: 'All',
        },
        {
            type: "linkedin",
            description: 'linkedin',
        },
        {
            type: "twitter",
            description: 'twitter',
        },
        {
            type: "instagram",
            description: 'instagram',
        }
    ];

    const handleChange = (activeRecordType: string) => {
        // For the cases where the search filter has a finite string length, i.e. anything except the "All" filter
        setActiveFilter(activeRecordType);
        if (activeRecordType.length > 0) {
            pushEvent('SetOnlineSearchCategory', { activeCategories: activeFilter })
            const cleanedQueryString = (extractAfterColon(query))
            setQuery(`${activeRecordType}:${cleanedQueryString}`)
        } else {
            setQuery(extractAfterColon(query))
        }
    };

    return (
        <div className="onlineSearchCategoriesContainer">
            <span>Filters:</span>
            <div className="onlineSearchCategoriesSpace"> {/* Modified from <Space> to <div> */}
                {onlineSearchResponseFilters.map((tag) => {
                    const checked = tag.type === activeFilter
                    return (
                        <CheckableTag
                            key={tag.type}
                            style={{ color: checked ? "#fff" : "#000", display: 'inline-block' }} /* Ensure tags are inline-block */
                            checked={checked}
                            onChange={() => handleChange(tag.type)}
                        >
                            {tag.description}
                        </CheckableTag>
                    )
                })}
            </div>
        </div>
    )
}

export default OnlineSearchCategories
