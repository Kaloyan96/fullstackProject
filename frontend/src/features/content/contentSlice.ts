import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import { Content } from "../../model/content.model";
import { AppThunk } from "../../app/store";
import ContentService from '../../service/content-service';

interface ContentState {
    content: Content[];
    loading: boolean;
    error: string | null;
} 

interface ContentLoaded {
    content: Content[];
}

const initialiState: ContentState = {
    content: [],
    loading: false,
    error: null
}

const content = createSlice({
    name: 'content',
    initialState: initialiState,
    reducers: {
        getContentStart(state) {
            state.loading = true;
            state.error = null;
        },
        getContentSuccess(state, action: PayloadAction<ContentLoaded>) {
            const {content} = action.payload;
            state.content = content;
            state.loading = false;
            state.error = null;
        },
        contentFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    getContentStart,
    getContentSuccess,
    contentFailure
} = content.actions;

export default content.reducer;

export const fetchContent = (): AppThunk => async(dispatch) => {
    console.log("fetchContent")
    try {
        dispatch(getContentStart());
        const content = await ContentService.getAllContent();
        dispatch(getContentSuccess({content}));
    } catch(err:any){
        dispatch(contentFailure(err));
    }
};