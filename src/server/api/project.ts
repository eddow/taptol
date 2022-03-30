import express from 'express';
import {Request, Response, NextFunction} from 'express';
import {Project} from '@/biz/project';
import {Stars, projectHeader} from '@obj/project';
import {auth, API, sanitizer} from '@/lib/api';
import {ObjectId} from '@/lib/mongo';

const sanitize = sanitizer('_id', 'name');

const api = express();
export default api;

const sides = {
	cust: ['customer', 'specialist'],
	spec: ['specialist', 'customer']
};

// List own projects [valid for customer and specialist]
// stage: 'prop' | 'ref' | 'cur' | 'done' | 'val'
api.get('/:stage', auth(['cust', 'spec'], async (req: Request, res: Response)=> {
	let [user, read] = sides[req.credentials.role];
	let filters: any = {stage: req.params.stage};
	filters[user] = req.credentials._id;
	let rv = (await Project.find(filters).populate(read).lean());
	rv.forEach(p=> {
		p[read] = sanitize(p[read]);
	});
	res.send(rv);
}));

// Customer makes a proposal
api.post('/', auth('cust', async (req: Request, res: Response)=> {
	let project = new Project({
		specialist: req.fields.specialist,
		description: req.fields.description,
		customer: req.credentials._id,
		stage: 'prop'
	});
	await project.save();
	res.send(project._id);
}));

// Stage evolution
api.patch('/:id', auth(['cust', 'spec'], async (req: Request, res: Response)=> {
	let [user, read] = sides[req.credentials.role],
		filters: any = {_id: req.params.id},
		actor = {
			cust: ['done'],
			spec: ['prop', 'cur']
		};
	filters[user] = req.credentials._id;
	let project = await Project.findOne(filters);
	if(!project) return res.status(404).send('Project not found');
	if(!actor[req.credentials.role].includes(project.stage))
		return res.status(403).send('Unauthorized');
	switch(project.stage) {
	case 'prop':
		project.stage = req.fields.accepted && 'false'!== req.fields.accepted ? 'cur' : 'ref';
		break;
	case 'cur':
		project.stage = 'done';
		break;
	case 'done':
		if(req.fields.rate) {
			project.stage = 'val';
			project.rate = <Stars>+(<string>req.fields.rate);
			project.review = <string>req.fields.review;
		} else project.stage = 'cur';
		break;
	}
	await project.save();
	res.send('Project reviewed');
}));

// Admin

/**
 * /[side]/[id]
 * side: cust | spec
 * id: customer_id | specialist_id
 */
api.get('/:side/:id', auth('adm', async (req: Request, res: Response)=> {
	let [user, read] = sides[req.params.side];
	let filters: any = {};
	filters[user] = req.params.id;
	res.send(await Project.find(filters).lean());
}));

api.put('/:id', auth('adm', async (req: Request, res: Response)=> {
	let project = await Project.findOne({_id: req.params.id});
	if(!project) return res.status(404).send('Project not found');
	for(let fld of ['description', 'stage', 'review', 'rate', 'specialist', 'customer'])
		if('0'=== req.fields[fld])
			project[fld] = null;
		else if('undefined'!== typeof req.fields[fld])
			project[fld] = req.fields[fld];
	await project.save();
	res.send(project._id);
}));

api.put('/', auth('adm', async (req: Request, res: Response)=> {
	let project = new Project();
	for(let fld of ['description', 'stage', 'review', 'rate', 'specialist', 'customer'])
		if('0'=== req.fields[fld])
			project[fld] = null;
		else if('undefined'!== typeof req.fields[fld])
			project[fld] = req.fields[fld];
	await project.save();
	res.send(project._id);
}));

api.delete('/:id', auth(['adm', 'cust'], async (req: Request, res: Response)=> {
	let filters: any = {_id: req.params.id};
	if('cust'=== req.credentials.role)
		filters.customer = req.credentials._id;
	await Project.deleteOne(filters);
	res.send('Project deleted');
}));

/////////

export function projectsCount(req: Request, res: Response, next: NextFunction) {
	let oldSend = res.send;
	async function addStatus(...args: any[]) {
		try {
			let user = req.credentials && 
				{cust: 'customer', spec: 'specialist'}[req.credentials.role];
			if(user) {
				let filter = {};
				filter[user] = ObjectId(req.credentials._id);
				let prjs = await Project.aggregate([
					{$match: filter},
					{$group: {
						_id: '$stage',
						count: {$sum: 1}
					}}
				]);
				let rv = {};
				for(let prj of prjs) rv[prj._id] = prj.count;
				res.set(projectHeader, JSON.stringify(rv));
			}
			oldSend.apply(res, args);
		} catch(x) {
			// FRP: log the error message in an error log and return a standard "internal error" message
			res.status(500).send(x);
		}
	}
	// No mongoose event for `beforeSend`
	res.send = <any>addStatus;
	
	next();
}