import { CalendarOutlined } from '@ant-design/icons';
import { ActionStatus, CompleteAction } from '@models/action.model';
import { setRecentActions } from '@redux/features/actionSlice';
import { ActiveRouteKey } from '@redux/features/activeEntitiesSlice';
import { AppDispatch, RootState } from '@redux/store';
import apiService from '@utils/api/api-service';
import { List, Spin } from 'antd';
import { CheckCircleOutline } from 'antd-mobile-icons';
import { format } from 'date-fns';
import React from 'react'
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
    LeadingActions,
    SwipeableList,
    SwipeableListItem,
    SwipeAction,
    TrailingActions,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';


const dateFormatter = (timestamp: string) => {
    const formattedDate = `${format(new Date(timestamp), 'do MMM yyyy')}`;
    // use the `format` function from date-fns to format hours and minutes as 6:02pm with AM/PM form instead of 24 hour format
    return formattedDate;
}

const leadingActions = () => (
    <LeadingActions>
        <SwipeAction onClick={() => { }}>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    backgroundColor: 'blue'
                }}
            >
                <CalendarOutlined />
                View Calendar
            </div>
        </SwipeAction>
    </LeadingActions>
);


const trailingActions = () => (
    <TrailingActions>
        <SwipeAction
            destructive={true}
            onClick={() => console.info('swipe action triggered')}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    backgroundColor: 'green'
                }}
            >
                <CheckCircleOutline />
                Complete
            </div>
        </SwipeAction>
        {/* <SwipeAction
            destructive={true}
            onClick={() => console.info('swipe action triggered')}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    backgroundColor: 'red'
                }}
            >
                <CloseOutlined />
                Cancel
            </div>
        </SwipeAction> */}
    </TrailingActions>
);


const RecentActionsList = () => {
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
    const recentActions = useSelector((state: RootState) => state.action.value.recentActions);
    const [hasFetchedUpcomingActions, setHasFetchedUpcomingActions] = React.useState(false);
    const dispatch: AppDispatch = useDispatch();


    const { isLoading } = useQuery({
        queryKey: ["getUpcomingUserActions", email, token],
        queryFn: async ({ queryKey }) => {
            if (!queryKey[1]) return [];
            const upcomingActionsList = await apiService.getUpcomingActions(queryKey[1], queryKey[2]!);
            dispatch(setRecentActions([...recentActions, ...upcomingActionsList]));
            setHasFetchedUpcomingActions(true);
        },
        enabled: !hasFetchedUpcomingActions
    },
    );


    const uniqueRecentActions = recentActions
        .filter((action, index, self) =>
            index === self.findIndex((t) => (
                t.id === action.id
            ))
        ).filter((action: CompleteAction) => action.status === ActionStatus.SCHEDULED)


    return (
        isLoading ? <Spin />
            : <div>
                {uniqueRecentActions.length > 0 &&
                    <div className="recentNotesContainer">
                        <h2>Upcoming Actions</h2>
                        <SwipeableList>

                            <List
                                itemLayout="horizontal"
                                dataSource={uniqueRecentActions}
                                renderItem={(action: CompleteAction) => (
                                    <List.Item>
                                        <SwipeableListItem
                                            leadingActions={leadingActions()}
                                            trailingActions={trailingActions()}
                                            onSwipeEnd={async (dragDirection) => {
                                                if (dragDirection === 'left') {
                                                    await apiService.updateAction(action.id!, { status: ActionStatus.COMPLETED }, email, token)
                                                    dispatch(setRecentActions(recentActions.filter((recentAction) => recentAction.id !== action.id)))
                                                } else {
                                                    window.location.href = action.actionLink
                                                }
                                                toast.success('Action marked as completed!')
                                            }}
                                        >
                                            <List.Item.Meta
                                                title={<NavLink
                                                    to={`/${ActiveRouteKey.CONTACTS}/${action.relationship?.contactId}`}
                                                >
                                                    {action.contactName} - {action.action}
                                                </NavLink>}
                                                description={
                                                    <>
                                                        <div>{dateFormatter(action.timestamp)}</div>
                                                        <div>{`Event: ${action.event}`}</div>
                                                        {action.contact !== undefined && <div>{`Contact: ${action.contact?.name}`}</div>}
                                                    </>
                                                }
                                            />
                                        </SwipeableListItem>
                                    </List.Item>
                                )}
                            />
                        </SwipeableList>
                    </div>
                }
                {!(recentActions.length > 0) &&
                    <p
                        style={{
                            color: 'white',
                            margin: '0 2rem',
                            fontSize: '0.9rem'
                        }}>
                        Add a action using the chatbar below - Just type "@" to select a contact and a date by typing "tod", "tmrw", "mon", "18th", "jan".
                    </p>
                }
            </div>
    )
}

export default RecentActionsList
