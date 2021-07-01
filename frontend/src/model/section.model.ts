import {IdType, Identifiable} from '../common/common-types' 
import { DynamicComponent } from '../Components/DynamicComponents/dynamic-component.model';

export interface ISection extends Identifiable {
    name: string;
    status: SectionStatus;
}

export enum SectionStatus{
    Visible="Visible",
    Hidden="Hidden",
}

export class Section implements ISection {
    constructor(
        public id: IdType,
        public name: string,
        public status: SectionStatus,
        public route: string,
        public components?: { [s: string]: DynamicComponent },
        public template?: any,//make template which section loader ises
        public type?: string,
        ) {}
}

export class SectionTemplate {
    constructor(
        public id: IdType,
        public name: string,
    ){}
}

export enum componentSlots {
    Top = "Top",
    Center = "Center",
    Bottom = "Bottom",
    Left = "Left",
    Right = "Right",
}