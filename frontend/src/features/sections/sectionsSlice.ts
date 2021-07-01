import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Section } from "../../model/section.model";
import { AppThunk } from "../../app/store";
import SectionService from '../../service/section-service';

interface SectionsState {
    sections: Section[];
    loading: boolean;
    error: string | null;
}

interface SectionsLoaded {
    sections: Section[];
}

const initialiState: SectionsState = {
    sections: [],
    loading: false,
    error: null
}

const sections = createSlice({
    name: 'sections',
    initialState: initialiState,
    reducers: {
        getSectionsStart(state) {
            state.loading = true;
            state.error = null;
        },
        getSectionsSuccess(state, action: PayloadAction<SectionsLoaded>) {
            const { sections } = action.payload;
            state.sections = sections;
            state.loading = false;
            state.error = null;
        },
        sectionsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    getSectionsStart,
    getSectionsSuccess,
    sectionsFailure
} = sections.actions;

export default sections.reducer;

export const fetchSections = (): AppThunk => async (dispatch) => {
    try {
        dispatch(getSectionsStart());
        const sections = await SectionService.getAllSections();
        console.log(sections);
        dispatch(getSectionsSuccess({ sections }));
    } catch (err:any) {
        dispatch(sectionsFailure(err));
    }
};