import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { combineReducers } from '@reduxjs/toolkit';

// Import your slice reducers here
import companyOnboardingReducer from './slices/companyOnboardingSlice';

// Root reducer combining all slices
const rootReducer = combineReducers({
  // Add your reducers here
  companyOnboarding: companyOnboardingReducer,
});

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window === 'undefined'
    ? createNoopStorage()
    : (() => {
        try {
          return createWebStorage('local');
        } catch {
          return createNoopStorage();
        }
      })();

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  // Optionally, you can blacklist or whitelist specific reducers
  // blacklist: ['someReducer'],
  // whitelist: ['someOtherReducer'],
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
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

// Create persistor
export const persistor = typeof window === 'undefined' ? null : persistStore(store);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
