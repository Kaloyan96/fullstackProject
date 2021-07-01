import { AppError } from '../model/errors';
import { MongoUplink } from './mongo-uplink';
import { User } from '../model/user.model';

export class UserUplink extends MongoUplink<User> {
    async findByUsername(username: string): Promise<User> {
        try {
            return await this.db.collection(this.collection).findOne({'username': username});
        } catch(err) {
            throw new AppError(404, `User with username: "${username}" does not exist.`);
        }
    }
}