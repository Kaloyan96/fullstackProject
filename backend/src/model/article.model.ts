import { Identifiable, IdType, ResourceType } from './common-types';
export interface IArticle extends Identifiable {
    title: string;
    text: string;
    authorId: IdType;
    imageUrl?: string;
    // categories?: string[];
    // keywords?: string[];
}

export class Article implements IArticle {
    static typeId = 'Article';
    constructor(
        public _id: IdType,
        public title: string,
        public text: string,
        public authorId: IdType | null,
        public imageUrl?: string,
        // public categories?: string[],
        // public keywords: string[] = [],
        ) {}
}