import ReactDOM from 'react-dom/client';
import './index.css';
import { persistor, store } from '../src/redux/store';
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from "react-redux";
import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './contexts/AuthContext';
import mixpanel from 'mixpanel-browser';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { Buffer } from 'buffer';
import {
  RouterProvider,
} from "react-router-dom";
import { router } from '@utils/routes';

// Create a client
const queryClient = new QueryClient()

// Backround scripts to motivate user to install PWA
// import reportWebVitals from './reportWebVitals';
// import { register } from './serviceWorkerRegistration';

global.Buffer = Buffer;

//? Setup up app analytics for using mixpanel
mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN!, { debug: true, track_pageview: true, persistence: 'localStorage' });


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <AuthProvider>
  <QueryClientProvider client={queryClient}>
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster />
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </QueryClientProvider>
  // </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
// register()