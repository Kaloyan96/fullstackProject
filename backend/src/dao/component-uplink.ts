import { AppError } from '../model/errors';
import { MongoUplink } from './mongo-uplink';
import { Component } from '../model/component.model';

export class ComponentUplink extends MongoUplink<Component> {

}