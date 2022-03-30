import {ObjectId} from 'mongoose'
import {md5} from '@/lib/utils';

export let IDs: {[hr: string]: ObjectId} = {};

function dollarLess(id: string) {
	return '$'=== id.substr(0, 1) ? id.substr(1) : id;
}

export function register(ids: string[], models: any[]) {
	for(let ndx in ids)
		if(ids[ndx])
			IDs[dollarLess(ids[ndx])] = models[ndx]._id;
	return models;
}

export function prepare(models: any[]) {
	for(let model of models)
		for(let prop in model)
			if('string'=== typeof model[prop]) {
				if('$'=== model[prop].substr(0, 1))
					model[prop] = IDs[model[prop].substr(1)];
				else if('md5:'=== model[prop].substr(0, 4).toLowerCase())
					model[prop] = md5(model[prop].substr(4));
			}
	return models;
}

export default function ID(id: string) {
	return IDs[dollarLess(id)];
}