import CheckableTag from 'antd/es/tag/CheckableTag';
import './AddContactReviewCategories.css'
import { Dispatch, SetStateAction } from 'react';


const AddContactReviewCategories: React.FC<{
    activeFilter: string,
    setActiveFilter: Dispatch<SetStateAction<"info" | "notes">>
}> = ({ activeFilter, setActiveFilter }) => {
    const onlineSearchResponseFilters = [
        {
            type: "info",
            description: 'Info',
        },
        {
            type: "notes",
            description: 'My Notes',
        },
    ];

    const handleChange = (activeRecordType: "info" | "notes") => {
        // For the cases where the search filter has a finite string length, i.e. anything except the "All" filter
        setActiveFilter(activeRecordType);
    };

    return (
        <div className="addContactReviewCategoriesContainer">
            <span>Filters:</span>
            <div className="addContactReviewCategoriesSpace"> {/* Modified from <Space> to <div> */}
                {onlineSearchResponseFilters.map((tag) => {
                    const checked = tag.type === activeFilter
                    return (
                        <CheckableTag
                            key={tag.type}
                            style={{ color: checked ? "#fff" : "#000", display: 'inline-block' }} /* Ensure tags are inline-block */
                            checked={checked}
                            onChange={() => handleChange(tag.type as "info" | "notes")}
                        >
                            {tag.description}
                        </CheckableTag>
                    )
                })}
            </div>
        </div>
    )
}

export default AddContactReviewCategories
