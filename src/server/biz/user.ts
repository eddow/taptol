import UserBase, {roles} from '@obj/user';
import {Schema, model, Document} from '@/lib/mongo';
import {Service, ServiceDoc} from './service';
import {Project, ProjectDoc} from './project';

export const UserSchema = new Schema({
	email: {type: String, minLength: 7},
	name: {type: String, minLength: 2},
	role: {type: String, enum: Object.keys(roles)},
	pass: {type: String, minLength: 6},
	code: String,
	expiration: Number
});
export interface UserDoc extends UserBase, Document {
	services: ServiceDoc[];
	projects: ProjectDoc[];
	code: string,
	expiration: number
};
export const User = model<UserDoc>('User', UserSchema);

UserSchema.pre('remove', function(next) {
	if('spec'=== (<UserDoc>this).role) {
		let filter = {specialist: this._id};
		Service.remove(filter).exec();
		Project.remove(filter).exec();
	} else if('cust'=== (<UserDoc>this).role)
		Project.remove({customer: this._id}).exec();
	next();
});