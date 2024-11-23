import { CompleteAction, ActionStatus } from '@models/action.model';
import { setRecentActions } from '@redux/features/actionSlice';
import { AppDispatch, RootState } from '@redux/store';
import apiService from '@utils/api/api-service';
import { Space, Spin, Table, TableProps, Button } from 'antd';
import React from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const dateFormatter = (timestamp: string) => {
    return format(new Date(timestamp), 'do MMM yyyy');
};

const RecentActionsTable = () => {
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
    });

    const handleComplete = async (action: CompleteAction) => {
        await apiService.updateAction(action.id!, { status: ActionStatus.COMPLETED }, email, token);
        dispatch(setRecentActions(recentActions.filter((recentAction) => recentAction.id !== action.id)));
        toast.success('Action marked as completed!');
    };

    const columns: TableProps<CompleteAction>['columns'] = [
        {
            title: 'Contact Name',
            dataIndex: 'contactName',
            key: 'contactName',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: 'Event',
            dataIndex: 'event',
            key: 'event',
        },
        {
            title: 'Date',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp) => dateFormatter(timestamp),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleComplete(record)}>Complete</Button>
                    <Button href={record.actionLink}>View</Button>
                </Space>
            ),
        },
    ];

    // Deduplicate and sort by date
    const uniqueRecentActions = recentActions
        .filter((action, index, self) =>
            index === self.findIndex((t) => t.id === action.id))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        isLoading ? <Spin /> : <div>
            {uniqueRecentActions.length > 0 &&
                <>
                    <h2>My Actions</h2>
                    <Table dataSource={uniqueRecentActions} columns={columns} rowKey="id" />
                </>
            }
            {!(recentActions.length > 0) &&
                <p style={{ color: 'white', margin: '0 2rem', fontSize: '0.9rem' }}>
                    Add an action using the chatbar below - Just type "@" to select a contact and a date by typing "tod", "tmrw", "mon", "18th", "jan".
                </p>
            }
        </div>
    );
}

export default RecentActionsTable;
