import { Article } from "../model/article.model";
import { Section } from "../model/section.model";
import { DynamicComponent } from "../Components/DynamicComponents/dynamic-component.model";
import { Content } from "../model/content.model";

export type IdType = string;

export interface Identifiable {
    id: IdType
}

export interface HasCreationDate {
    creationDate: Date
}

export interface StringCallback {
    (searchText: string): void;
}

export interface ArticleCallback {
    (article: Article): void;
}

export interface ContentCallback {
    (content: Content): void;
}

export interface SectionCallback {
    (section: Section): void;
}

export interface DynamicComponentCallback {
    (dynamicComponent: DynamicComponent): void;
}
