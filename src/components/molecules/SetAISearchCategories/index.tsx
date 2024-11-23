import { RecordType } from '@models/index';
import { setActiveSearchResponseRecordTypes } from '@redux/features/activeEntitiesSlice';
import { AppDispatch, RootState } from '@redux/store';
import CheckableTag from 'antd/es/tag/CheckableTag';
import { useDispatch, useSelector } from 'react-redux';
import './SetAISearchCategories.css'
import { pushEvent } from '@utils/analytics';

const SetAISearchCategories = () => {
    //   Component that just has chips rendered a horizontal row as Ant design tags, for filtering search results. On clicking any one of the chips, an event to redux is dispatched to set the search response type to the selected chip.
    const activeSearchResponseRecordTypes = useSelector((state: RootState) => state.activeEntities.activeSearchResponseRecordTypes);
    const searchResponseTypes = [
        {
            type: null,
            description: 'All',
        },
        {
            type: RecordType.CONTACT,
            description: 'Contacts',
        },
        // {
        //     type: RecordType.ACTION,
        //     description: 'Actions',
        // },
        {
            type: RecordType.NOTE,
            description: 'Notes',
        },
        // {
        //     type: RecordType.RELATIONSHIP,
        //     description: 'Relationships',
        // },
        // {
        //     type: RecordType.LINKEDIN_CONTACT,
        //     description: 'Linkedin Contact',
        // },
        {
            type: RecordType.CONTENT_RESPONSE,
            description: 'Insights',
        },
    ];

    const dispatch: AppDispatch = useDispatch();

    const handleChange = (activeRecordType: RecordType | null, checked: boolean) => {
        if (activeRecordType === null) {
            pushEvent('SetAISearchCategory', { activeCategories: ['ALL'] })
            dispatch(setActiveSearchResponseRecordTypes([]));
        } else {
            const nextSelectedActiveRecordTypes = checked
                ? [...activeSearchResponseRecordTypes, activeRecordType]
                : activeSearchResponseRecordTypes.filter((t) => t !== activeRecordType);
            pushEvent('SetAISearchCategory', { activeCategories: nextSelectedActiveRecordTypes })
            dispatch(setActiveSearchResponseRecordTypes(nextSelectedActiveRecordTypes));
        }

    };

    return (
        <div className="searchCategoriesContainer">
            <span style={{ marginRight: 8 }}>Search Filters:</span>
            <div className="searchCategoriesSpace"> {/* Modified from <Space> to <div> */}
                {searchResponseTypes.map((tag) => (
                    <CheckableTag
                        key={tag.type}
                        style={{ color: "#000", display: 'inline-block' }} /* Ensure tags are inline-block */
                        checked={
                            tag.type ?
                                activeSearchResponseRecordTypes.includes(tag.type) :
                                activeSearchResponseRecordTypes.length === 0
                        }
                        onChange={(checked) => handleChange(tag.type, checked)}
                    >
                        {tag.description}
                    </CheckableTag>
                ))}
            </div>
        </div>
    )





}

export default SetAISearchCategories
