import { PlayCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { format, addSeconds } from 'date-fns';
import { setUsageCount } from '@redux/features/userSlice';
import { AppDispatch, RootState } from '@redux/store';
import { useDispatch, useSelector } from 'react-redux';

function formatSeconds(seconds: number): string {
    const baseDate = new Date(0, 0, 0, 0, 0, 0);
    const dateWithSeconds = addSeconds(baseDate, seconds);
    return format(dateWithSeconds, 'mm:ss');
}

const ResponseSources: React.FC<{
    response: any,
    handleTimestampClick: any,
    numberOfSources?: number
}> = ({ response, handleTimestampClick, numberOfSources }) => {
    // Function to filter timestamps
    const filterTimestamps = (timestamps: number[]) => {
        const clonedTimestamps = [...timestamps]; // Clone the array to avoid mutating the original
        clonedTimestamps.sort((a, b) => a - b); // Ensure the timestamps are in ascending order
        const filtered = [];
        let lastIncluded = null;

        for (const timestamp of clonedTimestamps) {
            if (lastIncluded === null || timestamp >= lastIncluded + 60) {
                filtered.push(timestamp);
                lastIncluded = timestamp;
            }
        }
        return filtered;
    };
    const dispatch: AppDispatch = useDispatch();
    const { usageCount } = useSelector((state: RootState) => state.persisted.user.value)
    const responseTimestamps = response?.sourceTimestamps;
    const filteredTimestamps = responseTimestamps ? filterTimestamps(responseTimestamps) : [];

    const middleResponseIndex = filteredTimestamps.length > 1 ? Math.floor(filteredTimestamps.length / 2) : 0;

    return (
        filteredTimestamps.length > 0 ?
            <div style={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "0.7rem",
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
            }}>
                <b>Source:</b>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        gap: "0.7rem",
                        flexDirection: "row",
                        width: "100%",
                        flexWrap: "wrap",
                    }}
                >
                    {numberOfSources ? (
                        <Button
                            icon={<PlayCircleOutlined />}
                            key={filteredTimestamps[middleResponseIndex]}
                            onClick={(e: any) => {
                                e.preventDefault()
                                e.stopPropagation()
                                dispatch(setUsageCount(usageCount! + 1))
                                handleTimestampClick({ docId: response.documentId, timestamp: filteredTimestamps[middleResponseIndex] })
                            }}
                            style={{
                                cursor: 'pointer',
                                background: '#c8e0fa',
                                padding: '0.2rem  0.5rem',
                                borderRadius: '0.2rem'
                            }}
                        >
                            {formatSeconds(filteredTimestamps[middleResponseIndex])}
                        </Button>
                    ) : filteredTimestamps.map((st: number) => (
                        <Button
                            icon={<PlayCircleOutlined />}
                            key={st}
                            onClick={(e: any) => {
                                e.preventDefault()
                                e.stopPropagation()
                                dispatch(setUsageCount(usageCount! + 1))
                                handleTimestampClick({ docId: response.documentId, timestamp: st })
                            }}
                            style={{
                                cursor: 'pointer',
                                background: '#c8e0fa',
                                padding: '0.2rem  0.5rem',
                                borderRadius: '0.2rem'
                            }}
                        >
                            {formatSeconds(st)}
                        </Button>
                    ))}
                </div>
            </div> : <div></div>
    )
}

export default ResponseSources;
