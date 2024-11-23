import { ForwardOutlined } from '@ant-design/icons';
import { BottomSheetType, setBottomSheetType } from '@redux/features/activeEntitiesSlice';
import { AppDispatch, RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import { AutoComplete, Button, Spin } from 'antd';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import apiService from '@utils/api/api-service';
import './SearchSetPlaybook.css'
import { Template } from '@models/template.model';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { PlaybookItem } from '@components/atoms/PlaybookItem';

const SearchSetPlaybook: React.FC<{ handleNextFunc?: () => {} }> = ({ handleNextFunc }) => {
    const [results, setResults] = useState<Template[]>([]);
    const { email, token } = useSelector((state: RootState) => state.persisted.user.value);
    const activePlaybookId = useSelector((state: RootState) => state.activeEntities.activePlaybookId);
    const dispatch: AppDispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');

    const { isLoading: isFetching } = useQuery({
        queryKey: ['getAllUserTemplates', email, token],
        queryFn: async ({ queryKey }) => {
            const response = await apiService.getAllUserTemplates(queryKey[1], queryKey[2]);
            setResults(response as Template[]);
        }
    })

    const handleNext = async () => {
        dispatch(setBottomSheetType(BottomSheetType.NOTE_ADD))
    }

    useEffect(() => {
        const filteredPlaybooks = (results as Template[]).filter((pbook: Template) => pbook.name.toLowerCase().includes(searchQuery.toLowerCase()))
        setResults(filteredPlaybooks)
    }, [searchQuery])

    const onSearch = (value: string) => {
        pushEvent('SimpleSearchInPlaybooksList', { searchQuery: value })
        setSearchQuery(value);
    };

    const handleDelete = async (pb: Template) => {
        toast.promise(
            apiService.deleteTemplate(pb._id!, token),
            {
                loading: '🗑️ Deleting Playbook...',
                success: <b>Playbook deleted!</b>,
                error: <b>Could not delete.</b>,
            }
        )
        pushEvent('DeletePlaybook', { playbook: pb })
        const filteredPlaybooks = (results as Template[]).filter((pbook: Template) => pbook._id !== pb._id)
        setResults(filteredPlaybooks)
    }
    return (
        <>
            {isFetching ? <Spin /> :
                <div style={{ marginBottom: '10rem' }}> {results?.length === 0 &&
                    <p>Search Playbook</p>}
                    {results?.length > 0
                        ?
                        isFetching
                            ? <Spin />
                            : <>
                                <AutoComplete
                                    style={{ width: '95%', marginBottom: 16 }}
                                    onSearch={onSearch}
                                    placeholder="Search playbooks"
                                    size="large"
                                />
                                <div className="playbooks-list">
                                    {results.map((item: Template, i: number) => (
                                        <PlaybookItem item={item} key={i} handleDelete={handleDelete} />
                                    ))}
                                </div>
                            </>
                        : <p> </p>
                    }
                </div>}
            {!handleNextFunc && <div className="bottomBar">
                <div style={{
                    width: '100%',
                    height: '10rem',
                    background: 'linear-gradient(180deg, transparent 0%, #fff 80%)',
                }} />
                <div className="bottomActionsWrapper">
                    <div className="bottomActionContainer" >
                        <Button
                            loading={isFetching}
                            disabled={!activePlaybookId}
                            icon={<ForwardOutlined />} key="search" type="primary" onClick={handleNext}
                        >
                            Next
                        </Button>
                        <br />
                    </div>
                </div>
            </div>}
        </>
    )
}

export default SearchSetPlaybook
