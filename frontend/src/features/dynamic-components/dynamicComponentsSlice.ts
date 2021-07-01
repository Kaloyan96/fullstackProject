import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DynamicComponent } from "../../Components/DynamicComponents/dynamic-component.model";
import { AppThunk } from "../../app/store";
import DynamicComponentService from '../../service/dynamic-component-service';

interface DynamicComponentsState {
    dynamicComponents: DynamicComponent[];
    loading: boolean;
    error: string | null;
}

interface DynamicComponentsLoaded {
    dynamicComponents: DynamicComponent[];
}

const initialiState: DynamicComponentsState = {
    dynamicComponents: [],
    loading: false,
    error: null
}

const dynamicComponents = createSlice({
    name: 'dynamicComponents',
    initialState: initialiState,
    reducers: {
        getDynamicComponentsStart(state) {
            state.loading = true;
            state.error = null;
        },
        getDynamicComponentsSuccess(state, action: PayloadAction<DynamicComponentsLoaded>) {
            const { dynamicComponents } = action.payload;
            state.dynamicComponents = dynamicComponents;
            state.loading = false;
            state.error = null;
        },
        dynamicComponentsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    getDynamicComponentsStart,
    getDynamicComponentsSuccess,
    dynamicComponentsFailure
} = dynamicComponents.actions;

export default dynamicComponents.reducer;

export const fetchDynamicComponents = (): AppThunk => async (dispatch) => {
    console.log("fetchDynamicComponents")
    try {
        dispatch(getDynamicComponentsStart());
        const dynamicComponents = await DynamicComponentService.getAllDynamicComponents();
        dispatch(getDynamicComponentsSuccess({ dynamicComponents }));
    } catch (err:any) {
        dispatch(dynamicComponentsFailure(err));
    }
};