import express from 'express';
import {Request, Response} from 'express';
import {Service} from '@/biz/service';
import {auth, API, sanitizer} from '@/lib/api';

const sanitize = sanitizer('_id', 'name');

const api = express();
export default api;

function filters(req: Request) {
	let rv: any = {_id: req.params.id};
	// 'adm' edit all, 'spec' edit owned
	if('spec'=== req.credentials.role)
		rv.specialist = req.credentials._id;
	return rv;
}
api.get('/', auth('spec', async (req: Request, res: Response)=> {
	res.send(await Service.find({specialist: req.credentials._id}).lean());
}));
api.get('/:id', API(async (req: Request, res: Response)=> {
	let rv = await Service.findOne({_id: req.params.id}).populate('specialist').lean();
	if(!rv) {
		res.status(404);
		res.send('No such service');
	} else {
		rv.specialist = sanitize(rv.specialist);
		res.send(rv);
	}
}));
api.put('/', auth(['adm', 'spec'], async (req: Request, res: Response)=> {
	let service = new Service(req.fields);
	if('spec'=== req.credentials.role) {
		if(service.specialist && service.specialist !== req.credentials._id)
			return res.status(403).send('Invalid specialist');
		service.specialist = req.credentials._id;
	}
	await service.save();
	res.send(service._id);
}));
api.put('/:id', auth(['spec', 'adm'], async (req: Request, res: Response)=> {
	let service = await Service.findOne(filters(req));
	if(!service) return res.status(404).send('Service not found');
	Object.assign(service, req.fields);
	await service.save();
	res.send('Service modified');
}));
api.delete('/:id', auth(['spec', 'adm'], async (req: Request, res: Response)=> {
	await Service.deleteOne(filters(req));
	res.send('Service deleted');
}));