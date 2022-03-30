import ProjectBase, {stars, stages} from '@obj/project';
import {ObjectId, Schema, model, Document} from '@/lib/mongo';

export const projectSchema = new Schema({
	specialist: {type: ObjectId, ref: "User"},
	customer: {type: ObjectId, ref: "User"},
	stage: {type: String, enum: Object.keys(stages)},
	description: String,
	
	review: String,
	rate: {type: Number, enum: stars }
});

export interface ProjectDoc extends ProjectBase, Document {};
export const Project = model<ProjectDoc>('Project', projectSchema);
