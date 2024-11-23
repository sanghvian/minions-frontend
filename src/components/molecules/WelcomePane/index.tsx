import apiService from '@utils/api/api-service';
import React, { useState } from 'react'
import { useQuery } from 'react-query';
import { Tooltip, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { Button, Spin } from 'antd';
import { CompleteContentResponse } from '@models/contentResponse.model';
import toast from 'react-hot-toast';
import RecentConversationsList from '../RecentConversationsList';

const WelcomePane = () => {
    const { email, token, name } = useSelector((state: RootState) => state.persisted.user.value);
    const [hasFetchedThemes, setHasFetchedThemes] = React.useState(false);
    const [themes, setThemes] = useState<{ themeName: string, themeValue: number }[]>([]); // Corrected the type here
    const [doFetchThemes, setDoFetchThemes] = useState<boolean>(false);


    const { isLoading: isLoadingThemeData } = useQuery({
        queryKey: ["getRandomCompleteContentBlockWithResponses", email, token],
        queryFn: async ({ queryKey }) => {
            if (!doFetchThemes) return null;
            if (!queryKey[1]) return null;
            if (themes.length > 0) return;
            const toastId = toast.loading('Loading...');
            const topic = await apiService.getRandomContentBlockForUser(queryKey[1], queryKey[2]!)
            const topicResponsesString = topic?.contentResponses?.map((response: CompleteContentResponse) => response.answerText).join(" ") || ""
            const response = await apiService.analyzeContentBlockTheme(topicResponsesString, token);
            toast.success('Ready!', { id: toastId });
            setThemes(response.themes);
            setHasFetchedThemes(true);
        },
        enabled: !hasFetchedThemes && doFetchThemes
    })


    const firstName = name?.split(" ")[0] || "there";

    return (
        isLoadingThemeData ? <Spin /> :
            <div style={{ width: "100%" }}>
                <h1 style={{ textAlign: "left" }} >Hey {firstName}! 👋</h1>
                <h3 style={{ textAlign: "left" }} >Here's what your customers are saying today</h3>
                {/* <Button onClick={() => setDoFetchThemes(true)}>Fetch Themes</Button> */}
                {/* Ant design row that splits the screen into 2 equal parts */}
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                    gap: "2rem",
                    width: "100%"
                }}>
                    {/* <div>
                        <BarChart
                            width={600}
                            height={600}
                            data={themes}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 120, 
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="themeName" angle={-45} textAnchor="end" interval={0} height={70} /> 
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
                    </div> */}
                    <RecentConversationsList />
                </div>
            </div>
    )
}

export default WelcomePane
