
import mongoose, {Model, Document} from 'mongoose';

import {readFileSync} from 'fs';
import {join} from 'path';
import yaml from 'yaml';

import {User} from '@/biz/user'
import {Service} from '@/biz/service'
import {Project} from '@/biz/project'

import {prepare, register} from './id';

async function seed<T extends Document<any, {}>>(model: Model<T>, items: any[]) {
	let rvId = [];
	for(let item of items) {
		rvId.push(item._id);
		delete item._id;
	}
	return register(rvId, await model.insertMany(prepare(items)));
}

export async function initDB() {
	let db = mongoose.connection.db;
	Promise.allSettled([
		mongoose.connection.collections['users'].drop(),
		mongoose.connection.collections['services'].drop(),
		mongoose.connection.collections['projects'].drop()
	]);
	if(db) await db.dropDatabase();
	
	let dbYaml = readFileSync(join(__dirname, 'db-test.yaml'), 'utf8'),
		dbContent = <{[col: string]: any}>yaml.parse(dbYaml);
	await seed(User, dbContent.users);
	await seed(Service, dbContent.services);
	await seed(Project, dbContent.projects);
}

export async function destroyDB() {
	/*	For testing the tests purpose, let the DB after tests
	let db = mongoose.connection.db;
	if(db) await db.dropDatabase();*/
}