import { AppDispatch, RootState } from "../src/redux/store";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import CheckoutForm from "./components/organisms/CheckoutForm";
import { useEffect } from "react";
import { checkUserEligibility, getUserCurrentLocation } from "./utils/user";
// import { initializeFirebase } from './utils/firebase';
import { User, UserStatus } from "./models/user.model";
import { pushEvent, setupAnalytics } from "@utils/analytics";
import {
  setGeoLocation,
  setIsSentryInitialized,
  setShowSpotlightSearch,
} from "@redux/features/activeEntitiesSlice";
import BottomSheetComponent from "@components/templates/RootBottomSheet";
import { Outlet } from "react-router-dom";
import GoogleAuth2 from "@components/molecules/GoogleAuth2";
import RootModal from "@components/templates/RootModal";
import { setupSentry } from "@utils/sentrySetup";
import { useGesture } from "react-use-gesture";
import RootBottomDrawer from "@components/templates/RootBottomDrawer";

export default function App() {
  const user: User = useSelector(
    (state: RootState) => state.persisted.user.value
  );
  const dispatch: AppDispatch = useDispatch();
  // const isSentryInitialized = useSelector((state: RootState) => state.activeEntities.isSentryInitialized);
  // const showSpotlightSearch = useSelector((state: RootState) => state.activeEntities.showSpotlightSearch);

  const bind = useGesture({
    onPinchEnd: () => {
      // onDrag: () => {
      // if (my > 11 && !down) { // Threshold for pull-down gesture
      dispatch(setShowSpotlightSearch(true));
      // }
    },
  });

  useEffect(() => {
    // initializeFirebase();
    if (user?.token?.length > 0) {
      setupAnalytics(user);
      // if (!isSentryInitialized) {
      //   setupSentry();
      //   dispatch(setIsSentryInitialized(true));
      // }
    }

    // Sentry initialization and setup

    // Capturing utm_source from the URL and initializing the user with it
    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get("utm_source") || "direct"; // default to 'direct' if no source is provided
    pushEvent("AppInitialized", { utm_source });

    // Disable location utilizing feature for now
    // if (navigator.geolocation) {
    //   (async () => {
    //     const currentLocationString = await getUserCurrentLocation(navigator);
    //     dispatch(setGeoLocation(currentLocationString));
    //   })()
    // }

    //? Code for prompting user to install the app as PWA
    // window.addEventListener('beforeinstallprompt', (e) => {
    //   // e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
    //   pushEvent('UserPromptedToInstallApp');

    //   // You can save the event & show your custom UI
    //   (window as any).deferredPrompt = e; // Stash the event so it can be triggered later.

    //   // Update UI notify the user they can add to home screen
    //   // You might show a custom UI element here
    // });
  }, [
    user,
    dispatch,
    // isSentryInitialized
  ]);

  const userEligibility = checkUserEligibility(user);

  return (
    <>
      <main {...bind()}>
        {
          userEligibility === UserStatus.UNAUTHENTICATED ? (
            <GoogleAuth2 />
          ) : (
            <>
              {userEligibility === UserStatus.UNSUBSCRIBED && <CheckoutForm />}
              {/* {checkUserEligibility(user) && <p>Number of remaining free trials: {5 - user.numTries >= 0 ? 5 - user.numTries : 0}</p>}
                <br /> */}
              {userEligibility === UserStatus.SUBSCRIBED && <Outlet />}
              <br />
            </>
          )
          // <>
          //   <Outlet />
          //   <TabsBar />
          // </>
        }
      </main>
      <RootModal />
      <RootBottomDrawer />
      <BottomSheetComponent />
    </>
  );
}
