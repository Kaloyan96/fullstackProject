import { AppError } from '../model/errors';
import { MongoUplink } from './mongo-uplink';
import { Content } from '../model/content.model';
import { IdType } from '../model/common-types';
import { ObjectID } from 'mongodb';

export class ContentUplink extends MongoUplink<Content> {
    async findAllForComponent(componentId: IdType): Promise<Content[]> {
        try {
            return await this.db.collection(this.collection).findOne({'componentId': componentId});
        } catch(err) {
            throw new AppError(404, `Component with componentId: "${componentId}" does not exist.`);
        }        
    }
}