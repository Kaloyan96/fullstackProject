import React from 'react'
import PropTypes from 'prop-types'

import './ArticlePost.css';
import { Article } from '../../../model/article.model';
import { ArticleCallback } from '../../../common/common-types';
import { Marked } from '@ts-stack/markdown';

interface Props {
  article: Article;
  onEditArticle: ArticleCallback;
  onDeleteArticle: ArticleCallback;
}

const rawMarkup = (markdownText: string) => (
  {__html :Marked.parse(markdownText)}
);

export const ArticlePost: React.FC<Props> = ({article, onEditArticle, onDeleteArticle}) => {
  
  const handleEdit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onEditArticle(article);
  }
  const handleDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onDeleteArticle(article);
  }

  return (
    <div className="ArticleItem-card-wrapper col l6 Article-card">
      <div className="card">
        <div className="ArticleItem-card-image waves-effect waves-block waves-light">
          <img
            className="activator ArticleItem-image"
            src={article.imageUrl ? article.imageUrl : '/img/no-image.png'}
            alt="front page"
          />
        </div>
        <div className="ArticleItem-card-content">
          <div className="card-title activator grey-text text-darken-4">
            <div className="ArticleItem-title">
              {article.title}
            </div>
            {/* <div className="ArticleItem-tags">
              {article.categories?.map((cat, index) => (
                <div key={index} className="chip category">{cat}</div>
              ))}
              {article.keywords?.map((kword, index) => (
                <div key={index + 1000} className="chip keyword">{kword}</div>
              ))}
            </div> */}
            <i className="material-icons right">more_vert</i>
          </div>
          <p dangerouslySetInnerHTML={rawMarkup(article.text)}></p>
          <div className="ArticleItem-card-actions card-action">
            <a href="articles?remove={{.ID}}">Add to Favs</a>
            <div className="ArticleItem-buttons-right">
              <button className="btn waves-effect waves-light" title="EDIT Article" onClick={handleEdit}>
                <i className="material-icons">create</i>
              </button>
              <button className="btn danger waves-effect waves-light" title="DELETE Article" onClick={handleDelete}>
                <i className="material-icons">delete</i>
              </button>
            </div>
          </div>
        </div>
        <div className="card-reveal">
          <span className="card-title grey-text text-darken-4">
            {article.title}
            <i className="material-icons right">close</i>
          </span>
          <p dangerouslySetInnerHTML={rawMarkup(article.text)}></p>
        </div>
      </div>
    </div>
  );
};