import {IdType, Identifiable} from './common-types' 

export interface IComponent extends Identifiable {
    name: string
}

export class Component implements IComponent {
    static typeId = 'Component';
    constructor(
        public _id: IdType,
        public name: string,
        public data: string,
        ) {}
}