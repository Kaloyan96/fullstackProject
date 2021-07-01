import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

import { RootState } from './rootReducer';
import Nav from '../Components/Nav/Nav'

import { Article } from '../model/article.model';
import { ArticleList } from '../Components/Article/ArticleList/ArticleList';
import { ArticleCallback, DynamicComponentCallback } from '../common/common-types';
import { ArticleForm } from '../Components/Article/ArticleForm/ArticleForm';
import ArticleService from '../service/article-service';

import { fetchArticles } from '../features/articles/articlesSlice';
import { fetchSections } from '../features/sections/sectionsSlice';
import { fetchDynamicComponents } from '../features/dynamic-components/dynamicComponentsSlice';

import HomePage from '../Components/HomePage/HomePage';
import SectionsManager from '../Components/Manager/Manager';
import dynamicComponentService from '../service/dynamic-component-service';
import { DynamicComponent } from '../Components/DynamicComponents/dynamic-component.model';
import SectionLoader from '../Components/Sections/SectionComponent/SectionLoader';
import { Section } from '../model/section.model';
import { fetchContent } from '../features/content/contentSlice';
export interface ArticleAction {
  type: string;
  article: Article;
}

const default_nav_tree_name = "default_nav_tree"

function App() {
  const [editedArticle, setEditedArticle] = useState<Article | undefined>(undefined);

  const history = useHistory();
  const dispatch = useDispatch();
  // console.log(dispatch);
  
  const sections = useSelector((state: RootState) => state.sections.sections);
  const dynamicComponents = useSelector((state: RootState) => state.dynamicComponents.dynamicComponents);
  // const navComponent = dynamicComponents?.find(element => element.name === default_nav_tree_name);

  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDynamicComponents());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  const handleSubmitComponent: DynamicComponentCallback = (component) => {
    if (component.id) { //Edit
      dynamicComponentService.updateDynamicComponent(component).then(
        edited => {
        }
      );
    } else { //Create
      console.log("creating")
      dynamicComponentService.createNewDynamicComponent(component).then(
        created => {
          if (created?.text) {
            console.log(created?.text);
          }
        }
      ).catch(reason => {
        console.log(reason);
      });
    }
  }

  const handleEditArticle: ArticleCallback = (article) => {
    setEditedArticle(article);
    history.push(`/edit-article/${article.id}`);
  };

  const handleDeleteArticle: ArticleCallback = (article) => {
    ArticleService.deleteArticle(article.id).then(
      deleted => {
        // setArticles(articles.filter(p => p.id !== deleted.id));
        history.push('/articles');
      }
    );
  };

  const handleSubmitArticle: ArticleCallback = (article) => {
    if (article.id) { //Edit
      ArticleService.updateArticle(article).then(
        edited => {
          // setArticles(articles.map(p => p.id === edited.id ? article : p));
        }
      );
    } else { //Create
      console.log("creating")
      ArticleService.createNewArticle(article).then(
        created => {
          if (created?.text) {
            console.log(created?.text);
          }
          // setArticles(articles.concat(created));
        }
      ).catch(reason => {
        console.log(reason);
      });
    }
    // history.push('/articles'); // Make it so that it awaits success before redirect
  };

  return (
    <React.Fragment>
      {/* {navComponent && navComponent !== undefined ? <Nav loadedSections={sections} navComponent={navComponent} /> : <></>} */}
      <div className="section no-pad-bot" id="index-banner">
        <div className="container" >
          <Switch>
            {sections
              ? sections.map((s: Section) =>
              (
                <Route exact path={`/${s.route}`}>
                  {console.log(s.route)}
                  <SectionLoader sectionToLoad={s} />
                </Route>))
              : <></>}
            <Route exact path={["/", "/home"]}>
              {/* <SectionLoader sectionToLoad={ } /> */}
              {/* <HomePage /> */}
            </Route>
            {/* <Route exact path="/статий">
              <ArticleList articles={articles} onEditArticle={handleEditArticle} onDeleteArticle={handleDeleteArticle} />
            </Route>
            <Route exact path="/add-article">
              <ArticleForm article={undefined} onSubmitArticle={handleSubmitArticle} />
            </Route>
            <Route exact path="/article/:articleId">
            </Route>
            <Route exact path="/edit-article/:articleId">
              <ArticleForm article={editedArticle} onSubmitArticle={handleSubmitArticle} />
            </Route> */}

            <Route path="/manager">
              <SectionsManager sections={sections} navData={dynamicComponents?.find(element => element.name === default_nav_tree_name)} />
            </Route>
          </Switch>
        </div>
      </div>
    </React.Fragment>
  );
}

// (<Nav loadedSections={sections} navComponentData={dynamicComponents?.find(element => element.name === default_nav_tree_name)} />)

export default App;
