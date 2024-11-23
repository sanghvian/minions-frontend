import { Action, CompleteAction } from '@models/action.model'
import { AppDispatch, RootState } from '@redux/store'
import apiService from '@utils/api/api-service'
import { AutoComplete, Button, List, Spin, Typography } from 'antd'
import { format, parseISO } from 'date-fns'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import './ActionPage.css'
import { useEffect, useState } from 'react'
import { ActiveRouteKey, setActiveRouteKey } from '@redux/features/activeEntitiesSlice'
import { pushEvent } from '@utils/analytics'
import { CalendarOutlined, EyeOutlined } from '@ant-design/icons'
import { setFixedActions } from '@redux/features/actionSlice'

interface GroupedActions {
    year: string;
    months: {
        month: string;
        actions: Action[];
    }[];
}

const { Title } = Typography;

function stripContactLink(inputString: string) {
    // Regular expression to match the pattern "Contact Link - HTTPS URL"
    const regexPattern = /Contact Link - https?:\/\/[^\s]+;/g;

    // Replace the matched pattern with an empty string
    return inputString.replace(regexPattern, '').trim();
}

const PlaybookPage = () => {
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value)
    const { data, isLoading } = useQuery({
        queryKey: ["getAllUserActions", email, token],
        queryFn: async ({ queryKey }) => {
            if (!queryKey[1]) return null;
            return await apiService.getAllUserActions(queryKey[1], queryKey[2]!)

        },
    })
    const dispatch: AppDispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');


    const actions = data as CompleteAction[];
    // Filter groups based on search query
    const filteredActions = searchQuery === ''
        ? actions
        : (actions as CompleteAction[]).filter((action: CompleteAction) =>
            action.event.toLowerCase().includes(searchQuery.toLowerCase())
            || action.action.toLowerCase().includes(searchQuery.toLowerCase())
            || format(new Date(action.timestamp), 'dd MMMM yyyy').toLowerCase().includes(searchQuery.toLowerCase())
        );


    // Parse and sort actions
    const sortedTodos = filteredActions
        ?.map((action: CompleteAction) => ({
            ...action,
            parsedDate: parseISO(action.timestamp),
        }))
        ?.sort((a, b) => a.parsedDate.valueOf() - b.parsedDate.valueOf());

    useEffect(() => {
        pushEvent('UserPageView', { pageName: 'PlaybookPage' })
        dispatch(setActiveRouteKey(ActiveRouteKey.ACTIONS))
        if (actions && actions?.length > 0) {
            dispatch(setFixedActions(actions));
        }
    }, [actions, dispatch]);


    // Group actions by year and month
    const groupedActions: GroupedActions[] = [];
    sortedTodos?.forEach(action => {
        const year = format(new Date(action.parsedDate), 'yyyy');
        const month = format(new Date(action.parsedDate), 'MMMM');

        let yearGroup = groupedActions.find(group => group.year === year);
        if (!yearGroup) {
            yearGroup = { year, months: [] };
            groupedActions.push(yearGroup);
        }

        let monthGroup = yearGroup.months.find(group => group.month === month);
        if (!monthGroup) {
            monthGroup = { month, actions: [] };
            yearGroup.months.push(monthGroup);
        }
        monthGroup.actions.push(action);
    });

    // Handle search input change
    const onSearch = (value: string) => {
        pushEvent('SimpleSearchInActionsList', { searchQuery: value })
        setSearchQuery(value);
    };

    return (
        isLoading
            ? <Spin />
            : (
                <>
                    <AutoComplete
                        style={{ width: '95%', marginBottom: 16 }}
                        onSearch={onSearch}
                        placeholder="Search calendar"
                        size="large"
                    />
                    <div className='action-page'>
                        <List
                            itemLayout="vertical"
                            size="large"
                            dataSource={groupedActions}
                            renderItem={yearGroup => (
                                <div key={yearGroup.year}>
                                    <Title color='#fff' level={3} className="sticky-year-header">{yearGroup.year}</Title>
                                    {yearGroup.months.map(monthGroup => (
                                        <div key={monthGroup.month}>
                                            <h3 className='month-name'>{monthGroup.month}</h3>
                                            {monthGroup.actions.map((action: CompleteAction) => (
                                                <List.Item key={action.id} className='Playbook-list-item'>
                                                    <List.Item.Meta
                                                        title={
                                                            <h4 style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                {format(new Date(action.timestamp), 'dd MMM') + ' - ' + action.event}
                                                                <div style={{ display: 'flex', gap: '1rem' }}>
                                                                    <Button icon={<CalendarOutlined />} href={action.actionLink} target="_blank" />
                                                                    <Button icon={<EyeOutlined />} href={`/${ActiveRouteKey.CONTACTS}/${action.contactId}`} target="_blank" />
                                                                </div>
                                                            </h4>}
                                                        description={
                                                            <div className='actionContainer'>
                                                                <span>{action.contactName}:  {stripContactLink(action.action)}<br></br>
                                                                    {/* <NavLink
                                                                        to={`/${ActiveRouteKey.CONTACTS}/${action.contactId}`}
                                                                        className='contactName'>
                                                                        {action.contactName}
                                                                    </NavLink> */}
                                                                </span>
                                                            </div>
                                                        }
                                                    />

                                                </List.Item>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        />
                    </div>
                </>

            )
    )
}

export default PlaybookPage
