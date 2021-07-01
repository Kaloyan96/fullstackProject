/**
 * THIS HEADER SHOULD BE KEPT INTACT IN ALL CODE DERIVATIVES AND MODIFICATIONS.
 * 
 * This file provided by IPT is for non-commercial testing and evaluation
 * purposes only. IPT reserves all rights not expressly granted.
 *  
 * The security implementation provided is DEMO only and is NOT intended for production purposes.
 * It is exclusively your responsisbility to seek advice from security professionals 
 * in order to secure the REST API implementation properly.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * IPT BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// import { ArticleRepository } from '../dao/repository';
// import MOCK_POSTS from '../model/mock-articles';

import { Article } from '../model/article.model';
import { IdType } from '../common/common-types';

export const API_BASE = 'http://192.168.0.100:1337/api';

class ArticleService {
    // private repo = new ArticleRepository();
    constructor(private apiUrl: string) {
        // if(apiUrl){

        // }
        // MOCK_POSTS.forEach(article => this.repo.add(article as Article)); 
    }

    async getAllArticles() {
        console.log("Requested All articles");
        const resp = await fetch(`${API_BASE}/articles`);
        const articles = await resp.json();
        return articles;
    }

    async getArticleById(articleId: IdType) {
        const resp = await fetch(`${API_BASE}/articles/${articleId}`);
        const article = await resp.json();
        return article;
    }

    async createNewArticle(article: Article) {
        const resp = await fetch(`${API_BASE}/articles`, {
            method: 'POST',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(article),
        });
        const created = await resp.json();
        return created;
    }

    async updateArticle(article: Article) {
        const resp = await fetch(`${API_BASE}/articles/${article.id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(article),
        });
        const updated = await resp.json();
        return updated;
    }

    async deleteArticle(articleId: IdType) {
        const resp = await fetch(`${API_BASE}/articles/${articleId}`, {
            method: 'DELETE',
            mode: 'cors'
        });
        const deleted = await resp.json();
        return deleted;
    }

 
    // async loadArticles(searchTerms: string[]): Promise<Article[]> {
    //     console.log(searchTerms);
    //     const searchText = searchTerms.join(' ');
    //     const result = await fetch(GOOGLE_BOOKS_API + encodeURIComponent(searchText));
    //     const articlesFound = await result.json() as RootObject;
    //     // console.log(articlesFound);
    //     return articlesFound.items.map(item => new Article(
    //         item.id,
    //         item.volumeInfo.title, 
    //         item.volumeInfo.authors,
    //         item.volumeInfo.imageLinks?.thumbnail,
    //         item.volumeInfo.subtitle,
    //         item.volumeInfo.categories,
    //         searchTerms,
    //         item.volumeInfo.description
    //     ));
    // }
}

export default new ArticleService(API_BASE);

