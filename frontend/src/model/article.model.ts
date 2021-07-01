import {IdType, Identifiable, HasCreationDate} from '../common/common-types' 

export interface IArticle extends Identifiable {
    title: string;
    authorId: IdType;
    text: string;
    // imageUrl?: string;
    // categories?: string[];
    // keywords?: string[];
}

export class Article implements IArticle {
    constructor(
        public id: IdType,
        public title: string,
        public authorId: IdType,
        public text: string,
        public imageUrl?: string,
        public creationDate?: Date
        // public categories?: string[],
        // public keywords: string[] = [],
        ) {}
}