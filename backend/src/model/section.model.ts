import {IdType, Identifiable} from './common-types' 

export interface ISection extends Identifiable {
    name: string
}

export class Section implements ISection {
    static typeId = 'Section';
    constructor(
        public _id: IdType,
        public name: string,
        ) {}
}