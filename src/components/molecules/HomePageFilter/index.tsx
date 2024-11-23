import CheckableTag from 'antd/es/tag/CheckableTag';
import './HomePageFilter.css'
import { Dispatch, SetStateAction } from 'react';
import { RecordType } from '@models/index';

const HomePageFilter: React.FC<{
    activeFilter: RecordType,
    setActiveFilter: Dispatch<SetStateAction<RecordType>>
}> = ({ activeFilter, setActiveFilter }) => {

    const onlineSearchResponseFilters = [
        {
            type: RecordType.NOTE,
            description: 'Recent People',
        },
        {
            type: RecordType.ACTION,
            description: 'Recent Actions',
        }
    ];

    return (
        <div className="homepageFilterContainer">
            <span>View: &nbsp;</span>
            <div className="homepageFilterSpace"> {/* Modified from <Space> to <div> */}
                {onlineSearchResponseFilters.map((tag) => {
                    const checked = tag.type === activeFilter
                    return (
                        <CheckableTag
                            key={tag.type}
                            style={{
                                color: checked ? "white" : "black",
                                display: 'inline-block',
                                backgroundColor: checked ? "blue" : "#aaa",
                            }} /* Ensure tags are inline-block */
                            checked={checked}
                            onChange={() => setActiveFilter(tag.type)}
                        >
                            {tag.description}
                        </CheckableTag>
                    )
                })}
            </div>
        </div>
    )
}

export default HomePageFilter
