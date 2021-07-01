// import { Post } from '../model/post.model';
import { Db, ObjectID } from 'mongodb';

import { Uplink } from './uplink';
import { AppError } from '../model/errors';
import { Identifiable, IdType, ResourceType } from '../model/common-types';


export class MongoUplink<T extends Identifiable> implements Uplink<T> {
    constructor(public entytyType: ResourceType<T>, public db: Db, public collection: string) { }

    async add(entity: T) {
        entity._id = undefined;
        const res = await this.db.collection(this.collection).insertOne(entity);
        if (res.result.ok && res.insertedCount === 1) {
            entity._id = res.insertedId;
            console.log(`Created new ${this.entytyType.typeId}: ${JSON.stringify(entity)}`);
            return entity;
        }
        throw new AppError(500, `Error inserting ${this.entytyType.typeId}: "${JSON.stringify(entity)}"`);
    }

    async edit(entity: T): Promise<T> {
        if (!entity._id) {
            throw new AppError(400, `${this.entytyType.typeId} ID can not be undefined.`)
        }
        const found = await this.findById(entity._id);
        if (!found) {
            throw new AppError(404, `${this.entytyType.typeId} ID="${entity._id} does not exist and can not be modified.`);
        }
        // update by _id
        var query = { _id: new ObjectID(entity._id) }; // check if ID should be changed
        var newValues = { $set: entity };
        const updateRes = await this.db.collection(this.collection).updateOne(query, newValues);
        // console.log(updateRes)
        if (updateRes.result.ok && updateRes.modifiedCount === 1) {
            console.log(`${this.entytyType.typeId} successfully updated: ${JSON.stringify(entity)}`);
            return entity;
        }
        else {
            throw new AppError(500, `Error inserting ${this.entytyType.typeId}: ${JSON.stringify(entity)}`);
        }
    }

    async deleteById(id: IdType): Promise<T> {
        const found = await this.findById(id);
        if (!found) {
            throw new AppError(404, `${this.entytyType.typeId} ID="${id} does not exist and can not be modified.`);
        }
        const res = await this.db.collection(this.collection).deleteOne({ _id: new ObjectID(id) });
        if (res.result.ok && res.deletedCount === 1) {
            console.log(`Deleted ${this.entytyType.typeId}: ${JSON.stringify(found)}`);
            return found;
        }
        throw new AppError(500, `Error inserting ${this.entytyType.typeId}: "${JSON.stringify(found)}"`);
    }

    async findAll(): Promise<T[]> {
        return this.db.collection(this.collection).find<T>({}, {}).toArray(); // error on find<T>({}) due to missing optional options???
    }

    async findById(id: IdType): Promise<T> {
        try {
            return await this.db.collection(this.collection).findOne({ _id: new ObjectID(id) });
        } catch (err) {
            throw new AppError(404, err.message);
        }
    }

    async getCount(): Promise<number> {
        return this.db.collection(this.collection).count();
    }
}