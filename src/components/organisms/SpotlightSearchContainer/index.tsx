import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import AISearchContactsList from '@components/molecules/AISearchResultsList';
import useDebounce from '@hooks/useDebounce';
import { setActiveQueryString, setShowSpotlightSearch } from '@redux/features/activeEntitiesSlice';
import { AppDispatch, RootState } from '@redux/store';
import { FloatButton } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSpring, animated } from 'react-spring';
import './SpotlightSearchContainer.css'
import SpotlightSearchBar from 'src/legacy/SpotlightSearchBar';

const SpotlightSearchContainer: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const dispatch: AppDispatch = useDispatch();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const showSpotlightSearch = useSelector((state: RootState) => state.activeEntities.showSpotlightSearch);

    useEffect(() => {
        return () => {
            dispatch(setActiveQueryString(""))
        }
    })

    useDebounce(() => {
        if (inputRef.current) {
            dispatch(setActiveQueryString(searchQuery));
            (inputRef.current as any).focus();
        }
        // eslint-disable-next-line
    }, 1000, [searchQuery])

    const searchAnimation = useSpring({
        transform: showSpotlightSearch ? 'translateY(0)' : 'translateY(-100%)',
        opacity: showSpotlightSearch ? 1 : 0,
    });

    return (
        <animated.div style={searchAnimation} className="spotlightSearchContainer">
            <SpotlightSearchBar
                inputRef={inputRef}
                query={searchQuery}
                setQuery={setSearchQuery}
            />
            <div
                style={{
                    width: '94%',
                    position: 'relative',
                    top: '80px',
                    overflowY: 'scroll',
                    height: '700px',
                    padding: '0 1rem'
                }}
            >
                <AISearchContactsList requestQuery={searchQuery} />
            </div>
            <FloatButton
                icon={<CloseOutlined />}
                type="default" style={{ right: 24, bottom: 55 }}
                onClick={() => {
                    dispatch(setShowSpotlightSearch(false));
                    setSearchQuery('')
                    dispatch(setActiveQueryString(''))
                }}
            />
            <FloatButton
                icon={<SearchOutlined />}
                type="default" style={{ right: 84, bottom: 55 }}
                onClick={() => {
                    if (inputRef.current) {
                        dispatch(setActiveQueryString(searchQuery));
                        (inputRef.current as any).focus();
                    }
                }}
            />
        </animated.div>
    )
}

export default SpotlightSearchContainer
