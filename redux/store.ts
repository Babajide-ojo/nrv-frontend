import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from "./slices/userSlice";
import propertyReducer from './slices/propertySlice';
import maintenanceReducer from './slices/maintenanceSlice';
import messageReducer from './slices/messageSlice';
import documentReducer from './slices/documentSlice';
import verificationReducer from './slices/verificationSlice';

// Root reducer
const rootReducer = combineReducers({
  user: userReducer,
  property: propertyReducer,
  maintenance: maintenanceReducer,
  messages: messageReducer,
  document: documentReducer,
  verification: verificationReducer,
});

// Persist configuration
const persistConfig = {
  key: 'nrv-root',
  storage,
  whitelist: ['user'], // Only persist user data
  blacklist: ['property', 'maintenance', 'messages', 'document', 'verification'], // Don't persist these
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
