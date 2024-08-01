import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from '../Redux/authSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = {
  auth: authReducer,
};

const persistedReducer = persistReducer(persistConfig, combineReducers(rootReducer));


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      ignoredActionPaths: ['payload', 'meta.arg'],
      ignoredPaths: ['auth.register'], // Adjust this based on your actual paths
    },
    }),
});


export const persistor = persistStore(store);


store.subscribe(() => {

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
