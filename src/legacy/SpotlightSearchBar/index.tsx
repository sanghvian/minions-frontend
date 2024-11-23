import { pushEvent } from '@utils/analytics';
import { uploadAudioForTranscription } from '@utils/transcribeAudio';
import { Input, Spin } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import './SpotlightSearchBar.css'
import AudioRecorder from '../../components/molecules/AudioRecorder';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { setActiveQueryString } from '@redux/features/activeEntitiesSlice';
import { SearchOutlined } from '@ant-design/icons';

interface ISpotlightSearchBar {
    inputRef: any;
    query: string;
    setQuery: Dispatch<SetStateAction<string>>;
}

const SpotlightSearchBar: React.FC<ISpotlightSearchBar> = ({ inputRef, query, setQuery }) => {
    // const recorderControls = useAudioRecorder()
    const activeQueryString = useSelector((state: RootState) => state.activeEntities.activeQueryString);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(setActiveQueryString(""))
        if (inputRef.current) {
            (inputRef.current as any).focus();
        }
    }, [dispatch, inputRef])

    const handleAudioUpload = async (file: any) => {
        setLoading(true);
        const startTime = new Date().getTime();
        const data: { text: string } = await uploadAudioForTranscription(file)
        const transcribedQuery: string = data.text;
        setQuery(transcribedQuery);
        setLoading(false);
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000; // duration in seconds
        pushEvent("SpotlightSearchByVoice", {
            // recordingDuration: recorderControls.recordingTime,
            responseTime: duration
        })
        // dispatch(setActiveQueryString(""));
    }

    return (
        <div className="spotlightSearchBar">
            {loading && <Spin />}
            <Input
                ref={inputRef}
                placeholder="Search for a contact, note, action, background work and education"
                value={query}
                defaultValue={activeQueryString}
                onChange={(e) => setQuery(e.target.value)}
                suffix={
                    <SearchOutlined
                        onClick={() => {
                            // console.log(inputRef)
                            setQuery((inputRef.current as any).value || "")
                        }}
                        style={{ cursor: 'pointer' }}
                    />
                }
            />
            <AudioRecorder handleAudioFile={handleAudioUpload} />
        </div>
    )
}

export default SpotlightSearchBar
