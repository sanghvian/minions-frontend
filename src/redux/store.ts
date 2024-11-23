import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import * as Sentry from "@sentry/react";

// Importing reducers
import user from "./features/userSlice";
import contact from "./features/contactSlice";
import contactsList from "./features/contactsListSlice";
import activeEntities from "./features/activeEntitiesSlice";
import note from "./features/noteSlice";
import action from "./features/actionSlice";
import group from "./features/groupSlice";
import chat from "./features/chatSlice";
import playbook from "./features/playbookSlice";
import video from "./features/video";
import document from "./features/documentSlice";
import topic from "./features/topicSlice";
import voiceAgents from "./features/voiceAgentsSlice";

const persistConfig = {
    key: 'root',
    storage,
}

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
    // Optionally pass options listed below
});

const rootReducer = combineReducers({
    user,
    contactsList,
    voiceAgents,
})

const persisted = persistReducer(persistConfig, rootReducer)

const configuredReducer = combineReducers({
    persisted,
    contact,
    activeEntities,
    note,
    action,
    group,
    chat,
    playbook,
    video,
    document,
    topic,
})

export const store = configureStore({
    reducer: configuredReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
    enhancers: [sentryReduxEnhancer]
});

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
