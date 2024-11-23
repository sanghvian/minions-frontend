// import AISearchResultsList from '@components/molecules/AISearchResultsList';
// import './SearchInNetworkPage.css'
// import { pushEvent } from '@utils/analytics';
// import ChatBar from '@components/molecules/ChatBar';
// import { RecordType } from '@models/index';
// import AIResponse from '@components/atoms/AIResponse';
// import React, { useEffect, useRef, useState } from 'react'; // ensure to create this SCSS file with styles
// import { AppDispatch, RootState } from '@redux/store';
// import { useDispatch, useSelector } from 'react-redux';
// import { ActiveRouteKey, setActiveQueryString, setActiveRouteKey } from '@redux/features/activeEntitiesSlice';
// import { FloatButton } from 'antd';
// import { MessageOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';

// const SearchInNetworkPage: React.FC = () => {
//     const [requestQuery, setRequestQuery] = useState<string>("");
//     const { name } = useSelector((state: RootState) => state.persisted.user.value);
//     const navigate = useNavigate();
//     const activeQueryString = useSelector((state: RootState) => state.activeEntities.activeQueryString);
//     const dispatch: AppDispatch = useDispatch();
//     useEffect(() => {
//         pushEvent('UserPageView', { pageName: 'SearchNetworkPage' })
//         dispatch(setActiveRouteKey(ActiveRouteKey.SEARCH))
//     }, [activeQueryString, dispatch])

//     const handleSearch = async (requestQuery: string) => {
//         dispatch(setActiveQueryString(requestQuery));
//         setRequestQuery(requestQuery);
//     }
//     const searchAttemptId = useSelector((state: RootState) => state.activeEntities.searchAttemptId);
//     const aiResponseRef = useRef<HTMLDivElement>(null);


//     useEffect(() => {
//         if (aiResponseRef.current) {
//             aiResponseRef.current.scrollIntoView({ behavior: "smooth" });
//         }
//     }, [searchAttemptId]);
//     return (
//         <>
//             <div className='searchInNetContainer'>
//                 {!activeQueryString && <p style={{ color: 'white', fontSize: '0.9rem' }}>Need to find the right contacts? Just ask with voice or text! Say 'Find me contacts in the finance industry located in New York,' 'Who can I speak to about jobs in marketing,' or 'I'm building a team of software engineers, who could be a good fit?' Our AI search digs deep into your connections to find exactly who you need!</p>}
//                 <div className='messagesContainer'>
//                     {activeQueryString &&
//                         <p
//                             className='messageBubble fromMe'
//                         >
//                             {name}: {activeQueryString}
//                         </p>
//                     }
//                     <AISearchResultsList requestQuery={requestQuery} />
//                     <AIResponse requestQuery={requestQuery} />

//                     <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
//                     <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
//                     <div ref={aiResponseRef} ></div>

//                 </div>
//             </div>
//             <FloatButton
//                 icon={<MessageOutlined />}
//                 type="default" style={{ right: 24, bottom: 180 }}
//                 onClick={() => {
//                     pushEvent('SwitchedToAIChat')
//                     navigate(`/${ActiveRouteKey.SEARCH2}`)
//                 }}
//             />
//             <ChatBar
//                 handleUpload={handleSearch}
//                 action={"SearchContactInNetwork"}
//             // actionEntityType={RecordType.CONTACT}
//             />
//         </>
//     );
// };

// export default SearchInNetworkPage;

export default {}