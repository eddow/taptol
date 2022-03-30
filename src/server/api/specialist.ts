import express from 'express';
import {Request, Response} from 'express';
import {User} from '@/biz/user';
import {ObjectId} from '@/lib/mongo';
import {sanitizer, API} from '@/lib/api';

const sanitize = sanitizer('_id', 'name', 'services', 'projects');
function spec(sp: any) {
	let rv: any = sanitize(sp),
		rating = sp.rating && sp.rating[0];
	if(rating)
		rv.rating = rating.stars / rating.nr;
	return rv;
}
const api = express();
export default api;

const lookup = {
	services: {$lookup: {
		from: 'services',
		localField: '_id',
		foreignField: 'specialist',
		as: 'services'
	}},
	rating: {$lookup: {
		from: 'projects',
		let: {specialist: "$_id"},
		as: 'rating',
		pipeline: [
			{$match: {$expr:
				{$and: [
					{$gt: ['$rate', 0]},
					{$eq: ['$specialist', '$$specialist']}
				]}
			}},
			{$group: {
				_id: 'specialist',
				stars: {$sum: '$rate'},
				nr: {$sum: 1}
			}}
		]
	}}
};

api.get('/', API(async (req: Request, res: Response)=> {
	let rv = await User.aggregate([
		{$match: {role: 'spec'}},
		lookup.services,
		lookup.rating
	]);
	res.send(rv.map(spec));
}));
api.get('/:id', API(async (req: Request, res: Response)=> {
	let rv = await User.aggregate([
		{$match: {
			role: 'spec',
			_id: ObjectId(req.params.id)
		}},
		lookup.services,
		lookup.rating,
		{$lookup: {
			from: 'projects',
			let: {specialist: "$_id"},
			as: 'projects',
			pipeline: [
				{$match: {$expr:
					{$and: [
						{$eq: ['$stage', 'val']},
						{$eq: ['$specialist', '$$specialist']}
					]}
				}}
			]
		}}
	]);
	if(!rv.length) {
		res.status(404);
		res.send('No such specialist');
	} else
		res.send(spec(rv[0]));
}));
