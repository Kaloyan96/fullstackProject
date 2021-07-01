import { Identifiable, IdType, ResourceType } from './common-types';
export interface IContent extends Identifiable {
    componentId: IdType;
    authorId: IdType;
    data: any,
    // categories?: string[];
    // keywords?: string[];
}

export class Content implements IContent {
    static typeId = 'Content';
    constructor(
        public _id: IdType,
        public componentId: IdType,
        public authorId: IdType,
        public data: any,
        ) {}
}