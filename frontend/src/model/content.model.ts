import {IdType, Identifiable} from '../common/common-types' 

export interface IContent extends Identifiable {
    authorId: IdType;
    componentId: IdType;
    data: any;
}

export class Content implements IContent {
    constructor(
        public id: IdType,
        public authorId: IdType,
        public componentId: IdType,
        public data: any,
        ) {}
}