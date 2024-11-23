import { AppDispatch, RootState } from '@redux/store';
import apiService from '@utils/api/api-service';
import { Spin, Tooltip } from 'antd';
import React, { useEffect } from 'react'
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import './TopicDashboard.css'
import { ActiveModalType, ActiveRouteKey, setIsModalOpen, setModalType } from '@redux/features/activeEntitiesSlice';
import { Tabs } from 'antd'
import TopicResponseCards from '@components/molecules/TopicResponseCards';
import TagTracking from '@components/molecules/TagTracking';
import { setActiveTopic, setTopicTags } from '@redux/features/topicSlice';

const { TabPane } = Tabs;

const TopicDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const topicId = location.pathname.split("/")[2];
    const isSomeoneQueryingTopicForTrends = location.pathname.includes("trend");
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value)
    const [selectedTag, setSelectedTag] = React.useState(null);
    const dispatch: AppDispatch = useDispatch();
    const topic = useSelector((state: RootState) => state.topic.activeTopic);
    const { isLoading } = useQuery({
        queryKey: ["getCompleteContentBlockWithResponses", topicId, email, token],
        queryFn: async ({ queryKey }) => {
            if (!queryKey[1]) return null;
            const topic = await apiService.getCompleteContentBlockWithResponses(queryKey[1], queryKey[2]!, queryKey[3]!)

            const topicTags = await apiService.getTopicTags(email, topic._id!, token);
            dispatch(setActiveTopic(topic))
            dispatch(setTopicTags(topicTags));
        },
    })
    const [activeTabKey, setActiveTabKey] = React.useState(isSomeoneQueryingTopicForTrends ? "2" : "1");
    const handleTagSelect = (tag: any) => {
        setSelectedTag(tag);
        setActiveTabKey("1");
    };


    return (
        <div
            style={{
                padding: '2rem',
                width: '100%',
            }}
        >
            {isLoading
                ? <Spin />
                : topic ? <>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            textAlign: 'left'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            textAlign: 'left'
                        }} >
                            <h2>{topic.blockTitle}</h2>
                            <p>{topic.description}</p>
                        </div>
                        <Tooltip title={topic.templateId.description}>
                            <div
                                onClick={() =>
                                    navigate(`/${ActiveRouteKey.PLAYBOOKS}/${topic.templateId._id}`)
                                }
                                className='topicDashboard'
                            >
                                <h3>Related Guide: {topic.templateId.name} ➡️ </h3>
                            </div>
                        </Tooltip>
                    </div>
                    <br /><br /><br /><br />
                    <Tabs activeKey={activeTabKey} onChange={setActiveTabKey} style={{ margin: '0 24px' }}>
                        <TabPane tab="Quotes" key="1">
                            <TopicResponseCards selectedTag={selectedTag} onTagSelect={handleTagSelect} />
                        </TabPane>
                        {/* <TabPane tab="Wordcloud" key="2">
                            <TopicWordCloud wordsString={topicResponsesString} />
                        </TabPane> */}
                        {/* <TabPane tab="Understand patterns" key="2">
                            <TopicThemeAnalysis wordsString={topicResponsesString} />
                        </TabPane> */}
                        <TabPane tab="Trends" key="2">
                            <TagTracking onTagSelect={handleTagSelect} />
                        </TabPane>
                    </Tabs>
                </> : <p>If the topic doesn't appear on screen in 5more seconds - Error finding topic. Please report this topic ID {topicId} to ankit@recontact.world</p>
            }
        </div >
    )
}

export default TopicDashboard