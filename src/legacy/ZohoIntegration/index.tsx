import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';

const ZohoIntegration = () => {
    const [modules, setModules] = useState(null);
    const [error, setError] = useState('');
    const user = useSelector((state: RootState) => state.persisted.user.value)

    // Function to initiate OAuth process
    const authenticateWithZoho = () => {
        // Redirect user to backend auth endpoint
        window.location.href = `${process.env.REACT_APP_BACKEND_API_BASE_URL}/zoho/auth`;
    };

    // Function to fetch modules from Zoho CRM
    const fetchModules = async () => {
        const tokenInfo = user.tokenInfo;
        if (!tokenInfo) return;
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}/zoho/modules`,
                { accessToken: tokenInfo.access_token }
            );
            setModules(response.data);
        } catch (error) {
            setError('Failed to fetch modules from Zoho CRM');
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    return (
        <div>
            {!modules
                ? (
                    <button onClick={authenticateWithZoho}>
                        Authenticate with Zoho
                    </button>
                )
                : error
                    ? (<div>Error: {error}</div>)
                    : (
                        <div>
                            <h2>Zoho CRM Modules</h2>
                            <pre>{JSON.stringify(modules, null, 2)}</pre>
                        </div>
                    )
            }
        </div>
    );
};

export default ZohoIntegration;
