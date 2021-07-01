import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import { Article } from "../../model/article.model";
import { AppThunk } from "../../app/store";
import ArticleService from '../../service/article-service';

interface ArticlesState {
    articles: Article[];
    loading: boolean;
    error: string | null;
} 

interface ArticlesLoaded {
    articles: Article[];
}

const initialiState: ArticlesState = {
    articles: [],
    loading: false,
    error: null
}

const articles = createSlice({
    name: 'articles',
    initialState: initialiState,
    reducers: {
        getArticlesStart(state) {
            state.loading = true;
            state.error = null;
        },
        getArticlesSuccess(state, action: PayloadAction<ArticlesLoaded>) {
            const {articles} = action.payload;
            state.articles = articles;
            state.loading = false;
            state.error = null;
        },
        articlesFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    getArticlesStart,
    getArticlesSuccess,
    articlesFailure
} = articles.actions;

export default articles.reducer;

export const fetchArticles = (): AppThunk => async(dispatch) => {
    console.log("fetchArticles")
    try {
        dispatch(getArticlesStart());
        const articles = await ArticleService.getAllArticles();
        dispatch(getArticlesSuccess({articles}));
    } catch(err:any){
        dispatch(articlesFailure(err));
    }
};