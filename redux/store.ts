import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import userReducer from "./slices/userSlice";
import propertyReducer from './slices/propertySlice';
import maintenanceReducer from './slices/maintenanceSlice';
import messageReducer from './slices/messageSlice';
import documentReducer from './slices/documentSlice';
import verificationReducer from './slices/verificationSlice';
import plansReducer from './slices/plansSlice';

// Storage: localStorage in browser, noop on server (avoids "failed to create sync storage" during SSR)
const noopStorage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
};
const storage = typeof window === 'undefined' ? noopStorage : require('redux-persist/lib/storage').default;

// Root reducer
const rootReducer = combineReducers({
  user: userReducer,
  property: propertyReducer,
  maintenance: maintenanceReducer,
  messages: messageReducer,
  document: documentReducer,
  verification: verificationReducer,
  plans: plansReducer,
});

// Persist configuration
const persistConfig = {
  key: 'nrv-root',
  storage,
  whitelist: ['user'], // Only persist user data
  blacklist: ['property', 'maintenance', 'messages', 'document', 'verification', 'plans'], // Don't persist these
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
