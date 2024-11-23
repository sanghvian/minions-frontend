import { setUser } from '@redux/features/userSlice';
import { AppDispatch, RootState } from '@redux/store';
import apiService from '@utils/api/api-service';
import { Button } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}


const MiroIntegrationDashboard = () => {
    const user = useSelector((state: RootState) => state.persisted.user.value);
    const query = useQuery();
    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
        (async () => {
            if (!user.miroAccessToken) {
                const code = query.get('code');
                if (code) {
                    const toastId = toast.loading(`Connecting to your Miro account...`);
                    const res = await apiService.getMiroAccessToken({ code });
                    const updatedUser = await apiService.updateUser(user.email, user.id!, {
                        miroAccessToken: res.accessToken
                    }, user.token);
                    dispatch(setUser({ ...updatedUser, miroAccessToken: res.accessToken }))
                    toast.success('Miro Account connected successfully', { id: toastId });
                }
            }
        })()

    }, [query]);

    return (
        <div>
            <h2>Miro Integration</h2>
            <br />
            {(user.miroAccessToken) ? (
                <>
                    <p>Connected to Miro✅</p>
                    <Button
                        onClick={async () => {
                            const toastId = toast.loading(`Clearing Miro connection...`);
                            const updatedUser = await apiService.updateUser(user.email, user.id!, {
                                miroAccessToken: ''
                            }, user.token);
                            dispatch(setUser({ ...updatedUser, miroAccessToken: '' }))
                            toast.success('Miro connection cleared successfully', { id: toastId });
                        }}
                    >Clear Miro Connection</Button>
                </>
            ) : (
                <Button
                    href={`https://miro.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_MIRO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_DOMAIN}/integrations/miro-integration`}
                // href={`https://miro.com/oauth/authorize?response_type=code&client_id=3458764583427326898&redirect_uri=${process.env.REACT_APP_DOMAIN}/integrations/miro-integration`}
                >
                    Connect to Miro
                </Button>
            )}
        </div>
    );
}

export default MiroIntegrationDashboard