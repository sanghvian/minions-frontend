import CheckableTag from 'antd/es/tag/CheckableTag';
import './ContactPageViewCategories.css'
import { Dispatch, SetStateAction } from 'react';
import { RecordType } from '@models/index';


const ContactPageViewCategories: React.FC<{
    activeFilter: RecordType,
    setActiveFilter: Dispatch<SetStateAction<RecordType>>
}> = ({ activeFilter, setActiveFilter }) => {
    const onlineSearchResponseFilters = [
        {
            type: RecordType.CONTACT,
            description: 'Contacts',
        },
        {
            type: RecordType.GROUP,
            description: 'Groups',
        },
    ];

    const handleChange = (activeRecordType: RecordType) => {
        // For the cases where the search filter has a finite string length, i.e. anything except the "All" filter
        setActiveFilter(activeRecordType);
    };

    return (
        <div className="contactPageReviewCategoriesContainer">
            <span>Filters:</span>
            <div className="contactPageReviewCategoriesSpace"> {/* Modified from <Space> to <div> */}
                {onlineSearchResponseFilters.map((tag) => {
                    const checked = tag.type === activeFilter
                    return (
                        <CheckableTag
                            key={tag.type}
                            style={{ color: "#000", display: 'inline-block' }} /* Ensure tags are inline-block */
                            checked={checked}
                            onChange={() => handleChange(tag.type as RecordType)}
                        >
                            {tag.description}
                        </CheckableTag>
                    )
                })}
            </div>
        </div>
    )
}

export default ContactPageViewCategories
