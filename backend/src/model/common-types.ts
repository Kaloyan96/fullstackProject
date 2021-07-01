export type IdType = string;

export interface Identifiable {
    _id?: IdType
}

export interface ResourceType<T> extends Function {
    typeId: string;
    new(...args: any[]): T;
}