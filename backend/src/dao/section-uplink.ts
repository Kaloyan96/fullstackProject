import { AppError } from '../model/errors';
import { MongoUplink } from './mongo-uplink';
import { Section } from '../model/section.model';

export class SectionUplink extends MongoUplink<Section> {

}