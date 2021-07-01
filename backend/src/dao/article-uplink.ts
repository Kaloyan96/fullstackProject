import { AppError } from '../model/errors';
import { MongoUplink } from './mongo-uplink';
import { Article } from '../model/article.model';

export class ArticleUplink extends MongoUplink<Article> {
    // Change to title, tags, keywords whatever.
    // async findByUsername(username: string): Promise<Article> {
    //     try {
    //         return await this.db.collection(this.collection).findOne({'username': username});
    //     } catch(err) {
    //         throw new AppError(404, `User with username: "${username}" does not exist.`);
    //     }
    // }
}