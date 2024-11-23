import { useState } from 'react';
import QrReader from 'react-qr-scanner';

const QRScanner = () => {
    const [result, setResult] = useState('No result');

    const handleScan = (data: any) => {
        setResult(data);
    };

    const handleError = (err: any) => {
        console.error(err);
    };

    const previewStyle = {
        height: 240,
        width: 320,
    };

    return (
        <div>
            <QrReader
                delay={100}
                style={previewStyle}
                onError={handleError}
                onScan={handleScan}
            />
            <p>{result}</p>
        </div>
    );
};

export default QRScanner;
