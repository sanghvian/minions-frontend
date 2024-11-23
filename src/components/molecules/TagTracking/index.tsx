import React, { useState } from 'react';
import { Button, Tag as TagC } from 'antd';
import apiService from '@utils/api/api-service';
import { Tooltip, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
import './TagTracking.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { useQuery } from 'react-query';
import { Tag } from '@models/tag.model';
import { ActiveModalType, setActiveContentBlockId, setActiveData, setIsModalOpen, setModalType } from '@redux/features/activeEntitiesSlice';
import toast from 'react-hot-toast';
import { EditOutlined } from '@ant-design/icons';
import { setTopicTags } from '@redux/features/topicSlice';

const TagTracking: React.FC<{ onTagSelect: (tag: any) => void }> = ({ onTagSelect }) => {
  const topic = useSelector((state: RootState) => state.topic.activeTopic);
  const { token, email } = useSelector((state: RootState) => state.persisted.user.value);
  const topicTags = topic.tags || [];
  // Iterate over all tags and create an array of objects with tagName and tagScore where for each tag, we iterate over the contentResponses and increase the score if the tag is present in the response
  const topicTagScores = topicTags.map((tag) => {
    const tagScore = topic.contentResponses?.reduce((acc, response) => {
      const responseTagIds = response.responseTags?.map((tag) => tag.tagId._id);
      // console.log('responseTagIds', responseTagIds)
      return acc + (responseTagIds?.includes(tag._id) ? 1 : 0);
    }, 0);
    return {
      tagName: tag.name,
      tagScore,
    };
  });
  const dispatch: AppDispatch = useDispatch();

  const handleAddTag = async () => {
    dispatch(setIsModalOpen(true));
    dispatch(setActiveContentBlockId(topic._id!))
    dispatch(setModalType(ActiveModalType.ADD_TAG));
    const updatedTags = await apiService.getTopicTags(email, topic._id!, token);
    dispatch(setTopicTags(updatedTags));
  }

  const handleEditTag = async (tag: Tag) => {
    dispatch(setIsModalOpen(true));
    dispatch(setActiveContentBlockId(topic._id!))
    dispatch(setModalType(ActiveModalType.EDIT_TAG));
    dispatch(setActiveData(tag));
    const updatedTags = await apiService.getTopicTags(email, topic._id!, token);
    dispatch(setTopicTags(updatedTags));
  }

  const handleAnalyzePatterns = async () => {
    const toastId = toast.loading('Analyzing patterns...');
    const contentResponses = topic.contentResponses || [];
    await Promise.all(contentResponses.map(async (response): Promise<void> => {
      await apiService.createSuggestedResponseTags(
        {
          responseId: response._id!,
          userId: email
        }, token
      );
    }
    ));
    const updatedTags = await apiService.getTopicTags(email, topic._id!, token);
    setTopicTags(updatedTags);
    toast.success('Patterns analyzed successfully', { id: toastId });
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'left',
            justifyContent: 'space-between',
          }}
        >
          <h3>Active Tags</h3>
          <div>
            {topicTags.map((tag) => (
              <TagC icon={<EditOutlined />} onClick={() => handleEditTag(tag)} key={tag._id}>
                {tag.name} - {tag.count}
              </TagC>
            ))}
          </div>
        </div>
        <div>
          <Button onClick={handleAddTag}>
            Add tag
          </Button> &nbsp; &nbsp;
          <Button
            onClick={handleAnalyzePatterns}
          >
            Analyze patterns
          </Button>
        </div>
        <br />
      </div>
      <div>
        <br />
        <BarChart
          width={650}
          height={650}
          data={topicTagScores}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 120, // Increase the bottom margin to give more space for the labels
          }}
          dataKey="tagScore"
          onClick={(data) => {
            // Find the tag object by tag name
            // console.log('data of tag clicked', data)
            const tag = topicTags.find(tag => tag.name === data.activeLabel);
            if (tag) {
              onTagSelect(tag);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tagName" angle={-45} textAnchor="end" interval={0} height={70} /> {/* Increase height for XAxis to provide more space */}
          <YAxis label={{ value: 'Tag Score', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar label={
            {
              position: 'top',
              style: { fill: 'black' },
            }
          } dataKey="tagScore" fill="#8884d8" />
        </BarChart>

      </div>
    </>
  );
};

export default TagTracking;
