import * as React from 'react';
import { ReactElement } from 'react';

import { Article } from '../../../model/article.model';
import { ArticlePost } from '../ArticleItem/ArticlePost';
import { ArticleCallback } from '../../../common/common-types';
// import Header from '../Header/Header';

interface Props {
  articles: Article[];
  onEditArticle: ArticleCallback;
  onDeleteArticle: ArticleCallback;
}

export function ArticleList({ articles, ...rest }: Props): ReactElement<Props> {
  return (
    <React.Fragment>
      {/* <Header /> */}
      <div className="section row">
        {articles.map(article => (
          <div className="section row">
            <ArticlePost article={article} key={article.id} {...rest} />
          </div>))}
      </div>
    </React.Fragment>
  );
};
