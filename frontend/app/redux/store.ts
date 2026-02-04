import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import usersReducer from "./features/users/userSlice";
import searchReducer from './features/search/searchSlice'
import questionReducer from './features/questions/questionSlice'
import answerReducer from './features/answers/answerSlice';
import tagsReducer from './features/tags/tagSlice'
import { injectStore } from "@/components/privateApi";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["users"], 
};

const rootReducer = combineReducers({
  users: usersReducer,
  search:searchReducer,
  questions: questionReducer,
  answers: answerReducer,
  tags: tagsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

injectStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
