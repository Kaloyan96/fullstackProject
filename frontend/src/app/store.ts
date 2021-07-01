import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { RootState } from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from './rootReducer';

const store = configureStore({
    reducer: rootReducer
});

// This is for dev things
// if(process.env.NODE_ENV === 'development' && module.hot) {
//     module.hot.accept('./rootReducer', () => {
//         const newRootReducer = require('./rootReducer').default;
//         store.replaceReducer(newRootReducer);
//     })
// }

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export default store;