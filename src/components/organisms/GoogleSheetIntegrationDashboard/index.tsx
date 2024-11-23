import { ActiveModalType, setIsModalOpen, setModalType } from '@redux/features/activeEntitiesSlice';
import { setUser, setUserToken } from '@redux/features/userSlice';
import { AppDispatch, RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { gapi } from 'gapi-script';
import { useEffect } from 'react';




const GoogleSheetIntegrationDashboard = () => {
    const CLIENT_ID = process.env.REACT_APP_GCP_CLIENT_ID;
    const API_KEY = process.env.REACT_APP_GCP_API_KEY;
    // Updated SCOPES to include Google Sheets and Google Drive
    const SCOPES = 'openid email profile'
    useEffect(() => {
        function start() {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                // discoveryDocs: DISCOVERY_DOC,
                scope: SCOPES,
            });
        }
        gapi.load('client:auth2', start);
    }, [API_KEY, CLIENT_ID, SCOPES]);


    const user = useSelector((state: RootState) => state.persisted.user.value);
    const dispatch: AppDispatch = useDispatch();


    const requestAdditionalScopes = async () => {
        const newScopes = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive';
        try {
            const authInstance = gapi.auth2.getAuthInstance();
            const user = await authInstance.signIn({
                scope: newScopes,
                prompt: 'consent'
            });
            const authResponse = await user.getAuthResponse(true);
            const updatedTokens = {
                access_token: authResponse.access_token,
                id_token: authResponse.id_token,
                refresh_token: authResponse.refresh_token,
                expires_in: authResponse.expires_in,
                scope: authResponse.scope,
            };
            // console.log({ updatedTokens })
            // Update user's tokens in your application state/store
            dispatch(setUserToken(updatedTokens.access_token));
            return updatedTokens;
        } catch (error) {
            console.error('Failed to request additional scopes', error);
            throw error;
        }
    };
    const clearSpreadsheetId = () => {
        // Assuming you have a way to update the user state to remove the spreadsheet ID
        // Update the user object or specific state slice as needed
        const updatedUser = { ...user, spreadsheetId: '' }; // Remove the spreadsheetId
        dispatch(setUser(updatedUser)); // Update user in Redux store
    };

    return (
        <div>
            <h2>Google Sheet Integration</h2>
            {user.spreadsheetId ? (
                <>
                    <a href={`https://docs.google.com/spreadsheets/d/${user.spreadsheetId}`} target="_blank" rel="noopener noreferrer" className="spreadsheet-link">
                        Open Spreadsheet
                    </a>
                    <Button onClick={clearSpreadsheetId} className="clear-spreadsheet-button">
                        Clear Spreadsheet
                    </Button>
                </>
            ) : (
                <Button
                    onClick={() => {
                        try {
                            requestAdditionalScopes();
                            dispatch(setIsModalOpen(true));
                            dispatch(setModalType(ActiveModalType.SET_SPREADSHEET));
                            pushEvent('StartConnectGoogleSheet', { email: user.email });
                        } catch (error) {
                            console.error('Failed to request additional scopes', error);
                            // Handle error as needed
                        }

                    }}
                    className="connect-sheet-button"
                >
                    Connect Google Sheet
                </Button>
            )}
        </div>
    )
}

export default GoogleSheetIntegrationDashboard
