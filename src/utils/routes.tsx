import { createBrowserRouter } from "react-router-dom";
import App from '../App';
import ErrorPage from "@components/pages/ErrorPage";
import AccountPage from "@components/pages/AccountPage";
import ContactPage from "@components/pages/ContactPage";
import ActionPage from "@components/pages/PlaybookPage";
import { ActiveRouteKey } from "@redux/features/activeEntitiesSlice";
import HomePage from "@components/pages/HomePage";
import GroupsListPage from "@components/pages/GroupsListPage";
import * as Sentry from "@sentry/react";
import PlaybookPage from "@components/pages/PlaybookPage";
import PlaybooksListPage from "@components/pages/PlaybooksListPage";
import UploadsPage from "@components/pages/UploadsPage";
import AISearchPage from "@components/pages/AISearchPage";
import AuthSuccessPage from "@components/pages/AuthSuccessPage";
import TopicsPage from "@components/pages/TopicsPage";
import IndividualTopicPage from "@components/pages/IndividualTopicPage";
import ContactsPage from "@components/pages/ContactsPage";
import IndividualGroupPage from "@components/pages/IndividualGroupPage";
import AllDocumentsPage from "@components/pages/AllDocumentsPage";
import DocumentPage from "@components/pages/DocumentPage";
import IntegrationsPage from "@components/pages/IntegrationsListPage";
import GoogleSheetIntegrationPage from "@components/pages/GoogleSheetIntegrationPage/index.tsx";
import FirefliesIntegrationPage from "@components/organisms/FirefliesIntegrationPage";
import NotionIntegrationPage from "@components/pages/NotionIntegrationPage";
import GoogleDriveIntegrationPage from "@components/pages/GoogleDriveIntegrationPage/index.tsx";
import MiroIntegrationPage from "@components/pages/MiroIntegrationPage";
import ChatInNetworkPage from "src/legacy/ChatInNetworkPage";
import CallsPage from "@components/pages/CallsPage";
import AgentsPage from "@components/pages/AgentsPage";
import IndividualAgentPage from "@components/pages/IndividualAgentPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: (
      <Sentry.ErrorBoundary>
        {/* Checkout https://docs.sentry.io/platforms/javascript/guides/react/features/error-boundary/ for more info on handling this */}
        <ErrorPage />
      </Sentry.ErrorBoundary>
    ),
    children: [
      // {
      //     path: "mic",
      //     element: <AudioRecordPage />,
      // },
      {
        path: "",
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", ActiveRouteKey.HOME);
            }}
          >
            <CallsPage />
          </Sentry.ErrorBoundary>
        ),
      },
      {
        path: ActiveRouteKey.MEETINGS,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", ActiveRouteKey.MEETINGS);
            }}
          >
            <HomePage />
          </Sentry.ErrorBoundary>
        ),
      },
      {
        path: `${ActiveRouteKey.CONTACTS}/:id`,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", `${ActiveRouteKey.CONTACTS}/:id`);
            }}
          >
            <ContactPage />
          </Sentry.ErrorBoundary>
        ),
      },
      {
        path: `${ActiveRouteKey.CALLS}`,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", `${ActiveRouteKey.CALLS}`);
            }}
          >
            <CallsPage />
          </Sentry.ErrorBoundary>
        ),
      },
      {
        path: `${ActiveRouteKey.AGENTS}`,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", `${ActiveRouteKey.AGENTS}`);
            }}
          >
            <AgentsPage />
          </Sentry.ErrorBoundary>
        ),
      },
      {
        path: `${ActiveRouteKey.AGENTS}/:id`,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", `${ActiveRouteKey.AGENTS}/:id`);
            }}
          >
            <IndividualAgentPage />
          </Sentry.ErrorBoundary>
        ),
      },
      // {
      //   path: `${ActiveRouteKey.GROUPS}/:id`,
      //   element: (
      //     <Sentry.ErrorBoundary
      //       beforeCapture={(scope) => {
      //         scope.setTag("route", `${ActiveRouteKey.GROUPS}/:id`);
      //       }}
      //     >
      //       <IndividualGroupPage />
      //     </Sentry.ErrorBoundary>
      //   ),
      // },
      {
        path: ActiveRouteKey.CONTACTS,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", ActiveRouteKey.CONTACTS);
            }}
          >
            <ContactsPage />
          </Sentry.ErrorBoundary>
        ),
      },
      {
        path: ActiveRouteKey.ACCOUNT,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", ActiveRouteKey.ACCOUNT);
            }}
          >
            <AccountPage />
          </Sentry.ErrorBoundary>
        ),
      },
      // {
      //   path: ActiveRouteKey.GROUPS,
      //   element: (
      //     <Sentry.ErrorBoundary
      //       beforeCapture={(scope) => {
      //         scope.setTag("route", ActiveRouteKey.GROUPS);
      //       }}
      //     >
      //       <GroupsListPage />
      //     </Sentry.ErrorBoundary>
      //   ),
      // },
      {
        path: ActiveRouteKey.SEARCH,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", ActiveRouteKey.SEARCH);
            }}
          >
            <AISearchPage />
          </Sentry.ErrorBoundary>
        ),
      },
      // {
      //     path: ActiveRouteKey.SEARCH2,
      //     element: <Sentry.ErrorBoundary
      //         beforeCapture={(scope) => {
      //             scope.setTag("route", ActiveRouteKey.SEARCH2);
      //         }}
      //     >
      //         <ChatInNetworkPage />
      //     </Sentry.ErrorBoundary>,
      // },
      // {
      //   path: ActiveRouteKey.ACTIONS,
      //   element: (
      //     <Sentry.ErrorBoundary
      //       beforeCapture={(scope) => {
      //         scope.setTag("route", ActiveRouteKey.ACTIONS);
      //       }}
      //     >
      //       <ActionPage />
      //     </Sentry.ErrorBoundary>
      //   ),
      // },
      // {
      //   path: ActiveRouteKey.AUTH_SUCCESS,
      //   element: (
      //     <Sentry.ErrorBoundary
      //       beforeCapture={(scope) => {
      //         scope.setTag("route", ActiveRouteKey.AUTH_SUCCESS);
      //       }}
      //     >
      //       <AuthSuccessPage />
      //     </Sentry.ErrorBoundary>
      //   ),
      // },
      {
        path: ActiveRouteKey.PLAYBOOKS,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", ActiveRouteKey.PLAYBOOKS);
            }}
          >
            <PlaybooksListPage />
          </Sentry.ErrorBoundary>
        ),
      },
      {
        path: ActiveRouteKey.PLAYBOOKS,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", ActiveRouteKey.PLAYBOOKS);
            }}
          >
            <PlaybooksListPage />
          </Sentry.ErrorBoundary>
        ),
      },
      {
        path: ActiveRouteKey.TOPICS,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", ActiveRouteKey.TOPICS);
            }}
          >
            <TopicsPage />
          </Sentry.ErrorBoundary>
        ),
      },
      {
        path: `${ActiveRouteKey.TOPICS}/:id`,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", `${ActiveRouteKey.TOPICS}/:id`);
            }}
          >
            <IndividualTopicPage />
          </Sentry.ErrorBoundary>
        ),
      },
      {

        path: `${ActiveRouteKey.TOPICS}/:id/trend`,

        element: (

          <Sentry.ErrorBoundary

            beforeCapture={(scope) => {

              scope.setTag("route", `${ActiveRouteKey.TOPICS}/:id/trend`);

            }}

          >

            <IndividualTopicPage />

          </Sentry.ErrorBoundary>

        ),

      },
      {
        path: `${ActiveRouteKey.PLAYBOOKS}/:id`,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", `${ActiveRouteKey.PLAYBOOKS}/:id`);
            }}
          >
            <PlaybookPage />
          </Sentry.ErrorBoundary>
        ),
      },
      // {
      //   path: `${ActiveRouteKey.UPLOADS}`,
      //   element: (
      //     <Sentry.ErrorBoundary
      //       beforeCapture={(scope) => {
      //         scope.setTag("route", `${ActiveRouteKey.UPLOADS}`);
      //       }}
      //     >
      //       <UploadsPage />
      //     </Sentry.ErrorBoundary>
      //   ),
      // },
      {
        path: `${ActiveRouteKey.INTEGRATIONS}`,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", `${ActiveRouteKey.INTEGRATIONS}`);
            }}
          >
            <IntegrationsPage />
          </Sentry.ErrorBoundary>
        ),
      },
      {
        path: `${ActiveRouteKey.DOCUMENTS}`,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", `${ActiveRouteKey.DOCUMENTS}`);
            }}
          >
            <AllDocumentsPage />
          </Sentry.ErrorBoundary>
        ),
      },
      {
        path: `${ActiveRouteKey.GSHEET_INTEGRATION}`,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", `${ActiveRouteKey.GSHEET_INTEGRATION}`);
            }}
          >
            <GoogleSheetIntegrationPage />
          </Sentry.ErrorBoundary>
        ),
      },
      {
        path: `${ActiveRouteKey.GDRIVE_INTEGRATION}`,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", `${ActiveRouteKey.GDRIVE_INTEGRATION}`);
            }}
          >
            <GoogleDriveIntegrationPage />
          </Sentry.ErrorBoundary>
        ),
      },
      {
        path: `${ActiveRouteKey.FIREFLIES_INTEGRATION}`,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", `${ActiveRouteKey.FIREFLIES_INTEGRATION}`);
            }}
          >
            <FirefliesIntegrationPage />
          </Sentry.ErrorBoundary>
        ),
      },
      {
        path: `${ActiveRouteKey.NOTION_INTEGRATION}`,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", `${ActiveRouteKey.NOTION_INTEGRATION}`);
            }}
          >
            <NotionIntegrationPage />
          </Sentry.ErrorBoundary>
        ),
      },
      // {
      //   path: `${ActiveRouteKey.MIRO_INTEGRATION}`,
      //   element: (
      //     <Sentry.ErrorBoundary
      //       beforeCapture={(scope) => {
      //         scope.setTag("route", `${ActiveRouteKey.MIRO_INTEGRATION}`);
      //       }}
      //     >
      //       <MiroIntegrationPage />
      //     </Sentry.ErrorBoundary>
      //   ),
      // },
      {
        path: `${ActiveRouteKey.DOCUMENTS}/:id`,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", `${ActiveRouteKey.DOCUMENTS}`);
            }}
          >
            <DocumentPage />
          </Sentry.ErrorBoundary>
        ),
      },
      {
        path: `${ActiveRouteKey.DOCUMENTS}/:id/source`,
        element: (
          <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
              scope.setTag("route", `${ActiveRouteKey.DOCUMENTS}`);
            }}
          >
            <DocumentPage />
          </Sentry.ErrorBoundary>
        ),
      },
    ],
  },
]);