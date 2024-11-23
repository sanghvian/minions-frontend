import { ForwardFilled } from '@ant-design/icons';
import {
    BottomSheetType,
    SearchType,
    setActiveQueryString,
    setBottomSheetType,
    setIsBottomSheetOpen,
    setSearchType
} from '@redux/features/activeEntitiesSlice';
import { AppDispatch } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import { Button } from 'antd';
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useDispatch } from 'react-redux';

const QRScanner2 = () => {
    const [data, setData] = useState('');
    const dispatch: AppDispatch = useDispatch();

    return (
        <>
            <QrReader
                onResult={(result: any, error: any) => {
                    if (!!result) {
                        setData(result?.text);
                    }

                    if (!!error) {
                        console.info(error);
                    }
                }}
                constraints={{ facingMode: "environment" }}
            />
            <p style={{ color: 'blue' }} onClick={() => {
                // So on clicking this, ideally we should be able to do the same flow that we do when audio recording is stopped and we want to search with the transcript
                // The data string has "?fromQR=1" at the end of it, just remove it
                const trimmedData = data.replace(/\?fromQR=1/g, '');
                dispatch(setActiveQueryString(trimmedData));
                dispatch(setIsBottomSheetOpen(true));
                dispatch(setBottomSheetType(BottomSheetType.SEARCH_ADD));
                dispatch(setSearchType(SearchType.EXTERNAL));
                pushEvent('AddNoteToContactByQRScan', { noteText: data })
            }
            }>
                <Button
                    disabled={!data}
                    color={!data ? 'grey' : 'blue'}
                    type="primary"
                    icon={<ForwardFilled />}
                >Proceed</Button>
            </p>
        </>
    );
};


export default QRScanner2;