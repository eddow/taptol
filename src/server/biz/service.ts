import ServiceBase, {serviceTypes} from '@obj/service';
import {ObjectId, Schema, model, Document} from '@/lib/mongo';

export const serviceSchema = new Schema({
	specialist: {type: ObjectId, ref: "User"},
	type: {type: String, enum: Object.keys(serviceTypes)},
	description: String,
	rate: Number,
	startHour: Number,
	endHour: Number
});

//stars: {type: Number, min: 1, max: 5}

export interface ServiceDoc extends ServiceBase, Document {};
export const Service = model<ServiceDoc>('Service', serviceSchema);
