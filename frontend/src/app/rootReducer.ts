import { combineReducers } from "redux";
import articlesReducer from '../features/articles/articlesSlice';
import sectionsReducer from '../features/sections/sectionsSlice';
import dynamicComponentsReducer from '../features/dynamic-components/dynamicComponentsSlice';
import contentReducer from '../features/content/contentSlice';

const rootReducer = combineReducers({
    // articles: articlesReducer,
    sections: sectionsReducer,
    dynamicComponents: dynamicComponentsReducer,
    content: contentReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;