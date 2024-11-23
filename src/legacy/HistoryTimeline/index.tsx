import { History, HistoryType } from '@models/history.model'
import { formatDate } from '@utils/commonFuncs'
import { Timeline, Typography } from 'antd'
import React from 'react'


const groupHistoriesByOrganization = (histories: History[]): Map<string, History[]> => {
    const groups = new Map<string, History[]>();
    histories?.forEach(history => {
        if (history.organization_name) {
            if (!groups.has(history.organization_name)) {
                groups.set(history.organization_name, []);
            }
            groups.get(history.organization_name)?.push(history);
        }
    });
    return groups;
}

const HistoryTimeline: React.FC<{ histories: History[] }> = ({ histories }) => {
    const groupedHistories = groupHistoriesByOrganization(histories);

    return (
        <Timeline>
            {[...groupedHistories].map(([organizationName, histories]) => (
                <React.Fragment key={organizationName}>
                    <Timeline.Item>
                        {histories[0]?.organization_url
                            ?
                            <a href={histories[0]?.organization_url}>
                                {organizationName}
                            </a>
                            :
                            <p>
                                {organizationName}
                            </p>}
                        {histories.map((history: History, index: number) => (
                            <div key={history.id}>
                                {index > 0 && <hr />} {/* Add a horizontal line between different roles */}
                                {history.occupation}

                                <Typography.Text strong>
                                    {history.startDate && <span> {"- ("} {formatDate(history.startDate)}</span>}
                                    {/* Because in linkedin, education histories always have an endDate and not something like "Present" */}
                                    {history.endDate
                                        ? <span>-{formatDate(history.endDate)} {`)`}</span>
                                        : history.historyType === HistoryType.WORK && <span>-{formatDate(history?.endDate || "Present")} {`)`}</span>}
                                </Typography.Text>
                                {history.info.length > 0 && history.info.map((info, infoIndex) => (
                                    <p key={infoIndex}>{info}</p> // Add a key for each info paragraph
                                ))}
                            </div>
                        ))}
                    </Timeline.Item>
                </React.Fragment>
            ))}
        </Timeline>
    )
}

export default HistoryTimeline
