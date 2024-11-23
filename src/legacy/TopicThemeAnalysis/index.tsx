import React, { useState } from 'react';
import { Button } from 'antd';
import apiService from '@utils/api/api-service';
import { Tooltip, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
import './TopicThemeAnalysis.css';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import toast from 'react-hot-toast';
import { pushEvent } from '@utils/analytics';

interface Theme {
  themeName: string;
  themeScore: number; // Ensure this is a number for the chart to render correctly
}

const TopicThemeAnalysis: React.FC<{ wordsString: string }> = ({ wordsString }) => {
  const [themes, setThemes] = useState<Theme[]>([]); // Corrected the type here
  const { token, email } = useSelector((state: RootState) => state.persisted.user.value);

  const fetchThemes = async () => {
    try {
      const toastId = toast.loading('Analyzing themes...');
      const response = await apiService.analyzeContentBlockTheme(wordsString, token);
      toast.success('Themes analyzed successfully', { id: toastId });
      pushEvent('AnalyzeTopicTheme', { email });
      setThemes(response.themes);
    } catch (error) {
      console.error('Error fetching theme analysis:', error);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={fetchThemes}>
        Get Theme Analysis
      </Button>
      <BarChart
        width={650}
        height={650}
        data={themes}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 120, // Increase the bottom margin to give more space for the labels
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="themeName" angle={-45} textAnchor="end" interval={0} height={70} /> {/* Increase height for XAxis to provide more space */}
        <YAxis label={{ value: 'Theme Score', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Bar label={
          {
            position: 'top',
            style: { fill: 'black' },
          }
        } dataKey="themeScore" fill="#8884d8" />
      </BarChart>

    </div>
  );
};

export default TopicThemeAnalysis;
