import { AppDispatch, RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import './AIResponse.css'
import { Contact } from '@models/contact.model';
import { Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { setSearchAttemptId } from '@redux/features/activeEntitiesSlice';
import YCLoader from '../YCLoader';


const AIResponse: React.FC<{ requestQuery: string }> = ({ requestQuery }) => {
    const navigate = useNavigate()
    const { email, token, id } = useSelector((state: RootState) => state.persisted.user.value)
    const dispatch: AppDispatch = useDispatch();
    const { data, isLoading } = useQuery({
        queryKey: ["getRecommendedAnswer", requestQuery, id, email, token],
        queryFn: async ({ queryKey }) => {
            if (!queryKey[1]) return null;
            const startTime = new Date().getTime();
            const response = await apiService
                .recommendInUserNetwork(
                    ({
                        query: queryKey[1],
                        userUUID: queryKey[2]!,
                        userId: queryKey[3]!,
                        accessToken: queryKey[4]!,
                    })
                )
            const endTime = new Date().getTime();
            pushEvent('AISearchBotResponded',
                {
                    requestQuery,
                    responseTime: (endTime - startTime) / 1000,
                    numContacts: response?.answer
                })

            // In AI search, searchAttemptId is only set after the bot responds in chat and not when we get the 1st list from search results. The, we use searchAttemptId as a unique indicator that the bot has responded and scroll to the bottom of the chat thread.
            dispatch(setSearchAttemptId(response.searchAttemptId))
            toast.success(`Bot has responded!`)
            return response
        },
    });
    const activeQueryString = useSelector((state: RootState) => state.activeEntities.activeQueryString);
    useEffect(() => { }, [activeQueryString])

    const recommendedAnswer = data?.answer;
    const mostRecommendedContacts: Contact[] = data?.mostRecommendedContacts;


    return (
        isLoading ? <p
            className="fromThem">
            <YCLoader />
        </p> :
            <>
                {recommendedAnswer?.length > 0 && <p className='messageBubble fromBot'>
                    {recommendedAnswer}

                    {mostRecommendedContacts?.length > 0 &&
                        <div className='recommendedContactsContainer'>
                            {mostRecommendedContacts.map((c: Contact) =>
                                <div
                                    onClick={() => navigate(`/contacts/${c.id}`)}
                                    className='contactChip'>
                                    {/* {c.imgUrl
                                        ? <Avatar size="small" className='chipImage' src={c.imgUrl} />
                                        : <Avatar size={10} style={{ color: '#fff' }} className='chipImage'>{c.name?.charAt(0).toUpperCase()}</Avatar>
                                    } */}
                                    <Avatar size="small" className='chipImage'>{c.name?.charAt(0).toUpperCase()}</Avatar>
                                    <span>{c.name}</span>
                                </div>
                            )}
                            <div className='gradient'></div>
                        </div>}
                </p>}
            </>
    )
}

export default AIResponse
