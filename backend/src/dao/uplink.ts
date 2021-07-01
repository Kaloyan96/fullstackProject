import { Identifiable, IdType } from '../model/common-types';

export interface Uplink<T extends Identifiable> {
    add(user: T): Promise<T>;
    edit(user: T): Promise<T>;
    deleteById(id: IdType): Promise<T>;
    findAll(): Promise<T[]>;
    findById(id: IdType): Promise<T>;
    getCount(): Promise<number>;
}