import React from 'react'
// import PropTypes from 'prop-types'

// import './ArticlePost.css';
// import { Article } from '../../../model/article.model';
// import { ArticleCallback } from '../../../common/common-types';
import { Marked } from '@ts-stack/markdown';
import { DynamicComponent } from '../dynamic-component.model';
import { RootState } from '../../../app/rootReducer';
import { useSelector } from 'react-redux';

interface Props {
  HTMLPage: DynamicComponent;
  //   onEditArticle: ArticleCallback;
  //   onDeleteArticle: ArticleCallback;
}

const rawMarkup = (markdownText: string) => (
  { __html: Marked.parse(markdownText) }
);

export const HTMLPageComponent: React.FC<Props> = ({ HTMLPage }) => {

  const loadedContent = useSelector((state: RootState) => state.content.content);

  // console.log(loadedContent)
  // console.log(HTMLPage);
  //   const handleEdit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //     onEditArticle(article);
  //   }
  //   const handleDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //     onDeleteArticle(article);
  //   }

  return (
    <div className="ArticleItem-card-wrapper col l6 Article-card">
      {loadedContent[0]
        ? 
        <p dangerouslySetInnerHTML={rawMarkup(loadedContent[0].data)}></p>
        : <></>}
    </div>
  );
};