import React, { Component, ReactElement } from 'react';
import { IdType, Identifiable } from '../../common/common-types'

export interface IDynamicComponent extends Identifiable {
    name: string;
    type: string;
    data: string;
}

export class DynamicComponent implements IDynamicComponent {
    constructor(
        public id: IdType,
        public name: string,
        public type: string,
        public data: any,
    ) {

    }

}

export enum availableComponents {
    TopNav = "TopNav",
    HTMLPage = "HTMLPage",
    ArticleFeed = "ArticleFeed"
}