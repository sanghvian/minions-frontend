import { AppDispatch, RootState } from '@redux/store';
import apiService from '@utils/api/api-service';
import { Button, Spin, Tabs, Tag } from 'antd';
import { useEffect } from 'react'
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ActiveModalType, ActiveRouteKey, setActiveQueryString, setActiveRouteKey, setIsModalOpen, setModalType } from '@redux/features/activeEntitiesSlice';
import { pushEvent } from '@utils/analytics';
import { initialPlaybookState, setActivePlaybook } from '@redux/features/playbookSlice';
import { CompleteTemplate } from '@models/template.model';
import { ContentBlock } from '@models/contentBlock.model';
import './PlaybookDashboard.css';
import { ArrowRightOutlined } from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
import GuideDocuments from '../GuideDocuments';
import { useNavigate } from "react-router-dom";

import { setUsageCount } from '@redux/features/userSlice';

const PlaybookDashboard = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const templateId = location.pathname.split("/")[2];
    const { email, token, usageCount } = useSelector((state: RootState) => state.persisted.user.value)
    const dispatch: AppDispatch = useDispatch();
    const { isLoading } = useQuery({
        queryKey: ["getCompletePlaybook", templateId, email, token],
        queryFn: async ({ queryKey }) => {
            if (!queryKey[1]) return null;
            const response = await apiService.getFullTemplate(queryKey[1], queryKey[2]!, queryKey[3]!)
            // console.log(response);
            dispatch(setActivePlaybook(response as CompleteTemplate));
        },
    })
    const playbook = useSelector((state: RootState) => state.playbook.activePlaybook);

    useEffect(() => {
        pushEvent('UserPageView', { pageName: 'IndividualPlaybookPage' });
        dispatch(setActiveRouteKey(ActiveRouteKey.PLAYBOOKS))
        return () => {
            setActivePlaybook(initialPlaybookState.activePlaybook)
        }
    }, [dispatch]);

    const handleEditClick = () => {
        dispatch(setActiveQueryString(''))
        dispatch(setIsModalOpen(true))
        dispatch(setActivePlaybook(playbook))
        dispatch(setModalType(ActiveModalType.PLAYBOOK_ADD))
    }
    return (
        isLoading
            ? <Spin />
            :
            <div className='playbookDashboard'>
                <h1
                    style={{ marginBottom: 0 }}
                >
                    {playbook.name}
                </h1>
                <div>
                    {/* <Button
                        type="primary"
                        style={{ marginBottom: '1rem' }}
                        onClick={() => {
                            dispatch(setActivePlaybookId(playbook._id!))
                            toast.success('Playbook set as active')
                        }}>
                        Set Active
                    </Button> */}
                    <Button
                        type="default"
                        style={{ margin: '1rem' }}
                        onClick={handleEditClick}
                    >
                        Edit
                    </Button>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <h4 style={{
                        fontStyle: 'italic', margin: "1rem 0",
                        width: '70%', textAlign: 'center'
                    }}>{playbook.description}</h4>
                </div>
                <Tabs defaultActiveKey="1" style={{ margin: "0 24px" }}>
                    <TabPane tab="Call Extracts" key="1">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            {playbook.contentBlocks?.map((block: ContentBlock, index: number) => {
                                return (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            textAlign: 'left',
                                            width: "50%"
                                        }}
                                        key={index} className='playbookBlock'>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                width: '100%',
                                                textAlign: 'left'
                                            }}
                                        >
                                            <h3>{block.blockTitle}</h3>
                                            <Button
                                                onClick={() => {
                                                    dispatch(setUsageCount(usageCount! + 1))
                                                    navigate(`/${ActiveRouteKey.TOPICS}/${block._id}`)
                                                }
                                                }
                                                icon={<ArrowRightOutlined />
                                                } >
                                                View Topics
                                            </Button>
                                        </div>
                                        <p
                                            style={{
                                                width: '100%',
                                                textAlign: 'left',

                                            }}
                                        >{block.description}</p>
                                        {block?.optionIds && block?.optionIds.length > 0 &&
                                            <>
                                                <span>Options: </span>{block.optionIds?.map((option, index) => (
                                                    <Tag color="blue" style={{ marginRight: '0.5rem' }} key={index}>{option.optionText}</Tag>
                                                ))}
                                            </>
                                        }
                                        <br /><br /><br />
                                    </div>
                                )
                            })}
                        </div>
                    </TabPane>
                    <TabPane tab="Documents" key="2">
                        <GuideDocuments />
                    </TabPane>
                </Tabs>
            </div>

    )
}

export default PlaybookDashboard;
